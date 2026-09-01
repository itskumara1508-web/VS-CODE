import { createApp } from './app.js';
import { config } from './config.js';
import { store } from './store/dataStore.js';

const app = createApp();

const server = app.listen(config.port, config.host, () => {
  console.log(`[API] NTRO Social Intelligence API listening on http://${config.host}:${config.port}`);
  console.log(`[API] Mock data mode: ${config.mockDataMode ? 'ON' : 'OFF'}`);
  console.log(`[API] Loaded ${store.posts.length} posts, ${store.users.length} users, ${store.topics.length} topics.`);
});

// Graceful shutdown
function shutdown(signal: string) {
  console.log(`[API] ${signal} received, shutting down...`);
  server.close(() => {
    console.log('[API] Server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
