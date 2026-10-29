import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Brain,
  Code2,
  MessageSquareCode,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CinematicBackground } from '../components/CinematicBackground';

export const ProgressReportsView: React.FC = () => {
  const {
    assessmentResult,
    assessmentHistory,
    codingProblems,
    dailyTasks,
    interviewHistory,
    roadmapPhases,
    profile,
  } = useApp();

  const solvedCount = codingProblems.filter((p) => p.solved).length;
  const completedTasks = dailyTasks.filter((t) => t.completed).length;

  const totalTopics = roadmapPhases.reduce((acc, p) => acc + p.topics.length, 0);
  const doneTopics = roadmapPhases.reduce(
    (acc, p) => acc + p.topics.filter((t) => t.completed).length,
    0
  );
  const roadmapPct = Math.round((doneTopics / totalTopics) * 100);

  return (
    <CinematicBackground variant="dashboard" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="card-cinematic p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/60">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
              <span>Role Competency Analytics</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Progress & Evidence Reports
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Transparent metrics tracking your daily learning consistency, diagnostic baseline history,
              coding milestones, and verified mock interview evidence.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center min-w-[140px] shrink-0">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
              Role Competency
            </span>
            <div className="text-3xl font-extrabold text-[#4F46E5] dark:text-cyan-400 font-mono mt-1">
              {assessmentResult ? `${assessmentResult.roleCompetencyCoverage ?? assessmentResult.overallScore}%` : '--'}
            </div>
            <p className={`text-[11px] mt-1 flex items-center justify-center gap-1 font-semibold ${assessmentResult ? 'text-emerald-500' : 'text-slate-400'}`}>
              {assessmentResult ? (
                <>
                  <ArrowUpRight className="w-3 h-3" /> Baseline Verified
                </>
              ) : (
                'Pending Assessment'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase text-[10px]">Coding Solved</span>
            <Code2 className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {solvedCount} / {codingProblems.length}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Data Structure Problems
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase text-[10px]">Tasks Finished</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {completedTasks} / {dailyTasks.length}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Today's Sprint Tasks
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase text-[10px]">Mock Interviews</span>
            <MessageSquareCode className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {interviewHistory.length}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Sessions Evaluated
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold uppercase text-[10px]">Roadmap Completion</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {roadmapPct}%
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {doneTopics} of {totalTopics} Topics
          </span>
        </div>
      </div>

      {/* Historical Attempts & Detailed Subject Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Score History Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Diagnostic Assessment History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Score records recorded across attempts
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {assessmentHistory.length} Recorded Attempts
            </span>
          </div>

          {assessmentHistory.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No previous retakes recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {assessmentHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Attempt #{assessmentHistory.length - idx}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.completedAt}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Strengths: {item.strengths?.[0] || 'Aptitude'} • Gap: {item.weakAreas?.[0] || 'DSA'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-cyan-500 font-mono">
                      {item.overallScore}%
                    </span>
                    <p className="text-[10px] text-slate-400">
                      {item.correctCount} / {item.totalQuestions}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Performance Breakdown Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Competency Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Demonstrated accuracy by category
            </p>
          </div>

          {assessmentResult ? (
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>Quantitative Aptitude</span>
                  <span className="font-mono text-violet-500">{assessmentResult.aptitudeScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-violet-500 h-full rounded-full"
                    style={{ width: `${assessmentResult.aptitudeScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>Logical Reasoning</span>
                  <span className="font-mono text-cyan-400">{assessmentResult.reasoningScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${assessmentResult.reasoningScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>Technical & Core Engineering</span>
                  <span className="font-mono text-indigo-400">{assessmentResult.technicalScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-400 h-full rounded-full"
                    style={{ width: `${assessmentResult.technicalScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <span>Verbal Ability</span>
                  <span className="font-mono text-emerald-400">{assessmentResult.verbalScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${assessmentResult.verbalScore}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
              <Brain className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No Diagnostic Evidence Recorded
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Demonstrated readiness is currently 0%. Complete the 10-question placement diagnostic to record real scores.
              </p>
            </div>
          )}
        </div>
      </div>
    </CinematicBackground>
  );
};
