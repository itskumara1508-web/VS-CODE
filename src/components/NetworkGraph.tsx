import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Info,
} from 'lucide-react';
import { NetworkNode, NetworkEdge } from '../types';
import { networkNodes, networkEdges } from '../data/mockData';

export const NetworkGraph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<NetworkNode[]>(networkNodes);
  const [edges] = useState<NetworkEdge[]>(networkEdges);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(networkNodes[0]);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [filterRole, setFilterRole] = useState<'ALL' | 'KOL' | 'Bridge' | 'Community'>('ALL');

  // Pan & Zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggedNodeRef = useRef<NetworkNode | null>(null);

  // Moving data packets across edges
  const packetsRef = useRef<
    { edgeId: string; progress: number; speed: number; color: string }[]
  >([]);

  useEffect(() => {
    // Initialize animated packet flow on key edges
    packetsRef.current = edges
      .filter((e) => e.activePacket)
      .map((e, idx) => ({
        edgeId: e.id,
        progress: (idx * 0.25) % 1,
        speed: 0.006 + Math.random() * 0.006,
        color: '#00f0ff',
      }));
  }, [edges]);

  // Filtered nodes
  const visibleNodes = useMemo(() => {
    if (filterRole === 'ALL') return nodes;
    return nodes.filter((n) => n.role === filterRole);
  }, [nodes, filterRole]);

  // Connected nodes map for highlighting
  const connectedNodeIds = useMemo(() => {
    if (!selectedNode && !hoveredNode) return new Set<string>();
    const activeId = (hoveredNode || selectedNode)?.id;
    const set = new Set<string>();
    set.add(activeId!);
    edges.forEach((e) => {
      if (e.source === activeId) set.add(e.target);
      if (e.target === activeId) set.add(e.source);
    });
    return set;
  }, [selectedNode, hoveredNode, edges]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Apply pan & zoom
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      // 1. Draw Edges
      edges.forEach((edge) => {
        const srcNode = nodes.find((n) => n.id === edge.source);
        const tgtNode = nodes.find((n) => n.id === edge.target);
        if (!srcNode || !tgtNode) return;

        const isHighlighted =
          connectedNodeIds.size > 0 &&
          connectedNodeIds.has(srcNode.id) &&
          connectedNodeIds.has(tgtNode.id);

        ctx.beginPath();
        ctx.moveTo(srcNode.x, srcNode.y);
        ctx.lineTo(tgtNode.x, tgtNode.y);

        if (isHighlighted) {
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = Math.max(2, edge.weight * 0.6);
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 8;
        } else {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
          ctx.lineWidth = Math.max(1, edge.weight * 0.3);
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      });

      // 2. Draw Moving Data Packets
      packetsRef.current.forEach((pkt) => {
        const edge = edges.find((e) => e.id === pkt.edgeId);
        if (!edge) return;
        const srcNode = nodes.find((n) => n.id === edge.source);
        const tgtNode = nodes.find((n) => n.id === edge.target);
        if (!srcNode || !tgtNode) return;

        pkt.progress += pkt.speed;
        if (pkt.progress > 1) pkt.progress = 0;

        const currentX = srcNode.x + (tgtNode.x - srcNode.x) * pkt.progress;
        const currentY = srcNode.y + (tgtNode.y - srcNode.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(currentX, currentY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      // Reset shadow
      ctx.shadowBlur = 0;

      // 3. Draw Nodes
      visibleNodes.forEach((node) => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isConnected = connectedNodeIds.size === 0 || connectedNodeIds.has(node.id);

        const nodeOpacity = isConnected ? 1 : 0.25;

        // Outer glow ring if selected or KOL
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Main Node Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = nodeOpacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Node Inner Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(2, node.size * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Node Label
        ctx.font = node.role === 'KOL' ? 'bold 11px JetBrains Mono' : '9px JetBrains Mono';
        ctx.fillStyle = isSelected ? '#00f0ff' : isConnected ? '#e2e8f0' : '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.size + 14);

        // Floating Influence Badge for KOL / Bridge
        if (node.role === 'KOL' || node.role === 'Bridge') {
          const badgeText = `${node.role.toUpperCase()} • ${node.influenceScore.toFixed(1)}`;
          ctx.font = '8px JetBrains Mono';
          ctx.fillStyle = 'rgba(3, 7, 18, 0.85)';
          const textWidth = ctx.measureText(badgeText).width;
          ctx.fillRect(node.x - textWidth / 2 - 4, node.y - node.size - 18, textWidth + 8, 14);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(node.x - textWidth / 2 - 4, node.y - node.size - 18, textWidth + 8, 14);

          ctx.fillStyle = node.color;
          ctx.fillText(badgeText, node.x, node.y - node.size - 8);
        }
      });

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [nodes, edges, visibleNodes, selectedNode, hoveredNode, connectedNodeIds, transform]);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse event handlers for Pan & Zoom & Click
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    return {
      x: (clientX - transform.x) / transform.scale,
      y: (clientY - transform.y) / transform.scale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    // Check if clicking a node
    const clickedNode = nodes.find(
      (n) => Math.hypot(n.x - coords.x, n.y - coords.y) <= n.size + 6
    );

    if (clickedNode) {
      setSelectedNode(clickedNode);
      draggedNodeRef.current = clickedNode;
    } else {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    // Node dragging
    if (draggedNodeRef.current) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggedNodeRef.current?.id ? { ...n, x: coords.x, y: coords.y } : n
        )
      );
      return;
    }

    // Pan dragging
    if (isDraggingRef.current) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      }));
      return;
    }

    // Hover detection
    const hover = nodes.find(
      (n) => Math.hypot(n.x - coords.x, n.y - coords.y) <= n.size + 6
    );
    setHoveredNode(hover || null);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    draggedNodeRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.4, Math.min(2.5, prev.scale * zoomFactor)),
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <section id="network" className="w-full py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
              <Share2 className="w-4 h-4" />
              <span>Module E • Link Analysis & Network Topology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Follow the Influence
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Map how narratives propagate through communities. Detect key opinion leaders, bridge nodes, and sentiment contagion across network edges.
            </p>
          </div>

          {/* Network Global Metrics */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 uppercase block text-[10px]">Active Nodes</span>
              <span className="text-cyan-300 font-bold">1,284</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 uppercase block text-[10px]">Connections</span>
              <span className="text-blue-300 font-bold">6,791</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-500 uppercase block text-[10px]">Communities</span>
              <span className="text-violet-300 font-bold">18</span>
            </div>
          </div>
        </div>

        {/* Top Influencers Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-mono text-xs">
          <div
            onClick={() => setSelectedNode(nodes.find((n) => n.id === 'node-kol-1') || null)}
            className="glass-panel p-3 rounded-xl border border-cyan-500/30 hover:border-cyan-400 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                #1
              </span>
              <div>
                <span className="text-white font-bold block">KOL Alpha</span>
                <span className="text-[10px] text-slate-400">@cyber_intel_in</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Score</span>
              <span className="text-cyan-400 font-bold text-sm">94.2</span>
            </div>
          </div>

          <div
            onClick={() => setSelectedNode(nodes.find((n) => n.id === 'node-kol-2') || null)}
            className="glass-panel p-3 rounded-xl border border-blue-500/30 hover:border-blue-400 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                #2
              </span>
              <div>
                <span className="text-white font-bold block">KOL Beta</span>
                <span className="text-[10px] text-slate-400">@bharat_defense_watch</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Score</span>
              <span className="text-blue-400 font-bold text-sm">87.6</span>
            </div>
          </div>

          <div
            onClick={() => setSelectedNode(nodes.find((n) => n.id === 'node-kol-3') || null)}
            className="glass-panel p-3 rounded-xl border border-violet-500/30 hover:border-violet-400 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold">
                #3
              </span>
              <div>
                <span className="text-white font-bold block">KOL Gamma</span>
                <span className="text-[10px] text-slate-400">@delhi_policy_lens</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Score</span>
              <span className="text-violet-400 font-bold text-sm">81.4</span>
            </div>
          </div>
        </div>

        {/* Network Canvas & Inspector Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Canvas Viewport */}
          <div
            ref={containerRef}
            className="lg:col-span-8 relative h-[520px] rounded-xl bg-slate-950/90 border border-cyan-500/30 overflow-hidden shadow-inner-glow"
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />

            {/* Canvas HUD Controls Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-800 font-mono text-xs">
              {(['ALL', 'KOL', 'Bridge', 'Community'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-2.5 py-1 rounded transition-all ${
                    filterRole === role
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Zoom / Reset Buttons */}
            <div className="absolute top-4 right-4 flex items-center space-x-1.5">
              <button
                onClick={() => setTransform((p) => ({ ...p, scale: Math.min(2.5, p.scale * 1.2) }))}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTransform((p) => ({ ...p, scale: Math.max(0.4, p.scale / 1.2) }))}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetView}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300"
                title="Reset View"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Instructions helper overlay */}
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 flex items-center space-x-2 pointer-events-none">
              <Info className="w-3 h-3 text-cyan-400" />
              <span>Click node to inspect • Drag node to reposition • Scroll to zoom</span>
            </div>
          </div>

          {/* Node Inspector Side Panel */}
          <div className="lg:col-span-4 glass-panel rounded-xl p-5 border border-cyan-500/20 flex flex-col justify-between">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                        {selectedNode.role}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {selectedNode.handle} • {selectedNode.platform}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 text-slate-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Graph Centrality Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Influence</span>
                    <span className="text-cyan-400 font-bold text-sm">{selectedNode.influenceScore}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">PageRank</span>
                    <span className="text-blue-400 font-bold text-sm">{selectedNode.pagerank}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Betweenness</span>
                    <span className="text-violet-400 font-bold text-sm">{selectedNode.betweenness}</span>
                  </div>
                </div>

                {/* Community & Sentiment */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Assigned Community:</span>
                    <span className="text-white font-semibold">{selectedNode.communityName}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Dominant Sentiment:</span>
                    <span className="text-emerald-400 font-semibold">{selectedNode.sentiment}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400">Degree (Direct Links):</span>
                    <span className="text-white font-semibold">{selectedNode.degree} edges</span>
                  </div>
                </div>

                {/* Amplified Topics */}
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
                    Topics Amplified by Node:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.amplifiedTopics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800/80 text-cyan-300 border border-cyan-500/30"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline activity */}
                <div className="pt-3 border-t border-slate-800 text-xs font-mono">
                  <span className="text-slate-400 uppercase block mb-2 text-[10px]">
                    Activity Timeline Spike (Posts/hr)
                  </span>
                  <div className="flex items-end justify-between h-12 gap-1.5 pt-2">
                    {selectedNode.activityHistory.map((act, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-cyan-500/40 rounded-t border-t border-cyan-300"
                          style={{ height: `${Math.min(100, (act.activity / 220) * 100)}%` }}
                        />
                        <span className="text-[8px] text-slate-500">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 font-mono text-xs">
                <Share2 className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-white font-bold mb-1">Select a Node to Inspect</p>
                <p className="text-[11px] text-slate-500">
                  Click any key opinion leader, bridge node, or community cluster in the canvas to examine centrality and dissemination metrics.
                </p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>ALGORITHM: LOUVAIN COMMUNITY</span>
              <span className="text-cyan-400">NTRO_GRAPH_v2</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
