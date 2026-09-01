import { Router } from 'express';
import { config } from '../config.js';
import { store } from '../store/dataStore.js';
import { APP_VERSION } from '@ntro/shared';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    service: 'ntro-social-intelligence-api',
    status: 'ok',
    version: APP_VERSION,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: {
      mockData: store.posts.length > 0,
      auth: config.jwtSecret !== 'change-me-to-a-long-random-secret-string',
    },
  });
});

healthRouter.get('/mock', (_req, res) => {
  res.json({
    mockDataMode: config.mockDataMode,
    totalPosts: store.posts.length,
    totalUsers: store.users.length,
    totalTopics: store.topics.length,
    totalTrends: store.trends.length,
    totalAlerts: store.alerts.length,
  });
});
