import { Router } from 'express';
import { UserProgress, IUserProgress } from '../models/UserProgress';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper to update streak based on real dates
function updateStreakOnActivity(progress: IUserProgress) {
  const today = new Date().toISOString().split('T')[0];
  const dates = progress.streak.activityDates || [];

  if (!dates.includes(today)) {
    dates.push(today);
    progress.streak.activityDates = dates;

    const lastDate = progress.streak.lastActivityDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (lastDate === yesterday) {
      progress.streak.currentStreak += 1;
    } else if (lastDate !== today) {
      progress.streak.currentStreak = 1;
    }

    if (progress.streak.currentStreak > progress.streak.longestStreak) {
      progress.streak.longestStreak = progress.streak.currentStreak;
    }

    progress.streak.lastActivityDate = today;
  }
  progress.lastActivityAt = new Date();
}

// 1. Get authenticated user's progress and aggregated metrics
router.get('/', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    let progress = await UserProgress.findOne({ userId: req.user!._id });

    if (!progress) {
      const today = new Date().toISOString().split('T')[0];
      progress = new UserProgress({
        userId: req.user!._id,
        completedLessons: [],
        completedModules: [],
        bookmarks: [],
        notes: [],
        quizAttempts: [],
        aptitudeAttempts: [],
        codingSolved: [],
        completedTasks: [],
        interviewSessions: [],
        streak: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: '',
          activityDates: [],
        },
        lastActivityAt: new Date(),
      });
      await progress.save();
    }

    // Compute subject-wise and branch-wise performance from real quiz attempts
    const subjectMetrics: Record<string, { totalScore: number; count: number; avgScore: number; highestScore: number }> = {};
    progress.quizAttempts.forEach((attempt) => {
      const subj = attempt.subject || 'General';
      if (!subjectMetrics[subj]) {
        subjectMetrics[subj] = { totalScore: 0, count: 0, avgScore: 0, highestScore: 0 };
      }
      subjectMetrics[subj].totalScore += attempt.score;
      subjectMetrics[subj].count += 1;
      if (attempt.score > subjectMetrics[subj].highestScore) {
        subjectMetrics[subj].highestScore = attempt.score;
      }
      subjectMetrics[subj].avgScore = Math.round(subjectMetrics[subj].totalScore / subjectMetrics[subj].count);
    });

    const totalQuizzes = progress.quizAttempts.length;
    const avgOverallScore = totalQuizzes > 0
      ? Math.round(progress.quizAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes)
      : null;

    return res.json({
      success: true,
      progress: {
        completedLessons: progress.completedLessons,
        completedModules: progress.completedModules,
        bookmarks: progress.bookmarks,
        notes: progress.notes,
        quizAttempts: progress.quizAttempts,
        aptitudeAttempts: progress.aptitudeAttempts,
        codingSolved: progress.codingSolved,
        completedTasks: progress.completedTasks || [],
        interviewSessions: progress.interviewSessions,
        assessmentResult: progress.assessmentResult || null,
        assessmentAnswers: progress.assessmentAnswers || {},
        streak: progress.streak,
        lastActivityAt: progress.lastActivityAt,
        summary: {
          totalLessonsCompleted: progress.completedLessons.length,
          totalModulesCompleted: progress.completedModules.length,
          totalQuizzesTaken: totalQuizzes,
          averageQuizScore: avgOverallScore,
          codingProblemsSolved: progress.codingSolved.length,
          interviewSessionsCount: progress.interviewSessions.length,
          subjectPerformance: subjectMetrics,
        },
      },
    });
  } catch (err: any) {
    console.error('[NEXORA Progress] Get error:', err);
    return res.status(500).json({ error: 'Failed to retrieve progress.' });
  }
});

// 2. Mark Lesson as Complete (No duplicate credit awarded!)
router.post('/complete-lesson', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { lessonId, moduleId } = req.body;
    if (!lessonId) {
      return res.status(400).json({ error: 'Lesson ID is required.' });
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = new UserProgress({ userId: req.user!._id });
    }

    let isNewCompletion = false;

    // Check if already completed
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      isNewCompletion = true;
    }

    if (moduleId && !progress.completedModules.includes(moduleId)) {
      progress.completedModules.push(moduleId);
      isNewCompletion = true;
    }

    if (isNewCompletion) {
      updateStreakOnActivity(progress);
      await progress.save();
    }

    return res.json({
      success: true,
      isNewCompletion,
      completedLessons: progress.completedLessons,
      completedModules: progress.completedModules,
      streak: progress.streak,
    });
  } catch (err: any) {
    console.error('[NEXORA Progress] Complete lesson error:', err);
    return res.status(500).json({ error: 'Failed to update lesson completion.' });
  }
});

