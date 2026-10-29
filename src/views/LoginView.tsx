import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  User,
  Mail,
  AlertCircle,
  GraduationCap,
  Target,
  LineChart,
  Server,
  RefreshCw,
  UserCheck,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeToggle } from '../components/ThemeToggle';

export const LoginView: React.FC = () => {
  const {
    login,
    registerUser,
    adminLogin,
    verifyRecoveryKey,
    resetPassword,
    dbStatus,
    checkDatabase,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'register' | 'admin' | 'forgot'>('signin');

  // Sign In Form State
  const [identifier, setIdentifier] = useState('student');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBranch, setRegBranch] = useState('Computer Science and Engineering');
  const [regTargetRole, setRegTargetRole] = useState('Software Developer');

  // Admin Form State
  const [adminIdentifier, setAdminIdentifier] = useState('admin');
  const [adminPasswordInput, setAdminPasswordInput] = useState('AdminSecurePass2026!');

  // Forgot Password / Recovery State
  const [recoveryStep, setRecoveryStep] = useState<1 | 2>(1); // 1: Verify Key & Account, 2: Set New Password
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifiedUsername, setVerifiedUsername] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await login(identifier, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await registerUser({
        name: regName,
        username: regUsername,
        email: regEmail,
        password: regPassword,
        branch: regBranch,
        targetRole: regTargetRole,
      });

      if (!res.success) {
        setError(res.error || 'Registration failed. Please check your details.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await adminLogin(adminIdentifier, adminPasswordInput);
      if (!res.success) {
        setError(res.error || 'Invalid administrator credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Administrator authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Verify Recovery Key & Account
  const handleVerifyRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!recoveryIdentifier.trim()) {
      setError('Please enter your registered username or email.');
      return;
    }
    if (!recoveryKey.trim()) {
      setError('Please enter your recovery key.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyRecoveryKey(recoveryIdentifier.trim(), recoveryKey.trim());
      if (res.success) {
        setVerifiedUsername(res.username || recoveryIdentifier);
        setRecoveryStep(2);
        setSuccessMsg('Recovery key verified successfully! Please enter your new password.');
      } else {
        setError(res.error || 'Invalid recovery key or unknown account.');
      }
    } catch (err: any) {
      setError(err.message || 'Error verifying recovery key.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({
        identifier: recoveryIdentifier.trim(),
        recoveryKey: recoveryKey.trim(),
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Password reset successfully! You can now sign in.');
        setIdentifier(verifiedUsername || recoveryIdentifier.trim());
        setPassword('');
        setRecoveryStep(1);
        setRecoveryKey('');
        setNewPassword('');
        setConfirmPassword('');
        setMode('signin');
      } else {
        setError(res.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF9F5] dark:bg-[#0A0D14] text-[#111827] dark:text-[#F8FAFC] transition-colors overflow-x-hidden relative">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-[-10%] left-[10%] w-[550px] h-[550px] bg-gradient-to-br from-amber-200/40 via-orange-100/30 to-rose-100/20 dark:from-indigo-900/30 dark:to-cyan-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-indigo-200/35 via-violet-100/25 to-purple-200/20 dark:from-cyan-900/15 dark:to-indigo-950/20 rounded-full blur-[160px] pointer-events-none" />

      {/* LEFT SIDE: Brand Showcase & Architecture */}
      <div className="w-full lg:w-7/12 flex flex-col justify-between p-6 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-indigo-950/60 relative z-10 bg-gradient-to-br from-white/90 via-[#FAF9F5]/75 to-amber-50/25 dark:from-[#0E111A]/95 dark:via-[#0B0D13]/90 dark:to-[#121622]/95 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5 group cursor-default">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F46E5] via-[#3730A3] to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0C0E14] rounded-[14px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-400 fill-cyan-400/30 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-wider text-[#111827] dark:text-white">
                  NEXORA
                </span>
                <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-cyan-400 text-white shadow-xs">
                  CAMPUS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Intelligent Campus Placement Preparation Platform
              </p>
            </div>
          </div>

          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Hero Section */}
        <div className="my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-[#4F46E5] dark:text-cyan-300 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 animate-pulse" />
            <span>Campus Placement Intelligence Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] dark:text-white tracking-tight leading-[1.15]">
            Engineered for campus excellence.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-indigo-500 to-cyan-500">
              Placement Readiness.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            All your diagnostic scores, learning history, quiz attempts, and resume drafts are saved securely in your private workspace.
          </p>

          {/* Feature Highlights Grid */}
          <div className="mt-8 p-6 rounded-3xl card-cinematic relative overflow-hidden">
            <div className="grid grid-cols-3 gap-3.5 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121622] border border-slate-200/80 dark:border-indigo-900/40">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-[#4F46E5] dark:text-cyan-400 flex items-center justify-center mx-auto mb-2">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#202334] dark:text-white">9 Branches</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Domain-Specific Content</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121622] border border-slate-200/80 dark:border-indigo-900/40">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#202334] dark:text-white">3,500+ Questions</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Curated Question Bank</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121622] border border-slate-200/80 dark:border-indigo-900/40">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-[#4F46E5] dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                  <LineChart className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#202334] dark:text-white">28 Career Roles</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Placement Simulator</p>
              </div>
            </div>

            {/* Database Status Beam */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-ping'
                  }`}
                />
                <span className={dbStatus.connected ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                  {dbStatus.connected ? 'Database Connected' : 'Database Disconnected'}
                </span>
              </span>
              <button
                type="button"
                onClick={checkDatabase}
                disabled={dbStatus.checking}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#4F46E5] dark:hover:text-cyan-400 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${dbStatus.checking ? 'animate-spin' : ''}`} />
                <span>Check Status</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Comprehensive Campus Placement Suite</span>
          <span className="font-mono text-[11px] text-slate-400">RVCE Edition</span>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Portal Card */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 relative z-10">
        <div className="w-full max-w-md">
          {/* Desktop Controls */}
          <div className="hidden lg:flex justify-end mb-6">
            <ThemeToggle showLabel />
          </div>

          <div className="card-cinematic p-7 sm:p-8 rounded-3xl relative overflow-hidden backdrop-blur-2xl">
            {/* Mode Switcher Tabs or Account Recovery Header */}
            {mode === 'forgot' ? (
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-cyan-400 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#111827] dark:text-white block">
                      Account Recovery
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {recoveryStep === 1 ? 'Step 1 of 2: Verify Recovery Key' : 'Step 2 of 2: Set New Password'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            ) : (
              <div className="flex rounded-xl bg-slate-100 dark:bg-[#121622] p-1 mb-6 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-[#1D2333] text-[#4F46E5] dark:text-cyan-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white dark:bg-[#1D2333] text-[#4F46E5] dark:text-cyan-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('admin');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    mode === 'admin'
                      ? 'bg-white dark:bg-[#1D2333] text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  Admin
                </button>
              </div>
            )}

            {/* Database Disconnection Warning Banner */}
            {!dbStatus.connected && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Server className="w-4 h-4 text-rose-500" />
                  <span>Database Service Disconnected</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Unable to establish a database connection. Please check service status to sign in and synchronize progress.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* MODE 1: STUDENT SIGN IN */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Username or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      placeholder="Username or email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-[#111827] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setRecoveryStep(1);
                        setRecoveryIdentifier(identifier !== 'student' ? identifier : '');
                        setError(null);
                        setSuccessMsg(null);
                      }}
                      className="text-xs font-semibold text-[#4F46E5] dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-[#111827] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-cinematic w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Student Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE 2: STUDENT REGISTRATION */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="e.g. Akhilesh Kumar"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-sm text-[#111827] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      required
                      placeholder="akhilesh_cs"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-sm text-[#111827] dark:text-white font-mono focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      placeholder="student@campus.edu"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-sm text-[#111827] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password (min. 6 characters)
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Choose secure password"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-sm text-[#111827] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Branch
                    </label>
                    <select
                      value={regBranch}
                      onChange={(e) => setRegBranch(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    >
                      <option value="Computer Science and Engineering">CSE</option>
                      <option value="Information Science and Engineering">ISE</option>
                      <option value="Electronics and Communication Engineering">ECE</option>
                      <option value="Electrical and Electronics Engineering">EEE</option>
                      <option value="Mechanical Engineering">Mechanical</option>
                      <option value="Chemical Engineering">Chemical</option>
                      <option value="Civil Engineering">Civil</option>
                      <option value="Artificial Intelligence and Machine Learning">AI/ML</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Role
                    </label>
                    <select
                      value={regTargetRole}
                      onChange={(e) => setRegTargetRole(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#4F46E5]"
                    >
                      <option value="Software Developer">Software Developer</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full-Stack Developer">Full-Stack Developer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Machine Learning Engineer">ML Engineer</option>
                      <option value="Embedded Systems Engineer">Embedded Systems</option>
                      <option value="Mechanical Design Engineer">Mechanical Design</option>
                      <option value="Structural Engineer">Structural Engineer</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-cinematic w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE 3: ADMINISTRATOR PORTAL */}
            {mode === 'admin' && (
              <form onSubmit={handleAdminSignIn} className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Protected Administrator Authentication</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Admin Username or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      required
                      placeholder="admin"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-[#111827] dark:text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Admin Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      required
                      placeholder="AdminSecurePass2026!"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-[#111827] dark:text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-indigo-500/20"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Access Administrator Control Plane</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE 4: FORGOT / RESET PASSWORD */}
            {mode === 'forgot' && (
              <div className="space-y-4">
                {recoveryStep === 1 && (
                  <form onSubmit={handleVerifyRecovery} className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600/10 dark:bg-indigo-600/20 text-[#4F46E5] dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111827] dark:text-white">
                          Verify Registered Account
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          Provide your registered account username or email address and the recovery key to unlock password reset.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Registered Username or Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={recoveryIdentifier}
                          onChange={(e) => setRecoveryIdentifier(e.target.value)}
                          required
                          placeholder="e.g. student or student@campus.edu"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-[#111827] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Recovery Key
                        </label>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950/80 dark:text-cyan-300 border border-indigo-200/60 dark:border-indigo-800/60">
                          Verification Key: 3456
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={recoveryKey}
                          onChange={(e) => setRecoveryKey(e.target.value)}
                          required
                          placeholder="Enter recovery key"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-[#111827] dark:text-white text-sm font-mono focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-cinematic w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Verify Recovery Key</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {recoveryStep === 2 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111827] dark:text-white">
                          Identity Verified: @{verifiedUsername}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          Enter and confirm your new password. It will be encrypted with bcrypt and saved directly to your account.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        New Password (min. 6 characters)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="Choose new password"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-[#111827] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          placeholder="Re-enter new password"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0D1017] border border-slate-200 dark:border-indigo-900/50 text-[#111827] dark:text-white text-sm focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-cinematic w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (recoveryStep === 2) {
                        setRecoveryStep(1);
                      } else {
                        setMode('signin');
                      }
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{recoveryStep === 2 ? 'Back to Verification' : 'Back to Sign In'}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enterprise Campus Authentication • Bcrypt Encrypted • Secure Workspace Storage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
