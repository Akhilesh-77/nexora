import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  Clock,
  Compass,
  Calculator,
  Code2,
  MessageSquareCode,
  FileText,
  Target,
  Check,
  ChevronRight,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CinematicBackground } from '../components/CinematicBackground';

export const DashboardView: React.FC = () => {
  const {
    profile,
    assessmentResult,
    dailyTasks,
    toggleTask,
    generateDailyTasks,
    setCurrentPage,
    codingProblems,
    streak,
    completedModules,
  } = useApp();

  const [showAllTasks, setShowAllTasks] = useState(false);

  const completedTasksCount = dailyTasks.filter((t) => t.completed).length;
  const totalTasksCount = dailyTasks.length;
  const hasAssessment = Boolean(assessmentResult);
  const competencyCoverage = assessmentResult
    ? (assessmentResult.roleCompetencyCoverage ?? assessmentResult.overallScore)
    : null;

  // Next pending task
  const nextPendingTask = dailyTasks.find((t) => !t.completed) || dailyTasks[0];

  // Up to 4 tasks initially
  const visibleTasks = showAllTasks ? dailyTasks : dailyTasks.slice(0, 4);

  return (
    <CinematicBackground variant="dashboard" className="space-y-6 max-w-4xl mx-auto pb-12 transition-colors">
      {/* 1. Cinematic Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl card-cinematic luminous-border relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200/80 dark:border-indigo-800/60">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>{profile.degree || 'B.Tech.'} • {profile.branch || 'Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
            Hi, {profile.name || 'Akhilesh'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg">
            Targeting <span className="font-bold text-[#4F46E5] dark:text-cyan-400">{profile.targetRole || 'Software Engineer'}</span>. Stay on track for upcoming placement drives with structured branch-aware practice.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => {
            if (!hasAssessment) {
              setCurrentPage('overview');
            } else if (nextPendingTask) {
              setCurrentPage(nextPendingTask.actionPage);
            } else {
              setCurrentPage('practice');
            }
          }}
          className="btn-cinematic flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>{hasAssessment ? 'Continue Preparing' : 'Take Diagnostic'}</span>
          <ArrowRight className="w-4 h-4 text-cyan-300" />
        </button>
      </div>

      {/* Honest Assessment Notice Banner if not completed */}
      {!hasAssessment && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              <span className="font-bold text-[#202334] dark:text-white">Diagnostic Baseline Needed:</span> Complete your 10-question assessment to calculate your verified Role Competency.
            </span>
          </div>
          <button
            onClick={() => setCurrentPage('overview')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] shrink-0 cursor-pointer"
          >
            Start Assessment
          </button>
        </div>
      )}

      {/* 2. Interactive Inline Metrics Summary */}
      <div className="grid grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 text-center shadow-xs">
        <button
          onClick={() => setShowAllTasks(!showAllTasks)}
          className="p-2 sm:p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-center border-r border-slate-200/60 dark:border-slate-800 cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Today's Tasks
          </span>
          <p className="text-lg sm:text-2xl font-black text-[#202334] dark:text-white font-mono mt-0.5">
            {completedTasksCount} / {totalTasksCount}
          </p>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hidden sm:inline">
            {completedTasksCount === totalTasksCount && totalTasksCount > 0 ? 'All Completed! 🎉' : 'Click to toggle view'}
          </span>
        </button>

        <button
          onClick={() => setCurrentPage(hasAssessment ? 'skills' : 'overview')}
          className="p-2 sm:p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-center border-r border-slate-200/60 dark:border-slate-800 cursor-pointer"
        >
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Role Coverage
          </span>
          <p className="text-lg sm:text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">
            {competencyCoverage !== null ? `${competencyCoverage}%` : '--'}
          </p>
          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold hidden sm:inline flex items-center justify-center gap-1">
            <span>{hasAssessment ? 'Skill Analysis' : 'Take Diagnostic'}</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </button>

        <div className="p-2 sm:p-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Daily Streak
          </span>
          <div className="flex items-center justify-center gap-1 mt-0.5 text-amber-500 font-black text-lg sm:text-2xl font-mono">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500" />
            <span>{streak?.currentStreak || 0} {streak?.currentStreak === 1 ? 'Day' : 'Days'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
            {(streak?.currentStreak || 0) > 0 ? `${streak.currentStreak} day streak active` : 'Practice today to begin'}
          </span>
        </div>
      </div>

      {/* 3. Pick Up Where You Left Off */}
      {nextPendingTask && (
        <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] dark:text-cyan-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Recommended Next Step</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#202334] dark:text-white">
              {nextPendingTask.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Estimated: {nextPendingTask.estimatedTime} • Category: {nextPendingTask.category}
            </p>
          </div>

          <button
            onClick={() => setCurrentPage(nextPendingTask.actionPage)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] shrink-0 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Drill</span>
          </button>
        </div>
      )}

      {/* 4. Today's Plan */}
      <div className="p-5 sm:p-6 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-[#202334] dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>Today's Plan</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personalized practice steps for your {profile.targetRole || 'Software Engineer'} target.
            </p>
          </div>

          <button
            onClick={generateDailyTasks}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#4F46E5] dark:text-slate-400 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            title="Refresh plan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Plan</span>
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-2.5">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                task.completed
                  ? 'bg-slate-50/70 dark:bg-[#151821]/50 border-slate-200 dark:border-slate-800 opacity-75'
                  : 'bg-white dark:bg-[#151821] border-slate-200 dark:border-slate-800 hover:border-[#4F46E5] dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Working Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
                      : 'border-slate-300 dark:border-slate-700 hover:border-[#4F46E5]'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <p
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-[#202334] dark:text-white'
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    {task.estimatedTime} • {task.category}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(task.actionPage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  task.completed
                    ? 'text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                    : 'bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] dark:text-cyan-400 hover:bg-[#4F46E5] hover:text-white'
                }`}
              >
                {task.completed ? 'Review' : 'Start'}
              </button>
            </div>
          ))}
        </div>

        {totalTasksCount > 4 && (
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowAllTasks(!showAllTasks)}
              className="text-xs font-semibold text-[#4F46E5] dark:text-cyan-400 hover:underline cursor-pointer"
            >
              {showAllTasks ? 'Show Less' : `View All (${totalTasksCount} Tasks)`}
            </button>
          </div>
        )}
      </div>

      {/* 5. Subject-Wise Study Library & Engineering Modules */}
      <div className="p-5 sm:p-6 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#202334] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400" />
              <span>Subject-Wise Study Library</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive branch & CSE theory modules with worked derivations, pitfalls, and knowledge checks.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('learning-studio')}
            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Learning Studio ({completedModules.length} Mastered)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Data Structures & Algorithms', topic: 'AVL & Red-Black Trees', tag: 'DSA' },
            { name: 'Operating Systems', topic: 'Virtual Memory & Multi-Level Paging', tag: 'OS' },
            { name: 'Database Management', topic: '1NF to BCNF Normalization', tag: 'DBMS' },
            { name: 'Computer Networks', topic: 'TCP 3-Way Handshake & Flow', tag: 'Networks' },
            { name: 'Object-Oriented Design', topic: 'SOLID Principles & Vtables', tag: 'OOP' },
            { name: 'Computer Architecture', topic: '5-Stage MIPS Pipelining', tag: 'Architecture' },
            { name: 'Software Engineering', topic: 'Microservices & CI/CD Pipelines', tag: 'SE' },
            { name: 'Language Runtimes', topic: 'Memory Layout & Event Loop', tag: 'Runtimes' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage('learning-studio')}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151821] hover:border-[#4F46E5] dark:hover:border-cyan-400 text-left transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800">
                  {item.tag}
                </span>
                <p className="text-xs font-bold text-[#202334] dark:text-white mt-2 group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {item.topic}
                </p>
              </div>
              <span className="text-[10px] text-indigo-600 dark:text-cyan-400 font-semibold mt-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read Module <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Comprehensive Practice Tracks (All 6 core modules) */}
      <div className="p-5 sm:p-6 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#202334] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span>Explore Practice Hub</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pick a focused preparation module to build proficiency and confidence.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('practice')}
            className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Modules</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setCurrentPage('aptitude')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151821] hover:border-[#4F46E5] dark:hover:border-cyan-400 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#4F46E5] dark:text-cyan-400 mb-2.5 transition-transform group-hover:scale-105">
              <Calculator className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#202334] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
              Aptitude & Reasoning
            </p>
            <span className="text-[11px] text-slate-400">24 Curated MCQs</span>
          </button>

          <button
            onClick={() => setCurrentPage('coding')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151821] hover:border-[#4F46E5] dark:hover:border-cyan-400 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#4F46E5] dark:text-cyan-400 mb-2.5 transition-transform group-hover:scale-105">
              <Code2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#202334] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
              Algorithmic Coding
            </p>
            <span className="text-[11px] text-slate-400">10 Problems & Runner</span>
          </button>

          <button
            onClick={() => setCurrentPage('technical')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151821] hover:border-[#4F46E5] dark:hover:border-cyan-400 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#4F46E5] dark:text-cyan-400 mb-2.5 transition-transform group-hover:scale-105">
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#202334] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
              Technical Concepts
            </p>
            <span className="text-[11px] text-slate-400">System Design, OS, DBMS</span>
          </button>

          <button
            onClick={() => setCurrentPage('communication')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151821] hover:border-[#4F46E5] dark:hover:border-cyan-400 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#4F46E5] dark:text-cyan-400 mb-2.5 transition-transform group-hover:scale-105">
              <MessageCircle className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#202334] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
              Communication Drills
            </p>
            <span className="text-[11px] text-slate-400">STAR Method Templates</span>
          </button>

          <button
            onClick={() => setCurrentPage('interview')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151821] hover:border-[#4F46E5] dark:hover:border-cyan-400 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#4F46E5] dark:text-cyan-400 mb-2.5 transition-transform group-hover:scale-105">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#202334] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
              Mock Interview
            </p>
            <span className="text-[11px] text-slate-400">Speech & AI Feedback</span>
          </button>

          <button
            onClick={() => setCurrentPage('resume')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151821] hover:border-[#4F46E5] dark:hover:border-cyan-400 text-left transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-[#4F46E5] dark:text-cyan-400 mb-2.5 transition-transform group-hover:scale-105">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#202334] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
              Resume Builder
            </p>
            <span className="text-[11px] text-slate-400">3 ATS Templates & Export</span>
          </button>
        </div>
      </div>
    </CinematicBackground>
  );
};
