'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Users,
  Share2,
  Activity,
  Layers,
  Crown,
  Network,
  X,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  FastForward,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { NetworkNode, NetworkEdge, Influencer, Community } from '@ntro/types';

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  influencers?: Influencer[];
  communities?: Community[];
  onNodeClick?: (node: NetworkNode) => void;
}

export default function NetworkGraph({
  nodes,
  edges,
  influencers = [],
  communities = [],
  onNodeClick,
}: NetworkGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // Propagation Replay Controller
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [replaySpeed, setReplaySpeed] = useState<0.5 | 1 | 2 | 5>(1);

  const propagationStages = [
    { step: 0, time: '14:00', title: 'Origin: Grassroots EV Forum', desc: 'Initial report of charging station outage posted by @local_commuter_hub.', activeCluster: 'comm_0' },
    { step: 1, time: '14:15', title: 'Authority Node Amplification', desc: 'PageRank leader @tech_analyst_in quotes telemetry log; engagement spikes 3.2x.', activeCluster: 'user_42' },
    { step: 2, time: '14:32', title: 'Cross-Community Boundary Bridge', desc: 'Narrative crosses modularity boundary into Policy & Academic cluster.', activeCluster: 'comm_1' },
    { step: 3, time: '14:45', title: 'Polarization & Negative Inversion', desc: 'Negative sentiment reaches 46% as media accounts report grid downtime.', activeCluster: 'comm_2' },
    { step: 4, time: '15:00', title: 'Full Multi-Cluster Infiltration', desc: '4 network clusters involved; system generates automated critical alert.', activeCluster: 'all' },
  ];

  useEffect(() => {
    if (!isReplaying) return;
    const intervalMs = (2000 / replaySpeed);
    const interval = setInterval(() => {
      setReplayStep((s) => {
        if (s >= propagationStages.length - 1) {
          setIsReplaying(false);
          return s;
        }
        return s + 1;
      });
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isReplaying, replaySpeed, propagationStages.length]);

  const layoutNodes = useMemo(() => {
    const width = 800;
    const height = 540;
    const centerX = width / 2;
    const centerY = height / 2;

    const displayNodes = nodes.slice(0, 75);

    return displayNodes.map((node, i) => {
      const angle = (i / displayNodes.length) * 2 * Math.PI;
      const meta = node.metadata as any;
      const isInfluencer = node.kind === 'user' && (meta?.influenceScore || 0) > 0.8;
      const isTopic = node.kind === 'topic';
      const isCommunity = node.kind === 'community';

      const radius = isTopic ? 65 : isCommunity ? 145 : isInfluencer ? 215 : 255 + (i % 3) * 22;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Light up nodes based on replay step
      const isHighlighted = isReplaying && (i % (replayStep + 2) === 0);

      const color =
        isHighlighted
          ? '#F5B942'
          : node.kind === 'topic'
          ? '#F5B942' // Amber Highlight
          : node.kind === 'community'
          ? '#38BDF8' // Cyan
          : isInfluencer
          ? '#19D3C5' // Electric Teal
          : '#64748B'; // Slate

      return {
        ...node,
        x,
        y,
        color,
        size: isHighlighted ? 22 : isTopic ? 17 : isCommunity ? 20 : isInfluencer ? 15 : 8,
      };
    });
  }, [nodes, isReplaying, replayStep]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, (typeof layoutNodes)[0]>();
    layoutNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [layoutNodes]);

  const layoutEdges = useMemo(() => {
    return edges
      .map((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        if (!sourceNode || !targetNode) return null;
        return {
          ...edge,
          x1: sourceNode.x,
          y1: sourceNode.y,
          x2: targetNode.x,
          y2: targetNode.y,
        };
      })
      .filter(Boolean) as Array<NetworkEdge & { x1: number; y1: number; x2: number; y2: number }>;
  }, [edges, nodeMap]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
  };

  const currentStage = propagationStages[replayStep] || propagationStages[0];

  return (
    <div className="flex flex-col space-y-3">
      {/* Propagation Replay Controller Toolbar */}
      <div className="bg-[#111C32] border border-[#223354] rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setReplayStep(0);
                setIsReplaying(false);
              }}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162238]"
              title="Reset to Origin"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsReplaying(!isReplaying)}
              className="p-1.5 rounded-lg bg-[#19D3C5] text-[#0B1220] hover:bg-[#19D3C5]/90 font-bold shadow-glow flex items-center gap-1.5 px-3"
            >
              {isReplaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isReplaying ? 'PAUSE REPLAY' : 'PLAY REPLAY'}</span>
            </button>
            <button
              onClick={() => setReplayStep((s) => Math.min(propagationStages.length - 1, s + 1))}
              className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#162238]"
              title="Next Stage"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#94A3B8]">
            <span>Speed:</span>
            {([0.5, 1, 2, 5] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setReplaySpeed(spd)}
                className={`px-1.5 py-0.5 rounded ${
                  replaySpeed === spd
                    ? 'bg-[#162238] text-[#19D3C5] border border-[#19D3C5]/30 font-bold'
                    : 'hover:text-[#F8FAFC]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Current Stage Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-[#F5B942] bg-[#F5B942]/10 border border-[#F5B942]/20 px-2 py-0.5 rounded">
            Stage {currentStage.step + 1}/{propagationStages.length} • {currentStage.time}
          </span>
          <span className="text-xs font-bold text-[#F8FAFC] truncate max-w-xs">{currentStage.title}</span>
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div className="relative w-full h-[540px] bg-[#0B1220] border border-[#223354] rounded-2xl overflow-hidden select-none">
        {/* Controls Overlay */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-[#162238]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#223354] shadow-lg">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C32] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C32] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C32] transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 bg-[#162238]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#223354] flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#19D3C5] shadow-glow" />
            <span className="text-[#94A3B8]">Key Influencers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
            <span className="text-[#94A3B8]">Communities</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5B942]" />
            <span className="text-[#94A3B8]">Narrative Topics</span>
          </div>
        </div>

        {/* Interactive SVG Canvas */}
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <defs>
            <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#19D3C5" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#meshGlow)" />

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Edges */}
            {layoutEdges.map((e, idx) => (
              <line
                key={idx}
                x1={e.x1}
                y1={e.y1}
                x2={e.x2}
                y2={e.y2}
                stroke={isReplaying ? '#19D3C5' : '#223354'}
                strokeWidth={isReplaying ? 1.5 : 1}
                strokeOpacity={isReplaying ? 0.7 : 0.4}
                strokeDasharray={isReplaying ? '4 2' : undefined}
              />
            ))}

            {/* Nodes */}
            {layoutNodes.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, ${n.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedNode(n);
                    onNodeClick?.(n);
                  }}
                >
                  <circle
                    r={n.size}
                    fill={n.color}
                    fillOpacity={0.85}
                    stroke={isSelected ? '#F8FAFC' : '#0B1220'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-transform group-hover:scale-125"
                  />
                  <text
                    dy={n.size + 12}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize={9}
                    fontFamily="monospace"
                    className="pointer-events-none group-hover:fill-[#F8FAFC] group-hover:font-bold"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <div className="absolute top-4 left-4 z-20 w-80 bg-[#162238]/95 backdrop-blur-md border border-[#223354] rounded-xl p-4 shadow-2xl space-y-3 animate-in fade-in duration-100">
            <div className="flex items-center justify-between border-b border-[#223354] pb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#19D3C5]" />
                <span className="text-xs font-mono font-bold text-[#F8FAFC] uppercase">{selectedNode.kind} NODE</span>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-[#94A3B8] hover:text-[#F8FAFC]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-sm font-bold text-[#F8FAFC]">{selectedNode.label}</div>
              <div className="text-[10px] font-mono text-[#94A3B8] mt-0.5">ID: {selectedNode.id}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="bg-[#111C32] p-2 rounded-lg border border-[#223354]">
                <span className="text-[9px] text-[#94A3B8] block">Degree Centrality</span>
                <span className="text-xs font-bold text-[#19D3C5]">{(selectedNode as any).degree || (selectedNode.metadata as any)?.degree || 32} ties</span>
              </div>
              <div className="bg-[#111C32] p-2 rounded-lg border border-[#223354]">
                <span className="text-[9px] text-[#94A3B8] block">PageRank</span>
                <span className="text-xs font-bold text-[#38BDF8]">0.0842</span>
              </div>
            </div>

            <button
              onClick={() => onNodeClick?.(selectedNode)}
              className="w-full btn btn-primary text-xs py-1.5 flex items-center justify-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" /> Full Node Intelligence Dossier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
