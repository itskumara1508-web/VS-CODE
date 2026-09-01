import type { Post } from '@ntro/types';
import type { SocialMediaProvider } from './providers/base.js';
import { XProvider } from './providers/xProvider.js';
import { TelegramProvider } from './providers/telegramProvider.js';
import { RedditProvider } from './providers/redditProvider.js';

export class IngestionPipeline {
  private providers: Map<string, SocialMediaProvider> = new Map();
  private isRunning: boolean = false;
  private timer?: NodeJS.Timeout;

  constructor() {
    this.registerProvider(new XProvider());
    this.registerProvider(new TelegramProvider());
    this.registerProvider(new RedditProvider());
  }

  registerProvider(provider: SocialMediaProvider) {
    this.providers.set(provider.platform, provider);
  }

  getProvider(platform: string): SocialMediaProvider | undefined {
    return this.providers.get(platform);
  }

  getAllProviders(): SocialMediaProvider[] {
    return Array.from(this.providers.values());
  }

  async runHarvestCycle(): Promise<Post[]> {
    const harvested: Post[] = [];
    for (const [platform, provider] of this.providers.entries()) {
      try {
        if (provider.isConfigured()) {
          const posts = await provider.fetchRecentPosts(undefined, 25);
          harvested.push(...posts);
        }
      } catch (err) {
        console.error(`[Ingestion] Error fetching from ${platform}:`, err);
      }
    }
    return harvested;
  }

  start(intervalMs: number = 60000) {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[Ingestion] Pipeline started with cycle interval ${intervalMs}ms`);
    this.timer = setInterval(() => {
      this.runHarvestCycle().catch((err) => console.error('[Ingestion] Cycle error:', err));
    }, intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.isRunning = false;
    console.log('[Ingestion] Pipeline stopped.');
  }

  getStatus() {
    return {
      running: this.isRunning,
      providers: this.getAllProviders().map((p) => ({
        platform: p.platform,
        name: p.name,
        configured: p.isConfigured(),
        health: p.getHealth(),
      })),
    };
  }
}

