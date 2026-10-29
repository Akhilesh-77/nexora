import { Router } from 'express';
import mongoose from 'mongoose';
import { Question } from '../models/Question';
import { UserProgress } from '../models/UserProgress';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 1. Generate randomized quiz from database (Hiding correct answer & explanation)
router.post('/generate', async (req, res): Promise<any> => {
  try {
    const { branch, subject, topic, role, difficulty, length = 10 } = req.body;
    const quizLength = Math.max(1, Math.min(50, Number(length) || 10));

    const matchQuery: Record<string, any> = {};

    // 1. Subject matching takes priority (allows students of any branch to study any engineering subject)
    if (subject && subject !== 'All') {
      matchQuery.subject = { $regex: escapeRegex(subject), $options: 'i' };
    } else if (branch && branch !== 'All') {
      matchQuery.$or = [
        { branch: { $regex: escapeRegex(branch), $options: 'i' } },
        { branch: 'All' },
        { branch: 'General' },
      ];
    }

    // 2. Topic matching if specified
    if (topic && topic !== 'All') {
      matchQuery.topic = { $regex: escapeRegex(topic), $options: 'i' };
    }

    // 3. Difficulty matching
    if (difficulty && difficulty !== 'All') {
      matchQuery.difficulty = difficulty;
    }

    let totalAvailable = await Question.countDocuments(matchQuery);

    // If exact difficulty has fewer questions than requested, relax difficulty to ensure a full quiz
    let questionsToSample = matchQuery;
    if (totalAvailable < quizLength && difficulty && difficulty !== 'All') {
      const relaxedQuery = { ...matchQuery };
      delete relaxedQuery.difficulty;
      const relaxedCount = await Question.countDocuments(relaxedQuery);
      if (relaxedCount > totalAvailable) {
        questionsToSample = relaxedQuery;
        totalAvailable = relaxedCount;
      }
    }

    if (totalAvailable === 0) {
      // Fallback: If no match at all, check if subject exists in any form
      const anySubjectMatch = subject && subject !== 'All' 
        ? await Question.countDocuments({ subject: { $regex: escapeRegex(subject.split(' ')[0]), $options: 'i' } })
        : 0;
      
      if (anySubjectMatch > 0) {
        questionsToSample = { subject: { $regex: escapeRegex(subject.split(' ')[0]), $options: 'i' } };
        totalAvailable = anySubjectMatch;
      } else {
        return res.status(200).json({
          success: true,
          questions: [],
          totalQuestions: 0,
          availableCount: 0,
          message: 'No questions currently found matching this filter combination. Please select another subject or difficulty.',
        });
      }
    }

    const sampleSize = Math.min(quizLength, totalAvailable);

    // Randomize selection without duplicates using $sample
    const sampledQuestions = await Question.aggregate([
      { $match: questionsToSample },
      { $sample: { size: sampleSize } },
      {
        $project: {
          _id: 1,
          branch: 1,
          subject: 1,
          topic: 1,
          difficulty: 1,
          question: 1,
          options: 1,
          hints: 1,
          tags: 1,
          // CRITICAL: correctIndex and explanation omitted to prevent cheating!
        },
      },
    ]);

    return res.json({
      success: true,
      questions: sampledQuestions,
      totalQuestions: sampledQuestions.length,
      availableCount: totalAvailable,
      message:
        totalAvailable < quizLength
          ? `Selected all ${totalAvailable} available questions for this category.`
          : undefined,
    });
  } catch (err: any) {
    console.error('[NEXORA Quiz] Generation error:', err);
    return res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

// 2. Submit quiz answers - Graded securely on server & saved to user progress
router.post('/submit', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { branch, subject, topic, role, difficulty, answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers object is required.' });
    }

    const questionIds = Object.keys(answers).filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (questionIds.length === 0) {
      return res.status(400).json({ error: 'No valid questions were submitted for grading.' });
    }

    // Fetch the ground-truth questions from DB
    const dbQuestions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(dbQuestions.map((q) => [q._id.toString(), q]));

    let correctCount = 0;
    const evaluatedAnswers: any[] = [];

    for (const qId of questionIds) {
      const dbQ = questionMap.get(qId);
      if (!dbQ) continue;

      const selectedOption = answers[qId];
      const isCorrect = selectedOption === dbQ.correctIndex;
      if (isCorrect) correctCount++;

      evaluatedAnswers.push({
        questionId: qId,
        questionText: dbQ.question,
        selectedOption: selectedOption !== undefined ? selectedOption : -1,
        correctOption: dbQ.correctIndex,
        isCorrect,
        explanation: dbQ.explanation,
      });
    }

    const totalQuestions = evaluatedAnswers.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const attemptId = 'quiz-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    // Save attempt to user's MongoDB progress
    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = new UserProgress({ userId: req.user!._id });
    }

    const newAttempt = {
      id: attemptId,
      branch: branch || 'General',
      subject: subject || 'General Assessment',
      topic: topic || 'Mixed Topics',
      role: role || req.user?.targetRole || 'All',
      difficulty: difficulty || 'Medium',
      score,
      totalQuestions,
      correctCount,
      answers: evaluatedAnswers,
      completedAt: new Date(),
    };

    progress.quizAttempts.unshift(newAttempt as any);

    // Update streak based on real dates
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

    await progress.save();

    return res.json({
      success: true,
      attemptId,
      score,
      correctCount,
      totalQuestions,
      answers: evaluatedAnswers,
      completedAt: newAttempt.completedAt,
      streak: progress.streak,
    });
  } catch (err: any) {
    console.error('[NEXORA Quiz] Submission error:', err);
    return res.status(500).json({ error: 'Server error while calculating quiz results.' });
  }
});

// 3. Get User's Quiz History
router.get('/history', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const progress = await UserProgress.findOne({ userId: req.user!._id });
    const attempts = progress?.quizAttempts || [];
    return res.json({
      success: true,
      attempts,
      totalAttempts: attempts.length,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve quiz history.' });
  }
});

export default router;

