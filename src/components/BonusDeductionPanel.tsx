import React from 'react';
import { PlusCircle, MinusCircle, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { BonusItem, DeductionItem } from '../types.ts';

interface BonusDeductionPanelProps {
  bonusPoints: {
    total: number;
    items: BonusItem[];
  };
  deductions: {
    total: number;
    items: DeductionItem[];
  };
}

export const BonusDeductionPanel: React.FC<BonusDeductionPanelProps> = ({ bonusPoints, deductions }) => {
  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm shadow-2xl p-6 sm:p-10 mb-10 text-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40 mb-1">
            Rubric Calibration Capped [-20, +20]
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Bonus Points & Deductions
          </h3>
          <p className="text-xs text-white/60 uppercase tracking-wider mt-1 font-mono">
            HackerRank scoring modifies base score with verified elite achievements and ATS red-flag penalties
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bonus Points Column */}
        <div className="p-6 rounded-sm border border-white/15 bg-black/60">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-400">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Bonus Points Awarded</span>
            </div>
            <span className="font-mono text-sm font-black text-black px-3 py-1 bg-emerald-400 rounded-none">
              +{bonusPoints.total} / 20 PTS
            </span>
          </div>

          {bonusPoints.items && bonusPoints.items.length > 0 ? (
            <div className="space-y-4">
              {bonusPoints.items.map((bonus, idx) => (
                <div key={idx} className="p-4 rounded-none bg-white/[0.03] border border-white/10 border-l-4 border-l-emerald-500">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-white mb-2">
                    <span>{bonus.title}</span>
                    <span className="font-mono text-emerald-400 font-black">
                      +{bonus.points} PTS
                    </span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">Evidence: </span>
                    {bonus.evidence}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-none bg-white/[0.02] border border-dashed border-white/20 text-xs font-mono uppercase tracking-wider text-white/40">
              No bonus points awarded. (Eligible for open source maintainership, competitive programming titles, published research, or exceptional high-concurrency systems).
            </div>
          )}
        </div>

        {/* Deductions Column */}
        <div className="p-6 rounded-sm border border-white/15 bg-black/60">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-rose-400">
              <MinusCircle className="w-4 h-4 text-rose-400" />
              <span>ATS Deductions & Penalties</span>
            </div>
            <span className="font-mono text-sm font-black text-white px-3 py-1 bg-rose-600 rounded-none">
              -{deductions.total} / 20 PTS
            </span>
          </div>

          {deductions.items && deductions.items.length > 0 ? (
            <div className="space-y-4">
              {deductions.items.map((deduction, idx) => (
                <div key={idx} className="p-4 rounded-none bg-white/[0.03] border border-white/10 border-l-4 border-l-rose-500">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-rose-300 mb-2">
                    <span>{deduction.issue}</span>
                    <span className="font-mono text-rose-400 font-black">
                      -{deduction.points} PTS
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mb-3 leading-relaxed">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">Detected: </span>
                    {deduction.evidence}
                  </p>
                  <div className="p-3 rounded-none bg-black/80 border border-white/10 text-xs text-white/80 flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      <strong className="font-bold uppercase tracking-wider text-[10px] text-emerald-400">Actionable Remedy: </strong>
                      {deduction.remedy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-none bg-white/[0.02] border border-dashed border-emerald-500/30 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Zero deductions applied! No buzzword stuffing, formatting hazards, or unquantified bullets detected.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
