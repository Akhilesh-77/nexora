import { Router } from 'express';
import { UserProgress } from '../models/UserProgress';
import { LearningModule } from '../models/LearningModule';
import { RoleCatalogue } from '../models/RoleCatalogue';
import { Question } from '../models/Question';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Optional Google GenAI instance if API key is provided
let GoogleGenAI: any = null;
try {
  if (process.env.GEMINI_API_KEY) {
    const genaiModule = await import('@google/genai');
    GoogleGenAI = genaiModule.GoogleGenAI;
  }
} catch (e) {
  // Graceful fallback to deterministic rule-based intelligence
}

router.post('/query', requireAuth, async (req: AuthRequest, res): Promise<any> => {
  try {
    const message = req.body.message || req.body.query;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Query message is required.' });
    }

    const user = req.user!;
    const progress = await UserProgress.findOne({ userId: user._id });
    const targetRole = user.targetRole || 'Software Developer';
    const branch = user.branch || 'Computer Science and Engineering';

    const q = message.trim().toLowerCase();

    // -------------------------------------------------------------------
    // Strategy A: If optional Gemini API Key is configured and online, attempt model response
    // -------------------------------------------------------------------
    if (process.env.GEMINI_API_KEY && GoogleGenAI) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `You are NEXORA AI, an intelligent engineering career mentor and placement prep assistant.
The student is studying "${branch}" and targeting the role "${targetRole}".
Provide concise, technically precise, encouraging answers.
Cover concept explanations, algorithms, system design, or interview strategies.
Keep explanations under 200 words. Always format with clear markdown bullets.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\nStudent question: ${message}`,
        });

        if (response && response.text) {
          // Detect navigation action
          let actionPage: string | undefined = undefined;
          if (q.includes('roadmap')) actionPage = 'roadmap';
          else if (q.includes('interview') || q.includes('mock')) actionPage = 'interview';
          else if (q.includes('coding') || q.includes('code') || q.includes('dsa')) actionPage = 'coding';
          else if (q.includes('aptitude') || q.includes('quiz') || q.includes('practice')) actionPage = 'practice';
          else if (q.includes('resume') || q.includes('cv')) actionPage = 'resume';

          return res.json({
            success: true,
            reply: response.text,
            actionPage,
            assistantType: 'Advanced AI Engine (Gemini)',
            isModelPowered: true,
          });
        }
      } catch (aiErr: any) {
        console.warn('[NEXORA Assistant] AI model unavailable, falling back to deterministic engine:', aiErr.message);
      }
    }

    // -------------------------------------------------------------------
    // Strategy B: Deterministic Intelligence Engine
    // -------------------------------------------------------------------

    // 1. "What should I study next?"
    if (q.includes('study next') || q.includes('what next') || q.includes('recommend study') || q.includes('what should i do')) {
      const completed = progress?.completedLessons || [];
      const pendingModules = await LearningModule.find({
        branch: new RegExp(branch.split(' ')[0], 'i'),
        moduleId: { $nin: completed },
      }).sort({ order: 1 }).limit(3);

      if (pendingModules.length > 0) {
        const nextMod = pendingModules[0];
        return res.json({
          reply: `Based on your **${branch}** curriculum and target role (**${targetRole}**), here is your highest-priority next lesson:

📖 **${nextMod.title}** (${nextMod.subject})
• **Estimated Time:** ${nextMod.estimatedMinutes} mins • **Difficulty:** ${nextMod.difficulty}

> ${nextMod.conceptIntroduction.slice(0, 220)}...

*Action:* Jump to the Learning Studio to study this topic and take its interactive knowledge check.`,
          actionPage: 'learning-studio',
          actionPayload: nextMod.moduleId,
          assistantType: 'Deterministic Rule-Based Intelligence',
        });
      } else {
        return res.json({
          reply: `Outstanding work! You have completed foundational modules in **${branch}**. I recommend taking a timed Quiz in the Practice Lab to solidify your retention.`,
          actionPage: 'practice',
          assistantType: 'Deterministic Rule-Based Intelligence',
        });
      }
    }

    // 2. "Show my progress" / "How am I doing?"
    if (q.includes('my progress') || q.includes('how am i doing') || q.includes('my stats') || q.includes('score')) {
      const lessonsCount = progress?.completedLessons.length || 0;
      const quizzesCount = progress?.quizAttempts.length || 0;
      const streak = progress?.streak.currentStreak || 0;
      const codingCount = progress?.codingSolved.length || 0;

      let avgScore = 'Not assessed yet';
      if (quizzesCount > 0) {
        const sum = progress!.quizAttempts.reduce((acc, curr) => acc + curr.score, 0);
        avgScore = `${Math.round(sum / quizzesCount)}%`;
      }

      return res.json({
        reply: `Here is your verified preparation summary from your database:
• **Lessons Completed:** ${lessonsCount}
• **Quizzes Taken:** ${quizzesCount}
• **Average Quiz Score:** ${avgScore}
• **Coding Problems Solved:** ${codingCount}
• **Active Study Streak:** ${streak} day(s) 🔥
• **Target Career Role:** ${targetRole}`,
        actionPage: 'overview',
        assistantType: 'Deterministic Rule-Based Intelligence',
      });
    }

    // 3. "Recommend practice for my role"
    if (q.includes('practice for my role') || q.includes('role practice') || q.includes('skills')) {
      const roleDoc = await RoleCatalogue.findOne({
        $or: [{ title: new RegExp(targetRole, 'i') }, { roleId: new RegExp(targetRole, 'i') }],
      });

      const skills = roleDoc?.requiredSkills.slice(0, 5).join(', ') || 'Core Algorithms, System Design, Aptitude';
      return res.json({
        reply: `For your target role **${targetRole}**, placement technical rounds evaluate:
1. **Core Competencies:** ${skills}
2. **Coding Speed:** Practice timed problem-solving in the Coding Lab.
3. **Interview Articulation:** Use the STAR framework in Interview Studio.`,
        actionPage: 'practice',
        assistantType: 'Deterministic Rule-Based Intelligence',
      });
    }

    // 4. "Help me prepare for an interview"
    if (q.includes('interview') || q.includes('mock interview') || q.includes('interview prep') || q.includes('hr')) {
      return res.json({
        reply: `In the **Interview Studio**, you can:
• Practice role-specific questions for **${targetRole}**.
• Answer questions aloud using Speech-to-Text.
• Get instant feedback on your answers (STAR framework, technical terms, model responses).`,
        actionPage: 'interview',
        assistantType: 'Deterministic Rule-Based Intelligence',
      });
    }

    // 5. "Help me improve my resume"
    if (q.includes('resume') || q.includes('cv') || q.includes('ats')) {
      return res.json({
        reply: `In the **Resume Studio**, you can:
• Build a 1-page ATS-friendly engineering resume.
• Enhance project bullets using the Google XYZ formula: *Accomplished [X] measured by [Y] doing [Z]*.
• Export a clean, print-ready PDF.`,
        actionPage: 'resume',
        assistantType: 'Deterministic Rule-Based Intelligence',
      });
    }

    // 6. Search Question Bank for direct questions or topics
    const matchedQuestion = await Question.findOne({
      $or: [
        { question: { $regex: q.replace(/what is|explain|tell me about|how does/g, '').trim(), $options: 'i' } },
        { topic: { $regex: q.replace(/what is|explain|tell me about|how does/g, '').trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(q.replace(/what is|explain|tell me about/g, '').trim(), 'i')] } },
      ],
    });

    if (matchedQuestion) {
      return res.json({
        reply: `**${matchedQuestion.subject} — ${matchedQuestion.topic}** (${matchedQuestion.difficulty}):
**Question:** ${matchedQuestion.question}

💡 **Explanation:**
${matchedQuestion.explanation}

*Try more questions like this in the Practice Lab!*`,
        actionPage: 'practice',
        assistantType: 'Deterministic Rule-Based Intelligence',
      });
    }

    // 7. Search Learning Modules for matching topics
    const cleanTerm = q.replace(/what is|explain|tell me about|how does/g, '').trim();
    if (cleanTerm.length > 3) {
      const matchedModule = await LearningModule.findOne({
        $or: [
          { title: { $regex: cleanTerm, $options: 'i' } },
          { subject: { $regex: cleanTerm, $options: 'i' } },
        ],
      });

      if (matchedModule) {
        return res.json({
          reply: `**${matchedModule.title}** (${matchedModule.subject}):
${matchedModule.simpleDefinition}

**Key Principles:**
${matchedModule.detailedExplanation.slice(0, 320)}...

*Review worked examples and knowledge checks in Learning Studio.*`,
          actionPage: 'learning-studio',
          actionPayload: matchedModule.moduleId,
          assistantType: 'Deterministic Rule-Based Intelligence',
        });
      }
    }

    // Default Guidance Response
    return res.json({
      reply: `I am your NEXORA career mentor with continuous progress tracking.

You can ask me:
• *"What should I study next?"*
• *"Show my progress and streak"*
• *"Recommend practice for ${targetRole}"*
• *"Explain deadlock / virtual memory / Carnot cycle"*
• *"Prepare me for my technical interview"*`,
      assistantType: 'Deterministic Rule-Based Intelligence',
    });
  } catch (err: any) {
    console.error('[NEXORA Assistant] Query error:', err);
    return res.status(500).json({ error: 'Failed to process assistant query.' });
  }
});

export default router;
