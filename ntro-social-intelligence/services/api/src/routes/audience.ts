import { Router } from 'express';
import { store } from '../store/dataStore.js';

export const audienceRouter = Router();

audienceRouter.get('/segments', (req, res) => {
  const dimension = typeof req.query.dimension === 'string' ? req.query.dimension : undefined;
  const segments = dimension
    ? store.demographics.filter((d) => d.dimension === dimension)
    : store.demographics;
  res.json(segments);
});

audienceRouter.get('/overview', (_req, res) => {
  const segments = store.demographics;
  const byDimension = segments.reduce<Record<string, typeof segments>>((acc, seg) => {
    acc[seg.dimension] = acc[seg.dimension] || [];
    acc[seg.dimension].push(seg);
    return acc;
  }, {});
  res.json({
    age: byDimension.age || [],
    language: byDimension.language || [],
    location: byDimension.location || [],
    profession: byDimension.profession || [],
    note: 'All demographics are probabilistic aggregate estimates. No individual-level sensitive attributes are inferred or displayed.',
  });
});
