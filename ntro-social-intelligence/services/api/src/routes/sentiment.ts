import { Router } from 'express';
import { store } from '../store/dataStore.js';

export const sentimentRouter = Router();

sentimentRouter.get('/overview', (req, res) => {
  const topicId = typeof req.query.topicId === 'string' ? req.query.topicId : undefined;
  res.json({
    sentiment: store.sentimentTimeline(topicId),
    emotions: store.emotionDistribution(topicId),
    counts: {
      positive: store.sentiment.filter((s) => s.sentiment === 'positive').length,
      negative: store.sentiment.filter((s) => s.sentiment === 'negative').length,
      neutral: store.sentiment.filter((s) => s.sentiment === 'neutral').length,
    },
  });
});

sentimentRouter.get('/timeline', (req, res) => {
  const topicId = typeof req.query.topicId === 'string' ? req.query.topicId : undefined;
  res.json(store.sentimentTimeline(topicId));
});

sentimentRouter.get('/emotions', (req, res) => {
  const topicId = typeof req.query.topicId === 'string' ? req.query.topicId : undefined;
  res.json(store.emotionDistribution(topicId));
});

sentimentRouter.get('/by-post/:postId', (req, res) => {
  const result = store.sentiment.find((s) => s.postId === req.params.postId);
  if (!result) {
    res.status(404).json({
      error: 'not_found',
      message: 'Sentiment result not found.',
      code: 404,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  res.json(result);
});
