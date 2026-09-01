'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  Filter,
  Radio,
  Clock,
  Sparkles,
  Smile,
  Frown,
  Activity,
  Layers,
  Globe,
  RotateCcw,
  Zap,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from '@/components/ui';
import Card3D from '@/components/Card3D';
import type { Post } from '@ntro/types';

export default function LiveMonitoringPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stream controls
  const [isStreaming, setIsStreaming] = useState(true);
  const [eventCount, setEventCount] = useState(14820);
  const [pumpSpeed, setPumpSpeed] = useState<'normal' | 'fast' | 'turbo'>('normal');

  // Multi-criteria filters
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [filterEmotion, setFilterEmotion] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [minInfluence, setMinInfluence] = useState<number>(0);

  useEffect(() => {
    api.posts({ pageSize: 40 })
      .then((data) => {
        setPosts(data.items);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Failed to load posts');
        setLoading(false);
      });
  }, []);

  // Emulate live continuous WebSocket event pump
  useEffect(() => {
    if (!isStreaming) return;
    const intervalMs = pumpSpeed === 'turbo' ? 600 : pumpSpeed === 'fast' ? 1200 : 2500;

    const interval = setInterval(() => {
      setEventCount((c) => c + 1);
      setPosts((prev) => {
        if (prev.length === 0) return prev;
        const sample = prev[Math.floor(Math.random() * prev.length)];
        const newPost: Post = {
          ...sample,
          id: `live_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          timestamp: new Date().toISOString(),
          engagement: {
            likes: Math.floor(Math.random() * 450) + 10,
            comments: Math.floor(Math.random() * 80) + 2,
            shares: Math.floor(Math.random() * 60) + 1,
            reposts: Math.floor(Math.random() * 40),
          },
        };
        return [newPost, ...prev.slice(0, 49)];
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, pumpSpeed]);

  if (loading) return <LoadingState message="Connecting to Live Multi-Platform Stream WebSocket..." />;
  if (error) return <ErrorState message={error} />;

  // Filter posts locally
  const filteredPosts = posts.filter((p) => {
    if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
    if (filterLang !== 'all' && p.language !== filterLang) return false;
    if (filterTopic !== 'all' && !p.topicIds?.includes(filterTopic)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">Live Social Media Stream Monitoring</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
              isStreaming
                ? 'bg-[#19D3C5]/20 text-[#19D3C5] border border-[#19D3C5]/40 shadow-glow'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-[#19D3C5] animate-ping' : 'bg-amber-400'}`} />
              {isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Normalized live event stream ingested across X, Telegram, Reddit, and YouTube
          </p>
        </div>

        {/* Live Stream Controller Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(true)}
            className={`btn text-xs py-1.5 px-3 flex items-center gap-1.5 ${
              isStreaming ? 'btn-primary shadow-glow font-bold' : 'btn-ghost'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" /> START
          </button>
          <button
            onClick={() => setIsStreaming(false)}
            className={`btn text-xs py-1.5 px-3 flex items-center gap-1.5 ${
              !isStreaming ? 'btn-amber shadow-glowAmber font-bold' : 'btn-ghost'
            }`}
          >
            <Pause className="w-3.5 h-3.5" /> PAUSE
          </button>
          <button
            onClick={() => {
              setIsStreaming(false);
              setPosts([]);
            }}
            className="btn btn-ghost text-xs py-1.5 px-3 text-rose-400 hover:bg-rose-500/15 flex items-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5" /> STOP
          </button>
        </div>
      </div>

      {/* Stream Metrics Strip in 3D Cyber Glass */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card3D glowColor="teal" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Live Event Counter</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#00F0FF] font-mono tracking-tight">
            {eventCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#00FF9D] font-mono font-semibold">Continuous Ingestion</div>
        </Card3D>

        <Card3D glowColor="cyan" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Ingestion Throughput</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#38BDF8] font-mono tracking-tight">
            142 msg/sec
          </div>
          <div className="text-[10px] text-muted font-mono">WebSocket Subscribed</div>
        </Card3D>

        <Card3D glowColor="amber" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono">Stream Velocity Mode</div>
          <div className="flex items-center gap-1 mt-1.5">
            {(['normal', 'fast', 'turbo'] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPumpSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono uppercase font-bold transition-all ${
                  pumpSpeed === spd
                    ? 'bg-[#FFB800] text-[#070B14] shadow-glowAmber'
                    : 'bg-[#070B14] text-muted border border-[#1E3156] hover:text-white'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-muted font-mono">Sampling Speed</div>
        </Card3D>

        <Card3D glowColor="teal" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Active Stream Filter</span>
            <span className="text-[10px] font-mono text-[#00FF9D] font-bold">
              {filteredPosts.length} / {posts.length}
            </span>
          </div>
          <div className="text-2xl font-bold text-[#F8FAFC] font-mono tracking-tight truncate">
            {filterPlatform.toUpperCase()} • {filterLang.toUpperCase()}
          </div>
          <div className="text-[10px] text-muted font-mono">Multi-Platform Buffer</div>
        </Card3D>
      </div>

      {/* Multi-Criteria Stream Filter Bar */}
      <div className="bg-surface p-4 rounded-xl border border-border space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-text uppercase font-mono flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-accent" /> Stream Filter Controls
          </span>
          <button
            onClick={() => {
              setFilterPlatform('all');
              setFilterLang('all');
              setFilterTopic('all');
              setMinInfluence(0);
            }}
            className="text-[11px] text-cyan hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Stream Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-mono text-muted uppercase block mb-1">Platform:</label>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="w-full bg-panel border border-border rounded-lg px-2.5 py-1 text-xs text-text focus:outline-none focus:border-cyan/50 font-mono"
            >
              <option value="all">All Platforms</option>
              <option value="x">X (Twitter)</option>
              <option value="telegram">Telegram</option>
              <option value="reddit">Reddit</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-muted uppercase block mb-1">Language:</label>
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="w-full bg-panel border border-border rounded-lg px-2.5 py-1 text-xs text-text focus:outline-none focus:border-cyan/50 font-mono"
            >
              <option value="all">All Languages</option>
              <option value="en">English (EN)</option>
              <option value="hi">Hindi (HI)</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-muted uppercase block mb-1">Topic Filter:</label>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="w-full bg-panel border border-border rounded-lg px-2.5 py-1 text-xs text-text focus:outline-none focus:border-cyan/50"
            >
              <option value="all">All Topics</option>
              <option value="topic_0">EV Charging Infrastructure</option>
              <option value="topic_1">5G Rollout</option>
              <option value="topic_2">AI Regulation</option>
              <option value="topic_3">UPI Payments</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-muted uppercase block mb-1">Min Influence:</label>
            <select
              value={minInfluence}
              onChange={(e) => setMinInfluence(Number(e.target.value))}
              className="w-full bg-panel border border-border rounded-lg px-2.5 py-1 text-xs text-text focus:outline-none focus:border-cyan/50 font-mono"
            >
              <option value={0}>All Accounts</option>
              <option value={0.5}>Influence &gt; 50%</option>
              <option value={0.8}>High Authority &gt; 80%</option>
            </select>
          </div>
        </div>
      </div>

      {/* Live Event Stream Feed */}
      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <PanelTitle icon={<Radio className="w-4 h-4 text-accent animate-pulse" />}>
            Continuous Ingested Stream ({filteredPosts.length} Displayed)
          </PanelTitle>
          <span className="text-[11px] font-mono text-muted">Showing live buffer</span>
        </div>

        <div className="divide-y divide-border">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 hover:bg-panelHover transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-accent">@{post.anonymizedUserId}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-surface text-cyan border border-cyan/20">
                    {post.platform}
                  </span>
                  <span className="text-[10px] text-muted font-mono uppercase bg-panel px-1.5 py-0.2 rounded border border-border">
                    {post.language}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-muted text-[11px] font-mono">
                  <span>{new Date(post.timestamp).toLocaleTimeString()}</span>
                  <span className="text-[#00FF9D] font-semibold">
                    ♥ {post.engagement?.likes || 0}
                  </span>
                  <span className="text-[#38BDF8] font-semibold">
                    💬 {post.engagement?.comments || 0}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {post.text}
              </p>

              {/* Hashtags and Inline Triage Actions Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-[#1E3156]/40">
                <div className="flex flex-wrap gap-1">
                  {post.hashtags && post.hashtags.length > 0 ? (
                    post.hashtags.map((h, i) => (
                      <span key={i} className="text-[11px] text-[#FFB800] hover:underline font-mono">
                        #{h}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-muted font-mono">No tags</span>
                  )}
                </div>

                {/* Inline Triage Actions (§5.2) */}
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={async () => {
                      await api.pinInvestigationItem('inv_case_001', {
                        type: 'post',
                        title: `Post by @${post.anonymizedUserId}`,
                        referenceId: post.id,
                        data: { text: post.text, platform: post.platform, engagement: post.engagement },
                        annotation: 'Live intercepted post flagged by analyst.',
                      });
                      alert(`Pinned post ${post.id} to Investigation Case NTRO-2026-089`);
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#111C35] text-[#00F0FF] hover:bg-[#00F0FF] hover:text-[#070B14] border border-[#1E3156] transition-all flex items-center gap-1"
                    title="Pin Post to Case Folder"
                  >
                    📌 Pin to Case
                  </button>

                  <button
                    onClick={async () => {
                      await api.createWatchlistRule({
                        name: `Watch: @${post.anonymizedUserId}`,
                        type: 'account',
                        query: `@${post.anonymizedUserId}`,
                        alertLevel: 'HIGH',
                        sensitivityThreshold: 80,
                      });
                      alert(`Added @${post.anonymizedUserId} to Account Watchlist`);
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#111C35] text-[#FFB800] hover:bg-[#FFB800] hover:text-[#070B14] border border-[#1E3156] transition-all flex items-center gap-1"
                    title="Add Author to Watchlist"
                  >
                    👁 Watchlist
                  </button>

                  <button
                    onClick={() => {
                      setPosts((prev) => prev.filter((p) => p.id !== post.id));
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#111C35] text-[#00FF9D] hover:bg-[#00FF9D]/20 border border-[#1E3156] transition-all"
                    title="Mark Post Reviewed"
                  >
                    ✓ Reviewed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
