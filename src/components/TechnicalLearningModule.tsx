import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  FileText,
  Target,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  Bookmark,
  Share2,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface DetailedStudyModule {
  id: string;
  title: string;
  branchCategory: string;
  estimatedMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';

  // 1. Learning Objectives
  learningObjectives: string[];

  // 2. Prerequisites
  prerequisites: string[];

  // 3. Concept Explanation
  conceptExplanation: string;

  // 4. How It Works (Mechanism & Workflow)
  howItWorks: string[];

  // 5. Key Terminology (Definitions)
  keyTerminology: { term: string; definition: string }[];

  // 6. Worked Example
  workedExample: {
    title: string;
    scenario: string;
    stepByStep: string[];
    takeaway: string;
  };

  // 7. Practical Industrial Application
  practicalApplication: string;

  // 8. Code, Formulas, or Architecture Diagram
  technicalArtifact: {
    type: 'formula' | 'code' | 'diagram';
    title: string;
    content: string;
    explanation: string;
  };

  // 9. Common Mistakes & Misconceptions
  commonMistakes: { mistake: string; whyWrong: string; correctWay: string }[];

  // 10. Interview Preparation (Model Answers)
  interviewPreparation: {
    question: string;
    modelAnswer: string;
    recruiterTips: string;
  }[];

  // 11. Revision Notes (Key Takeaways)
  revisionNotes: string[];

  // 12. Knowledge Check (Self-Assessment)
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];

  // 13. Further Practice
  furtherPractice: string[];
}

