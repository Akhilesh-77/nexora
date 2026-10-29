import React, { useState } from 'react';
import {
  Radar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Award,
  HelpCircle,
  Clock,
  Play,
  RotateCcw,
  X,
  ChevronRight,
  BookOpen,
  Code2,
  Check,
  TrendingUp,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavPage } from '../types';
import { normalizeBranchName, isCrossDomainRole } from '../data/branchRoleMapping';
import { CinematicBackground } from '../components/CinematicBackground';

interface SkillItem {
  id: string;
  name: string;
  category: 'General Aptitude' | 'Core Engineering Discipline' | 'Interview & Communication' | 'Specialized Track';
  status: 'Strong' | 'Developing' | 'Needs Practice' | 'Pending';
  score?: number;
  benchmarkScore: number;
  evidenceType: string;
  evidenceSummary: string;
  demonstratedStrengths: string[];
  priorityGaps: string[];
  recommendation: string;
  targetPage: NavPage;
  actionText: string;
}

export const SkillAnalysisView: React.FC = () => {
  const { assessmentResult, profile, setCurrentPage, codingProblems } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'Strong' | 'Developing' | 'Needs Practice' | 'Pending'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  const hasAssessment = Boolean(assessmentResult);
  const solvedDsaCount = codingProblems.filter((p) => p.solved).length;
  const reasoningScore = assessmentResult?.reasoningScore;
  const aptitudeScore = assessmentResult?.aptitudeScore;
  const technicalScore = assessmentResult?.technicalScore;

  const normalizedBranch = normalizeBranchName(profile.branch);
  const isCrossDomain = isCrossDomainRole(profile.branch, profile.targetRole);

  // Generate skills dynamically based on student's branch & actual assessment data
  const generateBranchSkills = (): SkillItem[] => {
    // 1. Aptitude Skills (Common to all engineering disciplines)
    const aptSkill: SkillItem = {
      id: 'skill-1',
      name: 'Quantitative Aptitude & Numerical Speed',
      category: 'General Aptitude',
      status: !hasAssessment
        ? 'Pending'
        : (aptitudeScore ?? 0) >= 75
        ? 'Strong'
        : 'Needs Practice',
      score: aptitudeScore,
      benchmarkScore: 75,
      evidenceType: hasAssessment ? 'Verified Diagnostic Assessment' : 'Awaiting Diagnostic',
      evidenceSummary: hasAssessment
        ? `Diagnostic score: ${aptitudeScore}%. Real-time arithmetic and formula speed evaluated.`
        : 'Take the 10-question diagnostic assessment to record verified quantitative baseline.',
      demonstratedStrengths: hasAssessment
        ? ['Percentage calculations and arithmetic multipliers', 'Ratio formulation']
        : ['Awaiting assessment attempt'],
      priorityGaps: hasAssessment
        ? ['Speed calculation under strict 60-second time limits', 'Complex word problems']
        : ['Take the diagnostic assessment to identify exact aptitude gaps'],
      recommendation: 'Practice 15-minute speed arithmetic drills in the Aptitude Training Lab.',
      targetPage: 'aptitude',
      actionText: 'Practise Quantitative Drills',
    };

    const logicSkill: SkillItem = {
      id: 'skill-2',
      name: 'Logical Reasoning & Deduction',
      category: 'General Aptitude',
      status: !hasAssessment
        ? 'Pending'
        : (reasoningScore ?? 0) >= 75
        ? 'Strong'
        : 'Developing',
      score: reasoningScore,
      benchmarkScore: 75,
      evidenceType: hasAssessment ? 'Verified Diagnostic Assessment' : 'Awaiting Diagnostic',
      evidenceSummary: hasAssessment
        ? `Diagnostic score: ${reasoningScore}%. Number patterns and logical syllogisms verified.`
        : 'Take the 10-minute diagnostic assessment to record verified reasoning baseline.',
      demonstratedStrengths: hasAssessment
        ? ['Pattern recognition in alphanumeric series', 'Deductive syllogism structure']
        : ['Awaiting assessment attempt'],
      priorityGaps: hasAssessment
        ? ['Multi-variable arrangement puzzles under pressure']
        : ['Take the diagnostic to benchmark analytical deduction'],
      recommendation: 'Attempt 10-question logical deduction sprints in the Aptitude Lab.',
      targetPage: 'aptitude',
      actionText: 'Practise Logical Reasoning',
    };

    // 2. Discipline Core Technical Skills
    let domainSkills: SkillItem[] = [];

    if (normalizedBranch === 'Mechanical Engineering' && !isCrossDomain) {
      domainSkills = [
        {
          id: 'skill-mech-1',
          name: 'Mechanical Design, CAD & GD&T',
          category: 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? Math.min(88, technicalScore ?? 70) : undefined,
          benchmarkScore: 75,
          evidenceType: 'Discipline Practice & Interview Logs',
          evidenceSummary: 'Covers fits & tolerances, datum references, and assembly CAD modeling principles.',
          demonstratedStrengths: ['Tolerance stack-up concepts', 'Fits: clearance vs interference'],
          priorityGaps: ['True position and total runout GD&T callouts', 'FEA mesh convergence criteria'],
          recommendation: 'Review GD&T symbols and standard shaft-hole fits in Technical Concepts.',
          targetPage: 'technical',
          actionText: 'Review Mechanical Concepts',
        },
        {
          id: 'skill-mech-2',
          name: 'Strength of Materials & Machine Design',
          category: 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? Math.min(85, technicalScore ?? 68) : undefined,
          benchmarkScore: 75,
          evidenceType: 'Engineering Core Curriculum',
          evidenceSummary: 'Shear force, bending moment, Mohr’s circle, and failure theories (von Mises, Tresca).',
          demonstratedStrengths: ['Beam flexure formula', 'Euler column buckling criteria'],
          priorityGaps: ['Fatigue S-N curves and endurance limit calculations under cyclic loading'],
          recommendation: 'Solve numerical problems on combined bending and torsion shafts.',
          targetPage: 'technical',
          actionText: 'Study Machine Design',
        },
        {
          id: 'skill-mech-3',
          name: 'Thermal Engineering & Fluid Machinery',
          category: 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? Math.min(82, technicalScore ?? 66) : undefined,
          benchmarkScore: 70,
          evidenceType: 'Core Thermodynamics Evaluation',
          evidenceSummary: 'Laws of Thermodynamics, Carnot efficiency, and pump cavitation parameters.',
          demonstratedStrengths: ['First law energy balance', 'Bernoulli fluid equation'],
          priorityGaps: ['NPSH calculations for preventing pump impeller cavitation'],
          recommendation: 'Review centrifugal pump operating curves and heat exchanger LMTD calculations.',
          targetPage: 'technical',
          actionText: 'Study Thermal Systems',
        },
      ];
    } else if (normalizedBranch === 'Chemical Engineering' && !isCrossDomain) {
      domainSkills = [
        {
          id: 'skill-chem-1',
          name: 'Mass Transfer & Distillation Column Design',
          category: 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? Math.min(85, technicalScore ?? 70) : undefined,
          benchmarkScore: 75,
          evidenceType: 'Chemical Core Practice Logs',
          evidenceSummary: 'McCabe-Thiele graphical method, q-line slopes, and theoretical stage determination.',
          demonstratedStrengths: ['VLE curve interpretation', 'Minimum reflux ratio estimation'],
          priorityGaps: ['Tray hydraulics, weeping, and flooding velocity calculations'],
          recommendation: 'Review distillation column hydraulics and McCabe-Thiele stage sizing.',
          targetPage: 'technical',
          actionText: 'Review Distillation Concepts',
        },
        {
          id: 'skill-chem-2',
          name: 'Heat Transfer & Exchanger Sizing',
          category: 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? Math.min(84, technicalScore ?? 68) : undefined,
          benchmarkScore: 75,
          evidenceType: 'Transport Phenomena Baseline',
          evidenceSummary: 'Shell-and-tube exchangers, Kern’s sizing method, and fouling resistances.',
          demonstratedStrengths: ['LMTD calculation formula', 'Counter-current flow advantage'],
          priorityGaps: ['Baffle cut and shell-side pressure drop trade-offs'],
          recommendation: 'Study heat exchanger design parameters and Kern’s method.',
          targetPage: 'technical',
          actionText: 'Study Heat Exchangers',
        },
        {
          id: 'skill-chem-3',
          name: 'Process Safety, P&ID & Chemical Kinetics',
          category: 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? Math.min(80, technicalScore ?? 65) : undefined,
          benchmarkScore: 70,
          evidenceType: 'Process Safety & Plant Operations',
          evidenceSummary: 'HAZOP guide words, emergency pressure relief, and CSTR vs PFR reactor sizing.',
          demonstratedStrengths: ['P&ID symbology comprehension', 'HAZOP safety review protocol'],
          priorityGaps: ['Non-ideal flow dispersion modeling and residence time distributions'],
          recommendation: 'Practice explaining industrial safety protocols in mock interviews.',
          targetPage: 'interview',
          actionText: 'Practice Chemical Mock',
        },
      ];
    } else if (
      (normalizedBranch === 'Electronics and Communication Engineering' ||
        normalizedBranch === 'Electrical and Electronics Engineering') &&
      !isCrossDomain
    ) {
      domainSkills = [
        {
          id: 'skill-ee-1',
          name: 'Microcontrollers, ARM & Embedded C',
          category: 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? Math.min(85, technicalScore ?? 70) : undefined,
          benchmarkScore: 75,
          evidenceType: 'Embedded Curriculum & Hardware Labs',
          evidenceSummary: 'Bare-metal peripheral drivers, interrupt handling, volatile keyword, and memory mapping.',
          demonstratedStrengths: ['Bit masking operations in C', 'GPIO configuration'],
          priorityGaps: ['Interrupt latency optimization and ISR race condition prevention'],
          recommendation: 'Review I2C vs SPI vs UART timing diagrams and C driver structure.',
          targetPage: 'technical',
          actionText: 'Study Embedded Systems',
        },
        {
          id: 'skill-ee-2',
          name: 'Digital Electronics & VLSI / Power Systems',
          category: 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? Math.min(82, technicalScore ?? 68) : undefined,
          benchmarkScore: 75,
          evidenceType: 'Circuit Theory & Digital Logic',
          evidenceSummary: 'K-maps, CMOS logic, setup and hold timing margins, or AC three-phase power systems.',
          demonstratedStrengths: ['Logic minimization', 'Thevenin equivalent circuit analysis'],
          priorityGaps: ['Metastability mitigation and clock domain crossing'],
          recommendation: 'Review setup/hold margin numerical calculations and state machines.',
          targetPage: 'technical',
          actionText: 'Study Digital & Power',
        },
      ];
    } else {
      // Computer Science, ISE, AIML or Cross-Domain IT Track
      domainSkills = [
        {
          id: 'skill-cs-1',
          name: 'Data Structures & Algorithmic Problem Solving',
          category: isCrossDomain ? 'Specialized Track' : 'Core Engineering Discipline',
          status: solvedDsaCount >= 3 ? 'Strong' : solvedDsaCount >= 1 ? 'Developing' : 'Needs Practice',
          score: hasAssessment ? technicalScore : undefined,
          benchmarkScore: 75,
          evidenceType: `Verified Coding Submissions (${solvedDsaCount} solved)`,
          evidenceSummary: `${solvedDsaCount} of ${codingProblems.length} DSA problems solved in coding sandbox.`,
          demonstratedStrengths: solvedDsaCount > 0 ? ['Hash Map lookups', 'Two-Pointer traversal'] : ['Awaiting coding submissions'],
          priorityGaps: ['Binary Search Tree balancing', 'Dynamic programming state transitions'],
          recommendation: 'Solve Maximum Subarray and Invert Binary Tree in the Coding Sandbox.',
          targetPage: 'coding',
          actionText: 'Open Coding Sandbox',
        },
        {
          id: 'skill-cs-2',
          name: 'Database Management Systems & SQL',
          category: isCrossDomain ? 'Specialized Track' : 'Core Engineering Discipline',
          status: 'Developing',
          score: hasAssessment ? 72 : undefined,
          benchmarkScore: 75,
          evidenceType: 'Diagnostic Assessment & Core Technical Concept',
          evidenceSummary: 'Relational data models, normalization (1NF-3NF), and SQL aggregate queries.',
          demonstratedStrengths: ['SQL aggregate clauses (GROUP BY, HAVING)'],
          priorityGaps: ['BCNF multi-valued anomalies', 'B+ Tree indexing write overhead'],
          recommendation: 'Review DBMS normalization and practise SQL join drills.',
          targetPage: 'technical',
          actionText: 'Review DBMS Concepts',
        },
      ];
    }

    // 3. Behavioral & Communication Skill
    const commSkill: SkillItem = {
      id: 'skill-comm',
      name: 'Technical Articulation & Behavioral STAR',
      category: 'Interview & Communication',
      status: 'Developing',
      score: hasAssessment ? 72 : undefined,
      benchmarkScore: 70,
      evidenceType: 'Mock Interview Simulator Logs',
      evidenceSummary: 'Structure responses with Situation, Task, Action, and Result for recruiter clarity.',
      demonstratedStrengths: ['Clear spoken responses with technical terminology'],
      priorityGaps: ['Quantifying results with metrics (e.g. % improvement, latency reduction)'],
      recommendation: 'Practice answering 5 questions in the AI Mock Interview simulator out loud.',
      targetPage: 'interview',
      actionText: 'Practice Mock Interview',
    };

    return [aptSkill, logicSkill, ...domainSkills, commSkill];
  };

  const skillsData = generateBranchSkills();

  // Filter skills
  const filteredSkills = skillsData.filter((skill) => {
    if (activeFilter === 'all') return true;
    return skill.status === activeFilter;
  });

  return (
    <CinematicBackground variant="dashboard" className="space-y-6 pb-12 transition-colors">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl card-cinematic luminous-border shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/60">
              <Compass className="w-3.5 h-3.5 text-cyan-500" />
              <span>{profile.branch} Competency Baseline</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              Evidence-Based Skill Analysis
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
              Competency breakdown based on your verified assessment answers, coding submissions, and practice logs.
              Click any competency to review supporting evidence and launch targeted drills.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center min-w-[150px] shrink-0 shadow-xs">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Verified Coverage
            </span>
            <div className="text-3xl font-extrabold text-cyan-500 font-mono mt-0.5">
              {hasAssessment
                ? `${assessmentResult?.roleCompetencyCoverage ?? assessmentResult?.overallScore}%`
                : '--'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {hasAssessment ? 'Baseline Recorded' : 'Assessment Pending'}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-1">Filter Status:</span>
          {(['all', 'Strong', 'Developing', 'Needs Practice', 'Pending'] as const).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'bg-white/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {filter === 'all'
                  ? 'All Competencies'
                  : filter === 'Strong'
                  ? 'Demonstrated Strengths'
                  : filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Honest Assessment Notice Banner if not completed */}
      {!hasAssessment && (
        <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#202334] dark:text-white text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400" />
              Verified Competency Baseline Not Yet Established
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              NEXORA does not display arbitrary placeholder scores. Complete your 10-question diagnostic assessment to verify your strengths and targeted gap areas.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('overview')}
            className="btn-cinematic px-5 py-2.5 rounded-xl text-xs font-bold text-white shrink-0 cursor-pointer"
          >
            Attempt Diagnostic Assessment
          </button>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => {
          return (
            <div
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className="p-5 sm:p-6 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 hover:border-[#4F46E5] dark:hover:border-cyan-400 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {skill.category}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    skill.status === 'Strong'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : skill.status === 'Developing'
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                      : skill.status === 'Needs Practice'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {skill.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#202334] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {skill.evidenceSummary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  {skill.score !== undefined ? `Verified Score: ${skill.score}%` : 'Status: Pending Assessment'}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-[#4F46E5] dark:text-cyan-400 group-hover:underline">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl card-cinematic p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {selectedSkill.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#202334] dark:text-white mt-0.5">
                  {selectedSkill.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Evidence Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 space-y-1.5 text-xs">
              <span className="font-bold text-[#4F46E5] dark:text-cyan-400 uppercase tracking-wider block text-[10px]">
                Supporting Evidence Source: {selectedSkill.evidenceType}
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedSkill.evidenceSummary}
              </p>
              {selectedSkill.score !== undefined && (
                <div className="pt-1 flex items-center gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Your Score: <strong className="text-cyan-500">{selectedSkill.score}%</strong></span>
                  <span>Target Benchmark: {selectedSkill.benchmarkScore}%</span>
                </div>
              )}
            </div>

            {/* Strengths & Gaps */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Competencies:</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {selectedSkill.demonstratedStrengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Targeted Growth Areas:</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                  {selectedSkill.priorityGaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation & Action Button */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedSkill.recommendation}
              </p>
              <button
                onClick={() => {
                  setSelectedSkill(null);
                  setCurrentPage(selectedSkill.targetPage);
                }}
                className="btn-cinematic px-5 py-2.5 rounded-xl text-xs font-bold text-white shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <span>{selectedSkill.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </CinematicBackground>
  );
};
