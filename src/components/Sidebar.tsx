import React from 'react';
import {
  Home,
  MessageSquareCode,
  FileText,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Zap,
  Target,
  Shield,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavPage } from '../types';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const {
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    isAdmin,
  } = useApp();

  const primaryNavItems: {
    id: NavPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isActive: (page: NavPage) => boolean;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Home',
      icon: Home,
      isActive: (page) => page === 'overview',
    },
    {
      id: 'learning-studio',
      label: 'Learning Studio',
      icon: GraduationCap,
      isActive: (page) => page === 'learning-studio',
      badge: 'Library',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold',
    },
    {
      id: 'practice',
      label: 'Practice Lab',
      icon: Target,
      isActive: (page) =>
        ['practice', 'aptitude', 'coding', 'technical', 'communication'].includes(page),
      badge: 'Quizzes',
      badgeColor: 'bg-indigo-100 text-[#4F46E5] dark:bg-indigo-950/60 dark:text-cyan-400',
    },
    {
      id: 'interview',
      label: 'Interview',
      icon: MessageSquareCode,
      isActive: (page) => ['interview', 'placement'].includes(page),
      badge: 'Prep',
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 font-bold',
    },
    {
      id: 'resume',
      label: 'Resume',
      icon: FileText,
      isActive: (page) => page === 'resume',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserRound,
      isActive: (page) => ['profile', 'settings'].includes(page),
    },
  ];

  if (isAdmin) {
    primaryNavItems.push({
      id: 'admin',
      label: 'Admin Control',
      icon: Shield,
      isActive: (page) => page === 'admin',
      badge: 'Admin',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold',
    });
  }

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-white dark:bg-[#151821] text-[#252936] dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 transition-[width] duration-300 ease-in-out select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <button
          type="button"
          onClick={() => setCurrentPage('overview')}
          className="flex items-center gap-3 cursor-pointer group text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#4F46E5] rounded-xl p-1"
          title="NEXORA Placement Platform"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F46E5] via-[#3730A3] to-cyan-400 p-0.5 shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
            <div className="w-full h-full bg-[#151821] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/30" />
            </div>
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-[#111827] dark:text-white truncate">
                  NEXORA
                </span>
                <span className="text-[10px] font-black tracking-widest px-1.5 py-0.2 rounded bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 shrink-0">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-tight truncate">
                Placement Prep
              </span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 custom-scrollbar overflow-y-auto">
        <p className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 ${sidebarCollapsed ? 'text-center' : ''}`}>
          {sidebarCollapsed ? '•' : 'Main'}
        </p>

        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(currentPage);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group relative cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                active
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-[#4F46E5] dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800/80 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#111827] dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#202431]'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {active && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-[#4F46E5] dark:bg-cyan-400" />
              )}

              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  active
                    ? 'text-[#4F46E5] dark:text-cyan-400'
                    : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              />

              {!sidebarCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!sidebarCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Clean Footer / Status */}
      {!sidebarCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-50 dark:bg-[#1a1d27] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Campus Edition
          </span>
          <span className="font-mono text-[10px] text-slate-400">v2.0</span>
        </div>
      )}
    </aside>
  );
};

