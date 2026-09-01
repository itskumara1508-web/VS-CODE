'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  ShieldCheck,
  Globe,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  Activity,
  Award,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from '@/components/ui';
import {
  DemographicBarChart,
  PlatformBarChart,
} from '@/components/charts';
import GlobalFilterBar from '@/components/GlobalFilterBar';
import type { DemographicSegment } from '@ntro/types';

export default function AudiencePage() {
  const [demographics, setDemographics] = useState<DemographicSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.demographics()
      .then((data) => {
        setDemographics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load demographics');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState message="Aggregating Privacy-Preserving Demographic Cohorts..." />;
  if (error) return <ErrorState message={error} />;

  // 6 Audience Clusters
  const clusters = [
    { name: 'Technology Enthusiasts & Developers', size: '34.2%', sentiment: 'Constructive (64% Pos)', confidence: '94%', count: 184000, desc: 'Discussing EV hardware architecture, 5G carrier bands, and AI models' },
    { name: 'Working Professionals & Commuters', size: '28.6%', sentiment: 'Critical (46% Neg on EV)', confidence: '91%', count: 154000, desc: 'Engaged with urban transit disruptions, charging station wait times' },
    { name: 'Business & Financial Analysts', size: '16.4%', sentiment: 'Supportive (72% Pos)', confidence: '89%', count: 88000, desc: 'Monitoring telecom spectrum bids, semiconductor fabrication incentives' },
    { name: 'Students & Academic Researchers', size: '11.8%', sentiment: 'Neutral (58% Neu)', confidence: '88%', count: 63000, desc: 'Focusing on algorithmic transparency, open weights AI governance' },
    { name: 'Media Reporters & Journalists', size: '5.2%', sentiment: 'Neutral (62% Neu)', confidence: '96%', count: 28000, desc: 'Broadcasting breaking news alerts and official agency releases' },
    { name: 'General Public & Citizens', size: '3.8%', sentiment: 'Mixed (44% Pos)', confidence: '85%', count: 20000, desc: 'General lifestyle reactions to national tech infrastructure' },
  ];

  const languages = [
    { lang: 'English (EN)', share: 58.4, tone: 'Technical / Professional' },
    { lang: 'Hindi (HI)', share: 29.2, tone: 'Conversational / Citizen Reactions' },
    { lang: 'Hinglish (Colloquial)', share: 10.4, tone: 'Youth / Social Media Slang' },
    { lang: 'Regional / Others', share: 2.0, tone: 'Local Community Dialects' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">Audience Intelligence & Demographic Profiling</h1>
            <Badge variant="teal">AGGREGATE PRIVACY-PRESERVING</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            AI-estimated audience clusters, professional interest sectors, age brackets, and regional languages
          </p>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Privacy Notice Banner */}
      <div className="p-4 bg-surface rounded-xl border border-border flex items-start gap-3 text-xs">
        <div className="p-2 rounded-lg bg-accent/15 text-accent border border-accent/30 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="font-bold text-text flex items-center gap-2 font-mono uppercase text-[11px]">
            <span>Responsible AI & Privacy Compliance Notice</span>
            <span className="text-[10px] text-positive font-bold">[AI-ESTIMATED / AGGREGATE ONLY]</span>
          </div>
          <p className="text-muted leading-relaxed">
            All audience insights are inferred at an aggregate cohort level using k-anonymity differential privacy. No individual personally identifiable attributes or sensitive characteristics are stored or exposed.
          </p>
        </div>
      </div>

      {/* 6 Audience Clusters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text uppercase tracking-wider font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" /> Inferred Audience Segments & Communities
          </h2>
          <span className="text-[10px] font-mono text-muted">Estimated from public engagement patterns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {clusters.map((c, i) => (
            <div key={i} className="p-4 bg-panel rounded-xl border border-border space-y-2 hover:border-accent/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-text">{c.name}</div>
                  <span className="text-[10px] font-mono text-muted">{c.count.toLocaleString()} Estimated Accounts</span>
                </div>
                <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  {c.size}
                </span>
              </div>

              <p className="text-[11px] text-muted leading-relaxed line-clamp-2">
                {c.desc}
              </p>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan font-semibold">{c.sentiment}</span>
                <span className="text-muted">Conf: {c.confidence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizations: Age Brackets & Regional Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel>
          <PanelTitle icon={<Users className="w-4 h-4 text-cyan" />}>
            Estimated Age Bracket Distribution
          </PanelTitle>
          <DemographicBarChart data={demographics} />
        </Panel>

        {/* Language Distribution Breakdown */}
        <Panel className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
            <PanelTitle icon={<Globe className="w-4 h-4 text-accent" />}>
              Language & Dialect Footprint
            </PanelTitle>
            <span className="text-[11px] font-mono text-muted">Multilingual NLP Tokenizer</span>
          </div>

          <div className="p-4 space-y-3">
            {languages.map((l, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-text">{l.lang}</span>
                  <span className="text-accent font-bold">{l.share}%</span>
                </div>
                <div className="h-2 bg-ink rounded-full overflow-hidden border border-border/40">
                  <div
                    className={`h-full ${
                      i === 0 ? 'bg-accent' : i === 1 ? 'bg-cyan' : i === 2 ? 'bg-highlight' : 'bg-slate-500'
                    }`}
                    style={{ width: `${l.share}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted font-mono">{l.tone}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
