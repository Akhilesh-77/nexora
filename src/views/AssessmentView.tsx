import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  BarChart3,
  TrendingUp,
  Award,
  ChevronRight,
  RefreshCw,
  Target,
  BookOpen,
  Briefcase,
  Code2,
  Check,
  Compass,
  GraduationCap,
  Sliders,
  ShieldCheck,
  CheckSquare,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getDiagnosticQuestionsForRole,
  RoleDiagnosticQuestion,
} from '../data/roleDiagnosticQuestions';
import {
  ALLOWED_DEGREES,
  getRolesForBranch,
} from '../data/branchRoleMapping';
import { AssessmentResult } from '../types';
import { ThemeToggle } from '../components/ThemeToggle';

interface AssessmentViewProps {
  onComplete: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ onComplete }) => {
  const {
    profile,
    updateProfile,
    assessmentResult,
    submitAssessment,
    setCurrentPage,
  } = useApp();

  // STAGE MANAGEMENT: 'collect_info' | 'diagnostic_test' | 'analyzing' | 'report'
  const [currentStage, setCurrentStage] = useState<'collect_info' | 'diagnostic_test' | 'analyzing' | 'report'>(() => {
    if (assessmentResult && profile.onboarded) {
      return 'report';
    }
    return 'collect_info';
  });

  // 1. Initial Information Form State
  const initialBranch = profile.branch || 'Computer Science and Engineering';
  const initialRoles = getRolesForBranch(initialBranch);

  const [formData, setFormData] = useState({
    name: profile.name || '',
    college: profile.college || 'RV College of Engineering',
    degree: profile.degree || 'Bachelor of Engineering (B.E.)',
    branch: initialBranch,
    yearOrSemester: profile.yearOrSemester || 'Final Year (7th/8th Sem)',
    targetRole: profile.targetRole || initialRoles.primaryRoles[0] || 'Software Developer',
    prepLevel: profile.prepLevel || 'Intermediate',
    studyTime: profile.studyTime || '2 hours',
    selectedSkills: profile.skills && profile.skills.length > 0
      ? profile.skills
      : ['Python', 'SQL', 'Data Structures', 'Git'],
    preparationGoals: profile.preparationGoals && profile.preparationGoals.length > 0
      ? profile.preparationGoals
      : ['Dream Tier-1 Placement', 'Master Algorithmic Coding'],
  });

  const [infoValidationError, setInfoValidationError] = useState<string | null>(null);

  // Available skills pool for student selection
  const COMMON_SKILLS = [
    'Python',
    'C++',
    'Java',
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'SQL',
    'MongoDB',
    'Docker',
    'Git',
    'Data Structures',
    'Operating Systems',
    'Computer Networks',
    'DBMS & SQL',
    'Machine Learning',
    'Deep Learning',
    'Embedded C',
    'VLSI Design',
    'MATLAB',
    'SolidWorks',
    'Thermodynamics',
  ];

  const PREPARATION_GOAL_OPTIONS = [
    'Dream Tier-1 Placement Offer',
    'Core Technical Domain Placement',
    'Aptitude Screening Test Clearance',
    'Master Algorithmic Coding & DSA',
    'System Design & Microservices Architecture',
    'Technical Mock Interview Delivery',
    'ATS Resume Optimization',
  ];

  const branches = [
    'Computer Science and Engineering',
    'Information Science and Engineering',
    'Artificial Intelligence and Machine Learning',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Chemical Engineering',
    'Civil Engineering',
  ];

  const years = [
    '2nd Year (3rd/4th Sem)',
    '3rd Year (5th/6th Sem)',
    'Final Year (7th/8th Sem)',
    'Graduated / Alumnus',
  ];

  // Dynamic diagnostic questions based on user's branch and target role
  const diagnosticQuestions = useMemo(() => {
    return getDiagnosticQuestionsForRole(formData.branch, formData.targetRole);
  }, [formData.branch, formData.targetRole]);

  // 2. Diagnostic Assessment State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeReport, setActiveReport] = useState<AssessmentResult | null>(assessmentResult);

  // Analysis Animation Milestones
  const [analysisStep, setAnalysisStep] = useState(0);

  // Timer for Diagnostic Test
  useEffect(() => {
    if (currentStage !== 'diagnostic_test') return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStage]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle skills in Questionnaire
  const handleToggleSkill = (skill: string) => {
    setFormData((prev) => {
      const exists = prev.selectedSkills.includes(skill);
      if (exists) {
        return {
          ...prev,
          selectedSkills: prev.selectedSkills.filter((s) => s !== skill),
        };
      }
      return {
        ...prev,
        selectedSkills: [...prev.selectedSkills, skill],
      };
    });
  };

  // Toggle goals in Questionnaire
  const handleToggleGoal = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.preparationGoals.includes(goal);
      if (exists) {
        if (prev.preparationGoals.length <= 1) return prev;
        return {
          ...prev,
          preparationGoals: prev.preparationGoals.filter((g) => g !== goal),
        };
      }
      return {
        ...prev,
        preparationGoals: [...prev.preparationGoals, goal],
      };
    });
  };

  // Start Diagnostic Assessment
  const handleStartDiagnostic = () => {
    if (!formData.name.trim()) {
      setInfoValidationError('Please enter your full name.');
      return;
    }
    if (formData.selectedSkills.length === 0) {
      setInfoValidationError('Please select at least 2 existing skills you have practiced.');
      return;
    }

    setInfoValidationError(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setElapsedSeconds(0);
    setCurrentStage('diagnostic_test');
  };

  // Submit Diagnostic and trigger Thoughtful Analysis Animation
  const handleSubmitDiagnostic = async () => {
    setCurrentStage('analyzing');
    setAnalysisStep(0);

    // Realistic thoughtful animation sequence (~1.8 seconds total)
    const step1 = setTimeout(() => setAnalysisStep(1), 450);
    const step2 = setTimeout(() => setAnalysisStep(2), 900);
    const step3 = setTimeout(() => setAnalysisStep(3), 1350);

    const finishTimeout = setTimeout(async () => {
      const result = await submitAssessment(
        selectedAnswers,
        diagnosticQuestions,
        formData.selectedSkills,
        formData.preparationGoals
      );

      // Save user profile details
      await updateProfile({
        name: formData.name,
        college: formData.college,
        degree: formData.degree,
        branch: formData.branch,
        yearOrSemester: formData.yearOrSemester,
        targetRole: formData.targetRole,
        prepLevel: formData.prepLevel as any,
        studyTime: formData.studyTime as any,
        skills: formData.selectedSkills,
        preparationGoals: formData.preparationGoals,
        onboarded: true,
      });

      setActiveReport(result);
      setCurrentStage('report');
    }, 1800);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(finishTimeout);
    };
  };

  // Retake Assessment
  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setElapsedSeconds(0);
    setActiveReport(null);
    setCurrentStage('diagnostic_test');
  };

  // Final Action: "View My Personalized Dashboard"
  const handleViewDashboard = () => {
    onComplete();
    setCurrentPage('overview');
  };

  // ===========================================================================
  // STAGE 3: THOUGHTFUL ANALYSIS ANIMATION SCREEN
  // ===========================================================================
  if (currentStage === 'analyzing') {
    return (
      <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0A0D14] flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          {/* Animated Diagnostic Core */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4F46E5] to-cyan-400 opacity-20 blur-md animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-cyan-500 flex items-center justify-center text-white shadow-lg animate-spin duration-1000">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-white">
              Analyzing your skills and preparing your personalized learning plan...
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Synthesizing role benchmarks for <span className="font-bold text-[#4F46E5] dark:text-cyan-400">{formData.targetRole}</span> based on your verified diagnostic responses.
            </p>
          </div>

          {/* Sequential Milestones Checklist */}
          <div className="space-y-2 text-left pt-2 text-xs">
            <div className={`flex items-center gap-2.5 transition-opacity ${analysisStep >= 0 ? 'text-slate-700 dark:text-slate-200 font-semibold opacity-100' : 'text-slate-400 opacity-40'}`}>
              <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span>Evaluating quantitative & logical reasoning answers...</span>
            </div>
            <div className={`flex items-center gap-2.5 transition-opacity ${analysisStep >= 1 ? 'text-slate-700 dark:text-slate-200 font-semibold opacity-100' : 'text-slate-400 opacity-40'}`}>
              <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 1 ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span>Diagnosing core technical & problem-solving accuracy...</span>
            </div>
            <div className={`flex items-center gap-2.5 transition-opacity ${analysisStep >= 2 ? 'text-slate-700 dark:text-slate-200 font-semibold opacity-100' : 'text-slate-400 opacity-40'}`}>
              <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 2 ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span>Auditing verified strengths vs priority competency gaps...</span>
            </div>
            <div className={`flex items-center gap-2.5 transition-opacity ${analysisStep >= 3 ? 'text-slate-700 dark:text-slate-200 font-semibold opacity-100' : 'text-slate-400 opacity-40'}`}>
              <CheckCircle2 className={`w-4 h-4 ${analysisStep >= 3 ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span>Compiling personalized learning roadmap and daily study plan...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // STAGE 4: PERSONALIZED DIAGNOSTIC & STRATEGY REPORT
  // ===========================================================================
  if (currentStage === 'report' && activeReport) {
    const coverageScore = activeReport.roleCompetencyCoverage ?? activeReport.overallScore;
    const strengths = activeReport.demonstratedStrengths ?? activeReport.strengths;
    const gaps = activeReport.priorityCompetencyGaps ?? activeReport.weakAreas;
    const skillsToImprove = activeReport.skillsToImprove ?? [];
    const unassessedSkills = activeReport.unassessedSkills ?? [];
    const roadmap = activeReport.personalizedRoadmap ?? [];
    const suggestedTasks = activeReport.suggestedTasks ?? [];

    return (
      <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0A0D14] text-[#111827] dark:text-[#F7F8FC] p-4 sm:p-6 lg:p-10 flex flex-col items-center justify-center relative overflow-x-hidden transition-colors">
        <div className="w-full max-w-4xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 animate-in fade-in space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Personalized Assessment & Skill Analysis Completed</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white mt-1.5 tracking-tight">
                Placement Competency Report
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluated for <span className="font-bold text-[#111827] dark:text-white">{profile.name || formData.name}</span> • Target Role:{' '}
                <span className="font-bold text-[#4F46E5] dark:text-cyan-400">{profile.targetRole || formData.targetRole}</span>
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Main Score & Preparation Level Hero */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1 p-5 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#4F46E5] dark:text-cyan-400"
                    strokeDasharray={`${coverageScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-[#111827] dark:text-white font-mono">
                    {coverageScore}%
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                    Diagnostic
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800">
                  {activeReport.preparationLevel || 'Developing Proficiency'}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                  {activeReport.correctCount} of {activeReport.totalQuestions} Questions Correct
                </p>
              </div>
            </div>

            {/* Subject-Wise Performance Breakdown */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Quantitative</span>
                  <p className="text-xl font-bold text-[#111827] dark:text-white font-mono mt-1">
                    {activeReport.aptitudeScore}%
                  </p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#4F46E5] h-full rounded-full" style={{ width: `${activeReport.aptitudeScore}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Logical Reasoning</span>
                  <p className="text-xl font-bold text-[#111827] dark:text-white font-mono mt-1">
                    {activeReport.reasoningScore}%
                  </p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-cyan-500 dark:bg-cyan-400 h-full rounded-full" style={{ width: `${activeReport.reasoningScore}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Technical Concepts</span>
                  <p className="text-xl font-bold text-[#111827] dark:text-white font-mono mt-1">
                    {activeReport.technicalScore}%
                  </p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${activeReport.technicalScore}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Coding & Problem Solving</span>
                  <p className="text-xl font-bold text-[#111827] dark:text-white font-mono mt-1">
                    {activeReport.codingScore ?? activeReport.technicalScore}%
                  </p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeReport.codingScore ?? activeReport.technicalScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Strengths vs Priority Competency Gaps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" /> Verified Strengths
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                {strengths.map((str, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{str} — Strong baseline proficiency verified</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4" /> Priority Competency Gaps
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                {gaps.length > 0 ? (
                  gaps.map((gap, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{gap} — Targeted for daily learning interventions</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>No critical weaknesses identified; focus on advanced problem solving.</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Honest Skills Matrix (Requirement 6: Tested vs Not Assessed Yet) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Skills Audit & Lab Readiness Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Skills needing improvement */}
              {skillsToImprove.map((sk, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                  <span className="font-semibold text-rose-700 dark:text-rose-300">{sk}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                    Needs Improvement
                  </span>
                </div>
              ))}

              {/* Skills not assessed yet (Requirement 6) */}
              {unassessedSkills.map((sk, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-medium text-slate-600 dark:text-slate-300">{sk}</span>
                  <span className="text-[10px] font-semibold text-slate-400 italic">
                    Not assessed yet (Requires lab evaluation)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Subjects & Study Materials (Learning Studio links) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#4F46E5] dark:text-cyan-400" />
              <span>Recommended Subjects & Study Materials</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(activeReport.recommendedSubjects || []).map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="font-bold text-[#111827] dark:text-white">{sub.subject}</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{sub.topic}</p>
                  </div>
                  <span className="text-[10px] text-[#4F46E5] dark:text-cyan-400 font-semibold mt-2 flex items-center gap-1">
                    Study Module <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Learning Roadmap */}
          {roadmap.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#4F46E5] dark:text-cyan-400" />
                <span>Your Personalized Learning Roadmap</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {roadmap.map((ph, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-cyan-400 uppercase">{ph.phase}</span>
                    <p className="font-bold text-[#111827] dark:text-white">{ph.title}</p>
                    <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 pt-1">
                      {ph.topics.map((t, ti) => (
                        <li key={ti}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Daily Tasks */}
          {suggestedTasks.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                <span>Suggested Daily Tasks & Practice Goals</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedTasks.map((tsk, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#111827] dark:text-white">{tsk.title}</p>
                      <span className="text-[10px] text-slate-400">{tsk.category} • {tsk.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Honest Disclaimer (Requirement 6) */}
          <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold text-[#111827] dark:text-white">Note: </span>
              {activeReport.evaluationDisclaimer || 'This diagnostic report provides an initial competency baseline, not a definitive or immutable measure of your ability. Your placement readiness score dynamically increases as you practice in NEXORA labs.'}
            </p>
          </div>

          {/* Actions: Retake vs View My Personalized Dashboard */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleRetake}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic Assessment</span>
            </button>

            <button
              type="button"
              onClick={handleViewDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#4F46E5] to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <span>View My Personalized Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // STAGE 2: ROLE-TAILORED DIAGNOSTIC ASSESSMENT SCREEN (10 QUESTIONS)
  // ===========================================================================
  if (currentStage === 'diagnostic_test') {
    const totalQuestions = diagnosticQuestions.length;
    const currentQuestion = diagnosticQuestions[currentQuestionIdx];
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0A0D14] text-[#111827] dark:text-[#F7F8FC] p-4 sm:p-6 lg:p-10 flex flex-col justify-between transition-colors">
        {/* Top Header */}
        <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#4F46E5] dark:text-cyan-400 tracking-wider uppercase">
                Diagnostic Baseline Test • Question {currentQuestionIdx + 1} of {totalQuestions}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {formData.targetRole}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#111827] dark:text-white mt-0.5">
              {currentQuestion.competency}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#4F46E5] dark:text-cyan-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* 10 Question Jumper Bar */}
        <div className="max-w-4xl w-full mx-auto py-3">
          <div className="flex items-center justify-between mb-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Answered: {answeredCount} / {totalQuestions}
            </span>
            <span className="text-[11px] text-slate-400">
              Tested Skill: <span className="font-medium text-[#4F46E5] dark:text-cyan-400">{currentQuestion.testedSkill}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {diagnosticQuestions.map((_, idx) => {
              const isCurrent = idx === currentQuestionIdx;
              const isAnswered = selectedAnswers[diagnosticQuestions[idx].id] !== undefined;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#4F46E5] text-white ring-2 ring-indigo-400 shadow-md'
                      : isAnswered
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question & Options Area */}
        <main className="max-w-4xl w-full mx-auto my-auto py-6">
          <div className="bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800">
                {currentQuestion.category}
              </span>
              <span className="text-[11px] text-slate-400">
                Competency: {currentQuestion.competency}
              </span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-[#111827] dark:text-white leading-relaxed whitespace-pre-line">
              {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() =>
                      setSelectedAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: optIdx,
                      }))
                    }
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-[#4F46E5] text-[#4F46E5] dark:text-cyan-300 font-bold ring-2 ring-indigo-400/30'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#4F46E5] text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="max-w-4xl w-full mx-auto flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
            disabled={currentQuestionIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex items-center gap-2">
            {currentQuestionIdx < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#3730A3] shadow-md transition-all cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitDiagnostic}
                disabled={answeredCount === 0}
                className="flex items-center gap-1.5 px-7 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <span>Submit Diagnostic ({answeredCount}/{totalQuestions})</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </footer>
      </div>
    );
  }

  // ===========================================================================
  // STAGE 1: INITIAL INFORMATION COLLECTION SCREEN
  // ===========================================================================
  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0A0D14] text-[#111827] dark:text-[#F7F8FC] p-4 sm:p-6 lg:p-10 flex flex-col items-center justify-center transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-cyan-400 flex items-center justify-center text-white shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#4F46E5] dark:text-cyan-400 uppercase tracking-wider">
                Step 1 of 2 • Profile & Career Calibration
              </span>
              <h2 className="text-xl font-extrabold text-[#111827] dark:text-white">
                Initial Assessment Setup
              </h2>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Welcome to NEXORA! Before accessing your dashboard, please tell us about your engineering background, existing skills, and goals. We will customize your short diagnostic baseline to your exact target role.
        </p>

        {infoValidationError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-300">
            {infoValidationError}
          </div>
        )}

        {/* Questionnaire Form */}
        <div className="space-y-4 text-xs">
          {/* Full Name & College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Akhilesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-hidden focus:border-[#4F46E5]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Engineering College
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. RV College of Engineering"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-hidden focus:border-[#4F46E5]"
              />
            </div>
          </div>

          {/* Branch & Year/Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Engineering Branch
              </label>
              <select
                value={formData.branch}
                onChange={(e) => {
                  const newBranch = e.target.value;
                  const newRoles = getRolesForBranch(newBranch);
                  setFormData({
                    ...formData,
                    branch: newBranch,
                    targetRole: newRoles.primaryRoles[0] || 'Software Developer',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-hidden focus:border-[#4F46E5]"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Year or Semester
              </label>
              <select
                value={formData.yearOrSemester}
                onChange={(e) => setFormData({ ...formData, yearOrSemester: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-hidden focus:border-[#4F46E5]"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Career Role & Prep Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Career Role
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-hidden focus:border-[#4F46E5]"
              >
                {getRolesForBranch(formData.branch).primaryRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Experience / Prep Level
              </label>
              <select
                value={formData.prepLevel}
                onChange={(e) => setFormData({ ...formData, prepLevel: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-700 text-xs text-[#111827] dark:text-white focus:outline-hidden focus:border-[#4F46E5]"
              >
                <option value="Beginner">Beginner (Starting preparation fundamentals)</option>
                <option value="Intermediate">Intermediate (Familiar with core concepts & DSA)</option>
                <option value="Advanced">Advanced (Ready for high-difficulty test simulations)</option>
              </select>
            </div>
          </div>

          {/* Existing Skills Selection (Multi-select) */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Your Existing Skills ({formData.selectedSkills.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-[#191d2a] border border-slate-200 dark:border-slate-700">
              {COMMON_SKILLS.map((skill) => {
                const isSelected = formData.selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#4F46E5] text-white shadow-xs'
                        : 'bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preparation Goals Selection */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Primary Placement Goals
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {PREPARATION_GOAL_OPTIONS.map((goal) => {
                const isSelected = formData.preparationGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleToggleGoal(goal)}
                    className={`p-2 rounded-xl text-left text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-[#4F46E5] text-[#4F46E5] dark:text-cyan-300'
                        : 'bg-slate-50 dark:bg-[#191d2a] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button: Proceed to Diagnostic Test */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleStartDiagnostic}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#4F46E5] to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <span>Start Diagnostic Test (10 Questions)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
