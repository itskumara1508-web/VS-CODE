import { Router } from 'express';
import { z } from 'zod';
import { store } from '../store/dataStore.js';
import { validateQuery } from '../middleware/validate.js';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
  platform: z.string().optional(),
  topicId: z.string().optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
  language: z.string().optional(),
});

export const postsRouter = Router();

postsRouter.get('/', validateQuery(querySchema), (req, res) => {
  const { page, pageSize, platform, topicId, sentiment, language } = req.query as unknown as z.infer<typeof querySchema>;
  let items = store.posts;
  if (platform) items = items.filter((p) => p.platform === platform);
  if (topicId) items = items.filter((p) => p.topicIds.includes(topicId));
  if (language) items = items.filter((p) => p.language === language);
  if (sentiment) {
    const ids = new Set(store.sentiment.filter((s) => s.sentiment === sentiment).map((s) => s.postId));
    items = items.filter((p) => ids.has(p.id));
  }
  items = [...items].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  res.json(store.paginate(items, page, pageSize));
});

postsRouter.get('/:id', (req, res) => {
  const post = store.posts.find((p) => p.id === req.params.id);
  if (!post) {
    res.status(404).json({
      error: 'not_found',
      message: 'Post not found.',
      code: 404,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  const sentiment = store.sentiment.find((s) => s.postId === post.id) || null;
  res.json({ post, sentiment });
});
