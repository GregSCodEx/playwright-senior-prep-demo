import React, { useState, useMemo, useEffect } from 'react';
import { InterviewQuestion, QuestionCategory } from '../types';
import {
  Search,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Eye,
  EyeOff,
  Calendar,
  Lock
} from 'lucide-react';

interface QuestionsBankProps {
  questions: InterviewQuestion[];
  masteredQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  initialCategory?: QuestionCategory | 'all';
  initialSprintDay?: number | 'all';
  highlightedQuestionId?: string;
  onToggleMastered: (questionId: string) => void;
  onToggleBookmarked: (questionId: string) => void;
  onNavigateToDay?: (dayNumber: number) => void;
}

export const QuestionsBank: React.FC<QuestionsBankProps> = ({
  questions,
  masteredQuestionIds,
  bookmarkedQuestionIds,
  initialCategory = 'all',
  initialSprintDay = 'all',
  highlightedQuestionId,
  onToggleMastered,
  onToggleBookmarked,
  onNavigateToDay,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSprintDay, setSelectedSprintDay] = useState<number | 'all'>(initialSprintDay);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'Senior' | 'Principal'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unmastered' | 'mastered' | 'bookmarked'>('all');
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSprintDay !== undefined) {
      setSelectedSprintDay(initialSprintDay);
    }
  }, [initialSprintDay]);

  useEffect(() => {
    if (highlightedQuestionId) {
      setExpandedIds((prev) => ({ ...prev, [highlightedQuestionId]: true }));
      setTimeout(() => {
        const el = document.getElementById(`question-${highlightedQuestionId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    }
  }, [highlightedQuestionId]);

  const categories = useMemo(
    () => [
      { id: 'all', label: 'All Demo Questions' },
      { id: 'architecture', label: 'Architecture & CDP' },
      { id: 'locators', label: 'Locators & Auto-wait' },
      { id: 'a11y', label: 'Accessibility (A11y)' },
      { id: 'typescript', label: 'Advanced TypeScript' },
    ],
    []
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedCategory !== 'all' && q.category !== selectedCategory) {
        return false;
      }
      if (selectedSprintDay !== 'all' && q.sprintDay !== selectedSprintDay) {
        return false;
      }
      if (filterLevel !== 'all' && q.level !== filterLevel) {
        return false;
      }
      if (statusFilter === 'mastered' && !masteredQuestionIds.includes(q.id)) {
        return false;
      }
      if (statusFilter === 'unmastered' && masteredQuestionIds.includes(q.id)) {
        return false;
      }
      if (statusFilter === 'bookmarked' && !bookmarkedQuestionIds.includes(q.id)) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText =
          q.question.toLowerCase().includes(query) ||
          q.shortAnswer.toLowerCase().includes(query) ||
          q.detailedAnswer.toLowerCase().includes(query) ||
          q.sprintDayTitle.toLowerCase().includes(query) ||
          q.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesText) return false;
      }
      return true;
    });
  }, [
    questions,
    selectedCategory,
    selectedSprintDay,
    filterLevel,
    statusFilter,
    searchQuery,
    masteredQuestionIds,
    bookmarkedQuestionIds,
  ]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    filteredQuestions.forEach((q) => {
      next[q.id] = true;
    });
    setExpandedIds(next);
  };

  const collapseAll = () => {
    setExpandedIds({});
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions, concepts (e.g., BrowserContext, getByRole, Shadow DOM, poll)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFlashcardMode(!flashcardMode)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                flashcardMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {flashcardMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{flashcardMode ? 'Flashcard Mode (Hidden)' : 'Full View'}</span>
            </button>

            <button
              onClick={Object.keys(expandedIds).length > 0 ? collapseAll : expandAll}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
            >
              {Object.keys(expandedIds).length > 0 ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sprint Day Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/50">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300">Sprint Day:</span>
          </span>
          <button
            onClick={() => setSelectedSprintDay('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedSprintDay === 'all'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/60'
            }`}
          >
            Days 1–3
          </button>
          {[1, 2, 3].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedSprintDay(day)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedSprintDay === day
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/60'
              }`}
            >
              D{day}
            </button>
          ))}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-amber-300/80 bg-amber-950/30 border border-amber-500/20 rounded-md ml-1">
            <Lock className="w-3 h-3" />
            <span>Days 4–14 locked in Demo</span>
          </span>
        </div>

        {/* Level and Status Secondary Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`hover:text-white cursor-pointer ${statusFilter === 'all' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
            >
              All ({questions.length})
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => setStatusFilter('unmastered')}
              className={`hover:text-white cursor-pointer ${statusFilter === 'unmastered' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
            >
              To Study ({Math.max(0, questions.length - masteredQuestionIds.length)})
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => setStatusFilter('mastered')}
              className={`hover:text-white cursor-pointer ${statusFilter === 'mastered' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
            >
              Mastered ({masteredQuestionIds.length})
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => setStatusFilter('bookmarked')}
              className={`hover:text-white cursor-pointer ${statusFilter === 'bookmarked' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
            >
              Bookmarked ({bookmarkedQuestionIds.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Level:</span>
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-2 py-0.5 rounded cursor-pointer ${filterLevel === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterLevel('Senior')}
              className={`px-2 py-0.5 rounded cursor-pointer ${filterLevel === 'Senior' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Senior
            </button>
            <button
              onClick={() => setFilterLevel('Principal')}
              className={`px-2 py-0.5 rounded cursor-pointer ${filterLevel === 'Principal' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              Principal
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
            <p className="text-sm font-medium">No questions match the selected filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSprintDay('all');
                setSearchQuery('');
                setStatusFilter('all');
                setFilterLevel('all');
              }}
              className="mt-3 px-4 py-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isMastered = masteredQuestionIds.includes(q.id);
            const isBookmarked = bookmarkedQuestionIds.includes(q.id);
            const isExpanded = flashcardMode ? !!expandedIds[q.id] : expandedIds[q.id] !== false;

            return (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className={`border rounded-xl transition-all ${
                  isMastered
                    ? 'bg-slate-900/60 border-slate-800/60'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Question Card Top Bar */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToDay?.(q.sprintDay);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60 hover:text-white transition-colors cursor-pointer shrink-0"
                        title={`Open in Roadmap: ${q.sprintDayTitle}`}
                      >
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        <span>{q.sprintDayTitle}</span>
                      </button>

                      <span className="font-semibold text-emerald-400">{q.categoryLabel}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-sky-400 font-mono text-[11px]">{q.level}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {q.tags.map((tag) => (
                          <span key={tag} className="text-slate-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-base font-semibold text-white leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  {/* Actions & State Toggles */}
                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onToggleBookmarked(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark for review'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleMastered(q.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(q.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Details / Answer Box */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-4">
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5">
                      <div className="text-xs font-bold uppercase text-slate-400 mb-1">
                        Concise Answer (TL;DR):
                      </div>
                      <p className="text-sm font-medium text-emerald-300 leading-relaxed">
                        {q.shortAnswer}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-bold uppercase text-slate-400">
                        Detailed Technical Explanation:
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {q.detailedAnswer}
                      </p>
                    </div>

                    {q.codeExample && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-bold uppercase">Playwright TypeScript Example:</span>
                          <button
                            onClick={() => handleCopyCode(q.id, q.codeExample!)}
                            className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            {copiedSnippetId === q.id ? (
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
                        <div className="rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                          <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                            <code>{q.codeExample}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3.5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Recruiter Traps (What NOT to Say):</span>
                      </div>
                      <ul className="space-y-1 text-xs text-rose-200/90 list-disc list-inside">
                        {q.recruiterTraps.map((trap, idx) => (
                          <li key={idx} className="leading-relaxed">{trap}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-sky-950/20 border border-sky-900/40 rounded-lg p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-sky-400">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Senior &amp; Principal Perspective:</span>
                      </div>
                      <p className="text-xs text-sky-200/90 leading-relaxed">
                        {q.seniorPerspective}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
