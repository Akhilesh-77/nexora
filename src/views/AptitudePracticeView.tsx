import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Brain,
  BookOpen,
  PieChart,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Award,
  ChevronRight,
  Check,
  Target,
  RefreshCw,
} from 'lucide-react';
import { APTITUDE_QUESTION_BANK } from '../data/mockData';
import { AptitudeQuestion } from '../types';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const AptitudePracticeView: React.FC = () => {
  const { completeTaskByCategory, submitQuizAttempt } = useApp();
  const categories: Array<'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Ability' | 'Data Interpretation'> = [
    'Quantitative Aptitude',
    'Logical Reasoning',
    'Verbal Ability',
    'Data Interpretation',
  ];

  const [selectedCategory, setSelectedCategory] = useState<
    'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Ability' | 'Data Interpretation'
  >('Quantitative Aptitude');

  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isCategoryCompleted, setIsCategoryCompleted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [verifiedResult, setVerifiedResult] = useState<any | null>(null);

  // Map selected category to database subject
  const getSubjectForCategory = (cat: string) => {
    switch (cat) {
      case 'Logical Reasoning':
        return 'Logical Reasoning & Critical Thinking';
      case 'Verbal Ability':
        return 'Verbal Ability & Technical Communication';
      case 'Data Interpretation':
      case 'Quantitative Aptitude':
      default:
        return 'Quantitative Aptitude';
    }
  };

  // Load questions dynamically from MongoDB with fallback
  const fetchQuestions = async () => {
    setLoading(true);
    setActiveQuestionIndex(0);
    setAnswers({});
    setIsCategoryCompleted(false);
    setVerifiedResult(null);

    const subject = getSubjectForCategory(selectedCategory);

    try {
      const res = await api.quiz.generateQuiz({
        subject,
        difficulty: selectedDifficulty === 'All' ? undefined : selectedDifficulty,
        length: 10,
      });

      if (res.success && res.data?.questions && res.data.questions.length > 0) {
        const loaded: AptitudeQuestion[] = res.data.questions.map((q: any, i: number) => ({
          id: q._id || `apt-db-${i}`,
          category: selectedCategory,
          topic: q.topic || 'General Practice',
          difficulty: q.difficulty || 'Medium',
          question: q.question,
          options: q.options || [],
          correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
          explanation: q.hints?.[0] || 'Apply standard formulas and logical principles to verify options.',
          formulaOrTip: q.tags?.[0] ? `Concept: ${q.tags.join(', ')}` : undefined,
        }));
        setQuestions(loaded);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Aptitude API fetch failed, using built-in questions:', e);
    }

    // Fallback to built-in question bank
    const fallback = APTITUDE_QUESTION_BANK.filter((q) => {
      const matchesCat = q.category === selectedCategory;
      const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      return matchesCat && matchesDiff;
    });

    setQuestions(fallback.length > 0 ? fallback : APTITUDE_QUESTION_BANK.slice(0, 5));
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, selectedDifficulty]);

  const currentQ: AptitudeQuestion | undefined = questions[activeQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [activeQuestionIndex]: optIndex,
    }));
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < totalQuestions - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  const handleFinishDrill = async () => {
    setIsSubmitting(true);
    try {
      // Map answers to question IDs for server evaluation if from MongoDB
      const answersMap: Record<string, number> = {};
      questions.forEach((q, idx) => {
        if (answers[idx] !== undefined) {
          answersMap[q.id] = answers[idx];
        }
      });

      const res = await submitQuizAttempt({
        subject: getSubjectForCategory(selectedCategory),
        difficulty: selectedDifficulty === 'All' ? 'Medium' : selectedDifficulty,
        answers: answersMap,
      });

      if (res) {
        setVerifiedResult(res);
      }
      completeTaskByCategory('Aptitude');
    } catch (e) {
      console.error('Failed to submit aptitude drill to DB:', e);
    } finally {
      setIsSubmitting(false);
      setIsCategoryCompleted(true);
    }
  };

  // Calculate score if verifiedResult is not available yet
  let localCorrect = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.correctIndex) {
      localCorrect++;
    }
  });

  const finalScore = verifiedResult ? verifiedResult.score : Math.round((localCorrect / (totalQuestions || 1)) * 100);
  const finalCorrect = verifiedResult ? verifiedResult.correctCount : localCorrect;

  return (
    <div className="space-y-6 pb-12 transition-colors">
      {/* Category Tabs Header */}
      <div className="p-6 sm:p-7 rounded-3xl card-cinematic luminous-border relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>Campus Screening Aptitude Drill</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202334] dark:text-white tracking-tight">
              Aptitude & Reasoning Training Lab
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1 max-w-xl">
              Sharpen your arithmetic speed, pattern recognition, and verbal comprehension with instant step-by-step explanations and formulas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center min-w-[150px] shrink-0 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Answered
            </span>
            <div className="text-2xl font-extrabold text-cyan-500 font-mono mt-0.5">
              {answeredCount} / {totalQuestions}
            </div>
            <p className="text-[11px] text-slate-400">
              Questions in session
            </p>
          </div>
        </div>

        {/* Category Pickers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          {[
            { id: 'Quantitative Aptitude', label: 'Quantitative', icon: Calculator },
            { id: 'Logical Reasoning', label: 'Logical Reasoning', icon: Brain },
            { id: 'Verbal Ability', label: 'Verbal Ability', icon: BookOpen },
            { id: 'Data Interpretation', label: 'Data Interpretation', icon: PieChart },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-md'
                    : 'bg-white/60 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-[#4F46E5] dark:hover:text-white'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#202431] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Difficulty:</span>
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedDifficulty === d
                  ? 'bg-[#4F46E5] text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={fetchQuestions}
          className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-medium cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reload New Batch
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-12 text-center card-cinematic rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Sampling 10 verified aptitude questions from database...</p>
        </div>
      ) : isCategoryCompleted ? (
        /* Session Completion Card */
        <div className="p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#202334] dark:text-white">
              {selectedCategory} Completed!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Your drill attempt has been evaluated and permanently recorded into your MongoDB learning history.
            </p>
          </div>

          <div className="grid grid-cols-2 max-w-sm mx-auto gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Score & Accuracy</span>
              <p className="text-xl font-black text-[#202334] dark:text-white font-mono mt-0.5">
                {finalCorrect} / {totalQuestions}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Percentage</span>
              <p className="text-xl font-black text-cyan-500 font-mono mt-0.5">
                {finalScore}%
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={fetchQuestions}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Another Batch</span>
            </button>
          </div>
        </div>
      ) : currentQ ? (
        /* Main Question Workspace */
        <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40">
                {currentQ.topic}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>

            <span className="text-xs font-bold text-[#4F46E5] dark:text-cyan-400">
              Question {activeQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>

          {/* Question Jumper Grid */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {questions.map((_, i) => {
              const isAnswered = answers[i] !== undefined;
              const isCurrent = i === activeQuestionIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveQuestionIndex(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isCurrent
                      ? 'bg-[#4F46E5] text-white ring-2 ring-[#4F46E5]/40'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = answers[activeQuestionIndex] === optIdx;

              let style = 'bg-slate-50/70 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-[#4F46E5] text-slate-800 dark:text-slate-200';
              if (isSelected) {
                style = 'bg-indigo-50 dark:bg-indigo-950/50 border-[#4F46E5] dark:border-cyan-400 text-[#4F46E5] dark:text-cyan-300 font-bold';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm">{opt}</span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#4F46E5] bg-[#4F46E5] text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              disabled={activeQuestionIndex === 0}
              onClick={handlePrevQuestion}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {activeQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="btn-cinematic flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinishDrill}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Drill for Evaluation'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