// 3. Toggle Bookmark
router.post('/bookmark', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { moduleId } = req.body;
    if (!moduleId) {
      return res.status(400).json({ error: 'Module ID is required.' });
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) progress = new UserProgress({ userId: req.user!._id });

    const idx = progress.bookmarks.indexOf(moduleId);
    let bookmarked = false;
    if (idx > -1) {
      progress.bookmarks.splice(idx, 1);
      bookmarked = false;
    } else {
      progress.bookmarks.push(moduleId);
      bookmarked = true;
    }

    await progress.save();
    return res.json({ success: true, bookmarked, bookmarks: progress.bookmarks });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to toggle bookmark.' });
  }
});

// 4. Save User Notes
router.post('/note', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { moduleId, text } = req.body;
    if (!moduleId) {
      return res.status(400).json({ error: 'Module ID is required.' });
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) progress = new UserProgress({ userId: req.user!._id });

    const existingNote = progress.notes.find((n) => n.moduleId === moduleId);
    if (existingNote) {
      existingNote.text = text || '';
      existingNote.updatedAt = new Date();
    } else {
      progress.notes.push({ moduleId, text: text || '', updatedAt: new Date() });
    }

    await progress.save();
    return res.json({ success: true, notes: progress.notes });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save note.' });
  }
});

// 5. Mark Coding Problem Solved
router.post('/coding-solved', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { problemId } = req.body;
    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required.' });
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) progress = new UserProgress({ userId: req.user!._id });

    if (!progress.codingSolved.includes(problemId)) {
      progress.codingSolved.push(problemId);
      updateStreakOnActivity(progress);
      await progress.save();
    }

    return res.json({ success: true, codingSolved: progress.codingSolved });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to record solved problem.' });
  }
});

// 6. Toggle Daily Task Completion
router.post('/task/toggle', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required.' });
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = new UserProgress({
        userId: req.user!._id,
        completedTasks: [],
        streak: { currentStreak: 0, longestStreak: 0, lastActivityDate: '', activityDates: [] },
      });
    }

    if (!Array.isArray(progress.completedTasks)) {
      progress.completedTasks = [];
    }

    const index = progress.completedTasks.indexOf(taskId);
    let isCompleted = false;
    if (index > -1) {
      progress.completedTasks.splice(index, 1);
    } else {
      progress.completedTasks.push(taskId);
      isCompleted = true;
      updateStreakOnActivity(progress);
    }

    progress.lastActivityAt = new Date();
    await progress.save();

    return res.json({
      success: true,
      taskId,
      isCompleted,
      completedTasks: progress.completedTasks,
      streak: progress.streak,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to toggle daily task.' });
  }
});

// 7. Save Initial Diagnostic Assessment & Analysis to MongoDB
router.post('/assessment', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { assessmentResult, answers, skills, preparationGoals } = req.body;
    if (!assessmentResult) {
      return res.status(400).json({ error: 'Assessment result data is required.' });
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = new UserProgress({ userId: req.user!._id });
    }

    progress.assessmentResult = assessmentResult;
    if (answers) {
      progress.assessmentAnswers = answers;
    }

    updateStreakOnActivity(progress);
    await progress.save();

    // Mark user as onboarded in User collection
    const user = req.user!;
    user.onboarded = true;
    if (skills && Array.isArray(skills)) {
      user.skills = skills;
    }
    if (preparationGoals && Array.isArray(preparationGoals)) {
      user.preparationGoals = preparationGoals;
    }
    await user.save();

    return res.json({
      success: true,
      message: 'Assessment results and personalized plan saved successfully.',
      assessmentResult: progress.assessmentResult,
      onboarded: true,
    });
  } catch (err: any) {
    console.error('[NEXORA Assessment] Save error:', err);
    return res.status(500).json({ error: err.message || 'Failed to save assessment.' });
  }
});

export default router;

