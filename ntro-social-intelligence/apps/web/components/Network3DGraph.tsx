'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  Rotate3d,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Layers,
  Sparkles,
  Crown,
  Share2,
  Activity,
  X,
  Eye,
  Zap,
} from 'lucide-react';
import type { NetworkNode, NetworkEdge, Influencer, Community } from '@ntro/types';

interface Node3D {
  id: string;
  label: string;
  kind: 'user' | 'topic' | 'community';
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  pulsePhase: number;
  metadata?: any;
}

interface Edge3D {
  sourceId: string;
  targetId: string;
  color: string;
  weight: number;
}

interface Network3DGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  influencers?: Influencer[];
  communities?: Community[];
  onNodeClick?: (node: NetworkNode) => void;
  isPropagationReplay?: boolean;
  activeStageStep?: number;
}

export default function Network3DGraph({
  nodes,
  edges,
  influencers = [],
  communities = [],
  onNodeClick,
  isPropagationReplay = false,
  activeStageStep = 0,
}: Network3DGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Camera & Orientation State
  const [rotX, setRotX] = useState(0.2);
  const [rotY, setRotY] = useState(0.5);
  const [zoom, setZoom] = useState(380);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<Node3D | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  // Generate 3D Spherical & Cluster Coordinates
  const nodes3D: Node3D[] = useMemo(() => {
    const list = nodes.slice(0, 80);
    return list.map((node, idx) => {
      const isTopic = node.kind === 'topic';
      const isCommunity = node.kind === 'community';
      const isInfluencer = node.kind === 'user' && ((node.metadata as any)?.influenceScore || 0) > 0.8;

      // Spherical distribution with Fibonacci spiral
      const phi = Math.acos(1 - (2 * (idx + 0.5)) / list.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * idx;

      const radius = isTopic ? 80 : isCommunity ? 160 : isInfluencer ? 210 : 250 + (idx % 4) * 20;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) * 0.85;
      const z = radius * Math.sin(phi) * Math.sin(theta);

      const color =
        isTopic
          ? '#F59E0B' // Amber
          : isCommunity
          ? '#8B5CF6' // Electric Violet
          : isInfluencer
          ? '#1D63FF' // Royal Cobalt
          : '#64748B'; // Slate

      return {
        id: node.id,
        label: node.label,
        kind: node.kind,
        x,
        y,
        z,
        color,
        size: isTopic ? 9 : isCommunity ? 10 : isInfluencer ? 7.5 : 4.5,
        pulsePhase: Math.random() * Math.PI * 2,
        metadata: node.metadata,
      };
    });
  }, [nodes]);

  const edges3D: Edge3D[] = useMemo(() => {
    const nodeIds = new Set(nodes3D.map((n) => n.id));
    return edges
      .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
      .slice(0, 120)
      .map((e) => ({
        sourceId: e.source,
        targetId: e.target,
        color: '#1B2A63',
        weight: e.weight || 1,
      }));
  }, [edges, nodes3D]);

  // Main 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentRotY = rotY;
    let currentRotX = rotX;
    let time = 0;

    const render = () => {
      time += 0.02;
      if (autoRotate && !isDraggingRef.current) {
        currentRotY += 0.003;
        setRotY(currentRotY);
      }

      // Handle Canvas DPI
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = zoom;

      // 3D Rotation Matrix Calculations
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      // Project function (x, y, z) -> (screenX, screenY, depthScale, zVal)
      const project = (x: number, y: number, z: number) => {
        // Rotate Y
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate X
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective Divide
        const cameraZ = z2 + 650;
        const scale = fov / Math.max(cameraZ, 100);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        return { px, py, scale, z2, cameraZ };
      };

      // 1. Draw 3D Holographic Wireframe Cage & Latitude/Longitude Rings
      if (showRings) {
        ctx.strokeStyle = 'rgba(25, 211, 197, 0.08)';
        ctx.lineWidth = 1;

        // Equatorial & Polar orbital circles
        for (const ringRadius of [100, 180, 260]) {
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.15) {
            const rx = ringRadius * Math.cos(a);
            const rz = ringRadius * Math.sin(a);
            const p = project(rx, 0, rz);
            if (a === 0) ctx.moveTo(p.px, p.py);
            else ctx.lineTo(p.px, p.py);
          }
          ctx.stroke();
        }

        // Tilted orbit ellipse
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.15) {
          const rx = 240 * Math.cos(a);
          const ry = 80 * Math.sin(a);
          const rz = 240 * Math.sin(a);
          const p = project(rx, ry, rz);
          if (a === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.stroke();
      }

      // Map Projected Nodes
      const nodeProjMap = new Map<string, { node: Node3D; px: number; py: number; scale: number; z: number }>();

      const projectedNodes = nodes3D.map((n) => {
        const p = project(n.x, n.y, n.z);
        const entry = { node: n, px: p.px, py: p.py, scale: p.scale, z: p.z2 };
        nodeProjMap.set(n.id, entry);
        return entry;
      });

      // 2. Draw 3D Edges
      edges3D.forEach((e, idx) => {
        const p1 = nodeProjMap.get(e.sourceId);
        const p2 = nodeProjMap.get(e.targetId);
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.1, Math.min(0.6, (avgZ + 300) / 600));

        const isCascadeActive = isPropagationReplay && (idx % 3 === 0);

        ctx.strokeStyle = isCascadeActive
          ? `rgba(0, 98, 255, ${0.5 + 0.4 * Math.sin(time * 4 + idx)})`
          : `rgba(27, 42, 99, ${alpha * 0.7})`;
        ctx.lineWidth = isCascadeActive ? 2 : Math.max(0.6, p1.scale * 0.8);

        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();

        // 3D Flowing Energy Photons along edges
        if (isCascadeActive || idx % 4 === 0) {
          const tPos = ((time * 0.8 + idx * 0.2) % 1);
          const photonX = p1.px + (p2.px - p1.px) * tPos;
          const photonY = p1.py + (p2.py - p1.py) * tPos;

          ctx.fillStyle = isCascadeActive ? '#38BDF8' : (idx % 2 === 0 ? '#0062FF' : '#8B5CF6');
          ctx.beginPath();
          ctx.arc(photonX, photonY, Math.max(1.5, 2.5 * p1.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 3. Sort Nodes by Depth (Z-Buffer Painter's Algorithm)
      projectedNodes.sort((a, b) => a.z - b.z);

      // 4. Render 3D Projected Nodes
      let currentHover: Node3D | null = null;

      projectedNodes.forEach(({ node, px, py, scale, z }) => {
        const rad = Math.max(2, node.size * scale);
        const depthAlpha = Math.max(0.3, Math.min(1.0, (z + 320) / 600));

        // Check mouse hover
        const distToMouse = Math.hypot(px - mousePos.x, py - mousePos.y);
        const isHovered = distToMouse < rad + 6;
        if (isHovered) currentHover = node;

        const isHighlightedInCascade =
          isPropagationReplay && (node.kind === 'topic' || (node.metadata?.influenceScore || 0) > 0.8);

        // Ambient Node Glow Aura
        if (node.kind === 'topic' || (node.metadata?.influenceScore || 0) > 0.8 || isHovered) {
          const glowRad = rad * (isHovered ? 3.2 : 2.4 + 0.4 * Math.sin(time * 3 + node.pulsePhase));
          const grad = ctx.createRadialGradient(px, py, rad * 0.5, px, py, glowRad);
          grad.addColorStop(0, node.color);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, glowRad, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node Solid Sphere
        ctx.fillStyle = node.color;
        ctx.globalAlpha = isHovered ? 1.0 : depthAlpha;
        ctx.beginPath();
        ctx.arc(px, py, isHovered ? rad * 1.4 : rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Node Rim Border
        ctx.strokeStyle = isHovered ? '#F8FAFC' : '#0B1220';
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // High-Centrality Labels for near-plane nodes
        if ((z > -50 && (node.kind === 'topic' || (node.metadata?.influenceScore || 0) > 0.8)) || isHovered) {
          ctx.font = `${isHovered ? 'bold 11px' : '9px'} monospace`;
          ctx.fillStyle = isHovered ? '#F8FAFC' : 'rgba(148, 163, 184, 0.85)';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, px, py - rad - 5);
        }
      });

      setHoveredNode(currentHover);
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [nodes3D, edges3D, rotX, rotY, zoom, autoRotate, showRings, mousePos, isPropagationReplay]);

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;

    setRotY((y) => y + dx * 0.008);
    setRotX((x) => Math.max(-1.4, Math.min(1.4, x + dy * 0.008)));

    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(180, Math.min(750, z - e.deltaY * 0.4)));
  };

  const handleCanvasClick = () => {
    if (hoveredNode) {
      const orig = nodes.find((n) => n.id === hoveredNode.id);
      if (orig) onNodeClick?.(orig);
    }
  };

  return (
    <div className="relative w-full h-[560px] bg-[#0B1220] border border-[#223354] rounded-2xl overflow-hidden shadow-2xl select-none flex flex-col group">
      {/* 3D Cyber Depth Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none cyber-grid-3d" />

      {/* Top 3D Control Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left Status Badge */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#162238]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#223354] shadow-lg">
          <Rotate3d className="w-4 h-4 text-[#19D3C5] animate-spin-3d" />
          <span className="text-xs font-mono font-bold text-[#F8FAFC]">3D HOLOGRAPHIC NETWORK COSMOS</span>
          <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.2 rounded border border-[#38BDF8]/20">
            {nodes3D.length} 3D Nodes
          </span>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#162238]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#223354] shadow-lg text-xs font-mono">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 px-2.5 ${
              autoRotate ? 'bg-[#19D3C5] text-[#0B1220] font-bold shadow-glow' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            title="Toggle 3D Orbit Rotation"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="text-[10px] hidden sm:inline">{autoRotate ? 'ORBITING' : 'PAUSED'}</span>
          </button>

          <button
            onClick={() => setShowRings(!showRings)}
            className={`p-1.5 rounded-lg transition-colors ${
              showRings ? 'text-[#38BDF8] bg-[#111C32]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
            title="Toggle Holographic Orbital Rings"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(750, z + 50))}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C32]"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.max(180, z - 50))}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C32]"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setRotX(0.2);
              setRotY(0.5);
              setZoom(380);
              setAutoRotate(true);
            }}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C32]"
            title="Reset 3D Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main HTML5 3D Rendering Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
      />

      {/* 3D Legend Strip */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#080E24]/90 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-[#1B2A63] flex items-center gap-3 text-xs font-mono shadow-glass">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1D63FF] shadow-glowBlue animate-pulse" />
          <span className="text-[#94A3B8]">Key Influencers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-glowViolet" />
          <span className="text-[#94A3B8]">Communities</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
          <span className="text-[#94A3B8]">Topics</span>
        </div>
        <span className="text-[10px] text-muted hidden md:inline">• Drag to orbit 3D • Scroll to zoom</span>
      </div>

      {/* Floating 3D Hover Tooltip Card */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none p-3 bg-[#080E24]/95 backdrop-blur-xl border border-[#1D63FF]/50 rounded-xl shadow-2xl space-y-1 animate-in fade-in duration-100"
          style={{
            left: Math.min(mousePos.x + 15, 600),
            top: Math.max(mousePos.y - 45, 60),
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: hoveredNode.color }}
            />
            <span className="text-xs font-bold text-[#F8FAFC]">{hoveredNode.label}</span>
            <span className="text-[9px] font-mono uppercase bg-[#040817] px-1.5 py-0.2 rounded text-[#38BDF8] border border-[#1B2A63]">
              {hoveredNode.kind}
            </span>
          </div>
          {hoveredNode.metadata && (
            <div className="text-[10px] font-mono text-[#94A3B8] space-y-0.5">
              {hoveredNode.metadata.role && (
                <div>
                  Role: <strong className="text-[#60A5FA]">{hoveredNode.metadata.role}</strong>
                </div>
              )}
              {hoveredNode.metadata.influenceScore && (
                <div>
                  Influence: <strong className="text-[#A78BFA]">{(hoveredNode.metadata.influenceScore * 100).toFixed(0)}%</strong>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
