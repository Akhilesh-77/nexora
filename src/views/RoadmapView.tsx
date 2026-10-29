import React, { useState } from 'react';
import {
  Map,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Target,
  Play,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoadmapTopic, RoadmapPhase } from '../types';
import { CinematicBackground } from '../components/CinematicBackground';

export const RoadmapView: React.FC = () => {
  const {
    profile,
    assessmentResult,
    roadmapPhases,
    toggleRoadmapTopic,
    setCurrentPage,
  } = useApp();

  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'phase-1': true,
    'phase-2': true,
  });

  const [selectedTopic, setSelectedTopic] = useState<{
    phase: RoadmapPhase;
    topic: RoadmapTopic;
  } | null>(null);

  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  // Calculate phase progress
  const getPhaseProgress = (phase: RoadmapPhase) => {
    if (phase.topics.length === 0) return 0;
    const completed = phase.topics.filter((t) => t.completed).length;
    return Math.round((completed / phase.topics.length) * 100);
  };

  const totalTopics = roadmapPhases.reduce((acc, p) => acc + p.topics.length, 0);
  const totalCompletedTopics = roadmapPhases.reduce(
    (acc, p) => acc + p.topics.filter((t) => t.completed).length,
    0
  );
  const overallRoadmapProgress = Math.round((totalCompletedTopics / totalTopics) * 100);

  return (
    <CinematicBackground variant="dashboard" className="space-y-6 pb-12">
      {/* Roadmap Header Banner */}
      <div className="card-cinematic p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Personalized for {profile.targetRole} • {profile.branch}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              5-Phase Placement Preparation Roadmap
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Curated using your diagnostic assessment baseline. Designed around your daily{' '}
              <span className="text-[#4F46E5] dark:text-cyan-400 font-semibold">{profile.studyTime}</span> study goal
              to prepare you thoroughly for competitive campus placement drives.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center min-w-[150px] shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Roadmap Progress
            </span>
            <div className="text-3xl font-extrabold text-[#4F46E5] dark:text-cyan-400 font-mono mt-1">
              {overallRoadmapProgress}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {totalCompletedTopics} of {totalTopics} topics mastered
            </p>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] shrink-0" />
          <span>
            Adaptive guidance: Following this roadmap builds comprehensive competency for recruitment rounds; final hiring decisions depend on individual company evaluation.
          </span>
        </div>
      </div>

      {/* 5 PHASES LIST */}
      <div className="space-y-4">
        {roadmapPhases.map((phase, index) => {
          const isExpanded = !!expandedPhases[phase.id];
          const progress = getPhaseProgress(phase);

          return (
            <div
              key={phase.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
            >
              {/* Phase Header Accordion Toggle */}
              <div
                onClick={() => togglePhaseExpand(phase.id)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-violet-600/10 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-bold text-sm flex items-center justify-center shrink-0 border border-violet-500/20">
                    0{index + 1}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {phase.title}
                      </h2>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {phase.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {progress}%
                    </span>
                    <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button className="p-2 text-slate-400 hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Phase Body (Objectives + Topics) */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                  {/* Learning Objectives */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-cyan-500" />
                      Phase Objectives:
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {phase.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Topic Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          topic.completed
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-500/30'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-violet-500/40 hover:shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                              <Clock className="w-3 h-3" /> {topic.duration}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                topic.completed
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {topic.completed ? 'Completed' : 'Pending'}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {topic.title}
                          </h4>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {topic.description}
                          </p>

                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {topic.keyConcepts.slice(0, 3).map((kc) => (
                              <span
                                key={kc}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                              >
                                {kc}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Working Actions: View Notes / Toggle */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedTopic({ phase, topic })}
                            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> Study Material
                          </button>

                          <button
                            onClick={() => toggleRoadmapTopic(phase.id, topic.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              topic.completed
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800'
                                : 'bg-violet-600 text-white hover:bg-violet-500 shadow-sm'
                            }`}
                          >
                            {topic.completed ? 'Mark Pending' : 'Mark Done'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* TOPIC DETAIL & STUDY MODAL */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  {selectedTopic.phase.title}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {selectedTopic.topic.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Overview:</h4>
                <p className="leading-relaxed">{selectedTopic.topic.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Key Placement Concepts to Master:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTopic.topic.keyConcepts.map((kc, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{kc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/40">
                <h4 className="font-bold text-violet-900 dark:text-violet-200 mb-1 flex items-center gap-1.5 text-xs">
                  <Target className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  Associated Practice Challenge:
                </h4>
                <p className="text-xs text-violet-800 dark:text-violet-300 leading-relaxed">
                  {selectedTopic.topic.practiceTask}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={() => {
                  toggleRoadmapTopic(selectedTopic.phase.id, selectedTopic.topic.id);
                  setSelectedTopic(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {selectedTopic.topic.completed ? 'Mark Incomplete' : 'Confirm Topic Completion'}
              </button>

              <button
                onClick={() => {
                  setSelectedTopic(null);
                  setCurrentPage('coding');
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md transition-all"
              >
                <span>Jump to Coding Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </CinematicBackground>
  );
};
