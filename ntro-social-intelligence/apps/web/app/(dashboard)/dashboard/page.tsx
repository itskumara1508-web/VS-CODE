'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  Crown,
  Play,
  Zap,
  Smile,
  Frown,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Layers,
  Share2,
  History,
  Calendar,
  Compass,
  FileText,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { KpiCard, Panel, PanelTitle, Badge, LoadingState, ErrorState } from '@/components/ui';
import Card3D from '@/components/Card3D';
import Network3DGraph from '@/components/Network3DGraph';
import HolographicRadar3D from '@/components/HolographicRadar3D';
import {
  SentimentAreaChart,
  EmotionPieChart,
  PlatformBarChart,
  EngagementLineChart,
} from '@/components/charts';
import DemoScenarioModal from '@/components/DemoScenarioModal';
import EvidenceModal from '@/components/EvidenceModal';
import AccountDetailModal from '@/components/AccountDetailModal';
import GlobalFilterBar, { type GlobalFilterState } from '@/components/GlobalFilterBar';
import type { DashboardKPIs, Trend, Influencer, Alert, AIInsight, DemoScenarioId } from '@ntro/types';

interface Summary {
  kpis: DashboardKPIs;
  sentimentTimeline: Array<{ timestamp: string; positive: number; negative: number; neutral: number }>;
  emotionDistribution: Record<string, number>;
  platformDistribution: Array<{ platform: string; count: number }>;
  engagementTimeline: Array<{ timestamp: string; likes: number; comments: number; shares: number }>;
  trendingTopics: Trend[];
  topInfluencers: Influencer[];
  criticalAlerts: Alert[];
  aiInsights: AIInsight[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Summary | null>(null);
  const [networkData, setNetworkData] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [error, setError] = useState<string | null>(null);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [activeRange, setActiveRange] = useState<'15m' | '1h' | '6h' | '24h' | '7d' | '30d' | 'custom'>('24h');
  const [compareMode, setCompareMode] = useState(false);
  const [compareData, setCompareData] = useState<any>(null);

  const fetchSummary = () => {
    Promise.all([api.dashboardSummary(), api.network(), api.comparePeriod(activeRange)])
      .then(([summary, net, cmp]) => {
        setData(summary);
        setNetworkData(net);
        setCompareData(cmp);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  };

  useEffect(() => {
    fetchSummary();
  }, [activeRange]);

  const handleStartSimulation = (scenarioId: DemoScenarioId) => {
    fetchSummary();
  };

  const handleOpenAccount = (inf: any) => {
    const handle = inf.handle || inf.label || 'analyst_node';
    setSelectedAccount({
      id: inf.userId || inf.id || 'usr_node',
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      platform: inf.platform || 'x',
      displayName: (inf.handle || inf.label || 'Node').replace('@', '').replace('_', ' ').toUpperCase(),
      followerCount: Math.floor((inf.influenceScore || 0.8) * 48000) + 2500,
      followingCount: Math.floor(Math.random() * 800) + 120,
      postCount: Math.floor((inf.degreeCentrality || 0.5) * 120) + 45,
      bio: 'Verified Network Node • Cross-Community Bridge & Telemetry Anchor.',
      language: 'English, Hindi',
      communities: inf.communityIds || ['Tech Enthusiasts'],
      influenceScore: inf.influenceScore,
      pagerank: inf.pagerank,
      betweenness: inf.betweennessCentrality,
      degreeCentrality: inf.degreeCentrality,
      activityVolume: Math.floor(inf.engagementRate * 500) + 80,
      sentimentAssociation: { positive: 45, neutral: 25, negative: 30 },
      topTopics: ['EV Charging Infrastructure', '5G Telecom', 'Grid Reliability'],
      interactionPatterns: { replyRate: 42, repostRate: 38, broadcastRate: 20 },
      influenceHistory: [
        { timestamp: '10:00', score: 0.65 },
        { timestamp: '12:00', score: 0.72 },
        { timestamp: '14:00', score: inf.influenceScore },
      ],
    });
    setAccountModalOpen(true);
  };

  const handleOpenEvidence = (insight: AIInsight) => {
    setSelectedEvidence({
      title: insight.title,
      claim: insight.summary,
      confidence: insight.confidence,
      evidenceItems: insight.evidence,
      topicName: 'EV Charging Infrastructure',
    });
    setEvidenceModalOpen(true);
  };

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState message="Connecting to SOCIOINTELL Social Intelligence Console..." />;

  const isPositive = data.kpis.currentSentiment === 'positive';
  const isNegative = data.kpis.currentSentiment === 'negative';

  return (
    <div className="space-y-6">
      {/* Top Banner & SIH Demo Scenario Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">SOCIOINTELL Command Center Overview</h1>
            <Badge variant="teal">LIVE INGESTION ACTIVE</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            AI-Powered Social Media Intelligence • Understand. Analyze. Predict.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Comparison Mode Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`text-xs py-1.5 px-3 rounded-xl font-mono font-bold flex items-center gap-1.5 transition-all border ${
              compareMode
                ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'bg-[#111C35] text-[#94A3B8] border-[#1E3156] hover:text-white'
            }`}
          >
            <span>{compareMode ? 'COMPARISON: ON' : 'COMPARE PERIODS'}</span>
            <span className="text-[10px] opacity-70">({activeRange} vs Prev)</span>
          </button>

          <button
            onClick={() => setScenarioModalOpen(true)}
            className="btn btn-amber text-xs py-1.5 px-4 font-bold flex items-center gap-2 shadow-glowAmber"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>START SIH DEMO</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <GlobalFilterBar onFilterChange={(f) => setActiveRange(f.dateRange)} />

      {/* 8 Primary Command-Center 3D Tilt KPI Cards with Comparison Mode Deltas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card3D glowColor="teal" intensity={12}>
          <KpiCard
            label="Total Posts"
            value={data.kpis.totalPosts.toLocaleString()}
            icon={<MessageSquare className="w-4 h-4" />}
            trend={compareMode ? "▲ +13.6% vs Prev" : "+12.4% / 24h"}
            trendDirection="up"
            accentColor="teal"
          />
        </Card3D>
        <Card3D glowColor="cyan" intensity={12}>
          <KpiCard
            label="Posts / Hour"
            value={data.kpis.postsPerHour || 5190}
            icon={<Activity className="w-4 h-4" />}
            trend={compareMode ? "▲ +22.0% Surge" : "124 msg/sec"}
            trendDirection="up"
            accentColor="cyan"
          />
        </Card3D>
        <Card3D glowColor="teal" intensity={12}>
          <KpiCard
            label="Active Accounts"
            value={data.kpis.activeAccounts.toLocaleString()}
            icon={<Users className="w-4 h-4" />}
            trend={compareMode ? "▲ +6.4% Reach" : "Pan-India Nodes"}
            trendDirection="up"
            accentColor="teal"
          />
        </Card3D>
        <Card3D glowColor="cyan" intensity={12}>
          <KpiCard
            label="Total Engagement"
            value="482.4K"
            icon={<Radio className="w-4 h-4" />}
            trend={compareMode ? "▲ +18.5% Growth" : "+18.5% Growth"}
            trendDirection="up"
            accentColor="cyan"
          />
        </Card3D>
        <Card3D glowColor="amber" intensity={12}>
          <KpiCard
            label="Emerging Trends"
            value={data.kpis.emergingTrends || 27}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={compareMode ? "▲ +5 New Topics" : "4 Viral Topics"}
            trendDirection="up"
            accentColor="amber"
          />
        </Card3D>
        <Card3D glowColor="rose" intensity={12}>
          <KpiCard
            label="Critical Alerts"
            value={data.criticalAlerts.length || 3}
            icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
            trend={compareMode ? "▲ +3 Anomaly Alarms" : "Immediate Action"}
            trendDirection="down"
            accentColor="rose"
          />
        </Card3D>
        <Card3D glowColor="teal" intensity={12}>
          <KpiCard
            label="Influencers"
            value={data.kpis.influencersDetected || 84}
            icon={<Crown className="w-4 h-4" />}
            trend="PageRank > 0.8"
            trendDirection="neutral"
            accentColor="teal"
          />
        </Card3D>
        <Card3D glowColor="cyan" intensity={12}>
          <KpiCard
            label="Communities"
            value="6 Clusters"
            icon={<Share2 className="w-4 h-4" />}
            trend="Modularity: 0.74"
            trendDirection="neutral"
            accentColor="cyan"
          />
        </Card3D>
      </div>

      {/* Feature 14: AI Executive Briefing & Quick Action Drawers */}
      <Panel className="bg-white border-slate-200 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#0062FF]" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              AI Strategic Executive Briefing & Telemetry Synthesis ({activeRange.toUpperCase()})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
              96.4% Synthesis Veracity
            </span>
            <button
              onClick={() => router.push('/ai-analyst')}
              className="text-[11px] font-mono text-[#0062FF] hover:underline flex items-center gap-1 font-semibold"
            >
              Ask AI Analyst →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-[#0062FF]/40 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#0062FF] rounded-l" />
            <div className="text-[10.5px] font-mono font-bold text-[#0062FF] uppercase flex items-center justify-between">
              <span>1. Key Developments</span>
              <span className="text-[9px] text-slate-500 font-normal">+243% Velocity</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Discourse on &quot;EV Charging Infrastructure&quot; escalated rapidly following regional grid outages, accelerating at +243% growth velocity across 4 major urban hubs.
            </p>
          </div>

          <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-[#EF4444]/40 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#EF4444] rounded-l" />
            <div className="text-[10.5px] font-mono font-bold text-[#EF4444] uppercase flex items-center justify-between">
              <span>2. Sentiment & Threat Shift</span>
              <span className="text-[9px] text-[#EF4444] font-bold">Z: 3.12σ</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Negative sentiment surged by <strong className="text-[#EF4444] font-mono">+31.4%</strong> within 2 hours, breaching statistical deviation thresholds and triggering critical priority alerts.
            </p>
          </div>

          <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 hover:border-[#10B981]/40 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981] rounded-l" />
            <div className="text-[10.5px] font-mono font-bold text-[#10B981] uppercase flex items-center justify-between">
              <span>3. Recommended Actions</span>
              <span className="text-[9px] text-[#10B981] font-bold">Action Ready</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Deploy official technical clarification addressing charging grid telemetry. Monitor bridge nodes @tech_analyst_in and @ev_watch_india for further cascade amplification.
            </p>
          </div>
        </div>
      </Panel>

      {/* Main Visualizations: Sentiment Timeline & 10-Emotion Taxonomy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <PanelTitle icon={<Smile className="w-4 h-4 text-cyan" />}>
              Live Sentiment Polarity Timeline ({activeRange.toUpperCase()})
            </PanelTitle>
            <span className="text-[11px] text-muted font-mono">Hourly Polarity Trajectory</span>
          </div>
          <SentimentAreaChart data={data.sentimentTimeline} />
        </Panel>

        <Panel>
          <PanelTitle icon={<Smile className="w-4 h-4 text-accent" />}>
            10-Emotion Taxonomy Share
          </PanelTitle>
          <EmotionPieChart data={data.emotionDistribution} />
        </Panel>
      </div>

      {/* Secondary Visualizations: Platform Breakdown & Engagement Cascades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel>
          <PanelTitle icon={<Layers className="w-4 h-4 text-cyan" />}>
            Multi-Platform Ingestion Volume
          </PanelTitle>
          <PlatformBarChart data={data.platformDistribution} />
        </Panel>

        <Panel>
          <PanelTitle icon={<Activity className="w-4 h-4 text-highlight" />}>
            Engagement Cascades (Likes / Comments / Shares)
          </PanelTitle>
          <EngagementLineChart data={data.engagementTimeline} />
        </Panel>
      </div>

      {/* 3D Holographic Network Cosmos Command Visualizer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-accent animate-pulse" />
            <h2 className="text-xs font-bold text-text uppercase tracking-wider font-mono">
              Live 3D Holographic Network Topology Cosmos
            </h2>
            <Badge variant="teal">3D GPU ACCELERATED</Badge>
          </div>
          <button
            onClick={() => router.push('/network')}
            className="text-xs text-accent hover:text-cyan flex items-center gap-1 font-mono transition-colors"
          >
            Full 3D Propagation Analysis <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Network3DGraph
          nodes={networkData.nodes}
          edges={networkData.edges}
          influencers={data.topInfluencers}
          onNodeClick={handleOpenAccount}
        />
      </div>

      {/* Operational Grids: Trends, Influencers, Alerts, AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics */}
        <Panel className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
            <PanelTitle icon={<TrendingUp className="w-4 h-4 text-highlight" />}>
              Fastest Emerging & Viral Topics
            </PanelTitle>
            <button
              onClick={() => router.push('/trends')}
              className="text-xs text-accent hover:text-cyan flex items-center gap-1 transition-colors"
            >
              Trend Radar <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {data.trendingTopics.slice(0, 5).map((trend) => (
              <div
                key={trend.id}
                className="p-3.5 hover:bg-panelHover transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-text">{trend.topicName}</div>
                  <div className="text-[11px] text-muted font-mono mt-0.5">
                    {trend.mentionCount.toLocaleString()} mentions • {trend.mentionVelocity}/hr velocity
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      trend.status === 'viral'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : trend.status === 'emerging'
                        ? 'bg-highlight/20 text-highlight border border-highlight/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {trend.status}
                  </span>
                  <div className="text-[11px] text-positive font-mono mt-1">+{trend.growthRate}%</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Top Influencers & Centrality Leaders */}
        <Panel className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
            <PanelTitle icon={<Crown className="w-4 h-4 text-accent" />}>
              Key Network Influencers & Centrality Leaders
            </PanelTitle>
            <button
              onClick={() => router.push('/network')}
              className="text-xs text-cyan hover:text-white flex items-center gap-1 transition-colors"
            >
              Topology Graph <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {data.topInfluencers.slice(0, 5).map((inf, i) => (
              <div
                key={i}
                onClick={() => handleOpenAccount(inf)}
                className="p-3.5 hover:bg-panelHover cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="text-sm font-mono font-bold text-accent group-hover:text-cyan transition-colors">
                    @{inf.handle}
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">
                    Role: <span className="text-cyan font-semibold uppercase">{inf.role}</span> • PageRank:{' '}
                    <span className="font-mono text-text">{(inf.pagerank || 0.05).toFixed(4)}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-positive">
                    {(inf.influenceScore * 100).toFixed(0)}% Inf
                  </div>
                  <div className="text-[10px] text-muted">Betweenness: {(inf.betweennessCentrality || 0.12).toFixed(3)}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Critical Alerts & Grounded AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Threats & Alerts */}
        <Panel className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
            <PanelTitle icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}>
              Active Threat & Anomaly Alerts
            </PanelTitle>
            <button
              onClick={() => router.push('/alerts')}
              className="text-xs text-rose-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              Alert Centre <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {data.criticalAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="p-3.5 hover:bg-panelHover flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      {alert.level}
                    </span>
                    <span className="text-xs font-bold text-text truncate">{alert.title}</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-snug">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* AI Synthesized Intelligence with Evidence Button */}
        <Panel className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
            <PanelTitle icon={<Sparkles className="w-4 h-4 text-highlight" />}>
              Grounded AI Intelligence Insights
            </PanelTitle>
            <button
              onClick={() => router.push('/ai-analyst')}
              className="text-xs text-accent hover:text-cyan flex items-center gap-1 transition-colors"
            >
              Ask AI Analyst <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {data.aiInsights.slice(0, 4).map((insight) => (
              <div key={insight.id} className="p-3.5 hover:bg-panelHover flex items-start gap-3">
                <div className="p-2 rounded-xl bg-highlight/15 text-highlight border border-highlight/30 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">{insight.title}</span>
                    <button
                      onClick={() => handleOpenEvidence(insight)}
                      className="text-[10px] font-mono text-cyan hover:text-white bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1"
                    >
                      <Shield className="w-3 h-3 text-cyan" /> Evidence
                    </button>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-snug">{insight.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Global Modals */}
      <DemoScenarioModal
        isOpen={scenarioModalOpen}
        onClose={() => setScenarioModalOpen(false)}
        onStartSimulation={handleStartSimulation}
      />

      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        title={selectedEvidence?.title || 'Intelligence Evidence Verification'}
        claim={selectedEvidence?.claim || ''}
        confidence={selectedEvidence?.confidence}
        evidenceItems={selectedEvidence?.evidenceItems || []}
        topicName={selectedEvidence?.topicName}
      />

      <AccountDetailModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        account={selectedAccount}
      />
    </div>
  );
}
