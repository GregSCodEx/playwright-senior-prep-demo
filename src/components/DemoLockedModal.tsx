import React from 'react';
import { DayPlan } from '../types';
import { Lock, X, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface DemoLockedModalProps {
  day: DayPlan | null;
  onClose: () => void;
  onSelectAvailableDay: (dayNumber: number) => void;
}

export const DemoLockedModal: React.FC<DemoLockedModalProps> = ({
  day,
  onClose,
  onSelectAvailableDay,
}) => {
  if (!day) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-locked-heading"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-amber-400">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
              Demo Edition · Days 1–3 Unlocked
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-md">
              <Calendar className="w-3.5 h-3.5" />
              <span>Day {day.dayNumber}: {day.title}</span>
            </div>

            <h2 id="demo-locked-heading" className="text-xl font-bold text-white tracking-tight">
              Content Not Available Yet
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              This is the interactive <strong>Demo Edition</strong> of Playwright Senior Prep. Only{' '}
              <strong className="text-emerald-400">Days 1–3</strong> (Playwright Internals, Resilient Locators,
              Shadow DOM &amp; iframe, and Web-First Polling) are active in this preview.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Materials, interview questions, and coding labs for Days 4–14 have been excluded from this demo
              build and from all exported ZIP packages.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available Now in Demo (Days 1–3)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    onSelectAvailableDay(d);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Go to Day {d}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
