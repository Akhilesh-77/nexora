import { Router } from 'express';
import { UserProgress } from '../models/UserProgress';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// 1. Get authenticated user's saved resume data
router.get('/', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress || !progress.resumeData) {
      return res.json({
        success: true,
        resumeData: null,
      });
    }

    return res.json({
      success: true,
      resumeData: progress.resumeData,
    });
  } catch (err: any) {
    console.error('[NEXORA Resume] Get error:', err);
    return res.status(500).json({ error: 'Failed to retrieve resume data.' });
  }
});

// 2. Save or update resume data in MongoDB
router.post('/save', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data payload is required.' });
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = new UserProgress({ userId: req.user!._id });
    }

    progress.resumeData = resumeData;
    progress.lastActivityAt = new Date();
    await progress.save();

    return res.json({
      success: true,
      message: 'Resume saved to database successfully.',
      resumeData: progress.resumeData,
    });
  } catch (err: any) {
    console.error('[NEXORA Resume] Save error:', err);
    return res.status(500).json({ error: 'Failed to save resume data.' });
  }
});

export default router;

