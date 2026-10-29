import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Mic,
  Brain,
  Bot,
  UserCheck,
} from 'lucide-react';

export type InterviewerState = 'idle' | 'speaking' | 'listening' | 'evaluating';

interface AnimatedInterviewerProps {
  state: InterviewerState;
  questionText: string;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onReplayQuestion?: () => void;
  className?: string;
  interviewerName?: string;
  interviewerRole?: string;
}

export const AnimatedInterviewer: React.FC<AnimatedInterviewerProps> = ({
  state,
  questionText,
  onSpeechStart,
  onSpeechEnd,
  onReplayQuestion,
  className = '',
  interviewerName = 'Dr. Sarah Mitchell',
  interviewerRole = 'Senior Technical Evaluation Panel',
}) => {
  // Eye blinking state
  const [isBlinking, setIsBlinking] = useState(false);
  // Dynamic mouth phoneme frame for speaking animation (0 to 4)
  const [mouthFrame, setMouthFrame] = useState(0);

  // TTS voice controls & settings
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSpeakingInternal, setIsSpeakingInternal] = useState(false);

  // Interval refs
  const mouthIntervalRef = useRef<any>(null);
  const blinkTimeoutRef = useRef<any>(null);

  // 1. Natural Blinking Loop
  useEffect(() => {
    const scheduleNextBlink = () => {
      const delay = Math.random() * 3000 + 2500; // 2.5s to 5.5s
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150); // 150ms blink duration
      }, delay);
    };

    scheduleNextBlink();
    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, []);

  // 2. Synchronized Mouth Movement when speaking
  useEffect(() => {
    const isActuallySpeaking = state === 'speaking' || isSpeakingInternal;

    if (isActuallySpeaking) {
      // Rapid cycling through natural phoneme mouth positions
      mouthIntervalRef.current = setInterval(() => {
        // Pseudo-random speech phoneme selection
        setMouthFrame(Math.floor(Math.random() * 5));
      }, 110);
    } else {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
      setMouthFrame(0); // closed / slight smile
    }

    return () => {
      if (mouthIntervalRef.current) clearInterval(mouthIntervalRef.current);
    };
  }, [state, isSpeakingInternal]);

  // 3. Load & Prioritize High-Quality Natural Voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      // Filter for English voices
      const englishVoices = voices.filter(
        (v) => v.lang.startsWith('en') || v.lang.includes('US') || v.lang.includes('GB')
      );

      const list = englishVoices.length > 0 ? englishVoices : voices;
      setAvailableVoices(list);

      // Prioritize natural/neural voices if found
      const preferredIndex = list.findIndex(
        (v) =>
          v.name.includes('Natural') ||
          v.name.includes('Google US English') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Jenny') ||
          v.name.includes('Guy') ||
          v.name.includes('Karen') ||
          v.name.includes('Alex')
      );

      if (preferredIndex !== -1) {
        setSelectedVoiceIndex(preferredIndex);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // 4. Voice Speaking Handler
  const speakCurrentQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    if (isSpeakingInternal || state === 'speaking') {
      synth.cancel();
      setIsSpeakingInternal(false);
      onSpeechEnd?.();
      return;
    }

    synth.cancel();
    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    if (availableVoices[selectedVoiceIndex]) {
      utterance.voice = availableVoices[selectedVoiceIndex];
    }

    utterance.onstart = () => {
      setIsSpeakingInternal(true);
      onSpeechStart?.();
    };

    utterance.onend = () => {
      setIsSpeakingInternal(false);
      onSpeechEnd?.();
    };

    utterance.onerror = () => {
      setIsSpeakingInternal(false);
      onSpeechEnd?.();
    };

    synth.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingInternal(false);
    onSpeechEnd?.();
  };

  const isInterviewerSpeaking = state === 'speaking' || isSpeakingInternal;

  return (
    <div
      className={`card-cinematic p-6 sm:p-7 rounded-3xl flex flex-col items-center justify-between relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Studio Top Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 ${
          isInterviewerSpeaking
            ? 'bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 animate-pulse'
            : state === 'listening'
            ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400'
            : state === 'evaluating'
            ? 'bg-gradient-to-r from-amber-400 via-violet-500 to-amber-400 animate-pulse'
            : 'bg-gradient-to-r from-indigo-200 via-slate-200 to-indigo-200 dark:from-slate-800 dark:to-slate-800'
        }`}
      />

      {/* Top Header & Status Badges */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isInterviewerSpeaking
                  ? 'bg-cyan-500'
                  : state === 'listening'
                  ? 'bg-emerald-500'
                  : state === 'evaluating'
                  ? 'bg-amber-500'
                  : 'bg-indigo-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isInterviewerSpeaking
                  ? 'bg-cyan-500'
                  : state === 'listening'
                  ? 'bg-emerald-500'
                  : state === 'evaluating'
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
            />
          </span>

          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isInterviewerSpeaking
                ? 'text-cyan-700 dark:text-cyan-400'
                : state === 'listening'
                ? 'text-emerald-700 dark:text-emerald-400'
                : state === 'evaluating'
                ? 'text-amber-700 dark:text-amber-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isInterviewerSpeaking
              ? 'Speaking Question'
              : state === 'listening'
              ? 'Actively Listening'
              : state === 'evaluating'
              ? 'Analyzing Response...'
              : 'Interviewer Ready'}
          </span>
        </div>

        {/* Audio Setting / Controls Button */}
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Audio & Voice Settings"
          aria-label="Voice settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Popover Settings Drawer */}
      {showSettings && (
        <div className="w-full my-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-3 animate-in fade-in z-20">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-200">Interviewer Voice:</span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
                isMuted
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isMuted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>

          {availableVoices.length > 0 && (
            <div>
              <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                Select Persona Voice
              </label>
              <select
                value={selectedVoiceIndex}
                onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              >
                {availableVoices.slice(0, 8).map((v, idx) => (
                  <option key={idx} value={idx}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
              <span>Speech Speed:</span>
              <span className="font-bold font-mono text-indigo-600 dark:text-cyan-400">
                {speechRate}x
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[0.9, 1.0, 1.15].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSpeechRate(rate)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-bold border ${
                    speechRate === rate
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ANIMATED VECTOR CHARACTER CANVAS                              */}
      {/* ------------------------------------------------------------- */}
      <div className="my-6 relative flex flex-col items-center justify-center">
        {/* Subtle Ambient Backlight Aura */}
        <div
          className={`absolute w-44 h-44 rounded-full blur-[60px] transition-all duration-700 pointer-events-none ${
            isInterviewerSpeaking
              ? 'bg-cyan-500/25 scale-110'
              : state === 'listening'
              ? 'bg-emerald-500/20 scale-105'
              : state === 'evaluating'
              ? 'bg-amber-500/25 scale-115'
              : 'bg-indigo-500/15 scale-95'
          }`}
        />

        {/* Outer Circular Frame with Dynamic State Ring */}
        <div
          className={`relative w-40 h-40 sm:w-44 sm:h-44 rounded-full p-1.5 transition-all duration-500 shadow-xl ${
            isInterviewerSpeaking
              ? 'bg-gradient-to-tr from-cyan-400 via-indigo-500 to-cyan-300 ring-4 ring-cyan-400/20 shadow-cyan-500/20'
              : state === 'listening'
              ? 'bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 ring-4 ring-emerald-400/20 shadow-emerald-500/20'
              : state === 'evaluating'
              ? 'bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-500 ring-4 ring-amber-400/20 shadow-amber-500/20'
              : 'bg-gradient-to-tr from-indigo-200 via-slate-200 to-indigo-100 dark:from-slate-700 dark:to-slate-800'
          }`}
        >
          {/* Virtual Character SVG Stage */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FAF9F5] to-slate-100 dark:from-[#151923] dark:to-[#0D1017] overflow-hidden relative flex items-center justify-center shadow-inner">
            <svg
              viewBox="0 0 200 200"
              className={`w-full h-full transition-transform duration-300 ${
                state === 'listening' ? 'rotate-1 scale-102' : 'rotate-0'
              }`}
              style={{
                animation: isInterviewerSpeaking
                  ? 'head-nod 1.6s ease-in-out infinite'
                  : 'subtle-breathe 4s ease-in-out infinite',
              }}
            >
              <defs>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FBD5B5" />
                  <stop offset="100%" stopColor="#F5BE98" />
                </linearGradient>
                <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="100%" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#332421" />
                  <stop offset="100%" stopColor="#1C1412" />
                </linearGradient>
                <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
              </defs>

              {/* Background Studio Light Arc */}
              <circle cx="100" cy="90" r="85" fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="8" />

              {/* Shoulders / Professional Navy Blazer */}
              <path
                d="M 30 200 C 35 155, 60 145, 80 148 L 100 165 L 120 148 C 140 145, 165 155, 170 200 Z"
                fill="url(#suitGrad)"
              />

              {/* White Shirt Collar */}
              <polygon points="100,165 85,145 100,150" fill="url(#shirtGrad)" />
              <polygon points="100,165 115,145 100,150" fill="url(#shirtGrad)" />
              {/* Formal Tie or Lapel Pin */}
              <path d="M 97 150 L 103 150 L 105 185 L 95 185 Z" fill="#4F46E5" />

              {/* Neck */}
              <rect x="88" y="115" width="24" height="32" rx="4" fill="url(#skinGrad)" />

              {/* Head / Jaw */}
              <ellipse cx="100" cy="85" rx="36" ry="42" fill="url(#skinGrad)" />

              {/* Professional Eyeglasses Frame */}
              <rect
                x="72"
                y="74"
                width="22"
                height="15"
                rx="4"
                fill="none"
                stroke="#1E293B"
                strokeWidth="2.5"
              />
              <rect
                x="106"
                y="74"
                width="22"
                height="15"
                rx="4"
                fill="none"
                stroke="#1E293B"
                strokeWidth="2.5"
              />
              <line x1="94" y1="80" x2="106" y2="80" stroke="#1E293B" strokeWidth="2.5" />
              <line x1="62" y1="78" x2="72" y2="78" stroke="#1E293B" strokeWidth="2" />
              <line x1="128" y1="78" x2="138" y2="78" stroke="#1E293B" strokeWidth="2" />

              {/* Eyebrows (reactive to state) */}
              <path
                d={
                  state === 'evaluating'
                    ? 'M 72 70 Q 82 66 92 71'
                    : state === 'listening'
                    ? 'M 72 68 Q 82 66 92 69'
                    : 'M 72 70 Q 82 68 92 70'
                }
                fill="none"
                stroke="#2B1D19"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={
                  state === 'evaluating'
                    ? 'M 108 71 Q 118 66 128 70'
                    : state === 'listening'
                    ? 'M 108 69 Q 118 66 128 68'
                    : 'M 108 70 Q 118 68 128 70'
                }
                fill="none"
                stroke="#2B1D19"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Eyes (Open vs Blinking) */}
              {isBlinking ? (
                // Blinking closed eye line
                <g stroke="#2B1D19" strokeWidth="2" strokeLinecap="round">
                  <path d="M 76 82 Q 83 85 90 82" fill="none" />
                  <path d="M 110 82 Q 117 85 124 82" fill="none" />
                </g>
              ) : (
                // Open eyes with subtle pupil glance
                <g>
                  {/* Left Eye */}
                  <ellipse cx="83" cy="81.5" rx="5.5" ry="4" fill="#FFFFFF" />
                  <circle cx="83" cy="81.5" r="3" fill="#2B1D19" />
                  <circle cx="84" cy="80.5" r="1" fill="#FFFFFF" />

                  {/* Right Eye */}
                  <ellipse cx="117" cy="81.5" rx="5.5" ry="4" fill="#FFFFFF" />
                  <circle cx="117" cy="81.5" r="3" fill="#2B1D19" />
                  <circle cx="118" cy="80.5" r="1" fill="#FFFFFF" />
                </g>
              )}

              {/* Nose */}
              <path d="M 99 82 L 96 95 L 103 95" fill="none" stroke="#DCA27E" strokeWidth="2" strokeLinecap="round" />

              {/* -------------------------------------------------------- */}
              {/* SYNCHRONIZED MOUTH PHONEME ANIMATIONS                    */}
              {/* -------------------------------------------------------- */}
              {isInterviewerSpeaking ? (
                // Cycling mouth shapes while speaking
                mouthFrame === 1 ? (
                  // Open 'Ah' / 'Oh'
                  <ellipse cx="100" cy="107" rx="6" ry="6" fill="#8B2E24" stroke="#DCA27E" strokeWidth="1.5" />
                ) : mouthFrame === 2 ? (
                  // Wide 'Ee'
                  <path d="M 91 106 Q 100 111 109 106 Q 100 104 91 106 Z" fill="#8B2E24" stroke="#DCA27E" strokeWidth="1" />
                ) : mouthFrame === 3 ? (
                  // Round 'Oo'
                  <ellipse cx="100" cy="107" rx="4.5" ry="5.5" fill="#8B2E24" stroke="#DCA27E" strokeWidth="1.5" />
                ) : mouthFrame === 4 ? (
                  // Half-open talking
                  <ellipse cx="100" cy="106.5" rx="7.5" ry="4" fill="#8B2E24" stroke="#DCA27E" strokeWidth="1.5" />
                ) : (
                  // Closed transition
                  <path d="M 93 106 Q 100 108 107 106" fill="none" stroke="#9A3B30" strokeWidth="2.5" strokeLinecap="round" />
                )
              ) : state === 'listening' ? (
                // Attentive soft smile
                <path d="M 92 106 Q 100 110 108 106" fill="none" stroke="#9A3B30" strokeWidth="2" strokeLinecap="round" />
              ) : state === 'evaluating' ? (
                // Pensive slight purse
                <ellipse cx="100" cy="106" rx="4" ry="2.5" fill="#9A3B30" />
              ) : (
                // Idle gentle smile
                <path d="M 93 106 Q 100 109 107 106" fill="none" stroke="#9A3B30" strokeWidth="2" strokeLinecap="round" />
              )}

              {/* Professional Hairstyle */}
              <path
                d="M 64 85 C 60 55, 75 42, 100 42 C 125 42, 140 55, 136 85 C 130 60, 115 52, 100 52 C 85 52, 70 60, 64 85 Z"
                fill="url(#hairGrad)"
              />
              <path
                d="M 66 75 C 64 60, 80 48, 100 48 C 115 48, 134 58, 134 75 C 128 65, 115 60, 100 60 C 85 60, 72 65, 66 75 Z"
                fill="url(#hairGrad)"
              />

              {/* Professional Headset / Lapel Mic */}
              <path d="M 65 85 Q 60 102 75 106" fill="none" stroke="#334155" strokeWidth="2" />
              <circle cx="76" cy="106" r="3" fill="#06B6D4" />
            </svg>
          </div>
        </div>

        {/* Live Audio Acoustic Waveform Visualizer */}
        <div className="flex items-center gap-1 mt-4 h-6 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {[40, 75, 55, 90, 60, 80, 45].map((height, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isInterviewerSpeaking
                  ? 'bg-cyan-500 animate-pulse'
                  : state === 'listening'
                  ? 'bg-emerald-500'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
              style={{
                height: isInterviewerSpeaking
                  ? `${Math.max(6, Math.min(22, (height * (mouthFrame + 1)) / 3))}px`
                  : state === 'listening'
                  ? '10px'
                  : '4px',
              }}
            />
          ))}
          <span className="text-[10px] font-mono text-slate-400 ml-1.5">
            {isInterviewerSpeaking ? 'Audio Playing' : state === 'listening' ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Interviewer Persona Info & Bottom Interactive Controls */}
      <div className="w-full text-center space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-[#202334] dark:text-white flex items-center justify-center gap-1.5">
            <span>{interviewerName}</span>
            <UserCheck className="w-3.5 h-3.5 text-[#4F46E5] dark:text-cyan-400" />
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{interviewerRole}</p>
        </div>

        {/* Audio Action Buttons */}
        <div className="flex items-center justify-center gap-2">
          {/* Read Aloud / Stop Button */}
          <button
            type="button"
            onClick={speakCurrentQuestion}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isInterviewerSpeaking
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-[#4F46E5] dark:text-cyan-300 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            {isInterviewerSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Pause Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#4F46E5] dark:text-cyan-400" />
                <span>Hear Question</span>
              </>
            )}
          </button>

          {/* Replay Button */}
          <button
            type="button"
            onClick={() => {
              handleStopSpeaking();
              setTimeout(() => {
                speakCurrentQuestion();
                onReplayQuestion?.();
              }, 100);
            }}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Replay from start"
            aria-label="Replay Question Audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
