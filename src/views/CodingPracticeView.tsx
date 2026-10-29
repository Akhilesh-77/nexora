import React, { useState } from 'react';
import {
  Code2,
  Play,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Terminal,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Clock,
  HardDrive,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CodingProblem } from '../types';

export const CodingPracticeView: React.FC = () => {
  const { codingProblems, markCodingSolved, profile } = useApp();

  const [selectedProblemId, setSelectedProblemId] = useState<string>(
    codingProblems[0]?.id || 'code-1'
  );
  const [activeLanguage, setActiveLanguage] = useState<string>('python');
  const [activeTab, setActiveTab] = useState<'editor' | 'solution' | 'hints'>('editor');
  const [userCode, setUserCode] = useState<string>('');
  const [consoleOutput, setConsoleOutput] = useState<{
    status: 'idle' | 'running' | 'passed' | 'failed';
    message: string;
    details?: string;
  }>({ status: 'idle', message: 'Press "Run Code" to test against sample test cases.' });

  const currentProblem: CodingProblem =
    codingProblems.find((p) => p.id === selectedProblemId) || codingProblems[0];

  // Sync starter code when problem or language changes
  React.useEffect(() => {
    if (currentProblem) {
      const code =
        currentProblem.starterCode[activeLanguage] ||
        currentProblem.starterCode['python'] ||
        '';
      setUserCode(code);
      setConsoleOutput({
        status: 'idle',
        message: 'Press "Run Code" to test against sample test cases.',
      });
      setActiveTab('editor');
    }
  }, [selectedProblemId, activeLanguage]);

  const handleRunCode = async () => {
    setConsoleOutput({
      status: 'running',
      message: 'Compiling & executing against sample test cases in process-isolated runner...',
    });
    try {
      const res = await fetch('/api/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: currentProblem.id,
          language: activeLanguage,
          code: userCode,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status === 'Compilation Error' || data.status === 'Runtime Error' || data.status === 'Time Limit Exceeded') {
        setConsoleOutput({
          status: 'failed',
          message: `${data.status || 'Execution Failed'}: ${data.error || 'Syntax or runtime error.'}`,
          details: data.details || data.error,
        });
        return;
      }

      if (data.status === 'Wrong Answer') {
        setConsoleOutput({
          status: 'failed',
          message: `Wrong Answer: Passed ${data.passedCount} / ${data.totalCount} sample test cases.`,
          details: data.details || `Failed on test case ${data.failedCase}\nExpected: ${data.expected}\nGot: ${data.actual}`,
        });
        return;
      }

      if (data.status === 'Accepted') {
        setConsoleOutput({
          status: 'passed',
          message: `Sample Cases Passed! (${data.passedCount}/${data.totalCount})`,
          details: `Runtime: ${data.runtimeMs}ms • All sample test cases matched expected outputs.`,
        });
      }
    } catch (err: any) {
      setConsoleOutput({
        status: 'failed',
        message: 'Runner Error: Could not reach code execution engine.',
        details: err.message,
      });
    }
  };

  const handleSubmitSolution = async () => {
    setConsoleOutput({
      status: 'running',
      message: 'Running comprehensive test suite in process-isolated sandbox...',
    });
    try {
      const token = localStorage.getItem('nexora_token');
      const res = await fetch('/api/code/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          problemId: currentProblem.id,
          language: activeLanguage,
          code: userCode,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status === 'Compilation Error' || data.status === 'Runtime Error' || data.status === 'Time Limit Exceeded') {
        setConsoleOutput({
          status: 'failed',
          message: `${data.status || 'Submission Rejected'}: ${data.error || 'Execution failed.'}`,
          details: data.details || data.error,
        });
        return;
      }

      if (data.status === 'Wrong Answer') {
        setConsoleOutput({
          status: 'failed',
          message: `Wrong Answer: ${data.passedCount} / ${data.totalCount} test cases passed.`,
          details: data.details || `Failed on test case ${data.failedCase}\nInput: ${data.input}\nExpected: ${data.expected}\nGot: ${data.actual}`,
        });
        return;
      }

      if (data.status === 'Accepted') {
        setConsoleOutput({
          status: 'passed',
          message: `Accepted! 🎉 ${data.passedCount} / ${data.totalCount} test cases passed successfully.`,
          details: `Execution Time: ${data.runtimeMs}ms\nSolution verified and recorded to your MongoDB progress record!`,
        });
        markCodingSolved(currentProblem.id);
      }
    } catch (err: any) {
      setConsoleOutput({
        status: 'failed',
        message: 'Submission Error: Could not reach code execution engine.',
        details: err.message,
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Campus Screening Coding Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202334] dark:text-white tracking-tight">
              Algorithmic Coding Practice
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 max-w-xl">
              Solve essential data structure patterns asked by top software companies during campus placements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Solved:</span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs font-mono">
              {codingProblems.filter((p) => p.solved).length} / {codingProblems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Problems List & Problem Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Curated Challenge Set
            </h2>
            <div className="space-y-1.5 max-h-[550px] overflow-y-auto custom-scrollbar pr-1">
              {codingProblems.map((p) => {
                const isSelected = p.id === selectedProblemId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProblemId(p.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 dark:bg-indigo-950/60 border-[#4F46E5] text-slate-900 dark:text-white shadow-2xs'
                        : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">{p.title}</span>
                        {p.solved && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{p.category}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.difficulty === 'Easy'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : p.difficulty === 'Medium'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Details (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Problem Header Card */}
          <div className="p-6 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {currentProblem.title}
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      currentProblem.difficulty === 'Easy'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {currentProblem.difficulty}
                  </span>
                  {currentProblem.solved && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Solved
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Category: {currentProblem.category}
                </span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                {(['python', 'javascript', 'java', 'cpp'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[11px] transition-all cursor-pointer ${
                      activeLanguage === lang
                        ? 'bg-white dark:bg-slate-900 text-[#4F46E5] dark:text-cyan-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'cpp' ? 'C++' : lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Problem Description */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentProblem.description}
            </p>

            {/* Examples */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Examples:</span>
              {currentProblem.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 space-y-1"
                >
                  <p><span className="text-slate-400 font-bold">Input:</span> {ex.input}</p>
                  <p><span className="text-slate-400 font-bold">Output:</span> {ex.output}</p>
                  {ex.explanation && (
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] font-sans">
                      Explanation: {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">Constraints:</span>
              <ul className="list-disc list-inside">
                {currentProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Editor Workspace & Tabs */}
          <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'editor'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Code Editor
                </button>

                <button
                  onClick={() => setActiveTab('hints')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'hints'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Hints ({currentProblem.hints.length})
                </button>

                <button
                  onClick={() => setActiveTab('solution')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'solution'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Optimal Solution
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="hidden sm:inline">Language:</span>
                <select
                  value={activeLanguage}
                  onChange={(e) => setActiveLanguage(e.target.value)}
                  className="bg-slate-800 text-white font-mono text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                >
                  <option value="python">Python 3.12</option>
                  <option value="javascript">JavaScript (Node.js)</option>
                </select>
              </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'editor' && (
              <div className="p-4 space-y-4">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={12}
                  spellCheck={false}
                  className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-[#4F46E5] transition-colors"
                />

                {/* Console Output Bar */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2 mb-1 text-slate-400 text-[11px] font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Runner Console</span>
                  </div>
                  <p
                    className={
                      consoleOutput.status === 'passed'
                        ? 'text-emerald-400 font-semibold'
                        : consoleOutput.status === 'failed'
                        ? 'text-rose-400 font-semibold'
                        : consoleOutput.status === 'running'
                        ? 'text-cyan-400 animate-pulse font-semibold'
                        : 'text-slate-400'
                    }
                  >
                    {consoleOutput.message}
                  </p>
                  {consoleOutput.details && (
                    <pre
                      className={`mt-2 text-[11px] font-mono whitespace-pre-wrap leading-tight p-2.5 rounded-lg border ${
                        consoleOutput.status === 'failed'
                          ? 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      {consoleOutput.details}
                    </pre>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      const code =
                        currentProblem.starterCode[activeLanguage] ||
                        currentProblem.starterCode['python'] ||
                        '';
                      setUserCode(code);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Starter Code
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunCode}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run Sample Tests</span>
                    </button>

                    <button
                      onClick={handleSubmitSolution}
                      className="btn-cinematic px-6 py-2 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="p-6 space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Strategic Guidance:
                </h3>
                {currentProblem.hints.map((hint, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'solution' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Clock className="w-3.5 h-3.5" /> Time: {currentProblem.timeComplexity}
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <HardDrive className="w-3.5 h-3.5" /> Space: {currentProblem.spaceComplexity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentProblem.solutionExplanation}
                </p>

                <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                  {currentProblem.solution}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
