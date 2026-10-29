import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Menu,
  Sparkles,
  User,
  Settings,
  LogOut,
  RotateCcw,
  CheckCheck,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from './ThemeToggle';
import { NavPage } from '../types';

interface NavbarProps {
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const {
    profile,
    currentPage,
    setCurrentPage,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    logout,
    resetDemoProgress,
    streak,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitles: Record<NavPage, { title: string; subtitle: string }> = {
    overview: { title: 'Home', subtitle: 'Personalized placement preparation' },
    practice: { title: 'Practice Hub', subtitle: 'Aptitude, coding, technical concepts & communication' },
    roadmap: { title: 'Learning Roadmap', subtitle: 'Structured 5-phase preparation path' },
    tasks: { title: "Today's Plan", subtitle: 'Targeted preparation tasks for today' },
    aptitude: { title: 'Aptitude Practice', subtitle: 'Quantitative, logical, and verbal speed drills' },
    coding: { title: 'Coding Practice', subtitle: 'Data structures, algorithms & problem solving' },
    interview: { title: 'Mock Interview Room', subtitle: 'AI-assisted practice with instant constructive feedback' },
    placement: { title: 'Role Simulation', subtitle: 'Experience real multi-round campus hiring processes' },
    resume: { title: 'Resume Builder', subtitle: 'Clean, recruiter-approved one-page resume' },
    skills: { title: 'Skill Analysis', subtitle: 'Target role competencies and verified strengths' },
    technical: { title: 'Technical Concepts Practice', subtitle: 'Operating Systems, DBMS, Computer Networks & OOP' },
    communication: { title: 'Communication & HR Drills', subtitle: 'Behavioral, situational, and STAR method answers' },
    reports: { title: 'Progress Reports', subtitle: 'Track your preparation journey' },
    profile: { title: 'Student Profile', subtitle: 'Academic background and career goals' },
    settings: { title: 'Preferences & System', subtitle: 'Theme, notifications, and demo controls' },
    'learning-studio': { title: 'Learning Studio', subtitle: 'Domain-specific modules, step-by-step examples & knowledge checks' },
    admin: { title: 'Administrator Control Plane', subtitle: 'System analytics, user management & question bank control' },
  };

  const handleNavClick = (page: NavPage) => {
    setCurrentPage(page);
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const currentInfo = pageTitles[currentPage] || {
    title: 'NEXORA AI',
    subtitle: 'Placement Preparation Platform',
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 dark:bg-[#151821]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        {/* Left: Mobile hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202431] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold text-[#111827] dark:text-white tracking-tight">
                {currentInfo.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/50">
                <Sparkles className="w-3 h-3 text-cyan-500" />
                {profile.targetRole || 'Software Engineer'}
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right Actions: Streak, Theme, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak Indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold"
            title={`${streak?.currentStreak || 0}-day learning streak`}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streak?.currentStreak || 0} {streak?.currentStreak === 1 ? 'Day' : 'Days'}</span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202431] transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#4F46E5] rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#202431] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#202334] dark:text-white">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-300 font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-[#4F46E5] dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.actionPage) handleNavClick(n.actionPage);
                        }}
                        className={`pt-2.5 pb-2 px-2.5 rounded-xl cursor-pointer transition-all ${
                          !n.read
                            ? 'bg-indigo-50/70 dark:bg-indigo-950/30'
                            : 'hover:bg-slate-50 dark:hover:bg-[#151821]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        {n.actionPage && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-[#4F46E5] dark:text-cyan-400">
                            Go to {pageTitles[n.actionPage]?.title || n.actionPage} <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#202431] border border-slate-200 dark:border-slate-800 transition-colors"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F46E5] to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {profile.name
                  ? profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'AK'}
              </div>
              <div className="hidden lg:block text-left pr-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {profile.name || 'Akhilesh'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[100px]">
                  {profile.branch || 'CSE'}
                </p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#202431] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-[#202334] dark:text-white">
                    {profile.name || 'Akhilesh'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {profile.college || 'Engineering College'}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#4F46E5] dark:text-cyan-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Final Year • Campus Preparation</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151821] rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Student Profile
                  </button>

                  <button
                    onClick={() => handleNavClick('settings')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151821] rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Preferences & Settings
                  </button>

                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    Reset Demo Progress
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out Demo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#202431] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#202334] dark:text-white">
              Reset Demo Progress?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              This will restore all diagnostic assessment answers, daily tasks, mock interview histories, and placement simulation rounds back to their original state.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#151821] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoProgress();
                  setShowResetConfirm(false);
                  setShowProfileMenu(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-rose-500 shadow-md hover:brightness-105 transition-all"
              >
                Yes, Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