export const TechnicalLearningModule: React.FC<{
  module: DetailedStudyModule;
  onClose: () => void;
}> = ({ module, onClose }) => {
  const { completeTaskByCategory, addNotification, setCurrentPage } = useApp();

  // Navigation tabs within the module
  const [activeTab, setActiveTab] = useState<
    'learn' | 'mechanism' | 'examples' | 'interview' | 'revision' | 'check'
  >('learn');

  // Knowledge check quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>(['learn']);

  const handleMarkSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections((prev) => [...prev, sectionId]);
    }
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    handleMarkSectionComplete('check');

    const total = module.knowledgeCheck.length;
    let correct = 0;
    module.knowledgeCheck.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) correct++;
    });

    const scorePct = Math.round((correct / total) * 100);

    // Sync task completion if passed >= 50%
    if (scorePct >= 50) {
      completeTaskByCategory('Technical');
      addNotification({
        title: `Module Mastered: ${module.title}`,
        message: `Scored ${scorePct}% on the knowledge check. Your technical study evidence has been recorded.`,
        type: 'achievement',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] dark:hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Technical Topics</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800">
            <Clock className="w-3.5 h-3.5 text-cyan-500" />
            <span>{module.estimatedMinutes} mins study</span>
          </span>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            {module.branchCategory}
          </span>
        </div>
      </div>

      {/* 2. Module Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
              <span>Full Engineering Study Module</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              {module.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Study the core architecture, examine worked engineering calculations, review common recruiter interview questions, and verify your understanding before testing.
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('examples')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left cursor-pointer"
            >
              ⚡ View Worked Examples
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left cursor-pointer"
            >
              🎯 Prepare Interview Q&A
            </button>
            <button
              onClick={() => setActiveTab('check')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] transition-colors text-left cursor-pointer"
            >
              📝 Take Knowledge Check
            </button>
          </div>
        </div>

        {/* Learning Objectives & Prerequisites Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#4F46E5] dark:text-cyan-400">
              <Target className="w-4 h-4" />
              <span>Learning Objectives:</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
              {module.learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Prerequisites:</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
              {module.prerequisites.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Reusable Structured Study Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {[
          { id: 'learn', label: '1. Concept & Theory', icon: BookOpen },
          { id: 'mechanism', label: '2. How It Works & Terms', icon: Layers },
          { id: 'examples', label: '3. Worked Examples & Code', icon: Code2 },
          { id: 'interview', label: '4. Interview Questions', icon: HelpCircle },
          { id: 'revision', label: '5. Revision & Pitfalls', icon: FileText },
          { id: 'check', label: '6. Knowledge Check', icon: CheckCircle2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              handleMarkSectionComplete(tab.id);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#4F46E5] text-white shadow-sm ring-2 ring-indigo-400/30'
                : 'bg-white dark:bg-[#151926] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            {completedSections.includes(tab.id) && (
              <Check className="w-3 h-3 text-emerald-400" />
            )}
          </button>
        ))}
      </div>

      {/* 4. Tab 1: Concept & Theory */}
      {activeTab === 'learn' && (
        <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              <span>Concept Fundamentals & Overview</span>
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              {module.conceptExplanation}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Lightbulb className="w-4 h-4" />
              <span>Practical Engineering Context</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {module.practicalApplication}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400">Section 1 of 6</span>
            <button
              onClick={() => {
                setActiveTab('mechanism');
                handleMarkSectionComplete('mechanism');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] transition-colors cursor-pointer"
            >
              <span>Next: How It Works</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Tab 2: How It Works & Key Terminology */}
      {activeTab === 'mechanism' && (
        <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>Mechanism & Execution Workflow</span>
            </h2>

            <div className="space-y-3">
              {module.howItWorks.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5"
                >
                  <span className="w-6 h-6 rounded-full bg-[#4F46E5] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Terminology Glossary */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Key Engineering Terminology
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {module.keyTerminology.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-[#121622] border border-indigo-100 dark:border-indigo-900/40 space-y-1"
                >
                  <span className="text-xs font-bold text-[#4F46E5] dark:text-cyan-400 block font-mono">
                    {item.term}
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('learn')}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Theory
            </button>
            <button
              onClick={() => {
                setActiveTab('examples');
                handleMarkSectionComplete('examples');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] transition-colors cursor-pointer"
            >
              <span>Next: Worked Examples</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Worked Examples & Technical Artifact */}
      {activeTab === 'examples' && (
        <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-500" />
              <span>Worked Engineering Example: {module.workedExample.title}</span>
            </h2>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span className="font-bold text-[#4F46E5] dark:text-cyan-400">Scenario:</span>{' '}
                {module.workedExample.scenario}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Step-by-Step Resolution:
                </span>
                {module.workedExample.stepByStep.map((step, idx) => (
                  <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                    <span className="font-mono text-[#4F46E5] dark:text-cyan-400 font-bold">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
                <strong>Core Takeaway:</strong> {module.workedExample.takeaway}
              </div>
            </div>
          </div>

          {/* Technical Artifact (Code, Formula, or Diagram) */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {module.technicalArtifact.title}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                {module.technicalArtifact.type.toUpperCase()}
              </span>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
              {module.technicalArtifact.content}
            </pre>

            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              {module.technicalArtifact.explanation}
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('mechanism')}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Mechanism
            </button>
            <button
              onClick={() => {
                setActiveTab('interview');
                handleMarkSectionComplete('interview');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] transition-colors cursor-pointer"
            >
              <span>Next: Interview Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Interview Preparation (Model Answers) */}
      {activeTab === 'interview' && (
        <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-violet-500" />
              <span>Campus Recruitment Interview Questions & Model Answers</span>
            </h2>

            <div className="space-y-4">
              {module.interviewPreparation.map((qa, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      "{qa.question}"
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#151926] border border-slate-200/70 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-[#4F46E5] dark:text-cyan-400 block mb-1">
                      Recommended Model Answer:
                    </span>
                    {qa.modelAnswer}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span><strong>Recruiter Tip:</strong> {qa.recruiterTips}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('examples')}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Examples
            </button>
            <button
              onClick={() => {
                setActiveTab('revision');
                handleMarkSectionComplete('revision');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] transition-colors cursor-pointer"
            >
              <span>Next: Revision & Pitfalls</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Revision & Common Pitfalls */}
      {activeTab === 'revision' && (
        <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Quick Revision Cheat Sheet</span>
            </h2>

            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide block">
                5-Minute Exam & Interview Summary:
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                {module.revisionNotes.map((note, idx) => (
                  <li key={idx} className="leading-relaxed">{note}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Common Engineering Mistakes to Avoid</span>
            </h3>

            <div className="space-y-3">
              {module.commonMistakes.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1.5 text-xs"
                >
                  <p className="font-bold text-rose-700 dark:text-rose-300">
                    ❌ Mistake: {m.mistake}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong>Why It Fails:</strong> {m.whyWrong}
                  </p>
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                    ✓ Correct Approach: {m.correctWay}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('interview')}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Interview Prep
            </button>
            <button
              onClick={() => {
                setActiveTab('check');
                handleMarkSectionComplete('check');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] transition-colors cursor-pointer"
            >
              <span>Next: Knowledge Check</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 9. Tab 6: Knowledge Check (Assessment After Learning) */}
      {activeTab === 'check' && (
        <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Verify Your Understanding (Knowledge Check)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Answer the questions below to test your mastery of {module.title}. Passing records verified technical evidence into your profile.
            </p>
          </div>

          <div className="space-y-6">
            {module.knowledgeCheck.map((q, qIdx) => {
              const selected = selectedAnswers[qIdx];
              const isAnswered = selected !== undefined;
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={qIdx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
                >
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    <span className="font-mono text-[#4F46E5] dark:text-cyan-400 mr-2">
                      Q{qIdx + 1}.
                    </span>
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selected === optIdx;
                      let optClass = 'bg-white dark:bg-[#151926] border-slate-200 dark:border-slate-800 hover:border-indigo-400';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                        } else if (isOptionSelected) {
                          optClass = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300';
                        }
                      } else if (isOptionSelected) {
                        optClass = 'bg-indigo-50 dark:bg-indigo-950/50 border-[#4F46E5] dark:border-cyan-400 text-[#4F46E5] dark:text-cyan-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optClass}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-[#4F46E5] dark:text-cyan-400 block mb-0.5">
                        Technical Explanation:
                      </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setActiveTab('revision')}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
            >
              ← Review Revision Notes
            </button>

            <div className="flex items-center gap-3">
              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < module.knowledgeCheck.length}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                >
                  Submit Knowledge Check
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
                >
                  Retry Test
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
              >
                Finished Studying
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
