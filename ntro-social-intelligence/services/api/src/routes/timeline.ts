import { Router } from 'express';
import { store } from '../store/dataStore.js';

export const timelineRouter = Router();

timelineRouter.get('/', (req, res) => {
  const topicId = typeof req.query.topicId === 'string' ? req.query.topicId : undefined;
  const events = topicId
    ? store.timeline.filter((e) => e.topicId === topicId)
    : store.timeline;
  res.json([...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
});

timelineRouter.get('/events', (req, res) => {
  const topicId = typeof req.query.topicId === 'string' ? req.query.topicId : undefined;
  const events = topicId
    ? store.timeline.filter((e) => e.topicId === topicId)
    : store.timeline;
  res.json([...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
});

timelineRouter.get('/posts', (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 50;
  const topicId = typeof req.query.topicId === 'string' ? req.query.topicId : undefined;
  const platform = typeof req.query.platform === 'string' ? req.query.platform : undefined;
  const sentiment = typeof req.query.sentiment === 'string' ? req.query.sentiment : undefined;
  const language = typeof req.query.language === 'string' ? req.query.language : undefined;
  let items = store.posts;
  if (topicId) items = items.filter((p) => p.topicIds.includes(topicId));
  if (platform) items = items.filter((p) => p.platform === platform);
  if (language) items = items.filter((p) => p.language === language);
  if (sentiment) {
    const ids = new Set(store.sentiment.filter((s) => s.sentiment === sentiment).map((s) => s.postId));
    items = items.filter((p) => ids.has(p.id));
  }
  items = [...items].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  res.json(store.paginate(items, page, pageSize));
});
