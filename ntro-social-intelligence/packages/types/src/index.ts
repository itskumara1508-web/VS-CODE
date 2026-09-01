// ============================================================
// NTRO Social Intelligence - Core Type Definitions
// Normalized data model shared across all platforms.
// ============================================================

/** Supported social media platforms */
export type Platform =
  | 'x'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'reddit'
  | 'telegram'
  | 'linkedin'
  | 'tiktok'
  | 'news'
  | 'other'
  | 'mock';

/** Sentiment classification */
export type Sentiment = 'positive' | 'negative' | 'neutral';

/** Emotion classifications */
export type Emotion =
  | 'joy'
  | 'anger'
  | 'fear'
  | 'sadness'
  | 'surprise'
  | 'excitement'
  | 'anxiety'
  | 'supportive'
  | 'hostile'
  | 'neutral';

/** Stance classification */
export type Stance = 'support' | 'against' | 'neutral';

/** Trend classification */
export type TrendStatus =
  | 'emerging'
  | 'growing'
  | 'viral'
  | 'stable'
  | 'declining';

/** Alert severity levels */
export type AlertLevel = 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';

/** User roles */
export type UserRole = 'analyst' | 'administrator';

/** Kinds of network nodes */
export type NodeKind = 'user' | 'topic' | 'community';

/** Types of network edges */
export type EdgeType =
  | 'reply'
  | 'mention'
  | 'repost'
  | 'share'
  | 'interaction'
  | 'topic_association'
  | 'community_link';

/** Confidence metadata for AI inference */
export interface Confidence {
  score: number; // 0-1
  low: number; // 0-1 lower bound
  high: number; // 0-1 upper bound
}

/** Source of data: observed vs inferred */
export type Provenance = 'observed' | 'inferred';

/**
 * Normalized social media post/message record.
 * All platforms are mapped into this single schema.
 */
export interface Post {
  id: string;
  platform: Platform;
  anonymizedUserId: string;
  postId: string;
  parentPostId?: string | null;
  text: string;
  timestamp: string; // ISO-8601
  language: string;
  hashtags: string[];
  mentions: string[];
  engagement: EngagementMetrics;
  relationships: PostRelationships;
  location?: string | null;
  collectedAt: string; // ISO-8601
  topicIds: string[];
  provenance: Provenance;
}

/** Engagement metrics for a post */
export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  reposts: number;
  views?: number;
  reactions?: number;
}

/** Relationship tree of a post */
export interface PostRelationships {
  repliesTo?: string | null;
  repostsOf?: string | null;
  sharesOf?: string | null;
  mentions: string[];
  replyCount: number;
  repostCount: number;
  shareCount: number;
}

/** An anonymized user/account */
export interface AnonymizedUser {
  id: string;
  handle: string; // pseudonymized handle
  platform: Platform;
  displayName: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  bio: string;
  location?: string | null;
  language: string;
  createdAt: string;
  communities: string[];
  influenceScore: number; // 0-1
  isVerified?: boolean;
}

/** A topic/entity detected from content */
export interface Topic {
  id: string;
  name: string;
  aliases: string[];
  category?: string;
  description?: string;
  createdAt: string;
  provenance: Provenance;
}

/** Result of sentiment analysis */
export interface SentimentResult {
  postId: string;
  sentiment: Sentiment;
  sentimentScore: number; // -1 (negative) to +1 (positive)
  emotions: Record<Emotion, number>;
  stance: Stance;
  stanceScore: number; // -1 (against) to +1 (support)
  sarcasmProbability: number; // 0-1
  confidence: Confidence;
  topicSentiment?: Record<string, Sentiment>;
  analyzedAt: string;
  provenance: Provenance;
}

/** Aggregate demographic segment (privacy-preserving) */
export interface DemographicSegment {
  id: string;
  dimension: 'age' | 'language' | 'location' | 'interest' | 'profession';
  label: string;
  value: string;
  percentage: number; // 0-100
  sampleSize: number;
  confidence: Confidence;
  provenance: Provenance;
  updatedAt: string;
}

/** Trend / topic detection result */
export interface Trend {
  id: string;
  topicId: string;
  topicName: string;
  status: TrendStatus;
  mentionCount: number;
  mentionVelocity: number; // mentions per hour
  engagementVelocity: number; // engagements per hour
  uniqueUsers: number;
  sentimentChange: number;
  influencerParticipation: number; // 0-1
  firstSeenAt: string;
  lastSeenAt: string;
  growthRate: number; // percentage
  declineRate: number; // percentage
  predicted: boolean; // whether this is a prediction
  confidence: Confidence;
  relatedTopics: string[];
}

