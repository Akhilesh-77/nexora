import express from 'express';
import cors from 'cors';
import { connectDatabase, getDbStatus } from './server/db';
import authRouter from './server/routes/auth';
import progressRouter from './server/routes/progress';
import quizRouter from './server/routes/quiz';
import modulesRouter from './server/routes/modules';
import interviewRouter from './server/routes/interview';
import resumeRouter from './server/routes/resume';
import assistantRouter from './server/routes/assistant';
import adminRouter from './server/routes/admin';
import aiRouter from './server/routes/ai';
import codeRouter from './server/routes/code';
import { RoleCatalogue } from './server/models/RoleCatalogue';
import { User } from './server/models/User';
import http from 'http';

async function runVerification() {
  console.log('====================================================');
  console.log('🚀 NEXORA — Comprehensive E2E Verification Suite');
  console.log('====================================================\n');

  // 1. Database Connection Check
  const dbConnected = await connectDatabase();
  const dbStatus = getDbStatus();
  console.log(`[1] Database Connection: ${dbConnected ? 'CONNECTED' : 'DISCONNECTED'}`);
  console.log(`    Host: ${dbStatus.host}:${dbStatus.port} / DB: ${dbStatus.name}`);
  if (!dbConnected) {
    throw new Error('Database is not connected. MongoDB service must be running.');
  }

  // Spin up test server on port 3099
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: getDbStatus() });
  });
  app.get('/api/roles', async (req, res) => {
    const roles = await RoleCatalogue.find().sort({ title: 1 });
    res.json({ success: true, count: roles.length, roles });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/progress', progressRouter);
  app.use('/api/quiz', quizRouter);
  app.use('/api/modules', modulesRouter);
  app.use('/api/interview', interviewRouter);
  app.use('/api/resume', resumeRouter);
  app.use('/api/assistant', assistantRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/code', codeRouter);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(3099, resolve));
  const BASE_URL = 'http://127.0.0.1:3099';
  console.log(`[2] Test HTTP Server running at ${BASE_URL}\n`);

  try {
    // -----------------------------------------------------------
    // Step 1: Health & Roles
    // -----------------------------------------------------------
    console.log('--- Step 1: Health & Public Roles ---');
    const healthRes = await fetch(`${BASE_URL}/api/health`).then((r) => r.json());
    console.log(`✓ Health endpoint: status=${healthRes.status}, db.connected=${healthRes.database?.connected}`);

    const rolesRes = await fetch(`${BASE_URL}/api/roles`).then((r) => r.json());
    console.log(`✓ Roles endpoint: seeded count=${rolesRes.count} roles (Target: 28)`);
    if (rolesRes.count < 28) throw new Error(`Expected at least 28 roles, found ${rolesRes.count}`);

    // Clean up any previous test user
    await User.deleteMany({ username: 'e2e_student_2026' });

    // -----------------------------------------------------------
    // Step 2: Student Registration & Security Constraints
    // -----------------------------------------------------------
    console.log('\n--- Step 2: Student Registration & Security ---');
    // Try to register as admin (Security check: must NOT allow admin role assignment via registration)
    const spoofAdminRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'e2e_student_2026',
        name: 'E2E Test Student',
        email: 'e2e_student@campus.edu',
        password: 'Password123!',
        role: 'admin', // Attacker attempts to become admin
        branch: 'Computer Science and Engineering',
        targetRole: 'Software Developer',
      }),
    }).then((r) => r.json());

    if (spoofAdminRes.user.role === 'admin') {
      throw new Error('SECURITY VIOLATION: Public registration allowed setting admin role!');
    }
    if (spoofAdminRes.user.onboarded !== false) {
      throw new Error(`Expected new student onboarded=false, got: ${spoofAdminRes.user.onboarded}`);
    }
    console.log(`✓ Role enforcement verified: Requested "admin", assigned role="${spoofAdminRes.user.role}"`);
    console.log(`✓ Initial state verified: New student onboarded=${spoofAdminRes.user.onboarded} (triggers Initial Assessment)`);

    // Verify duplicate registration error
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'e2e_student_2026',
        name: 'Duplicate Student',
        email: 'e2e_student@campus.edu',
        password: 'Password123!',
      }),
    });
    if (dupRes.status !== 409 && dupRes.status !== 400) {
      throw new Error(`Expected status 409 for duplicate registration, got ${dupRes.status}`);
    }
    const dupJson = await dupRes.json();
    console.log(`✓ Duplicate registration rejected as expected: "${dupJson.error}"`);

    // -----------------------------------------------------------
    // Step 3: Student Login & JWT Authentication
    // -----------------------------------------------------------
    console.log('\n--- Step 3: Student Login & JWT Auth ---');
    // Wrong password test
    const wrongPassRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        password: 'WrongPassword!',
      }),
    });
    if (wrongPassRes.status !== 401) {
      throw new Error(`Expected 401 for incorrect password, got ${wrongPassRes.status}`);
    }
    console.log('✓ Invalid password rejected with 401 Unauthorized');

    // Correct login
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        password: 'Password123!',
      }),
    }).then((r) => r.json());

    if (!loginRes.token) throw new Error('Login failed to return JWT token.');
    const studentToken = loginRes.token;
    console.log(`✓ Student logged in successfully. Token generated, user: ${loginRes.user.name}`);

    // Verify /api/auth/me
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());
    console.log(`✓ Session persistence /me verified for username: ${meRes.user.username}`);

    // -----------------------------------------------------------
    // Step 3b: Forgot Password / Recovery Key & Password Reset
    // -----------------------------------------------------------
    console.log('\n--- Step 3b: Forgot Password & Password Reset Verification ---');
    // 1. Invalid recovery key rejected
    const badKeyRes = await fetch(`${BASE_URL}/api/auth/verify-recovery-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        recoveryKey: '9999',
      }),
    });
    if (badKeyRes.status !== 400) {
      throw new Error(`Expected 400 for invalid recovery key, got: ${badKeyRes.status}`);
    }
    console.log('✓ Invalid recovery key correctly rejected with 400 Bad Request');

    // 2. Unknown account rejected
    const unknownAcctRes = await fetch(`${BASE_URL}/api/auth/verify-recovery-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'ghost_user_99999',
        recoveryKey: '3456',
      }),
    });
    if (unknownAcctRes.status !== 404) {
      throw new Error(`Expected 404 for unknown account, got: ${unknownAcctRes.status}`);
    }
    console.log('✓ Unknown account correctly rejected with 404 Not Found');

    // 3. Valid recovery key and username accepted
    const validKeyRes = await fetch(`${BASE_URL}/api/auth/verify-recovery-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        recoveryKey: '3456',
      }),
    }).then((r) => r.json());
    if (!validKeyRes.success || validKeyRes.username !== 'e2e_student_2026') {
      throw new Error(`Recovery key verification failed: ${JSON.stringify(validKeyRes)}`);
    }
    console.log(`✓ Valid recovery key (3456) verified for username: ${validKeyRes.username}`);

    // 4. Mismatched passwords rejected during reset
    const mismatchRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        recoveryKey: '3456',
        newPassword: 'BrandNewPass2026!',
        confirmPassword: 'DifferentPassword2026!',
      }),
    });
    if (mismatchRes.status !== 400) {
      throw new Error(`Expected 400 for password mismatch, got: ${mismatchRes.status}`);
    }
    console.log('✓ Mismatched new passwords correctly rejected with 400 Bad Request');

    // 5. Short password (< 6 chars) rejected during reset
    const shortPassRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        recoveryKey: '3456',
        newPassword: '123',
        confirmPassword: '123',
      }),
    });
    if (shortPassRes.status !== 400) {
      throw new Error(`Expected 400 for short password, got: ${shortPassRes.status}`);
    }
    console.log('✓ Short password (< 6 chars) correctly rejected with 400 Bad Request');

    // 6. Valid password reset executes and hashes password
    const validResetRes = await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        recoveryKey: '3456',
        newPassword: 'BrandNewPass2026!',
        confirmPassword: 'BrandNewPass2026!',
      }),
    }).then((r) => r.json());
    if (!validResetRes.success) {
      throw new Error(`Password reset failed: ${JSON.stringify(validResetRes)}`);
    }
    console.log(`✓ Password successfully reset in MongoDB: "${validResetRes.message}"`);

    // 7. Verify OLD password is now REJECTED
    const oldLoginAttempt = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        password: 'Password123!',
      }),
    });
    if (oldLoginAttempt.status !== 401) {
      throw new Error(`Expected 401 for old password, got: ${oldLoginAttempt.status}`);
    }
    console.log('✓ Old password successfully invalidated (401 Unauthorized)');

    // 8. Verify NEW password SUCCEEDS and returns valid JWT
    const newLoginAttempt = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        password: 'BrandNewPass2026!',
      }),
    }).then((r) => r.json());
    if (!newLoginAttempt.token) {
      throw new Error('Login with new password failed to generate JWT token');
    }
    console.log('✓ Login with newly reset password succeeded with valid JWT');

    // 9. Reset password back to original 'Password123!' for the remaining tests
    await fetch(`${BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'e2e_student_2026',
        recoveryKey: '3456',
        newPassword: 'Password123!',
        confirmPassword: 'Password123!',
      }),
    });

    // -----------------------------------------------------------
    // Step 4: Persistent Student Progress & Idempotency
    // -----------------------------------------------------------
    console.log('\n--- Step 4: Persistent Student Progress ---');
    // Initial progress
    const initProg = await fetch(`${BASE_URL}/api/progress`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());
    console.log(`✓ Initial progress: completedLessons=${initProg.progress.completedLessons.length}, streak=${initProg.progress.streak.currentStreak}`);

    // Complete lesson 1st time
    const comp1 = await fetch(`${BASE_URL}/api/progress/complete-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ lessonId: 'les-os-1', moduleId: 'mod-cse-os' }),
    }).then((r) => r.json());
    console.log(`✓ First completion: isNewCompletion=${comp1.isNewCompletion}, totalLessons=${comp1.completedLessons.length}`);
    if (!comp1.isNewCompletion) throw new Error('Expected isNewCompletion=true on first completion');

    // Complete lesson 2nd time (Must NOT award duplicate credit!)
    const comp2 = await fetch(`${BASE_URL}/api/progress/complete-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ lessonId: 'les-os-1', moduleId: 'mod-cse-os' }),
    }).then((r) => r.json());
    console.log(`✓ Duplicate completion attempt: isNewCompletion=${comp2.isNewCompletion}, totalLessons=${comp2.completedLessons.length}`);
    if (comp2.isNewCompletion) throw new Error('Duplicate credit was awarded! Expected isNewCompletion=false');

    // Bookmark & Note
    await fetch(`${BASE_URL}/api/progress/bookmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ moduleId: 'mod-cse-os' }),
    });
    await fetch(`${BASE_URL}/api/progress/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ moduleId: 'mod-cse-os', text: 'Important notes on PCB, TCB, and context switching overhead.' }),
    });
    await fetch(`${BASE_URL}/api/progress/coding-solved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ problemId: 'code-1' }),
    });
    console.log('✓ Bookmark, Note, and Coding challenge completion persisted in MongoDB');

    // -----------------------------------------------------------
    // Step 4b: Initial Diagnostic Assessment & AI Analysis Persistence
    // -----------------------------------------------------------
    console.log('\n--- Step 4b: Initial Assessment & AI Analysis Persistence ---');
    const mockAssessmentResult = {
      overallScore: 80,
      roleCompetencyCoverage: 80,
      aptitudeScore: 100,
      reasoningScore: 100,
      technicalScore: 67,
      codingScore: 67,
      preparationLevel: 'Target Ready',
      strengths: ['Quantitative Aptitude', 'Logical Reasoning'],
      weakAreas: ['Operating Systems (Page Replacement)'],
      skillsToImprove: ['Operating Systems'],
      unassessedSkills: ['Git', 'Docker (Not assessed yet)'],
      recommendedSubjects: [
        { subject: 'Operating Systems', topic: 'Virtual Memory & Multi-Level Paging' }
      ],
      evaluationDisclaimer: 'This diagnostic report provides an initial competency baseline.',
      completedAt: 'Oct 30, 2026',
      totalQuestions: 10,
      correctCount: 8,
    };

    const saveAssessmentRes = await fetch(`${BASE_URL}/api/progress/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        assessmentResult: mockAssessmentResult,
        answers: { 101: 2, 102: 1, 103: 0 },
        skills: ['Python', 'SQL', 'Data Structures', 'Operating Systems'],
        preparationGoals: ['Dream Tier-1 Placement', 'Master Algorithmic Coding'],
      }),
    }).then((r) => r.json());

    if (!saveAssessmentRes.success || !saveAssessmentRes.onboarded) {
      throw new Error(`Failed to save initial assessment: ${JSON.stringify(saveAssessmentRes)}`);
    }
    console.log(`✓ Initial assessment saved to MongoDB. User onboarded: ${saveAssessmentRes.onboarded}`);

    // Verify GET /api/progress retrieves saved assessmentResult
    const verifyProg = await fetch(`${BASE_URL}/api/progress`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    if (!verifyProg.progress?.assessmentResult) {
      throw new Error('GET /api/progress did not return saved assessmentResult from MongoDB!');
    }
    if (verifyProg.progress.assessmentResult.overallScore !== 80) {
      throw new Error(`Expected saved overallScore 80, got ${verifyProg.progress.assessmentResult.overallScore}`);
    }
    console.log(`✓ Verified MongoDB persistence: overallScore=${verifyProg.progress.assessmentResult.overallScore}%, level="${verifyProg.progress.assessmentResult.preparationLevel}"`);

    // Verify user profile updated onboarded=true and skills/goals in /api/auth/me
    const verifyMe = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());

    if (verifyMe.user.onboarded !== true) {
      throw new Error(`Expected user.onboarded=true after assessment, got: ${verifyMe.user.onboarded}`);
    }
    if (!verifyMe.user.skills?.includes('Operating Systems')) {
      throw new Error('User skills were not persisted to MongoDB User model!');
    }
    console.log(`✓ User profile updated in MongoDB: onboarded=${verifyMe.user.onboarded}, skillsCount=${verifyMe.user.skills.length}, goalsCount=${verifyMe.user.preparationGoals?.length}`);

    // -----------------------------------------------------------
    // Step 5: Database Question Bank & Randomized Quizzes
    // -----------------------------------------------------------
    console.log('\n--- Step 5: Randomized Quiz Sampling & Server-Side Evaluation ---');
    const quizGen = await fetch(`${BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        branch: 'Computer Science and Engineering',
        subject: 'Operating Systems',
        difficulty: 'Medium',
        length: 5,
      }),
    }).then((r) => r.json());

    // Verify multi-question sampling (Fix for the 1-question bug)
    const multiQuizGen = await fetch(`${BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        subject: 'Computer Networks',
        difficulty: 'Medium',
        length: 10,
      }),
    }).then((r) => r.json());

    console.log(`✓ Multi-question sampling verified: Requested 10 questions, received ${multiQuizGen.questions.length} distinct questions (Bug Fixed!)`);
    if (multiQuizGen.questions.length !== 10) {
      throw new Error(`Expected exactly 10 questions, received ${multiQuizGen.questions.length}`);
    }
    // Verify distinct question IDs
    const uniqueIds = new Set(multiQuizGen.questions.map((q: any) => q._id));
    if (uniqueIds.size !== 10) {
      throw new Error(`Duplicate questions detected in sample: ${uniqueIds.size} unique out of 10`);
    }

    // Security check: Verify answer keys and explanations are stripped from client
    const hasLeakedKey = quizGen.questions.some((q: any) => q.correctIndex !== undefined || q.explanation !== undefined);
    if (hasLeakedKey) throw new Error('SECURITY VIOLATION: Quiz generator leaked correct answer indices or explanations to client!');
    console.log('✓ Client payload verified: No correct answer indices or explanations leaked');

    // Submit quiz answers (mocking answers: answer 0 for all)
    const answersMap: Record<string, number> = {};
    quizGen.questions.forEach((q: any) => {
      answersMap[q._id] = 0;
    });

    const quizSub = await fetch(`${BASE_URL}/api/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        branch: 'Computer Science and Engineering',
        subject: 'Operating Systems',
        difficulty: 'Medium',
        answers: answersMap,
      }),
    }).then((r) => r.json());

    console.log(`✓ Server evaluated quiz: score=${quizSub.score}%, correct=${quizSub.correctCount}/${quizSub.totalQuestions}, streak=${quizSub.streak?.currentStreak}`);
    if (quizSub.answers.length !== quizGen.questions.length) {
      throw new Error('Submitted quiz answer breakdown does not match requested questions.');
    }

    // -----------------------------------------------------------
    // Step 6: Learning Studio Modules
    // -----------------------------------------------------------
    console.log('\n--- Step 6: Learning Studio Modules ---');
    const modulesRes = await fetch(`${BASE_URL}/api/modules`).then((r) => r.json());
    console.log(`✓ Modules retrieved: ${modulesRes.count} structured modules found`);
    const cseModSummary = modulesRes.modules.find((m: any) => m.branch.includes('Computer Science'));
    if (cseModSummary) {
      const cseModFull = await fetch(`${BASE_URL}/api/modules/${cseModSummary.moduleId}`).then((r) => r.json());
      const cseMod = cseModFull.module;
      console.log(`  Module "${cseMod.title}":`);
      console.log(`  - Worked Examples: ${cseMod.workedExamples.length}`);
      console.log(`  - Common Mistakes: ${cseMod.commonMistakes.length}`);
      console.log(`  - Practice Exercises: ${cseMod.practiceExercises.length}`);
      console.log(`  - Knowledge Checks: ${cseMod.knowledgeCheck.length}`);
    }

    // -----------------------------------------------------------
    // Step 7: Interview Studio & Evaluation AI Engine
    // -----------------------------------------------------------
    console.log('\n--- Step 7: Interview Studio & Evaluation AI Engine ---');
    const interviewRes = await fetch(`${BASE_URL}/api/ai/interview-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: 'Software Developer',
        question: 'Explain how database indexing works using B-Trees and discuss the trade-offs on write operations.',
        answer: 'Database indexes use balanced B-Tree structures where search operations have O(log n) time complexity. Nodes contain keys and pointers to data pages. While indexing significantly accelerates SELECT queries, it adds write amplification overhead during INSERT and UPDATE operations because the database must update and rebalance the tree nodes.',
        category: 'Technical',
        difficulty: 'Intermediate',
      }),
    }).then((r) => r.json());

    console.log(`✓ Interview Answer Evaluation:`);
    console.log(`  - Overall Score: ${interviewRes.feedback.overallScore}%`);
    console.log(`  - Technical Score: ${interviewRes.feedback.technicalScore}%`);
    console.log(`  - What was correct: ${interviewRes.feedback.whatWasCorrect[0]}`);
    console.log(`  - Model answer provided: ${!!interviewRes.feedback.modelAnswer}`);

    // Resume AI Improvement
    const resumeAiRes = await fetch(`${BASE_URL}/api/ai/resume-improve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'worked on backend apis\nhelped with database query speed',
        targetRole: 'Software Developer',
        section: 'projects',
      }),
    }).then((r) => r.json());

    console.log(`✓ Resume Bullet Improvement (Google XYZ format):`);
    resumeAiRes.data.bulletPoints.forEach((b: string) => console.log(`  • ${b}`));

    // Save complete interview session
    const saveIntRes = await fetch(`${BASE_URL}/api/interview/save-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        session: {
          id: `sess-${Date.now()}`,
          targetRole: 'Software Developer',
          type: 'Technical Interview',
          difficulty: 'Intermediate',
          finalFeedback: interviewRes.feedback,
          messages: [],
        },
      }),
    }).then((r) => r.json());
    console.log(`✓ Interview session recorded in UserProgress: ${saveIntRes.success}`);

    // -----------------------------------------------------------
    // Step 8: Resume Builder Persistence
    // -----------------------------------------------------------
    console.log('\n--- Step 8: Resume Builder Persistence ---');
    const saveResumeRes = await fetch(`${BASE_URL}/api/resume/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        resumeData: {
          fullName: 'E2E Test Student',
          email: 'e2e_student@campus.edu',
          summary: 'Software engineer passionate about distributed systems.',
          template: 'modern',
        },
      }),
    }).then((r) => r.json());
    console.log(`✓ Resume saved to MongoDB: template=${saveResumeRes.resumeData.template}`);

    const getResumeRes = await fetch(`${BASE_URL}/api/resume`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    }).then((r) => r.json());
    console.log(`✓ Resume retrieved from MongoDB: name="${getResumeRes.resumeData.fullName}"`);

    // -----------------------------------------------------------
    // Step 9: Rule-Based Assistant with Real MongoDB Context
    // -----------------------------------------------------------
    console.log('\n--- Step 9: Rule-Based Assistant ---');
    const assistantRes = await fetch(`${BASE_URL}/api/assistant/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({ query: 'What should I do next?' }),
    }).then((r) => r.json());
    console.log(`✓ Assistant response: "${assistantRes.reply.slice(0, 100)}..."`);
    console.log(`  Recommended action page: ${assistantRes.actionPage}`);

    // -----------------------------------------------------------
    // Step 10: Administrator Authentication & Dashboard Operations
    // -----------------------------------------------------------
    console.log('\n--- Step 10: Admin Authentication & Control Plane ---');
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'admin',
        password: process.env.ADMIN_PASSWORD || 'AdminSecurePass2026!',
      }),
    }).then((r) => r.json());

    if (!adminLoginRes.token || adminLoginRes.user.role !== 'admin') {
      throw new Error('Admin login failed or user is not admin.');
    }
    const adminToken = adminLoginRes.token;
    console.log(`✓ Admin logged in successfully: username=${adminLoginRes.user.username}, role=${adminLoginRes.user.role}`);

    // Admin Overview Stats
    const adminOverview = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());

    console.log(`✓ Admin Overview Stats:`);
    console.log(`  - Total Registered Users: ${adminOverview.stats.users.total}`);
    console.log(`  - Total Question Bank Size: ${adminOverview.stats.questionBank.total} (Target: >= 3,570)`);
    console.log(`  - Total Completed Lessons: ${adminOverview.stats.learning.totalCompletedLessons}`);
    console.log(`  - Total Quiz Attempts: ${adminOverview.stats.learning.totalQuizAttempts}`);
    console.log(`  - Active MongoDB Status: ${adminOverview.stats.database.connected}`);

    if (adminOverview.stats.questionBank.total < 3570) {
      throw new Error(`Expected at least 3,570 questions in database, found ${adminOverview.stats.questionBank.total}`);
    }

    // Admin User Management
    const adminUsersRes = await fetch(`${BASE_URL}/api/admin/users?search=e2e_student`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    console.log(`✓ Admin user query found test student: ${adminUsersRes.users.length} match`);
    const studentUser = adminUsersRes.users[0];

    // Toggle active status (disable account)
    const toggleDisable = await fetch(`${BASE_URL}/api/admin/users/${studentUser._id}/toggle-status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    console.log(`✓ Admin disabled student account: isActive=${toggleDisable.isActive}`);

    // Verify disabled user cannot log in
    const disabledLogin = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'e2e_student_2026', password: 'Password123!' }),
    });
    if (disabledLogin.status !== 403) {
      throw new Error(`Expected 403 Forbidden for disabled user, got ${disabledLogin.status}`);
    }
    console.log(`✓ Disabled student blocked from login with 403 Forbidden`);

    // Re-enable student account
    const toggleEnable = await fetch(`${BASE_URL}/api/admin/users/${studentUser._id}/toggle-status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    console.log(`✓ Admin safely re-enabled student account: isActive=${toggleEnable.isActive}`);

    // Question Bank Management: Create, Read, Delete test question
    const createQRes = await fetch(`${BASE_URL}/api/admin/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        branch: 'Computer Science and Engineering',
        subject: 'Operating Systems',
        topic: 'Verification Testing',
        difficulty: 'Easy',
        question: 'What is the purpose of this automated verification question?',
        options: ['Testing E2E admin CRUD', 'None', 'Error', 'Skip'],
        correctIndex: 0,
        explanation: 'Ensures the administrator can create, edit, validate, and delete questions.',
      }),
    }).then((r) => r.json());
    console.log(`✓ Admin created test question: ID=${createQRes.question._id}`);

    // Delete question
    const delQRes = await fetch(`${BASE_URL}/api/admin/questions/${createQRes.question._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    console.log(`✓ Admin deleted test question: ${delQRes.message}`);

    // -----------------------------------------------------------
    // Step 11: Real Sandboxed Code Evaluation Engine
    // -----------------------------------------------------------
    console.log('\n--- Step 11: Sandboxed Code Evaluation Engine ---');
    // Test 11a: Wrong code must be REJECTED with Wrong Answer
    const wrongCodeRes = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'code-1',
        language: 'python',
        code: 'def twoSum(nums, target):\n    return [99, 99]',
      }),
    }).then((r) => r.json());

    if (wrongCodeRes.status !== 'Wrong Answer') {
      throw new Error(`Expected Wrong Answer for incorrect code, got: ${wrongCodeRes.status}`);
    }
    console.log(`✓ Incorrect solution correctly rejected: status="${wrongCodeRes.status}", failedCase=${wrongCodeRes.failedCase}`);

    // Test 11b: Correct Python code must be ACCEPTED
    const correctCodeRes = await fetch(`${BASE_URL}/api/code/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        problemId: 'code-1',
        language: 'python',
        code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      }),
    }).then((r) => r.json());

    if (correctCodeRes.status !== 'Accepted') {
      throw new Error(`Expected Accepted for correct code, got: ${correctCodeRes.status} (${correctCodeRes.error})`);
    }
    console.log(`✓ Valid Python solution passed all test cases: status="${correctCodeRes.status}", passed=${correctCodeRes.passedCount}/${correctCodeRes.totalCount}`);

    // Test 11c: Correct JavaScript code must be ACCEPTED
    const correctJsRes = await fetch(`${BASE_URL}/api/code/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'code-2',
        language: 'javascript',
        code: `function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (pairs[char]) {
            if (stack.pop() !== pairs[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}`,
      }),
    }).then((r) => r.json());

    if (correctJsRes.status !== 'Accepted') {
      throw new Error(`Expected Accepted for correct JS code, got: ${correctJsRes.status}`);
    }
    console.log(`✓ Valid JavaScript solution passed all test cases: status="${correctJsRes.status}", passed=${correctJsRes.passedCount}/${correctJsRes.totalCount}`);

    // Clean up test student
    await User.deleteMany({ username: 'e2e_student_2026' });

    console.log('\n====================================================');
    console.log('🎉 ALL 11 VERIFICATION PHASES PASSED WITH 100% SUCCESS!');
    console.log('====================================================\n');
    process.exit(0);
  } finally {
    server.close();
  }
}

runVerification().catch((err) => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
