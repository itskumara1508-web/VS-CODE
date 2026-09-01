import type {
  DashboardKPIs,
  Paginated,
  Post,
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
  AnalystResponse,
  AnonymizedUser,
  Investigation,
  InvestigationItem,
  WatchlistRule,
  WatchlistMatch,
  ComparisonData,
  CoordinationAnalysis,
  AIExplanation,
  ChainOfCustody,
  PlatformIntelligence,
  CrossPlatformComparison,
} from '@ntro/types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'analyst' | 'administrator';
}

let token: string | null = null;

export function setToken(t: string | null) {
  token = t;
  if (typeof window !== 'undefined') {
    if (t) localStorage.setItem('ntro_token', t);
    else localStorage.removeItem('ntro_token');
  }
}

export function getToken(): string | null {
  if (token) return token;
  if (typeof window !== 'undefined') return localStorage.getItem('ntro_token');
  return null;
}

async function autoLogin(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'analyst@ntro.gov.in', password: 'Analyst@123' }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.token) {
        setToken(data.token);
        return data.token;
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  let t = getToken();
  if (!t && !path.includes('/api/auth/login')) {
    t = await autoLogin();
  }
  if (t) headers.Authorization = `Bearer ${t}`;

  let res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401 && !path.includes('/api/auth/login')) {
    t = await autoLogin();
    if (t) {
      headers.Authorization = `Bearer ${t}`;
      res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}


export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  health: () => request<{ status: string; service: string }>('/api/health'),
  dashboardSummary: () => request<{
    kpis: DashboardKPIs;
    sentimentTimeline: Array<{ timestamp: string; positive: number; negative: number; neutral: number }>;
    emotionDistribution: Record<string, number>;
    platformDistribution: Array<{ platform: string; count: number }>;
    engagementTimeline: Array<{ timestamp: string; likes: number; comments: number; shares: number }>;
    trendingTopics: Trend[];
    topInfluencers: Influencer[];
    criticalAlerts: Alert[];
    aiInsights: AIInsight[];
  }>('/api/dashboard/summary'),

  dashboardKPIs: () => request<DashboardKPIs>('/api/dashboard/kpis'),
  sentimentTimeline: (topicId?: string) =>
    request<Array<{ timestamp: string; positive: number; negative: number; neutral: number }>>(
      `/api/dashboard/sentiment-timeline${topicId ? `?topicId=${topicId}` : ''}`,
    ),
  emotionDistribution: (topicId?: string) =>
    request<Record<string, number>>(`/api/dashboard/emotion-distribution${topicId ? `?topicId=${topicId}` : ''}`),
  platformDistribution: () =>
    request<Array<{ platform: string; count: number }>>('/api/dashboard/platform-distribution'),
  engagementTimeline: () =>
    request<Array<{ timestamp: string; likes: number; comments: number; shares: number }>>(
      '/api/dashboard/engagement-timeline',
    ),

  posts: (params?: { page?: number; pageSize?: number; platform?: string; topicId?: string; sentiment?: string; language?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
    if (params?.platform) qs.set('platform', params.platform);
    if (params?.topicId) qs.set('topicId', params.topicId);
    if (params?.sentiment) qs.set('sentiment', params.sentiment);
    if (params?.language) qs.set('language', params.language);
    return request<Paginated<Post>>(`/api/posts?${qs.toString()}`);
  },
  post: (id: string) => request<{ post: Post; sentiment: SentimentResult | null }>(`/api/posts/${id}`),

  sentimentOverview: () =>
    request<{
      sentiment: Array<{ timestamp: string; positive: number; negative: number; neutral: number }>;
      emotions: Record<string, number>;
      counts: { positive: number; negative: number; neutral: number };
    }>('/api/sentiment/overview'),

  audienceSegments: (dimension?: string) =>
    request<DemographicSegment[]>(`/api/audience/segments${dimension ? `?dimension=${dimension}` : ''}`),
  audienceOverview: () =>
    request<{
      age: DemographicSegment[];
      language: DemographicSegment[];
      location: DemographicSegment[];
      profession: DemographicSegment[];
      note: string;
    }>('/api/audience/overview'),

  demographics: () => request<DemographicSegment[]>('/api/audience/segments'),
  trends: () => request<Trend[]>('/api/trends'),
  network: () => request<{ nodes: NetworkNode[]; edges: NetworkEdge[] }>('/api/network/graph'),
  networkGraph: () => request<{ nodes: NetworkNode[]; edges: NetworkEdge[] }>('/api/network/graph'),
  communities: () => request<Community[]>('/api/network/communities'),
  influencers: () => request<Influencer[]>('/api/network/influencers'),
  centrality: () =>
    request<{
      topByPageRank: Influencer[];
      topByBetweenness: Influencer[];
      topByDegree: Influencer[];
    }>('/api/network/centrality'),

  timelineEvents: (topicId?: string) =>
    request<TimelineEvent[]>(`/api/timeline/events${topicId ? `?topicId=${topicId}` : ''}`),
  timelinePosts: (params?: {
    page?: number; pageSize?: number; topicId?: string; platform?: string; sentiment?: string; language?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
    if (params?.topicId) qs.set('topicId', params.topicId);
    if (params?.platform) qs.set('platform', params.platform);
    if (params?.sentiment) qs.set('sentiment', params.sentiment);
    if (params?.language) qs.set('language', params.language);
    return request<Paginated<Post>>(`/api/timeline/posts?${qs.toString()}`);
  },

  alerts: () => request<Alert[]>('/api/alerts'),
  ackAlert: (id: string) => request<Alert>(`/api/alerts/${id}/ack`, { method: 'PATCH', body: '{}' }),
  insights: () => request<AIInsight[]>('/api/insights'),
  askAnalyst: (question: string) =>
    request<AnalystResponse & { message?: string }>('/api/insights/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
  demoEvent: () =>
    request<AnalystResponse & { demoEvent: TimelineEvent[] }>('/api/insights/demo', {
      method: 'POST',
      body: '{}',
    }),

  generateReport: (title: string, format: 'pdf' | 'csv' | 'json') =>
    request<Record<string, unknown>>('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ title, format }),
    }),

  dataSources: () => request<any[]>('/api/datasources'),
  toggleDataSource: (id: string) =>
    request<any>(`/api/datasources/${id}/toggle`, { method: 'PATCH', body: '{}' }),

  systemHealth: () =>
    request<{ status: string; services: any[]; timestamp: string }>('/api/system/health'),

  eventIntelligence: (topicId?: string) =>
    request<any>(`/api/insights/event-intelligence${topicId ? `/${topicId}` : ''}`),

  startDemo: () =>
    request<{ status: string; step: number }>('/api/demo/start', { method: 'POST', body: '{}' }),
  stopDemo: () =>
    request<{ status: string }>('/api/demo/stop', { method: 'POST', body: '{}' }),
  stepDemoEvent: () =>
    request<{ status: string; step: number; event: any; timeline: any[] }>('/api/demo/event', {
      method: 'POST',
      body: '{}',
    }),

  // Investigations Case Folders (§5.9)
  investigations: () => request<Investigation[]>('/api/investigations'),
  investigation: (id: string) => request<Investigation>(`/api/investigations/${id}`),
  createInvestigation: (data: { title: string; description: string; priority?: string; targetTopic?: string; timeRange?: string; tags?: string[] }) =>
    request<Investigation>('/api/investigations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  pinInvestigationItem: (caseId: string, item: { type: string; title: string; referenceId: string; data?: Record<string, unknown>; annotation?: string }) =>
    request<Investigation>(`/api/investigations/${caseId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  addInvestigationNote: (caseId: string, text: string, author?: string) =>
    request<Investigation>(`/api/investigations/${caseId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text, author }),
    }),
  updateInvestigation: (id: string, data: Partial<Investigation>) =>
    request<Investigation>(`/api/investigations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteInvestigation: (id: string) =>
    request<{ success: boolean }>(`/api/investigations/${id}`, { method: 'DELETE' }),
  investigationReport: (id: string) =>
    request<{ investigation: Investigation; chainOfCustody: ChainOfCustody; executiveSummary: string; exportUrl: string }>(`/api/investigations/${id}/report`),

  // Watchlists & Keyword Monitoring (§5.10)
  watchlists: () => request<{ rules: WatchlistRule[]; matches: WatchlistMatch[]; stats: { totalRules: number; activeRules: number; totalMatches24h: number } }>('/api/watchlists'),
  createWatchlistRule: (data: { name: string; type: string; query: string; alertLevel?: string; sensitivityThreshold?: number }) =>
    request<WatchlistRule>('/api/watchlists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  toggleWatchlistRule: (id: string) =>
    request<WatchlistRule>(`/api/watchlists/${id}/toggle`, { method: 'PATCH', body: '{}' }),
  deleteWatchlistRule: (id: string) =>
    request<{ success: boolean }>(`/api/watchlists/${id}`, { method: 'DELETE' }),

  // Comparison Mode (§5.1)
  comparePeriod: (range = '6h', vs = 'prev_6h') =>
    request<ComparisonData>(`/api/compare?range=${range}&vs=${vs}`),

  // Coordinated Amplification & Bot Heuristic (§5.5, §5.6)
  coordinationAnalysis: (topicId?: string) =>
    request<CoordinationAnalysis>(`/api/insights/coordination${topicId ? `/${topicId}` : ''}`),

  // AI Explainability Evidence Trail (§5.11)
  aiExplainability: (insightId?: string) =>
    request<AIExplanation>(`/api/insights/explain${insightId ? `/${insightId}` : ''}`),

  // Social Platforms Intelligence
  platforms: () => request<{ success: boolean; data: PlatformIntelligence[] }>('/api/platforms'),
  platformDetails: (id: string) => request<{ success: boolean; data: PlatformIntelligence }>(`/api/platforms/${id}`),
  platformsCompare: () => request<{ success: boolean; data: CrossPlatformComparison }>('/api/platforms/compare'),
  syncPlatform: (id: string) =>
    request<{ success: boolean; message: string; data: PlatformIntelligence }>(`/api/platforms/${id}/sync`, {
      method: 'POST',
      body: '{}',
    }),
};
