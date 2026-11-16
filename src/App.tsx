import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SprintRoadmap } from './components/SprintRoadmap';
import { QuestionsBank } from './components/QuestionsBank';
import { LiveCodingStudio } from './components/LiveCodingStudio';
import { CheatsheetView } from './components/CheatsheetView';
import { MockInterviewModal } from './components/MockInterviewModal';
import { StudyPlannerModal } from './components/StudyPlannerModal';

import { SPRINT_PLAN } from './data/sprintPlan';
import { INTERVIEW_QUESTIONS } from './data/interviewQuestions';
import { CODING_CHALLENGES } from './data/codingChallenges';
import { QuestionCategory, UserProgress } from './types';
import { RotateCcw, Download, Clock } from 'lucide-react';
import { downloadProjectZip } from './utils/exportZip';

const STORAGE_KEY = 'playwright_senior_prep_demo_progress_v1';

export default function App() {
  const unlockedDaysCount = useMemo(
    () => SPRINT_PLAN.filter((d) => !d.isDemoLocked).length,
    []
  );

  // Load persisted progress or initialize defaults strictly scoped to Demo Days 1-3
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as UserProgress;
        const allowedDayNums = new Set(
          SPRINT_PLAN.filter((d) => !d.isDemoLocked).map((d) => d.dayNumber)
        );
        const allowedQuestionIds = new Set(INTERVIEW_QUESTIONS.map((q) => q.id));
        const allowedChallengeIds = new Set(CODING_CHALLENGES.map((c) => c.id));
        return {
          ...parsed,
          completedDays: (parsed.completedDays || []).filter((d) => allowedDayNums.has(d)),
          masteredQuestions: (parsed.masteredQuestions || []).filter((id) =>
            allowedQuestionIds.has(id)
          ),
          bookmarkedQuestions: (parsed.bookmarkedQuestions || []).filter((id) =>
            allowedQuestionIds.has(id)
          ),
          solvedChallenges: (parsed.solvedChallenges || []).filter((id) =>
            allowedChallengeIds.has(id)
          ),
        };
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return {
      completedDays: [1],
      checklistItems: { 'day-1-item-0': true, 'day-1-item-1': true },
      masteredQuestions: ['arch-1', 'loc-1'],
      bookmarkedQuestions: ['loc-2'],
      solvedChallenges: [],
      userCodeSnippets: {},
      lastActiveTab: 'roadmap',
    };
  });

  const [activeTab, setActiveTab] = useState<'roadmap' | 'questions' | 'coding' | 'mock' | 'cheatsheet'>(
    progress.lastActiveTab || 'roadmap'
  );

  const [filterCategoryForQuestions, setFilterCategoryForQuestions] = useState<QuestionCategory | 'all'>('all');
  const [filterSprintDayForQuestions, setFilterSprintDayForQuestions] = useState<number | 'all'>('all');
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<string | undefined>(undefined);
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [activeChallengeId, setActiveChallengeId] = useState<string | undefined>(undefined);
  const [isMockModalOpen, setIsMockModalOpen] = useState<boolean>(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, lastActiveTab: activeTab }));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress, activeTab]);

  const handleToggleDayComplete = (dayNumber: number) => {
    const targetDay = SPRINT_PLAN.find((d) => d.dayNumber === dayNumber);
    if (!targetDay || targetDay.isDemoLocked) return;

    setProgress((prev) => {
      const exists = prev.completedDays.includes(dayNumber);
      const updated = exists
        ? prev.completedDays.filter((d) => d !== dayNumber)
        : [...prev.completedDays, dayNumber];
      return { ...prev, completedDays: updated };
    });
  };

  const handleToggleChecklistItem = (key: string) => {
    setProgress((prev) => ({
      ...prev,
      checklistItems: {
        ...prev.checklistItems,
        [key]: !prev.checklistItems[key],
      },
    }));
  };

  const handleToggleMastered = (questionId: string) => {
    setProgress((prev) => {
      const exists = prev.masteredQuestions.includes(questionId);
      const updated = exists
        ? prev.masteredQuestions.filter((id) => id !== questionId)
        : [...prev.masteredQuestions, questionId];
      return { ...prev, masteredQuestions: updated };
    });
  };

  const handleToggleBookmarked = (questionId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedQuestions.includes(questionId);
      const updated = exists
        ? prev.bookmarkedQuestions.filter((id) => id !== questionId)
        : [...prev.bookmarkedQuestions, questionId];
      return { ...prev, bookmarkedQuestions: updated };
    });
  };

  const handleSaveSnippet = (challengeId: string, code: string) => {
    setProgress((prev) => ({
      ...prev,
      userCodeSnippets: {
        ...prev.userCodeSnippets,
        [challengeId]: code,
      },
    }));
  };

  const handleMarkSolved = (challengeId: string) => {
    setProgress((prev) => {
      if (prev.solvedChallenges.includes(challengeId)) return prev;
      return {
        ...prev,
        solvedChallenges: [...prev.solvedChallenges, challengeId],
      };
    });
  };

  const handleNavigateToCategory = (category: QuestionCategory) => {
    setFilterCategoryForQuestions(category);
    setFilterSprintDayForQuestions('all');
    setActiveTab('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDay = (dayNumber: number) => {
    const targetDay = SPRINT_PLAN.find((d) => d.dayNumber === dayNumber);
    if (targetDay && !targetDay.isDemoLocked) {
      setActiveDayNumber(dayNumber);
    }
    setActiveTab('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToQuestion = (questionId: string) => {
    setHighlightedQuestionId(questionId);
    setFilterCategoryForQuestions('all');
    setFilterSprintDayForQuestions('all');
    setActiveTab('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDayQuestions = (dayNumber: number) => {
    setFilterCategoryForQuestions('all');
    setFilterSprintDayForQuestions(dayNumber);
    setActiveTab('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToChallenge = (challengeId: string) => {
    setActiveChallengeId(challengeId);
    setActiveTab('coding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      await downloadProjectZip();
    } catch (e) {
      console.error('Failed to generate ZIP', e);
      alert('Failed to generate ZIP archive.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetAllProgress = () => {
    if (confirm('Are you sure you want to reset all saved study progress?')) {
      const resetState: UserProgress = {
        completedDays: [],
        checklistItems: {},
        masteredQuestions: [],
        bookmarkedQuestions: [],
        solvedChallenges: [],
        userCodeSnippets: {},
        lastActiveTab: 'roadmap',
      };
      setProgress(resetState);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masteredCount={progress.masteredQuestions.length}
        totalQuestions={INTERVIEW_QUESTIONS.length}
        completedDaysCount={progress.completedDays.length}
        unlockedDaysCount={unlockedDaysCount}
        totalDays={SPRINT_PLAN.length}
        onOpenMock={() => setIsMockModalOpen(true)}
        onOpenPlanner={() => setIsPlannerOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Candidate Context & Demo Scope Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 bg-slate-900/40 border border-slate-800/80 px-4 py-2.5 rounded-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-amber-300">Demo Edition:</span>
            <span>Senior Test Automation Engineer (Playwright &amp; TypeScript)</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-emerald-400">Days 1–3 Active (Days 4–14 Locked)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlannerOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200 bg-sky-950/40 border border-sky-800/60 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
              title="Calculate your daily study schedule"
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>Daily Study Pace</span>
            </button>

            <button
              onClick={handleExportZip}
              disabled={isExporting}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Download the Demo Edition source code (.ZIP) without Day 4-14 files"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Packaging...' : 'Download Demo (.ZIP)'}</span>
            </button>

            <button
              onClick={handleResetAllProgress}
              className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              title="Clear locally saved browser progress"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dynamic Views */}
        {activeTab === 'roadmap' && (
          <SprintRoadmap
            sprintPlan={SPRINT_PLAN}
            questions={INTERVIEW_QUESTIONS}
            challenges={CODING_CHALLENGES}
            completedDays={progress.completedDays}
            checklistItems={progress.checklistItems}
            activeDayNumber={activeDayNumber}
            onSelectDay={setActiveDayNumber}
            onToggleDayComplete={handleToggleDayComplete}
            onToggleChecklistItem={handleToggleChecklistItem}
            onNavigateToCategory={handleNavigateToCategory}
            onNavigateToChallenge={handleNavigateToChallenge}
            onNavigateToQuestion={handleNavigateToQuestion}
            onNavigateToDayQuestions={handleNavigateToDayQuestions}
            onOpenPlanner={() => setIsPlannerOpen(true)}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionsBank
            questions={INTERVIEW_QUESTIONS}
            masteredQuestionIds={progress.masteredQuestions}
            bookmarkedQuestionIds={progress.bookmarkedQuestions}
            initialCategory={filterCategoryForQuestions}
            initialSprintDay={filterSprintDayForQuestions}
            highlightedQuestionId={highlightedQuestionId}
            onToggleMastered={handleToggleMastered}
            onToggleBookmarked={handleToggleBookmarked}
            onNavigateToDay={handleNavigateToDay}
          />
        )}

        {activeTab === 'coding' && (
          <LiveCodingStudio
            challenges={CODING_CHALLENGES}
            initialChallengeId={activeChallengeId}
            solvedChallengeIds={progress.solvedChallenges}
            userCodeSnippets={progress.userCodeSnippets}
            onSaveSnippet={handleSaveSnippet}
            onMarkSolved={handleMarkSolved}
            onNavigateToDay={handleNavigateToDay}
          />
        )}

        {activeTab === 'cheatsheet' && <CheatsheetView />}
      </main>

      {/* Mock Interview Simulation Modal */}
      <MockInterviewModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        questions={INTERVIEW_QUESTIONS}
        challenges={CODING_CHALLENGES}
        onCompleteSession={(score) => {
          console.log('Mock Interview completed with score:', score);
        }}
      />

      {/* Study Time Planner Modal */}
      <StudyPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        totalDays={unlockedDaysCount}
        completedDaysCount={progress.completedDays.length}
      />

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Playwright Senior Prep Platform</span>
            <span aria-hidden="true">·</span>
            <span>Demo Edition (Days 1–3 Active) for Senior &amp; Lead QA Candidates</span>
          </div>
          <div>
            <span>All progress is saved locally in your browser</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
