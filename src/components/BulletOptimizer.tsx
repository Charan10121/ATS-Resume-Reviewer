import React, { useState } from 'react';
import { Sparkles, ArrowRight, Copy, Check, TrendingUp, Layers } from 'lucide-react';
import { BulletImprovement } from '../types.ts';

interface BulletOptimizerProps {
  bulletImprovements: BulletImprovement[];
}

export const BulletOptimizer: React.FC<BulletOptimizerProps> = ({ bulletImprovements }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!bulletImprovements || bulletImprovements.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm shadow-2xl p-6 sm:p-10 mb-10 text-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40 mb-1">
            Google XYZ Enhancement Framework
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span>High-Impact Bullet Optimizer</span>
          </h3>
          <p className="text-xs text-white/60 uppercase tracking-wider mt-1 font-mono">
            Rewrites weak or generic bullets into: <span className="text-white font-bold">"Accomplished [X] as measured by [Y], by doing [Z]"</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {bulletImprovements.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-none border border-white/15 bg-black/60"
          >
            {/* Category tag & Copy action */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 bg-white/10 text-white font-bold border border-white/10">
                Optimization #{idx + 1} • {item.category || 'Metric Enhancement'}
              </span>
              
              <button
                onClick={() => copyBullet(item.improved, idx)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider bg-white text-black hover:bg-emerald-400 transition-all cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Rewrite</span>
                  </>
                )}
              </button>
            </div>

            {/* Original vs Improved comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="p-4 rounded-none bg-white/[0.02] border border-white/10 border-l-4 border-l-white/20">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1.5">
                  Original Resume Bullet
                </p>
                <p className="text-xs text-white/60 italic leading-relaxed">
                  "{item.original}"
                </p>
              </div>

              {/* Improved */}
              <div className="p-4 rounded-none bg-white/[0.05] border border-emerald-500/40 border-l-4 border-l-emerald-400">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Optimized (Quantified XYZ)</span>
                </div>
                <p className="text-xs font-bold text-white leading-relaxed">
                  {item.improved}
                </p>
              </div>
            </div>

            {/* Impact & metrics explanation */}
            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-xs text-white/70 flex items-start gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px] text-white shrink-0">Impact Added:</span>
              <span className="leading-snug">{item.impactMetricsAdded}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
