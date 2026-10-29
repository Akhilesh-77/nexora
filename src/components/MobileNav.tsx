import React from 'react';
import {
  Home,
  BookOpen,
  MessageCircle,
  FileText,
  UserRound,
  X,
  Zap,
  ChevronRight,
  Calculator,
  Code2,
  Map,
  Target,
  Briefcase,
  Settings,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavPage } from '../types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, isAdmin } = useApp();

  const handleNav = (page: NavPage) => {
    setCurrentPage(page);
    onClose();
  };

  const isHomeActive = ['overview', 'tasks', 'reports'].includes(currentPage);
  const isStudioActive = currentPage === 'learning-studio';
  const isPracticeActive = ['practice', 'aptitude', 'coding', 'skills', 'roadmap'].includes(currentPage);
  const isInterviewActive = ['interview', 'placement'].includes(currentPage);
  const isResumeActive = currentPage === 'resume';
  const isProfileActive = ['profile', 'settings'].includes(currentPage);
  const isAdminActive = currentPage === 'admin';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs md:hidden animate-in fade-in"
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-[#151821] text-[#252936] dark:text-white p-4 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F46E5] to-cyan-400 p-0.5 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-[#202334] dark:text-white">
                NEXORA AI
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
            {/* 5 Primary Navigation Destinations */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Main Navigation
              </p>

              <button
                onClick={() => handleNav('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isHomeActive
                    ? 'bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/40 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#202431]'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>

              <button
                onClick={() => handleNav('learning-studio')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isStudioActive
                    ? 'bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/40 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#202431]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Learning Studio</span>
              </button>

              <button
                onClick={() => handleNav('practice')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isPracticeActive
                    ? 'bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/40 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#202431]'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Practice Lab</span>
              </button>

              <button
                onClick={() => handleNav('interview')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isInterviewActive
                    ? 'bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/40 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#202431]'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mock Interview</span>
              </button>

              <button
                onClick={() => handleNav('resume')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isResumeActive
                    ? 'bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/40 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#202431]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Resume Builder</span>
              </button>

              <button
                onClick={() => handleNav('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isProfileActive
                    ? 'bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/40 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#202431]'
                }`}
              >
                <UserRound className="w-4 h-4" />
                <span>Student Profile & Settings</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNav('admin')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isAdminActive
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold'
                      : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Control Plane</span>
                </button>
              )}
            </div>

            {/* Quick Practice Shortcuts */}
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Practice Categories
              </p>
              <button
                onClick={() => handleNav('aptitude')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202431]"
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Aptitude Drills</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('coding')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202431]"
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Coding Challenges</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('skills')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202431]"
              >
                <div className="flex items-center gap-2.5">
                  <Target className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Skill Analysis</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('roadmap')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202431]"
              >
                <div className="flex items-center gap-2.5">
                  <Map className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Learning Roadmap</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 text-center">
          NEXORA AI • Placement Preparation
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar - Exactly 5 Destinations */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 dark:bg-[#151821]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors">
        <button
          onClick={() => setCurrentPage('overview')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            isHomeActive
              ? 'text-[#4F46E5] dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentPage('practice')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            isPracticeActive
              ? 'text-[#4F46E5] dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Practice</span>
        </button>

        <button
          onClick={() => setCurrentPage('interview')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            isInterviewActive
              ? 'text-[#4F46E5] dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Interview</span>
        </button>

        <button
          onClick={() => setCurrentPage('resume')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            isResumeActive
              ? 'text-[#4F46E5] dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume</span>
        </button>

        <button
          onClick={() => setCurrentPage('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors ${
            isProfileActive
              ? 'text-[#4F46E5] dark:text-cyan-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <UserRound className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};
