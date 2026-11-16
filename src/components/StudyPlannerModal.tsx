import React, { useState } from 'react';
import {
  X,
  Clock,
  Calendar,
  Flame,
  BookOpen,
  Code2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Zap,
  Coffee,
  BrainCircuit
} from 'lucide-react';

interface StudyPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalDays: number;
  completedDaysCount: number;
}

export const StudyPlannerModal: React.FC<StudyPlannerModalProps> = ({
  isOpen,
  onClose,
  totalDays,
  completedDaysCount,
}) => {
  const [dailyHours, setDailyHours] = useState<number>(3.0);

  if (!isOpen) return null;

  // Demo Days 1-3 take ~8 hours total (full 14-day track ~40h)
  const totalRequiredHours = totalDays <= 3 ? 8 : 40;
  const remainingHours = Math.max(0, Math.round(totalRequiredHours * (1 - Math.min(1, completedDaysCount / totalDays))));
  const daysNeeded = Math.max(1, Math.ceil(remainingHours / dailyHours));

  const calculateTargetDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + daysNeeded);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const theoryMins = Math.round(dailyHours * 60 * 0.28);
  const codingMins = Math.round(dailyHours * 60 * 0.40);
  const questionsMins = Math.round(dailyHours * 60 * 0.22);
  const reviewMins = Math.round(dailyHours * 60 * 0.10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Clock className="w-4 h-4" />
              <span>How Much Time Should You Invest Each Day?</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Senior Interview Study Pace Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Demo Edition unlocks Days 1–3 (~8 hours total). Adjust your daily time budget to plan your completion date and optimal session breakdown.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => setDailyHours(3.0)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              dailyHours === 3.0
                ? 'bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/30'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
              <span>Intensive Sprint</span>
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white">2.5 – 3.5h / day</div>
            <div className="text-xs text-slate-400 mt-1">Demo pace: <strong>3 days</strong></div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Recommended when focusing full-time before an interview loop. Complete 1 full module per day.
            </p>
          </div>

          <div
            onClick={() => setDailyHours(1.5)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              dailyHours === 1.5
                ? 'bg-sky-950/30 border-sky-500/50 ring-1 ring-sky-500/30'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-sky-400 mb-1">
              <span>Balanced Mode</span>
              <Coffee className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-lg font-bold text-white">1.5h / day</div>
            <div className="text-xs text-slate-400 mt-1">Demo pace: <strong>5–6 days</strong></div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Ideal alongside a full-time role: 45 min morning theory + 45 min evening lab practice.
            </p>
          </div>

          <div
            onClick={() => setDailyHours(1.0)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              dailyHours === 1.0
                ? 'bg-purple-950/30 border-purple-500/50 ring-1 ring-purple-500/30'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-purple-400 mb-1">
              <span>Steady Habit</span>
              <BrainCircuit className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white">1.0h / day</div>
            <div className="text-xs text-slate-400 mt-1">Demo pace: <strong>~8 days</strong></div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Steady deep retention and deliberate practice without burnout.
            </p>
          </div>
        </div>

        {/* Interactive Slider & Projection */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-slate-400">Your daily study commitment:</span>
              <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">
                {dailyHours} {dailyHours === 1 ? 'hour' : 'hours'} / day
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400">Estimated Demo completion:</span>
              <div className="text-base font-bold text-white flex items-center gap-1.5 sm:justify-end">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{calculateTargetDate()} ({daysNeeded} {daysNeeded === 1 ? 'day' : 'days'})</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>30 min/day</span>
              <span>1.5h</span>
              <span>3.0h (Recommended)</span>
              <span>5.0h/day</span>
            </div>
          </div>
        </div>

        {/* Daily Time Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Recommended Session Split ({Math.round(dailyHours * 60)} minutes):</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  1. Architecture &amp; Deep Theory
                </span>
                <span className="font-mono font-bold text-sky-400 tabular-nums">{theoryMins} min</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Master Node.js &lt;-&gt; CDP/WebSocket internals, BrowserContext isolation, Actionability checks, and Shadow DOM piercing.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  2. Hands-on Live Coding Lab
                </span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">{codingMins} min</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Refactor brittle XPath locators, automate tables + Shadow DOM + iframes, and solve `expect.poll` exercises against the local sandbox.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  3. Interview Q&amp;A &amp; Flashcards
                </span>
                <span className="font-mono font-bold text-purple-400 tabular-nums">{questionsMins} min</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Practice 2–3 questions daily, spot Recruiter Traps, and rehearse crisp Senior-level explanations out loud.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  4. Review &amp; Retention
                </span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">{reviewMins} min</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Check off mastered topics, review CLI commands in the Cheatsheet, and spend 5 minutes practicing Think Aloud explanations.
              </p>
            </div>
          </div>
        </div>

        {/* Senior Recommendations */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed">
          <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-emerald-300">Golden Rule for Senior Candidates:</div>
            <p className="text-slate-300">
              Do not memorize API signatures by rote. Interviewers evaluate <strong>engineering judgment</strong>: why <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">BrowserContext</code> isolates state in 2ms, how actionability checks prevent dead clicks, and why <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded">expect.poll</code> outperforms manual sleep loops.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            Got It, Back to Studying
          </button>
        </div>
      </div>
    </div>
  );
};
