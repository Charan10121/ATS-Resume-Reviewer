# HiringAgent.ai — ATS Resume Review & Rubric Pipeline

> Production-grade resume evaluator and ATS compatibility auditor powered by Google Gemini, modeled directly on HackerRank / InterviewStreet's open-source hiring agent rubric ([interviewstreet/hiring-agent](https://github.com/interviewstreet/hiring-agent)).

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Google GenAI](https://img.shields.io/badge/Google_GenAI-SDK_2.4-orange.svg)](https://ai.google.dev)

---

## Overview

Traditional Applicant Tracking Systems (ATS) reject candidates on shallow keyword matching, while hiring managers look for evidence of execution, scale, and open-source contributions.

**HiringAgent.ai** combines **deterministic scoring rules** and **Google Gemini reasoning** to evaluate resumes against the exact criteria top engineering organizations use to screen candidates:

1. **Open Source Contributions (Max 35 pts):** PRs merged into major external repos (Kubernetes, React, Go, etc.), maintainer status, or verified codebases.
2. **Self Projects (Max 25 pts):** Technical complexity (compilers, distributed systems, consensus protocols) vs. generic tutorial clones.
3. **Production Experience (Max 30 pts):** Measurable scale, throughput (QPS), high availability (99.99%), latency reductions, and business impact.
4. **Technical Skills & Role Fit (Max 10 pts):** Concrete proficiency matching role expectations (Backend, Frontend, Fullstack, AI/ML, DevOps, Systems).
5. **Bonus Points (Up to +20 pts):** Rare high signals (ACM/ICPC, patents, research papers, major conferences, top competitive programming).
6. **Deductions (Up to -20 pts):** Penalties for buzzword stuffing, unquantified bullets, non-standard layouts, or timeline discrepancies.
7. **ATS Parsability Audit:** Evaluates machine readability, contact extraction, and quantified metric density (target: >75%).
8. **Google XYZ Bullet Rewrites:** Automatically rewrites weak resume bullets using Google's formula: *"Accomplished [X] as measured by [Y], by doing [Z]"*.

---

## Features

- **Dual Theme Support:** Seamless toggle between the sleek bold dark theme and a high-contrast light theme optimized for readability and WCAG AA/AAA compliance.
- **Live GitHub Signal Enrichment:** Automatically queries candidate GitHub profiles to substantiate commit velocity, repository quality, and community stars.
- **Multi-Format Ingestion:** Drag-and-drop PDF parsing (native page extraction) or direct Markdown/Plaintext pasting.
- **Preloaded Sample Resumes:** One-click load for Senior OSS Maintainer, Mid-Level Fullstack, and Junior/New Grad profiles.
- **Export Capabilities:** One-click download of the complete evaluation as Markdown (`.md`) or raw structured JSON (`.json`).

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend:** Express.js, TypeScript (`tsx` for dev, `esbuild` for production bundling).
- **AI Engine:** Google Gemini API via `@google/genai` (resilient multi-model fallback across `gemini-3.1-flash-lite`, `gemini-3.8-flash`, and `gemini-flash-latest`).
- **External APIs:** GitHub REST API v3 for developer signal verification.

---

## Getting Started Locally

### Prerequisites

- **Node.js**: Version 18.0.0 or higher (Node 20+ recommended)
- **npm** or **bun** or **yarn**
- **Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hiring-agent-ats.git
cd hiring-agent-ats
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and configure your API key:

```env
# Required: Google Gemini API key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Port (defaults to 3000)
PORT=3000
```

### 4. Run Development Server

```bash
npm run dev
```

The application will start at:
```
http://localhost:3000
```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Express server with Vite middleware using `tsx` |
| `npm run build` | Compiles Vite frontend into `dist/` and bundles `server.ts` into `dist/server.cjs` via `esbuild` |
| `npm start` | Runs the compiled production server (`node dist/server.cjs`) |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run preview` | Previews the Vite production build |
| `npm run clean` | Cleans up build artifacts (`dist/` directory) |

---

## Project Structure

```
├── .env.example           # Documented environment variables template
├── index.html             # HTML entry point with meta tags & fonts
├── package.json           # Dependencies & build scripts
├── server.ts              # Express API server + Gemini integration + Vite middleware
├── tsconfig.json          # TypeScript compiler configuration
├── vite.config.ts         # Vite build configuration with Tailwind v4
└── src/
    ├── main.tsx           # React root mounting App
    ├── App.tsx            # Main application layout & review workflow
    ├── index.css          # Tailwind CSS v4 design system
    ├── types.ts           # TypeScript interfaces for rubric & evaluation
    ├── components/
    │   ├── Header.tsx             # Navigation bar & brand logo
    │   ├── ResumeInput.tsx        # Role selection, PDF dropzone, & sample loader
    │   ├── ScoreOverview.tsx      # Verdict banner, score gauge, & category summary
    │   ├── CategoryBreakdown.tsx  # Detailed scoring cards with evidence
    │   ├── BonusDeductionPanel.tsx# Bonus awards & deduction penalties
    │   ├── AtsCompatibilityAudit.tsx # Machine readability & buzzword checks
    │   ├── BulletOptimizer.tsx    # Google XYZ quantified rewrites
    │   └── RubricModal.tsx        # Official InterviewStreet scoring rubric reference
    └── data/
        ├── roles.ts               # Supported engineering roles & benchmarks
        └── sampleResumes.ts       # Ready-to-test sample resume data
```

---

## Evaluation Rubric Breakdown

The evaluation engine adheres to the following thresholds:

| Total Score | Recommendation | Interpretation |
| :--- | :--- | :--- |
| **85 – 120** | `STRONG_PASS` | Exceeds engineering bar; verified OSS/scale; clear hire recommendation. |
| **70 – 84** | `PASS` | Solid foundation meeting benchmark; recommended for technical interview. |
| **55 – 69** | `LEANING_PASS` | Borderline; meets minimum criteria; benefits from targeted follow-ups. |
| **40 – 54** | `LEANING_REJECT` | Below threshold; lacks measurable scale or independent project signals. |
| **< 40** | `STRONG_REJECT` | Substantial deductions, buzzword stuffing, or unverified claims. |

---

## Self-Hosting Guide (For Personal Use)

If you want to host this application privately for your own personal use, here are the easiest and most cost-effective methods:

### Option A: 1-Click Free / Cheap Cloud PaaS (Recommended)

You can deploy the repository on platforms like **Render**, **Railway**, **Fly.io**, or **Google Cloud Run**:

#### Deploying on Render / Railway
1. Push your repository to GitHub.
2. Sign up on [Render](https://render.com) or [Railway](https://railway.app).
3. Create a **New Web Service** and connect your GitHub repository.
4. Configure the build and start commands:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add Environment Variable:
   - `GEMINI_API_KEY`: *(Your key from [Google AI Studio](https://aistudio.google.com/))*
6. Click **Deploy**. Render/Railway will provide a private HTTPS URL (e.g., `https://my-hiring-agent.onrender.com`).
   - *Cost:* **$0/month** on free tiers, or ~$5/mo if keeping it always-on without sleep.

#### Deploying with Docker on Any Cloud / VPS (Hetzner, DigitalOcean, Home Lab)
If you have a Linux VPS or home server with Docker:

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

Build and run:
```bash
docker build -t hiring-agent .
docker run -d -p 3000:3000 -e GEMINI_API_KEY="your-api-key" --name hiring-agent hiring-agent
```

#### Running in Background via PM2 (On Your Own Server)
If you already have a Linux server with Node.js installed:
```bash
npm install -g pm2
npm install
npm run build
pm2 start dist/server.cjs --name "hiring-agent" --env GEMINI_API_KEY="your-key"
pm2 save
pm2 startup
```

---

## License & Attribution

This project is built using concepts from the open-source [interviewstreet/hiring-agent](https://github.com/interviewstreet/hiring-agent) repository by HackerRank / InterviewStreet.
Distributed under the MIT License.
