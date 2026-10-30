import React from 'react';

export type BotMood = 'idle' | 'thinking' | 'speaking' | 'happy';

interface BotFaceProps {
  mood?: BotMood;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showStatusText?: boolean;
}

export const BotFace: React.FC<BotFaceProps> = ({
  mood = 'idle',
  size = 'md',
  className = '',
  showStatusText = false,
}) => {
  // Dimension mappings
  const dimensionMap = {
    xs: { width: 28, height: 28, scale: 0.7 },
    sm: { width: 36, height: 36, scale: 0.9 },
    md: { width: 52, height: 52, scale: 1.3 },
    lg: { width: 84, height: 84, scale: 2.1 },
  };

  const { width, height } = dimensionMap[size];

  // Status text for the current state
  const statusLabels = {
    idle: 'Ready to assist',
    thinking: 'Thinking through response...',
    speaking: 'Explaining concept...',
    happy: 'Glad to help!',
  };

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {/* Ambient Glow Aura */}
        <div
          className={`absolute inset-0 rounded-2xl blur-md transition-all duration-500 pointer-events-none ${
            mood === 'thinking'
              ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500 opacity-80 scale-125 animate-pulse'
              : mood === 'speaking'
              ? 'bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 opacity-60 scale-110'
              : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 opacity-30 group-hover:opacity-60 scale-100'
          }`}
        />

        {/* Orbiting Neural Rings when Thinking */}
        {mood === 'thinking' && (
          <div className="absolute -inset-1.5 rounded-full border border-dashed border-cyan-400/70 animate-spin pointer-events-none" />
        )}

        {/* SVG Robot Face Graphic */}
        <svg
          viewBox="0 0 100 100"
          width={width}
          height={height}
          className="relative z-10 drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Outer Helmet Gradient */}
            <linearGradient id="botHelmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Screen Glass Gradient */}
            <linearGradient id="botScreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#090D16" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Eye Glow Filter */}
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Top Antenna Node */}
          <rect x="47" y="6" width="6" height="10" rx="3" fill="url(#botHelmetGrad)" />
          <circle
            cx="50"
            cy="6"
            r={mood === 'thinking' ? 5 : 4}
            fill={mood === 'thinking' ? '#22D3EE' : '#6366F1'}
            filter="url(#cyanGlow)"
            className={mood === 'thinking' ? 'animate-ping' : ''}
          />
          {mood === 'thinking' && (
            <circle cx="50" cy="6" r="4" fill="#22D3EE" filter="url(#cyanGlow)" />
          )}

          {/* Left Ear Sensor */}
          <rect
            x="6"
            y="40"
            width="6"
            height="22"
            rx="3"
            fill="url(#botHelmetGrad)"
            opacity={mood === 'thinking' || mood === 'speaking' ? 1 : 0.8}
          />
          {/* Right Ear Sensor */}
          <rect
            x="88"
            y="40"
            width="6"
            height="22"
            rx="3"
            fill="url(#botHelmetGrad)"
            opacity={mood === 'thinking' || mood === 'speaking' ? 1 : 0.8}
          />

          {/* Main Helmet Chassis */}
          <rect
            x="12"
            y="16"
            width="76"
            height="72"
            rx="22"
            fill="url(#botHelmetGrad)"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
          />

          {/* Visor Screen Glass */}
          <rect
            x="18"
            y="23"
            width="64"
            height="58"
            rx="16"
            fill="url(#botScreenGrad)"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="1.2"
          />

          {/* Screen Scanlines Highlight */}
          <path
            d="M 22 28 Q 50 32 78 28"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
            fill="none"
          />

          {/* ======================================================== */}
          {/* EXPRESSIVE EYES BASED ON MOOD */}
          {/* ======================================================== */}

          {mood === 'thinking' ? (
            /* --- THINKING MODE: Scanning Laser Eyes & Data Pulse --- */
            <g filter="url(#cyanGlow)">
              {/* Left Eye: Pulsing focus diamond */}
              <circle cx="36" cy="46" r="7" fill="#06B6D4">
                <animate
                  attributeName="r"
                  values="4;8;4"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="36" cy="46" r="3" fill="#FFFFFF" />

              {/* Right Eye: Pulsing focus diamond */}
              <circle cx="64" cy="46" r="7" fill="#06B6D4">
                <animate
                  attributeName="r"
                  values="8;4;8"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="1;0.6;1"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="64" cy="46" r="3" fill="#FFFFFF" />

              {/* Horizontal Laser Scanning Beam */}
              <line
                x1="24"
                y1="46"
                x2="76"
                y2="46"
                stroke="#22D3EE"
                strokeWidth="1.5"
                strokeDasharray="4, 4"
                opacity="0.8"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;16"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
              </line>

              {/* Thinking Mouth: Moving Data Dots */}
              <circle cx="42" cy="65" r="2" fill="#22D3EE">
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="50" cy="65" r="2.5" fill="#22D3EE">
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="0.6s"
                  begin="0.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="58" cy="65" r="2" fill="#22D3EE">
                <animate
                  attributeName="opacity"
                  values="0.2;1;0.2"
                  dur="0.6s"
                  begin="0.4s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ) : mood === 'speaking' ? (
            /* --- SPEAKING MODE: Excited Curved Eyes & Equalizer Mouth --- */
            <g filter="url(#cyanGlow)">
              {/* Happy curved eyes (^ ^) */}
              <path
                d="M 28 48 Q 36 38 44 48"
                stroke="#22D3EE"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 56 48 Q 64 38 72 48"
                stroke="#22D3EE"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Animated Audio Equalizer Mouth */}
              <line x1="38" y1="65" x2="38" y2="65" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="y1" values="67;60;67" dur="0.4s" repeatCount="indefinite" />
                <animate attributeName="y2" values="63;70;63" dur="0.4s" repeatCount="indefinite" />
              </line>
              <line x1="44" y1="65" x2="44" y2="65" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="y1" values="63;57;63" dur="0.35s" repeatCount="indefinite" />
                <animate attributeName="y2" values="67;73;67" dur="0.35s" repeatCount="indefinite" />
              </line>
              <line x1="50" y1="65" x2="50" y2="65" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round">
                <animate attributeName="y1" values="61;54;61" dur="0.3s" repeatCount="indefinite" />
                <animate attributeName="y2" values="69;76;69" dur="0.3s" repeatCount="indefinite" />
              </line>
              <line x1="56" y1="65" x2="56" y2="65" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="y1" values="63;58;63" dur="0.35s" repeatCount="indefinite" />
                <animate attributeName="y2" values="67;72;67" dur="0.35s" repeatCount="indefinite" />
              </line>
              <line x1="62" y1="65" x2="62" y2="65" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round">
                <animate attributeName="y1" values="67;61;67" dur="0.4s" repeatCount="indefinite" />
                <animate attributeName="y2" values="63;69;63" dur="0.4s" repeatCount="indefinite" />
              </line>
            </g>
          ) : mood === 'happy' ? (
            /* --- HAPPY MODE: Joyful Eyes & Smile --- */
            <g filter="url(#cyanGlow)">
              <path
                d="M 28 47 Q 36 39 44 47"
                stroke="#22D3EE"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 56 47 Q 64 39 72 47"
                stroke="#22D3EE"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 40 63 Q 50 71 60 63"
                stroke="#22D3EE"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            /* --- IDLE MODE: Friendly Glowing Cyan Eyes with Subtle Blink --- */
            <g filter="url(#cyanGlow)">
              {/* Left Eye */}
              <ellipse cx="36" cy="47" rx="6.5" ry="8.5" fill="#22D3EE">
                <animate
                  attributeName="ry"
                  values="8.5;8.5;1;8.5"
                  keyTimes="0;0.92;0.96;1"
                  dur="3.8s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <circle cx="38" cy="45" r="2.5" fill="#FFFFFF" opacity="0.9" />

              {/* Right Eye */}
              <ellipse cx="64" cy="47" rx="6.5" ry="8.5" fill="#22D3EE">
                <animate
                  attributeName="ry"
                  values="8.5;8.5;1;8.5"
                  keyTimes="0;0.92;0.96;1"
                  dur="3.8s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <circle cx="66" cy="45" r="2.5" fill="#FFFFFF" opacity="0.9" />

              {/* Subtle Friendly Mouth Bar */}
              <rect x="42" y="65" width="16" height="3" rx="1.5" fill="#06B6D4" opacity="0.85" />
            </g>
          )}

          {/* Cheek Blush Dots (Subtle) */}
          <circle cx="26" cy="57" r="3" fill="#F43F5E" opacity="0.4" />
          <circle cx="74" cy="57" r="3" fill="#F43F5E" opacity="0.4" />
        </svg>
      </div>

      {/* Optional Status Label below face */}
      {showStatusText && (
        <span
          className={`text-[10px] font-semibold mt-1 transition-colors ${
            mood === 'thinking'
              ? 'text-cyan-500 animate-pulse font-bold'
              : mood === 'speaking'
              ? 'text-indigo-500 font-bold'
              : 'text-slate-400'
          }`}
        >
          {statusLabels[mood]}
        </span>
      )}
    </div>
  );
};

