import { Router } from 'express';
import { User } from '../models/User';
import { UserProgress } from '../models/UserProgress';
import { Question } from '../models/Question';
import { LearningModule } from '../models/LearningModule';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { getDbStatus } from '../db';

const router = Router();

// Apply requireAdmin to all admin endpoints
router.use(requireAdmin);

// 1. Comprehensive System & Learning Analytics
router.get('/stats', async (req: AuthRequest, res): Promise<any> => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActiveUsers = await User.countDocuments({ lastSeenAt: { $gte: sevenDaysAgo } });

    // Progress aggregates across all users
    const allProgress = await UserProgress.find().select('completedLessons quizAttempts');
    let totalQuizAttempts = 0;
    let totalCompletedLessons = 0;

    allProgress.forEach((p) => {
      totalQuizAttempts += (p.quizAttempts || []).length;
      totalCompletedLessons += (p.completedLessons || []).length;
    });

    // Question Bank Metrics
    const totalQuestions = await Question.countDocuments();

    // Group questions by difficulty
    const difficultyCounts = await Question.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
    ]);
    const byDifficulty: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
    difficultyCounts.forEach((d) => {
      if (d._id) byDifficulty[d._id] = d.count;
    });

    // Group questions by branch
    const branchCounts = await Question.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const byBranch: Record<string, number> = {};
    branchCounts.forEach((b) => {
      if (b._id) byBranch[b._id] = b.count;
    });

    // Group questions by subject
    const subjectCounts = await Question.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const bySubject: Record<string, number> = {};
    subjectCounts.forEach((s) => {
      if (s._id) bySubject[s._id] = s.count;
    });

    // Learning modules count
    const totalModules = await LearningModule.countDocuments();

    return res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          students: studentCount,
          admins: adminCount,
          recentlyActive: recentActiveUsers,
        },
        learning: {
          totalQuizAttempts,
          totalCompletedLessons,
          totalModules,
        },
        questionBank: {
          total: totalQuestions,
          byDifficulty,
          byBranch,
          bySubject,
        },
        database: getDbStatus(),
        serverUptime: process.uptime(),
      },
    });
  } catch (err: any) {
    console.error('[NEXORA Admin] Stats error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin stats.' });
  }
});

