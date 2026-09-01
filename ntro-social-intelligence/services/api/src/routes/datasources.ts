import { Router, type Request, type Response } from 'express';
import { store } from '../store/dataStore.js';

export const dataSourcesRouter = Router();

dataSourcesRouter.get('/', (_req: Request, res: Response) => {
  res.json(store.dataSources);
});

dataSourcesRouter.patch('/:id/toggle', (req: Request, res: Response) => {
  const updated = store.toggleDataSource(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'not_found', message: 'Data source not found' });
  }
  res.json(updated);
});

