import React, { useState } from 'react';
import {
  User,
  Settings,
  GraduationCap,
  Target,
  RotateCcw,
  LogOut,
  Save,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  RefreshCw,
  Compass,
  Briefcase,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  ALLOWED_DEGREES,
  getRolesForBranch,
  isCrossDomainRole,
  getCrossDomainAdvice,
} from '../data/branchRoleMapping';

export const ProfileSettingsView: React.FC<{ onRetakeAssessment: () => void }> = ({
  onRetakeAssessment,
}) => {
  const {
    profile,
    updateProfile,
    theme,
    setTheme,
    uiFont,
    setUiFont,
    showNexusOrb,
    setShowNexusOrb,
    resetDemoProgress,
    logout,
    addNotification,
  } = useApp();

  const [formData, setFormData] = useState({
    ...profile,
    degree: (ALLOWED_DEGREES.includes(profile.degree as any) ? profile.degree : ALLOWED_DEGREES[0]) as string,
  });
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const branches = [
    'Computer Science and Engineering',
    'Information Science and Engineering',
    'Artificial Intelligence and Machine Learning',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Other',
  ];

  const branchRoleData = getRolesForBranch(formData.branch);

  const handleBranchChange = (newBranch: string) => {
    const newRoles = getRolesForBranch(newBranch);
    setFormData((prev) => ({
      ...prev,
      branch: newBranch,
      targetRole: newRoles.primaryRoles[0] || 'Graduate Engineering Trainee',
      careerInterests: [newRoles.primaryRoles[0] || 'Graduate Engineering Trainee'],
      prefLanguage: newRoles.recommendedLanguages[0] || prev.prefLanguage,
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setShowSavedToast(true);
    addNotification({
      title: 'Profile Updated',
      message: `Your academic profile (${formData.degree} in ${formData.branch}) and target role (${formData.targetRole}) have been saved.`,
      type: 'recommendation',
    });
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const crossDomainAdvice = getCrossDomainAdvice(formData.branch, formData.targetRole);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto transition-colors">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl card-cinematic luminous-border shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-cyan-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#151821] rounded-[14px] flex items-center justify-center text-white text-lg font-bold">
                {profile.name
                  ? profile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'AK'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {profile.name || 'Engineering Student'}
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  {profile.degree || 'B.Tech.'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.college} • {profile.branch} • Target: <span className="text-cyan-400 font-semibold">{profile.targetRole}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onRetakeAssessment}
            className="btn-cinematic flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Diagnostic Assessment</span>
          </button>
        </div>
      </div>

      {showSavedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updates successfully saved! Future roadmaps, daily tasks, and interviews adapt to this role.</span>
        </div>
      )}

      {/* Profile Form Card */}
      <form
        onSubmit={handleSaveProfile}
        className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-xs space-y-6"
      >
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-[#202334] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#4F46E5]" />
            <span>Engineering Degree & Placement Preferences</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your branch and target role govern your learning roadmap, aptitude drills, technical interviews, and mock simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              College or University
            </label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Degree (B.E. / B.Tech. Only)
            </label>
            <select
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              {ALLOWED_DEGREES.map((deg) => (
                <option key={deg} value={deg}>
                  {deg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Engineering Branch
            </label>
            <select
              value={formData.branch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Target Career Role
            </label>
            <div className="space-y-2">
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value, careerInterests: [e.target.value] })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5] cursor-pointer"
              >
                <optgroup label={`Core ${formData.branch} Roles (Recommended)`}>
                  {branchRoleData.primaryRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </optgroup>
                {branchRoleData.crossDomainRoles.length > 0 && (
                  <optgroup label="Optional Cross-Domain Placement Tracks">
                    {branchRoleData.crossDomainRoles.map((c) => (
                      <option key={c.role} value={c.role}>
                        {c.role} ({c.track})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {crossDomainAdvice && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <span>{crossDomainAdvice}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Language or Tool
            </label>
            <select
              value={formData.prefLanguage}
              onChange={(e) => setFormData({ ...formData, prefLanguage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              {branchRoleData.recommendedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="C">C</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Daily Study Availability
            </label>
            <select
              value={formData.studyTime}
              onChange={(e) => setFormData({ ...formData, studyTime: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#202334] dark:text-white focus:outline-none focus:border-[#4F46E5] cursor-pointer"
            >
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="3 or more hours">3 or more hours</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="btn-cinematic flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* System Settings & Theme */}
      <div className="p-6 sm:p-8 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-[#202334] dark:text-white uppercase tracking-wider">
            System & Theme Preferences
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure application theme mode and session data management.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Appearance Theme
          </label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-[#4F46E5] text-[#4F46E5] font-bold shadow-xs'
                  : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Sun className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-[#4F46E5] text-[#4F46E5] dark:text-cyan-400 font-bold shadow-xs'
                  : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Moon className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                theme === 'system'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-[#4F46E5] text-[#4F46E5] font-bold shadow-xs'
                  : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Monitor className="w-4 h-4 mx-auto mb-1" />
              <span className="text-xs">System</span>
            </button>
          </div>
        </div>

        {/* UI Typography & Font Style Selection (Times New Roman Option) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Typography & Interface Font
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your reading typography style across the entire platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Times New Roman Serif */}
            <button
              type="button"
              onClick={() => setUiFont('times')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                uiFont === 'times'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/30 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-serif" style={{ fontFamily: 'Times New Roman, serif' }}>
                  Times New Roman
                </span>
                {uiFont === 'times' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </div>
              <p
                className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug"
                style={{ fontFamily: 'Times New Roman, serif' }}
              >
                Classic Academic Serif. High readability for technical case studies.
              </p>
            </button>

            {/* 2. Modern Plus Jakarta Sans */}
            <button
              type="button"
              onClick={() => setUiFont('sans')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                uiFont === 'sans'
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-[#4F46E5] dark:border-cyan-400 text-[#4F46E5] dark:text-cyan-300 ring-2 ring-indigo-400/30 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">
                  Plus Jakarta Sans
                </span>
                {uiFont === 'sans' && (
                  <span className="w-2 h-2 rounded-full bg-[#4F46E5] dark:bg-cyan-400 animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Modern Tech Clean. Default crisp engineering interface layout.
              </p>
            </button>

            {/* 3. JetBrains Mono Code */}
            <button
              type="button"
              onClick={() => setUiFont('mono')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                uiFont === 'mono'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-400/30 shadow-sm'
                  : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono">
                  JetBrains Mono
                </span>
                {uiFont === 'mono' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-snug">
                Engineering Terminal. Monospace density for algorithmic problem-solving.
              </p>
            </button>
          </div>
        </div>

        {/* Floating NEXUS Navigation Orb Visibility Control */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Floating NEXUS Navigation Orb
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    showNexusOrb
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {showNexusOrb ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                Hide the circular floating NEXUS Orb at the bottom center of the screen if it gets in the way of content or practice drills.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextState = !showNexusOrb;
                setShowNexusOrb(nextState);
                addNotification({
                  title: nextState ? 'Nexus Orb Visible' : 'Nexus Orb Hidden',
                  message: nextState
                    ? 'The floating circular Nexus Orb has been restored at the bottom of the screen.'
                    : 'The floating Nexus Orb is now hidden. You can restore it anytime in Profile Settings.',
                  type: 'recommendation',
                });
              }}
              className={`relative inline-flex h-8 w-15 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                showNexusOrb
                  ? 'bg-gradient-to-r from-[#4F46E5] to-cyan-500 shadow-md shadow-indigo-500/25'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label={showNexusOrb ? 'Hide Nexus Orb' : 'Show Nexus Orb'}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  showNexusOrb ? 'translate-x-7' : 'translate-x-0'
                }`}
              >
                {showNexusOrb ? (
                  <Eye className="w-3.5 h-3.5 text-[#4F46E5]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Reset & Session Management */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Reset Session Progress
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Clear your saved assessment, interview, and task progress to start fresh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
            >
              Reset Session
            </button>

            <button
              type="button"
              onClick={logout}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl card-cinematic p-6 space-y-4 shadow-2xl border border-slate-700">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reset Progress Data?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This will reset your diagnostic scores, daily tasks, and interview records back to initial state.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoProgress();
                  setShowResetModal(false);
                }}
                className="py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 shadow-xs cursor-pointer"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
