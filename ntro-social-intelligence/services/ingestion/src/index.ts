import dotenv from 'dotenv';
import { IngestionPipeline } from './pipeline.js';

dotenv.config();

export * from './providers/base.js';
export * from './providers/xProvider.js';
export * from './providers/telegramProvider.js';
export * from './providers/redditProvider.js';
export * from './pipeline.js';

const pipeline = new IngestionPipeline();

console.log('[Ingestion] Service initialized.');
console.log('[Ingestion] Provider status:', pipeline.getStatus());

// Graceful shutdown
process.on('SIGINT', () => {
  pipeline.stop();
  process.exit(0);
});
process.on('SIGTERM', () => {
  pipeline.stop();
  process.exit(0);
});

