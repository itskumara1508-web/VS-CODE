import { Router } from 'express';
import { store } from '../store/dataStore.js';

export const dashboardRouter = Router();

dashboardRouter.get('/kpis', (_req, res) => {
  res.json(store.dashboardKPIs());
});

dashboardRouter.get('/sentiment-timeline', (req, res) => {
  const topicId = typeof req.query.topicId === 'string' ? req.query.topicId : undefined;
  res.json(store.sentimentTimeline(topicId));
});

dashboardRouter.get('/emotion-distribution', (req, res) => {
  const topicId = typeof req.query.topicId === 'string' ? req.query.topicId : undefined;
  res.json(store.emotionDistribution(topicId));
});

dashboardRouter.get('/platform-distribution', (_req, res) => {
  res.json(store.platformDistribution());
});

dashboardRouter.get('/engagement-timeline', (_req, res) => {
  res.json(store.engagementTimeline());
});

dashboardRouter.get('/summary', (_req, res) => {
  res.json({
    kpis: store.dashboardKPIs(),
    sentimentTimeline: store.sentimentTimeline(),
    emotionDistribution: store.emotionDistribution(),
    platformDistribution: store.platformDistribution(),
    engagementTimeline: store.engagementTimeline(),
    trendingTopics: store.trends.slice(0, 5),
    topInfluencers: store.influencers.slice(0, 5),
    criticalAlerts: store.alerts.filter((a) => a.level === 'CRITICAL' || a.level === 'HIGH'),
    aiInsights: store.insights.slice(0, 3),
  });
});
