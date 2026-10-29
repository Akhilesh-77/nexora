import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  AssessmentResult,
  DailyTask,
  RoadmapPhase,
  CodingProblem,
  MockInterviewSession,
  PlacementSimulation,
  ResumeData,
  InAppNotification,
  NavPage,
} from '../types';
import {
  DIAGNOSTIC_QUESTIONS,
  DEFAULT_ROADMAP_PHASES,
  INITIAL_DAILY_TASKS,
  CODING_PROBLEMS,
} from '../data/mockData';
import {
  ALLOWED_DEGREES,
  getRoadmapForBranchAndRole,
  getDailyTasksForBranchAndRole,
  getPlacementSimulationForBranchAndRole,
} from '../data/branchRoleMapping';
import { api, getAuthToken } from '../services/api';

export interface DbStatusState {
  connected: boolean;
  error: string | null;
  checking: boolean;
  host?: string;
  name?: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  dbStatus: DbStatusState;
  checkDatabase: () => Promise<void>;
  login: (u: string, p: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: any) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (u: string, p: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  assessmentResult: AssessmentResult | null;
  assessmentHistory: AssessmentResult[];
  submitAssessment: (
    answers: Record<number, number>,
    questions?: any[],
    skills?: string[],
    goals?: string[]
  ) => Promise<AssessmentResult>;
  retakeAssessment: () => void;
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;
  theme: 'dark' | 'light' | 'system';
  setTheme: (t: 'dark' | 'light' | 'system') => void;
  effectiveTheme: 'dark' | 'light';
  uiFont: 'sans' | 'times' | 'mono';
  setUiFont: (f: 'sans' | 'times' | 'mono') => void;
  dailyTasks: DailyTask[];
  toggleTask: (id: string) => void;
  completeTaskByCategory: (category: 'Aptitude' | 'Coding' | 'Technical' | 'Interview Preparation') => void;
  generateDailyTasks: () => void;
  roadmapPhases: RoadmapPhase[];
  toggleRoadmapTopic: (phaseId: string, topicId: string) => void;
  codingProblems: CodingProblem[];
  markCodingSolved: (id: string) => Promise<void>;
  interviewHistory: MockInterviewSession[];
  saveInterviewSession: (session: MockInterviewSession) => void;
  placementSimulation: PlacementSimulation;
  updatePlacementRound: (
    roundId: number,
    status: 'current' | 'completed' | 'failed',
    score?: number,
    feedback?: string
  ) => void;
  restartPlacementSimulation: () => void;
  resumeData: ResumeData;
  updateResumeData: (updates: Partial<ResumeData>) => Promise<void>;
  notifications: InAppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (n: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>) => void;
  resetDemoProgress: () => void;

  // Real Persistent MongoDB Progress
  completedLessons: string[];
  completedModules: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  quizHistory: any[];
  streak: { currentStreak: number; longestStreak: number; lastActivityDate?: string };
  completeLesson: (lessonId: string, moduleId?: string) => Promise<boolean>;
  toggleBookmark: (moduleId: string) => Promise<boolean>;
  saveModuleNote: (moduleId: string, text: string) => Promise<void>;
  submitQuizAttempt: (quizData: any) => Promise<any>;
  refreshProgress: () => Promise<void>;

  // Global Assistant & Voice Toggle
  assistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Student',
  college: 'National Institute of Engineering',
  degree: 'Bachelor of Technology (B.Tech.)',
  yearOrSemester: 'Final Year (7th/8th Sem)',
  branch: 'Computer Science and Engineering',
  cgpa: '8.5',
  gradYear: '2026',
  prefLanguage: 'Python',
  targetRole: 'Software Developer',
  careerInterests: ['Software Developer', 'Full-Stack Developer'],
  prepLevel: 'Intermediate',
  studyTime: '2 hours',
  learningPreferences: [
    'General Aptitude',
    'Core Branch Subjects',
    'Technical Mock Interviews',
  ],
  onboarded: true,
  role: 'student',
};

const DEFAULT_RESUME: ResumeData = {
  fullName: 'Student',
  email: 'student@campus.edu',
  phone: '+1 (555) 234-5678',
  location: 'Bangalore, India',
  linkedin: 'linkedin.com/in/student-cs',
  github: 'github.com/student-dev',
  portfolio: 'student.dev',
  summary:
    'Dedicated final-year Engineering student with strong foundations in core subjects, problem solving, and modern system architectures. Seeking an impactful campus placement role.',
  education: [
    {
      id: 'edu-1',
      institution: 'National Institute of Engineering',
      degree: 'B.Tech',
      field: 'Computer Science & Engineering',
      startYear: '2022',
      endYear: '2026',
      score: '8.5 CGPA',
    },
  ],
  skills: [
    { category: 'Languages', items: 'Python, C++, Java, JavaScript, SQL' },
    { category: 'Frameworks & Tools', items: 'React, Node.js, Express, Docker, Git' },
    { category: 'Core Concepts', items: 'Data Structures & Algorithms, OS, DBMS, Networks' },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Distributed Real-Time Collaborative Canvas',
      technologies: 'React, Node.js, WebSockets, Redis',
      description:
        'Engineered a scalable collaborative whiteboard supporting 50+ concurrent users with conflict-free replicated data structures. Decreased sync latency by 35%.',
      link: 'github.com/student-dev/canvas-app',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Software Engineering Intern',
      company: 'TechFlow Systems',
      duration: 'Jun 2025 – Aug 2025',
      location: 'Remote',
      bullets:
        'Optimized internal GraphQL API response payload sizes, reducing client rendering time by 28%.\nAuthored automated integration test suites achieving 92% code coverage.',
    },
  ],
  certifications: [
    'AWS Certified Cloud Practitioner',
    'Meta Front-End Developer Certificate',
  ],
  achievements: [
    'Finalist in National Inter-College Hackathon.',
    'Solved 300+ data structure challenges across coding platforms.',
  ],
  template: 'modern',
};

