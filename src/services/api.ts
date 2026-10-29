export const TOKEN_STORAGE_KEY = 'nexora_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: json.error || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      data: json,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network request failed. Is the NEXORA server running?',
    };
  }
}

export const api = {
  // Health & Database status
  async checkHealth() {
    return apiRequest('/api/health', { method: 'GET' });
  },

  // Auth Endpoints
  auth: {
    async register(data: {
      name: string;
      username: string;
      email: string;
      password: string;
      branch?: string;
      targetRole?: string;
      degree?: string;
      college?: string;
      prepLevel?: string;
      studyTime?: string;
    }) {
      const res = await apiRequest<{ token: string; user: any }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },

    async login(identifier: string, pass: string) {
      const res = await apiRequest<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password: pass }),
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },

    async adminLogin(identifier: string, pass: string) {
      const res = await apiRequest<{ token: string; user: any }>('/api/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password: pass }),
      });
      if (res.success && res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res;
    },

    async getMe() {
      return apiRequest<{ user: any }>('/api/auth/me', { method: 'GET' });
    },

    async updateProfile(updates: Record<string, any>) {
      return apiRequest<{ user: any }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    logout() {
      removeAuthToken();
    },
  },

  // Student Progress Endpoints
  progress: {
    async getProgress() {
      return apiRequest<{ progress: any }>('/api/progress', { method: 'GET' });
    },

    async completeLesson(lessonId: string, moduleId?: string) {
      return apiRequest('/api/progress/complete-lesson', {
        method: 'POST',
        body: JSON.stringify({ lessonId, moduleId }),
      });
    },

    async toggleBookmark(moduleId: string) {
      return apiRequest('/api/progress/bookmark', {
        method: 'POST',
        body: JSON.stringify({ moduleId }),
      });
    },

    async saveNote(moduleId: string, text: string) {
      return apiRequest('/api/progress/note', {
        method: 'POST',
        body: JSON.stringify({ moduleId, text }),
      });
    },

    async markCodingSolved(problemId: string) {
      return apiRequest('/api/progress/coding-solved', {
        method: 'POST',
        body: JSON.stringify({ problemId }),
      });
    },

    async toggleDailyTask(taskId: string) {
      return apiRequest<{ success: boolean; taskId: string; isCompleted: boolean; completedTasks: string[]; streak: any }>('/api/progress/task/toggle', {
        method: 'POST',
        body: JSON.stringify({ taskId }),
      });
    },

    async saveAssessment(payload: { assessmentResult: any; answers?: any; skills?: string[]; preparationGoals?: string[] }) {
      return apiRequest<{ success: boolean; assessmentResult: any; onboarded: boolean }>('/api/progress/assessment', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // Question Bank & Randomized Quiz
  quiz: {
    async generateQuiz(params: {
      branch?: string;
      subject?: string;
      role?: string;
      difficulty?: string;
      length?: number;
    }) {
      return apiRequest<{
        questions: any[];
        totalQuestions: number;
        availableCount: number;
        message?: string;
      }>('/api/quiz/generate', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    async submitQuiz(data: {
      branch?: string;
      subject?: string;
      topic?: string;
      role?: string;
      difficulty?: string;
      answers: Record<string, number>;
    }) {
      return apiRequest<{
        attemptId: string;
        score: number;
        correctCount: number;
        totalQuestions: number;
        answers: any[];
        completedAt: string;
        streak?: any;
      }>('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async getHistory() {
      return apiRequest<{ attempts: any[]; totalAttempts: number }>('/api/quiz/history', {
        method: 'GET',
      });
    },
  },

  // Learning Studio Modules
  modules: {
    async getModules(params: { branch?: string; subject?: string; search?: string } = {}) {
      const query = new URLSearchParams();
      if (params.branch) query.append('branch', params.branch);
      if (params.subject) query.append('subject', params.subject);
      if (params.search) query.append('search', params.search);
      return apiRequest<{ count: number; modules: any[] }>(`/api/modules?${query.toString()}`, {
        method: 'GET',
      });
    },

    async getModule(moduleId: string) {
      return apiRequest<{ module: any }>(`/api/modules/${moduleId}`, { method: 'GET' });
    },

    async getCategories() {
      return apiRequest<{ branches: string[]; subjects: string[] }>('/api/modules/meta/categories', {
        method: 'GET',
      });
    },
  },

  // Interview Studio
  interview: {
    async evaluateAnswer(data: {
      role?: string;
      category?: string;
      question: string;
      answer: string;
      sessionId?: string;
    }) {
      return apiRequest<{ feedback: any }>('/api/interview/evaluate-answer', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async getQuestions(params: { role?: string; category?: string } = {}) {
      const query = new URLSearchParams();
      if (params.role) query.append('role', params.role);
      if (params.category) query.append('category', params.category);
      return apiRequest<{ count: number; questions: any[] }>(`/api/interview/questions?${query.toString()}`, {
        method: 'GET',
      });
    },

    async getHistory() {
      return apiRequest<{ sessions: any[] }>('/api/interview/history', { method: 'GET' });
    },

    async saveSession(session: any) {
      return apiRequest<{ session: any; streak: any }>('/api/interview/save-session', {
        method: 'POST',
        body: JSON.stringify({ session }),
      });
    },
  },

  // Resume Builder
  resume: {
    async getResume() {
      return apiRequest<{ resumeData: any }>('/api/resume', { method: 'GET' });
    },

    async saveResume(resumeData: any) {
      return apiRequest<{ resumeData: any }>('/api/resume/save', {
        method: 'POST',
        body: JSON.stringify({ resumeData }),
      });
    },
  },

  // Local Rule-Based Assistant
  assistant: {
    async query(message: string) {
      return apiRequest<{
        reply: string;
        actionPage?: string;
        actionPayload?: string;
        assistantType?: string;
      }>('/api/assistant/query', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
  },

  // Roles Catalogue
  roles: {
    async getRoles() {
      return apiRequest<{ count: number; roles: any[] }>('/api/roles', { method: 'GET' });
    },
  },

  // Admin Endpoints
  admin: {
    async getStats() {
      return apiRequest<{ stats: any }>('/api/admin/stats', { method: 'GET' });
    },

    async getUsers(params: { search?: string; role?: string; status?: string; page?: number; limit?: number } = {}) {
      const query = new URLSearchParams();
      if (params.search) query.append('search', params.search);
      if (params.role) query.append('role', params.role);
      if (params.status) query.append('status', params.status);
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      return apiRequest<{ users: any[]; pagination: any }>(`/api/admin/users?${query.toString()}`, {
        method: 'GET',
      });
    },

    async getUserDetails(userId: string) {
      return apiRequest<{ user: any; progress: any }>(`/api/admin/users/${userId}`, { method: 'GET' });
    },

    async toggleUserStatus(userId: string) {
      return apiRequest<{ message: string; isActive: boolean }>(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
      });
    },

    async getQuestions(params: { branch?: string; subject?: string; difficulty?: string; search?: string; page?: number; limit?: number } = {}) {
      const query = new URLSearchParams();
      if (params.branch) query.append('branch', params.branch);
      if (params.subject) query.append('subject', params.subject);
      if (params.difficulty) query.append('difficulty', params.difficulty);
      if (params.search) query.append('search', params.search);
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      return apiRequest<{ questions: any[]; pagination: any }>(`/api/admin/questions?${query.toString()}`, {
        method: 'GET',
      });
    },

    async createQuestion(data: any) {
      return apiRequest('/api/admin/questions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async updateQuestion(questionId: string, data: any) {
      return apiRequest(`/api/admin/questions/${questionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async deleteQuestion(questionId: string) {
      return apiRequest(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
      });
    },

    async saveModule(moduleData: any) {
      return apiRequest('/api/admin/modules', {
        method: 'POST',
        body: JSON.stringify(moduleData),
      });
    },

    async deleteModule(moduleId: string) {
      return apiRequest(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE',
      });
    },
  },
};
