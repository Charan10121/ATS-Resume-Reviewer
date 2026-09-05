import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { ResumeInput } from './components/ResumeInput.tsx';
import { ScoreOverview } from './components/ScoreOverview.tsx';
import { CategoryBreakdown } from './components/CategoryBreakdown.tsx';
import { BonusDeductionPanel } from './components/BonusDeductionPanel.tsx';
import { AtsCompatibilityAudit } from './components/AtsCompatibilityAudit.tsx';
import { BulletOptimizer } from './components/BulletOptimizer.tsx';
import { RubricModal } from './components/RubricModal.tsx';
import { HiringEvaluation } from './types.ts';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [evaluation, setEvaluation] = useState<HiringEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [isRubricModalOpen, setIsRubricModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (payload: {
    resumeText: string;
    pdfBase64?: string;
    targetRole: string;
    customJobDescription?: string;
    githubUser?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep('Parsing resume & extracting sections...');

    // Progress stage simulation for rich user feedback
    const timer1 = setTimeout(() => {
      setLoadingStep('Fetching and verifying GitHub signals...');
    }, 1800);

    const timer2 = setTimeout(() => {
      setLoadingStep('Scoring rubric: OSS, Projects, Production, Tech Skills...');
    }, 3800);

    const timer3 = setTimeout(() => {
      setLoadingStep('Compiling ATS audit and Google XYZ bullet rewrites...');
    }, 6000);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error (${response.status})`);
      }

      const data: HiringEvaluation = await response.json();
      setEvaluation(data);

      // Smooth scroll to top of report
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setErrorMessage(err.message || 'Failed to complete resume review. Please check inputs and try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setEvaluation(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportMarkdown = () => {
    if (!evaluation) return;

    const md = `# ATS Resume Evaluation Report: ${evaluation.candidateInfo.name || 'Candidate'}
**Target Role:** ${evaluation.role}
**Total Score:** ${evaluation.totalScore} / 120 (${evaluation.recommendation})
**ATS Parsability:** ${evaluation.atsAudit.parsabilityScore}%
**Date Evaluated:** ${new Date().toLocaleDateString()}

---

## Verdict Summary
${evaluation.summaryVerdict}

---

## Rubric Categories Breakdown
1. **Open Source Contributions:** ${evaluation.categories.openSource.score} / ${evaluation.categories.openSource.maxScore} (${evaluation.categories.openSource.rating})
   - *Reasoning:* ${evaluation.categories.openSource.reasoning}
   - *Evidence:* ${evaluation.categories.openSource.evidence.join('; ')}

2. **Self Projects:** ${evaluation.categories.selfProjects.score} / ${evaluation.categories.selfProjects.maxScore} (${evaluation.categories.selfProjects.rating})
   - *Reasoning:* ${evaluation.categories.selfProjects.reasoning}
   - *Evidence:* ${evaluation.categories.selfProjects.evidence.join('; ')}

3. **Production Experience:** ${evaluation.categories.productionExperience.score} / ${evaluation.categories.productionExperience.maxScore} (${evaluation.categories.productionExperience.rating})
   - *Reasoning:* ${evaluation.categories.productionExperience.reasoning}
   - *Evidence:* ${evaluation.categories.productionExperience.evidence.join('; ')}

4. **Technical Skills:** ${evaluation.categories.technicalSkills.score} / ${evaluation.categories.technicalSkills.maxScore} (${evaluation.categories.technicalSkills.rating})
   - *Reasoning:* ${evaluation.categories.technicalSkills.reasoning}
   - *Evidence:* ${evaluation.categories.technicalSkills.evidence.join('; ')}

---

## Bonus Points (+${evaluation.bonusPoints.total})
${evaluation.bonusPoints.items.map(b => `- **+${b.points} pts - ${b.title}:** ${b.evidence}`).join('\n') || '- None awarded'}

## Deductions (-${evaluation.deductions.total})
${evaluation.deductions.items.map(d => `- **-${d.points} pts - ${d.issue}:** ${d.evidence} (Fix: ${d.remedy})`).join('\n') || '- None applied'}

---

## High-Impact Bullet Rewrites (Google XYZ Formula)
${evaluation.bulletImprovements.map((b, i) => `### ${i+1}. ${b.category}
- **Original:** "${b.original}"
- **Optimized:** "${b.improved}"
- **Impact Added:** ${b.impactMetricsAdded}
`).join('\n')}

---
*Generated by Hiring Agent ATS Reviewer (based on interviewstreet/hiring-agent)*
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ats-evaluation-${(evaluation.candidateInfo.name || 'candidate').toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!evaluation) return;
    const jsonStr = JSON.stringify(evaluation, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ats-evaluation-${(evaluation.candidateInfo.name || 'candidate').toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      <Header onShowRubricModal={() => setIsRubricModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* If no evaluation yet, show welcome & input section */}
        {!evaluation ? (
          <div>
            {/* Context banner with Bold Typography */}
            <div className="mb-8 p-6 sm:p-10 bg-[#111111] border border-white/10 rounded-sm">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400">
                      HackerRank Scoring Model
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
                      Rubric Scale -20 to 120
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none text-white">
                    Resume Review<br />& ATS Pipeline
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-3 max-w-3xl leading-relaxed font-normal">
                    Direct translation of <code className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded-sm">interviewstreet/hiring-agent</code>.
                    Evaluates Open Source Contributions (max 35), Self Projects (max 25), Production Experience (max 30), and Technical Skills (max 10) with verified bonus points and ATS deduction penalties.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <div className="px-4 py-3 bg-white/5 border border-white/15 rounded-sm">
                    <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/40">Evaluation</p>
                    <p className="text-sm font-black tracking-tight uppercase text-white">Deterministic + AI</p>
                  </div>
                  <div className="px-4 py-3 bg-white text-black rounded-sm">
                    <p className="text-[9px] font-black tracking-[0.25em] uppercase text-black/60">Pass Cutoff</p>
                    <p className="text-sm font-black tracking-tight uppercase text-black">≥ 60 / 120 PTS</p>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-8 p-4 bg-white/5 border-l-4 border-rose-500 text-white text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="font-bold">{errorMessage}</span>
              </div>
            )}

            <ResumeInput
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              loadingStep={loadingStep}
            />
          </div>
        ) : (
          /* Report View */
          <div>
            <ScoreOverview
              evaluation={evaluation}
              onReset={handleReset}
              onExportMarkdown={handleExportMarkdown}
              onExportJson={handleExportJson}
            />

            <CategoryBreakdown categories={evaluation.categories} />

            <BonusDeductionPanel
              bonusPoints={evaluation.bonusPoints}
              deductions={evaluation.deductions}
            />

            <AtsCompatibilityAudit atsAudit={evaluation.atsAudit} />

            <BulletOptimizer bulletImprovements={evaluation.bulletImprovements} />

            {/* Bottom Floating/Fixed Action Bar */}
            <div className="sticky bottom-4 z-30 p-4 rounded-sm bg-[#0A0A0A]/95 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">Evaluation Target</span>
                <span className="text-sm font-black tracking-tight uppercase text-white">
                  {evaluation.role.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-mono font-black text-emerald-400">
                  {evaluation.totalScore} / 120 PTS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportMarkdown}
                  className="px-4 py-2.5 text-xs font-bold tracking-[0.15em] uppercase rounded-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                >
                  Export Report (.md)
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 text-xs font-black tracking-[0.2em] uppercase rounded-sm bg-white text-black hover:invert transition-all"
                >
                  Review Another Resume
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <RubricModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
      />

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        <p className="tracking-wide">
          Hiring Agent ATS Reviewer • Based on HackerRank / InterviewStreet's open-source hiring pipeline rubric (<a href="https://github.com/interviewstreet/hiring-agent" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">interviewstreet/hiring-agent</a>)
        </p>
      </footer>
    </div>
  );
}
