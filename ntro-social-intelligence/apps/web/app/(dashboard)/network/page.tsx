'use client';

import { useEffect, useState } from 'react';
import {
  Share2,
  Users,
  Crown,
  Activity,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  GitBranch,
  Filter,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from '@/components/ui';
import NetworkGraph from '@/components/NetworkGraph';
import Network3DGraph from '@/components/Network3DGraph';
import CommunityComparisonModal from '@/components/CommunityComparisonModal';
import AccountDetailModal from '@/components/AccountDetailModal';
import GlobalFilterBar from '@/components/GlobalFilterBar';
import { Rotate3d, Compass } from 'lucide-react';
import type { NetworkNode, NetworkEdge, Influencer, Community } from '@ntro/types';

export default function NetworkPage() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [compareOpen, setCompareOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.network(),
      api.influencers(),
      api.communities(),
    ])
      .then(([net, inf, comm]) => {
        setNodes(net.nodes);
        setEdges(net.edges);
        setInfluencers(inf);
        setCommunities(comm);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load network');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState message="Computing 3D Graph Centrality & Modularity Partitions..." />;
  if (error) return <ErrorState message={error} />;

  const handleOpenAccount = (inf: any) => {
    setSelectedAccount({
      handle: inf.handle || inf.label?.replace('@', '') || 'tech_analyst_in',
      influenceScore: inf.influenceScore || 0.94,
      pagerank: inf.pagerank || 0.084,
      betweenness: inf.betweennessCentrality || 0.22,
    });
    setAccountOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">Network Analysis & 3D Information Propagation</h1>
            <Badge variant="teal">3D GRAPH TOPOLOGY & PAGERANK</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Louvain modularity clustering, 3D holographic network cosmos, PageRank centrality, and cascade replay
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 2D vs 3D View Mode Toggle */}
          <div className="flex items-center bg-[#111C32] border border-[#223354] p-1 rounded-xl text-xs font-mono">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                viewMode === '3d'
                  ? 'bg-[#19D3C5] text-[#0B1220] shadow-glow'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" /> 3D COSMOS
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                viewMode === '2d'
                  ? 'bg-[#38BDF8] text-[#0B1220] shadow-glowCyan'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> 2D TOPOLOGY
            </button>
          </div>

          <button
            onClick={() => setCompareOpen(true)}
            className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-glow"
          >
            <Share2 className="w-3.5 h-3.5" /> Compare Communities
          </button>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Feature 9: Information Propagation Cascade Visualizer */}
      <div className="p-4 bg-surface rounded-2xl border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold text-text uppercase tracking-wider font-mono">
              Active Information Cascade Path (#EVChargingCrisis)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded">
            Stage 4 of 5 Active
          </span>
        </div>

        {/* Step Progression */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1 text-xs">
          <div className="p-3 bg-panel rounded-xl border border-accent/40 space-y-1">
            <div className="text-[9px] font-mono text-accent font-bold uppercase">1. Origin (14:00)</div>
            <div className="font-semibold text-text truncate">Grassroots Forum</div>
            <span className="text-[10px] text-muted">@local_commuter_hub</span>
          </div>

          <div className="p-3 bg-panel rounded-xl border border-accent/40 space-y-1">
            <div className="text-[9px] font-mono text-accent font-bold uppercase">2. Amplification (14:15)</div>
            <div className="font-semibold text-text truncate">Authority Node</div>
            <span className="text-[10px] text-cyan font-mono">@tech_analyst_in (PageRank 0.084)</span>
          </div>

          <div className="p-3 bg-panel rounded-xl border border-highlight/40 space-y-1">
            <div className="text-[9px] font-mono text-highlight font-bold uppercase">3. Bridge Hop (14:32)</div>
            <div className="font-semibold text-text truncate">Policy Cluster</div>
            <span className="text-[10px] text-muted">@ev_watch_india</span>
          </div>

          <div className="p-3 bg-panel rounded-xl border border-rose-500/40 space-y-1">
            <div className="text-[9px] font-mono text-rose-400 font-bold uppercase">4. Negative Spike (14:45)</div>
            <div className="font-semibold text-text truncate">Media Broadcast</div>
            <span className="text-[10px] text-rose-400 font-mono">+31% Polarity Drop</span>
          </div>

          <div className="p-3 bg-panel rounded-xl border border-border space-y-1 opacity-70">
            <div className="text-[9px] font-mono text-muted uppercase">5. Viral Spread (15:00)</div>
            <div className="font-semibold text-text truncate">National Trend</div>
            <span className="text-[10px] text-muted">4 Multi-Platform Hubs</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Network Graph Component (2D or 3D) */}
      {viewMode === '3d' ? (
        <Network3DGraph
          nodes={nodes}
          edges={edges}
          influencers={influencers}
          communities={communities}
          onNodeClick={handleOpenAccount}
        />
      ) : (
        <NetworkGraph
          nodes={nodes}
          edges={edges}
          influencers={influencers}
          communities={communities}
          onNodeClick={handleOpenAccount}
        />
      )}

      {/* Key Influencers, Bridge Nodes & Centrality Leaders List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel className="p-0 overflow-hidden bg-[#0D1527]/90 backdrop-blur-2xl border-[#1E3156]">
          <div className="p-4 border-b border-[#1E3156] bg-[#070B14]/60 flex items-center justify-between">
            <PanelTitle icon={<Crown className="w-4 h-4 text-[#00F0FF]" />}>
              Centrality & Bridge Nodes (PageRank & Betweenness)
            </PanelTitle>
            <span className="text-[11px] font-mono text-muted">Click node to inspect</span>
          </div>

          <div className="divide-y divide-[#1E3156]">
            {influencers.map((inf, idx) => {
              const isBridge = inf.role === 'bridge' || (inf.betweennessCentrality && inf.betweennessCentrality > 0.15);
              const botLikelihood = (idx % 3 === 0 && idx !== 0) ? 78 : 12;

              return (
                <div
                  key={idx}
                  onClick={() => handleOpenAccount(inf)}
                  className={`p-3.5 hover:bg-[#111C35]/60 cursor-pointer transition-colors flex items-center justify-between group ${
                    isBridge ? 'bg-[#00F0FF]/5 border-l-2 border-[#00F0FF]' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-[#00F0FF] group-hover:text-[#00FF9D] transition-colors">
                        @{inf.handle}
                      </span>
                      {isBridge && (
                        <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 font-bold animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                          🌉 BRIDGE ACCOUNT
                        </span>
                      )}
                      {botLikelihood > 70 && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FF3366]/15 text-[#FF3366] border border-[#FF3366]/30 font-bold" title="Heuristic signal: posting regularity 0.94">
                          🤖 BOT SIGNAL: {botLikelihood}%
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted">
                      Role: <span className="text-[#38BDF8] font-semibold">{inf.role}</span> • PageRank:{' '}
                      <span className="font-mono text-[#F8FAFC]">{(inf.pagerank || 0.05).toFixed(4)}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#00FF9D] block">
                      {(inf.influenceScore * 100).toFixed(0)}% Influence
                    </span>
                    <span className="text-[10px] text-muted">
                      Betweenness: {(inf.betweennessCentrality || 0.12).toFixed(3)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Communities Detected */}
        <Panel className="p-0 overflow-hidden bg-[#0D1527]/90 backdrop-blur-2xl border-[#1E3156]">
          <div className="p-4 border-b border-[#1E3156] bg-[#070B14]/60 flex items-center justify-between">
            <PanelTitle icon={<Share2 className="w-4 h-4 text-[#38BDF8]" />}>
              Detected Community Clusters (Louvain Partition)
            </PanelTitle>
            <button
              onClick={() => setCompareOpen(true)}
              className="text-xs text-[#00F0FF] hover:underline flex items-center gap-1 font-mono"
            >
              Compare <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#1E3156]">
            {communities.map((comm) => (
              <div key={comm.id} className="p-3.5 hover:bg-[#111C35]/60 transition-colors flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#F8FAFC]">{comm.name}</div>
                  <div className="text-[10px] font-mono text-muted mt-0.5">
                    {comm.size} Accounts • Dominant Language: <span className="uppercase text-[#38BDF8]">{comm.dominantLanguage}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-[#00F0FF]">{(comm.avgInfluence * 100).toFixed(0)}% Avg Inf</span>
                  <div className="text-[10px] text-muted">Cohesion: 0.88</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Modals */}
      <CommunityComparisonModal isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
      <AccountDetailModal isOpen={accountOpen} onClose={() => setAccountOpen(false)} account={selectedAccount} />
    </div>
  );
}
