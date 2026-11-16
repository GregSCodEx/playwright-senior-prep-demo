import React from 'react';
import { Code2, Terminal, Flame, Clock } from 'lucide-react';

interface NavbarProps {
  activeTab: 'roadmap' | 'questions' | 'coding' | 'mock' | 'cheatsheet';
  setActiveTab: (tab: 'roadmap' | 'questions' | 'coding' | 'mock' | 'cheatsheet') => void;
  masteredCount: number;
  totalQuestions: number;
  completedDaysCount: number;
  unlockedDaysCount: number;
  totalDays: number;
  onOpenMock: () => void;
  onOpenPlanner?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  masteredCount,
  totalQuestions,
  completedDaysCount,
  unlockedDaysCount,
  totalDays,
  onOpenMock,
  onOpenPlanner,
}) => {
  const safeDaysRatio = unlockedDaysCount > 0 ? Math.min(1, completedDaysCount / unlockedDaysCount) : 0;
  const safeQuestionsRatio = totalQuestions > 0 ? Math.min(1, masteredCount / totalQuestions) : 0;
  const readinessPercent = Math.round((safeDaysRatio * 0.4 + safeQuestionsRatio * 0.6) * 100);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                  Playwright<span className="text-emerald-400">Senior</span>Prep
                </span>
                <span className="hidden sm:inline text-xs text-amber-400 font-semibold ml-2">
                  Demo (Days 1–3)
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Questions ({masteredCount}/{totalQuestions})
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'coding'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Live Coding Lab
            </button>
            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'cheatsheet'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Cheatsheet
            </button>
          </nav>

          {/* Zone 3: Primary Action & Quick Metric */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo {completedDaysCount}/{unlockedDaysCount} (of {totalDays})</span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="tabular-nums font-semibold text-slate-200">{readinessPercent}%</span>
              <span>ready</span>
            </div>

            {onOpenPlanner && (
              <button
                onClick={onOpenPlanner}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Calculate your daily study schedule"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Study Time</span>
              </button>
            )}

            <button
              onClick={onOpenMock}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Mock Interview</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-2 py-1 rounded ${activeTab === 'roadmap' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-2 py-1 rounded ${activeTab === 'questions' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab('coding')}
            className={`px-2 py-1 rounded ${activeTab === 'coding' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            Live Lab
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-2 py-1 rounded ${activeTab === 'cheatsheet' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
          >
            Cheatsheet
          </button>
        </div>
      </div>
    </header>
  );
};
