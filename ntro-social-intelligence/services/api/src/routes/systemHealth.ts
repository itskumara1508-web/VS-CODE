import { Router, type Request, type Response } from 'express';
import { store } from '../store/dataStore.js';

export const systemHealthRouter = Router();

systemHealthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    services: store.systemHealth,
    timestamp: new Date().toISOString(),
  });
});

