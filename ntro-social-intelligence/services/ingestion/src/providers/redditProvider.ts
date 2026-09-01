import type { Post } from '@ntro/types';
import type { SocialMediaProvider, ProviderHealth } from './base.js';

export class RedditProvider implements SocialMediaProvider {
  platform = 'reddit' as const;
  name = 'Reddit OAuth API';
  private clientId?: string;
  private clientSecret?: string;
  private remaining = 60;

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = clientId || process.env.REDDIT_CLIENT_ID;
    this.clientSecret = clientSecret || process.env.REDDIT_CLIENT_SECRET;
  }

  isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  async testConnection(): Promise<boolean> {
    return this.isConfigured();
  }

  async fetchRecentPosts(_query?: string, _limit: number = 50): Promise<Post[]> {
    if (!this.isConfigured()) return [];
    return [];
  }

  getHealth(): ProviderHealth {
    return {
      connected: this.isConfigured(),
      rateLimitRemaining: this.remaining,
      rateLimitMax: 60,
      lastSyncAt: new Date().toISOString(),
    };
  }
}

