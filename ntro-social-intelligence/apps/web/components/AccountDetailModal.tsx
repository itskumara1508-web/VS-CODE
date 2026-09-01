'use client';

import { X, Crown, Users, TrendingUp, Share2, Activity, Shield, Smile, Frown, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { AccountDetail } from '@ntro/types';

interface AccountDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: Partial<AccountDetail> | null;
}

export default function AccountDetailModal({
  isOpen,
  onClose,
  account,
}: AccountDetailModalProps) {
  if (!isOpen) return null;

  const data: AccountDetail = {
    id: account?.id || 'user_42',
    handle: account?.handle || 'tech_analyst_in',
    displayName: account?.displayName || 'National Tech & Telecom Analyst',
    platform: account?.platform || 'x',
    followerCount: account?.followerCount || 248500,
    followingCount: account?.followingCount || 412,
    postCount: account?.postCount || 12840,
    bio: account?.bio || 'Independent researcher covering EV grid resilience, 5G telecom spectrum allocation, and digital infrastructure.',
    location: account?.location || 'New Delhi, India',
    language: account?.language || 'en',
    communities: account?.communities || ['Policy & Academic Community', 'National Tech Influencers'],
    influenceScore: account?.influenceScore || 0.94,
    pagerank: account?.pagerank || 0.084,
    betweenness: account?.betweenness || 0.22,
    degreeCentrality: account?.degreeCentrality || 48,
    activityVolume: account?.activityVolume || 142,
    sentimentAssociation: account?.sentimentAssociation || { positive: 42, neutral: 26, negative: 32 },
    topTopics: account?.topTopics || ['EV Charging Infrastructure', '5G Rollout', 'Semiconductor Mission'],
    interactionPatterns: account?.interactionPatterns || { replyRate: 28, repostRate: 54, broadcastRate: 18 },
    influenceHistory: account?.influenceHistory || [
      { timestamp: '08:00', score: 0.88 },
      { timestamp: '10:00', score: 0.89 },
      { timestamp: '12:00', score: 0.91 },
      { timestamp: '14:00', score: 0.94 },
      { timestamp: '16:00', score: 0.95 },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-panel border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center text-cyan shadow-glowCyan font-mono font-bold text-sm">
              @{data.handle.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text">@{data.handle}</h2>
                <Badge variant="teal">AUTHORITY NODE</Badge>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-surface text-cyan border border-cyan/20">
                  {data.platform}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">{data.displayName} • {data.location}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-panel transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Bio statement */}
          <p className="text-xs text-text/90 bg-surface p-3.5 rounded-xl border border-border leading-relaxed">
            {data.bio}
          </p>

          {/* Core Centrality & Influence Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Influence Score</div>
              <div className="text-xl font-bold text-accent mt-0.5 font-mono">
                {(data.influenceScore * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-positive mt-0.5 font-mono">Top 0.1% Network</div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">PageRank Authority</div>
              <div className="text-xl font-bold text-cyan mt-0.5 font-mono">
                {data.pagerank.toFixed(4)}
              </div>
              <div className="text-[10px] text-muted mt-0.5">Global Centrality</div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Betweenness Bridge</div>
              <div className="text-xl font-bold text-highlight mt-0.5 font-mono">
                {data.betweenness.toFixed(3)}
              </div>
              <div className="text-[10px] text-muted mt-0.5">Cross-Cluster Hop</div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Followers / Audience</div>
              <div className="text-xl font-bold text-text mt-0.5 font-mono">
                {(data.followerCount / 1000).toFixed(1)}K
              </div>
              <div className="text-[10px] text-muted mt-0.5">Verified Public Reach</div>
            </div>
          </div>

          {/* Influence Over Time Line Graph */}
          <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-text uppercase font-mono flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-accent" /> Influence & Engagement Over Time
              </span>
              <span className="text-[10px] text-muted font-mono">Hourly Telemetry</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.influenceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
                  <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                  <YAxis domain={[0.7, 1.0]} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#162238', border: '1px solid #223354', borderRadius: 8, fontSize: 11 }} />
                  <Line type="monotone" dataKey="score" stroke="#19D3C5" strokeWidth={2.5} dot={{ r: 4, fill: '#19D3C5' }} name="Influence" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Topic Affinities & Sentiment Associations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-surface rounded-xl border border-border space-y-2 text-xs">
              <div className="font-bold text-text uppercase font-mono">Associated Focus Topics</div>
              <div className="flex flex-wrap gap-1.5">
                {data.topTopics.map((top, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-panel border border-border text-cyan text-[11px]">
                    {top}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-surface rounded-xl border border-border space-y-2 text-xs">
              <div className="font-bold text-text uppercase font-mono">Sentiment Polarity Tendency</div>
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-accent">{data.sentimentAssociation.positive}% Positive</span>
                <span className="text-muted">{data.sentimentAssociation.neutral}% Neutral</span>
                <span className="text-rose-400">{data.sentimentAssociation.negative}% Negative</span>
              </div>
              <div className="h-2 bg-ink rounded-full overflow-hidden flex border border-border/50">
                <div className="bg-accent h-full" style={{ width: `${data.sentimentAssociation.positive}%` }} />
                <div className="bg-slate-500 h-full" style={{ width: `${data.sentimentAssociation.neutral}%` }} />
                <div className="bg-rose-500 h-full" style={{ width: `${data.sentimentAssociation.negative}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between">
          <div className="text-[10px] text-muted font-mono">
            Complies with Authorized Public Social Intelligence Guidelines
          </div>
          <button onClick={onClose} className="btn btn-ghost text-xs py-1.5 px-4">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

