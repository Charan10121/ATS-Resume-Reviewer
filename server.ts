import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit to handle PDF base64 uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Hiring Agent ATS Evaluator" });
});

// Lazy Gemini client helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Resilient generation helper with fallback models and retry on 503/429
async function generateEvaluationWithRetry(ai: GoogleGenAI, parts: any[], config: any) {
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: parts,
          config,
        });
        if (response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt ${attempt} warning:`, err.message || err);
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
  }
  throw lastError || new Error("Failed to generate evaluation response.");
}

// Helper to fetch public GitHub profile and repos (signals enrichment)
async function fetchGitHubSignals(rawUsername: string) {
  if (!rawUsername) return null;
  const username = rawUsername.replace(/^https?:\/\/github\.com\//, "").replace(/\/.*$/, "").trim();
  if (!username) return null;

  try {
    const headers = {
      "User-Agent": "HiringAgent-ATS-Reviewer",
      Accept: "application/vnd.github.v3+json",
    };

    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
    if (!userRes.ok) return null;
    const userData = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=15`, { headers });
    let reposData: any[] = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    const repoSummaries = (Array.isArray(reposData) ? reposData : []).map((repo: any) => ({
      name: repo.name,
      description: repo.description || "",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      isFork: repo.fork || false,
      language: repo.language || "Unknown",
      updatedAt: repo.pushed_at || repo.updated_at,
    }));

    const totalStars = repoSummaries.reduce((sum, r) => sum + r.stars, 0);
    const languages = Array.from(new Set(repoSummaries.map((r) => r.language).filter((l) => l && l !== "Unknown")));

    return {
      username: userData.login,
      name: userData.name || userData.login,
      bio: userData.bio || "",
      publicReposCount: userData.public_repos || repoSummaries.length,
      followers: userData.followers || 0,
      totalStars,
      topLanguages: languages.slice(0, 5),
      repos: repoSummaries.slice(0, 8),
    };
  } catch (err) {
    console.warn("GitHub signal fetch failed for", username, err);
    return null;
  }
}

// GitHub Enrichment API
app.get("/api/github-enrichment/:username", async (req, res) => {
  try {
    const signals = await fetchGitHubSignals(req.params.username);
    if (!signals) {
      return res.status(404).json({ error: "Could not fetch GitHub profile or user does not exist." });
    }
    return res.json(signals);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch GitHub profile." });
  }
});