/** An influencer account */
export interface Influencer {
  userId: string;
  handle: string;
  platform: Platform;
  influenceScore: number; // 0-1
  degreeCentrality: number;
  betweennessCentrality: number;
  pagerank: number;
  communityIds: string[];
  topicIds: string[];
  engagementRate: number;
  role: 'amplifier' | 'bridge' | 'emerging' | 'authority' | 'hub';
}

/** A detected community in the network */
export interface Community {
  id: string;
  name: string;
  size: number;
  topicIds: string[];
  sentiment: Sentiment;
  sentimentScore: number;
  dominantLanguage: string;
  avgInfluence: number;
  createdAt: string;
  updatedAt: string;
}

/** Network node */
export interface NetworkNode {
  id: string;
  kind: NodeKind;
  label: string;
  metadata: Record<string, unknown>;
  x?: number;
  y?: number;
}

/** Network edge */
export interface NetworkEdge {
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  timestamp: string;
}

/** Alert record */
export interface Alert {
  id: string;
  level: AlertLevel;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  acknowledged: boolean;
  ackedBy?: string | null;
  metadata: Record<string, unknown>;
}

/** AI-generated insight */
export interface AIInsight {
  id: string;
  kind: string;
  title: string;
  summary: string;
  confidence: Confidence;
  evidence: AIEvidence[];
  createdAt: string;
  relatedTopicIds: string[];
  relatedCommunityIds: string[];
  relatedUserIds: string[];
}

/** Supporting evidence for an AI insight */
export interface AIEvidence {
  type: string;
  label: string;
  value: string | number | boolean;
  timestamp?: string;
}

/** Timeline event */
export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  postIds: string[];
  topicId?: string | null;
  description: string;
  metadata: Record<string, unknown>;
}

/** A generated report */
export interface Report {
  id: string;
  title: string;
  createdAt: string;
  createdBy: string;
  format: 'pdf' | 'csv' | 'json';
  data: Record<string, unknown>;
}

/** Dashboard KPIs */
export interface DashboardKPIs {
  totalPosts: number;
  activeAccounts: number;
  currentSentiment: Sentiment;
  currentSentimentScore: number;
  emergingTrends: number;
  influencersDetected: number;
  criticalAlerts: number;
  postsPerHour: number;
}

/** API health status */
export interface HealthStatus {
  service: string;
  status: 'ok' | 'degraded' | 'down';
  version: string;
  uptime: number;
  timestamp: string;
  checks: Record<string, boolean>;
}

/** AI analyst question request/response */
export interface AnalystQuery {
  question: string;
  context?: Record<string, unknown>;
}

export interface AnalystResponse {
  answer: string;
  insights: AIInsight[];
  confidence: Confidence;
  generatedAt: string;
}

/** API error response */
export interface APIError {
  error: string;
  message: string;
  code: number;
  timestamp: string;
  details?: Record<string, unknown>;
}

/** Pagination */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Data source connector status */
export type DataSourceStatus = 'CONNECTED' | 'DISCONNECTED' | 'DEMO_MODE' | 'RATE_LIMITED' | 'ERROR';

export interface DataSource {
  id: string;
  name: string;
  platform: Platform;
  status: DataSourceStatus;
  rateLimitRemaining: number;
  rateLimitMax: number;
  eventsIngested: number;
  lastSyncAt: string;
  isPriority: boolean;
  credentialsConfigured: boolean;
}

/** Comprehensive System Health item */
export interface SystemServiceHealth {
  id: string;
  name: string;
  type: 'backend' | 'ai' | 'database' | 'cache' | 'graph' | 'stream' | 'ingestion';
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  latencyMs: number;
  uptime: string;
  activeConnections: number;
  details?: Record<string, string | number | boolean>;
}

/** Event Intelligence Differentiator Model */
export interface PropagationStep {
  step: number;
  time: string;
  fromEntity: string;
  toEntity: string;
  type: 'mention' | 'repost' | 'cross_community' | 'amplification';
  description: string;
  sentimentDelta: number;
}

export interface EventIntelligenceData {
  topicId: string;
  topicName: string;
  startedAt: string;
  currentMentions: number;
  growthRate: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topInfluencer: {
    name: string;
    handle: string;
    influenceScore: number;
    role: string;
  };
  communitiesAffected: number;
  propagationPath: string[];
  propagationSteps: PropagationStep[];
  aiSummary: string;
  confidence: Confidence;
  evidence: AIEvidence[];
}

