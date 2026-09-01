import type { Post, Platform } from '@ntro/types';

export interface ProviderHealth {
  connected: boolean;
  rateLimitRemaining: number;
  rateLimitMax: number;
  lastSyncAt: string;
}

/** Base interface for social media data harvesting adapters */
export interface SocialMediaProvider {
  platform: Platform;
  name: string;
  isConfigured(): boolean;
  testConnection(): Promise<boolean>;
  fetchRecentPosts(query?: string, limit?: number): Promise<Post[]>;
  getHealth(): ProviderHealth;
}

