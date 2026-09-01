import { Router } from 'express';
import { store } from '../store/dataStore.js';

export const trendsRouter = Router();

trendsRouter.get('/', (_req, res) => {
  res.json(store.trends);
});

trendsRouter.get('/:id', (req, res) => {
  const trend = store.trends.find((t) => t.id === req.params.id);
  if (!trend) {
    res.status(404).json({
      error: 'not_found',
      message: 'Trend not found.',
      code: 404,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  res.json(trend);
});

trendsRouter.get('/by-topic/:topicId', (req, res) => {
  const trends = store.trends.filter((t) => t.topicId === req.params.topicId);
  res.json(trends);
});
