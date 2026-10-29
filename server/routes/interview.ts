import { Router } from 'express';
import { UserProgress } from '../models/UserProgress';
import { RoleCatalogue } from '../models/RoleCatalogue';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Evaluate candidate answer using transparent rule-based criteria
function evaluateAnswerRuleBased(
  role: string,
  category: string,
  question: string,
  answer: string
) {
  const cleanAnswer = answer.trim();
  const words = cleanAnswer.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // 1. Communication & Length score
  let commScore = 65;
  if (wordCount >= 60) commScore = 90;
  else if (wordCount >= 35) commScore = 80;
  else if (wordCount >= 20) commScore = 70;
  else if (wordCount < 12) commScore = 45;

  // 2. Technical concepts check based on question keywords
  const qLower = question.toLowerCase();
  const aLower = cleanAnswer.toLowerCase();

  // Identify expected concept domains
  const techKeyTerms: Record<string, string[]> = {
    complexity: ['o(n)', 'o(1)', 'o(log n)', 'time complexity', 'space complexity', 'runtime', 'memory'],
    database: ['acid', 'index', 'primary key', 'foreign key', 'normalization', 'transaction', 'query', 'sql', 'nosql'],
    network: ['tcp', 'udp', 'handshake', 'latency', 'bandwidth', 'packet', 'http', 'https', 'header'],
    os: ['process', 'thread', 'deadlock', 'mutex', 'semaphore', 'virtual memory', 'paging', 'context switch'],
    architecture: ['scalability', 'microservices', 'load balancer', 'cache', 'trade-off', 'throughput', 'availability'],
    mechanical: ['stress', 'strain', 'thermodynamics', 'entropy', 'efficiency', 'tolerance', 'cad', 'fatigue'],
    electronics: ['baud', 'clock', 'frequency', 'voltage', 'current', 'sampling', 'nyquist', 'impedance', 'adc'],
    chemical: ['mass transfer', 'heat transfer', 'kinetics', 'catalyst', 'distillation', 'reactor', 'stoichiometry'],
    civil: ['shear force', 'bending moment', 'concrete', 'foundation', 'reinforcement', 'load bearing', 'deflection'],
  };

  let matchedDomainTerms: string[] = [];
  let domainKey = 'general';
  for (const [key, terms] of Object.entries(techKeyTerms)) {
    if (terms.some((t) => qLower.includes(t))) {
      domainKey = key;
      matchedDomainTerms = terms.filter((t) => aLower.includes(t));
      break;
    }
  }

  let technicalScore = 60;
  if (matchedDomainTerms.length >= 3) technicalScore = 92;
  else if (matchedDomainTerms.length >= 2) technicalScore = 82;
  else if (matchedDomainTerms.length === 1) technicalScore = 72;
  else if (wordCount >= 30) technicalScore = 68;

  // Relevance calculation
  const questionWords = qLower
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4);
  const matchedQuestionWords = questionWords.filter((w) => aLower.includes(w));
  const relevanceRatio = questionWords.length > 0 ? matchedQuestionWords.length / questionWords.length : 0.5;
  const relevanceScore = Math.min(95, Math.max(50, Math.round(50 + relevanceRatio * 45)));

  const overallScore = Math.round(technicalScore * 0.45 + commScore * 0.3 + relevanceScore * 0.25);

  const whatWasCorrect = [
    'Addressed the prompt directly with coherent paragraph structure',
    wordCount >= 25
      ? 'Demonstrated relevant technical context and domain terminology'
      : 'Identified the primary premise of the interview question',
  ];

  if (matchedDomainTerms.length > 0) {
    whatWasCorrect.push(`Integrated key engineering concepts: ${matchedDomainTerms.slice(0, 3).join(', ')}`);
  }

  const whatWasMissing = [
    wordCount < 40
      ? 'Practical production considerations, scale implications, or real edge cases'
      : 'Explicit discussion of engineering trade-offs (e.g. latency vs memory)',
    'Concrete example drawn from an academic project, internship, or lab sprint',
  ];

  const conceptualMistakes = [
    wordCount < 15
      ? 'Response is very brief; technical interviewers look for depth, rationale, and reasoning'
      : 'Ensure you clearly differentiate theoretical textbook definitions from practical system limitations',
  ];

  const keyConceptsToMention = matchedDomainTerms.length > 0
    ? matchedDomainTerms.concat(['Trade-offs', 'Scalability', 'STAR Framework'])
    : ['Foundational Definition', 'Underlying Mechanics', 'Failure Modes & Edge Cases', 'STAR Framework'];

  const modelAnswer = `When answering "${question}", structure your response using the 3-part framework:\n1. Core Definition: Clearly state what the concept is and its primary objective.\n2. Underlying Mechanics & Trade-offs: Explain how it operates internally and where it fails or incurs performance costs.\n3. Concrete Example: Relate to a real project implementation (e.g. "In my distributed messaging project, we chose this approach to reduce memory pressure by 25%...")`;

  return {
    evaluator: 'NEXORA Rule-Based Diagnostic Evaluator',
    aiPowered: false,
    overallScore,
    technicalScore,
    communicationScore: commScore,
    relevanceScore,
    whatWasCorrect,
    whatWasMissing,
    conceptualMistakes,
    keyConceptsToMention,
    modelAnswer,
    recommendation:
      'Structure future answers with Definition -> Mechanics -> Trade-off -> Example. Review the corresponding topic module in Learning Studio.',
  };
}

