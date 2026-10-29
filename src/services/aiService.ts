export interface InterviewFeedbackResponse {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  relevanceScore: number;
  strongPoints?: string[];
  improvementAreas?: string[];
  whatWasCorrect?: string[];
  whatWasMissing?: string[];
  conceptualMistakes?: string[];
  keyConceptsToMention?: string[];
  modelAnswer: string;
  sampleAnswer?: string;
  strengths?: string;
  improvements?: string;
  recommendation?: string;
  advice?: string;
  isAiPowered?: boolean;
}

export interface ResumeEnhanceResponse {
  improvedText: string;
  bulletPoints: string[];
  tips: string[];
  isAiPowered?: boolean;
}

export interface PersonalizedAdviceResponse {
  mentorSummary: string;
  immediatePriorities: string[];
  weeklyMilestone: string;
  interviewTip: string;
  isAiPowered?: boolean;
}

export const aiService = {
  // Evaluates candidate's written or spoken interview response
  async evaluateInterviewAnswer(params: {
    role: string;
    question: string;
    answer: string;
    category: string;
    difficulty: string;
  }): Promise<InterviewFeedbackResponse> {
    try {
      const res = await fetch('/api/ai/interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.feedback) {
          return {
            ...data.feedback,
            isAiPowered: data.aiPowered ?? false,
          };
        }
      }
    } catch (e) {
      console.warn('Backend interview evaluation unavailable, falling back to local evaluation:', e);
    }

    // Local smart heuristic fallback
    const wordCount = params.answer.trim().split(/\s+/).length;
    let base = 68;
    if (wordCount >= 45) base += 18;
    else if (wordCount >= 25) base += 10;
    else if (wordCount < 15) base -= 15;

    const technicalScore = Math.min(95, Math.max(50, base + (params.category.includes('Technical') ? 4 : 0)));
    const communicationScore = Math.min(95, Math.max(45, base + (wordCount >= 35 ? 6 : -6)));
    const relevanceScore = Math.min(95, Math.max(50, base));
    const overallScore = Math.round((technicalScore * 0.4) + (communicationScore * 0.3) + (relevanceScore * 0.3));

    return {
      overallScore,
      technicalScore,
      communicationScore,
      relevanceScore,
      whatWasCorrect: [
        'Addressed the key principles of the question directly',
        wordCount >= 25 ? 'Used appropriate technical terminology and clear sentence structure' : 'Understood the core prompt requirement',
      ],
      whatWasMissing: [
        wordCount < 40 ? 'Explicit edge cases, production scale considerations, or failure modes' : 'Comparative performance benchmarks',
        'Direct connection to an academic or personal software project',
      ],
      conceptualMistakes: [
        wordCount < 20 ? 'Answer was excessively concise; recruiters evaluate confidence and conceptual depth' : 'Ensure definitions are strictly differentiated from related terminology',
      ],
      keyConceptsToMention: ['Complexity Analysis', 'Trade-offs', 'Scalability', 'STAR Framework'],
      modelAnswer: `For "${params.question}", open with a precise definition, explain the internal operational mechanism or decision trade-off, and ground your answer with a concrete engineering example from your coursework or projects.`,
      recommendation: 'Review this concept on your NEXORA Roadmap and practice articulating the trade-offs out loud.',
      isAiPowered: false,
    };
  },

  // Enhances resume bullet points with quantified verbs & metrics
  async enhanceResumeSection(params: {
    text: string;
    targetRole: string;
    section: string;
  }): Promise<ResumeEnhanceResponse> {
    try {
      const res = await fetch('/api/ai/resume-improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          return {
            ...data.data,
            isAiPowered: data.aiPowered ?? false,
          };
        }
      }
    } catch (e) {
      console.warn('Backend resume improve unavailable, using smart local rewriter:', e);
    }

    // Local fallback
    const lines = params.text.split('\n').filter((l) => l.trim().length > 0);
    const bullets = lines.map((line) => {
      let cleaned = line.replace(/^[-•*]\s*/, '').trim();
      if (!cleaned.match(/^[A-Z][a-z]+ed\b/)) {
        cleaned = 'Spearheaded and engineered ' + cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
      }
      if (!cleaned.endsWith('.')) cleaned += '.';
      return cleaned;
    });

    return {
      improvedText: bullets.join('\n'),
      bulletPoints: bullets.length > 0 ? bullets : [
        'Architected robust full-stack modules improving page responsiveness by 32%.',
        'Streamlined database queries reducing roundtrip latency from 450ms to 95ms.',
      ],
      tips: [
        'Recruiters look for the Google XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].',
        'Avoid passive phrases like "Responsible for" or "Helped with".',
      ],
      isAiPowered: false,
    };
  },

  // Generates personalized strategic advice
  async getPersonalizedAdvice(params: {
    profile: any;
    assessmentResults: any;
  }): Promise<PersonalizedAdviceResponse> {
    try {
      const res = await fetch('/api/ai/personalized-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.advice) {
          return {
            ...data.advice,
            isAiPowered: data.aiPowered ?? false,
          };
        }
      }
    } catch (e) {
      console.warn('Backend advice unavailable, using local strategy generator:', e);
    }

    const weak = params.assessmentResults?.weakAreas?.[0] || 'Data Structures';
    const strength = params.assessmentResults?.strengths?.[0] || 'Logical Reasoning';

    return {
      mentorSummary: `You exhibit great instincts in ${strength}. Prioritize closing the gap in ${weak} over the next 14 days to maximize your interview clearance rate.`,
      immediatePriorities: [
        `Solve 12 focused practice challenges in ${weak}`,
        'Complete two 20-minute timed quantitative aptitude mock tests',
        'Practice articulating your technical projects aloud using the STAR method',
      ],
      weeklyMilestone: `Reach 80%+ accuracy in ${weak} assessments by this weekend.`,
      interviewTip: 'Always clarify constraints with your interviewer before jumping directly into code.',
      isAiPowered: false,
    };
  },
};
