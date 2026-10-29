import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Shield,
  HelpCircle,
  BookOpen,
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const AdminDashboardView: React.FC = () => {
  const { profile, logout } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'questions' | 'modules'>('overview');

  // Stats State
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Users Management State
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [usersPage, setUsersPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState<any>({ total: 0, pages: 1 });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);

  // Question Bank State
  const [questions, setQuestions] = useState<any[]>([]);
  const [qBranchFilter, setQBranchFilter] = useState('All');
  const [qSubjectFilter, setQSubjectFilter] = useState('All');
  const [qDiffFilter, setQDiffFilter] = useState('All');
  const [qSearch, setQSearch] = useState('');
  const [qPage, setQPage] = useState(1);
  const [qPagination, setQPagination] = useState<any>({ total: 0, pages: 1 });
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Question Modal State (Create / Edit)
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qFormData, setQFormData] = useState({
    branch: 'Computer Science and Engineering',
    subject: 'Data Structures & Algorithms',
    topic: 'Arrays & Strings',
    role: 'All',
    difficulty: 'Easy',
    question: '',
    option0: '',
    option1: '',
    option2: '',
    option3: '',
    correctIndex: 0,
    explanation: '',
  });

  // Action status alerts
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showActionAlert = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // 1. Fetch Stats
  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await api.admin.getStats();
      if (res.success && res.data?.stats) {
        setStats(res.data.stats);
      }
    } catch (e) {
      console.warn('Failed to load admin stats:', e);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // 2. Fetch Users
  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await api.admin.getUsers({
        search: userSearch,
        role: userRoleFilter,
        status: userStatusFilter,
        page: usersPage,
        limit: 15,
      });
      if (res.success && res.data?.users) {
        setUsers(res.data.users);
        setUsersPagination(res.data.pagination || { total: res.data.users.length, pages: 1 });
      }
    } catch (e) {
      console.warn('Failed to load users:', e);
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, userRoleFilter, userStatusFilter, usersPage]);

  // 3. Fetch Questions
  const loadQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const res = await api.admin.getQuestions({
        branch: qBranchFilter,
        subject: qSubjectFilter,
        difficulty: qDiffFilter,
        search: qSearch,
        page: qPage,
        limit: 15,
      });
      if (res.success && res.data?.questions) {
        setQuestions(res.data.questions);
        setQPagination(res.data.pagination || { total: res.data.questions.length, pages: 1 });
      }
    } catch (e) {
      console.warn('Failed to load questions:', e);
    } finally {
      setLoadingQuestions(false);
    }
  }, [qBranchFilter, qSubjectFilter, qDiffFilter, qSearch, qPage]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
  }, [activeTab, loadUsers]);

  useEffect(() => {
    if (activeTab === 'questions') loadQuestions();
  }, [activeTab, loadQuestions]);

  // Toggle User Status
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await api.admin.toggleUserStatus(userId);
      if (res.success) {
        showActionAlert('success', res.data?.message || 'User status updated successfully.');
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: !currentStatus } : u))
        );
      } else {
        showActionAlert('error', res.error || 'Failed to update user status.');
      }
    } catch (err: any) {
      showActionAlert('error', err.message || 'Error updating status.');
    }
  };

  // View User Full Details
  const handleViewUser = async (userId: string) => {
    try {
      const res = await api.admin.getUserDetails(userId);
      if (res.success && res.data) {
        setSelectedUserDetail(res.data);
      }
    } catch (e) {
      showActionAlert('error', 'Failed to retrieve user details.');
    }
  };

  // Submit Question (Create or Update)
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      branch: qFormData.branch,
      subject: qFormData.subject,
      topic: qFormData.topic,
      role: qFormData.role || 'All',
      difficulty: qFormData.difficulty,
      question: qFormData.question,
      options: [qFormData.option0, qFormData.option1, qFormData.option2, qFormData.option3],
      correctIndex: Number(qFormData.correctIndex),
      explanation: qFormData.explanation,
    };

    try {
      if (editingQuestionId) {
        const res = await api.admin.updateQuestion(editingQuestionId, payload);
        if (res.success) {
          showActionAlert('success', 'Question updated successfully.');
          setShowQuestionModal(false);
          loadQuestions();
          loadStats();
        } else {
          showActionAlert('error', res.error || 'Failed to update question.');
        }
      } else {
        const res = await api.admin.createQuestion(payload);
        if (res.success) {
          showActionAlert('success', 'Question added to bank successfully.');
          setShowQuestionModal(false);
          loadQuestions();
          loadStats();
        } else {
          showActionAlert('error', res.error || 'Failed to create question.');
        }
      }
    } catch (err: any) {
      showActionAlert('error', err.message || 'Error saving question.');
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (qId: string) => {
    if (!window.confirm('Are you sure you want to delete this question from the bank?')) return;
    try {
      const res = await api.admin.deleteQuestion(qId);
      if (res.success) {
        showActionAlert('success', 'Question removed.');
        loadQuestions();
        loadStats();
      } else {
        showActionAlert('error', res.error || 'Failed to delete question.');
      }
    } catch (err: any) {
      showActionAlert('error', err.message || 'Failed to delete question.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl card-cinematic border border-slate-200 dark:border-indigo-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Plane</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
            NEXORA System Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Signed in as <span className="font-bold text-[#4F46E5] dark:text-cyan-400">{profile.username || 'admin'}</span> • MongoDB Local Instance: <code className="font-mono text-xs">mongodb://127.0.0.1:27017/nexora</code>
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all cursor-pointer self-start sm:self-auto"
        >
          Sign Out of Admin
        </button>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs font-semibold border ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-700 dark:text-rose-300'
          }`}
        >
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-4">
        {[
          { id: 'overview', label: 'System Overview & Health', icon: Activity },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'questions', label: 'Question Bank', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-[#4F46E5] text-[#4F46E5] dark:border-cyan-400 dark:text-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & HEALTH */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
              <p className="text-2xl sm:text-3xl font-black text-[#111827] dark:text-white font-mono mt-1">
                {stats?.users?.total ?? '--'}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {stats?.users?.students ?? 0} Students • {stats?.users?.admins ?? 0} Admin
              </span>
            </div>

            <div className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active (7 Days)</span>
              <p className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono mt-1">
                {stats?.users?.recentlyActive ?? '--'}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">Logged in recently</span>
            </div>

            <div className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Quizzes Taken</span>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
                {stats?.learning?.totalQuizAttempts ?? '--'}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {stats?.learning?.totalCompletedLessons ?? 0} Lessons Completed
              </span>
            </div>

            <div className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Question Bank Size</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                {stats?.questionBank?.total ?? '--'}
              </p>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {stats?.questionBank?.byDifficulty?.Easy || 0} Easy • {stats?.questionBank?.byDifficulty?.Medium || 0} Med • {stats?.questionBank?.byDifficulty?.Hard || 0} Hard
              </span>
            </div>
          </div>

          {/* Database Health Card */}
          <div className="p-6 rounded-3xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-bold text-[#111827] dark:text-white">Database Health & Infrastructure</h3>
              </div>
              <button
                type="button"
                onClick={loadStats}
                className="flex items-center gap-1 text-xs text-[#4F46E5] dark:text-cyan-400 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Database Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {stats?.database?.connected ? 'Online & Responsive' : 'Disconnected'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Host / Port</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">
                  {stats?.database?.host || '127.0.0.1'}:{stats?.database?.port || 27017}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Database Name</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">
                  {stats?.database?.name || 'nexora'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Server Uptime</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 mt-0.5 block">
                  {stats?.serverUptime ? `${Math.round(stats.serverUptime / 60)} minutes` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Question Bank Breakdown Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Questions By Branch</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {stats?.questionBank?.byBranch &&
                  Object.entries(stats.questionBank.byBranch).map(([branch, count]: any) => (
                    <div key={branch} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="truncate pr-2 font-medium">{branch}</span>
                      <span className="font-mono font-bold text-[#4F46E5] dark:text-cyan-400">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Questions By Subject</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {stats?.questionBank?.bySubject &&
                  Object.entries(stats.questionBank.bySubject).map(([subj, count]: any) => (
                    <div key={subj} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="truncate pr-2 font-medium">{subj}</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="p-4 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, username, email..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUsersPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={userStatusFilter}
                onChange={(e) => {
                  setUserStatusFilter(e.target.value);
                  setUsersPage(1);
                }}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="disabled">Disabled Only</option>
              </select>

              <select
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value);
                  setUsersPage(1);
                }}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="student">Students</option>
                <option value="admin">Administrators</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#151821]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#121622] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Branch & Role</th>
                    <th className="px-4 py-3">Registered</th>
                    <th className="px-4 py-3">Last Seen</th>
                    <th className="px-4 py-3 text-center">Lessons</th>
                    <th className="px-4 py-3 text-center">Quizzes</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No registered users match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-bold text-[#111827] dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">@{u.username} • {u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">{u.branch}</p>
                          <p className="text-[11px] text-indigo-600 dark:text-cyan-400">{u.targetRole}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(u.lastSeenAt || u.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold">
                          {u.completedLessonsCount ?? 0}
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold">
                          {u.quizAttemptsCount ?? 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.isActive
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {u.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                          <button
                            type="button"
                            onClick={() => handleViewUser(u._id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                            title="View Full Student Activity"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {u.role !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                u.isActive
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                              }`}
                              title={u.isActive ? 'Disable Account' : 'Enable Account'}
                            >
                              {u.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {usersPagination.pages > 1 && (
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Page {usersPage} of {usersPagination.pages}</span>
                <div className="flex gap-1">
                  <button
                    disabled={usersPage <= 1}
                    onClick={() => setUsersPage((p) => p - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={usersPage >= usersPagination.pages}
                    onClick={() => setUsersPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QUESTION BANK MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Question Controls */}
          <div className="p-4 rounded-2xl card-cinematic border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search questions..."
                value={qSearch}
                onChange={(e) => {
                  setQSearch(e.target.value);
                  setQPage(1);
                }}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none"
              />

              <select
                value={qDiffFilter}
                onChange={(e) => {
                  setQDiffFilter(e.target.value);
                  setQPage(1);
                }}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={qDiffFilter}
                onChange={(e) => {
                  setQDiffFilter(e.target.value);
                  setQPage(1);
                }}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none hidden sm:inline"
              >
                <option value="All">All Categories</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingQuestionId(null);
                setQFormData({
                  branch: 'Computer Science and Engineering',
                  subject: 'Data Structures & Algorithms',
                  topic: 'Arrays & Strings',
                  role: 'All',
                  difficulty: 'Easy',
                  question: '',
                  option0: '',
                  option1: '',
                  option2: '',
                  option3: '',
                  correctIndex: 0,
                  explanation: '',
                });
                setShowQuestionModal(true);
              }}
              className="btn-cinematic flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {questions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 card-cinematic rounded-2xl border border-slate-200 dark:border-slate-800">
                No questions found matching your filter criteria.
              </div>
            ) : (
              questions.map((q) => (
                <div
                  key={q._id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#151821] border border-slate-200 dark:border-slate-800 space-y-2.5 transition-all"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">
                        {q.subject}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          q.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : q.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-rose-500/10 text-rose-600'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-slate-400 text-[11px]">{q.topic}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuestionId(q._id);
                          setQFormData({
                            branch: q.branch,
                            subject: q.subject,
                            topic: q.topic,
                            role: q.role || 'All',
                            difficulty: q.difficulty,
                            question: q.question,
                            option0: q.options[0] || '',
                            option1: q.options[1] || '',
                            option2: q.options[2] || '',
                            option3: q.options[3] || '',
                            correctIndex: q.correctIndex,
                            explanation: q.explanation,
                          });
                          setShowQuestionModal(true);
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                        title="Edit Question"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {q.options.map((opt: string, i: number) => (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border flex items-center justify-between ${
                          i === q.correctIndex
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 font-semibold text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span>{opt}</span>
                        {i === q.correctIndex && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Explanation:</span> {q.explanation}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Question Pagination */}
          {qPagination.pages > 1 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Page {qPage} of {qPagination.pages} ({qPagination.total} total questions)</span>
              <div className="flex gap-1">
                <button
                  disabled={qPage <= 1}
                  onClick={() => setQPage((p) => p - 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={qPage >= qPagination.pages}
                  onClick={() => setQPage((p) => p + 1)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: VIEW STUDENT DETAILS */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#151821] rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-white">
                  {selectedUserDetail.user.name} (@{selectedUserDetail.user.username})
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedUserDetail.user.branch} • Target: {selectedUserDetail.user.targetRole}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Lessons Completed</span>
                <p className="text-xl font-bold font-mono mt-0.5">{selectedUserDetail.progress.completedLessons?.length || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Quizzes Attempted</span>
                <p className="text-xl font-bold font-mono mt-0.5">{selectedUserDetail.progress.quizAttempts?.length || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Current Streak</span>
                <p className="text-xl font-bold font-mono text-amber-500 mt-0.5">
                  {selectedUserDetail.progress.streak?.currentStreak || 0} days
                </p>
              </div>
            </div>

            {/* Quiz Attempt History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz Attempt History</h4>
              {(!selectedUserDetail.progress.quizAttempts || selectedUserDetail.progress.quizAttempts.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No quiz attempts recorded yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedUserDetail.progress.quizAttempts.map((attempt: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#111827] dark:text-white">{attempt.subject}</span>
                        <span className="text-slate-400 text-[11px] block">{new Date(attempt.completedAt).toLocaleString()}</span>
                      </div>
                      <span
                        className={`font-mono font-bold px-2.5 py-1 rounded-lg ${
                          attempt.score >= 60
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-rose-500/10 text-rose-600'
                        }`}
                      >
                        {attempt.score}% ({attempt.correctCount}/{attempt.totalQuestions})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT QUESTION */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#151821] rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-[#111827] dark:text-white">
                {editingQuestionId ? 'Edit Question in Bank' : 'Add New Question to Bank'}
              </h3>
              <button
                type="button"
                onClick={() => setShowQuestionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Branch</label>
                  <select
                    value={qFormData.branch}
                    onChange={(e) => setQFormData({ ...qFormData, branch: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800"
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
                    <option value="All">All Branches / General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Difficulty</label>
                  <select
                    value={qFormData.difficulty}
                    onChange={(e) => setQFormData({ ...qFormData, difficulty: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={qFormData.subject}
                    onChange={(e) => setQFormData({ ...qFormData, subject: e.target.value })}
                    required
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Topic</label>
                  <input
                    type="text"
                    value={qFormData.topic}
                    onChange={(e) => setQFormData({ ...qFormData, topic: e.target.value })}
                    required
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Question Text</label>
                <textarea
                  rows={3}
                  value={qFormData.question}
                  onChange={(e) => setQFormData({ ...qFormData, question: e.target.value })}
                  required
                  placeholder="Enter clear, technical question text..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block font-semibold">Answer Options & Correct Key</label>
                {[0, 1, 2, 3].map((optIdx) => {
                  const key = `option${optIdx}` as 'option0' | 'option1' | 'option2' | 'option3';
                  const isCorrect = qFormData.correctIndex === optIdx;
                  return (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerKey"
                        checked={isCorrect}
                        onChange={() => setQFormData({ ...qFormData, correctIndex: optIdx })}
                        className="cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        value={qFormData[key]}
                        onChange={(e) => setQFormData({ ...qFormData, [key]: e.target.value })}
                        required
                        className={`flex-1 p-2 rounded-xl bg-slate-50 dark:bg-[#121622] border ${
                          isCorrect ? 'border-emerald-500 font-semibold' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Explanation & Mathematical Steps</label>
                <textarea
                  rows={2}
                  value={qFormData.explanation}
                  onChange={(e) => setQFormData({ ...qFormData, explanation: e.target.value })}
                  required
                  placeholder="Explain why the chosen option is correct and why distractors are incorrect..."
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-cinematic px-5 py-2 rounded-xl font-bold text-white shadow-xs"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

