import { Router } from 'express';
import { z } from 'zod';
import { store } from '../store/dataStore.js';

const ackSchema = z.object({
  acknowledged: z.boolean().default(true),
  ackedBy: z.string().optional(),
});

export const alertsRouter = Router();

alertsRouter.get('/', (_req, res) => {
  res.json([...store.alerts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

alertsRouter.get('/:id', (req, res) => {
  const alert = store.alerts.find((a) => a.id === req.params.id);
  if (!alert) {
    res.status(404).json({
      error: 'not_found',
      message: 'Alert not found.',
      code: 404,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  res.json(alert);
});

alertsRouter.patch('/:id/ack', (req, res) => {
  const alert = store.alerts.find((a) => a.id === req.params.id);
  if (!alert) {
    res.status(404).json({
      error: 'not_found',
      message: 'Alert not found.',
      code: 404,
      timestamp: new Date().toISOString(),
    });
    return;
  }
  alert.acknowledged = true;
  alert.ackedBy = typeof req.body?.ackedBy === 'string' ? req.body.ackedBy : 'analyst';
  res.json(alert);
});
