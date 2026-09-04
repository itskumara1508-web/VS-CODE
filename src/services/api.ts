import {
  KPIMetrics,
  PlatformSource,
  SentimentTimePoint,
  EmotionDistribution,
  DemographicData,
  TrendItem,
  NetworkNode,
  NetworkEdge,
  NarrativeStep,
  AIInsight,
  SarcasmAnalysis,
  IngestionEvent,
} from '../types';
import {
  initialKPIMetrics,
  platformSources,
  sentimentTimeline24H,
  sentimentTimeline7D,
  sentimentTimeline30D,
  emotionBreakdown,
  audienceDemographics,
  risingNarratives,
  networkNodes,
  networkEdges,
  narrativeFlowSteps,
  aiIntelligenceInsights,
  initialIngestionEvents,
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class IntelligenceAPIService {
  private isBackendAvailable: boolean | null = null;

  private async fetchFromBackend<T>(endpoint: string, fallback: T): Promise<T> {
    if (!API_BASE_URL) {
      return fallback;
    }

    // When deployed on HTTPS (e.g., GitHub Pages), block insecure HTTP requests to prevent mixed content errors
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    if (isHttps && API_BASE_URL.startsWith('http://')) {
      return fallback;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Version': 'PulseX-1.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }

      this.isBackendAvailable = true;
      return await response.json();
    } catch (err) {
      if (this.isBackendAvailable !== false) {
        console.info(
          `[PulseX Intelligence Service] Backend at ${API_BASE_URL} is unreachable. Operating seamlessly in high-fidelity simulation mode.`,
          err
        );
        this.isBackendAvailable = false;
      }
      return fallback;
    }
  }

  async getKPIMetrics(): Promise<KPIMetrics> {
    return this.fetchFromBackend<KPIMetrics>('/metrics/kpi', initialKPIMetrics);
  }

  async getSources(): Promise<PlatformSource[]> {
    return this.fetchFromBackend<PlatformSource[]>('/sources', platformSources);
  }

  async getRecentIngestionEvents(): Promise<IngestionEvent[]> {
    return this.fetchFromBackend<IngestionEvent[]>('/sources/events', initialIngestionEvents);
  }

  async getSentimentTimeline(range: '24H' | '7D' | '30D'): Promise<SentimentTimePoint[]> {
    let fallback = sentimentTimeline24H;
    if (range === '7D') fallback = sentimentTimeline7D;
    if (range === '30D') fallback = sentimentTimeline30D;

    return this.fetchFromBackend<SentimentTimePoint[]>(`/sentiment/timeline?range=${range}`, fallback);
  }

  async getEmotionDistribution(): Promise<EmotionDistribution[]> {
    return this.fetchFromBackend<EmotionDistribution[]>('/sentiment/emotions', emotionBreakdown);
  }

  async getDemographics(): Promise<DemographicData> {
    return this.fetchFromBackend<DemographicData>('/audience/demographics', audienceDemographics);
  }

  async getTrends(): Promise<TrendItem[]> {
    return this.fetchFromBackend<TrendItem[]>('/trends/rising', risingNarratives);
  }

  async getNetworkTopology(): Promise<{ nodes: NetworkNode[]; edges: NetworkEdge[] }> {
    return this.fetchFromBackend<{ nodes: NetworkNode[]; edges: NetworkEdge[] }>('/network/topology', {
      nodes: networkNodes,
      edges: networkEdges,
    });
  }

  async getNarrativeFlow(): Promise<NarrativeStep[]> {
    return this.fetchFromBackend<NarrativeStep[]>('/intelligence/narrative-flow', narrativeFlowSteps);
  }

  async getAIInsights(): Promise<AIInsight[]> {
    return this.fetchFromBackend<AIInsight[]>('/intelligence/insights', aiIntelligenceInsights);
  }

  async analyzeCustomPost(text: string): Promise<SarcasmAnalysis> {
    const fallback: SarcasmAnalysis = this.inferNuanceClientSide(text);
    return this.fetchFromBackend<SarcasmAnalysis>('/analysis/sarcasm', fallback);
  }

  private inferNuanceClientSide(text: string): SarcasmAnalysis {
    const lower = text.toLowerCase();
    const hasSarcasticTone =
      lower.includes('🙄') ||
      lower.includes('great job') ||
      lower.includes('amazing update') ||
      lower.includes('wow') ||
      lower.includes('brilliant') ||
      lower.includes('/s');

    const hasCriticalContent =
      lower.includes('broken') ||
      lower.includes('leak') ||
      lower.includes('down') ||
      lower.includes('fail') ||
      lower.includes('error') ||
      lower.includes('useless') ||
      lower.includes('terrible');

    const isSarcastic = hasSarcasticTone && (hasCriticalContent || lower.includes('🙄'));

    if (isSarcastic) {
      return {
        id: `analysis-${Date.now()}`,
        postText: text,
        author: '@live_test_handle',
        platform: 'X',
        detectedNuance: 'Sarcasm',
        apparentSentiment: 'Positive',
        actualSentiment: 'Negative',
        confidence: 89,
        explanation: 'Heuristic polarity mismatch: Token praise masks operational criticism or cynical emoji syntax.',
        subtextKeywords: ['Lexical clash', 'Polarity inversion', 'Context divergence'],
      };
    }

    if (hasCriticalContent) {
      return {
        id: `analysis-${Date.now()}`,
        postText: text,
        author: '@live_test_handle',
        platform: 'Telegram',
        detectedNuance: 'Direct',
        apparentSentiment: 'Negative',
        actualSentiment: 'Negative',
        confidence: 94,
        explanation: 'Consistent negative tokens identified with zero hyperbolic conflict markers.',
        subtextKeywords: ['Direct critique', 'Risk register', 'Negative polarity'],
      };
    }

    return {
      id: `analysis-${Date.now()}`,
      postText: text,
      author: '@live_test_handle',
      platform: 'Reddit',
      detectedNuance: 'Direct',
      apparentSentiment: 'Positive',
      actualSentiment: 'Positive',
      confidence: 91,
      explanation: 'Constructive or supportive semantic framing observed across all detected token spans.',
      subtextKeywords: ['Supportive markers', 'High confidence', 'Valid sentiment'],
    };
  }
}

export const apiService = new IntelligenceAPIService();
