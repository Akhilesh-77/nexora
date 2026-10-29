import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LoginView } from './views/LoginView';
import { OnboardingView } from './views/OnboardingView';
import { AssessmentView } from './views/AssessmentView';
import { DashboardView } from './views/DashboardView';
import { PracticeView } from './views/PracticeView';
import { LearningStudioView } from './views/LearningStudioView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { RoadmapView } from './views/RoadmapView';
import { DailyTasksView } from './views/DailyTasksView';
import { MockInterviewView } from './views/MockInterviewView';
import { ResumeBuilderView } from './views/ResumeBuilderView';
import { ProgressReportsView } from './views/ProgressReportsView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { CinematicCursor } from './components/CinematicCursor';
import { NexoraAssistant } from './components/NexoraAssistant';
import { FloatingArcNav } from './components/FloatingArcNav';
import { Server, RefreshCw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    isAuthenticated,
    isAdmin,
    profile,
    assessmentResult,
    currentPage,
    sidebarCollapsed,
    dbStatus,
    checkDatabase,
    retakeMode,
    exitRetake,
    retakeAssessment,
    showNexusOrb,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Unauthenticated -> Show Local Authentication Portal
  if (!isAuthenticated) {
    return (
      <>
        <CinematicCursor />
        <LoginView />
      </>
    );
  }

  // 2. Administrator users go directly to Admin Dashboard or requested pages
  if (isAdmin) {
    // Admins bypass student onboarding and diagnostic
  } else {
    // 3. Student Authenticated: Mandatory Initial Assessment & Personalized Analysis
    if (!profile.onboarded || !assessmentResult || retakeMode) {
      return (
        <>
          <CinematicCursor />
          <AssessmentView
            onComplete={exitRetake}
            isRetake={retakeMode}
          />
        </>
      );
    }
  }

  // 5. Main App Shell with Sidebar & Views
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'overview':
        return isAdmin ? <AdminDashboardView /> : <DashboardView />;
      case 'learning-studio':
        return <LearningStudioView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'practice':
        return <PracticeView initialCategory="grid" />;
      case 'aptitude':
        return <PracticeView initialCategory="aptitude" />;
      case 'coding':
        return <PracticeView initialCategory="coding" />;
      case 'skills':
        return <PracticeView initialCategory="skills" />;
      case 'roadmap':
        return <PracticeView initialCategory="roadmap" />;
      case 'technical':
        return <PracticeView initialCategory="technical" />;
      case 'communication':
        return <PracticeView initialCategory="communication" />;
      case 'interview':
        return <MockInterviewView initialTab="interview" />;
      case 'placement':
        return <MockInterviewView initialTab="simulation" />;
      case 'resume':
        return <ResumeBuilderView />;
      case 'tasks':
        return <DailyTasksView />;
      case 'reports':
        return <ProgressReportsView />;
      case 'profile':
      case 'settings':
        return (
          <ProfileSettingsView
            onRetakeAssessment={retakeAssessment}
          />
        );
      default:
        return isAdmin ? <AdminDashboardView /> : <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#0A0D14] text-[#111827] dark:text-slate-100 transition-colors flex relative selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:bg-cyan-500/30 dark:selection:text-cyan-300">
      <CinematicCursor />

      {/* Desktop Collapsible Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 pb-16 md:pb-0 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Global Database Offline Warning Banner */}
        {!dbStatus.connected && (
          <div className="bg-rose-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 shadow-md z-40">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 shrink-0" />
              <span>
                Local MongoDB is stopped or unreachable at{' '}
                <code className="bg-rose-700 px-1 py-0.5 rounded font-mono">127.0.0.1:27017</code>.
                Data cannot be saved until MongoDB is running.
              </span>
            </div>
            <button
              onClick={checkDatabase}
              disabled={dbStatus.checking}
              className="px-2.5 py-1 bg-white text-rose-700 hover:bg-rose-50 rounded text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${dbStatus.checking ? 'animate-spin' : ''}`} />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Sticky Header */}
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Central Floating Nexus Orb Navigation & Voice AI */}
      {showNexusOrb && <FloatingArcNav />}

      {/* Floating Local AI Assistant */}
      <NexoraAssistant />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
