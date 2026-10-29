import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Bookmark,
  Share2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  Clock,
  Layers,
  ChevronRight,
  Check,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  Code2,
  FileText,
  HelpCircle,
  Save,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const LearningStudioView: React.FC = () => {
  const {
    profile,
    completedModules,
    completedLessons,
    bookmarks,
    notes,
    completeLesson,
    toggleBookmark,
    saveModuleNote,
  } = useApp();

  const [selectedBranch, setSelectedBranch] = useState<string>(
    profile.branch || 'Computer Science and Engineering'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modules list from server
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Open Module
  const [activeModule, setActiveModule] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'learn' | 'examples' | 'mistakes' | 'practice' | 'quiz' | 'notes'>('learn');

  // Interactive Quiz Answers inside reader
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Note editing state
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // Load modules list from API
  useEffect(() => {
    setLoading(true);
    api.modules
      .getModules({
        branch: selectedBranch === 'All' ? undefined : selectedBranch,
        subject: selectedSubject === 'All' ? undefined : selectedSubject,
        search: searchQuery || undefined,
      })
      .then((res) => {
        if (res.success && res.data?.modules) {
          setModules(res.data.modules);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedBranch, selectedSubject, searchQuery]);

  // Load full module details when activeModule changes
  const handleOpenModule = async (moduleId: string) => {
    try {
      const res = await api.modules.getModule(moduleId);
      if (res.success && res.data?.module) {
        setActiveModule(res.data.module);
        setActiveTab('learn');
        setQuizAnswers({});
        setQuizSubmitted(false);
        setCurrentNoteText(notes[moduleId] || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      console.warn('Failed to load module details:', e);
    }
  };

  const handleMarkComplete = async () => {
    if (!activeModule) return;
    await completeLesson(activeModule.moduleId, activeModule.moduleId);
  };

  const handleToggleBookmark = async () => {
    if (!activeModule) return;
    await toggleBookmark(activeModule.moduleId);
  };

  const handleSaveNote = async () => {
    if (!activeModule) return;
    await saveModuleNote(activeModule.moduleId, currentNoteText);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2500);
  };

  // Previous and Next module navigation
  const currentIndex = modules.findIndex((m) => m.moduleId === activeModule?.moduleId);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 && currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* IF MODULE IS OPEN: RENDER DETAILED INTERACTIVE READER */}
      {activeModule ? (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveModule(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#4F46E5] dark:hover:text-cyan-400 cursor-pointer self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Learning Studio Library</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleBookmark}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  bookmarks.includes(activeModule.moduleId)
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(activeModule.moduleId) ? 'fill-current' : ''}`} />
                <span>{bookmarks.includes(activeModule.moduleId) ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                type="button"
                onClick={handleMarkComplete}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  completedModules.includes(activeModule.moduleId)
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-[#4F46E5] dark:text-cyan-300 hover:bg-[#4F46E5] hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedModules.includes(activeModule.moduleId) ? 'Mastered & Completed' : 'Mark as Complete'}</span>
              </button>
            </div>
          </div>

          {/* Module Title Banner */}
          <div className="p-6 sm:p-7 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-indigo-600 dark:text-cyan-400">{activeModule.branch}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">{activeModule.subject}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {activeModule.estimatedMinutes || 25} mins
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              {activeModule.title}
            </h1>
          </div>

          {/* Reader Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-3 overflow-x-auto pb-1 text-xs sm:text-sm">
            {[
              { id: 'learn', label: 'Concept & Theory', icon: BookOpen },
              { id: 'examples', label: 'Worked Examples', icon: Lightbulb },
              { id: 'mistakes', label: 'Applications & Pitfalls', icon: AlertTriangle },
              { id: 'practice', label: 'Practice Exercises', icon: Code2 },
              { id: 'quiz', label: 'Knowledge Check', icon: HelpCircle },
              { id: 'notes', label: 'My Notes', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 pb-2.5 px-3 font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#4F46E5] text-[#4F46E5] dark:border-cyan-400 dark:text-cyan-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT: 1. CONCEPT & THEORY */}
          {activeTab === 'learn' && (
            <div className="space-y-6">
              {/* Simple Definition Box */}
              <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-1.5">
                <span className="text-[11px] font-bold text-[#4F46E5] dark:text-cyan-400 uppercase tracking-wider block">
                  Core Engineering Definition
                </span>
                <p className="text-sm sm:text-base font-semibold text-[#111827] dark:text-white leading-relaxed">
                  {activeModule.simpleDefinition}
                </p>
              </div>

              {/* Detailed Technical Explanation */}
              <div className="p-6 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-[#111827] dark:text-white">Technical Deep-Dive</h3>
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-3">
                  {activeModule.detailedExplanation}
                </div>
              </div>

              {/* Technical Artifact (Formula / Code / Diagram) */}
              {activeModule.technicalArtifact && (
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800 space-y-2 shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800">
                    <span>{activeModule.technicalArtifact.title}</span>
                    <span className="uppercase text-cyan-400">{activeModule.technicalArtifact.type}</span>
                  </div>
                  <pre className="overflow-x-auto py-2 leading-relaxed text-cyan-300">
                    {activeModule.technicalArtifact.content}
                  </pre>
                  {activeModule.technicalArtifact.explanation && (
                    <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800">
                      {activeModule.technicalArtifact.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Important Terminology */}
              {activeModule.importantTerminology && activeModule.importantTerminology.length > 0 && (
                <div className="p-6 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="text-base font-bold text-[#111827] dark:text-white">Essential Terminology</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {activeModule.importantTerminology.map((item: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                        <span className="font-bold text-[#4F46E5] dark:text-cyan-400">{item.term}</span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 2. WORKED EXAMPLES */}
          {activeTab === 'examples' && (
            <div className="space-y-4">
              {activeModule.workedExamples && activeModule.workedExamples.length > 0 ? (
                activeModule.workedExamples.map((ex: any, i: number) => (
                  <div key={i} className="p-6 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-[#4F46E5] dark:text-cyan-400 font-bold flex items-center justify-center text-xs">
                        {i + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#111827] dark:text-white">{ex.title}</h3>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="font-bold text-[#111827] dark:text-white block mb-1">Scenario:</span>
                      {ex.scenario}
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Step-by-Step Solution:</span>
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 pl-1">
                        {ex.stepByStep?.map((step: string, sIdx: number) => (
                          <li key={sIdx} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>

                    {ex.takeaway && (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                        <span className="font-bold">Engineering Takeaway:</span> {ex.takeaway}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 card-cinematic rounded-2xl border">
                  Worked examples will be populated for this module soon.
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 3. MISTAKES & APPLICATIONS */}
          {activeTab === 'mistakes' && (
            <div className="space-y-4">
              {/* Common Mistakes */}
              {activeModule.commonMistakes && activeModule.commonMistakes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Common Technical Pitfalls & Misconceptions</h3>
                  {activeModule.commonMistakes.map((m: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-[#151821] border border-rose-200 dark:border-rose-900/40 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Pitfall: {m.mistake}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 pl-6">
                        <span className="font-semibold text-rose-700 dark:text-rose-300">Why it fails:</span> {m.whyWrong}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 pl-6">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Correct Engineering Approach:</span> {m.correctWay}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Practical Applications */}
              {activeModule.practicalApplications && activeModule.practicalApplications.length > 0 && (
                <div className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <h3 className="text-sm font-bold text-[#111827] dark:text-white">Real-World Industrial Applications</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                    {activeModule.practicalApplications.map((app: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{app}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 4. PRACTICE EXERCISES */}
          {activeTab === 'practice' && (
            <div className="space-y-4">
              {activeModule.practiceExercises && activeModule.practiceExercises.length > 0 ? (
                activeModule.practiceExercises.map((pex: any, i: number) => (
                  <div key={i} className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                    <h3 className="text-sm font-bold text-[#111827] dark:text-white">{pex.title}</h3>
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 leading-relaxed">
                      {pex.problem}
                    </p>
                    <details className="cursor-pointer group">
                      <summary className="font-bold text-[#4F46E5] dark:text-cyan-400 hover:underline">
                        View Solution & Hint
                      </summary>
                      <div className="mt-2 p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/50 space-y-2">
                        <p><span className="font-bold">Hint:</span> {pex.hint}</p>
                        <p className="pt-1 border-t border-indigo-200/40 dark:border-indigo-800/40 font-mono text-emerald-700 dark:text-emerald-300">
                          <span className="font-bold font-sans">Solution:</span> {pex.solution}
                        </p>
                      </div>
                    </details>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 card-cinematic rounded-2xl border">
                  Practice exercises are being formulated for this module.
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 5. KNOWLEDGE CHECK QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {activeModule.knowledgeCheck && activeModule.knowledgeCheck.length > 0 ? (
                activeModule.knowledgeCheck.map((q: any, i: number) => {
                  const selected = quizAnswers[i];
                  const hasAnswered = selected !== undefined;
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div key={i} className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                      <p className="font-bold text-sm text-[#111827] dark:text-white leading-relaxed">
                        {i + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options?.map((opt: string, optIdx: number) => {
                          const isOptionSelected = selected === optIdx;
                          let btnStyle = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#4F46E5]';

                          if (hasAnswered) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold';
                            } else if (isOptionSelected) {
                              btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-800 dark:text-rose-300';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => {
                                setQuizAnswers({ ...quizAnswers, [i]: optIdx });
                              }}
                              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && optIdx === q.correctIndex && (
                                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <div
                          className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                            isCorrect
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <span className="font-bold">{isCorrect ? 'Correct! ' : 'Incorrect. '}</span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-slate-400 card-cinematic rounded-2xl border">
                  Knowledge check self-assessment questions are currently being loaded.
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 6. PERSONAL NOTES (SAVED TO MONGODB) */}
          {activeTab === 'notes' && (
            <div className="p-6 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111827] dark:text-white">Private Revision Notes</h3>
                  <p className="text-xs text-slate-400">Saved directly to your account profile in real-time.</p>
                </div>
                {noteSavedFeedback && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved to Database!</span>
                  </span>
                )}
              </div>

              <textarea
                rows={6}
                value={currentNoteText}
                onChange={(e) => setCurrentNoteText(e.target.value)}
                placeholder="Jot down formulas, lab findings, exam hints, or personal takeaways..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-[#111827] dark:text-white focus:outline-none focus:border-[#4F46E5] font-sans"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="btn-cinematic flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Notes to Database</span>
                </button>
              </div>
            </div>
          )}

          {/* Previous / Next Lesson Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
            {prevModule ? (
              <button
                type="button"
                onClick={() => handleOpenModule(prevModule.moduleId)}
                className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev: {prevModule.title}</span>
              </button>
            ) : <div />}

            {nextModule ? (
              <button
                type="button"
                onClick={() => handleOpenModule(nextModule.moduleId)}
                className="flex items-center gap-2 font-bold text-[#4F46E5] dark:text-cyan-400 hover:underline cursor-pointer"
              >
                <span>Next: {nextModule.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </div>
      ) : (
        /* LIBRARY VIEW: SELECT BRANCH, SUBJECT, SEARCH */
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 rounded-3xl card-cinematic border border-slate-200 dark:border-indigo-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Branch-Specific Learning Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                Curated Engineering Learning Modules
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Master domain-specific concepts with step-by-step worked solutions, real-world industrial cases, common pitfalls, and verifiable knowledge checks.
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules by topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none"
              >
                <option value="All">All Engineering Branches</option>
                <option value="Computer Science and Engineering">CSE</option>
                <option value="Information Science and Engineering">ISE</option>
                <option value="Electronics and Communication Engineering">ECE</option>
                <option value="Electrical and Electronics Engineering">EEE</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="Chemical Engineering">Chemical</option>
                <option value="Civil Engineering">Civil</option>
                <option value="Artificial Intelligence and Machine Learning">AI/ML</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full py-12 text-center text-slate-400">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs">Loading structured learning modules...</p>
              </div>
            ) : modules.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 card-cinematic rounded-2xl border">
                <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold">No learning modules found matching your current filter.</p>
                <p className="text-xs text-slate-400 mt-1">Try selecting "All Engineering Branches" to explore all domains.</p>
              </div>
            ) : (
              modules.map((m) => {
                const isCompleted = completedModules.includes(m.moduleId);
                const isBookmarked = bookmarks.includes(m.moduleId);

                return (
                  <div
                    key={m.moduleId}
                    onClick={() => handleOpenModule(m.moduleId)}
                    className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-[#4F46E5] dark:hover:border-cyan-500/50 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 text-[10px]">
                          {m.branch}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isCompleted && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Done</span>
                            </span>
                          )}
                          {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block">{m.subject}</span>
                        <h3 className="text-sm sm:text-base font-bold text-[#111827] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {m.title}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{m.estimatedMinutes || 25} mins</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#4F46E5] dark:text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                        <span>Study Module</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

