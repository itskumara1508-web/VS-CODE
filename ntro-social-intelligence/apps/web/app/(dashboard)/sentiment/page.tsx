'use client';

import { useEffect, useState } from 'react';
import {
  Smile,
  Frown,
  Meh,
  Activity,
  AlertTriangle,
  Zap,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Shield,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from '@/components/ui';
import Card3D from '@/components/Card3D';
import {
  SentimentAreaChart,
  EmotionPieChart,
  PlatformBarChart,
} from '@/components/charts';
import EvidenceModal from '@/components/EvidenceModal';
import GlobalFilterBar from '@/components/GlobalFilterBar';

export default function SentimentPage() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [emotions, setEmotions] = useState<Record<string, number>>({});
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.sentimentTimeline(),
      api.emotionDistribution(),
      api.platformDistribution(),
    ])
      .then(([t, e, p]) => {
        setTimeline(t);
        setEmotions(e);
        setPlatforms(p);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load sentiment data');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState message="Analyzing Multilingual Sentiment & Emotion Vectors..." />;
  if (error) return <ErrorState message={error} />;

  // Multi-Topic Sentiment Heatmap Matrix
  const heatmapData = [
    { topic: 'EV Charging Infrastructure', positive: 22, neutral: 32, negative: 46, shift: '-31.4%', status: 'CRITICAL_SHIFT', sarcasm: 14.2 },
    { topic: '5G Spectrum & Telecom Rollout', positive: 64, neutral: 24, negative: 12, shift: '+8.2%', status: 'STABLE_POSITIVE', sarcasm: 4.8 },
    { topic: 'AI Algorithmic Safety & Standards', positive: 41, neutral: 44, negative: 15, shift: '+2.1%', status: 'BALANCED', sarcasm: 9.1 },
    { topic: 'UPI Digital Transaction Milestone', positive: 78, neutral: 16, negative: 6, shift: '+14.5%', status: 'HIGHLY_SUPPORTIVE', sarcasm: 2.3 },
    { topic: 'Semiconductor Fabrication Mission', positive: 58, neutral: 30, negative: 12, shift: '+6.8%', status: 'CONSTRUCTIVE', sarcasm: 5.6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">Multi-Dimensional Sentiment Intelligence</h1>
            <Badge variant="teal">DEEP NLP INFERENCE</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Multi-lingual sentiment polarity, 10-emotion taxonomy, sarcasm probability, and statistical shift alarms
          </p>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Feature 4: Statistical Alarm Banner */}
      <div className="p-4 bg-rose-500/15 border border-rose-500/35 rounded-xl flex items-start justify-between gap-4 shadow-glowRose">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                SENTIMENT SHIFT DETECTED (Z-Score: 3.12 &gt; Threshold 2.5)
              </span>
              <Badge variant="negative">CONFIRMED INVERSION</Badge>
            </div>
            <p className="text-xs text-text/90 mt-1 leading-relaxed">
              Negative sentiment on topic <strong>&quot;EV Charging Infrastructure&quot;</strong> increased by <strong className="text-rose-400 font-mono">+31.4%</strong> over a 45-minute window following charging station power failure reports.
            </p>
          </div>
        </div>

        <button
          onClick={() => setEvidenceOpen(true)}
          className="btn btn-rose text-xs py-1.5 px-3 font-bold shrink-0 flex items-center gap-1.5"
        >
          <Shield className="w-3.5 h-3.5" /> View Evidence
        </button>
      </div>

      {/* KPI Cards in 3D Cyber Glass */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card3D glowColor="teal" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Net Positive Polarity</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#00F0FF] font-mono tracking-tight">54.2%</div>
          <div className="text-[10px] text-[#00FF9D] font-mono font-semibold">+4.1% Overall</div>
        </Card3D>

        <Card3D glowColor="rose" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Negative Sentiment</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#FF3366] font-mono tracking-tight">22.8%</div>
          <div className="text-[10px] text-[#FF3366] font-mono font-semibold">+8.4% Surge on EV Topic</div>
        </Card3D>

        <Card3D glowColor="cyan" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono">Dominant Emotion</div>
          <div className="text-2xl font-bold text-[#38BDF8] font-mono tracking-tight truncate">Joy / Anticipation</div>
          <div className="text-[10px] text-muted font-mono">Confidence: 94.2%</div>
        </Card3D>

        <Card3D glowColor="amber" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono">Sarcasm Probability</div>
          <div className="text-2xl font-bold text-[#FFB800] font-mono tracking-tight">6.4%</div>
          <div className="text-[10px] text-muted font-mono">AI Filter Applied</div>
        </Card3D>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          <PanelTitle icon={<Smile className="w-4 h-4 text-cyan" />}>
            Sentiment Polarity Timeline & Shift Inversions
          </PanelTitle>
          <SentimentAreaChart data={timeline} />
        </Panel>

        <Panel>
          <PanelTitle icon={<Activity className="w-4 h-4 text-accent" />}>
            10-Emotion Taxonomy Breakdown
          </PanelTitle>
          <EmotionPieChart data={emotions} />
        </Panel>
      </div>

      {/* Topic Sentiment Heatmap Table */}
      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <PanelTitle icon={<BarChart3 className="w-4 h-4 text-highlight" />}>
            Topic-Level Sentiment & Stance Matrix (Heatmap)
          </PanelTitle>
          <span className="text-[11px] text-muted font-mono">Aggregated across all platforms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1220] border-b border-border text-[10px] font-mono text-muted uppercase">
              <tr>
                <th className="p-3.5">Monitored Topic</th>
                <th className="p-3.5">Positive</th>
                <th className="p-3.5">Neutral</th>
                <th className="p-3.5">Negative</th>
                <th className="p-3.5">Delta Shift</th>
                <th className="p-3.5">Sarcasm Prob</th>
                <th className="p-3.5">Threat Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {heatmapData.map((row, idx) => (
                <tr key={idx} className="hover:bg-panelHover transition-colors">
                  <td className="p-3.5 font-sans font-semibold text-text">{row.topic}</td>
                  <td className="p-3.5 text-accent font-bold">{row.positive}%</td>
                  <td className="p-3.5 text-muted">{row.neutral}%</td>
                  <td className="p-3.5 text-rose-400 font-bold">{row.negative}%</td>
                  <td className={`p-3.5 font-bold ${row.shift.startsWith('-') ? 'text-rose-400' : 'text-positive'}`}>
                    {row.shift}
                  </td>
                  <td className="p-3.5 text-muted">{row.sarcasm}%</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      row.status === 'CRITICAL_SHIFT'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-accent/15 text-accent border border-accent/25'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Evidence Verification Modal */}
      <EvidenceModal
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        title="Negative Sentiment Shift Evidence - EV Charging Topic"
        claim="Negative sentiment surged by +31.4% between 14:00 and 14:45 UTC following grid downtime reports."
        confidence={{ score: 0.94, low: 0.88, high: 0.98 }}
        topicName="EV Charging Infrastructure"
        timeRange="14:00 - 14:45 UTC"
        sourcePostsCount={18420}
        evidenceItems={[
          { type: 'sentiment_shift', label: 'Negative Polarity Surge', value: '+31.4% Delta' },
          { type: 'post_count', label: 'Posts Ingested & Scored', value: '18,420 Posts' },
          { type: 'time_window', label: 'Inversion Window', value: '45 Minutes' },
          { type: 'top_amplifiers', label: 'Key Amplifying Node', value: '@tech_analyst_in' },
        ]}
      />
    </div>
  );
}
