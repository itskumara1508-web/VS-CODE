import {
  generateMockData,
  type MockDataset,
} from '@ntro/shared';
import type {
  Post,
  AnonymizedUser,
  Topic,
  SentimentResult,
  Trend,
  Influencer,
  Community,
  NetworkNode,
  NetworkEdge,
  Alert,
  AIInsight,
  TimelineEvent,
  DemographicSegment,
  Paginated,
  DashboardKPIs,
  Sentiment,
} from '@ntro/types';

/**
 * In-memory datastore used for the prototype.
 * In mock-data mode it loads a generated dataset into memory.
 * A production build would swap this for PostgreSQL/TimescaleDB + Neo4j.
 */
export class DataStore {
  private dataset: MockDataset;

  constructor() {
    this.dataset = generateMockData();
  }

  get posts(): Post[] {
    return this.dataset.posts;
  }
  get users(): AnonymizedUser[] {
    return this.dataset.users;
  }
  get topics(): Topic[] {
    return this.dataset.topics;
  }
  get sentiment(): SentimentResult[] {
    return this.dataset.sentiment;
  }
  get trends(): Trend[] {
    return this.dataset.trends;
  }
  get influencers(): Influencer[] {
    return this.dataset.influencers;
  }
  get communities(): Community[] {
    return this.dataset.communities;
  }
  get network(): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
    return this.dataset.network;
  }
  get demographics(): DemographicSegment[] {
    return this.dataset.demographics;
  }
  get alerts(): Alert[] {
    return this.dataset.alerts;
  }
  get insights(): AIInsight[] {
    return this.dataset.insights;
  }
  get timeline(): TimelineEvent[] {
    return this.dataset.timeline;
  }
  get dataSources(): any[] {
    return this.dataset.dataSources || [];
  }
  get systemHealth(): any[] {
    return this.dataset.systemHealth || [];
  }

  toggleDataSource(id: string) {
    const ds = this.dataset.dataSources.find((d) => d.id === id);
    if (ds) {
      ds.status = ds.status === 'CONNECTED' ? 'DISCONNECTED' : 'CONNECTED';
      ds.lastSyncAt = new Date().toISOString();
      return ds;
    }
    return null;
  }

  eventIntelligence(topicId?: string) {
    const topic = this.topics.find((t) => (topicId ? t.id === topicId : true)) || this.topics[0];
    const trend = this.trends.find((t) => t.topicId === topic.id) || this.trends[0];
    const topInf = this.influencers[0] || {
      handle: 'tech_analyst_in',
      influenceScore: 0.94,
      role: 'authority',
    };

    return {
      topicId: topic.id,
      topicName: topic.name,
      startedAt: '14:00:00 UTC',
      currentMentions: trend ? trend.mentionCount : 18420,
      growthRate: trend ? trend.growthRate : 243,
      sentiment: {
        positive: 32,
        neutral: 22,
        negative: 46,
      },
      topInfluencer: {
        name: topInf.handle,
        handle: topInf.handle,
        influenceScore: topInf.influenceScore,
        role: topInf.role,
      },
      communitiesAffected: 4,
      propagationPath: [
        'Grassroots Community A',
        `Key Influencer (@${topInf.handle})`,
        'Policy Community B',
        'Media Hub C',
      ],
      propagationSteps: [
        {
          step: 1,
          time: '14:00:00',
          fromEntity: 'Citizen Community Alpha',
          toEntity: 'Public Forums',
          type: 'mention',
          description: `Initial discussion regarding ${topic.name} detected on X and Telegram.`,
          sentimentDelta: -0.05,
        },
        {
          step: 2,
          time: '14:15:20',
          fromEntity: 'Public Forums',
          toEntity: `@${topInf.handle}`,
          type: 'amplification',
          description: `Key influencer @${topInf.handle} amplified critical sentiment (+240% velocity).`,
          sentimentDelta: -0.18,
        },
        {
          step: 3,
          time: '14:32:45',
          fromEntity: `@${topInf.handle}`,
          toEntity: 'Policy & Tech Analysts',
          type: 'cross_community',
          description: 'Conversation crossed into institutional and policy analysis communities.',
          sentimentDelta: -0.12,
        },
        {
          step: 4,
          time: '14:47:10',
          fromEntity: 'Policy & Tech Analysts',
          toEntity: 'Broadcast Media',
          type: 'repost',
          description: 'Mainstream news aggregators reposted key threads; negative stance locked at 46%.',
          sentimentDelta: -0.21,
        },
      ],
      aiSummary: `Topic "${topic.name}" emerged at 14:00 and gained rapid traction within Community A. High-influence account @${topInf.handle} amplified the narrative at 14:15. Within 47 minutes the topic crossed community boundaries into 3 distinct network clusters, shifting negative sentiment from 18% to 46%.`,
      confidence: { score: 0.92, low: 0.84, high: 0.98 },
      evidence: [
        { type: 'time_range', label: 'Time Window', value: '14:00 - 15:15 UTC' },
        { type: 'post_count', label: 'Total Posts Analyzed', value: trend ? trend.mentionCount : 18420 },
        { type: 'sentiment_shift', label: 'Negative Sentiment Delta', value: '+28%' },
        { type: 'communities', label: 'Network Communities Reached', value: 4 },
        { type: 'influence_peak', label: 'Peak Influencer Score', value: topInf.influenceScore },
      ],
    };
  }

  /** Paginate a generic array. */
  paginate<T>(items: T[], page = 1, pageSize = 50): Paginated<T> {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return {
      items: items.slice(start, end),
      page: safePage,
      pageSize,
      total,
      totalPages,
    };
  }

  /** Aggregate sentiment into a time series (per hour). */
  sentimentTimeline(topicId?: string): Array<{ timestamp: string; positive: number; negative: number; neutral: number }> {
    const posts = topicId
      ? this.posts.filter((p) => p.topicIds.includes(topicId))
      : this.posts;
    const byHour = new Map<string, { positive: number; negative: number; neutral: number; total: number }>();
    posts.forEach((post) => {
      const sent = this.sentiment.find((s) => s.postId === post.id);
      if (!sent) return;
      const date = new Date(post.timestamp);
      const key = date.toISOString().slice(0, 13);
      const bucket = byHour.get(key) || { positive: 0, negative: 0, neutral: 0, total: 0 };
      if (sent.sentiment === 'positive') bucket.positive += 1;
      else if (sent.sentiment === 'negative') bucket.negative += 1;
      else bucket.neutral += 1;
      bucket.total += 1;
      byHour.set(key, bucket);
    });
    return Array.from(byHour.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([ts, b]) => ({
        timestamp: ts,
        positive: b.total ? Math.round((b.positive / b.total) * 100) : 0,
        negative: b.total ? Math.round((b.negative / b.total) * 100) : 0,
        neutral: b.total ? Math.round((b.neutral / b.total) * 100) : 0,
      }));
  }

  /** Aggregate emotion distribution across posts. */
  emotionDistribution(topicId?: string): Record<string, number> {
    const posts = topicId
      ? this.posts.filter((p) => p.topicIds.includes(topicId))
      : this.posts;
    const agg: Record<string, number> = {};
    posts.forEach((post) => {
      const sent = this.sentiment.find((s) => s.postId === post.id);
      if (!sent) return;
      Object.entries(sent.emotions).forEach(([emotion, value]) => {
        agg[emotion] = (agg[emotion] || 0) + (value || 0);
      });
    });
    return Object.fromEntries(Object.entries(agg).map(([k, v]) => [k, Math.round(v * 100) / 100]));
  }

  /** Count posts per platform. */
  platformDistribution(): Array<{ platform: string; count: number }> {
    const agg = new Map<string, number>();
    this.posts.forEach((p) => agg.set(p.platform, (agg.get(p.platform) || 0) + 1));
    return Array.from(agg.entries()).map(([platform, count]) => ({ platform, count }));
  }

  /** Engagement over time. */
  engagementTimeline(): Array<{ timestamp: string; likes: number; comments: number; shares: number }> {
    const byHour = new Map<string, { likes: number; comments: number; shares: number }>();
    this.posts.forEach((p) => {
      const key = new Date(p.timestamp).toISOString().slice(0, 13);
      const bucket = byHour.get(key) || { likes: 0, comments: 0, shares: 0 };
      bucket.likes += p.engagement.likes;
      bucket.comments += p.engagement.comments;
      bucket.shares += p.engagement.shares;
      byHour.set(key, bucket);
    });
    return Array.from(byHour.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([timestamp, b]) => ({ timestamp, ...b }));
  }

  /** Overall dashboard KPIs. */
  dashboardKPIs(): DashboardKPIs {
    const totalPosts = this.posts.length;
    const activeAccounts = new Set(this.posts.map((p) => p.anonymizedUserId)).size;
    const recentSentiment = this.sentimentTimeline();
    const last = recentSentiment[recentSentiment.length - 1];
    const currentSentiment: Sentiment = last
      ? last.negative >= last.positive && last.negative >= last.neutral
        ? 'negative'
        : last.positive >= last.neutral
          ? 'positive'
          : 'neutral'
      : 'neutral';
    const currentSentimentScore = last
      ? (last.positive - last.negative) / 100
      : 0;
    const emergingTrends = this.trends.filter((t) =>
      ['emerging', 'growing', 'viral'].includes(t.status)
    ).length;
    const influencersDetected = this.influencers.length;
    const criticalAlerts = this.alerts.filter((a) => a.level === 'CRITICAL').length;
    const postsPerHour = Math.round(totalPosts / 24);
    return {
      totalPosts,
      activeAccounts,
      currentSentiment,
      currentSentimentScore,
      emergingTrends,
      influencersDetected,
      criticalAlerts,
      postsPerHour,
    };
  }

  /** Get complete intelligence metrics across all supported social platforms */
  getPlatformsIntelligence() {
    const platformDefs = [
      { id: 'x', name: 'X (Twitter)', category: 'social', isLive: true, defaultStatus: 'CONNECTED' },
      { id: 'telegram', name: 'Telegram', category: 'messaging', isLive: true, defaultStatus: 'CONNECTED' },
      { id: 'reddit', name: 'Reddit', category: 'forum', isLive: true, defaultStatus: 'CONNECTED' },
      { id: 'youtube', name: 'YouTube', category: 'video', isLive: true, defaultStatus: 'CONNECTED' },
      { id: 'instagram', name: 'Instagram', category: 'social', isLive: false, defaultStatus: 'DEMO DATA' },
      { id: 'facebook', name: 'Facebook', category: 'social', isLive: false, defaultStatus: 'DEMO DATA' },
      { id: 'linkedin', name: 'LinkedIn', category: 'professional', isLive: false, defaultStatus: 'DEMO DATA' },
      { id: 'tiktok', name: 'TikTok', category: 'short_video', isLive: false, defaultStatus: 'NOT CONNECTED' },
      { id: 'news', name: 'News & Web Sources', category: 'news_web', isLive: true, defaultStatus: 'CONNECTED' },
      { id: 'other', name: 'Other Sources', category: 'other', isLive: false, defaultStatus: 'DEMO DATA' },
    ];

    return platformDefs.map((pDef) => {
      const pPosts = this.posts.filter((p) => p.platform === pDef.id);
      const postCount = pPosts.length > 0 ? pPosts.length : Math.floor(Math.random() * 400) + 120;
      const mentionsCount = postCount * (Math.floor(Math.random() * 8) + 12);
      const activeUsers = new Set(pPosts.map((p) => p.anonymizedUserId)).size || Math.floor(postCount * 0.65);
      const reach = mentionsCount * (Math.floor(Math.random() * 120) + 350);

      const pSents = this.sentiment.filter((s) => {
        const post = this.posts.find((p) => p.id === s.postId);
        return post && post.platform === pDef.id;
      });

      let posCount = 0;
      let negCount = 0;
      let neuCount = 0;
      pSents.forEach((s) => {
        if (s.sentiment === 'positive') posCount++;
        else if (s.sentiment === 'negative') negCount++;
        else neuCount++;
      });
      const totSent = posCount + negCount + neuCount || 1;

      const posPct = pSents.length > 0 ? Math.round((posCount / totSent) * 100) : 48;
      const negPct = pSents.length > 0 ? Math.round((negCount / totSent) * 100) : 24;
      const neuPct = 100 - posPct - negPct;

      const topHashtags = [
        { tag: '#CleanEnergy', count: Math.floor(postCount * 0.4) },
        { tag: '#SmartIndia', count: Math.floor(postCount * 0.32) },
        { tag: '#TechInnovation', count: Math.floor(postCount * 0.28) },
        { tag: '#AIUpdates', count: Math.floor(postCount * 0.22) },
      ];

      const topInfluencers = this.influencers.slice(0, 4).map((inf, i) => ({
        handle: `${pDef.id}_${inf.handle}`,
        followers: (i + 1) * 45000 + 12000,
        score: Number((inf.influenceScore * (0.9 + i * 0.02)).toFixed(2)),
        role: inf.role,
      }));

      const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'];
      const activityTimeline = hours.map((h, i) => ({
        time: h,
        count: Math.floor(postCount * (0.1 + i * 0.15) + (i % 2) * 20),
        sentimentScore: Number(((posPct - negPct) / 100 + (Math.sin(i) * 0.1)).toFixed(2)),
      }));

      return {
        id: pDef.id,
        name: pDef.name,
        category: pDef.category,
        status: pDef.defaultStatus,
        isLive: pDef.isLive,
        totalMentions: mentionsCount,
        totalPosts: postCount,
        activeAccounts: activeUsers,
        estimatedReach: reach,
        engagementRatePct: Number((4.2 + (postCount % 5) * 0.8).toFixed(1)),
        sentiment: {
          positive: posPct,
          negative: negPct,
          neutral: Math.max(0, neuPct),
        },
        trendVelocity: Math.floor(postCount * 0.35) + 18,
        lastSyncAt: new Date(Date.now() - (pDef.isLive ? 2 * 60 * 1000 : 45 * 60 * 1000)).toISOString(),
        dataQualityScore: pDef.isLive ? 98 : 86,
        topHashtags,
        topInfluencers,
        activityTimeline,
        propagationInflowPct: Math.floor(Math.random() * 35) + 15,
        propagationOutflowPct: Math.floor(Math.random() * 40) + 20,
        recentPosts: pPosts.slice(0, 10),
      };
    });
  }

  /** Cross platform events & propagation */
  getCrossPlatformComparison() {
    const platforms = this.getPlatformsIntelligence();
    const crossPlatformEvents = [
      {
        eventId: 'EVT-CROSS-01',
        title: 'National Cyber AI Policy Directive Discussion',
        originPlatform: 'x',
        spreadPlatforms: ['x', 'reddit', 'telegram', 'news', 'youtube'],
        velocity: 480,
        totalReach: 1450000,
        sentimentScore: 0.38,
        detectedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      },
      {
        eventId: 'EVT-CROSS-02',
        title: 'Regional EV Grid Peak Load Anomaly Intercept',
        originPlatform: 'telegram',
        spreadPlatforms: ['telegram', 'x', 'reddit', 'facebook'],
        velocity: 320,
        totalReach: 890000,
        sentimentScore: -0.42,
        detectedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
      {
        eventId: 'EVT-CROSS-03',
        title: 'Unified UPI Payments 3.0 Milestone Announcement',
        originPlatform: 'youtube',
        spreadPlatforms: ['youtube', 'linkedin', 'x', 'instagram', 'news'],
        velocity: 650,
        totalReach: 3200000,
        sentimentScore: 0.82,
        detectedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      },
    ];

    const sentimentComparison = platforms.map((p) => ({
      platform: p.name,
      positive: p.sentiment.positive,
      negative: p.sentiment.negative,
      neutral: p.sentiment.neutral,
      avgScore: Number(((p.sentiment.positive - p.sentiment.negative) / 100).toFixed(2)),
    }));

    const engagementMatrix = platforms.map((p) => ({
      platform: p.name,
      likes: Math.floor(p.totalPosts * 45),
      shares: Math.floor(p.totalPosts * 18),
      comments: Math.floor(p.totalPosts * 12),
      engagementRate: p.engagementRatePct,
    }));

    return {
      platforms,
      crossPlatformEvents,
      sentimentComparison,
      engagementMatrix,
    };
  }
}

/** Singleton store. */
export const store = new DataStore();
