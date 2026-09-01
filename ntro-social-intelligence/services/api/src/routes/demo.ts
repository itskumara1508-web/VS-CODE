import { Router, type Request, type Response } from 'express';
import { store } from '../store/dataStore.js';

export const demoRouter = Router();

let isDemoRunning = false;
let demoStep = 0;

demoRouter.get('/status', (_req: Request, res: Response) => {
  res.json({
    running: isDemoRunning,
    currentStep: demoStep,
    totalSteps: 5,
    timestamp: new Date().toISOString(),
  });
});

demoRouter.post('/start', (_req: Request, res: Response) => {
  isDemoRunning = true;
  demoStep = 1;
  res.json({
    status: 'started',
    message: 'SIH Demo simulation started',
    step: demoStep,
  });
});

demoRouter.post('/stop', (_req: Request, res: Response) => {
  isDemoRunning = false;
  demoStep = 0;
  res.json({
    status: 'stopped',
    message: 'SIH Demo simulation stopped',
  });
});

demoRouter.post('/event', (_req: Request, res: Response) => {
  demoStep = (demoStep % 5) + 1;
  const eventIntel = store.eventIntelligence();
  res.json({
    status: 'success',
    step: demoStep,
    event: eventIntel,
    timeline: store.timeline,
  });
});

