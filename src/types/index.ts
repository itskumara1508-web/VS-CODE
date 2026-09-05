export type Platform = 'X' | 'Telegram' | 'Instagram' | 'Facebook' | 'Reddit' | 'YouTube';

export interface KPIMetrics {
  sentimentIndex: number;
  sentimentChange: number;
  trendVelocity: number;
  velocityChange: number;
  influenceScore: number;
  influenceChange: number;
  audienceReach: string;
  reachChange: number;
  totalPosts: number;
  activeUsers: number;
  trendingTopicsCount: number;
  totalInteractions: number;
  activeCommunities: number;
}

export interface PlatformSource {
  id: string;
  name: Platform;
  fullName: string;
  status: 'Connected' | 'Demo' | 'Degraded';
  postsCollected: number;
  commentsCollected: number;
  interactions: number;
  lastSync: string;
  apiLatencyMs: number;
  healthScore: number;
  icon: string;
  color: string;
  description: string;
}

export interface IngestionEvent {
  id: string;
  time: string;
  platform: Platform;
  count: number;
  type: 'posts' | 'messages' | 'comments' | 'videos';
  sampleText: string;
  sentiment: 'supportive' | 'against' | 'anxiety' | 'excitement' | 'neutral';
  language: 'Hindi' | 'English' | 'Hinglish' | 'Other';
}

export interface SentimentTimePoint {
  time: string;
  supportive: number;
  against: number;
  anxiety: number;
  excitement: number;
  neutral: number;
  compositeScore: number;
}

export interface EmotionDistribution {
  name: string;
  value: number;
  color: string;
  description: string;
}

export interface SarcasmAnalysis {
  id: string;
  postText: string;
  author: string;
  platform: Platform;
  detectedNuance: 'Sarcasm' | 'Innuendo' | 'Hyperbole' | 'Direct';
  apparentSentiment: 'Positive' | 'Neutral' | 'Negative';
  actualSentiment: 'Negative' | 'Neutral' | 'Positive';
  confidence: number;
  explanation: string;
  subtextKeywords: string[];
}

export interface DemographicData {
  age: { range: string; percentage: number }[];
  languages: { language: string; percentage: number; nativeName: string }[];
  geography: { region: string; percentage: number; coordinates: [number, number]; count: number }[];
  interests: { name: string; score: number; trend: 'up' | 'stable' | 'down' }[];
  confidence: number;
  disclaimer: string;
}

export interface TrendItem {
  rank: number;
  topic: string;
  growth: number;
  mentions: number;
  uniqueUsers: number;
  velocity: number;
  status: 'VIRAL' | 'RISING' | 'STABLE' | 'DECLINING';
  sparkline: number[];
  category: string;
  sentimentRatio: { pos: number; neu: number; neg: number };
  predictedPeak: string;
  predictionConfidence: number;
  originCommunity: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  handle: string;
  role: 'KOL' | 'Bridge' | 'Community' | 'Normal';
  influenceScore: number;
  pagerank: number;
  betweenness: number;
  degree: number;
  communityId: number;
  communityName: string;
  platform: Platform;
  sentiment: 'Supportive' | 'Against' | 'Anxiety' | 'Excitement' | 'Neutral';
  connectionsCount: number;
  amplifiedTopics: string[];
  x: number;
  y: number;
  size: number;
  color: string;
  activityHistory: { time: string; activity: number }[];
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'reply' | 'retweet' | 'mention' | 'forward' | 'quote';
  weight: number;
  activePacket?: boolean;
}

export interface NarrativeStep {
  stepNumber: number;
  title: string;
  phase: string;
  description: string;
  detail: string;
  actors: string[];
  metrics: { label: string; value: string; delta?: string }[];
  activeCommunity: string;
  platforms: Platform[];
  sentimentShiftText?: string;
  confidenceScore: number;
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  confidence: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  category: 'Anomaly' | 'Amplification' | 'Sentiment Drift' | 'Viral Prediction';
  supportingMetrics: { label: string; value: string }[];
  recommendedAction: string;
  relatedEntities: string[];
}

export interface AuthUser {
  name: string;
  badgeId: string;
  role: string;
  clearance: string;
  loginTime?: string;
}
