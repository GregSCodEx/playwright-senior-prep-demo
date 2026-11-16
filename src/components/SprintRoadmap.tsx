import React, { useState, useMemo, useEffect } from 'react';
import { CodingChallenge, DayPlan, InterviewQuestion, QuestionCategory } from '../types';
import { DemoLockedModal } from './DemoLockedModal';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Code2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Lightbulb,
  Lock
} from 'lucide-react';

interface SprintRoadmapProps {
  sprintPlan: DayPlan[];
  questions?: InterviewQuestion[];
  challenges?: CodingChallenge[];
  completedDays: number[];
  checklistItems: Record<string, boolean>;
  activeDayNumber?: number;
  onSelectDay?: (dayNumber: number) => void;
  onToggleDayComplete: (dayNumber: number) => void;
  onToggleChecklistItem: (key: string) => void;
  onNavigateToCategory: (category: QuestionCategory) => void;
  onNavigateToChallenge: (challengeId: string) => void;
  onNavigateToQuestion?: (questionId: string) => void;
  onNavigateToDayQuestions?: (dayNumber: number) => void;
  onOpenPlanner?: () => void;
}

export const SprintRoadmap: React.FC<SprintRoadmapProps> = ({
  sprintPlan,
  questions = [],
  challenges = [],
  completedDays,
  checklistItems,
  activeDayNumber,
  onSelectDay,
  onToggleDayComplete,
  onToggleChecklistItem,
  onNavigateToCategory,
  onNavigateToChallenge,
  onNavigateToQuestion,
  onNavigateToDayQuestions,
  onOpenPlanner,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(activeDayNumber || 1);
  const [lockedModalDay, setLockedModalDay] = useState<DayPlan | null>(null);
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  useEffect(() => {
    if (activeDayNumber && activeDayNumber !== selectedDayNumber) {
      const target = sprintPlan.find((d) => d.dayNumber === activeDayNumber);
      if (target && !target.isDemoLocked) {
        setSelectedDayNumber(activeDayNumber);
      }
    }
  }, [activeDayNumber, sprintPlan]);

  const handleSelectDay = (day: DayPlan) => {
    if (day.isDemoLocked) {
      setLockedModalDay(day);
      return;
    }
    setSelectedDayNumber(day.dayNumber);
    onSelectDay?.(day.dayNumber);
  };

  const selectedDay =
    sprintPlan.find((d) => d.dayNumber === selectedDayNumber && !d.isDemoLocked) ||
    sprintPlan.find((d) => !d.isDemoLocked) ||
    sprintPlan[0];

  const unlockedDays = useMemo(() => sprintPlan.filter((d) => !d.isDemoLocked), [sprintPlan]);

  const highlightedQuestions = useMemo(() => {
    if (!questions || !selectedDay.deepDiveContent?.interviewQuestionsHighlighted) return [];
    const ids = selectedDay.deepDiveContent.interviewQuestionsHighlighted;
    return ids
      .map((id) => questions.find((q) => q.id === id))
      .filter((q): q is InterviewQuestion => Boolean(q));
  }, [questions, selectedDay]);

  const dayChallenges = useMemo(() => {
    const idSet = new Set<string>();
    if (selectedDay.suggestedChallengeId) idSet.add(selectedDay.suggestedChallengeId);
    if (selectedDay.suggestedChallengeIds) {
      selectedDay.suggestedChallengeIds.forEach((id) => idSet.add(id));
    }
    const matchingByDay = challenges.filter((c) => c.sprintDay === selectedDay.dayNumber);
    matchingByDay.forEach((c) => idSet.add(c.id));

    return Array.from(idSet)
      .map((id) => challenges.find((c) => c.id === id))
      .filter((c): c is CodingChallenge => Boolean(c));
  }, [challenges, selectedDay]);

  const toggleItemExpand = (itemKey: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const handleCopySnippet = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(key);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const expandAllInDay = () => {
    const next: Record<string, boolean> = {};
    selectedDay.objectives.forEach((_, idx) => {
      next[`day-${selectedDay.dayNumber}-item-${idx}`] = true;
    });
    setExpandedItems((prev) => ({ ...prev, ...next }));
  };

  const collapseAllInDay = () => {
    const next = { ...expandedItems };
    selectedDay.objectives.forEach((_, idx) => {
      delete next[`day-${selectedDay.dayNumber}-item-${idx}`];
    });
    setExpandedItems(next);
  };

  const phases = Array.from(new Set(sprintPlan.map((d) => d.phase)));

  const filteredDays =
    filterPhase === 'all'
      ? sprintPlan
      : sprintPlan.filter((d) => d.phase === filterPhase);

  const unlockedCompletedCount = completedDays.filter((d) =>
    unlockedDays.some((u) => u.dayNumber === d)
  ).length;
  const totalProgress =
    unlockedDays.length > 0
      ? Math.round((unlockedCompletedCount / unlockedDays.length) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Strategic Header & Demo Context */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>14-DAY SENIOR PLAYWRIGHT INTERVIEW SPRINT · DEMO (DAYS 1–3 ACTIVE)</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-400">DAYS 4–14 LOCKED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Senior Engineering Interview Roadmap
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Structured preparation for experienced QA &amp; SDET engineers. Explore{' '}
              <strong className="text-white">Days 1–3</strong> covering Playwright out-of-process architecture,
              resilient AOM locators, Shadow DOM, <code className="text-emerald-400 bg-slate-800 px-1 py-0.5 rounded text-xs">frameLocator</code>,
              and <code className="text-emerald-400 bg-slate-800 px-1 py-0.5 rounded text-xs">expect.poll</code>. Days 4–14 show the full syllabus outline and open a preview notice when clicked.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              {onOpenPlanner && (
                <button
                  type="button"
                  onClick={onOpenPlanner}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daily Study Pace Calculator (2.5–3.5h / day)</span>
                </button>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
            <div className="text-right">
              <div className="text-xs text-slate-400">Demo days completed</div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {unlockedCompletedCount}{' '}
                <span className="text-sm font-normal text-slate-500">/ {unlockedDays.length}</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-emerald-400 flex items-center justify-center font-bold text-sm text-emerald-400 tabular-nums">
              {totalProgress}%
            </div>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 mr-1">Sprint Phase:</span>
          <button
            onClick={() => setFilterPhase('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterPhase === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-800'
            }`}
          >
            All 14 Days
          </button>
          {phases.map((ph, idx) => (
            <button
              key={ph}
              onClick={() => setFilterPhase(ph)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filterPhase === ph
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-800'
              }`}
            >
              Phase {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 14 Days Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Day-by-Day Curriculum</span>
            <span>Days 1–3 unlocked · Days 4–14 locked</span>
          </div>

          <div className="space-y-2.5">
            {filteredDays.map((day) => {
              const isLocked = !!day.isDemoLocked;
              const isCompleted = !isLocked && completedDays.includes(day.dayNumber);
              const isSelected = !isLocked && selectedDay.dayNumber === day.dayNumber;

              return (
                <div
                  key={day.dayNumber}
                  onClick={() => handleSelectDay(day)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isLocked
                      ? 'bg-slate-900/30 border-slate-800/60 opacity-75 hover:opacity-100 hover:border-amber-500/40'
                      : isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {isLocked ? (
                        <span
                          className="mt-0.5 text-amber-400/80 shrink-0"
                          title="Not available in Demo Edition"
                        >
                          <Lock className="w-5 h-5" />
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleDayComplete(day.dayNumber);
                          }}
                          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/40" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                      )}

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isLocked
                                ? 'text-slate-400'
                                : isSelected
                                ? 'text-emerald-400'
                                : 'text-slate-400'
                            }`}
                          >
                            Day {day.dayNumber}
                          </span>
                          <span aria-hidden="true" className="text-slate-700">·</span>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {day.estimatedHours}h
                          </span>
                          {isLocked && (
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-300 bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded">
                              Not available yet
                            </span>
                          )}
                        </div>
                        <h2 className="text-sm font-semibold text-white mt-1">
                          {day.title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {day.subtitle}
                        </p>
                      </div>
                    </div>

                    {isLocked ? (
                      <Lock className="w-4 h-4 mt-1 text-amber-400/70 shrink-0" />
                    ) : (
                      <ArrowRight
                        className={`w-4 h-4 mt-1 transition-transform ${
                          isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'
                        }`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Dive Day Explorer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          {/* Day Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                <span>DAY {selectedDay.dayNumber} OF 14</span>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <span>{selectedDay.phase}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedDay.title}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {selectedDay.subtitle}
              </p>
            </div>

            <button
              onClick={() => onToggleDayComplete(selectedDay.dayNumber)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                completedDays.includes(selectedDay.dayNumber)
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {completedDays.includes(selectedDay.dayNumber) ? 'Day Completed' : 'Mark Day Complete'}
              </span>
            </button>
          </div>

          {/* Objectives Checklists & Full Knowledge Base */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Topics to Master (Click any item to expand):</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  const anyOpen = selectedDay.objectives.some(
                    (_, idx) => !!expandedItems[`day-${selectedDay.dayNumber}-item-${idx}`]
                  );
                  if (anyOpen) collapseAllInDay();
                  else expandAllInDay();
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 cursor-pointer font-medium"
              >
                {selectedDay.objectives.some(
                  (_, idx) => !!expandedItems[`day-${selectedDay.dayNumber}-item-${idx}`]
                )
                  ? 'Collapse all'
                  : 'Expand all details'}
              </button>
            </div>

            <div className="space-y-2.5">
              {selectedDay.objectives.map((obj, idx) => {
                const itemKey = `day-${selectedDay.dayNumber}-item-${idx}`;
                const isChecked = !!checklistItems[itemKey];
                const isOpen = !!expandedItems[itemKey];

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all ${
                      isChecked
                        ? 'bg-slate-950/40 border-slate-800/60'
                        : isOpen
                        ? 'bg-slate-950/90 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Item Row Header */}
                    <div
                      onClick={() => toggleItemExpand(itemKey)}
                      className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleChecklistItem(itemKey);
                          }}
                          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                          title={isChecked ? 'Mark as not mastered' : 'Mark as mastered'}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <div>
                          <span
                            className={`text-xs sm:text-sm font-semibold leading-snug ${
                              isChecked ? 'line-through text-slate-400' : 'text-slate-100'
                            }`}
                          >
                            {obj.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400 hover:text-slate-200">
                          {isOpen ? 'Hide' : 'Details'}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Rich Details View */}
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-3 text-xs leading-relaxed">
                        <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                          {obj.details}
                        </p>

                        {obj.codeSnippet && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-slate-400">
                              <span className="font-mono text-[11px] text-slate-400">
                                Code / Configuration / Example:
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopySnippet(itemKey, obj.codeSnippet!)}
                                className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 text-[11px] cursor-pointer"
                              >
                                {copiedSnippet === itemKey ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <div className="rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                              <pre className="p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                                <code>{obj.codeSnippet}</code>
                              </pre>
                            </div>
                          </div>
                        )}

                        {obj.interviewTip && (
                          <div className="bg-sky-950/30 border border-sky-900/40 rounded-lg p-2.5 flex items-start gap-2">
                            <Lightbulb className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                            <p className="text-sky-200/90 text-[11px]">
                              <strong>Senior Interview Tip:</strong> {obj.interviewTip}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary & Theory */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Interview Context &amp; Deep Dive</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-lg border border-slate-800/60">
              {selectedDay.deepDiveContent.summary}
            </p>
          </div>

          {/* Key Concepts with Code */}
          <div className="space-y-4">
            {selectedDay.deepDiveContent.keyConcepts.map((concept, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {concept.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {concept.explanation}
                </p>
                {concept.codeSnippet && (
                  <div className="relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800 mt-2">
                    <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{concept.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Senior Pitfalls Alert */}
          <div className="bg-amber-950/20 border border-amber-900/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Interview Red Flags &amp; Pitfalls (What to Avoid)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
              {selectedDay.deepDiveContent.seniorPitfalls.map((pit, idx) => (
                <li key={idx} className="leading-relaxed">{pit}</li>
              ))}
            </ul>
          </div>

          {/* Official Source Materials & Deep Dive Links */}
          {selectedDay.deepDiveContent.sourceMaterials &&
            selectedDay.deepDiveContent.sourceMaterials.length > 0 && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                  <span>Primary Sources &amp; Official Architecture Docs</span>
                </div>
                <div className="space-y-2.5">
                  {selectedDay.deepDiveContent.sourceMaterials.map((source, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-slate-900/70 border border-slate-800/80 p-3 rounded-lg space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-white">{source.title}</span>
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] shrink-0"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-400 leading-relaxed">{source.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Highlighted Interview Questions */}
          {highlightedQuestions.length > 0 && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Key Interview Questions for Day {selectedDay.dayNumber} ({highlightedQuestions.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToDayQuestions) {
                      onNavigateToDayQuestions(selectedDay.dayNumber);
                    } else if (selectedDay.suggestedQuestionCategory) {
                      onNavigateToCategory(selectedDay.suggestedQuestionCategory);
                    }
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Filter in Questions Bank</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {highlightedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-slate-900/90 border border-slate-800/90 rounded-lg p-4 space-y-2.5 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-emerald-400">{q.categoryLabel}</span>
                        <span aria-hidden="true" className="text-slate-700">·</span>
                        <span className="text-sky-400 font-mono text-[11px]">{q.level}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigateToQuestion?.(q.id)}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-emerald-950/40 hover:bg-emerald-900/50 px-2.5 py-1 rounded border border-emerald-500/30 transition-colors shrink-0"
                      >
                        <span>Reference Answer</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {q.question}
                    </h4>

                    <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                      <span className="text-emerald-300 font-semibold">TL;DR: </span>
                      <span>{q.shortAnswer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action Navigation */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {selectedDay.suggestedQuestionCategory && (
              <button
                onClick={() => onNavigateToCategory(selectedDay.suggestedQuestionCategory!)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-sky-400 bg-sky-950/30 hover:bg-sky-950/50 border border-sky-800/40 rounded-lg transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Category Questions</span>
              </button>
            )}

            {dayChallenges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 ml-auto">
                {dayChallenges.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => onNavigateToChallenge(ch.id)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                    title={ch.title}
                  >
                    <Code2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {dayChallenges.length > 1
                        ? ch.title.replace(/^Challenge \d+\s*\([^)]+\):\s*/, 'Live Coding: ')
                        : 'Solve Day Live Coding Challenge'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Locked Days 4-14 */}
      <DemoLockedModal
        day={lockedModalDay}
        onClose={() => setLockedModalDay(null)}
        onSelectAvailableDay={(dayNumber) => {
          setSelectedDayNumber(dayNumber);
          onSelectDay?.(dayNumber);
        }}
      />
    </div>
  );
};