// 1. Submit single interview answer for evaluation
router.post('/evaluate-answer', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { role, category, question, answer, sessionId } = req.body;

    if (!question || !answer || !answer.trim()) {
      return res.status(400).json({ error: 'Question and candidate answer are required.' });
    }

    const feedback = evaluateAnswerRuleBased(
      role || req.user?.targetRole || 'Software Developer',
      category || 'Technical',
      question,
      answer
    );

    // If sessionId provided, persist into UserProgress
    if (sessionId) {
      let progress = await UserProgress.findOne({ userId: req.user!._id });
      if (progress) {
        let session = progress.interviewSessions.find((s) => s.id === sessionId);
        if (!session) {
          session = {
            id: sessionId,
            targetRole: role || req.user?.targetRole || 'Software Developer',
            roundType: category || 'Technical',
            difficulty: 'Intermediate',
            overallScore: feedback.overallScore,
            technicalScore: feedback.technicalScore,
            communicationScore: feedback.communicationScore,
            messages: [],
            feedback,
            completedAt: new Date(),
          };
          progress.interviewSessions.unshift(session);
        } else {
          session.overallScore = feedback.overallScore;
          session.technicalScore = feedback.technicalScore;
          session.communicationScore = feedback.communicationScore;
          session.feedback = feedback;
          session.completedAt = new Date();
        }
        await progress.save();
      }
    }

    return res.json({
      success: true,
      feedback,
    });
  } catch (err: any) {
    console.error('[NEXORA Interview] Evaluation error:', err);
    return res.status(500).json({ error: 'Failed to evaluate interview answer.' });
  }
});

// 2. Get questions for role & category
router.get('/questions', async (req, res): Promise<any> => {
  try {
    const { role, category } = req.query;
    const roleDoc = await RoleCatalogue.findOne({
      $or: [
        { roleId: role },
        { title: new RegExp(`^${role}$`, 'i') },
      ],
    });

    if (roleDoc) {
      const techQs = roleDoc.technicalInterviewQuestions.map((q) => ({
        question: q.question,
        category: 'Technical',
        guidance: q.answerGuidance,
        keywords: q.keywords,
      }));
      const behavQs = roleDoc.behavioralInterviewQuestions.map((q) => ({
        question: q.question,
        category: 'Behavioral & HR',
        guidance: `Answer using the STAR framework focusing on ${q.starFocus}`,
        keywords: ['STAR Framework', 'Situation', 'Task', 'Action', 'Result'],
      }));

      const questions = category === 'Behavioral' ? behavQs : category === 'Technical' ? techQs : [...techQs, ...behavQs];
      return res.json({ success: true, count: questions.length, questions });
    }

    // Default general technical and behavioral questions
    const fallbackQuestions = [
      {
        question: 'Explain the difference between a process and a thread, and how context switching affects performance.',
        category: 'Technical',
        guidance: 'Define address space isolation, PCB/TCB overhead, and CPU cache invalidation.',
        keywords: ['Address Space', 'Context Switch', 'Cache Invalidation', 'Concurrency'],
      },
      {
        question: 'Tell me about a challenging technical bug you encountered in a project and how you resolved it.',
        category: 'Behavioral & HR',
        guidance: 'Use Situation, Task, Action, Result. Emphasize your systematic debugging process.',
        keywords: ['Root Cause', 'Profiling', 'Testing', 'STAR Method'],
      },
      {
        question: 'How do database indexes improve query speeds, and what is the trade-off incurred on write operations?',
        category: 'Technical',
        guidance: 'Mention B-Trees, page lookups, disk I/O, and write amplification during INSERT/UPDATE.',
        keywords: ['B-Tree', 'Disk I/O', 'Write Amplification', 'Index Maintenance'],
      },
      {
        question: 'How do you handle disagreement with a teammate regarding technical architecture or code design?',
        category: 'Behavioral & HR',
        guidance: 'Demonstrate objective trade-off evaluation, prototyping, benchmarks, and respectful consensus.',
        keywords: ['Trade-offs', 'Collaboration', 'Data-driven', 'Active Listening'],
      },
    ];

    return res.json({ success: true, count: fallbackQuestions.length, questions: fallbackQuestions });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch interview questions.' });
  }
});

// 3. Save completed interview session
router.post('/save-session', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { session } = req.body;
    if (!session || !session.id) {
      return res.status(400).json({ error: 'Session data is required.' });
    }

    let progress = await UserProgress.findOne({ userId: req.user!._id });
    if (!progress) {
      progress = new UserProgress({ userId: req.user!._id });
    }

    const sessionDoc = {
      id: session.id,
      targetRole: session.targetRole || req.user?.targetRole || 'Software Developer',
      roundType: session.type || 'Technical',
      difficulty: session.difficulty || 'Intermediate',
      overallScore: session.finalFeedback?.overallScore ?? 75,
      technicalScore: session.finalFeedback?.technicalScore ?? 75,
      communicationScore: session.finalFeedback?.communicationScore ?? 75,
      messages: session.messages || [],
      feedback: session.finalFeedback,
      completedAt: new Date(),
    };

    const existingIdx = progress.interviewSessions.findIndex((s) => s.id === session.id);
    if (existingIdx >= 0) {
      progress.interviewSessions[existingIdx] = sessionDoc;
    } else {
      progress.interviewSessions.unshift(sessionDoc);
    }

    // Update streak on dated activity
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
    return res.json({ success: true, session: sessionDoc, streak: progress.streak });
  } catch (err: any) {
    console.error('[NEXORA Interview] Save session error:', err);
    return res.status(500).json({ error: 'Failed to save interview session.' });
  }
});

// 4. Get User's Interview History
router.get('/history', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const progress = await UserProgress.findOne({ userId: req.user!._id });
    return res.json({
      success: true,
      sessions: progress?.interviewSessions || [],
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve interview history.' });
  }
});

export default router;
