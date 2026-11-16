import React, { useState } from 'react';
import {
  CHEATSHEET_SECTIONS,
  SENIOR_GOLDEN_RULES,
  QUESTIONS_TO_ASK_INTERVIEWERS
} from '../data/cheatsheetData';
import {
  Copy,
  Check,
  ShieldCheck,
  MessageSquareQuote
} from 'lucide-react';

export const CheatsheetView: React.FC = () => {
  const [copiedSyntax, setCopiedSyntax] = useState<string | null>(null);

  const handleCopy = (syntax: string) => {
    navigator.clipboard.writeText(syntax);
    setCopiedSyntax(syntax);
    setTimeout(() => setCopiedSyntax(null), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Playwright Senior Engineering Cheatsheet (Demo Days 1–3)
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Quick-reference sheet covering user-facing locators, Shadow DOM piercing, <code className="text-emerald-400">frameLocator</code>, auto-retrying web-first assertions, CLI commands, and strategic questions to review 24 hours before your technical interview.
        </p>
      </div>

      {/* Senior Golden Rules Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>6 Golden Rules for Senior / Principal QA Interviews</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SENIOR_GOLDEN_RULES.map((gr, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono text-emerald-400 mb-1">
                  Rule #{idx + 1}
                </div>
                <h3 className="text-sm font-bold text-white">
                  {gr.rule}
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-2 pt-2 border-t border-slate-800/60">
                {gr.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cheatsheet API Tables */}
      <div className="space-y-8">
        {CHEATSHEET_SECTIONS.map((section) => (
          <div key={section.id} className="space-y-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                {section.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {section.description}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
              {section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-xs font-mono text-emerald-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                        {item.syntax}
                      </code>
                      <button
                        onClick={() => handleCopy(item.syntax)}
                        className="text-slate-500 hover:text-emerald-400 p-1 cursor-pointer transition-colors"
                        title="Copy syntax"
                      >
                        {copiedSyntax === item.syntax ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>

                  {item.example && (
                    <div className="lg:max-w-md w-full bg-slate-950 p-3 rounded-lg border border-slate-800/90 text-xs font-mono text-slate-300 overflow-x-auto">
                      <span className="text-[10px] uppercase text-slate-500 block mb-1">
                        Example:
                      </span>
                      <code>{item.example}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Questions to Ask the Hiring Manager */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
          <MessageSquareQuote className="w-4 h-4" />
          <span>High-Signal Questions to Ask Your Interviewers</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Asking thoughtful questions at the end of a technical interview signals Senior engineering maturity focused on pipeline reliability, test architecture, and team ownership:
        </p>

        <div className="space-y-3 pt-2">
          {QUESTIONS_TO_ASK_INTERVIEWERS.map((question, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-slate-950/60 border border-slate-800 p-3.5 rounded-lg text-xs sm:text-sm text-slate-200"
            >
              <span className="text-emerald-400 font-bold font-mono">Q{idx + 1}.</span>
              <span className="leading-relaxed">{question}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