// 2. User Management: Search & Filter Users
router.get('/users', async (req: AuthRequest, res): Promise<any> => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (role && role !== 'All') {
      filter.role = role;
    }

    if (status && status !== 'All') {
      filter.isActive = status === 'active';
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { username: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { branch: { $regex: term, $options: 'i' } },
        { targetRole: { $regex: term, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * pageSize;

    const totalUsers = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Get progress summary for each user
    const userIds = users.map((u) => u._id);
    const progresses = await UserProgress.find({ userId: { $in: userIds } });
    const progressMap = new Map(progresses.map((p) => [p.userId.toString(), p]));

    const usersWithProgress = users.map((u) => {
      const p = progressMap.get(u._id.toString());
      return {
        ...u.toObject(),
        completedLessonsCount: p ? p.completedLessons.length : 0,
        quizAttemptsCount: p ? p.quizAttempts.length : 0,
        streakDays: p ? p.streak?.currentStreak || 0 : 0,
      };
    });

    return res.json({
      success: true,
      users: usersWithProgress,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total: totalUsers,
        pages: Math.ceil(totalUsers / pageSize),
      },
    });
  } catch (err: any) {
    console.error('[NEXORA Admin] Users list error:', err);
    return res.status(500).json({ error: 'Failed to retrieve users list.' });
  }
});

// 3. User Details & Learning Activity History
router.get('/users/:userId', async (req: AuthRequest, res): Promise<any> => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const progress = await UserProgress.findOne({ userId: user._id });

    return res.json({
      success: true,
      user,
      progress: progress || {
        completedLessons: [],
        quizAttempts: [],
        bookmarks: [],
        streak: { currentStreak: 0, longestStreak: 0 },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve user details.' });
  }
});

// 4. Toggle Account Active / Disabled Status Safely
router.put('/users/:userId/toggle-status', async (req: AuthRequest, res): Promise<any> => {
  try {
    const targetUserId = req.params.userId;

    // Prevent admin from disabling themselves
    if (req.user!._id.toString() === targetUserId) {
      return res.status(400).json({ error: 'You cannot disable your own administrator account.' });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.json({
      success: true,
      message: `Account for ${user.username} has been ${user.isActive ? 'enabled' : 'disabled'}.`,
      isActive: user.isActive,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update account status.' });
  }
});

// 5. Question Bank Management: List Questions
router.get('/questions', async (req: AuthRequest, res): Promise<any> => {
  try {
    const { branch, subject, difficulty, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (branch && branch !== 'All') filter.branch = branch;
    if (subject && subject !== 'All') filter.subject = subject;
    if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { question: { $regex: term, $options: 'i' } },
        { topic: { $regex: term, $options: 'i' } },
        { explanation: { $regex: term, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pageNum - 1) * pageSize;

    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    return res.json({
      success: true,
      questions,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve questions.' });
  }
});

// 6. Create Question
router.post('/questions', async (req: AuthRequest, res): Promise<any> => {
  try {
    const { branch, subject, topic, role, difficulty, question, options, correctIndex, explanation, hints, tags } = req.body;

    if (!branch || !subject || !topic || !difficulty || !question || !options || correctIndex === undefined || !explanation) {
      return res.status(400).json({ error: 'Missing required question fields.' });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options are required.' });
    }

    const idx = Number(correctIndex);
    if (isNaN(idx) || idx < 0 || idx >= options.length) {
      return res.status(400).json({ error: 'Correct answer index must be within the options range.' });
    }

    const newQ = new Question({
      branch,
      subject,
      topic,
      role: role || 'All',
      difficulty,
      question: question.trim(),
      options: options.map((o: string) => o.trim()),
      correctIndex: idx,
      explanation: explanation.trim(),
      hints: Array.isArray(hints) ? hints : [],
      tags: Array.isArray(tags) ? tags : [],
    });

    await newQ.save();
    return res.status(201).json({ success: true, message: 'Question created successfully.', question: newQ });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create question.' });
  }
});

// 7. Update Question
router.put('/questions/:questionId', async (req: AuthRequest, res): Promise<any> => {
  try {
    const { questionId } = req.params;
    const updates = req.body;

    if (updates.options && updates.correctIndex !== undefined) {
      const idx = Number(updates.correctIndex);
      if (idx < 0 || idx >= updates.options.length) {
        return res.status(400).json({ error: 'Correct index must be within options range.' });
      }
    }

    const updated = await Question.findByIdAndUpdate(questionId, updates, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    return res.json({ success: true, message: 'Question updated successfully.', question: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update question.' });
  }
});

// 8. Delete Question
router.delete('/questions/:questionId', async (req: AuthRequest, res): Promise<any> => {
  try {
    const { questionId } = req.params;
    const deleted = await Question.findByIdAndDelete(questionId);
    if (!deleted) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    return res.json({ success: true, message: 'Question deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete question.' });
  }
});

// 9. Content Management: Create or Update Module
router.post('/modules', async (req: AuthRequest, res): Promise<any> => {
  try {
    const data = req.body;
    if (!data.moduleId || !data.branch || !data.subject || !data.title || !data.conceptIntroduction) {
      return res.status(400).json({ error: 'Missing required module fields.' });
    }

    const existing = await LearningModule.findOne({ moduleId: data.moduleId });
    if (existing) {
      const updated = await LearningModule.findOneAndUpdate({ moduleId: data.moduleId }, data, { new: true });
      return res.json({ success: true, message: 'Module updated successfully.', module: updated });
    }

    const newMod = new LearningModule(data);
    await newMod.save();
    return res.status(201).json({ success: true, message: 'Module created successfully.', module: newMod });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save learning module.' });
  }
});

// 10. Delete Module
router.delete('/modules/:moduleId', async (req: AuthRequest, res): Promise<any> => {
  try {
    const { moduleId } = req.params;
    const deleted = await LearningModule.findOneAndDelete({ moduleId });
    if (!deleted) return res.status(404).json({ error: 'Module not found.' });
    return res.json({ success: true, message: 'Module deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to delete module.' });
  }
});

export default router;