// ATS Resume Evaluation Endpoint
app.post("/api/evaluate", async (req, res) => {
  try {
    const { resumeText, pdfBase64, targetRole, customJobDescription, githubUser } = req.body;

    if (!resumeText && !pdfBase64) {
      return res.status(400).json({ error: "Please provide either resume text or an uploaded PDF resume." });
    }

    const ai = getGeminiClient();

    // 1. Fetch GitHub signals if handle provided
    let githubSignals = null;
    if (githubUser) {
      githubSignals = await fetchGitHubSignals(githubUser);
    }

    // 2. Build system rubric instructions inspired by interviewstreet/hiring-agent
    const systemPrompt = `You are the InterviewStreet / HackerRank "Hiring Agent" Automated ATS & Resume Evaluator.
Your mission is to perform a rigorous, objective, and transparent evaluation of a candidate's resume against HackerRank's open-source hiring pipeline rubric.

SCORING SCHEMA (Total range: -20 to 120 points):
1. Open Source Contributions (0 to 35 points):
   - 28-35: Significant contributions or maintainer of prominent open-source projects (e.g. Kubernetes, React, Linux, or widely used library with 1,000+ stars).
   - 18-27: Meaningful non-trivial PRs, bug fixes, or features merged in recognized external repos.
   - 10-17: Active personal open-source projects with real external users/stars, or minor contributions.
   - 0-9: No open source activity, or only trivial README/forks with 0 merged PRs.
   * Note: The HackerRank rubric prioritizes merged PRs to external open-source repositories over simple personal repo commits.

2. Self Projects (0 to 25 points):
   - 20-25: High-complexity, production-deployed systems with live traffic, non-trivial architecture (e.g. custom compiler, distributed storage, custom database engine, high concurrency, Raft consensus).
   - 14-19: Well-architected full-stack applications with live demos, tests, clean documentation, CI/CD.
   - 6-13: Standard tutorial clones (e.g. basic ToDo app, generic ecommerce clone, standard CRUD).
   - 0-5: Superficial or incomplete projects without working demos or code evidence.

3. Production Experience (0 to 30 points):
   - 24-30: Proven ownership of high-scale systems (millions of users, 10k+ QPS, sub-50ms latency, zero-downtime migrations, distributed consensus, production on-call).
   - 16-23: Strong industry engineering experience with measurable business impact, quantified metrics (e.g. reduced load times by 35%, saved $40k/yr).
   - 8-15: Moderate engineering experience or internships with limited scope or low quantifiable impact.
   - 0-7: Academic-only background or no direct production experience.

4. Technical Skills (0 to 10 points):
   - 8-10: Deep, demonstrated expertise in core technologies directly relevant to the target role (${targetRole || 'general software engineer'}).
   - 5-7: Broad competence in modern frameworks and tooling.
   - 0-4: Shallow list of buzzwords without demonstration in projects or experience.

5. Bonus Points (+0 to +20 points max):
   - Awarded ONLY for verified high-value achievements (e.g. major open source maintainer, top competitive programmer rating, patents, published academic research, extraordinary scale, recognized speaker). Each bonus MUST cite exact proof.

6. Deductions (-0 to -20 points):
   - Penalties for ATS red flags:
     * Buzzword stuffing (listing dozens of technologies not backed by work): -3 to -8 pts
     * Vague bullets lacking quantifiable outcomes or metrics: -3 to -6 pts
     * Unverifiable or inconsistent timeline claims: -4 to -8 pts
     * Formatting hazards for ATS (tables, unparsable columns): -2 to -4 pts

7. Recommendation Thresholds:
   - Total Score >= 85: STRONG_PASS
   - Total Score 70 - 84: PASS
   - Total Score 55 - 69: LEANING_PASS
   - Total Score 40 - 54: LEANING_REJECT
   - Total Score < 40: STRONG_REJECT

8. Line-by-Line Bullet Optimization:
   - Identify 3 to 5 weakest or most generic bullets from the resume.
   - Rewrite them using the Google "Accomplished [X] as measured by [Y], by doing [Z]" formula.
   - Specify the exact metrics and impact added.

9. ATS Parsability Audit:
   - Parsability score (0-100)
   - Specific findings regarding contact info, headings, section order, file structure, and buzzwords.
`;

    const userPromptText = `EVALUATE THIS RESUME:

Target Role: ${targetRole || "Software Engineer"}
${customJobDescription ? `Custom Job Description / Requirements:\n${customJobDescription}\n` : ""}

${
  githubSignals
    ? `CANDIDATE'S GITHUB SIGNALS ENRICHMENT:
- Username: ${githubSignals.username} (${githubSignals.name})
- Bio: ${githubSignals.bio}
- Public Repos: ${githubSignals.publicReposCount}
- Total Stargazers: ${githubSignals.totalStars}
- Top Languages: ${githubSignals.topLanguages.join(", ")}
- Recent/Top Repos: ${JSON.stringify(githubSignals.repos)}
`
    : "No GitHub profile provided or available."
}

${resumeText ? `RESUME TEXT:\n${resumeText}\n` : "Resume file provided as PDF attachment below."}

Please output the complete evaluation matching the exact JSON schema requested.`;

    const parts: any[] = [];
    if (pdfBase64) {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: cleanBase64,
        },
      });
    }
    parts.push({ text: userPromptText });

    const config = {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          candidateInfo: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              github: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              yearsOfExperienceEstimate: { type: Type.NUMBER },
              primaryDomain: { type: Type.STRING },
              detectedSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["name", "detectedSkills"],
          },
          role: { type: Type.STRING },
          totalScore: { type: Type.NUMBER, description: "Total score from -20 to 120" },
          scorePercentage: { type: Type.NUMBER, description: "Normalized 0-100 percentage" },
          recommendation: {
            type: Type.STRING,
            description: "STRONG_PASS, PASS, LEANING_PASS, LEANING_REJECT, or STRONG_REJECT",
          },
          summaryVerdict: { type: Type.STRING },
          categories: {
            type: Type.OBJECT,
            properties: {
              openSource: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER, description: "Score out of 35" },
                  maxScore: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reasoning: { type: Type.STRING },
                },
                required: ["score", "maxScore", "label", "rating", "evidence", "strengths", "gaps", "reasoning"],
              },
              selfProjects: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER, description: "Score out of 25" },
                  maxScore: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reasoning: { type: Type.STRING },
                },
                required: ["score", "maxScore", "label", "rating", "evidence", "strengths", "gaps", "reasoning"],
              },
              productionExperience: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER, description: "Score out of 30" },
                  maxScore: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reasoning: { type: Type.STRING },
                },
                required: ["score", "maxScore", "label", "rating", "evidence", "strengths", "gaps", "reasoning"],
              },
              technicalSkills: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER, description: "Score out of 10" },
                  maxScore: { type: Type.NUMBER },
                  label: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  evidence: { type: Type.ARRAY, items: { type: Type.STRING } },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  reasoning: { type: Type.STRING },
                },
                required: ["score", "maxScore", "label", "rating", "evidence", "strengths", "gaps", "reasoning"],
              },
            },
            required: ["openSource", "selfProjects", "productionExperience", "technicalSkills"],
          },
          bonusPoints: {
            type: Type.OBJECT,
            properties: {
              total: { type: Type.NUMBER, description: "Total bonus points 0 to 20" },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    points: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                  },
                  required: ["points", "title", "evidence"],
                },
              },
            },
            required: ["total", "items"],
          },
          deductions: {
            type: Type.OBJECT,
            properties: {
              total: { type: Type.NUMBER, description: "Total deduction points 0 to 20" },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    points: { type: Type.NUMBER },
                    issue: { type: Type.STRING },
                    evidence: { type: Type.STRING },
                    remedy: { type: Type.STRING },
                  },
                  required: ["points", "issue", "evidence", "remedy"],
                },
              },
            },
            required: ["total", "items"],
          },
          atsAudit: {
            type: Type.OBJECT,
            properties: {
              parsabilityScore: { type: Type.NUMBER },
              findings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    criterion: { type: Type.STRING },
                    status: { type: Type.STRING, description: "pass, warning, or fail" },
                    feedback: { type: Type.STRING },
                  },
                  required: ["criterion", "status", "feedback"],
                },
              },
              detectedBuzzwords: { type: Type.ARRAY, items: { type: Type.STRING } },
              quantificationPercentage: { type: Type.NUMBER },
            },
            required: ["parsabilityScore", "findings", "detectedBuzzwords", "quantificationPercentage"],
          },
          bulletImprovements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                improved: { type: Type.STRING },
                impactMetricsAdded: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ["original", "improved", "impactMetricsAdded", "category"],
            },
          },
        },
        required: [
          "candidateInfo",
          "role",
          "totalScore",
          "scorePercentage",
          "recommendation",
          "summaryVerdict",
          "categories",
          "bonusPoints",
          "deductions",
          "atsAudit",
          "bulletImprovements",
        ],
      },
    };

    const response = await generateEvaluationWithRetry(ai, parts, config);

    const outputText = response.text;
    if (!outputText) {
      throw new Error("No evaluation generated by the AI model.");
    }

    const evaluationData = JSON.parse(outputText);

    if (githubSignals) {
      evaluationData.githubSignalsUsed = {
        username: githubSignals.username,
        publicReposCount: githubSignals.publicReposCount,
        totalStars: githubSignals.totalStars,
        topLanguages: githubSignals.topLanguages,
        openSourceSignalsFound: githubSignals.publicReposCount > 0,
      };
    }

    return res.json(evaluationData);
  } catch (error: any) {
    console.error("Evaluation error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while evaluating the resume.",
    });
  }
});

// Production & Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hiring Agent ATS Server running on port ${PORT}`);
  });
}

startServer();