/** Demo Scenario Engine Models */
export type DemoScenarioId =
  | 'emerging_trend'
  | 'sentiment_shift'
  | 'rapid_propagation'
  | 'influencer_amplification'
  | 'cross_platform'
  | 'community_polarization';

export interface DemoScenario {
  id: DemoScenarioId;
  title: string;
  category: string;
  description: string;
  durationMinutes: number;
  highlightMetric: string;
  affectedTopic: string;
  stagesCount: number;
}

/** Topic Forecasting Model */
export interface TopicForecast {
  topicId: string;
  topicName: string;
  currentVolume: number;
  growthRate: number;
  historicalGrowth: number[];
  momentum: 'HIGH' | 'MEDIUM' | 'LOW';
  forecastTrajectory: Array<{ time: string; predictedVolume: number; lowerBound: number; upperBound: number }>;
  forecastSummary: string;
  confidenceScore: number;
}

/** Account Detailed Intelligence Model */
export interface AccountDetail {
  id: string;
  handle: string;
  platform: Platform;
  displayName: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  bio: string;
  location?: string | null;
  language: string;
  communities: string[];
  influenceScore: number;
  pagerank: number;
  betweenness: number;
  degreeCentrality: number;
  activityVolume: number;
  sentimentAssociation: { positive: number; neutral: number; negative: number };
  topTopics: string[];
  interactionPatterns: { replyRate: number; repostRate: number; broadcastRate: number };
  influenceHistory: Array<{ timestamp: string; score: number }>;
}

/** Data Quality Telemetry */
export interface DataQualityMetrics {
  missingDataPct: number;
  duplicateRecordsPct: number;
  invalidTimestampsPct: number;
  languageDetectionSuccessPct: number;
  aiConfidenceAvgPct: number;
  apiFailuresCount: number;
  processingLatencyMs: number;
  overallQualityScore: number; // 0-100
}

/** Audit Logging Entry */
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED';
  details?: string;
}

/** Saved Investigation Dossier */
export interface SavedInvestigation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  topic: string;
  timeRange: string;
  filters: Record<string, string | undefined>;
  notes: string;
  tags: string[];
  pinnedKPIs: { posts: number; sentimentDelta: string; influencers: number };
}

/** Analyst Watchlist Monitor */
export interface WatchlistItem {
  id: string;
  entityType: 'topic' | 'account' | 'hashtag' | 'community';
  name: string;
  targetId: string;
  sensitivityThresholdPct: number;
  currentVelocity: number;
  lastActive: string;
  alertTriggered: boolean;
}

/** Semantic Topic Relationship Map */
export interface TopicRelationNode {
  id: string;
  name: string;
  volume: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  connections: Array<{ targetId: string; targetName: string; similarity: number }>;
}

// ============================================================
// NTRO SOCIOINTELL v2 Specification - Advanced Type Extensions
// ============================================================

/** Investigation Case Folder Status & Priority */
export type InvestigationStatus = 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'CLOSED';
export type InvestigationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Pinned item types inside an investigation */
export type InvestigationItemType = 'post' | 'account' | 'topic' | 'alert' | 'graph_cluster' | 'insight';

export interface InvestigationItem {
  id: string;
  type: InvestigationItemType;
  title: string;
  referenceId: string;
  data: Record<string, unknown>;
  pinnedAt: string;
  pinnedBy: string;
  annotation?: string;
}

