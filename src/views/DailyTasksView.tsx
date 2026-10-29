import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Filter,
  Trophy,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CinematicBackground } from '../components/CinematicBackground';

export const DailyTasksView: React.FC = () => {
  const {
    dailyTasks,
    toggleTask,
    generateDailyTasks,
    setCurrentPage,
    profile,
    assessmentResult,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filterOptions = [
    'All',
    'Pending',
    'Completed',
    'Aptitude',
    'Coding',
    'Technical',
    'Interview Preparation',
  ];

  const filteredTasks = dailyTasks.filter((task) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Pending') return !task.completed;
    if (activeFilter === 'Completed') return task.completed;
    return task.category === activeFilter;
  });

  const completedCount = dailyTasks.filter((t) => t.completed).length;
  const totalCount = dailyTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <CinematicBackground variant="dashboard" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="card-cinematic p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Priority Gap Target: {assessmentResult?.priorityCompetencyGaps?.[0] || assessmentResult?.weakAreas?.[0] || 'Technical & DSA'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              NEXORA TODAY — Learning Interventions
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Curated daily practice blocks matching your{' '}
              <span className="text-[#4F46E5] dark:text-cyan-400 font-semibold">{profile.studyTime}</span> study window.
              Completing daily interventions directly expands your Role Competency Coverage and reinforces verified skill evidence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center min-w-[130px]">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Interventions Done
              </span>
              <div className="text-2xl font-extrabold text-[#4F46E5] dark:text-cyan-400 font-mono mt-1">
                {completedCount} / {totalCount}
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#4F46E5] to-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={generateDailyTasks}
              className="btn-cinematic flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-2xl text-white text-xs font-bold text-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Completion Celebration Hero Card if 100% */}
      {progressPercent === 100 && totalCount > 0 && (
        <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 shadow-lg flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-900 dark:text-white">All Tasks Completed Today! 🎉</h3>
              <p className="text-xs text-emerald-700 dark:text-slate-300 mt-0.5">
                Outstanding dedication! Your daily streak is securely locked in. Take a quick break or explore the Aptitude Lab.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('placement')}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm shrink-0"
          >
            Launch Placement Sim
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === f
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No tasks found in this filter category.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-80'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-500/40 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                      : 'border-slate-300 dark:border-slate-700 hover:border-violet-500'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                        task.category === 'Aptitude'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          : task.category === 'Coding'
                          ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400'
                          : task.category === 'Technical'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400'
                          : 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400'
                      }`}
                    >
                      {task.category}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" /> {task.estimatedTime}
                    </span>

                    <span className="text-[11px] text-slate-400">• Level: {task.difficulty}</span>
                  </div>

                  <h3
                    className={`text-base font-bold ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {task.description}
                  </p>

                  <div className="pt-1 text-[11px] text-violet-600 dark:text-violet-400 flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3 h-3 text-cyan-500" />
                    <span>Why recommended: {task.whyRecommended}</span>
                  </div>
                </div>
              </div>

              {/* Start Task Action */}
              <div className="shrink-0 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentPage(task.actionPage)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    task.completed
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/20'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{task.completed ? 'Review' : 'Start Practice'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </CinematicBackground>
  );
};
