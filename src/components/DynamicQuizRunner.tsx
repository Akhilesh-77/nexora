import React, { useState } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Check,
  X,
  Layers,
  ChevronRight,
  Target,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const DynamicQuizRunner: React.FC<{
  initialSubject?: string;
  initialDifficulty?: string;
  onClose?: () => void;
}> = ({ initialSubject, initialDifficulty, onClose }) => {
  const { profile, submitQuizAttempt } = useApp();

  // Step 1: Config
  const [step, setStep] = useState<'config' | 'taking' | 'results'>('config');
  const [subject, setSubject] = useState(initialSubject || 'Data Structures & Algorithms');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(
    (initialDifficulty as any) || 'Medium'
  );
  const [quizLength, setQuizLength] = useState<number>(10);
  const [branch, setBranch] = useState(profile.branch || 'Computer Science and Engineering');

  // Step 2: Taking Quiz
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [quizNotice, setQuizNotice] = useState<string | null>(null);

  // Step 3: Results
  const [results, setResults] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleStartQuiz = async () => {
    setLoading(true);
    setQuizNotice(null);
    try {
      const res = await api.quiz.generateQuiz({
        branch: branch === 'All' ? undefined : branch,
        subject,
        difficulty,
        length: quizLength,
      });

      if (res.success && res.data?.questions && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
        setAnswers({});
        setCurrentIndex(0);
        setStep('taking');
        if (res.data.message) {
          setQuizNotice(res.data.message);
        }
      } else {
        setQuizNotice(
          res.data?.message || 'No questions found for this combination. Please adjust subject or difficulty.'
        );
      }
    } catch (e: any) {
      setQuizNotice('Failed to generate quiz from database.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId: string, optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const payload = {
        branch,
        subject,
        difficulty,
        role: profile.targetRole,
        answers,
      };

      const result = await submitQuizAttempt(payload);
      if (result) {
        setResults(result);
        setStep('results');
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* CONFIGURATION STEP */}
      {step === 'config' && (
        <div className="card-cinematic p-7 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 mb-2">
                <Target className="w-3.5 h-3.5" />
                <span>MongoDB-Backed Randomized Quiz</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white">
                Launch Timed Assessment Drill
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Questions are randomly sampled from your verified 3,500+ database question bank and evaluated server-side.
              </p>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

          {quizNotice && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-800 dark:text-amber-300">
              {quizNotice}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">Target Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 font-semibold"
              >
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Database Management Systems">Database Management Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Digital Electronics & Embedded Systems">Digital Electronics & Embedded</option>
                <option value="Signals, Systems & Communication">Signals, Systems & Communication</option>
                <option value="Electrical Machines & Power Systems">Electrical Machines & Power Systems</option>
                <option value="Control Systems & Instrumentation">Control Systems & Instrumentation</option>
                <option value="Thermodynamics & Thermal Engineering">Thermodynamics & Thermal</option>
                <option value="Fluid Mechanics & Heat Transfer">Fluid Mechanics & Heat Transfer</option>
                <option value="Chemical Reaction Engineering & Plant Design">Chemical Reaction Engineering</option>
                <option value="Structural Analysis & Concrete Mechanics">Structural Analysis & Concrete</option>
                <option value="Surveying & Geotechnical Engineering">Surveying & Geotechnical</option>
                <option value="Machine Learning & Artificial Intelligence">Machine Learning & AI</option>
                <option value="Quantitative Aptitude">Quantitative Aptitude</option>
                <option value="Logical Reasoning & Critical Thinking">Logical Reasoning & Critical Thinking</option>
                <option value="Verbal Ability & Technical Communication">Verbal Ability & Communication</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">Target Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      difficulty === d
                        ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                        : 'bg-slate-50 dark:bg-[#121622] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">Quiz Length</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setQuizLength(len)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      quizLength === len
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-[#121622] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {len} Qs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1.5 text-slate-700 dark:text-slate-300">Engineering Branch Filter</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 font-semibold"
              >
                <option value="All">All / Cross-Branch</option>
                <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                <option value="Information Science and Engineering">Information Science & Engineering</option>
                <option value="Electronics and Communication Engineering">ECE</option>
                <option value="Electrical and Electronics Engineering">EEE</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Chemical Engineering">Chemical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Artificial Intelligence and Machine Learning">AI/ML</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleStartQuiz}
              disabled={loading}
              className="btn-cinematic flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer shadow-md"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Begin Assessment ({quizLength} Questions)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* QUIZ TAKING STEP */}
      {step === 'taking' && currentQ && (
        <div className="card-cinematic p-7 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#4F46E5] dark:text-cyan-400">
                Question {currentIndex + 1} of {totalQ}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-medium">{subject}</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-500 font-semibold">{currentQ.difficulty}</span>
            </div>

            <div className="font-mono text-xs text-slate-500 font-semibold">
              Answered: {answeredCount} / {totalQ}
            </div>
          </div>

          {/* Progress Indicator Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4F46E5] to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
            />
          </div>

          {/* Quick Question Jumper Grid */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {questions.map((q, idx) => {
              const isAnswered = answers[q._id] !== undefined;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q._id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isCurrent
                      ? 'bg-[#4F46E5] text-white ring-2 ring-[#4F46E5]/40'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                  title={`Jump to Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Text */}
          <div className="space-y-1.5 py-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{currentQ.topic}</span>
            <h3 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* 4 Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = answers[currentQ._id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ._id, idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-[#4F46E5] dark:border-cyan-400 text-[#4F46E5] dark:text-cyan-300 font-bold shadow-xs'
                      : 'bg-white dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{opt}</span>
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
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < totalQ - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="btn-cinematic flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Assessment for Grading</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* RESULTS STEP & STEP-BY-STEP REVIEW */}
      {step === 'results' && results && (
        <div className="space-y-6">
          {/* Score Header Card */}
          <div className="card-cinematic p-7 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
              <span>Verified Server-Side Evaluation</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white">
              Assessment Completed!
            </h2>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Final Score</span>
                <p className="text-3xl sm:text-4xl font-black font-mono text-[#4F46E5] dark:text-cyan-400 mt-0.5">
                  {results.score}%
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Accuracy</span>
                <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {results.correctCount} / {results.totalQuestions}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Attempt saved to your persistent MongoDB student account. Streak updated.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('config')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Configure Another Quiz</span>
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-cinematic px-5 py-2 rounded-xl text-xs font-bold text-white cursor-pointer"
                >
                  Return to Practice Hub
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Step-by-Step Answer Review & Explanations
            </h3>

            {results.answers.map((ans: any, idx: number) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border space-y-2.5 text-xs ${
                  ans.isCorrect
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/50'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-500">Question {idx + 1}</span>
                  <span
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] ${
                      ans.isCorrect ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}
                  >
                    {ans.isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>{ans.isCorrect ? 'Correct' : 'Incorrect'}</span>
                  </span>
                </div>

                <p className="text-sm font-bold text-[#111827] dark:text-white leading-relaxed">
                  {ans.questionText}
                </p>

                <div className="text-[11px] space-y-1 pt-1">
                  <p>
                    <span className="font-semibold text-slate-500">Your selection: </span>
                    <span className={ans.isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                      {ans.selectedOption >= 0 ? `Option ${ans.selectedOption + 1}` : 'No answer selected'}
                    </span>
                  </p>
                  {!ans.isCorrect && (
                    <p>
                      <span className="font-semibold text-slate-500">Correct Answer: </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        Option {ans.correctOption + 1}
                      </span>
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#121622] border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block mb-0.5">
                    Technical Explanation:
                  </span>
                  {ans.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

