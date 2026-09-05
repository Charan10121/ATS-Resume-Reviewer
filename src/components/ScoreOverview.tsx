import React, { useEffect } from 'react';
import { 
  Award, CheckCircle, AlertTriangle, XCircle, Download, Copy, Check, 
  Github, User, Briefcase, Sparkles, TrendingUp, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HiringEvaluation } from '../types.ts';

interface ScoreOverviewProps {
  evaluation: HiringEvaluation;
  onReset: () => void;
  onExportMarkdown: () => void;
  onExportJson: () => void;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  evaluation,
  onReset,
  onExportMarkdown,
  onExportJson,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (evaluation.totalScore >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [evaluation.totalScore]);

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'STRONG_PASS':
        return {
          bg: 'bg-white/5 border-l-4 border-emerald-500 text-white',
          icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
          label: 'STRONG PASS • RECOMMEND HIRE',
          desc: 'Exceeds standard engineering bar with strong OSS & production scale.',
          accent: 'text-emerald-400',
        };
      case 'PASS':
        return {
          bg: 'bg-white/5 border-l-4 border-blue-500 text-white',
          icon: <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />,
          label: 'PASS • TECHNICAL INTERVIEW',
          desc: 'Solid technical foundation meeting benchmark requirements.',
          accent: 'text-blue-400',
        };
      case 'LEANING_PASS':
        return {
          bg: 'bg-white/5 border-l-4 border-amber-500 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          label: 'BORDERLINE • CONDITIONAL REVIEW',
          desc: 'Meets minimum requirements; benefits from deeper project probing.',
          accent: 'text-amber-400',
        };
      case 'LEANING_REJECT':
        return {
          bg: 'bg-white/5 border-l-4 border-orange-500 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />,
          label: 'LEANING REJECT • BELOW THRESHOLD',
          desc: 'Lacks measurable scale, open-source signals, or depth for this level.',
          accent: 'text-orange-400',
        };
      case 'STRONG_REJECT':
      default:
        return {
          bg: 'bg-white/5 border-l-4 border-rose-500 text-white',
          icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          label: 'STRONG REJECT • DO NOT ADVANCE',
          desc: 'Substantial deductions, missing core competencies or buzzword stuffing.',
          accent: 'text-rose-400',
        };
    }
  };

  const badge = getRecommendationBadge(evaluation.recommendation);

  const copySummary = () => {
    const text = `Hiring Agent ATS Evaluation:
Candidate: ${evaluation.candidateInfo.name || 'Candidate'}
Target Role: ${evaluation.role}
Total Score: ${evaluation.totalScore} / 120 (${evaluation.recommendation})
- Open Source: ${evaluation.categories.openSource.score}/${evaluation.categories.openSource.maxScore}
- Self Projects: ${evaluation.categories.selfProjects.score}/${evaluation.categories.selfProjects.maxScore}
- Production Exp: ${evaluation.categories.productionExperience.score}/${evaluation.categories.productionExperience.maxScore}
- Technical Skills: ${evaluation.categories.technicalSkills.score}/${evaluation.categories.technicalSkills.maxScore}
- Bonus Points: +${evaluation.bonusPoints.total}
- Deductions: -${evaluation.deductions.total}
ATS Parsability: ${evaluation.atsAudit.parsabilityScore}%
Verdict: ${evaluation.summaryVerdict}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calcPercentage = (score: number, max: number) => {
    return Math.min(100, Math.max(0, Math.round((score / max) * 100)));
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm shadow-2xl p-6 sm:p-10 mb-10 text-white">
      
      {/* Top action row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              InterviewStreet Rubric Assessment
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
              Candidate Audit
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            {evaluation.candidateInfo.name || 'Evaluated Candidate'}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mt-2 font-mono uppercase">
            <span className="px-2 py-0.5 bg-white text-black font-black text-[10px] tracking-widest">
              {evaluation.role.replace(/_/g, ' ')}
            </span>
            {evaluation.candidateInfo.email && <span>{evaluation.candidateInfo.email}</span>}
            {evaluation.candidateInfo.yearsOfExperienceEstimate !== undefined && (
              <span>• ~{evaluation.candidateInfo.yearsOfExperienceEstimate} YRS EXP</span>
            )}
            {evaluation.candidateInfo.primaryDomain && (
              <span>• DOMAIN: {evaluation.candidateInfo.primaryDomain}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copySummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black tracking-[0.15em] uppercase text-white bg-white/10 hover:bg-white hover:text-black border border-white/20 transition-all rounded-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={onExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold tracking-[0.15em] uppercase text-white/80 bg-white/5 hover:bg-white hover:text-black border border-white/15 transition-all rounded-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>
          <button
            onClick={onExportJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold tracking-[0.15em] uppercase text-white/80 bg-white/5 hover:bg-white hover:text-black border border-white/15 transition-all rounded-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 text-xs font-black tracking-[0.15em] uppercase text-white bg-white/10 hover:bg-white hover:text-black border border-white/20 rounded-sm transition-all"
          >
            New Review
          </button>
        </div>
      </div>

      {/* Main Score Hero with Bold Typography */}
      <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Total Score Meter & Hero Typography */}
        <div className="lg:col-span-5 flex flex-col gap-6 p-6 sm:p-8 bg-black/60 border border-white/15 rounded-sm">
          <div className="space-y-2">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
              Overall ATS Score
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-8xl sm:text-9xl font-black tracking-tighter leading-none italic text-white">
                {evaluation.totalScore}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-white/40 font-mono">
                /120
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider py-2 px-3 border border-white/15 bg-white/5">
            <span className="text-white/60">Rubric Calibration Range</span>
            <span className="font-bold text-white">-20 to 120 PTS</span>
          </div>

          <div className={`p-4 rounded-sm ${badge.bg}`}>
            <div className="flex items-center gap-2">
              {badge.icon}
              <p className="text-sm font-black tracking-wider uppercase">
                {badge.label}
              </p>
            </div>
            <p className="text-xs text-white/70 uppercase tracking-wide mt-1.5 leading-relaxed">
              {badge.desc}
            </p>
          </div>

          {/* Quick Bonus / Deductions Banner */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-white/5 border-l-4 border-emerald-500">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400">Bonus Points</p>
              <p className="text-lg font-black font-mono text-white">+{evaluation.bonusPoints.total} <span className="text-xs text-white/50">PTS</span></p>
            </div>
            <div className="p-3 bg-white/5 border-l-4 border-rose-500">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-rose-400">Deductions</p>
              <p className="text-lg font-black font-mono text-white">-{evaluation.deductions.total} <span className="text-xs text-white/50">PTS</span></p>
            </div>
          </div>

          <div className="p-3 bg-white/5 border-l-4 border-white/30 flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">ATS Parsability</span>
            <span className="text-sm font-black font-mono text-white">{evaluation.atsAudit.parsabilityScore}%</span>
          </div>
        </div>

        {/* Verdict & Category Bars */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-2">
              ATS Evaluator Verdict
            </p>
            <div className="p-5 bg-white/5 border-l-4 border-white text-sm text-white/90 leading-relaxed font-normal">
              {evaluation.summaryVerdict}
            </div>
          </div>

          {/* 4 Core Category breakdown bars with Bold Typography */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/40">
              Scoring Rubric Dimensions
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Open Source */}
              <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02]">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-black uppercase tracking-tight text-white">
                    Open Source
                  </span>
                  <span className="font-mono font-black text-sm text-emerald-400">
                    {evaluation.categories.openSource.score} / {evaluation.categories.openSource.maxScore}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 overflow-hidden mb-2">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-500"
                    style={{ width: `${calcPercentage(evaluation.categories.openSource.score, evaluation.categories.openSource.maxScore)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                  <span className="text-white/70">{evaluation.categories.openSource.rating}</span>
                  <span>Max: 35</span>
                </div>
              </div>

              {/* Self Projects */}
              <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02]">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-black uppercase tracking-tight text-white">
                    Self Projects
                  </span>
                  <span className="font-mono font-black text-sm text-blue-400">
                    {evaluation.categories.selfProjects.score} / {evaluation.categories.selfProjects.maxScore}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 overflow-hidden mb-2">
                  <div
                    className="h-full bg-blue-400 transition-all duration-500"
                    style={{ width: `${calcPercentage(evaluation.categories.selfProjects.score, evaluation.categories.selfProjects.maxScore)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                  <span className="text-white/70">{evaluation.categories.selfProjects.rating}</span>
                  <span>Max: 25</span>
                </div>
              </div>

              {/* Production Experience */}
              <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02]">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-black uppercase tracking-tight text-white">
                    Production Scale
                  </span>
                  <span className="font-mono font-black text-sm text-purple-400">
                    {evaluation.categories.productionExperience.score} / {evaluation.categories.productionExperience.maxScore}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 overflow-hidden mb-2">
                  <div
                    className="h-full bg-purple-400 transition-all duration-500"
                    style={{ width: `${calcPercentage(evaluation.categories.productionExperience.score, evaluation.categories.productionExperience.maxScore)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                  <span className="text-white/70">{evaluation.categories.productionExperience.rating}</span>
                  <span>Max: 30</span>
                </div>
              </div>

              {/* Technical Skills */}
              <div className="p-4 rounded-sm border border-white/10 bg-white/[0.02]">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs font-black uppercase tracking-tight text-white">
                    Stack Alignment
                  </span>
                  <span className="font-mono font-black text-sm text-amber-400">
                    {evaluation.categories.technicalSkills.score} / {evaluation.categories.technicalSkills.maxScore}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 overflow-hidden mb-2">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${calcPercentage(evaluation.categories.technicalSkills.score, evaluation.categories.technicalSkills.maxScore)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                  <span className="text-white/70">{evaluation.categories.technicalSkills.rating}</span>
                  <span>Max: 10</span>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub verification info */}
          {evaluation.githubSignalsUsed && (
            <div className="p-3 bg-white/5 border border-white/15 flex items-center justify-between font-mono text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-white" />
                <span className="font-bold">Verified GitHub: @{evaluation.githubSignalsUsed.username}</span>
              </div>
              <span className="text-white/50">{evaluation.githubSignalsUsed.totalStars} Stars • Live API Synced</span>
            </div>
          )}

          {/* Detected Skills badges */}
          {evaluation.candidateInfo.detectedSkills && evaluation.candidateInfo.detectedSkills.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 mb-2">
                Detected Technologies & Stack
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold uppercase">
                {evaluation.candidateInfo.detectedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white/10 text-white font-mono rounded-none border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
