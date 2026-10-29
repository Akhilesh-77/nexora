import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Pause,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Briefcase,
  ShieldCheck,
  Award,
  Bot,
  User,
  HelpCircle,
  Clock,
  Play,
  Copy,
  Check,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiService, InterviewFeedbackResponse } from '../services/aiService';
import { MockInterviewSession, InterviewRoundType } from '../types';
import { getInterviewQuestionsForBranchAndRole } from '../data/branchRoleMapping';
import { PlacementSimulatorView } from './PlacementSimulatorView';
import { AnimatedInterviewer, InterviewerState } from '../components/AnimatedInterviewer';
import { CinematicBackground } from '../components/CinematicBackground';
import { voiceService } from '../services/voiceService';

type SpeechState =
  | 'idle'
  | 'requesting'
  | 'listening'
  | 'processing'
  | 'stopped'
  | 'denied'
  | 'no-speech'
  | 'error'
  | 'unsupported';

interface MockInterviewViewProps {
  initialTab?: 'interview' | 'simulation';
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({
  initialTab = 'interview',
}) => {
  const { profile, saveInterviewSession } = useApp();

  // Hub tabs: 'interview' | 'simulation'
  const [activeTab, setActiveTab] = useState<'interview' | 'simulation'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Setup state
  const [inSession, setInSession] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [roundType, setRoundType] = useState<InterviewRoundType>('Technical Interview');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [totalQuestions, setTotalQuestions] = useState<number>(5);

  // Active question index (0 to totalQuestions - 1)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Immediate answer feedback state for current question
  const [currentFeedback, setCurrentFeedback] = useState<InterviewFeedbackResponse | null>(null);

  // Stored responses for final summary
  const [sessionAnswers, setSessionAnswers] = useState<
    { question: string; answer: string; feedback: InterviewFeedbackResponse }[]
  >([]);

  // Speech Recognition (STT) state & refs
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const preSpeechTextRef = useRef<string>('');
  const isListeningRef = useRef<boolean>(false);

  // Speech Synthesis (TTS)
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [autoReadQuestion, setAutoReadQuestion] = useState(true);
  const [copiedModelAnswer, setCopiedModelAnswer] = useState(false);

  // Dynamic branch-aware questions pool
  const activeQuestions = getInterviewQuestionsForBranchAndRole(
    profile.branch || 'Computer Science and Engineering',
    profile.targetRole || 'Software Engineer',
    roundType
  );

  const currentQuestionText =
    activeQuestions[currentQuestionIndex % activeQuestions.length] ||
    `Tell me about yourself, your engineering coursework in ${profile.branch}, and your career goals in ${profile.targetRole}.`;

  // Stop recognition and synthesis when unmounting or changing questions
  const stopAllSpeechActivities = () => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      isListeningRef.current = false;
    }
    voiceService.stopSpeaking();
    setTtsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopAllSpeechActivities();
    };
  }, []);

  useEffect(() => {
    stopAllSpeechActivities();
    setSpeechState('idle');
    setSpeechError(null);
  }, [currentQuestionIndex, inSession]);

  // STT Microphone Toggle: populates the textarea directly!
  const toggleSpeechRecognition = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechState('unsupported');
      setSpeechError(
        'Speech recognition is not supported in this browser. You can type your answer directly in the text box below.'
      );
      return;
    }

    // If currently listening, stop it
    if (isListeningRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore
      }
      isListeningRef.current = false;
      setSpeechState('stopped');
      return;
    }

    // Proactively request browser microphone permission
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (permErr: any) {
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
          setSpeechState('denied');
          setSpeechError(
            'Microphone access was denied. You can continue typing your response directly in the text box.'
          );
          return;
        }
      }
    }

    // Start recognition session
    try {
      setSpeechError(null);
      setSpeechState('requesting');

      // Snapshot whatever text the student already typed
      preSpeechTextRef.current = currentAnswer;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setSpeechState('listening');
      };

      recognition.onresult = (event: any) => {
        let finalConcat = '';
        let interim = '';

        for (let i = 0; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalConcat += piece + ' ';
          } else {
            interim += piece;
          }
        }

        const base = preSpeechTextRef.current.trim();
        const spoken = (finalConcat + interim).trim();
        const updated = base ? `${base} ${spoken}` : spoken;

        // Directly updates the controlled textarea state!
        setCurrentAnswer(updated);
        setSpeechState('listening');
      };

      recognition.onerror = (event: any) => {
        isListeningRef.current = false;
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setSpeechState('denied');
          setSpeechError(
            'Microphone access was denied. You can continue typing your response directly in the text box.'
          );
        } else if (event.error === 'no-speech') {
          setSpeechState('no-speech');
          setSpeechError(
            'No speech detected. Speak closer to your microphone or type your response in the box.'
          );
        } else {
          setSpeechState('error');
          setSpeechError(
            `Speech input notice: ${event.error}. You can continue typing in the text box.`
          );
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setSpeechState((curr) => (curr === 'listening' ? 'stopped' : curr));
        setCurrentAnswer((prev) => prev.trim());
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      isListeningRef.current = false;
      setSpeechState('error');
      setSpeechError('Microphone could not be initialized. Please type your answer directly.');
    }
  };

  // TTS Read Aloud Question
  const speakQuestion = (text: string) => {
    if (!voiceService.isTtsSupported()) {
      setSpeechError('Text-to-speech audio is not supported in this browser.');
      return;
    }

    if (ttsPlaying) {
      voiceService.stopSpeaking();
      setTtsPlaying(false);
      return;
    }

    voiceService.speak(text, {
      onStart: () => setTtsPlaying(true),
      onEnd: () => setTtsPlaying(false),
    });
  };

  // Start Interview Session
  const handleStartInterview = () => {
    setInSession(true);
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setCurrentFeedback(null);
    setSessionAnswers([]);
    setSpeechError(null);

    // Auto-read first question if enabled
    if (autoReadQuestion && 'speechSynthesis' in window) {
      setTimeout(() => {
        speakQuestion(currentQuestionText);
      }, 500);
    }
  };

  // Submit Answer for Current Question
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isEvaluating) return;

    stopAllSpeechActivities();
    setIsEvaluating(true);

    try {
      const feedback = await aiService.evaluateInterviewAnswer({
        role: profile.targetRole || 'Software Engineer',
        question: currentQuestionText,
        answer: currentAnswer.trim(),
        category: roundType,
        difficulty,
      });

      setCurrentFeedback(feedback);
      setSessionAnswers((prev) => [
        ...prev,
        { question: currentQuestionText, answer: currentAnswer.trim(), feedback },
      ]);
    } catch (e) {
      // Fallback feedback if network disconnects
      const fallbackFeedback: InterviewFeedbackResponse = {
        overallScore: 72,
        technicalScore: 75,
        communicationScore: 70,
        relevanceScore: 72,
        whatWasCorrect: ['Addressed the main question accurately and maintained clear communication.'],
        whatWasMissing: ['Provide additional quantitative metrics and engineering project examples.'],
        modelAnswer: `For "${currentQuestionText}", introduce the fundamental engineering principle, describe the operating parameters and trade-offs, and ground your response with a project example.`,
        isAiPowered: false,
      };
      setCurrentFeedback(fallbackFeedback);
      setSessionAnswers((prev) => [
        ...prev,
        { question: currentQuestionText, answer: currentAnswer.trim(), feedback: fallbackFeedback },
      ]);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Move to next question or complete session
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setCurrentFeedback(null);
      setSpeechState('idle');
      setSpeechError(null);

      const nextQuestionText =
        activeQuestions[(currentQuestionIndex + 1) % activeQuestions.length] ||
        'Explain how you would handle this engineering scenario.';

      if (autoReadQuestion && 'speechSynthesis' in window) {
        setTimeout(() => {
          speakQuestion(nextQuestionText);
        }, 400);
      }
    } else {
      // Complete Session
      setIsCompleted(true);
      setInSession(false);

      // Compute composite metrics from real answers submitted
      const evaluatedAnswers = sessionAnswers;
      const count = evaluatedAnswers.length || 1;
      const avgOverall = Math.round(
        evaluatedAnswers.reduce((sum, item) => sum + item.feedback.overallScore, 0) / count
      );
      const avgTech = Math.round(
        evaluatedAnswers.reduce((sum, item) => sum + item.feedback.technicalScore, 0) / count
      );
      const avgComm = Math.round(
        evaluatedAnswers.reduce((sum, item) => sum + item.feedback.communicationScore, 0) / count
      );
      const avgRel = Math.round(
        evaluatedAnswers.reduce((sum, item) => sum + item.feedback.relevanceScore, 0) / count
      );

      const session: MockInterviewSession = {
        id: `int-${Date.now()}`,
        targetRole: profile.targetRole || 'Software Engineer',
        type: roundType,
        difficulty,
        totalQuestions,
        currentQuestionIndex: totalQuestions,
        messages: [],
        completed: true,
        date: new Date().toLocaleDateString(),
        finalFeedback: {
          overallScore: avgOverall,
          technicalScore: avgTech,
          communicationScore: avgComm,
          relevanceScore: avgRel,
          demonstratedStrengths: [
            `${profile.branch} domain reasoning was communicated clearly.`,
            'Structured response framework answered prompt requirements directly.',
          ],
          priorityCompetencyGaps: [
            'Incorporate deeper quantitative benchmarks and industry standard codes (e.g. ASME/IEEE/ISO).',
            'Connect explanations to hands-on university projects and capstone design choices.',
          ],
          interviewEvidence: `Candidate completed ${count} verbal and typed questions in ${roundType} with an average score of ${avgOverall}%.`,
        },
      };

      saveInterviewSession(session);
    }
  };

  const handleRetakeInterview = () => {
    setIsCompleted(false);
    setInSession(false);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setCurrentFeedback(null);
    setSessionAnswers([]);
    setSpeechError(null);
  };

  // If viewing Placement Simulator tab
  if (activeTab === 'simulation') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('interview')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            AI Mock Interview
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4F46E5] text-white shadow-xs cursor-pointer"
          >
            Placement Simulator
          </button>
        </div>
        <PlacementSimulatorView />
      </div>
    );
  }

  // Final Summary Screen
  if (isCompleted) {
    const count = sessionAnswers.length || 1;
    const avgOverall = Math.round(
      sessionAnswers.reduce((sum, item) => sum + item.feedback.overallScore, 0) / count
    );
    const avgTech = Math.round(
      sessionAnswers.reduce((sum, item) => sum + item.feedback.technicalScore, 0) / count
    );
    const avgComm = Math.round(
      sessionAnswers.reduce((sum, item) => sum + item.feedback.communicationScore, 0) / count
    );
    const avgRel = Math.round(
      sessionAnswers.reduce((sum, item) => sum + item.feedback.relevanceScore, 0) / count
    );

    return (
      <CinematicBackground variant="studio" className="space-y-6 pb-12 max-w-4xl mx-auto transition-colors">
        {/* Completion Header */}
        <div className="p-8 rounded-3xl card-cinematic luminous-border shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Verified Interview Session Logged
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202334] dark:text-white">
              {roundType} Complete!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Target Role: <span className="font-bold text-[#4F46E5] dark:text-cyan-400">{profile.targetRole}</span> • Specialization: <span className="font-semibold">{profile.branch}</span>
            </p>
          </div>

          {/* Scores Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Overall</span>
              <p className="text-2xl font-black text-cyan-500 font-mono mt-0.5">{avgOverall}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Technical</span>
              <p className="text-2xl font-black text-indigo-500 font-mono mt-0.5">{avgTech}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Communication</span>
              <p className="text-2xl font-black text-emerald-500 font-mono mt-0.5">{avgComm}%</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Relevance</span>
              <p className="text-2xl font-black text-amber-500 font-mono mt-0.5">{avgRel}%</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRetakeInterview}
              className="btn-cinematic flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Another Round</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Reviews */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#202334] dark:text-white uppercase tracking-wider">
            Round Question-by-Question Evaluation Breakdown
          </h3>

          {sessionAnswers.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-[#4F46E5] dark:text-cyan-400">
                  Question #{idx + 1}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  Score: {item.feedback.overallScore}%
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.question}</p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 mt-2">
                  <span className="font-bold text-slate-400 block text-[10px] uppercase mb-0.5">
                    Your Response:
                  </span>
                  <p className="italic">"{item.answer}"</p>
                </div>
              </div>

              {item.feedback.whatWasCorrect && item.feedback.whatWasCorrect.length > 0 && (
                <div className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                  <span className="font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Demonstrated Strength:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {item.feedback.whatWasCorrect.join('. ')}
                  </p>
                </div>
              )}

              {item.feedback.whatWasMissing && item.feedback.whatWasMissing.length > 0 && (
                <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  <span className="font-bold text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Growth Gap:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {item.feedback.whatWasMissing.join('. ')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CinematicBackground>
    );
  }

  // Active Live Interview Session
  if (inSession) {
    const isMicActive = speechState === 'listening';
    const interviewerState: InterviewerState = isEvaluating
      ? 'evaluating'
      : ttsPlaying
      ? 'speaking'
      : isMicActive || (currentAnswer.trim().length > 0 && !currentFeedback)
      ? 'listening'
      : 'idle';

    return (
      <CinematicBackground variant="studio" className="pb-12 max-w-5xl mx-auto transition-colors">
        {/* Top Session Progress Bar */}
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#4F46E5] text-white font-mono shadow-xs">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {profile.branch} • {profile.targetRole}
            </span>
          </div>

          <button
            onClick={() => {
              stopAllSpeechActivities();
              setInSession(false);
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Exit Session
          </button>
        </div>

        {/* Inline Audio/Speech Notice Banner */}
        {speechError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{speechError}</span>
            </div>
            <button
              onClick={() => setSpeechError(null)}
              className="text-amber-600 dark:text-amber-400 hover:underline text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SPLIT-SCREEN INTERVIEW STUDIO: LEFT ANIMATED INTERVIEWER, RIGHT CANDIDATE ANSWER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Animated Virtual Interviewer Character (5 cols on lg) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <AnimatedInterviewer
              state={interviewerState}
              questionText={currentQuestionText}
              onSpeechStart={() => setTtsPlaying(true)}
              onSpeechEnd={() => setTtsPlaying(false)}
              onReplayQuestion={() => speakQuestion(currentQuestionText)}
              interviewerName="Dr. Sarah Mitchell"
              interviewerRole={`${roundType} • Panel Lead`}
            />

            {/* Quick Context Tip */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1 shadow-xs">
              <span className="font-bold text-[#202334] dark:text-white block text-[11px] uppercase tracking-wider">
                Recruiter Evaluation Focus
              </span>
              <p className="text-[11px] leading-relaxed">
                State your engineering assumptions clearly. If discussing algorithms or physical systems, explain time/space bounds, tradeoffs, and failure modes.
              </p>
            </div>
          </div>

          {/* Right Column: Question Bubble & Candidate Answer Workspace (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. INTERVIEW QUESTION STAGE */}
            <div className="card-cinematic p-6 sm:p-7 rounded-3xl space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200/60 dark:border-indigo-800/40">
                  {roundType} Question
                </span>

                <button
                  type="button"
                  onClick={() => speakQuestion(currentQuestionText)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    ttsPlaying
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#4F46E5]'
                  }`}
                >
                  {ttsPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{ttsPlaying ? 'Stop Voice' : 'Hear Question'}</span>
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white leading-relaxed">
                "{currentQuestionText}"
              </h2>
            </div>

            {/* 2. CANDIDATE ANSWER STAGE (Voice Input & Textarea) */}
            {!currentFeedback && (
              <div className="card-cinematic p-6 sm:p-7 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-500" />
                    <span className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                      Your Answer (Speak or Type)
                    </span>
                  </div>

                  {/* Speech Recognition Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isMicActive
                          ? 'bg-rose-600 text-white animate-pulse shadow-md'
                          : 'bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 hover:bg-[#4F46E5] hover:text-white'
                      }`}
                    >
                      {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      <span>{isMicActive ? 'Stop Mic' : 'Speak into Mic'}</span>
                    </button>
                  </div>
                </div>

                {/* Listening Indicator */}
                {isMicActive && (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                      <span className="font-semibold">
                        Listening to your voice... Spoken words stream below in real time.
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">Editable by keyboard</span>
                  </div>
                )}

                {/* Editable Text Box (Spoken text appears directly here) */}
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  rows={7}
                  placeholder="Tap 'Speak into Mic' to talk, or type your technical answer here. You can freely edit, correct, delete, or add text before submitting..."
                  className="w-full p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-[#111827] dark:text-white leading-relaxed focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-colors"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Word count: {currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} words
                  </span>

                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={!currentAnswer.trim() || isEvaluating}
                    className="btn-cinematic flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isEvaluating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Evaluating Response...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 3. EVALUATOR FEEDBACK STAGE */}
            {currentFeedback && (
              <div className="card-cinematic p-6 sm:p-7 rounded-3xl space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider">
                      Evaluator Feedback & Scorecard
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Overall Score:</span>
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono">
                      {currentFeedback.overallScore}%
                    </span>
                  </div>
                </div>

                {/* Rubric Matrix */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Technical</span>
                    <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                      {currentFeedback.technicalScore}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Communication</span>
                    <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {currentFeedback.communicationScore}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Relevance</span>
                    <p className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                      {currentFeedback.relevanceScore}%
                    </p>
                  </div>
                </div>

                {/* Strengths & Missing Concepts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Demonstrated Strengths:</span>
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentFeedback.strengths ||
                        currentFeedback.whatWasCorrect?.join('. ') ||
                        'Addressed core concept requirements and presented a structured technical foundation.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Growth Gaps & Missing Logic:</span>
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentFeedback.improvements ||
                        currentFeedback.whatWasMissing?.join('. ') ||
                        'Incorporate specific metrics, failure modes, and industry standards into your response.'}
                    </p>
                  </div>
                </div>

                {/* Model Sample Answer */}
                {(currentFeedback.sampleAnswer || currentFeedback.modelAnswer) && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-[#0D1017] border border-indigo-200/80 dark:border-indigo-900/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#4F46E5] dark:text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Recruiter-Approved Model Answer:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const ans = currentFeedback.sampleAnswer || currentFeedback.modelAnswer;
                          navigator.clipboard.writeText(ans);
                          setCopiedModelAnswer(true);
                          setTimeout(() => setCopiedModelAnswer(false), 2000);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F46E5] dark:text-cyan-400 hover:underline cursor-pointer"
                      >
                        {copiedModelAnswer ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedModelAnswer ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{currentFeedback.sampleAnswer || currentFeedback.modelAnswer}"
                    </p>
                  </div>
                )}

                {/* Continue Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn-cinematic px-7 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>
                      {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'View Session Results'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CinematicBackground>
    );
  }

  // Pre-Session Setup Screen
  return (
    <CinematicBackground variant="studio" className="pb-12 max-w-4xl mx-auto transition-colors">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl card-cinematic luminous-border shadow-xl relative overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200/80 dark:border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Branch-Aware Campus Placement Evaluator</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
              AI Mock Interview Simulator
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Targeted practice for <span className="text-[#4F46E5] dark:text-cyan-400 font-bold">{profile.targetRole}</span> in{' '}
              <span className="font-bold text-slate-800 dark:text-slate-200">{profile.branch}</span>. Answer by voice or text and receive rubrics with model recruiter responses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('interview')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#4F46E5] text-white shadow-xs cursor-pointer"
            >
              Interview Practice
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Full Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-[#202334] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#4F46E5]" />
            <span>Select Interview Round & Difficulty</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Questions adapt automatically to your engineering branch ({profile.branch}).
          </p>
        </div>

        {/* Round Type Pickers */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Interview Round
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Technical Interview', label: 'Technical Interview', desc: 'Core branch concepts, design & trade-offs' },
              { id: 'Technical Assessment', label: 'Technical Assessment', desc: 'Screening questions on fundamentals' },
              { id: 'HR Interview', label: 'HR & Behavioral', desc: 'STAR situational & team questions' },
              { id: 'Project Discussion', label: 'Project Defense', desc: 'Walkthrough of your capstone project' },
              { id: 'Aptitude & Reasoning', label: 'Aptitude Discussion', desc: 'Explaining quantitative thought process' },
            ].map((round) => (
              <button
                key={round.id}
                type="button"
                onClick={() => setRoundType(round.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  roundType === round.id
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#4F46E5]'
                }`}
              >
                <p className="text-xs font-bold">{round.label}</p>
                <p
                  className={`text-[11px] mt-1 ${
                    roundType === round.id ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {round.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Sub-grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    difficulty === diff
                      ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-800 dark:text-cyan-300 font-bold'
                      : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Question Count
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTotalQuestions(num)}
                  className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                    totalQuestions === num
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5] font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {num} Questions
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoReadQuestion}
              onChange={(e) => setAutoReadQuestion(e.target.checked)}
              className="rounded text-[#4F46E5]"
            />
            <span>Auto-read interviewer questions using voice</span>
          </label>

          <button
            onClick={handleStartInterview}
            className="btn-cinematic flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Begin Mock Session</span>
          </button>
        </div>
      </div>
    </CinematicBackground>
  );
};
