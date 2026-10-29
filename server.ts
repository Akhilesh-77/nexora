import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase, getDbStatus } from './server/db';
import { seedDatabase } from './server/seed';

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

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB & Seed if collections are uninitialized
(async () => {
  const dbConnected = await connectDatabase();
  if (dbConnected) {
    await seedDatabase({ forceFresh: false });
  } else {
    console.warn('[NEXORA Server] Warning: Running without active MongoDB connection. Database routes will return service error.');
  }
})();

// Health & Status Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: dbStatus.connected ? 'ok' : 'degraded',
    app: 'NEXORA AI — Campus Placement Preparation Platform',
    mode: 'Local-First Autonomous Engine',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Roles Catalogue Public Endpoint
app.get('/api/roles', async (req, res): Promise<any> => {
  try {
    const roles = await RoleCatalogue.find().sort({ title: 1 });
    return res.json({ success: true, count: roles.length, roles });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve roles catalogue.' });
  }
});

// Mount API Routers
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

// Centralized JSON Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[NEXORA Server] Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.',
  });
});

// Vite Middleware or Static Serving
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXORA Server] Application running at http://localhost:${PORT}`);
    console.log(`[NEXORA Server] Health endpoint: http://localhost:${PORT}/api/health`);
  });
}

setupVite().catch((err) => {
  console.error('[NEXORA Server] Fatal error starting server:', err);
});
