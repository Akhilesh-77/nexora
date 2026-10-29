import React from 'react';

interface CinematicBackgroundProps {
  variant?: 'hero' | 'studio' | 'dashboard' | 'code' | 'minimal';
  children?: React.ReactNode;
  className?: string;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  variant = 'dashboard',
  children,
  className = '',
}) => {
  return (
    <div className={`relative w-full transition-colors duration-300 ${className}`}>
      {/* BACKGROUND ATMOSPHERIC DYNAMIC LIGHTING LAYERS (21st.dev, Aceternity & Magic UI inspired) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {variant === 'hero' && (
          <>
            {/* Top-left animated warm champagne / ivory bloom */}
            <div
              style={{ animation: 'float-slow-1 18s ease-in-out infinite' }}
              className="absolute -top-[10%] -left-[5%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-amber-200/40 via-orange-100/25 to-rose-100/15 dark:from-indigo-900/35 dark:via-purple-950/25 dark:to-cyan-950/15 blur-[120px] transition-all will-change-transform"
            />
            {/* Center-right plum / violet animated atmospheric wash */}
            <div
              style={{ animation: 'float-slow-2 22s ease-in-out infinite' }}
              className="absolute top-[20%] -right-[10%] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-indigo-200/35 via-violet-100/25 to-transparent dark:from-violet-900/30 dark:via-indigo-950/25 dark:to-transparent blur-[130px] will-change-transform"
            />
            {/* Pulsing orbital rings */}
            <div
              style={{ animation: 'pulse-subtle 10s ease-in-out infinite' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-indigo-200/40 dark:border-indigo-800/25"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-dashed border-indigo-300/30 dark:border-indigo-800/20" />
          </>
        )}

        {variant === 'studio' && (
          <>
            {/* Virtual Interview Stage Spotlight with gentle breath */}
            <div
              style={{ animation: 'float-slow-3 14s ease-in-out infinite' }}
              className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[950px] h-[480px] rounded-full bg-gradient-to-b from-indigo-200/45 via-violet-100/25 to-transparent dark:from-indigo-600/30 dark:via-cyan-600/20 dark:to-transparent blur-[110px] will-change-transform"
            />
            {/* Interviewer stage warm backlight */}
            <div
              style={{ animation: 'float-slow-1 16s ease-in-out infinite' }}
              className="absolute top-[20%] -left-[10%] w-[480px] h-[480px] rounded-full bg-amber-100/40 dark:bg-indigo-950/45 blur-[120px] will-change-transform"
            />
            {/* Candidate response cool stage light */}
            <div
              style={{ animation: 'float-slow-2 20s ease-in-out infinite' }}
              className="absolute top-[25%] -right-[10%] w-[480px] h-[480px] rounded-full bg-cyan-100/40 dark:bg-cyan-950/35 blur-[120px] will-change-transform"
            />
          </>
        )}

        {variant === 'dashboard' && (
          <>
            {/* Subtle animated top crown glow */}
            <div
              style={{ animation: 'float-slow-1 20s ease-in-out infinite' }}
              className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[1100px] h-[380px] rounded-full bg-gradient-to-b from-indigo-100/55 via-amber-100/30 to-transparent dark:from-indigo-950/45 dark:via-cyan-950/25 dark:to-transparent blur-[110px] will-change-transform"
            />
            {/* Lateral accent depth with smooth floating animation */}
            <div
              style={{ animation: 'float-slow-2 24s ease-in-out infinite' }}
              className="absolute top-[320px] -right-[120px] w-[520px] h-[520px] rounded-full bg-violet-100/35 dark:bg-purple-950/25 blur-[130px] will-change-transform"
            />
            {/* Bottom floating ambient fill */}
            <div
              style={{ animation: 'float-slow-3 18s ease-in-out infinite' }}
              className="absolute -bottom-[100px] -left-[80px] w-[500px] h-[500px] rounded-full bg-cyan-100/30 dark:bg-indigo-950/30 blur-[130px] will-change-transform"
            />
          </>
        )}

        {variant === 'code' && (
          <>
            {/* Terminal focus wash */}
            <div
              style={{ animation: 'float-slow-2 18s ease-in-out infinite' }}
              className="absolute -top-[80px] right-[10%] w-[650px] h-[420px] rounded-full bg-gradient-to-br from-cyan-100/45 to-transparent dark:from-cyan-950/35 dark:to-transparent blur-[120px] will-change-transform"
            />
            <div
              style={{ animation: 'float-slow-1 22s ease-in-out infinite' }}
              className="absolute top-[300px] -left-[100px] w-[520px] h-[520px] rounded-full bg-indigo-100/40 dark:bg-indigo-950/35 blur-[130px] will-change-transform"
            />
          </>
        )}

        {/* Fine Micro-Dot Pattern with 21st.dev Radial Falloff */}
        <div
          className="absolute inset-0 opacity-[0.55] dark:opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #6366f1 1.1px, transparent 1.1px)',
            backgroundSize: '24px 24px',
            maskImage:
              'radial-gradient(ellipse 85% 70% at 50% 30%, #000 50%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 85% 70% at 50% 30%, #000 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Children Content Layer */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
