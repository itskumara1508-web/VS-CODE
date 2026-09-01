import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { requireAuth } from './middleware/auth.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { dashboardRouter } from './routes/dashboard.js';
import { postsRouter } from './routes/posts.js';
import { sentimentRouter } from './routes/sentiment.js';
import { audienceRouter } from './routes/audience.js';
import { trendsRouter } from './routes/trends.js';
import { networkRouter } from './routes/network.js';
import { timelineRouter } from './routes/timeline.js';
import { alertsRouter } from './routes/alerts.js';
import { insightsRouter } from './routes/insights.js';
import { reportsRouter } from './routes/reports.js';
import { dataSourcesRouter } from './routes/datasources.js';
import { systemHealthRouter } from './routes/systemHealth.js';
import { demoRouter } from './routes/demo.js';
import { investigationsRouter } from './routes/investigations.js';
import { watchlistsRouter } from './routes/watchlists.js';
import { compareRouter } from './routes/compare.js';
import { platformsRouter } from './routes/platforms.js';
import { docsRouter } from './routes/docs.js';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin.split(','), credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(config.logLevel === 'debug' ? 'dev' : 'combined'));

  // Global rate limiting
  app.use(
    rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Public routes
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/system/health', systemHealthRouter);
  app.use('/api/docs', docsRouter);

  // Protected routes
  app.use('/api/dashboard', requireAuth, dashboardRouter);
  app.use('/api/platforms', requireAuth, platformsRouter);
  app.use('/api/posts', requireAuth, postsRouter);
  app.use('/api/sentiment', requireAuth, sentimentRouter);
  app.use('/api/audience', requireAuth, audienceRouter);
  app.use('/api/trends', requireAuth, trendsRouter);
  app.use('/api/network', requireAuth, networkRouter);
  app.use('/api/timeline', requireAuth, timelineRouter);
  app.use('/api/alerts', requireAuth, alertsRouter);
  app.use('/api/insights', requireAuth, insightsRouter);
  app.use('/api/reports', requireAuth, reportsRouter);
  app.use('/api/datasources', requireAuth, dataSourcesRouter);
  app.use('/api/demo', requireAuth, demoRouter);
  app.use('/api/investigations', requireAuth, investigationsRouter);
  app.use('/api/watchlists', requireAuth, watchlistsRouter);
  app.use('/api/compare', requireAuth, compareRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'not_found',
      message: `Route ${req.method} ${req.path} not found.`,
      code: 404,
      timestamp: new Date().toISOString(),
    });
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[API Error]', err);
    res.status(500).json({
      error: 'internal_error',
      message: 'An unexpected error occurred.',
      code: 500,
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
