import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowRight, RotateCw, Activity, Shield, Terminal } from 'lucide-react';

interface Hero3DProps {
  onExplore: () => void;
  onRefresh: () => void;
  activeUsersCount: number;
  totalPostsCount: number;
}

export const Hero3D: React.FC<Hero3DProps> = ({
  onExplore,
  onRefresh,
  activeUsersCount,
  totalPostsCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.0018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 180;
    camera.position.y = 20;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 4. Central Intelligence Sphere (Wireframe & Glowing Core)
    const coreGeometry = new THREE.IcosahedronGeometry(28, 3);
    const coreWireframe = new THREE.WireframeGeometry(coreGeometry);
    const coreLine = new THREE.LineSegments(
      coreWireframe,
      new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(coreLine);

    // Inner glowing solid sphere
    const innerGeo = new THREE.SphereGeometry(18, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0a224e,
      transparent: true,
      opacity: 0.65,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // 5. Orbiting Rings
    const ringGroup = new THREE.Group();

    const createOrbitRing = (radius: number, tiltX: number, tiltY: number, colorHex: number) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.2, radius + 0.2, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = tiltX;
      ringMesh.rotation.y = tiltY;
      return ringMesh;
    };

    const ring1 = createOrbitRing(42, Math.PI / 3, Math.PI / 6, 0x00f0ff);
    const ring2 = createOrbitRing(56, -Math.PI / 4, Math.PI / 4, 0x8b5cf6);
    const ring3 = createOrbitRing(68, Math.PI / 2.2, -Math.PI / 8, 0x3b82f6);
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);
    scene.add(ringGroup);

    // 6. Network Particle Cloud (Representing 600+ users & information nodes)
    const particleCount = 550;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0x3b82f6), // Blue
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0x10b981), // Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution around center
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 45 + Math.random() * 55;

      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material with round point shader appearance
    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 7. Dynamic Data Connection Lines
    const connectionCount = 75;
    const linePositions = new Float32Array(connectionCount * 2 * 3);
    const lineColors = new Float32Array(connectionCount * 2 * 3);

    const updateConnections = () => {
      let lineIdx = 0;
      for (let i = 0; i < connectionCount; i++) {
        const p1 = Math.floor(Math.random() * particleCount);
        const p2 = Math.floor(Math.random() * particleCount);

        linePositions[lineIdx] = positions[p1 * 3];
        linePositions[lineIdx + 1] = positions[p1 * 3 + 1];
        linePositions[lineIdx + 2] = positions[p1 * 3 + 2];

        linePositions[lineIdx + 3] = positions[p2 * 3];
        linePositions[lineIdx + 4] = positions[p2 * 3 + 1];
        linePositions[lineIdx + 5] = positions[p2 * 3 + 2];

        // Cyan glow lines
        lineColors[lineIdx] = 0.0;
        lineColors[lineIdx + 1] = 0.94;
        lineColors[lineIdx + 2] = 1.0;
        lineColors[lineIdx + 3] = 0.54;
        lineColors[lineIdx + 4] = 0.36;
        lineColors[lineIdx + 5] = 0.96;

        lineIdx += 6;
      }
    };
    updateConnections();

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });

    const networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(networkLines);

    // 8. Mouse Parallax Handler
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = y * 0.3;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', onMouseMove);

    // 9. Resize handler
    const onResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous Slow Rotations
      coreLine.rotation.y = elapsedTime * 0.12;
      coreLine.rotation.x = Math.sin(elapsedTime * 0.08) * 0.2;

      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.18;
      ring3.rotation.z = elapsedTime * 0.09;

      particleSystem.rotation.y = elapsedTime * 0.05;
      networkLines.rotation.y = elapsedTime * 0.05;

      // Mouse Parallax Lerp
      camera.position.x += (targetRotationY * 35 - camera.position.x) * 0.04;
      camera.position.y += (targetRotationX * 25 + 20 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Pulse core line scale
      const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.035;
      coreLine.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      coreGeometry.dispose();
      innerGeo.dispose();
      particleGeometry.dispose();
      lineGeometry.dispose();
      renderer.dispose();
    };
  }, []);

  const platforms = [
    { name: 'X', status: 'Connected', color: 'text-cyan-400 border-cyan-500/40' },
    { name: 'Telegram', status: 'Connected', color: 'text-cyan-300 border-cyan-400/40' },
    { name: 'Instagram', status: 'Demo', color: 'text-pink-400 border-pink-500/30' },
    { name: 'Facebook', status: 'Demo', color: 'text-blue-400 border-blue-500/30' },
    { name: 'Reddit', status: 'Demo', color: 'text-orange-400 border-orange-500/30' },
    { name: 'YouTube', status: 'Demo', color: 'text-red-400 border-red-500/30' },
  ];

  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-cyan-500/10">
      {/* 3D Canvas Background Container */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-auto cursor-grab active:cursor-grabbing" />

      {/* Cyber Grid & Vignette Overlays */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg via-transparent to-cyber-bg/70 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-bg/85 via-transparent to-cyber-bg/85 pointer-events-none" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center pointer-events-none">
        {/* NTRO / Problem Statement Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 shadow-glow-cyan mb-6 pointer-events-auto">
          <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-widest text-cyan-300 uppercase">
            SIH 2026 • PROBLEM 26152 • NTRO
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          See the pulse <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            behind the posts.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
          AI-powered social intelligence that connects sentiment, audience demographics,
          emerging trends, and influence networks into one intelligent command center.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 pointer-events-auto">
          <button
            onClick={onExplore}
            className="group flex items-center space-x-2 px-6 py-3.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
          >
            <span>Explore Intelligence</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-5 py-3.5 text-sm font-semibold rounded-lg glass-panel hover:bg-slate-800/60 border border-slate-700 text-slate-200 hover:text-white transition-all transform hover:-translate-y-0.5"
          >
            <RotateCw className="w-4 h-4 text-cyan-400" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Connected Platforms Bar */}
        <div className="pt-6 border-t border-slate-800/80 max-w-3xl mx-auto pointer-events-auto">
          <div className="flex items-center justify-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Connected Ingestion Pipeline</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {platforms.map((p) => (
              <div
                key={p.name}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-mono rounded-md bg-slate-900/80 border ${p.color}`}
              >
                <span className="font-semibold text-white">{p.name}</span>
                <span className="text-[10px] text-slate-400">({p.status})</span>
              </div>
            ))}
          </div>

          {/* Dynamic Live Counter stats banner */}
          <div className="flex items-center justify-center space-x-6 mt-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-cyan-300 font-bold">{totalPostsCount.toLocaleString()}</span> posts ingested
            </div>
            <div>•</div>
            <div>
              <span className="text-emerald-400 font-bold">{activeUsersCount.toLocaleString()}</span> active nodes mapped
            </div>
            <div>•</div>
            <div className="hidden sm:inline">
              <span className="text-violet-400 font-bold">18</span> communities detected
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD Coordinate Indicators */}
      <div className="absolute bottom-3 left-4 hidden md:flex items-center space-x-2 text-[10px] font-mono text-cyan-500/60 pointer-events-none">
        <Terminal className="w-3 h-3" />
        <span>3D_MATRIX_LOC: [{(mousePos.x * 100).toFixed(0)}, {(mousePos.y * 100).toFixed(0)}]</span>
        <span>•</span>
        <span>NTRO_TOPOLOGY_CORE_ONLINE</span>
      </div>
      <div className="absolute bottom-3 right-4 hidden md:flex items-center space-x-2 text-[10px] font-mono text-slate-500 pointer-events-none">
        <span>INTERACTIVE WEBDL CANVAS</span>
        <span>•</span>
        <span className="text-emerald-400 font-semibold">60 FPS</span>
      </div>
    </section>
  );
};
