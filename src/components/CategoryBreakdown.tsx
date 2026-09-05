import React, { useState } from 'react';
import { 
  GitPullRequest, Laptop, Briefcase, Code, CheckCircle2, 
  AlertCircle, ChevronDown, ChevronUp, Quote, Lightbulb 
} from 'lucide-react';
import { CategoryScore } from '../types.ts';

interface CategoryBreakdownProps {
  categories: {
    openSource: CategoryScore;
    selfProjects: CategoryScore;
    productionExperience: CategoryScore;
    technicalSkills: CategoryScore;
  };
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories }) => {
  const [activeTab, setActiveTab] = useState<'openSource' | 'selfProjects' | 'productionExperience' | 'technicalSkills'>('openSource');

  const categoryConfigs = [
    {
      key: 'openSource' as const,
      icon: <GitPullRequest className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      title: 'Open Source Contributions',
      data: categories.openSource,
      accentColor: 'emerald',
      weightNote: 'Highest weight category in HackerRank rubric (35 pts)',
    },
    {
      key: 'selfProjects' as const,
      icon: <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      title: 'Self Projects & Systems',
      data: categories.selfProjects,
      accentColor: 'blue',
      weightNote: 'Evaluates architectural autonomy & non-trivial complexity (25 pts)',
    },
    {
      key: 'productionExperience' as const,
      icon: <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      title: 'Production Experience',
      data: categories.productionExperience,
      accentColor: 'purple',
      weightNote: 'Evaluates scale, QPS, reliability & quantifiable metrics (30 pts)',
    },
    {
      key: 'technicalSkills' as const,
      icon: <Code className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      title: 'Technical Skills & Stack Fit',
      data: categories.technicalSkills,
      accentColor: 'amber',
      weightNote: 'Direct match and depth in required role tech stack (10 pts)',
    },
  ];

  const currentCategory = categoryConfigs.find((c) => c.key === activeTab)!;

  const getRatingBadge = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'exceptional':
        return 'bg-white/10 text-emerald-400 border-emerald-500/50';
      case 'strong':
        return 'bg-white/10 text-blue-400 border-blue-500/50';
      case 'average':
        return 'bg-white/10 text-amber-400 border-amber-500/50';
      case 'weak':
      case 'insufficient':
      default:
        return 'bg-white/10 text-rose-400 border-rose-500/50';
    }
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-sm shadow-2xl p-6 sm:p-10 mb-10 text-white">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 pb-6 border-b border-white/10">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40 mb-1">
            4 Evaluated Dimensions
          </p>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Core Rubric Breakdown
          </h3>
          <p className="text-xs text-white/60 uppercase tracking-wider mt-1 font-mono">
            Detailed scoring evidence, strengths, and missing signals cited directly from candidate materials
          </p>
        </div>
      </div>

      {/* Category selector tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {categoryConfigs.map((cat) => {
          const isSelected = activeTab === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`p-4 rounded-sm border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-white bg-white text-black shadow-lg ring-1 ring-white'
                  : 'border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`flex items-center gap-2 font-black text-xs uppercase tracking-wider truncate ${isSelected ? 'text-black font-black' : 'text-white'}`}>
                  {cat.title.split(' ')[0]}
                </span>
                <span className={`font-mono text-sm font-black ${isSelected ? 'text-black' : 'text-white'}`}>
                  {cat.data.score}/{cat.data.maxScore}
                </span>
              </div>
              <div className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-widest font-mono ${isSelected ? 'text-black/80' : 'text-white/60'}`}>
                <span>{cat.data.rating}</span>
                <span>{Math.round((cat.data.score / cat.data.maxScore) * 100)}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Detail Panel */}
      <div className="p-6 sm:p-8 rounded-sm border border-white/15 bg-black/60">
        
        {/* Header of Active Category */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 border border-white/20 rounded-sm text-white">
              {currentCategory.icon}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h4 className="text-xl font-black uppercase tracking-tight text-white">
                  {currentCategory.title}
                </h4>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-none border font-black uppercase tracking-widest ${getRatingBadge(currentCategory.data.rating)}`}>
                  {currentCategory.data.rating}
                </span>
              </div>
              <p className="text-xs font-mono uppercase tracking-wider text-white/50 mt-0.5">
                {currentCategory.weightNote}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white text-black font-mono text-base font-black tracking-tight rounded-sm">
              {currentCategory.data.score} <span className="text-xs text-black/60 font-bold uppercase">/ {currentCategory.data.maxScore} PTS</span>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="py-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Evaluator Analysis & Rubric Justification
          </p>
          <p className="text-sm text-white/90 leading-relaxed bg-white/5 p-4 rounded-sm border-l-4 border-white font-normal">
            {currentCategory.data.reasoning}
          </p>
        </div>

        {/* 3-column signals breakdown: Evidence, Strengths, Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Evidence Cited */}
          <div className="p-4 rounded-sm bg-white/[0.02] border border-white/10 border-l-4 border-l-white/40">
            <div className="text-xs font-black uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <Quote className="w-3.5 h-3.5 text-white/50" />
              <span>Direct Evidence</span>
            </div>
            {currentCategory.data.evidence && currentCategory.data.evidence.length > 0 ? (
              <ul className="space-y-2">
                {currentCategory.data.evidence.map((item, idx) => (
                  <li key={idx} className="text-xs text-white/70 flex items-start gap-2">
                    <span className="text-white/40 font-mono font-bold">•</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/40 italic">No concrete evidence detected for this category in resume.</p>
            )}
          </div>

          {/* Strengths */}
          <div className="p-4 rounded-sm bg-white/[0.02] border border-white/10 border-l-4 border-l-emerald-500">
            <div className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Key Strengths</span>
            </div>
            {currentCategory.data.strengths && currentCategory.data.strengths.length > 0 ? (
              <ul className="space-y-2">
                {currentCategory.data.strengths.map((item, idx) => (
                  <li key={idx} className="text-xs text-white/80 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/40 italic">Limited standout strengths found.</p>
            )}
          </div>

          {/* Missing Signals / Gaps */}
          <div className="p-4 rounded-sm bg-white/[0.02] border border-white/10 border-l-4 border-l-amber-500">
            <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Missing Signals & Gaps</span>
            </div>
            {currentCategory.data.gaps && currentCategory.data.gaps.length > 0 ? (
              <ul className="space-y-2">
                {currentCategory.data.gaps.map((item, idx) => (
                  <li key={idx} className="text-xs text-white/80 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">!</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">No significant gaps detected!</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
