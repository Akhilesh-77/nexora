import { Router } from 'express';

const router = Router();

// 1. Evaluate Interview Answer (Rule-Based, deterministic, domain-aware)
router.post('/interview-feedback', (req, res): any => {
  try {
    const { role = 'Software Developer', question = '', answer = '', category = 'Technical', difficulty = 'Intermediate' } = req.body;

    if (!question || !answer || !answer.trim()) {
      return res.status(400).json({ error: 'Question and answer are required.' });
    }

    const cleanAnswer = answer.trim();
    const words = cleanAnswer.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;

    // Word count & depth score
    let commScore = 60;
    if (wordCount >= 60) commScore = 92;
    else if (wordCount >= 35) commScore = 82;
    else if (wordCount >= 20) commScore = 72;
    else if (wordCount < 12) commScore = 48;

    // Domain keywords check
    const qLower = question.toLowerCase();
    const aLower = cleanAnswer.toLowerCase();

    const techKeyTerms: Record<string, string[]> = {
      complexity: ['o(n)', 'o(1)', 'o(log n)', 'time complexity', 'space complexity', 'runtime', 'memory', 'big-o'],
      database: ['acid', 'index', 'primary key', 'foreign key', 'normalization', 'transaction', 'query', 'sql', 'nosql', 'sharding'],
      network: ['tcp', 'udp', 'handshake', 'latency', 'bandwidth', 'packet', 'http', 'https', 'dns', 'osi'],
      os: ['process', 'thread', 'deadlock', 'mutex', 'semaphore', 'virtual memory', 'paging', 'context switch'],
      architecture: ['scalability', 'microservices', 'load balancer', 'cache', 'trade-off', 'throughput', 'availability', 'redis'],
      mechanical: ['stress', 'strain', 'thermodynamics', 'entropy', 'efficiency', 'tolerance', 'cad', 'fatigue', 'fea'],
      electronics: ['baud', 'clock', 'frequency', 'voltage', 'current', 'sampling', 'nyquist', 'impedance', 'adc', 'op-amp'],
      chemical: ['mass transfer', 'heat transfer', 'kinetics', 'catalyst', 'distillation', 'reactor', 'stoichiometry'],
      civil: ['shear force', 'bending moment', 'concrete', 'foundation', 'reinforcement', 'load bearing', 'deflection'],
      ml: ['gradient descent', 'loss function', 'overfitting', 'hyperparameters', 'precision', 'recall', 'feature engineering'],
    };

    let matchedDomainTerms: string[] = [];
    for (const [, terms] of Object.entries(techKeyTerms)) {
      const qHasTerm = terms.some((t) => qLower.includes(t));
      if (qHasTerm) {
        const found = terms.filter((t) => aLower.includes(t));
        matchedDomainTerms.push(...found);
      }
    }
    // Deduplicate
    matchedDomainTerms = Array.from(new Set(matchedDomainTerms));

    let technicalScore = 62;
    if (matchedDomainTerms.length >= 3) technicalScore = 94;
    else if (matchedDomainTerms.length >= 2) technicalScore = 84;
    else if (matchedDomainTerms.length === 1) technicalScore = 74;
    else if (wordCount >= 30) technicalScore = 68;

    // Relevance to question terms
    const questionWords = qLower
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 4);
    const matchedWords = questionWords.filter((w) => aLower.includes(w));
    const relevanceRatio = questionWords.length > 0 ? matchedWords.length / questionWords.length : 0.5;
    const relevanceScore = Math.min(95, Math.max(50, Math.round(52 + relevanceRatio * 44)));

    const overallScore = Math.round(technicalScore * 0.45 + commScore * 0.3 + relevanceScore * 0.25);

    const whatWasCorrect = [
      'Directly addressed the prompt with clear conceptual articulation.',
      wordCount >= 25
        ? 'Utilized appropriate engineering vocabulary and professional tone.'
        : 'Identified the core requirement of the interviewer question.',
    ];
    if (matchedDomainTerms.length > 0) {
      whatWasCorrect.push(`Correctly incorporated essential terminology: ${matchedDomainTerms.slice(0, 3).join(', ')}.`);
    }

    const whatWasMissing = [
      wordCount < 40
        ? 'Deepen production considerations, failure modes, or real boundary cases.'
        : 'Elaborate on architectural or performance trade-offs (e.g. latency vs. memory consumption).',
      'Ground your answer with an empirical example from a capstone project or lab sprint.',
    ];

    const conceptualMistakes = [
      wordCount < 18
        ? 'Response is very concise; interviewers look for rationale, trade-offs, and design intent.'
        : 'Ensure theoretical textbook definitions are clearly distinguished from production realities.',
    ];

    const keyConceptsToMention = matchedDomainTerms.length > 0
      ? [...matchedDomainTerms, 'Trade-off Analysis', 'Edge Cases', 'STAR Framework']
      : ['Fundamental Definition', 'Internal Mechanism', 'Failure Modes & Bottlenecks', 'STAR Framework'];

    const modelAnswer = `When answering "${question}", structure your response using the 3-part framework:\n1. Core Definition: Concisely define the concept and its primary objective.\n2. Internal Mechanics & Trade-offs: Walk through how it functions under the hood and its computational/physical trade-offs.\n3. Concrete Example: Reference a hands-on project or academic scenario demonstrating application.`;

    return res.json({
      success: true,
      aiPowered: false,
      feedback: {
        overallScore,
        technicalScore,
        communicationScore: commScore,
        relevanceScore,
        whatWasCorrect,
        whatWasMissing,
        conceptualMistakes,
        keyConceptsToMention,
        modelAnswer,
        recommendation: `Target ${role} competencies by practicing concise 3-part structured answers for ${category} rounds.`,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate interview feedback.' });
  }
});

// 2. Enhance Resume Section (Google XYZ Formula + Action Verbs)
router.post('/resume-improve', (req, res): any => {
  try {
    const { text = '', targetRole = 'Software Engineer', section = 'projects' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    const lines = text.split('\n').filter((l: string) => l.trim().length > 0);
    const actionVerbs = [
      'Architected',
      'Engineered',
      'Streamlined',
      'Implemented',
      'Spearheaded',
      'Optimized',
      'Formulated',
      'Accelerated',
      'Orchestrated',
      'Refactored',
    ];

    const improvedBullets: string[] = [];

    lines.forEach((line: string, idx: number) => {
      let cleaned = line.replace(/^[-•*]\s*/, '').trim();

      // Replace passive openings
      cleaned = cleaned.replace(/^(responsible for|worked on|helped in|assisted with|handled|did)\s+/i, '');

      // Pick an action verb
      const verb = actionVerbs[idx % actionVerbs.length];
      if (!cleaned.match(/^[A-Z][a-z]+ed\b/)) {
        cleaned = `${verb} ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
      }

      // Add metric if missing
      if (!cleaned.match(/\d+%/i) && !cleaned.match(/\d+x/i) && !cleaned.match(/\d+\s*(ms|users|queries|records)/i)) {
        const metrics = [
          'improving operational throughput by 28%',
          'reducing latency by 35% across key endpoints',
          'optimizing resource efficiency by 22%',
          'achieving 99.4% test coverage and zero regression bugs',
          'cutting processing overhead by 40%',
        ];
        const metric = metrics[idx % metrics.length];
        if (cleaned.endsWith('.')) {
          cleaned = cleaned.slice(0, -1);
        }
        cleaned = `${cleaned}, ${metric}.`;
      } else if (!cleaned.endsWith('.')) {
        cleaned += '.';
      }

      improvedBullets.push(cleaned);
    });

    if (improvedBullets.length === 0) {
      improvedBullets.push(
        `Architected high-throughput ${targetRole} application modules, reducing end-to-end response time by 34%.`,
        `Engineered robust data pipelines and automated unit testing suites, achieving 98% test coverage.`
      );
    }

    return res.json({
      success: true,
      aiPowered: false,
      data: {
        improvedText: improvedBullets.join('\n'),
        bulletPoints: improvedBullets,
        tips: [
          'Google XYZ Standard: Accomplished [X], as measured by [Y], by doing [Z].',
          'Always quantify outcomes using percentage gains, latency cuts, or throughput figures.',
          'Start each bullet with a strong past-tense action verb (Engineered, Architected, Spearheaded).',
        ],
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to enhance resume section.' });
  }
});

// 3. Personalized Placement Advice (Deterministic Mentorship Engine)
router.post('/personalized-advice', (req, res): any => {
  try {
    const { profile = {}, assessmentResults = {} } = req.body;

    const branch = profile.branch || 'Engineering';
    const targetRole = profile.targetRole || 'Software Engineer';
    const strengths = assessmentResults.strengths || ['Logical Reasoning'];
    const weakAreas = assessmentResults.weakAreas || ['System Architecture'];

    const primaryStrength = strengths[0] || 'Technical Foundations';
    const primaryWeakness = weakAreas[0] || 'Core Subject Depth';

    const immediatePriorities = [
      `Review foundational theory and practice 15 domain questions in ${primaryWeakness} via Learning Studio.`,
      `Attempt a 10-question timed practice quiz in ${targetRole} screening topics to build speed.`,
      `Refine your resume projects using quantified metrics and align them to ${branch} industry standards.`,
    ];

    const weeklyMilestone = `Clear 80%+ benchmark score on ${primaryWeakness} assessments by end of week.`;
    const interviewTip = `In ${targetRole} interviews, state assumptions clearly before beginning your technical problem solving.`;

    return res.json({
      success: true,
      aiPowered: false,
      advice: {
        mentorSummary: `Based on your diagnostic profile, your strongest aptitude is in ${primaryStrength}. Your highest-leverage area for immediate improvement is ${primaryWeakness}. Focusing 25 minutes daily on this topic will significantly elevate your placement screening rank.`,
        immediatePriorities,
        weeklyMilestone,
        interviewTip,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate personalized advice.' });
  }
});

export default router;

