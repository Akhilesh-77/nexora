import { Router } from 'express';
import { LearningModule } from '../models/LearningModule';

const router = Router();

// 1. Get modules list with optional branch/subject filters
router.get('/', async (req, res): Promise<any> => {
  try {
    const { branch, subject, search } = req.query;
    const filter: Record<string, any> = {};

    if (branch && branch !== 'All') {
      filter.branch = new RegExp(`^${branch}$`, 'i');
    }

    if (subject && subject !== 'All') {
      filter.subject = new RegExp(`^${subject}$`, 'i');
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { title: { $regex: term, $options: 'i' } },
        { subject: { $regex: term, $options: 'i' } },
        { conceptIntroduction: { $regex: term, $options: 'i' } },
      ];
    }

    const modules = await LearningModule.find(filter)
      .select('moduleId branch subject title estimatedMinutes difficulty order')
      .sort({ order: 1, title: 1 });

    return res.json({
      success: true,
      count: modules.length,
      modules,
    });
  } catch (err: any) {
    console.error('[NEXORA Modules] List error:', err);
    return res.status(500).json({ error: 'Failed to retrieve learning modules.' });
  }
});

// 2. Get full details of a specific module
router.get('/:moduleId', async (req, res): Promise<any> => {
  try {
    const { moduleId } = req.params;
    const mod = await LearningModule.findOne({ moduleId });

    if (!mod) {
      return res.status(404).json({ error: 'Learning module not found.' });
    }

    return res.json({
      success: true,
      module: mod,
    });
  } catch (err: any) {
    console.error('[NEXORA Modules] Detail error:', err);
    return res.status(500).json({ error: 'Failed to fetch learning module.' });
  }
});

// 3. Get distinct branches & subjects for navigation
router.get('/meta/categories', async (req, res): Promise<any> => {
  try {
    const branches = await LearningModule.distinct('branch');
    const subjects = await LearningModule.distinct('subject');
    return res.json({
      success: true,
      branches,
      subjects,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve metadata.' });
  }
});

export default router;

