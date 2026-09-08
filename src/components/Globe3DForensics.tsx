import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  ExternalLink,
  Radio,
  X,
  Play,
  Pause,
} from 'lucide-react';
import { PostForensicsRecord } from '../data/postForensicsData';
import {
  XLogo,
  TelegramLogo,
  InstagramLogo,
  FacebookLogo,
  RedditLogo,
  YoutubeLogo,
} from './PlatformLogos';

interface Globe3DForensicsProps {
  records: PostForensicsRecord[];
  selectedRecord: PostForensicsRecord | null;
  onSelectRecord: (record: PostForensicsRecord) => void;
  onInspectRecord: (record: PostForensicsRecord) => void;
}

// Helper to convert lat/lon to 3D Cartesian coordinates on sphere
const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Platform colors for 3D elements
const getPlatformHex = (p: string): number => {
  switch (p.toLowerCase()) {
    case 'x':
      return 0x38bdf8; // Sky blue
    case 'telegram':
      return 0x00f0ff; // Cyan
    case 'instagram':
      return 0xec4899; // Pink
    case 'facebook':
      return 0x3b82f6; // Blue
    case 'reddit':
      return 0xf97316; // Orange
    case 'youtube':
      return 0xef4444; // Red
    default:
      return 0x10b981; // Emerald
  }
};

