'use client';

import { useState } from 'react';
import { X, Share2, ArrowRight, ShieldCheck, Users, Activity, Smile, Frown } from 'lucide-react';
import { Badge } from '@/components/ui';

interface CommunityComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunityComparisonModal({ isOpen, onClose }: CommunityComparisonModalProps) {
  const [commA, setCommA] = useState('comm_0');
  const [commB, setCommB] = useState('comm_1');

  if (!isOpen) return null;

  const communities = [
    {
      id: 'comm_0',
      name: 'National Tech Influencers',
      size: 248,
      dominantLanguage: 'EN',
      sentiment: 'positive',
      sentimentScore: 68,
      avgInfluence: 0.84,
      mainTopics: ['EV Charging', '5G Rollout', 'AI Hardware'],
      topInfluencers: ['@tech_analyst_in', '@telecom_insider'],
    },
    {
      id: 'comm_1',
      name: 'Policy & Academic Community',
      size: 182,
      dominantLanguage: 'EN/HI',
      sentiment: 'neutral',
      sentimentScore: 54,
      avgInfluence: 0.72,
      mainTopics: ['AI Regulation', 'Data Protection', 'Spectrum Policy'],
      topInfluencers: ['@policy_insights_in', '@academic_fellow'],
    },
    {
      id: 'comm_2',
      name: 'Regional EV Commuter Group',
      size: 196,
      dominantLanguage: 'HI',
      sentiment: 'negative',
      sentimentScore: 32,
      avgInfluence: 0.65,
      mainTopics: ['Charging Station Outages', 'Grid Overload'],
      topInfluencers: ['@ev_watch_india', '@commuter_pulse'],
    },
  ];

  const dataA = communities.find((c) => c.id === commA) || communities[0];
  const dataB = communities.find((c) => c.id === commB) || communities[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-panel border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center text-cyan shadow-glowCyan shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan font-bold">
                  Network Graph Modularity
                </span>
                <Badge variant="teal">DUAL CLUSTER COMPARISON</Badge>
              </div>
              <h2 className="text-base font-bold text-text mt-0.5">Cross-Community Topology Comparator</h2>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-panel transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">Cluster A:</label>
              <select
                value={commA}
                onChange={(e) => setCommA(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-cyan/50 font-semibold"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">Cluster B:</label>
              <select
                value={commB}
                onChange={(e) => setCommB(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-cyan/50 font-semibold"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Side-by-Side Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Column A */}
            <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text truncate">{dataA.name}</span>
                <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20">
                  {dataA.size} Nodes
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between">
                  <span className="text-muted">Net Positive Polarity:</span>
                  <span className="font-mono text-accent font-bold">{dataA.sentimentScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Avg Influence Score:</span>
                  <span className="font-mono text-text">{(dataA.avgInfluence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Language Footprint:</span>
                  <span className="font-mono text-muted uppercase">{dataA.dominantLanguage}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-1">
                <div className="text-[10px] text-muted uppercase font-mono">Dominant Themes:</div>
                <div className="flex flex-wrap gap-1">
                  {dataA.mainTopics.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-panel border border-border text-[10px] text-text">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Column B */}
            <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-text truncate">{dataB.name}</span>
                <span className="text-[10px] font-mono text-highlight bg-highlight/10 px-2 py-0.5 rounded border border-highlight/20">
                  {dataB.size} Nodes
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between">
                  <span className="text-muted">Net Positive Polarity:</span>
                  <span className="font-mono text-highlight font-bold">{dataB.sentimentScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Avg Influence Score:</span>
                  <span className="font-mono text-text">{(dataB.avgInfluence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Language Footprint:</span>
                  <span className="font-mono text-muted uppercase">{dataB.dominantLanguage}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border space-y-1">
                <div className="text-[10px] text-muted uppercase font-mono">Dominant Themes:</div>
                <div className="flex flex-wrap gap-1">
                  {dataB.mainTopics.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-panel border border-border text-[10px] text-text">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Cutting Ties & Overlap */}
          <div className="p-4 bg-panel rounded-xl border border-border space-y-2">
            <div className="font-bold text-text uppercase font-mono text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Inter-Community Connectivity Index
            </div>
            <p className="text-muted leading-relaxed text-[11px]">
              Cross-cluster bridge analysis identifies <strong>14 shared interaction ties</strong> between {dataA.name} and {dataB.name}. Narrative crossover latency averages <strong>22.4 minutes</strong> via high-betweenness bridge accounts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-end">
          <button onClick={onClose} className="btn btn-primary text-xs py-1.5 px-4">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

