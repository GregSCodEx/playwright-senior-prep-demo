import React, { useState, useEffect } from 'react';
import { InterviewQuestion, CodingChallenge } from '../types';
import {
  X,
  Play,
  Pause,
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  Code2,
  FileEdit
} from 'lucide-react';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: InterviewQuestion[];
  challenges: CodingChallenge[];
  onCompleteSession: (score: number) => void;
}

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  questions,
  challenges,
  onCompleteSession,
}) => {
  const [selectedQuestions, setSelectedQuestions] = useState<InterviewQuestion[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<CodingChallenge | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const pickedQuestions = shuffled.slice(0, Math.min(5, shuffled.length));
      const pickedChallenge =
        challenges.length > 0 ? challenges[Math.floor(Math.random() * challenges.length)] : null;

      setSelectedQuestions(pickedQuestions);
      setSelectedChallenge(pickedChallenge);
      setCurrentStep(0);
      setTimeRemaining(45 * 60);
      setIsTimerRunning(true);
      setNotes({});
      setRatings({});
      setRevealedAnswers({});
    }
  }, [isOpen, questions, challenges]);

  useEffect(() => {
    if (!isOpen || !isTimerRunning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isTimerRunning, timeRemaining]);

  if (!isOpen) return null;

  const qCount = selectedQuestions.length;
  const codingStepIndex = qCount;
  const summaryStepIndex = qCount + 1;
  const totalSteps = qCount + 2;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentQuestion = currentStep < qCount ? selectedQuestions[currentStep] : undefined;
  const isCodingStep = currentStep === codingStepIndex;
  const isSummaryStep = currentStep === summaryStepIndex;

  const handleNext = () => {
    if (currentStep < summaryStepIndex) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRating = (key: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [key]: rating }));
  };

  const averageRating =
    Object.values(ratings).length > 0
      ? (
          Object.values(ratings).reduce((a, b) => a + b, 0) /
          Object.values(ratings).length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold text-white">
                Mock Technical Interview: Senior Playwright (Demo)
              </h2>
              <p className="text-xs text-slate-400">
                {isSummaryStep
                  ? 'Session Summary & Self-Assessment'
                  : isCodingStep
                  ? 'Part 2: Hands-on Live Coding Challenge'
                  : `Part 1: Question ${currentStep + 1} of ${qCount}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
              <Clock className={`w-3.5 h-3.5 ${timeRemaining < 300 ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span className={`font-mono font-bold tabular-nums ${timeRemaining < 300 ? 'text-rose-400' : 'text-slate-200'}`}>
                {formattedTime}
              </span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-slate-500 hover:text-white p-0.5 ml-1 cursor-pointer"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Progress Step Indicators */}
          <div className="flex items-center justify-between gap-1.5 border-b border-slate-800 pb-4">
            {Array.from({ length: totalSteps }, (_, stepIdx) => {
              const isDone = stepIdx < currentStep;
              const isCurrent = stepIdx === currentStep;

              return (
                <button
                  key={stepIdx}
                  onClick={() => setCurrentStep(stepIdx)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors text-center cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : isDone
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-950 text-slate-600'
                  }`}
                >
                  {stepIdx < qCount ? `Q${stepIdx + 1}` : stepIdx === codingStepIndex ? 'Live Lab' : 'Report'}
                </button>
              );
            })}
          </div>

          {/* STEP: Theoretical Questions */}
          {!isCodingStep && !isSummaryStep && currentQuestion && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400">Category: {currentQuestion.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-sky-400">{currentQuestion.level}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileEdit className="w-3.5 h-3.5 text-emerald-400" />
                    Your Candidate Scratchpad (Talking points to speak aloud):
                  </span>
                  <span className="text-slate-500">
                    Tip: Structure as Thesis -&gt; Under-the-hood mechanism -&gt; Production example
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Jot down your key talking points before revealing the reference answer..."
                  value={notes[currentQuestion.id] || ''}
                  onChange={(e) => setNotes({ ...notes, [currentQuestion.id]: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-600 font-mono"
                />
              </div>

              <div className="pt-2">
                {!revealedAnswers[currentQuestion.id] ? (
                  <button
                    onClick={() => setRevealedAnswers({ ...revealedAnswers, [currentQuestion.id]: true })}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Reveal Reference Answer &amp; Recruiter Traps</span>
                  </button>
                ) : (
                  <div className="space-y-4 bg-slate-950/80 border border-slate-800 p-4 rounded-xl">
                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase text-emerald-400">
                        Concise Thesis:
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200">
                        {currentQuestion.shortAnswer}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold uppercase text-slate-400">
                        Senior Perspective:
                      </div>
                      <p className="text-xs text-sky-300">
                        {currentQuestion.seniorPerspective}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">How would you rate your answer?</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(currentQuestion.id, star)}
                            className={`w-7 h-7 text-xs font-bold rounded cursor-pointer transition-colors ${
                              ratings[currentQuestion.id] >= star
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {star}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP: Coding Challenge */}
          {isCodingStep && selectedChallenge && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <Code2 className="w-4 h-4" />
                  <span>LIVE CODING CHALLENGE</span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="text-sky-400">{selectedChallenge.level}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedChallenge.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedChallenge.description}
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400">
                  Acceptance Criteria:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {selectedChallenge.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400">
                  Reference Solution:
                </div>
                <div className="rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                  <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                    <code>{selectedChallenge.solutionCode}</code>
                  </pre>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 font-medium">
                  Self-Rating for Live Coding (1 - Struggled, 5 - Flawless):
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating('coding-challenge', star)}
                      className={`w-7 h-7 text-xs font-bold rounded cursor-pointer transition-colors ${
                        ratings['coding-challenge'] >= star
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP: Summary & Readiness Report */}
          {isSummaryStep && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white">
                  Mock Interview Simulation Complete
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  You practiced {qCount} technical interview questions from Demo Days 1–3 and reviewed a timed Live Coding scenario.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto pt-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-500">Average Self-Rating</div>
                  <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
                    {averageRating} <span className="text-xs text-slate-500">/ 5.0</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-500">Time Remaining</div>
                  <div className="text-2xl font-bold text-sky-400 tabular-nums mt-1">
                    {formattedTime}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-500">Rated Items</div>
                  <div className="text-2xl font-bold text-white tabular-nums mt-1">
                    {Object.keys(ratings).length} <span className="text-xs text-slate-500">/ {qCount + 1}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    onCompleteSession(parseFloat(averageRating));
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-950/20 cursor-pointer"
                >
                  Save Score &amp; Return to Roadmap
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-500">
            Step {currentStep + 1} of {totalSteps}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStep === summaryStepIndex}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-30 disabled:pointer-events-none rounded-lg cursor-pointer"
          >
            <span>{currentStep === codingStepIndex ? 'View Summary' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
