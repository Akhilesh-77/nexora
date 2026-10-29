import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  GraduationCap,
  Target,
  Sliders,
  Check,
  Compass,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  ALLOWED_DEGREES,
  getRolesForBranch,
  BRANCH_CONFIGS,
  isCrossDomainRole,
  getCrossDomainAdvice,
  normalizeBranchName,
} from '../data/branchRoleMapping';
import { CinematicBackground } from '../components/CinematicBackground';

export const OnboardingView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { profile, updateProfile } = useApp();

  const [step, setStep] = useState<number>(1);
  const initialBranch = profile.branch || 'Computer Science and Engineering';
  const initialRoles = getRolesForBranch(initialBranch);

  const [formData, setFormData] = useState({
    name: profile.name || '',
    college: profile.college || '',
    degree: (ALLOWED_DEGREES.includes(profile.degree as any) ? profile.degree : ALLOWED_DEGREES[0]) as string,
    yearOrSemester: profile.yearOrSemester || 'Final Year (7th/8th Sem)',
    branch: initialBranch,
    customBranch: profile.customBranch || '',
    cgpa: profile.cgpa || '',
    gradYear: profile.gradYear || '2026',
    prefLanguage: profile.prefLanguage || 'Python',
    careerInterests: profile.careerInterests?.length
      ? profile.careerInterests
      : [initialRoles.primaryRoles[0] || 'Software Engineer'],
    prepLevel: profile.prepLevel || 'Intermediate',
    studyTime: profile.studyTime || '2 hours',
    learningPreferences: profile.learningPreferences?.length
      ? profile.learningPreferences
      : ['Aptitude', 'Core subjects', 'Technical interviews'],
  });

  const [validationError, setValidationError] = useState<string | null>(null);

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

  // Whenever branch changes, sync career interest options and pre-select branch's core role
  const branchRoleData = getRolesForBranch(formData.branch);

  const handleBranchChange = (newBranch: string) => {
    const newRoles = getRolesForBranch(newBranch);
    setFormData((prev) => {
      // Pick the primary role for the newly selected branch
      const defaultRole = newRoles.primaryRoles[0] || 'Graduate Engineering Trainee';
      return {
        ...prev,
        branch: newBranch,
        careerInterests: [defaultRole],
        prefLanguage: newRoles.recommendedLanguages[0] || prev.prefLanguage,
      };
    });
  };

  const languages = branchRoleData.recommendedLanguages.length > 0
    ? branchRoleData.recommendedLanguages
    : ['Python', 'C++', 'Java', 'C'];

  const learningPreferenceOptions = [
    'General Aptitude',
    'Core Branch Subjects',
    'Technical Problem Solving',
    'Communication & STAR Drills',
    'ATS Resume Building',
    'Technical Mock Interviews',
    'HR & Behavioral Interviews',
  ];

  const handleNext = () => {
    setValidationError(null);
    if (step === 1) {
      if (!formData.name.trim()) {
        setValidationError('Please enter your full name');
        return;
      }
      if (!formData.college.trim()) {
        setValidationError('Please enter your college or university name');
        return;
      }
    } else if (step === 2) {
      if (formData.branch === 'Other' && !formData.customBranch.trim()) {
        setValidationError('Please specify your engineering branch');
        return;
      }
    } else if (step === 3) {
      if (formData.careerInterests.length === 0) {
        setValidationError('Please select at least one career target role');
        return;
      }
    } else if (step === 4) {
      if (formData.learningPreferences.length === 0) {
        setValidationError('Please select at least one learning preference');
        return;
      }
    }

    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    const selectedTargetRole = formData.careerInterests[0] || branchRoleData.primaryRoles[0];
    updateProfile({
      ...formData,
      targetRole: selectedTargetRole,
      onboarded: true,
    });
    onComplete();
  };

  const toggleCareerInterest = (role: string) => {
    setFormData((prev) => {
      const exists = prev.careerInterests.includes(role);
      let updated: string[];
      if (exists) {
        // Keep at least one role
        updated = prev.careerInterests.filter((r) => r !== role);
        if (updated.length === 0) updated = [role];
      } else {
        updated = [...prev.careerInterests, role];
      }
      return { ...prev, careerInterests: updated };
    });
  };

  const toggleLearningPreference = (pref: string) => {
    setFormData((prev) => {
      const exists = prev.learningPreferences.includes(pref);
      const updated = exists
        ? prev.learningPreferences.filter((p) => p !== pref)
        : [...prev.learningPreferences, pref];
      return { ...prev, learningPreferences: updated };
    });
  };

  const selectedCrossDomainAdvice = formData.careerInterests
    .map((r) => getCrossDomainAdvice(formData.branch, r))
    .filter(Boolean);

  return (
    <CinematicBackground variant="hero" className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FAF9F5] dark:bg-[#0A0D14] text-[#111827] dark:text-slate-100 transition-colors">
      {/* Container Card */}
      <div className="w-full max-w-2xl bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-xl relative z-10 transition-colors">
        {/* Top Header & Progress */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-cyan-400 p-0.5 flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider text-[#202334] dark:text-white">
                NEXORA AI
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Engineering Campus Placement Prep</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Step {step} of 5
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#4F46E5] to-cyan-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Error message */}
        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {validationError}
          </div>
        )}

        {/* Step 1: Degree & Identity */}
        {step === 1 && (
          <div className="py-6 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] dark:text-cyan-400 mb-1">
                <GraduationCap className="w-4 h-4" /> Step 1: Degree & University
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#202334] dark:text-white tracking-tight">
                Engineering Student Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                NEXORA is designed specifically for students pursuing a Bachelor of Engineering or Bachelor of Technology.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Akhilesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-[#202334] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College or University
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. National Institute of Engineering"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-[#202334] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Engineering Degree (B.E. / B.Tech.)
                  </label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-[#202334] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
                  >
                    {ALLOWED_DEGREES.map((deg) => (
                      <option key={deg} value={deg}>
                        {deg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year / Semester
                  </label>
                  <select
                    value={formData.yearOrSemester}
                    onChange={(e) => setFormData({ ...formData, yearOrSemester: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-[#202334] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
                  >
                    <option value="Final Year (7th/8th Sem)">Final Year (7th/8th Sem)</option>
                    <option value="Pre-Final Year (5th/6th Sem)">Pre-Final Year (5th/6th Sem)</option>
                    <option value="Second Year (3rd/4th Sem)">Second Year (3rd/4th Sem)</option>
                    <option value="First Year (1st/2nd Sem)">First Year (1st/2nd Sem)</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Engineering Branch */}
        {step === 2 && (
          <div className="py-6 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                <Compass className="w-4 h-4" /> Step 2: Engineering Specialization
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#202334] dark:text-white tracking-tight">
                Select Your Engineering Branch
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your branch directly dictates your core technical question pool, interview rounds, and recommended career paths.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Engineering Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-[#202334] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {formData.branch === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Specify Your Branch
                  </label>
                  <input
                    type="text"
                    value={formData.customBranch}
                    onChange={(e) => setFormData({ ...formData, customBranch: e.target.value })}
                    placeholder="e.g. Metallurgical Engineering, Aerospace Engineering"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-[#202334] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
                  />
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/40 text-xs">
                <span className="font-bold text-[#4F46E5] dark:text-cyan-400 block mb-1">
                  Core Competencies in {formData.branch}:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {branchRoleData.coreCompetencies.map((comp) => (
                    <span
                      key={comp}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-slate-700 dark:text-slate-300"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current CGPA or Percentage (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    placeholder="e.g. 8.5 or 85%"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-[#202334] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={formData.gradYear}
                    onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 text-[#202334] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] transition-colors"
                  >
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Branch-Aware Career Roles */}
        {step === 3 && (
          <div className="py-6 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] dark:text-cyan-400 mb-1">
                <Target className="w-4 h-4" /> Step 3: Branch-Aware Target Roles
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#202334] dark:text-white tracking-tight">
                Recommended Roles for {formData.branch}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Roles tailored specifically to your engineering curriculum. You may also select an optional cross-domain transition track.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              {/* Primary Core Roles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#4F46E5]" />
                  <span>Primary Core Branch Roles (Recommended)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {branchRoleData.primaryRoles.map((role) => {
                    const isSelected = formData.careerInterests.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleCareerInterest(role)}
                        className={`p-3 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                            : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-[#4F46E5]'
                        }`}
                      >
                        <span className="font-bold">{role}</span>
                        {isSelected && <Check className="w-4 h-4 text-cyan-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Cross-Domain Roles (if non-CS) */}
              {branchRoleData.crossDomainRoles.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Optional Cross-Domain Placement Tracks
                    </label>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                      Cross-Domain
                    </span>
                  </div>

                  <div className="space-y-2">
                    {branchRoleData.crossDomainRoles.map((cross) => {
                      const isSelected = formData.careerInterests.includes(cross.role);
                      return (
                        <div
                          key={cross.role}
                          onClick={() => toggleCareerInterest(cross.role)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-[#4F46E5]'
                              : 'bg-slate-50/60 dark:bg-[#151821]/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#202334] dark:text-white">
                              {cross.role}
                            </span>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-[#4F46E5] dark:text-cyan-400" />
                            ) : (
                              <span className="text-[11px] text-slate-400">Select</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            {cross.transitionAdvice}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Transition Notice if cross-domain selected */}
              {selectedCrossDomainAdvice.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <div>
                    <span className="font-bold block">Cross-Domain Placement Path Selected:</span>
                    <p className="text-[11px] mt-0.5">
                      NEXORA will tailor your roadmap and interview drills to cover software screening fundamentals (DSA, OOP, SQL) while honoring your {formData.degree} in {formData.branch}.
                    </p>
                  </div>
                </div>
              )}

              {/* Study Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Current Preparation Level
                  </label>
                  <div className="space-y-1.5">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData({ ...formData, prepLevel: lvl })}
                        className={`w-full p-2.5 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                          formData.prepLevel === lvl
                            ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-800 dark:text-cyan-300 font-bold'
                            : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Daily Study Availability
                  </label>
                  <div className="space-y-1.5">
                    {(['30 minutes', '1 hour', '2 hours', '3 or more hours'] as const).map((hrs) => (
                      <button
                        key={hrs}
                        type="button"
                        onClick={() => setFormData({ ...formData, studyTime: hrs })}
                        className={`w-full p-2.5 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                          formData.studyTime === hrs
                            ? 'bg-[#4F46E5] text-white border-[#4F46E5] font-bold'
                            : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {hrs}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Learning Preferences & Language */}
        {step === 4 && (
          <div className="py-6 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] dark:text-cyan-400 mb-1">
                <Sliders className="w-4 h-4" /> Step 4: Study Priorities
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#202334] dark:text-white tracking-tight">
                Placement Learning Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose the preparation areas where you want daily practice recommendations.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Preferred Language or Tools
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setFormData({ ...formData, prefLanguage: lang })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        formData.prefLanguage === lang
                          ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                          : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Learning Focus Areas (Select all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {learningPreferenceOptions.map((opt) => {
                    const isSelected = formData.learningPreferences.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleLearningPreference(opt)}
                        className={`p-3 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-800 dark:text-cyan-300 font-bold'
                            : 'bg-slate-50 dark:bg-[#151821] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Summary & Confirmation */}
        {step === 5 && (
          <div className="py-6 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" /> Step 5: Ready to Prepare
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#202334] dark:text-white tracking-tight">
                Profile Confirmation
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your personalized placement roadmap and daily task engine are configured.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-[#202334] dark:text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">College:</span>
                <span className="font-bold text-[#202334] dark:text-white">{formData.college}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Degree:</span>
                <span className="font-bold text-[#202334] dark:text-white">{formData.degree}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Branch:</span>
                <span className="font-bold text-[#202334] dark:text-white">
                  {formData.branch === 'Other' ? formData.customBranch : formData.branch}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-bold text-[#4F46E5] dark:text-cyan-400">
                  {formData.careerInterests[0] || 'Software Engineer'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Daily Study Time:</span>
                <span className="font-bold text-[#202334] dark:text-white">{formData.studyTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#202334] dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-cinematic inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="btn-cinematic inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch My NEXORA Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </CinematicBackground>
  );
};