export const Globe3DForensics: React.FC<Globe3DForensicsProps> = ({
  records,
  selectedRecord,
  onSelectRecord,
  onInspectRecord,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [targetRotation, setTargetRotation] = useState<{ x: number; y: number } | null>(null);

  // References for Three.js objects
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });

  // Filter records by selected platform if any
  const displayedRecords = useMemo(() => {
    if (selectedPlatform === 'All') return records;
    return records.filter((r) => r.platform.toLowerCase() === selectedPlatform.toLowerCase());
  }, [records, selectedPlatform]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.002);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.z = 210;
    camera.position.y = 25;
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Main Globe Master Group
    const masterGlobeGroup = new THREE.Group();
    scene.add(masterGlobeGroup);
    globeGroupRef.current = masterGlobeGroup;

    const globeRadius = 68;

    // 4a. Core Dark Sphere
    const coreGeo = new THREE.SphereGeometry(globeRadius - 0.5, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x051329,
      transparent: true,
      opacity: 0.94,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGlobeGroup.add(coreMesh);

    // 4b. Graticule / Coordinate Grid Lines (Latitude & Longitude)
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius, 24, 24));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    masterGlobeGroup.add(wireframe);

    // 4c. Procedural Continental Dot Matrix Landmasses
    // Generate dot cloud across approximate continental centers
    const continentCenters = [
      // India & South Asia
      { lat: 20, lon: 78, span: 22, density: 160 },
      // Europe
      { lat: 52, lon: 15, span: 25, density: 180 },
      // North America
      { lat: 40, lon: -98, span: 35, density: 220 },
      // Middle East
      { lat: 26, lon: 48, span: 18, density: 110 },
      // Southeast Asia
      { lat: 8, lon: 106, span: 20, density: 140 },
      // East Asia / China / Japan
      { lat: 35, lon: 115, span: 25, density: 190 },
      // Africa
      { lat: 5, lon: 22, span: 30, density: 180 },
      // Australia / Oceania
      { lat: -25, lon: 135, span: 22, density: 130 },
      // South America
      { lat: -15, lon: -55, span: 25, density: 160 },
    ];

    const landDotsPositions: number[] = [];
    const landDotsColors: number[] = [];
    const cyanColor = new THREE.Color(0x00f0ff);
    const emeraldColor = new THREE.Color(0x10b981);

    continentCenters.forEach((c) => {
      for (let i = 0; i < c.density; i++) {
        const randLat = c.lat + (Math.random() - 0.5) * c.span * 2;
        const randLon = c.lon + (Math.random() - 0.5) * c.span * 2;
        const pos = latLonToVector3(randLat, randLon, globeRadius + 0.3);
        landDotsPositions.push(pos.x, pos.y, pos.z);

        const mixed = cyanColor.clone().lerp(emeraldColor, Math.random() * 0.4);
        landDotsColors.push(mixed.r, mixed.g, mixed.b);
      }
    });

    const landDotsGeo = new THREE.BufferGeometry();
    landDotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(landDotsPositions, 3));
    landDotsGeo.setAttribute('color', new THREE.Float32BufferAttribute(landDotsColors, 3));

    const landDotsMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const landPoints = new THREE.Points(landDotsGeo, landDotsMat);
    masterGlobeGroup.add(landPoints);

    // 4d. Atmospheric Halo Glow Outer Shell
    const haloGeo = new THREE.SphereGeometry(globeRadius + 5, 32, 32);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 0.4;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    masterGlobeGroup.add(haloMesh);

    // 4e. Orbital Telemetry Equatorial Ring
    const orbitRingGeo = new THREE.RingGeometry(globeRadius + 18, globeRadius + 18.5, 96);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    masterGlobeGroup.add(orbitRing);

    // 5. Markers Sub-Group
    const markersGroup = new THREE.Group();
    masterGlobeGroup.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // 6. Great-Circle Arcs Sub-Group
    const arcsGroup = new THREE.Group();
    masterGlobeGroup.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;

    // 7. Ambient Starlight Cloud in Background
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 800;
      starPos[i + 1] = (Math.random() - 0.5) * 800;
      starPos[i + 2] = (Math.random() - 0.5) * 800;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 1.2, transparent: true, opacity: 0.35 });
    scene.add(new THREE.Points(starGeo, starMat));

    // Mouse Interaction Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosRef.current.x;
      const deltaY = e.clientY - previousMousePosRef.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.006;
      globeGroupRef.current.rotation.x += deltaY * 0.006;

      // Limit vertical rotation to prevent flipping
      globeGroupRef.current.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroupRef.current.rotation.x));

      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch Support for Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosRef.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.008;
      globeGroupRef.current.rotation.x += deltaY * 0.008;
      globeGroupRef.current.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroupRef.current.rotation.x));

      previousMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // 8. Main Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth auto-rotation if enabled and not dragging
      if (isAutoRotating && !isDraggingRef.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.0025;
      }

      // Smooth interpolation to target camera / globe rotation if focusing
      if (targetRotation && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += (targetRotation.y - globeGroupRef.current.rotation.y) * 0.05;
        globeGroupRef.current.rotation.x += (targetRotation.x - globeGroupRef.current.rotation.x) * 0.05;
      }

      // Pulse beam heights and halo
      if (haloMesh) {
        haloMesh.rotation.y = elapsedTime * 0.05;
      }
      if (orbitRing) {
        orbitRing.rotation.z = elapsedTime * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight || 560;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isAutoRotating]);

  // Update 3D Markers & Telemetry Arcs whenever displayedRecords change
  useEffect(() => {
    if (!markersGroupRef.current || !arcsGroupRef.current) return;
    const markersGroup = markersGroupRef.current;
    const arcsGroup = arcsGroupRef.current;
    const globeRadius = 68;

    // Clear previous markers & arcs
    while (markersGroup.children.length > 0) {
      markersGroup.remove(markersGroup.children[0]);
    }
    while (arcsGroup.children.length > 0) {
      arcsGroup.remove(arcsGroup.children[0]);
    }

    // 1. Plot 3D Spherical Markers for each Post
    displayedRecords.forEach((rec) => {
      const pos = latLonToVector3(rec.coordinates[0], rec.coordinates[1], globeRadius + 0.4);
      const colorHex = getPlatformHex(rec.platform);

      // Marker Group
      const markerObj = new THREE.Group();
      markerObj.position.copy(pos);
      markerObj.userData = { record: rec };

      // Inner Glowing Pin Sphere
      const pinGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: colorHex,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      markerObj.add(pinMesh);

      // Outer Pulsating Halo
      const pulseGeo = new THREE.RingGeometry(1.8, 3.2, 24);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.lookAt(new THREE.Vector3(0, 0, 0));
      markerObj.add(pulseMesh);

      // Vertical Laser / Beacon Light Pillar shooting outward into space
      const normal = pos.clone().normalize();
      const beamHeight = rec.threatLevel === 'Critical' ? 18 : rec.threatLevel === 'High' ? 14 : 9;
      const beamGeo = new THREE.CylinderGeometry(0.3, 0.7, beamHeight, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: rec.threatLevel === 'Critical' ? 0.85 : 0.6,
        blending: THREE.AdditiveBlending,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);

      // Position beam so it starts on globe surface and points outward
      beamMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(beamHeight / 2)));
      beamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      markerObj.add(beamMesh);

      markersGroup.add(markerObj);
    });

    // 2. Draw Great-Circle Flight / Communication Arcs between Major Hubs
    // Link India to London, Singapore, Dubai, San Jose, Frankfurt
    const hubPairs = [
      { from: [28.6139, 77.2090], to: [51.5074, -0.1278], color: 0x00f0ff }, // New Delhi -> London
      { from: [12.9716, 77.5946], to: [1.3521, 103.8198], color: 0x10b981 }, // Bengaluru -> Singapore
      { from: [19.0760, 72.8777], to: [25.2048, 55.2708], color: 0xf59e0b }, // Mumbai -> Dubai
      { from: [28.6139, 77.2090], to: [37.3382, -121.8863], color: 0x8b5cf6 }, // Delhi -> Silicon Valley
      { from: [51.5074, -0.1278], to: [50.1109, 8.6821], color: 0xec4899 }, // London -> Frankfurt
    ];

    hubPairs.forEach((pair) => {
      const start = latLonToVector3(pair.from[0], pair.from[1], globeRadius + 0.5);
      const end = latLonToVector3(pair.to[0], pair.to[1], globeRadius + 0.5);

      // Compute midpoint extruded above the surface
      const distance = start.distanceTo(end);
      const mid = start.clone().add(end).multiplyScalar(0.5);
      const midAltitude = globeRadius + distance * 0.28;
      mid.normalize().multiplyScalar(midAltitude);

      // Generate quadratic bezier 3D curve
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(48);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: pair.color,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcsGroup.add(arcLine);
    });
  }, [displayedRecords]);

  // Focus Camera / Globe on specific geographic region
  const focusRegion = (lat: number, lon: number) => {
    setIsAutoRotating(false);
    // Convert target lat/lon to sphere rotation:
    // Longitude maps to Y rotation, Latitude maps to X rotation
    const targetY = (-lon * Math.PI) / 180 + Math.PI / 2;
    const targetX = (lat * Math.PI) / 180;
    setTargetRotation({ x: targetX, y: targetY });
  };

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const currentZ = cameraRef.current.position.z;
    const newZ = direction === 'in' ? Math.max(130, currentZ - 25) : Math.min(320, currentZ + 25);
    cameraRef.current.position.z = newZ;
  };

  const renderPlatformLogo = (p: string) => {
    switch (p.toLowerCase()) {
      case 'x':
        return <XLogo className="w-4 h-4 text-sky-400" />;
      case 'telegram':
        return <TelegramLogo className="w-4 h-4 text-cyan-400" />;
      case 'instagram':
        return <InstagramLogo className="w-4 h-4 text-pink-400" />;
      case 'facebook':
        return <FacebookLogo className="w-4 h-4 text-blue-400" />;
      case 'reddit':
        return <RedditLogo className="w-4 h-4 text-orange-400" />;
      case 'youtube':
        return <YoutubeLogo className="w-4 h-4 text-red-400" />;
      default:
        return <Radio className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#030914] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.18)] overflow-hidden font-mono">
      {/* 1. Top HUD Overlay Bar */}
      <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto bg-[#071328]/90 p-2 rounded-2xl border border-cyan-500/30 backdrop-blur-xl">
          <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-400/50">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white tracking-wider">3D CYBER HOLOGRAPHIC GLOBE</span>
              <span className="px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 text-[10px] border border-cyan-500/50 font-bold animate-pulse">
                SPHERICAL LOCK
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Real-Time Coordinate Beacons • Drag to Rotate in 3D
            </div>
          </div>
        </div>

        {/* Platform Quick Filter Pills on Globe */}
        <div className="flex items-center space-x-1 pointer-events-auto bg-[#071328]/90 p-1.5 rounded-2xl border border-slate-700/80 backdrop-blur-xl">
          {['All', 'X', 'Telegram', 'Instagram', 'Facebook', 'Reddit', 'YouTube'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedPlatform === p
                  ? 'bg-cyan-500/30 text-white border border-cyan-400 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[580px] sm:h-[640px] cursor-grab active:cursor-grabbing relative select-none"
      />

      {/* 3. Left Controls Floating Bar: Auto-Spin, Zoom, Focus */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col space-y-2 pointer-events-auto">
        <div className="bg-[#071328]/95 p-2 rounded-2xl border border-cyan-500/40 backdrop-blur-xl shadow-2xl flex flex-col space-y-2">
          {/* Auto Spin Toggle */}
          <button
            onClick={() => {
              setIsAutoRotating(!isAutoRotating);
              setTargetRotation(null);
            }}
            title={isAutoRotating ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
            className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all ${
              isAutoRotating
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Regional Focus Orbit Buttons */}
        <div className="bg-[#071328]/95 p-2 rounded-2xl border border-cyan-500/40 backdrop-blur-xl shadow-2xl flex flex-col space-y-1 text-xs">
          <div className="text-[9px] text-cyan-400 font-bold px-1 py-0.5 tracking-wider uppercase border-b border-slate-800">
            Region Focus
          </div>
          <button
            onClick={() => focusRegion(20, 78)}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-left hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <span>🇮🇳</span>
            <span>India</span>
          </button>
          <button
            onClick={() => focusRegion(50, 10)}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-left hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <span>🇪🇺</span>
            <span>Europe</span>
          </button>
          <button
            onClick={() => focusRegion(38, -98)}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-left hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <span>🇺🇸</span>
            <span>Americas</span>
          </button>
          <button
            onClick={() => focusRegion(24, 54)}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-left hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <span>🇦🇪</span>
            <span>Mid-East</span>
          </button>
          <button
            onClick={() => focusRegion(1.3, 103)}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-left hover:text-cyan-300 transition-all flex items-center gap-1.5"
          >
            <span>🇸🇬</span>
            <span>Asia-Pac</span>
          </button>
        </div>
      </div>

      {/* 4. Active Target HUD Card in Bottom-Right Corner */}
      <div className="absolute bottom-6 right-6 z-20 max-w-sm w-full pointer-events-auto">
        {selectedRecord ? (
          <div className="p-4 rounded-2xl bg-[#081733]/95 border border-cyan-400/60 font-mono text-xs shadow-2xl backdrop-blur-xl space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] text-emerald-300 font-bold uppercase">3D SPHERICAL TARGET LOCK</span>
              </div>
              <button
                onClick={() => onSelectRecord(null as any)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User & Platform Identity */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <img
                  src={selectedRecord.userAvatar}
                  alt={selectedRecord.userName}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-400/50"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <span>{selectedRecord.userId}</span>
                    {selectedRecord.isVerified && <span className="text-cyan-400 text-xs">✓</span>}
                  </div>
                  <div className="text-slate-400 text-[11px]">{selectedRecord.userName}</div>
                </div>
              </div>

              <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                {renderPlatformLogo(selectedRecord.platform)}
              </div>
            </div>

            {/* Geographic & Platform Info */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
              <div>
                <span className="text-slate-400">Country:</span>{' '}
                <strong className="text-emerald-300">{selectedRecord.countryFlag} {selectedRecord.country}</strong>
              </div>
              <div>
                <span className="text-slate-400">City:</span>{' '}
                <strong className="text-white">{selectedRecord.userLocation}</strong>
              </div>
              <div>
                <span className="text-slate-400">Platform:</span>{' '}
                <strong className="text-cyan-300">{selectedRecord.platform}</strong>
              </div>
              <div>
                <span className="text-slate-400">Hardware:</span>{' '}
                <strong className="text-pink-300">{selectedRecord.device}</strong>
              </div>
              <div>
                <span className="text-slate-400">Time:</span>{' '}
                <strong className="text-amber-300">{selectedRecord.relativeTime}</strong>
              </div>
              <div>
                <span className="text-slate-400">Carrier:</span>{' '}
                <strong className="text-cyan-200 truncate">{selectedRecord.carrier}</strong>
              </div>
            </div>

            {/* Post text snippet */}
            <p className="text-[11px] text-slate-300 italic bg-slate-900/80 p-2 rounded border-l-2 border-cyan-400 line-clamp-2">
              "{selectedRecord.postContent}"
            </p>

            <div className="pt-1 flex items-center justify-between">
              <a
                href={selectedRecord.postUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-[10px] flex items-center gap-1"
              >
                <span>External Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              <button
                onClick={() => onInspectRecord(selectedRecord)}
                className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                Inspect Dossier →
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-[#081733]/90 border border-slate-700/80 text-slate-300 text-xs shadow-xl backdrop-blur-xl">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-1">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>SPHERICAL SELECTION HUD</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Click any active node on the globe to lock onto user coordinates and review platform activity.
            </p>
            <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>{displayedRecords.length} Active Beacons</span>
              <span className="text-emerald-400 font-bold">● 6 Feeds Live</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
