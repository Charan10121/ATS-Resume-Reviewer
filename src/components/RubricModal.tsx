import React from 'react';
import { X, GitPullRequest, Laptop, Briefcase, Code, PlusCircle, MinusCircle, Info } from 'lucide-react';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RubricModal: React.FC<RubricModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="bg-[#0A0A0A] border border-white/20 rounded-none w-full max-w-2xl max-h-[88vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400 mb-1">
              InterviewStreet Pipeline Standard
            </p>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>Hiring Agent Evaluation Rubric</span>
              <span className="text-xs px-2.5 py-0.5 bg-white text-black font-black font-mono">
                [-20, +120 PTS]
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4 text-sm">
          {/* Category 1 */}
          <div className="p-4 border border-white/10 bg-white/[0.02] border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between font-black uppercase tracking-wider text-white mb-2">
              <span className="flex items-center gap-2 text-emerald-400 text-xs">
                <GitPullRequest className="w-4 h-4" />
                1. Open Source Contributions
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Max 35 PTS
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              HackerRank's rubric heavily weights verified merged pull requests to external open-source projects.
              Contributors to major repositories (Kubernetes, React, Linux, Go, Python) or active maintainers score highest (28-35). Minor PRs or active personal libraries score 10-27. Inactive forks or 0 OSS score 0-9.
            </p>
          </div>

          {/* Category 2 */}
          <div className="p-4 border border-white/10 bg-white/[0.02] border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between font-black uppercase tracking-wider text-white mb-2">
              <span className="flex items-center gap-2 text-blue-400 text-xs">
                <Laptop className="w-4 h-4" />
                2. Self Projects
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/30">
                Max 25 PTS
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Assesses independent technical capability. High points (20-25) awarded to complex architectures (custom compilers, distributed databases, Raft consensus, live production traffic). Generic tutorial clones (Todo apps, basic CRUD) receive 5-13 pts.
            </p>
          </div>

          {/* Category 3 */}
          <div className="p-4 border border-white/10 bg-white/[0.02] border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between font-black uppercase tracking-wider text-white mb-2">
              <span className="flex items-center gap-2 text-purple-400 text-xs">
                <Briefcase className="w-4 h-4" />
                3. Production Experience
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Max 30 PTS
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Evaluates scale, telemetry, and quantified engineering impact. High throughput (10k+ QPS), 99.99% uptime, distributed databases, cost optimizations, and leadership score 24-30 pts. Passive or unquantified internship experience scores 8-15 pts.
            </p>
          </div>

          {/* Category 4 */}
          <div className="p-4 border border-white/10 bg-white/[0.02] border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between font-black uppercase tracking-wider text-white mb-2">
              <span className="flex items-center gap-2 text-amber-400 text-xs">
                <Code className="w-4 h-4" />
                4. Technical Skills & Fit
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Max 10 PTS
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Demonstrated proficiency in core languages, databases, and tooling directly matching the role requirements. Evaluates actual applied stack usage rather than arbitrary keyword listing.
            </p>
          </div>

          {/* Bonus & Deductions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 border border-white/10 bg-white/[0.02] border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-emerald-400 text-xs mb-1.5">
                <PlusCircle className="w-3.5 h-3.5" />
                Bonus Points (Up to +20)
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Granted for rare high signals: core maintainer of popular OSS, ACM/ICPC finals, top competitive programming rating, patents, published papers, or top conference speaker.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-white/[0.02] border-l-4 border-l-rose-500">
              <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-rose-400 text-xs mb-1.5">
                <MinusCircle className="w-3.5 h-3.5" />
                Deductions (Up to -20)
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Penalties for buzzword stuffing, passive bullets without metrics, timeline discrepancies, or complex non-ATS-friendly styling that degrades parsing.
              </p>
            </div>
          </div>

          {/* Decision Cutoffs */}
          <div className="p-4 bg-white/5 border border-white/10 text-xs">
            <p className="font-black uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-white/50" />
              Recommendation Thresholds:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black">
                85+ <br/><span className="text-[10px] font-sans uppercase font-bold text-white/80">Strong Pass</span>
              </div>
              <div className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black">
                70 - 84 <br/><span className="text-[10px] font-sans uppercase font-bold text-white/80">Pass</span>
              </div>
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black">
                55 - 69 <br/><span className="text-[10px] font-sans uppercase font-bold text-white/80">Borderline</span>
              </div>
              <div className="p-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-black">
                40 - 54 <br/><span className="text-[10px] font-sans uppercase font-bold text-white/80">Leaning No</span>
              </div>
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-black">
                &lt; 40 <br/><span className="text-[10px] font-sans uppercase font-bold text-white/80">Strong Reject</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-white text-black hover:bg-white/90 transition-colors cursor-pointer"
          >
            Close Rubric
          </button>
        </div>
      </div>
    </div>
  );
};
