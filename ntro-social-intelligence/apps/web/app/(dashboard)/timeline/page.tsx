'use client';

import { useState, useEffect } from 'react';
import {
  History,
  Filter,
  Search,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  MessageSquare,
  Share2,
  Users,
  ShieldAlert,
  Clock,
  Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from '@/components/ui';
import GlobalFilterBar from '@/components/GlobalFilterBar';
import type { TimelineEvent, Post, Topic } from '@ntro/types';

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

  useEffect(() => {
    Promise.all([
      api.timelineEvents(selectedTopic !== 'all' ? selectedTopic : undefined),
      api.timelinePosts({
        pageSize: 30,
        topicId: selectedTopic !== 'all' ? selectedTopic : undefined,
        platform: selectedPlatform !== 'all' ? selectedPlatform : undefined,
        sentiment: selectedSentiment !== 'all' ? selectedSentiment : undefined,
      }),
    ])
      .then(([evts, psts]) => {
        setEvents(evts);
        setPosts(psts.items);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load timeline'))
      .finally(() => setLoading(false));
  }, [selectedTopic, selectedPlatform, selectedSentiment]);

  if (error) return <ErrorState message={error} />;
  if (loading) return <LoadingState message="Reconstructing Chronological Narrative Progression..." />;

  const propagationFlow = [
    { stage: '1. POST INCEPTION', time: '14:00', desc: 'Initial posts published on X & Telegram', color: 'border-cyan' },
    { stage: '2. INTERACTION SURGE', time: '14:10', desc: '+180% engagement acceleration detected', color: 'border-highlight' },
    { stage: '3. SENTIMENT INVERSION', time: '14:20', desc: 'Negative polarity crossed 40% threshold', color: 'border-rose-500' },
    { stage: '4. TOPIC AMPLIFICATION', time: '14:35', desc: 'Narrative gained viral classification', color: 'border-accent' },
    { stage: '5. INFLUENCE EXPANSION', time: '14:48', desc: 'High-PageRank nodes reshared threads', color: 'border-cyan' },
    { stage: '6. CROSS-COMMUNITY SPREAD', time: '15:05', desc: 'Reached 4 separate audience clusters', color: 'border-highlight' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">Timeline Explorer & Propagation Chronology</h1>
            <Badge variant="teal">CHRONO LOG</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Chronological timeline tracking information cascades, sentiment shifts, & node propagation
          </p>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Six-Stage Event Progression Flow */}
      <div className="p-5 rounded-2xl bg-panel border border-border space-y-3.5 shadow-panel">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold uppercase font-mono text-accent flex items-center gap-2">
            <History className="w-4 h-4" /> Information Cascade Stage Progression Model
          </div>
          <span className="text-[11px] text-muted font-mono">POST → INTERACTION → SENTIMENT → TOPIC → INFLUENCE → PROPAGATION</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 pt-2">
          {propagationFlow.map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl bg-surface border-l-4 ${item.color} border-t border-r border-b border-border text-xs`}>
              <div className="text-[10px] font-mono text-muted flex items-center justify-between">
                <span>{item.time} UTC</span>
                <span className="text-accent font-bold">0{idx + 1}</span>
              </div>
              <div className="font-bold text-text mt-1 text-[11px]">{item.stage}</div>
              <p className="text-[10px] text-muted mt-1 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-panel rounded-xl border border-border flex flex-col md:flex-row items-center justify-between gap-3 shadow-panel">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-muted">Topic:</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-ink border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-cyan/50"
          >
            <option value="all">All Topics (Aggregated Timeline)</option>
            <option value="topic_0">EV Charging Infrastructure</option>
            <option value="topic_1">5G Rollout</option>
            <option value="topic_2">AI Regulation</option>
            <option value="topic_3">UPI Payments</option>
          </select>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span>Platform:</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-ink border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-cyan/50"
            >
              <option value="all">All Platforms</option>
              <option value="x">X (Twitter)</option>
              <option value="telegram">Telegram</option>
              <option value="reddit">Reddit</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span>Sentiment:</span>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="bg-ink border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-cyan/50"
            >
              <option value="all">All Polarities</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chronological Event Posts Stream */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-muted uppercase font-mono tracking-wider flex items-center justify-between">
          <span>Reconstructed Chronological Feed ({posts.length} verified events)</span>
          <span className="text-[11px] text-accent font-normal font-mono">Ordered by timestamp DESC</span>
        </div>

        <div className="space-y-3">
          {posts.map((post) => {
            const isNegative = post.text.toLowerCase().includes('traffic') || post.text.toLowerCase().includes('disruption') || post.text.toLowerCase().includes('overload');
            const isPositive = post.text.toLowerCase().includes('milestone') || post.text.toLowerCase().includes('rapidly') || post.text.toLowerCase().includes('satisfaction');

            return (
              <div
                key={post.id}
                className="p-4 bg-panel border border-border rounded-xl hover:border-cyan/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-panel group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 text-[11px]">
                    <span className="font-mono text-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {new Date(post.timestamp).toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] bg-surface text-cyan border border-cyan/20">
                      {post.platform}
                    </span>
                    <span className="font-mono text-accent">@{post.anonymizedUserId}</span>
                    <Badge variant={isNegative ? 'negative' : isPositive ? 'positive' : 'default'}>
                      {isNegative ? 'Negative' : isPositive ? 'Positive' : 'Neutral'}
                    </Badge>
                  </div>

                  <p className="text-sm text-text leading-relaxed">{post.text}</p>

                  <div className="flex items-center gap-3 text-[11px] text-muted font-mono pt-1">
                    <span className="text-accent font-semibold">❤️ {post.engagement.likes}</span>
                    <span className="text-cyan font-semibold">💬 {post.engagement.comments}</span>
                    <span className="text-highlight font-semibold">🔄 {post.engagement.shares}</span>
                    <span>Language: {post.language.toUpperCase()}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] text-muted font-mono bg-surface px-2.5 py-1 rounded-lg border border-border">
                    ID: {post.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
