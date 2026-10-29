import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Home,
  BookOpen,
  Code2,
  MessageSquareCode,
  FileText,
  X,
  Sparkles,
  Mic,
  MicOff,
  BarChart3,
  Bot,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavPage } from '../types';
import { voiceService } from '../services/voiceService';

interface ArcItem {
  id: string;
  page?: NavPage;
  action?: 'voice' | 'assistant';
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const FloatingArcNav: React.FC = () => {
  const { currentPage, setCurrentPage, assistantOpen, setAssistantOpen } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Monitor voice service state
  useEffect(() => {
    voiceService.setCallbacks({
      onStateChange: (st) => {
        setIsVoiceActive(st === 'listening' || st === 'requesting');
      },
      onTranscript: (txt) => {
        if (txt && !assistantOpen) {
          setAssistantOpen(true);
        }
      },
    });
  }, [assistantOpen, setAssistantOpen]);

  const navItems: ArcItem[] = [
    {
      id: 'voice-action',
      action: 'voice',
      label: 'Voice AI',
      sublabel: isVoiceActive ? 'Listening...' : 'Speak with AI',
      icon: isVoiceActive ? MicOff : Mic,
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 'assistant-action',
      action: 'assistant',
      label: 'Assistant',
      sublabel: 'Interactive Chat',
      icon: Bot,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'learning-studio',
      page: 'learning-studio',
      label: 'Learning',
      sublabel: 'Engineering Modules',
      icon: BookOpen,
      color: 'from-indigo-500 to-violet-600',
    },
    {
      id: 'practice',
      page: 'practice',
      label: 'Practice',
      sublabel: 'MCQs & Coding Lab',
      icon: Code2,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 'interview',
      page: 'interview',
      label: 'Interview',
      sublabel: 'Mock Speech Studio',
      icon: MessageSquareCode,
      color: 'from-violet-500 to-fuchsia-600',
    },
    {
      id: 'resume',
      page: 'resume',
      label: 'Resume',
      sublabel: 'ATS CV Builder',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'reports',
      page: 'reports',
      label: 'Analytics',
      sublabel: 'Progress & Streaks',
      icon: BarChart3,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'overview',
      page: 'overview',
      label: 'Home',
      sublabel: 'Dashboard Overview',
      icon: Home,
      color: 'from-slate-700 to-slate-900',
    },
  ];

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleItemClick = (item: ArcItem) => {
    if (item.action === 'voice') {
      if (isVoiceActive) {
        voiceService.stopListening();
      } else {
        setAssistantOpen(true);
        voiceService.startListening();
      }
    } else if (item.action === 'assistant') {
      setAssistantOpen(!assistantOpen);
    } else if (item.page) {
      setCurrentPage(item.page);
    }
    setIsOpen(false);
  };

  // Radius and fan angles for circular spread
  const radius = 110; // pixels
  const startAngle = 180; // leftmost
  const endAngle = 0; // rightmost
  const angleStep = (startAngle - endAngle) / (navItems.length - 1);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center select-none print:hidden"
    >
      {/* 1. Backdrop Glow & Dimmer when opened */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 pointer-events-none ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* 2. Tooltip display for active or hovered item */}
      {isOpen && hoveredItem && (
        <div className="absolute -top-34 px-4 py-2 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md text-center pointer-events-none animate-in fade-in zoom-in-95 duration-150 z-50">
          {(() => {
            const item = navItems.find((i) => i.id === hoveredItem);
            if (!item) return null;
            return (
              <>
                <p className="text-xs font-bold tracking-wide text-white">{item.label}</p>
                <p className="text-[10px] text-cyan-300 font-medium">{item.sublabel}</p>
              </>
            );
          })()}
        </div>
      )}

      {/* 3. The Curved Arc Navigation Nodes */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        {navItems.map((item, index) => {
          const angleDeg = startAngle - index * angleStep;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = Math.round(Math.cos(angleRad) * radius);
          const y = Math.round(-Math.sin(angleRad) * radius);

          const isActive = item.page ? currentPage === item.page : false;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              aria-label={`${item.label} (${item.sublabel})`}
              style={{
                transform: isOpen
                  ? `translate3d(${x}px, ${y}px, 0) scale(1)`
                  : 'translate3d(0, 0, 0) scale(0.3)',
                transitionDelay: isOpen ? `${index * 30}ms` : `${(navItems.length - index) * 15}ms`,
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? 'auto' : 'none',
              }}
              className={`absolute w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-xl border cursor-pointer transition-all duration-300 group z-50 ${
                isActive
                  ? 'bg-gradient-to-tr ' +
                    item.color +
                    ' text-white border-white/40 ring-4 ring-indigo-500/30 scale-110 shadow-indigo-500/40'
                  : 'bg-white dark:bg-[#151926] text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700/80 hover:scale-115 hover:border-indigo-400 hover:text-[#4F46E5] dark:hover:text-cyan-400 shadow-slate-900/15'
              }`}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110" />

              {isActive && (
                <span className="absolute -bottom-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>
          );
        })}

        {/* 4. Central Luminous Floating Nexus Orb */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation orb' : 'Open NEXORA Nexus Orb'}
          title={isOpen ? 'Close navigation orb' : 'Quick navigation and Voice AI'}
          className={`relative z-50 w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl active:scale-95 ${
            isOpen
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/50 rotate-90 ring-4 ring-rose-400/30'
              : isVoiceActive
              ? 'bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 text-white shadow-[0_8px_25px_rgba(244,63,94,0.6)] ring-4 ring-rose-400/40 animate-pulse'
              : 'bg-gradient-to-tr from-[#4F46E5] via-[#4338CA] to-cyan-500 text-white shadow-[0_8px_25px_rgba(79,70,229,0.5)] hover:shadow-[0_10px_30px_rgba(79,70,229,0.7)] hover:scale-105 ring-4 ring-indigo-400/25'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 transition-transform duration-300" />
          ) : isVoiceActive ? (
            <div className="relative flex items-center justify-center">
              <Mic className="w-5 h-5 text-white animate-bounce" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500 group-hover:rotate-45" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Subtle indicator pill when closed */}
      {!isOpen && (
        <span className="mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs border border-slate-200/70 dark:border-slate-800 shadow-2xs pointer-events-none">
          {isVoiceActive ? 'LISTENING' : 'NEXUS ORB'}
        </span>
      )}
    </div>
  );
};
