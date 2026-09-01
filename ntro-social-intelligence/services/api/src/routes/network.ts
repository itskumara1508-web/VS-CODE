import { Router } from 'express';
import { store } from '../store/dataStore.js';

export const networkRouter = Router();

networkRouter.get('/graph', (_req, res) => {
  res.json(store.network);
});

networkRouter.get('/communities', (_req, res) => {
  res.json(store.communities);
});

networkRouter.get('/influencers', (_req, res) => {
  res.json(store.influencers);
});

networkRouter.get('/influencers/:id', (req, res) => {
  const influencer = store.influencers.find((i) => i.userId === req.params.id);
  if (!influencer) {
    res.status(404).json({
      error: 'not_found',
      message: 'Influencer not found.',
      code: 404,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  res.json(influencer);
});

networkRouter.get('/centrality', (_req, res) => {
  const sorted = [...store.influencers].sort((a, b) => b.pagerank - a.pagerank);
  res.json({
    topByPageRank: sorted.slice(0, 10),
    topByBetweenness: [...store.influencers].sort((a, b) => b.betweennessCentrality - a.betweennessCentrality).slice(0, 10),
    topByDegree: [...store.influencers].sort((a, b) => b.degreeCentrality - a.degreeCentrality).slice(0, 10),
  });
});
