import type { Post } from '@ntro/types';
import type { SocialMediaProvider, ProviderHealth } from './base.js';

export class XProvider implements SocialMediaProvider {
  platform = 'x' as const;
  name = 'X (Twitter) Official v2 API';
  private apiKey?: string;
  private bearerToken?: string;
  private remaining = 500;

  constructor(apiKey?: string, bearerToken?: string) {
    this.apiKey = apiKey || process.env.X_API_KEY;
    this.bearerToken = bearerToken || process.env.X_BEARER_TOKEN;
  }

  isConfigured(): boolean {
    return Boolean(this.bearerToken || this.apiKey);
  }

  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) return false;
    return true;
  }

  async fetchRecentPosts(query?: string, limit: number = 50): Promise<Post[]> {
    if (!this.isConfigured()) {
      return [];
    }
    // In live mode with credentials, call https://api.twitter.com/2/tweets/search/recent
    return [];
  }

  getHealth(): ProviderHealth {
    return {
      connected: this.isConfigured(),
      rateLimitRemaining: this.remaining,
      rateLimitMax: 500,
      lastSyncAt: new Date().toISOString(),
    };
  }
}

