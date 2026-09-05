import React from 'react';
import { GitPullRequest, ExternalLink, BookOpen, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onShowRubricModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowRubricModal }) => {
  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-8 lg:px-10 border-b border-white/10 bg-[#0A0A0A] text-white sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
          <div className="w-4 h-4 border-2 border-black rotate-45" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black tracking-tighter uppercase text-white">
              HiringAgent.ai
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-0.5 border border-white/20 rounded-full text-white/70">
              Rubric ATS
            </span>
          </div>
          <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/40 hidden md:block">
            interviewstreet/hiring-agent evaluation engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-[0.2em] uppercase">
          <span className="text-white/40 hover:text-white/70 transition-colors cursor-default">Open Source</span>
          <span className="text-white/40 hover:text-white/70 transition-colors cursor-default">Projects</span>
          <span className="text-white">Review</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="view-rubric-btn"
            onClick={onShowRubricModal}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-black tracking-[0.15em] uppercase text-white bg-white/10 hover:bg-white hover:text-black border border-white/20 transition-all rounded-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Rubric</span>
            <span>(-20 to 120)</span>
          </button>

          <a
            href="https://github.com/interviewstreet/hiring-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-[0.15em] uppercase text-white/70 hover:text-white border border-white/15 hover:border-white/40 transition-all rounded-sm"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-white/60" />
            <span className="hidden sm:inline">HackerRank Repo</span>
            <ExternalLink className="w-3 h-3 text-white/40" />
          </a>
        </div>
      </div>
    </header>
  );
};
