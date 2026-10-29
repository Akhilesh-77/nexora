export type NavPage =
  | 'overview'
  | 'practice'
  | 'learning-studio'
  | 'interview'
  | 'resume'
  | 'profile'
  | 'roadmap'
  | 'tasks'
  | 'aptitude'
  | 'coding'
  | 'placement'
  | 'skills'
  | 'reports'
  | 'technical'
  | 'communication'
  | 'settings'
  | 'admin';

export interface UserProfile {
  name: string;
  username?: string;
  email?: string;
  role?: 'student' | 'admin';
  college: string;
  degree: string;
  yearOrSemester: string;
  branch: string;
  customBranch?: string;
  cgpa?: string;
  gradYear: string;
  prefLanguage: string;
  targetRole: string;
  careerInterests: string[];
  skills?: string[];
  preparationGoals?: string[];
  prepLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  studyTime: '30 minutes' | '1 hour' | '2 hours' | '3 or more hours' | string;
  learningPreferences: string[];
  onboarded: boolean;
  avatarUrl?: string;
}

export interface DiagnosticQuestion {
  id: number;
  category:
    | 'Quantitative'
    | 'Logical Reasoning'
    | 'Verbal'
    | 'Programming'
    | 'Data Structures'
    | 'OOP & DBMS'
    | 'OS & Networks'
    | 'Problem Solving'
    | 'Technical Knowledge'
    | 'Coding & Problem Solving';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags?: string[];
  competency?: string;
  testedSkill?: string;
}

export interface AssessmentResult {
  overallScore: number;
  roleCompetencyCoverage?: number;
  aptitudeScore: number;
  reasoningScore: number;
  technicalScore: number;
  verbalScore?: number;
  codingScore?: number;
  preparationLevel?: 'Foundation Level' | 'Developing Proficiency' | 'Placement Ready' | 'Advanced Competitive';
  strengths: string[];
  weakAreas: string[];
  demonstratedStrengths?: string[];
  priorityCompetencyGaps?: string[];
  skillsToImprove?: string[];
  unassessedSkills?: string[];
  recommendedSubjects?: { subject: string; topic: string; moduleId?: string }[];
  recommendedTopics: string[];
  recommendedInterventions?: string[];
  evidenceConfidence?: number;
  knowledgeEvidence?: number;
  recommendedDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  personalizedRoadmap?: { phase: string; title: string; duration: string; topics: string[] }[];
  suggestedTasks?: { title: string; category: string; duration: string }[];
  evaluationDisclaimer?: string;
  completedAt: string;
  totalQuestions: number;
  correctCount: number;
  answers: Record<number, number>;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  category: 'Aptitude' | 'Coding' | 'Technical' | 'Interview Preparation';
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  whyRecommended: string;
  completed: boolean;
  actionPage: NavPage;
  actionPayload?: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  keyConcepts: string[];
  practiceTask: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  learningObjectives: string[];
  topics: RoadmapTopic[];
}

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Ability' | 'Data Interpretation';
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formulaOrTip?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<string, string>;
  hints: string[];
  solution: string;
  solutionExplanation: string;
  solved: boolean;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface InterviewMessage {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
  evaluation?: {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    relevanceScore: number;
    strongPoints?: string[];
    improvementAreas?: string[];
    whatWasCorrect?: string[];
    whatWasMissing?: string[];
    conceptualMistakes?: string[];
    keyConceptsToMention?: string[];
    modelAnswer: string;
    recommendation?: string;
    advice?: string;
    isAiPowered?: boolean;
  };
}

export type InterviewRoundType =
  | 'Aptitude & Reasoning'
  | 'Technical Assessment'
  | 'Technical Interview'
  | 'HR Interview'
  | 'Project Discussion'
  | 'Technical'
  | 'HR'
  | 'Aptitude Discussion'
  | 'Mixed';

export interface MockInterviewSession {
  id: string;
  targetRole: string;
  type: InterviewRoundType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalQuestions: number;
  currentQuestionIndex: number;
  messages: InterviewMessage[];
  completed: boolean;
  date: string;
  finalFeedback?: {
    overallScore: number;
    roleCompetencyScore?: number;
    technicalScore: number;
    communicationScore: number;
    relevanceScore: number;
    demonstratedStrengths?: string[];
    priorityCompetencyGaps?: string[];
    recommendedInterventions?: string[];
    interviewEvidence?: string;
    strongAnswers?: string[];
    areasForImprovement?: string[];
    topicsToRevise?: string[];
    recommendedPractice?: string;
  };
}

export interface PlacementRound {
  id: number;
  name: string;
  type: 'aptitude' | 'technical_mcq' | 'technical_interview' | 'hr_interview';
  title: string;
  description: string;
  status: 'locked' | 'current' | 'completed' | 'failed';
  score?: number;
  maxScore: number;
  feedback?: string;
  duration: string;
}

export interface PlacementSimulation {
  id: string;
  companyName: string;
  role: string;
  packageLPA: string;
  date: string;
  status: 'in_progress' | 'selected' | 'rejected';
  rounds: PlacementRound[];
  finalResult?: {
    overallPerformance: number;
    strongestRound: string;
    weakestRound: string;
    keyRecommendations: string[];
    summary: string;
  };
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
    score: string;
  }[];
  skills: {
    category: string;
    items: string;
  }[];
  projects: {
    id: string;
    title: string;
    technologies: string;
    description: string;
    link?: string;
  }[];
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    location: string;
    bullets: string;
  }[];
  certifications: string[];
  achievements: string[];
  template: 'modern' | 'minimal' | 'executive' | 'classic';
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'milestone' | 'recommendation' | 'alert' | 'achievement';
  read: boolean;
  timestamp: string;
  actionPage?: NavPage;
}
