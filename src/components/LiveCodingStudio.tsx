import React, { useState, useEffect } from 'react';
import { CodingChallenge } from '../types';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Terminal,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronRight,
  Calendar,
  Download,
  FolderGit2,
  ShieldCheck
} from 'lucide-react';
import { downloadLabRepoZip } from '../utils/exportZip';

interface LiveCodingStudioProps {
  challenges: CodingChallenge[];
  initialChallengeId?: string;
  solvedChallengeIds: string[];
  userCodeSnippets: Record<string, string>;
  onSaveSnippet: (challengeId: string, code: string) => void;
  onMarkSolved: (challengeId: string) => void;
  onNavigateToDay?: (dayNumber: number) => void;
}

export const LiveCodingStudio: React.FC<LiveCodingStudioProps> = ({
  challenges,
  initialChallengeId,
  solvedChallengeIds,
  userCodeSnippets,
  onSaveSnippet,
  onMarkSolved,
  onNavigateToDay,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    initialChallengeId || challenges[0].id
  );

  useEffect(() => {
    if (initialChallengeId && initialChallengeId !== selectedId) {
      setSelectedId(initialChallengeId);
    }
  }, [initialChallengeId]);

  const activeChallenge = challenges.find((c) => c.id === selectedId) || challenges[0];

  const [currentCode, setCurrentCode] = useState<string>(
    userCodeSnippets[activeChallenge.id] || activeChallenge.starterCode
  );

  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingLab, setIsExportingLab] = useState<boolean>(false);

  const handleDownloadLab = async (includeSolutions: boolean) => {
    setIsExportingLab(true);
    try {
      await downloadLabRepoZip({ includeSolutions });
    } catch (e) {
      console.error('Failed to export Lab ZIP', e);
    } finally {
      setIsExportingLab(false);
    }
  };

  const [runnerOutput, setRunnerOutput] = useState<{
    status: 'idle' | 'running' | 'passed' | 'failed';
    executionTimeMs: number;
    results: { id: string; label: string; passed: boolean; feedback: string }[];
    logs: string[];
  }>({
    status: 'idle',
    executionTimeMs: 0,
    results: [],
    logs: [],
  });

  useEffect(() => {
    setCurrentCode(userCodeSnippets[activeChallenge.id] || activeChallenge.starterCode);
    setShowSolution(false);
    setShowHint(false);
    setRunnerOutput({
      status: 'idle',
      executionTimeMs: 0,
      results: [],
      logs: [],
    });
  }, [activeChallenge.id, userCodeSnippets]);

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    onSaveSnippet(activeChallenge.id, newCode);
  };

  const handleReset = () => {
    setCurrentCode(activeChallenge.starterCode);
    onSaveSnippet(activeChallenge.id, activeChallenge.starterCode);
    setRunnerOutput({
      status: 'idle',
      executionTimeMs: 0,
      results: [],
      logs: [],
    });
  };

  const handleLoadSolution = () => {
    setCurrentCode(activeChallenge.solutionCode);
    onSaveSnippet(activeChallenge.id, activeChallenge.solutionCode);
    setShowSolution(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runVirtualTest = () => {
    setIsRunning(true);
    setRunnerOutput({
      status: 'running',
      executionTimeMs: 0,
      results: [],
      logs: [
        'Running 1 test using 1 worker...',
        `[playwright:runner] Compiling ${activeChallenge.id}.spec.ts`,
        '[playwright:runner] Launching isolated Chromium BrowserContext (in-memory)...',
      ],
    });

    setTimeout(() => {
      const results = activeChallenge.validationRules.map((rule) => {
        const checkResult = rule.check(currentCode);
        return {
          id: rule.id,
          label: rule.label,
          passed: checkResult.passed,
          feedback: checkResult.feedback,
        };
      });

      const allPassed = results.every((r) => r.passed);
      const executionTime = Math.floor(Math.random() * 300) + 420;

      const logs = [
        'Running 1 test using 1 worker',
        `[playwright:runner] Compiling ${activeChallenge.id}.spec.ts`,
        '[playwright:runner] Launching Chromium BrowserContext (in-memory)...',
        '[playwright:action] Validating actionability checks and AST statements...',
      ];

      results.forEach((r) => {
        if (r.passed) {
          logs.push(`  ✓ ${r.label}`);
        } else {
          logs.push(`  ✕ ${r.label} - ${r.feedback}`);
        }
      });

      if (allPassed) {
        logs.push('');
        logs.push(`1 passed (${executionTime}ms)`);
        logs.push('Trace recorded: on-first-retry (no flakiness detected)');
        onMarkSolved(activeChallenge.id);
      } else {
        logs.push('');
        logs.push(`1 failed (${executionTime}ms)`);
        logs.push('Error: Some assertions or Senior interview acceptance criteria were not met.');
      }

      setRunnerOutput({
        status: allPassed ? 'passed' : 'failed',
        executionTimeMs: executionTime,
        results,
        logs,
      });
      setIsRunning(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Challenge Navigation Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {challenges.map((c, index) => {
            const isSolved = solvedChallengeIds.includes(c.id);
            const isCurrent = c.id === activeChallenge.id;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] text-slate-400 shrink-0">
                    {index + 1}
                  </span>
                )}
                <span className="font-mono text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  D{c.sprintDay}
                </span>
                <span>Challenge {index + 1}: {c.category}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Recommended time: {activeChallenge.estimatedTimeMinutes} min</span>
        </div>
      </div>

      {/* Real Test Repository + Training Sandbox Export Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <FolderGit2 className="w-4 h-4 shrink-0" />
            <span>Real Demo Lab Repo + Local Training Sandbox App (Express :4173)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Want to practice locally in real Chromium with Trace Viewer instead of the in-browser runner? Download the standalone Demo Lab repository containing the local sandbox target (shop, dynamic tables, Shadow DOM, iframe, batch polling API) and <code className="text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded">tests/exercises/01..03.spec.ts</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={isExportingLab}
            onClick={() => handleDownloadLab(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            title="Includes the Training Sandbox (lab/server.ts), 3 Demo starter exercises, 3 reference solutions, and grade-lab.ts"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Lab Repo + Sandbox (.ZIP)</span>
          </button>

          <button
            type="button"
            disabled={isExportingLab}
            onClick={() => handleDownloadLab(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-300 hover:text-sky-200 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-700/50 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            title="Clean candidate pack without reference solutions—ready to send for a live coding round"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Candidate Pack (No Solutions)</span>
          </button>
        </div>
      </div>

      {/* Main Two-Zone Studio Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Requirements & Instructions (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
              <button
                type="button"
                onClick={() => onNavigateToDay?.(activeChallenge.sprintDay)}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60 hover:text-white transition-colors cursor-pointer"
                title={`Open day materials in Roadmap: ${activeChallenge.sprintDayTitle}`}
              >
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>{activeChallenge.sprintDayTitle}</span>
              </button>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-sky-400 font-mono text-[11px]">{activeChallenge.level}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {activeChallenge.title}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              {activeChallenge.description}
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 space-y-1">
            <div className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>What Interviewers Look For:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeChallenge.interviewContext}
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Acceptance Criteria:
            </h3>
            <ul className="space-y-2">
              {activeChallenge.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                  <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-emerald-400 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {showSolution && (
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-4 space-y-2">
              <div className="text-xs font-bold uppercase text-emerald-400">
                Reference Solution Breakdown:
              </div>
              <p className="text-xs text-emerald-200/90 whitespace-pre-line leading-relaxed">
                {activeChallenge.solutionExplanation}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>

            <button
              onClick={handleLoadSolution}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/30 border border-amber-900/40 rounded-lg cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Insert Reference Solution</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg cursor-pointer ml-auto"
              title="Restore starter code"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {showHint && (
            <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              💡 <strong>Hint:</strong> Playwright works on lazy <code className="text-emerald-400">Locator</code> and <code className="text-emerald-400">FrameLocator</code> objects, and web-first assertions always require <code className="text-emerald-400">await expect(loc)...</code>. Eliminate <code className="text-emerald-400">waitForTimeout</code> and positional <code className="text-emerald-400">.nth()</code> selectors.
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Virtual Runner (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                tests/{activeChallenge.id}.spec.ts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-950 border border-slate-800 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={runVirtualTest}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded shadow-sm transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>{isRunning ? 'Running...' : 'Run Test'}</span>
              </button>
            </div>
          </div>

          <div className="relative border-x border-b border-slate-800 rounded-b-xl overflow-hidden bg-slate-950">
            <textarea
              value={currentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              spellCheck={false}
              rows={16}
              className="w-full bg-transparent p-4 text-xs sm:text-sm font-mono text-emerald-300/90 leading-relaxed focus:outline-none resize-y selection:bg-emerald-500/30"
              style={{ tabSize: 2 }}
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Playwright Test Runner Output</span>
              </div>
              {runnerOutput.status !== 'idle' && (
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${runnerOutput.status === 'passed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {runnerOutput.status === 'passed' ? 'PASS' : runnerOutput.status === 'failed' ? 'FAIL' : 'RUNNING'}
                  </span>
                  {runnerOutput.executionTimeMs > 0 && (
                    <span className="text-slate-500 tabular-nums">
                      {runnerOutput.executionTimeMs}ms
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 font-mono text-xs space-y-1.5 min-h-[140px] max-h-[240px] overflow-y-auto">
              {runnerOutput.status === 'idle' ? (
                <p className="text-slate-500 italic">
                  Click &ldquo;Run Test&rdquo; to validate your solution in the virtual Playwright runner...
                </p>
              ) : (
                runnerOutput.logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.includes('✓')
                        ? 'text-emerald-400'
                        : log.includes('✕') || log.includes('Error:')
                        ? 'text-rose-400'
                        : log.includes('passed')
                        ? 'text-emerald-300 font-bold'
                        : log.includes('failed')
                        ? 'text-rose-400 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
