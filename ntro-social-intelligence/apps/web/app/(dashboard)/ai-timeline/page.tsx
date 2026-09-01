'use client';

import { useEffect, useState } from 'react';
import {
  GitBranch,
  Clock3,
  Sparkles,
  Users,
  Activity,
  AlertTriangle,
  Smile,
  Frown,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Layers,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { Panel, PanelTitle, Badge, LoadingState } from '@/components/ui';
import EvidenceModal from '@/components/EvidenceModal';
import GlobalFilterBar from '@/components/GlobalFilterBar';

export default function AiTimelinePage() {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

  // 6 Chronological AI Analysis Timeline Stages
  const aiStages = [
    {
      time: '14:00 UTC',
      title: 'Topic Emergence & Initial Post Activity',
      sentiment: 'Neutral (Polarity: +0.02)',
      emotion: 'Curiosity / Surprise',
      trendVelocity: '45 mentions/hr',
      influencers: ['@local_commuter_hub'],
      communities: ['Grassroots EV Forum'],
      alerts: 'None (Baseline Activity)',
      networkShift: 'Initial sub-cluster formed',
      desc: 'First localized complaints regarding power grid fluctuations at central charging terminals.',
    },
    {
      time: '14:12 UTC',
      title: 'Mention Velocity Surge (+180%)',
      sentiment: 'Negative Slant (Polarity: -0.18)',
      emotion: 'Annoyance / Concern',
      trendVelocity: '128 mentions/hr',
      influencers: ['@ev_watch_india'],
      communities: ['Grassroots EV Forum'],
      alerts: 'INFO: Trend Velocity Acceleration',
      networkShift: 'Node degree expansion in Cluster A',
      desc: 'Hashtag #EVChargingCrisis begins appearing across regional Telegram commuter channels.',
    },
    {
      time: '14:20 UTC',
      title: 'High-Centrality Authority Node Detection',
      sentiment: 'Negative (Polarity: -0.34)',
      emotion: 'Frustration / Concern',
      trendVelocity: '210 mentions/hr',
      influencers: ['@tech_analyst_in (PageRank 0.084)'],
      communities: ['Grassroots EV Forum', 'Tech Influencers'],
      alerts: 'WARNING: High-Influence Account Amplification',
      networkShift: 'PageRank leader quote-posts raw telemetry log',
      desc: 'Quote-post by national tech analyst multiplies repost velocity by 3.2x across cross-platform feeds.',
    },
    {
      time: '14:31 UTC',
      title: 'Cross-Community Boundary Infiltration',
      sentiment: 'Negative (Polarity: -0.48)',
      emotion: 'Anger / Disappointment',
      trendVelocity: '290 mentions/hr',
      influencers: ['@policy_insights_in'],
      communities: ['Tech Influencers', 'Policy & Academic Community'],
      alerts: 'HIGH: Inter-Cluster Propagation Event',
      networkShift: 'Ties formed between Cluster A and Cluster B',
      desc: 'Narrative bridges modularity gap into policy and energy grid think-tank discussion circles.',
    },
    {
      time: '14:45 UTC',
      title: 'Critical Sentiment Inversion Surge (+31.4% Neg)',
      sentiment: 'Critical Negative (Polarity: -0.72)',
      emotion: 'Anger / Outrage (46%)',
      trendVelocity: '340 mentions/hr',
      influencers: ['@national_media_feed'],
      communities: ['Media Hub', 'Public Forum'],
      alerts: 'CRITICAL: Negative Sentiment Anomaly Breached',
      networkShift: 'Complete network percolation (4 Clusters)',
      desc: 'Broad news media amplification turns topic into #1 trending national discussion.',
    },
    {
      time: '15:00 UTC',
      title: 'Propagation Alert & Incident Dossier Generation',
      sentiment: 'Peak Polarization (Polarity: -0.68)',
      emotion: 'Demanding Resolution',
      trendVelocity: '320 mentions/hr (Stabilizing)',
      influencers: ['@tech_analyst_in', '@ev_watch_india', '@national_media_feed'],
      communities: ['All 4 Monitored Clusters'],
      alerts: 'CRITICAL: Full Strategic Intelligence Brief Generated',
      networkShift: 'Modularity index drops to 0.54 (High Co-Mentions)',
      desc: 'System triggers automatic executive summary briefing recommending official technical clarification.',
    },
  ];

  // Feature 12: AI Event Correlations (Event A -> Time Delta -> Event B)
  const correlations = [
    {
      eventA: 'Authority Node @tech_analyst_in posted quote-tweet with grid telemetry (14:20)',
      timeDelta: '11 Minutes Delta',
      eventB: 'Narrative crossed into Policy & Academic Community B (14:31)',
      correlationStrength: '0.94 Statistical Link',
      interpretation: 'High likelihood of authority-driven cascade bridging ideological clusters.',
    },
    {
      eventA: 'Hashtag #EVChargingCrisis crossed 200 mentions/hr (14:18)',
      timeDelta: '27 Minutes Delta',
      eventB: 'Negative polarity reached critical 46% threshold (14:45)',
      correlationStrength: '0.91 Statistical Link',
      interpretation: 'Rapid volume growth strongly correlated with escalating negative emotion.',
    },
    {
      eventA: 'Media account @national_media_feed broadcasted news report (14:42)',
      timeDelta: '8 Minutes Delta',
      eventB: 'Telegram channel volume quadrupled across 3 regional circles (14:50)',
      correlationStrength: '0.88 Statistical Link',
      interpretation: 'Mainstream press broadcast triggered secondary social platform wave.',
    },
  ];

  const handleOpenEvidence = (stage: any) => {
    setSelectedEvidence({
      title: stage.title,
      claim: stage.desc,
      confidence: { score: 0.94, low: 0.88, high: 0.98 },
      topicName: 'EV Charging Infrastructure',
      timeRange: stage.time,
      evidenceItems: [
        { type: 'trend_velocity', label: 'Mention Velocity', value: stage.trendVelocity },
        { type: 'sentiment', label: 'Sentiment Vector', value: stage.sentiment },
        { type: 'emotion', label: 'Dominant Emotion', value: stage.emotion },
        { type: 'network_shift', label: 'Graph Topology Shift', value: stage.networkShift },
      ],
    });
    setEvidenceOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">AI Analysis Timeline & Causal Propagation Model</h1>
            <Badge variant="teal">INTELLIGENCE SYNTHESIS</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Synchronized narrative evolution, graph topology mutations, and statistical event correlations
          </p>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Feature 12: AI Event Correlation Engine Box */}
      <Panel className="bg-surface/90 border-border p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-highlight" />
            <h2 className="text-xs font-bold text-text uppercase tracking-wider font-mono">
              AI Event Correlation Engine (Potential Relationships)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full">
            [POTENTIAL RELATIONSHIP • STATISTICAL CORRELATION]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {correlations.map((corr, idx) => (
            <div key={idx} className="p-4 bg-panel rounded-xl border border-border space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-2.5 bg-surface rounded-lg border border-border/80">
                  <span className="text-[9px] font-mono text-accent uppercase font-bold block">EVENT A</span>
                  <span className="text-[11px] text-text font-semibold">{corr.eventA}</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-highlight py-0.5">
                  <Clock3 className="w-3 h-3 text-highlight" />
                  <span>&darr; {corr.timeDelta} &darr;</span>
                </div>

                <div className="p-2.5 bg-surface rounded-lg border border-border/80">
                  <span className="text-[9px] font-mono text-cyan uppercase font-bold block">EVENT B</span>
                  <span className="text-[11px] text-text font-semibold">{corr.eventB}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-positive font-bold">{corr.correlationStrength}</span>
                  <span className="text-muted">Lag Regression</span>
                </div>
                <p className="text-[10px] text-muted leading-tight">{corr.interpretation}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Feature 11: Specialized AI Analysis Timeline Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text uppercase tracking-wider font-mono flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-accent" /> Multi-Dimensional Chronological Sequence
          </h2>
          <span className="text-[10px] font-mono text-muted">Auto-connected narrative stages</span>
        </div>

        <div className="space-y-3.5">
          {aiStages.map((st, i) => (
            <div
              key={i}
              className="p-4 bg-panel rounded-2xl border border-border hover:border-accent/40 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-mono font-bold text-xs">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-text">{st.title}</h3>
                    <span className="text-[10px] font-mono text-cyan">{st.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-highlight">
                    {st.trendVelocity}
                  </span>
                  <button
                    onClick={() => handleOpenEvidence(st)}
                    className="text-[10px] font-mono text-accent hover:text-white bg-accent/10 hover:bg-accent/20 border border-accent/30 px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3 text-accent" /> Evidence
                  </button>
                </div>
              </div>

              <p className="text-xs text-text/90 leading-relaxed font-medium">
                {st.desc}
              </p>

              {/* 5-Dimensional Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono pt-1">
                <div className="p-2.5 bg-surface rounded-xl border border-border/80">
                  <span className="text-[9px] text-muted uppercase block">Sentiment Polarity</span>
                  <span className="text-xs font-bold text-accent">{st.sentiment}</span>
                </div>

                <div className="p-2.5 bg-surface rounded-xl border border-border/80">
                  <span className="text-[9px] text-muted uppercase block">Emotion State</span>
                  <span className="text-xs font-bold text-cyan">{st.emotion}</span>
                </div>

                <div className="p-2.5 bg-surface rounded-xl border border-border/80">
                  <span className="text-[9px] text-muted uppercase block">Key Influencers</span>
                  <span className="text-xs font-bold text-highlight truncate block">{st.influencers.join(', ')}</span>
                </div>

                <div className="p-2.5 bg-surface rounded-xl border border-border/80">
                  <span className="text-[9px] text-muted uppercase block">Graph Mutation</span>
                  <span className="text-xs font-bold text-text truncate block">{st.networkShift}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        title={selectedEvidence?.title || 'Telemetry Proof'}
        claim={selectedEvidence?.claim || ''}
        confidence={selectedEvidence?.confidence}
        topicName={selectedEvidence?.topicName}
        timeRange={selectedEvidence?.timeRange}
        evidenceItems={selectedEvidence?.evidenceItems || []}
      />
    </div>
  );
}
