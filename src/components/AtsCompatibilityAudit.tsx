import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, FileSearch, Hash, BarChart3 } from 'lucide-react';
import { AtsAuditItem } from '../types.ts';

interface AtsCompatibilityAuditProps {
  atsAudit: {
    parsabilityScore: number;
    findings: AtsAuditItem[];
    detectedBuzzwords: string[];
    quantificationPercentage: number;
  };
}

export const AtsCompatibilityAudit: React.FC<AtsCompatibilityAuditProps> = ({ atsAudit }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'fail':
      default:
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-emerald-400/10 text-emerald-400 border-emerald-500/40';
      case 'warning':
        return 'bg-amber-400/10 text-amber-400 border-amber-500/40';
      case 'fail':
      default:
        return 'bg-rose-400/10 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm shadow-2xl p-6 sm:p-10 mb-10 text-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40 mb-1">
            Machine Readability Audit
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>ATS Parsability & Format</span>
          </h3>
          <p className="text-xs text-white/60 uppercase tracking-wider mt-1 font-mono">
            Evaluates how applicant tracking systems parse contact info, headings, keywords, and metric density
          </p>
        </div>
      </div>

      {/* Top metric overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        
        {/* Parsability Score */}
        <div className="p-6 rounded-sm border border-white/15 bg-black/60">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-2">
            ATS Parsability
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black font-mono text-white italic tracking-tight">
              {atsAudit.parsabilityScore}%
            </span>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">
              {atsAudit.parsabilityScore >= 80 ? 'Optimal' : atsAudit.parsabilityScore >= 60 ? 'Moderate' : 'Needs Fix'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                atsAudit.parsabilityScore >= 80 ? 'bg-emerald-400' : atsAudit.parsabilityScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${atsAudit.parsabilityScore}%` }}
            />
          </div>
        </div>

        {/* Metric Quantification Ratio */}
        <div className="p-6 rounded-sm border border-white/15 bg-black/60">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-2 flex items-center gap-1.5">
            <span>Quantified Metrics Ratio</span>
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black font-mono text-white italic tracking-tight">
              {atsAudit.quantificationPercentage}%
            </span>
            <span className="text-xs text-white/50 font-mono">
              TARGET: &gt;75%
            </span>
          </div>
          <p className="text-[11px] text-white/50 uppercase tracking-wider mt-2 font-mono">
            Bullet points containing concrete numerical impact
          </p>
        </div>

        {/* Buzzwords Alert */}
        <div className="p-6 rounded-sm border border-white/15 bg-black/60">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/40 mb-2 flex items-center gap-1.5">
            <span>Stuffed Buzzwords</span>
          </p>
          <div className="text-5xl font-black font-mono text-white italic tracking-tight">
            {atsAudit.detectedBuzzwords ? atsAudit.detectedBuzzwords.length : 0}
          </div>
          <p className="text-[11px] text-white/50 mt-2 font-mono uppercase tracking-wider truncate">
            {atsAudit.detectedBuzzwords && atsAudit.detectedBuzzwords.length > 0
              ? atsAudit.detectedBuzzwords.slice(0, 3).join(', ')
              : 'Clean keyword density'}
          </p>
        </div>

      </div>

      {/* Buzzword chip list if present */}
      {atsAudit.detectedBuzzwords && atsAudit.detectedBuzzwords.length > 0 && (
        <div className="mb-8 p-5 rounded-none border border-amber-500/40 bg-white/[0.02] border-l-4 border-l-amber-500">
          <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2">
            Potential Buzzwords or Unsubstantiated Keywords:
          </div>
          <div className="flex flex-wrap gap-2">
            {atsAudit.detectedBuzzwords.map((bw, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono uppercase font-bold"
              >
                {bw}
              </span>
            ))}
          </div>
          <p className="text-xs text-white/60 mt-3 font-mono">
            TIP: Replace abstract buzzwords with concrete tool names, production architectures, or measurable throughput.
          </p>
        </div>
      )}

      {/* Checklist of Findings */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-3">
          Parser Checklist Audit
        </p>
        {atsAudit.findings && atsAudit.findings.map((finding, idx) => (
          <div
            key={idx}
            className="p-4 rounded-none bg-white/[0.02] border border-white/10 flex items-start justify-between gap-4 text-xs"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getStatusIcon(finding.status)}
              </div>
              <div>
                <span className="font-black uppercase tracking-wider text-white">
                  {finding.criterion}:
                </span>{' '}
                <span className="text-white/70 leading-relaxed">
                  {finding.feedback}
                </span>
              </div>
            </div>

            <span className={`text-[10px] font-black px-2.5 py-0.5 border shrink-0 uppercase tracking-widest font-mono ${getStatusBadge(finding.status)}`}>
              {finding.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