const DEFAULT_PLACEMENT_SIMULATION: PlacementSimulation = {
  id: 'sim-1',
  companyName: 'Apex Cloud Systems',
  role: 'Software Developer',
  packageLPA: '18 LPA / $110,000',
  date: new Date().toLocaleDateString(),
  status: 'in_progress',
  rounds: [
    {
      id: 1,
      name: 'Round 1: Online Aptitude & Logic Assessment',
      type: 'aptitude',
      title: 'Aptitude & Reasoning Screening',
      description: 'Timed multi-choice assessment covering Quantitative, Logical, and Verbal ability.',
      status: 'current',
      score: undefined,
      maxScore: 100,
      duration: '20 mins',
    },
    {
      id: 2,
      name: 'Round 2: Technical Coding & CS Fundamentals',
      type: 'technical_mcq',
      title: 'Data Structures & Core Engineering',
      description: 'Algorithmic problem solving and core concept screening (DBMS, OS, OOP).',
      status: 'locked',
      score: undefined,
      maxScore: 100,
      duration: '35 mins',
    },
    {
      id: 3,
      name: 'Round 3: Live Technical Interview',
      type: 'technical_interview',
      title: 'System Design & Code Walkthrough',
      description: 'Simulated 1-on-1 interview on project architecture, edge cases, and runtime tradeoffs.',
      status: 'locked',
      score: undefined,
      maxScore: 100,
      duration: '25 mins',
    },
    {
      id: 4,
      name: 'Round 4: HR & Behavioral Discussion',
      type: 'hr_interview',
      title: 'Culture Fit & Situational Interview',
      description: 'Behavioral scenarios, leadership, teamwork, and long-term career orientation.',
      status: 'locked',
      score: undefined,
      maxScore: 100,
      duration: '15 mins',
    },
  ],
};

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    title: 'Welcome to NEXORA!',
    message: 'Start your preparation with your personalized daily study plan and practice tracks.',
    type: 'milestone',
    read: false,
    timestamp: 'Just now',
    actionPage: 'overview',
  },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Database Health State
  const [dbStatus, setDbStatus] = useState<DbStatusState>({
    connected: false,
    error: null,
    checking: true,
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getAuthToken());
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // User Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nexora_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  // Persistent Progress Fields from MongoDB
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [streak, setStreak] = useState<{ currentStreak: number; longestStreak: number; lastActivityDate?: string }>({
    currentStreak: 0,
    longestStreak: 0,
  });

  // Diagnostic Assessment Results
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(() => {
    const saved = localStorage.getItem('nexora_assessment');
    return saved ? JSON.parse(saved) : null;
  });

  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>(() => {
    const saved = localStorage.getItem('nexora_assessment_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Current Navigation Page
  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Theme
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(() => {
    const saved = localStorage.getItem('nexora_theme');
    return (saved as 'dark' | 'light' | 'system') || 'light';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('light');

  // UI Font Preference
  const [uiFont, setUiFontState] = useState<'sans' | 'times' | 'mono'>(() => {
    const saved = localStorage.getItem('nexora_font');
    return (saved as 'sans' | 'times' | 'mono') || 'sans';
  });

  const setUiFont = (font: 'sans' | 'times' | 'mono') => {
    setUiFontState(font);
    localStorage.setItem('nexora_font', font);
  };

  // Daily Tasks
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('nexora_daily_tasks');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_TASKS;
  });

  // Roadmap
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>(() => {
    const saved = localStorage.getItem('nexora_roadmap');
    return saved ? JSON.parse(saved) : DEFAULT_ROADMAP_PHASES;
  });

  // Coding Problems
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>(() => {
    return CODING_PROBLEMS;
  });

  // Mock Interviews
  const [interviewHistory, setInterviewHistory] = useState<MockInterviewSession[]>([]);

  // Placement Simulation
  const [placementSimulation, setPlacementSimulation] = useState<PlacementSimulation>(() => {
    const saved = localStorage.getItem('nexora_placement_sim');
    return saved ? JSON.parse(saved) : DEFAULT_PLACEMENT_SIMULATION;
  });

  // Resume Data
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME);

  // Global Assistant & Voice Trigger
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('nexora_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Check Database Status
  const checkDatabase = useCallback(async () => {
    setDbStatus((prev) => ({ ...prev, checking: true }));
    try {
      const res = await api.checkHealth();
      if (res.success && res.data?.database?.connected) {
        setDbStatus({
          connected: true,
          error: null,
          checking: false,
          host: res.data.database.host,
          name: res.data.database.name,
        });
      } else {
        setDbStatus({
          connected: false,
          error: res.data?.database?.error || res.error || 'Cannot connect to MongoDB at mongodb://127.0.0.1:27017/nexora',
          checking: false,
        });
      }
    } catch (err: any) {
      setDbStatus({
        connected: false,
        error: err.message || 'MongoDB is not reachable.',
        checking: false,
      });
    }
  }, []);

  // Fetch and sync user progress from MongoDB
  const refreshProgress = useCallback(async () => {
    if (!getAuthToken()) return;
    try {
      const res = await api.progress.getProgress();
      if (res.success && res.data?.progress) {
        const p = res.data.progress;
        setCompletedLessons(p.completedLessons || []);
        setCompletedModules(p.completedModules || []);
        setBookmarks(p.bookmarks || []);
        setQuizHistory(p.quizAttempts || []);
        setStreak(p.streak || { currentStreak: 0, longestStreak: 0 });

        if (Array.isArray(p.notes)) {
          const notesMap: Record<string, string> = {};
          p.notes.forEach((n: any) => {
            if (n.moduleId) notesMap[n.moduleId] = n.text;
          });
          setNotes(notesMap);
        }

        // Sync solved coding problems
        if (Array.isArray(p.codingSolved)) {
          setCodingProblems((prev) =>
            prev.map((prob) => ({
              ...prob,
              solved: p.codingSolved.includes(prob.id),
            }))
          );
        }

        // Sync interview sessions
        if (Array.isArray(p.interviewSessions)) {
          setInterviewHistory(p.interviewSessions);
        }

        // Sync initial diagnostic assessment from MongoDB
        if (p.assessmentResult) {
          setAssessmentResult(p.assessmentResult);
        }

        // Sync completed tasks from MongoDB
        if (Array.isArray(p.completedTasks)) {
          setDailyTasks((prev) =>
            prev.map((t) => ({
              ...t,
              completed: p.completedTasks.includes(t.id),
            }))
          );
        }
      }
    } catch (err) {
      console.warn('[NEXORA Client] Failed to refresh user progress:', err);
    }
  }, []);

  // Fetch saved resume from MongoDB
  const fetchResume = useCallback(async () => {
    if (!getAuthToken()) return;
    try {
      const res = await api.resume.getResume();
      if (res.success && res.data?.resumeData) {
        setResumeData(res.data.resumeData);
      }
    } catch (err) {
      console.warn('[NEXORA Client] Failed to fetch resume:', err);
    }
  }, []);

  // Bootstrap Check on Application Mount
  useEffect(() => {
    checkDatabase();
    const token = getAuthToken();
    if (token) {
      api.auth
        .getMe()
        .then((res) => {
          if (res.success && res.data?.user) {
            const u = res.data.user;
            setProfile(u);
            setIsAuthenticated(true);
            setIsAdmin(u.role === 'admin');
            refreshProgress();
            fetchResume();
          } else {
            api.auth.logout();
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          setIsAdmin(false);
        });
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [checkDatabase, refreshProgress, fetchResume]);

  // Typography Class Application
  useEffect(() => {
    const body = document.body;
    body.classList.remove('font-times', 'font-sans-modern', 'font-mono-code');
    if (uiFont === 'times') {
      body.classList.add('font-times');
    } else if (uiFont === 'mono') {
      body.classList.add('font-mono-code');
    } else {
      body.classList.add('font-sans-modern');
    }
  }, [uiFont]);

  // Theme Handling
  useEffect(() => {
    const root = document.documentElement;

    const applyCurrentTheme = () => {
      let isDark = theme === 'dark';
      if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        root.classList.add('dark');
        setEffectiveTheme('dark');
      } else {
        root.classList.remove('dark');
        setEffectiveTheme('light');
      }
    };

    applyCurrentTheme();
    localStorage.setItem('nexora_theme', theme);

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyCurrentTheme();
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme]);

  // Sync state to localStorage for offline cache
  useEffect(() => {
    localStorage.setItem('nexora_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (assessmentResult) {
      localStorage.setItem('nexora_assessment', JSON.stringify(assessmentResult));
    }
  }, [assessmentResult]);

  useEffect(() => {
    localStorage.setItem('nexora_assessment_history', JSON.stringify(assessmentHistory));
  }, [assessmentHistory]);

  useEffect(() => {
    localStorage.setItem('nexora_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem('nexora_roadmap', JSON.stringify(roadmapPhases));
  }, [roadmapPhases]);

  useEffect(() => {
    localStorage.setItem('nexora_placement_sim', JSON.stringify(placementSimulation));
  }, [placementSimulation]);

  useEffect(() => {
    localStorage.setItem('nexora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Real MongoDB Login
  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const res = await api.auth.login(identifier, pass);
    if (res.success && res.data?.user) {
      const u = res.data.user;
      setProfile(u);
      setIsAuthenticated(true);
      setIsAdmin(u.role === 'admin');
      await refreshProgress();
      await fetchResume();
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid credentials' };
  };

  // Real MongoDB Registration
  const registerUser = async (data: any): Promise<{ success: boolean; error?: string }> => {
    const res = await api.auth.register(data);
    if (res.success && res.data?.user) {
      const u = res.data.user;
      setProfile(u);
      setIsAuthenticated(true);
      setIsAdmin(false);
      await refreshProgress();
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  // Real Administrator Login
  const adminLogin = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const res = await api.auth.adminLogin(identifier, pass);
    if (res.success && res.data?.user) {
      const u = res.data.user;
      setProfile(u);
      setIsAuthenticated(true);
      setIsAdmin(true);
      setCurrentPage('admin');
      await refreshProgress();
      return { success: true };
    }
    return { success: false, error: res.error || 'Invalid administrator credentials' };
  };

  // Real Logout
  const logout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAssessmentResult(null);
    setAssessmentHistory([]);
    setCurrentPage('overview');
  };

  // Update Profile on MongoDB & Client
  const updateProfile = async (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (updates.name) {
      setResumeData((r) => ({ ...r, fullName: updates.name! }));
    }

    if (
      (updates.branch && updates.branch !== profile.branch) ||
      (updates.targetRole && updates.targetRole !== profile.targetRole)
    ) {
      const newBranch = updates.branch || profile.branch;
      const newRole = updates.targetRole || profile.targetRole;
      setRoadmapPhases(getRoadmapForBranchAndRole(newBranch, newRole));
      setDailyTasks(getDailyTasksForBranchAndRole(newBranch, newRole, assessmentResult));
      setPlacementSimulation(getPlacementSimulationForBranchAndRole(newBranch, newRole));
    }

    if (isAuthenticated) {
      await api.auth.updateProfile(updates);
    }
  };

  // Complete Lesson (MongoDB persisted)
  const completeLesson = async (lessonId: string, moduleId?: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    const res = await api.progress.completeLesson(lessonId, moduleId);
    if (res.success) {
      setCompletedLessons((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
      if (moduleId) {
        setCompletedModules((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]));
      }
      completeTaskByCategory('Technical');
      return true;
    }
    return false;
  };

  // Toggle Bookmark (MongoDB persisted)
  const toggleBookmark = async (moduleId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    const res = await api.progress.toggleBookmark(moduleId);
    if (res.success) {
      setBookmarks(res.data?.bookmarks || []);
      return res.data?.bookmarked ?? false;
    }
    return false;
  };

  // Save Module Note (MongoDB persisted)
  const saveModuleNote = async (moduleId: string, text: string): Promise<void> => {
    setNotes((prev) => ({ ...prev, [moduleId]: text }));
    if (isAuthenticated) {
      await api.progress.saveNote(moduleId, text);
    }
  };

  // Submit Quiz Attempt (Server-Side Graded & Saved to MongoDB)
  const submitQuizAttempt = async (quizData: any): Promise<any> => {
    const res = await api.quiz.submitQuiz(quizData);
    if (res.success && res.data) {
      setQuizHistory((prev) => [res.data, ...prev]);
      if (res.data.streak) {
        setStreak(res.data.streak);
      }
      if (res.data.score >= 50) {
        completeTaskByCategory('Technical');
      }
      return res.data;
    }
    return null;
  };

  // Mark Coding Problem Solved
  const markCodingSolved = async (id: string): Promise<void> => {
    setCodingProblems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, solved: true } : p))
    );
    completeTaskByCategory('Coding');
    if (isAuthenticated) {
      await api.progress.markCodingSolved(id);
    }
  };

  // Save Resume to MongoDB
  const updateResumeData = async (updates: Partial<ResumeData>): Promise<void> => {
    const updated = { ...resumeData, ...updates };
    setResumeData(updated);
    if (isAuthenticated) {
      await api.resume.saveResume(updated);
    }
  };

  // Submit Diagnostic Assessment with Real Data Calculation & MongoDB Persistence
  const submitAssessment = async (
    answers: Record<number, number>,
    questions?: any[],
    skills?: string[],
    goals?: string[]
  ): Promise<AssessmentResult> => {
    const activeQuestions = questions && questions.length > 0 ? questions : DIAGNOSTIC_QUESTIONS;
    const totalQuestions = activeQuestions.length;
    let correctCount = 0;
    let aptTotal = 0;
    let aptCorrect = 0;
    let logicTotal = 0;
    let logicCorrect = 0;
    let techTotal = 0;
    let techCorrect = 0;
    let codingTotal = 0;
    let codingCorrect = 0;

    const validatedSkills: string[] = [];
    const skillsToImprove: string[] = [];

    activeQuestions.forEach((q: any) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;

      const cat = q.category;
      if (cat === 'Quantitative') {
        aptTotal++;
        if (isCorrect) aptCorrect++;
      } else if (cat === 'Logical Reasoning') {
        logicTotal++;
        if (isCorrect) logicCorrect++;
      } else if (cat === 'Technical Knowledge' || cat === 'OOP & DBMS' || cat === 'OS & Networks') {
        techTotal++;
        if (isCorrect) techCorrect++;
      } else {
        // Coding & Problem Solving / Programming / Data Structures
        codingTotal++;
        if (isCorrect) codingCorrect++;
      }

      if (q.testedSkill) {
        if (isCorrect) {
          validatedSkills.push(q.testedSkill);
        } else {
          skillsToImprove.push(q.testedSkill);
        }
      }
    });

    const overallScore = Math.round((correctCount / totalQuestions) * 100);
    const aptitudeScore = aptTotal > 0 ? Math.round((aptCorrect / aptTotal) * 100) : 0;
    const reasoningScore = logicTotal > 0 ? Math.round((logicCorrect / logicTotal) * 100) : 0;
    const technicalScore = techTotal > 0 ? Math.round((techCorrect / techTotal) * 100) : 0;
    const codingScore = codingTotal > 0 ? Math.round((codingCorrect / codingTotal) * 100) : 0;

    let preparationLevel: 'Foundation Level' | 'Developing Proficiency' | 'Placement Ready' | 'Advanced Competitive' = 'Developing Proficiency';
    if (overallScore < 50) preparationLevel = 'Foundation Level';
    else if (overallScore < 75) preparationLevel = 'Developing Proficiency';
    else if (overallScore < 90) preparationLevel = 'Placement Ready';
    else preparationLevel = 'Advanced Competitive';

    const categories = [
      { name: 'Quantitative Aptitude', score: aptitudeScore },
      { name: 'Logical Reasoning', score: reasoningScore },
      { name: 'Technical Knowledge', score: technicalScore },
      { name: 'Coding & Problem Solving', score: codingScore },
    ];

    const strengths = categories.filter((c) => c.score >= 70).map((c) => c.name);
    if (strengths.length === 0) {
      const highest = [...categories].sort((a, b) => b.score - a.score)[0];
      strengths.push(highest.name);
    }

    const weakAreas = categories.filter((c) => c.score < 70).map((c) => c.name);

    // Identify unassessed skills honestly (Requirement 6)
    const testedSkillNames = activeQuestions.map((q: any) => (q.testedSkill || '').toLowerCase());
    const userSelectedSkills = skills && skills.length > 0 ? skills : profile.skills || ['Python', 'SQL', 'Data Structures'];
    const unassessedSkills: string[] = [];

    userSelectedSkills.forEach((sk) => {
      const isTested = testedSkillNames.some((t: string) => t.includes(sk.toLowerCase()) || sk.toLowerCase().includes(t));
      if (!isTested) {
        unassessedSkills.push(sk);
      }
    });

    // Recommended Subjects with links to Learning Studio modules
    const recommendedSubjects = [
      { subject: 'Operating Systems', topic: 'Virtual Memory & Multi-Level Paging', moduleId: 'cse-mod-1' },
      { subject: 'Data Structures', topic: 'Self-Balancing BSTs (AVL & Red-Black)', moduleId: 'cse-mod-2' },
      { subject: 'Database Management', topic: 'Relational Normalization & BCNF', moduleId: 'cse-mod-3' },
      { subject: 'Computer Networks', topic: 'TCP 3-Way Handshake & Flow Control', moduleId: 'cse-mod-4' },
      { subject: 'Object-Oriented Design', topic: 'SOLID Principles & Virtual Tables', moduleId: 'cse-mod-5' },
    ];

    const personalizedRoadmap = [
      {
        phase: 'Phase 1 (Weeks 1-2)',
        title: 'Diagnostic Gaps Remediation & Aptitude Sprint',
        duration: '2 Weeks',
        topics: weakAreas.length > 0 ? weakAreas : ['Quantitative Speed Math', 'Two-Pointer Algorithms'],
      },
      {
        phase: 'Phase 2 (Weeks 3-4)',
        title: 'Core Systems & Algorithmic Problem Solving',
        duration: '2 Weeks',
        topics: ['Virtual Memory & Paging', 'Database Indexing', 'Graph & Tree Traversals'],
      },
      {
        phase: 'Phase 3 (Weeks 5-6)',
        title: 'Full Placement Simulations & Mock Interviews',
        duration: '2 Weeks',
        topics: ['4-Round Placement Simulator', 'STAR Behavioral Voice Drills', 'ATS Resume Finalization'],
      },
    ];

    const suggestedTasks = [
      { title: 'Study Virtual Memory & Paging Module', category: 'Technical', duration: '25 mins' },
      { title: 'Solve 15 Timed Quantitative Aptitude MCQs', category: 'Aptitude', duration: '20 mins' },
      { title: 'Implement Two Sum in Sandboxed Python Runner', category: 'Coding', duration: '30 mins' },
      { title: 'Practice "Tell Me About Yourself" Spoken Answer', category: 'Interview Preparation', duration: '15 mins' },
    ];

    const result: AssessmentResult = {
      overallScore,
      roleCompetencyCoverage: overallScore,
      aptitudeScore,
      reasoningScore,
      technicalScore,
      verbalScore: aptitudeScore, // backwards compat
      codingScore,
      preparationLevel,
      strengths,
      weakAreas,
      demonstratedStrengths: strengths,
      priorityCompetencyGaps: weakAreas,
      skillsToImprove: skillsToImprove.length > 0 ? skillsToImprove : ['Algorithmic Optimization under time pressure'],
      unassessedSkills: unassessedSkills.length > 0 ? unassessedSkills : ['Full-Stack System Architecture', 'Cloud Deployment CI/CD'],
      recommendedSubjects,
      recommendedTopics: weakAreas.length > 0 ? weakAreas : ['Operating Systems', 'Algorithmic Problem Solving'],
      recommendedInterventions: weakAreas.map((w) => `Complete dedicated 30-min module review in ${w}`),
      evidenceConfidence: Math.min(95, Math.max(15, Math.round(overallScore * 0.9 + 10))),
      knowledgeEvidence: overallScore,
      recommendedDifficulty: overallScore >= 80 ? 'Advanced' : overallScore >= 50 ? 'Intermediate' : 'Beginner',
      personalizedRoadmap,
      suggestedTasks,
      evaluationDisclaimer: 'This diagnostic report provides an initial competency baseline calculated strictly from your responses. It is not an immutable ceiling on your abilities; your placement readiness score dynamically increases as you complete practice sessions and coding challenges in NEXORA.',
      completedAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      totalQuestions,
      correctCount,
      answers,
    };

    setAssessmentResult(result);
    setAssessmentHistory((prev) => [result, ...prev]);

    // Mark user as onboarded in client profile
    setProfile((prev) => ({
      ...prev,
      onboarded: true,
      skills: userSelectedSkills,
      preparationGoals: goals || prev.preparationGoals || [],
    }));

    // Persist everything to MongoDB
    try {
      await api.progress.saveAssessment({
        assessmentResult: result,
        answers,
        skills: userSelectedSkills,
        preparationGoals: goals,
      });
    } catch (saveErr) {
      console.warn('[NEXORA Assessment] Cloud save warning:', saveErr);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#6366F1', '#06B6D4', '#10B981'],
      });
    } catch (e) {
      // safe fallback
    }

    addNotification({
      title: 'Diagnostic Benchmark Completed!',
      message: `You scored ${overallScore}%. We tailored your learning roadmap based on verified results.`,
      type: 'milestone',
      actionPage: 'overview',
    });

    return result;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#6366F1', '#06B6D4', '#10B981'],
      });
    } catch (e) {
      // safe fallback
    }

    addNotification({
      title: 'Diagnostic Benchmark Completed!',
      message: `You scored ${overallScore}%. We tailored your learning roadmap based on verified results.`,
      type: 'milestone',
      actionPage: 'overview',
    });

    return result;
  };

  const retakeAssessment = () => {
    setCurrentPage('overview');
  };

  const toggleTask = (id: string) => {
    setDailyTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      const newlyDone = updated.find((t) => t.id === id && t.completed);
      const allCompleted = updated.every((t) => t.completed);

      if (newlyDone) {
        addNotification({
          title: 'Placement Task Finished!',
          message: `Completed "${newlyDone.title}". Keep up the daily momentum!`,
          type: 'task',
          actionPage: 'tasks',
        });
      }

      if (allCompleted) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {}
      }

      return updated;
    });
  };

  const completeTaskByCategory = (
    category: 'Aptitude' | 'Coding' | 'Technical' | 'Interview Preparation'
  ) => {
    setDailyTasks((prev) => {
      const target = prev.find((t) => t.category === category && !t.completed);
      if (target) {
        return prev.map((t) => (t.id === target.id ? { ...t, completed: true } : t));
      }
      return prev;
    });
  };

  const generateDailyTasks = () => {
    const fresh = getDailyTasksForBranchAndRole(profile.branch, profile.targetRole, assessmentResult);
    setDailyTasks(fresh);
    addNotification({
      title: 'Plan Refreshed',
      message: `Generated fresh placement tasks aligned with ${profile.targetRole}.`,
      type: 'recommendation',
      actionPage: 'tasks',
    });
  };

  const toggleRoadmapTopic = (phaseId: string, topicId: string) => {
    setRoadmapPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          topics: phase.topics.map((top) =>
            top.id === topicId ? { ...top, completed: !top.completed } : top
          ),
        };
      })
    );
  };

  const saveInterviewSession = async (session: MockInterviewSession) => {
    setInterviewHistory((prev) => [session, ...prev]);
    completeTaskByCategory('Interview Preparation');
    if (isAuthenticated) {
      try {
        const res = await api.interview.saveSession(session);
        if (res.success && res.data?.streak) {
          setStreak(res.data.streak);
        }
      } catch (err) {
        console.error('Failed to save interview session to MongoDB:', err);
      }
    }
  };

  const updatePlacementRound = (
    roundId: number,
    status: 'current' | 'completed' | 'failed',
    score?: number,
    feedback?: string
  ) => {
    setPlacementSimulation((prev) => {
      const updatedRounds = prev.rounds.map((r) => {
        if (r.id === roundId) {
          return { ...r, status, score: score ?? r.score, feedback: feedback ?? r.feedback };
        }
        if (status === 'completed' && r.id === roundId + 1 && r.status === 'locked') {
          return { ...r, status: 'current' as const };
        }
        return r;
      });

      const allDone = updatedRounds.every((r) => r.status === 'completed');
      return {
        ...prev,
        status: allDone ? ('selected' as const) : prev.status,
        rounds: updatedRounds,
      };
    });
  };

  const restartPlacementSimulation = () => {
    const fresh = getPlacementSimulationForBranchAndRole(profile.branch, profile.targetRole);
    setPlacementSimulation(fresh);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (n: Omit<InAppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: InAppNotification = {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  };

  const resetDemoProgress = () => {
    setAssessmentResult(null);
    setAssessmentHistory([]);
    setDailyTasks(INITIAL_DAILY_TASKS);
    setRoadmapPhases(DEFAULT_ROADMAP_PHASES);
    setCodingProblems(CODING_PROBLEMS);
    setInterviewHistory([]);
    setCompletedLessons([]);
    setCompletedModules([]);
    setBookmarks([]);
    setNotes({});
    setQuizHistory([]);
    localStorage.removeItem('nexora_assessment');
    localStorage.removeItem('nexora_assessment_history');
    localStorage.removeItem('nexora_daily_tasks');
    localStorage.removeItem('nexora_roadmap');
    setCurrentPage('overview');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        dbStatus,
        checkDatabase,
        login,
        registerUser,
        adminLogin,
        logout,
        profile,
        updateProfile,
        assessmentResult,
        assessmentHistory,
        submitAssessment,
        retakeAssessment,
        currentPage,
        setCurrentPage,
        sidebarCollapsed,
        setSidebarCollapsed,
        theme,
        setTheme: setThemeState,
        effectiveTheme,
        uiFont,
        setUiFont,
        dailyTasks,
        toggleTask,
        completeTaskByCategory,
        generateDailyTasks,
        roadmapPhases,
        toggleRoadmapTopic,
        codingProblems,
        markCodingSolved,
        interviewHistory,
        saveInterviewSession,
        placementSimulation,
        updatePlacementRound,
        restartPlacementSimulation,
        resumeData,
        updateResumeData,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        resetDemoProgress,

        // Persistent MongoDB progress
        completedLessons,
        completedModules,
        bookmarks,
        notes,
        quizHistory,
        streak,
        completeLesson,
        toggleBookmark,
        saveModuleNote,
        submitQuizAttempt,
        refreshProgress,

        // Global Assistant & Voice
        assistantOpen,
        setAssistantOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