export interface AnalystNote {
  id: string;
  author: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface Investigation {
  id: string;
  caseNumber: string; // e.g. "NTRO-2026-089"
  title: string;
  description: string;
  status: InvestigationStatus;
  priority: InvestigationPriority;
  targetTopic?: string;
  timeRange: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  pinnedItems: InvestigationItem[];
  notes: AnalystNote[];
  summaryMetrics?: {
    totalPosts: number;
    flaggedAccounts: number;
    dominantSentiment: Sentiment;
    threatScore: number;
  };
}

/** Analyst Watchlist Keyword & Account Rule */
export type WatchlistType = 'keyword' | 'account' | 'hashtag' | 'topic';

export interface WatchlistRule {
  id: string;
  name: string;
  type: WatchlistType;
  query: string; // e.g. "grid outage", "@suspect_node", "#protest"
  alertLevel: AlertLevel;
  enabled: boolean;
  sensitivityThreshold: number; // 1-100
  matchesCount: number;
  lastMatchAt?: string;
  createdAt: string;
  createdBy: string;
}

export interface WatchlistMatch {
  id: string;
  ruleId: string;
  ruleName: string;
  postId: string;
  platform: Platform;
  author: string;
  text: string;
  matchedTerm: string;
  timestamp: string;
  severity: AlertLevel;
}

/** Period-Over-Period Comparison Mode */
export interface PeriodMetrics {
  label: string;
  range: string;
  kpis: DashboardKPIs;
  sentimentDistribution: { positive: number; negative: number; neutral: number };
  volumePerHour: Array<{ time: string; count: number }>;
}

export interface ComparisonData {
  currentPeriod: PeriodMetrics;
  previousPeriod: PeriodMetrics;
  deltas: {
    postsChangePct: number;
    activeAccountsChangePct: number;
    sentimentShiftPct: number;
    postsPerHourChangePct: number;
    emergingTrendsDiff: number;
    criticalAlertsDiff: number;
    influencersChangePct: number;
  };
}

/** Coordinated / Bot Behavior & Narrative Manipulation Heuristic */
export interface BotScore {
  userId: string;
  handle: string;
  score: number; // 0-100
  postingFrequencyRegularity: number; // 0-100
  duplicateContentRatio: number; // 0-100
  accountAgeDays: number;
  flaggedReasons: string[];
  disclaimer: string;
}

export interface CoordinationAnalysis {
  topicId: string;
  topicName: string;
  coordinationScore: number; // 0-100
  isManipulatedHeuristic: boolean;
  burstVelocity: number; // posts/minute in surge
  repetitionRatio: number; // 0-1
  clusterSize: number;
  flaggedAccounts: Array<{ handle: string; botScore: number; reason: string }>;
  methodologyDisclaimer: string;
}

/** AI Explainability Evidence Trail */
export interface EvidenceTrailStep {
  step: number;
  stage: string;
  queryExecuted: string;
  parameters: Record<string, unknown>;
  recordsScanned: number;
  recordsMatched: number;
  confidenceContribution: number;
  observation: string;
}

export interface AIExplanation {
  insightId: string;
  title: string;
  generatedAt: string;
  modelIdentifier: string;
  confidenceScore: number;
  dataWindow: { start: string; end: string };
  totalCorpusSize: number;
  sampleAnalyzedCount: number;
  samplingMethod: string;
  primaryHypothesis: string;
  evidenceSteps: EvidenceTrailStep[];
  auditHash: string;
}

/** Forensic Chain-of-Custody Metadata */
export interface ChainOfCustody {
  reportId: string;
  classification: 'UNCLASSIFIED' | 'RESTRICTED // NTRO' | 'CONFIDENTIAL' | 'SECRET';
  generatedAt: string;
  generatedBy: string;
  analystRole: string;
  dataTimeRange: string;
  recordCount: number;
  systemNodeId: string;
  cryptographicHash: string; // SHA-256
  digitalSignature: string;
  exportFormat: string;
}




/** Dedicated Social Platform Intelligence Model */
export interface PlatformIntelligence {
  id: Platform;
  name: string;
  iconName: string;
  category: 'social' | 'video' | 'messaging' | 'forum' | 'professional' | 'short_video' | 'news_web' | 'other';
  status: 'CONNECTED' | 'NOT CONNECTED' | 'DEMO DATA' | 'DEGRADED';
  isLive: boolean;
  totalMentions: number;
  totalPosts: number;
  activeAccounts: number;
  estimatedReach: number;
  engagementRatePct: number;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  trendVelocity: number; // events/hr
  lastSyncAt: string;
  dataQualityScore: number; // 0-100
  topHashtags: Array<{ tag: string; count: number }>;
  topInfluencers: Array<{ handle: string; followers: number; score: number; role: string }>;
  activityTimeline: Array<{ time: string; count: number; sentimentScore: number }>;
  propagationInflowPct: number;
  propagationOutflowPct: number;
  recentPosts: Post[];
}

export interface CrossPlatformComparison {
  platforms: PlatformIntelligence[];
  crossPlatformEvents: Array<{
    eventId: string;
    title: string;
    originPlatform: Platform;
    spreadPlatforms: Platform[];
    velocity: number;
    totalReach: number;
    sentimentScore: number;
    detectedAt: string;
  }>;
  sentimentComparison: Array<{
    platform: string;
    positive: number;
    negative: number;
    neutral: number;
    avgScore: number;
  }>;
  engagementMatrix: Array<{
    platform: string;
    likes: number;
    shares: number;
    comments: number;
    engagementRate: number;
  }>;
}
