import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Orbit } from 'lucide-react';

interface Platform3DHologramProps {
  brandColor: string;
  platformName: string;
  size?: number;
}

export const Platform3DHologram: React.FC<Platform3DHologramProps> = ({
  brandColor,
  platformName,
  size = 180,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [telemetry, setTelemetry] = useState({ yaw: '0.0°', pitch: '0.0°', flux: '98.4%' });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // Convert hex string to THREE.Color
    const primaryColor = new THREE.Color(brandColor || '#00f0ff');
    const secondaryColor = primaryColor.clone().offsetHSL(0.08, 0, 0.15);

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.z = 70;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Central Glowing Core Sphere
    const coreGeo = new THREE.SphereGeometry(10, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreSphere);

    // 4. Wireframe Holographic Outer Shell (Icosahedron)
    const shellGeo = new THREE.IcosahedronGeometry(17, 2);
    const shellWire = new THREE.WireframeGeometry(shellGeo);
    const shellMat = new THREE.LineBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const shellMesh = new THREE.LineSegments(shellWire, shellMat);
    scene.add(shellMesh);

    // 5. Dual Gimbal Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(23, 0.45, 12, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(27, 0.35, 12, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 6;
    scene.add(ring2);

    // 6. Orbiting Swarm of Data Packet Nodes
    const packetCount = 48;
    const packetGeo = new THREE.BufferGeometry();
    const packetPositions = new Float32Array(packetCount * 3);
    const packetOrbitAngles = new Float32Array(packetCount);
    const packetOrbitRadii = new Float32Array(packetCount);
    const packetOrbitSpeeds = new Float32Array(packetCount);

    for (let i = 0; i < packetCount; i++) {
      packetOrbitAngles[i] = Math.random() * Math.PI * 2;
      packetOrbitRadii[i] = 19 + Math.random() * 12;
      packetOrbitSpeeds[i] = (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1);

      packetPositions[i * 3] = Math.cos(packetOrbitAngles[i]) * packetOrbitRadii[i];
      packetPositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      packetPositions[i * 3 + 2] = Math.sin(packetOrbitAngles[i]) * packetOrbitRadii[i];
    }

    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
    const packetMat = new THREE.PointsMaterial({
      size: 2.5,
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const packetSwarm = new THREE.Points(packetGeo, packetMat);
    scene.add(packetSwarm);

    // 7. Interactive Hover & Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;

    const handleContainerMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    container.addEventListener('mousemove', handleContainerMouseMove);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let tick = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      tick++;

      const speedMultiplier = isHovered ? 2.2 : 1.0;

      // Rotations
      coreSphere.rotation.y += 0.015 * speedMultiplier;
      shellMesh.rotation.y -= 0.008 * speedMultiplier;
      shellMesh.rotation.x += 0.005 * speedMultiplier;

      ring1.rotation.z += 0.02 * speedMultiplier;
      ring1.rotation.x += 0.006 * speedMultiplier;

      ring2.rotation.z -= 0.016 * speedMultiplier;
      ring2.rotation.y += 0.01 * speedMultiplier;

      // Core pulsing
      const pulseScale = 1.0 + Math.sin(elapsed * 3) * 0.08;
      coreSphere.scale.set(pulseScale, pulseScale, pulseScale);

      // Packet Swarm Motion
      const positions = packetGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < packetCount; i++) {
        packetOrbitAngles[i] += packetOrbitSpeeds[i] * speedMultiplier;
        positions[i * 3] = Math.cos(packetOrbitAngles[i]) * packetOrbitRadii[i];
        positions[i * 3 + 2] = Math.sin(packetOrbitAngles[i]) * packetOrbitRadii[i];
      }
      packetGeo.attributes.position.needsUpdate = true;

      // Smooth mouse follow
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.08;
      camera.position.y += (mouseY * 8 - camera.position.y) * 0.08;
      camera.lookAt(0, 0, 0);

      // Update telemetry display every 15 frames
      if (tick % 15 === 0) {
        setTelemetry({
          yaw: `${((shellMesh.rotation.y * 180) / Math.PI % 360).toFixed(1)}°`,
          pitch: `${((shellMesh.rotation.x * 180) / Math.PI % 360).toFixed(1)}°`,
          flux: `${(98.1 + Math.sin(elapsed) * 1.8).toFixed(1)}%`,
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleContainerMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellWire.dispose();
      shellMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      renderer.dispose();
    };
  }, [brandColor, size, isHovered]);

  return (
    <div
      className="relative flex flex-col items-center justify-center p-2 rounded-2xl glass-panel group transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered
          ? `0 0 30px ${brandColor}44, 0 8px 32px rgba(0, 0, 0, 0.4)`
          : undefined,
      }}
    >
      {/* HUD Header Bar */}
      <div className="w-full flex items-center justify-between px-2.5 py-1 mb-1 border-b border-slate-800/80 text-[9px] font-mono text-slate-400">
        <span className="flex items-center space-x-1 font-bold text-slate-300">
          <Orbit className="w-3 h-3 text-cyan-400 animate-spin-slow" />
          <span>3D HOLO-NODE • {platformName.toUpperCase()}</span>
        </span>
        <span className="flex items-center space-x-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>LOCKED</span>
        </span>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {/* Subtle crosshair in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-full h-[1px] bg-cyan-400" />
          <div className="absolute h-full w-[1px] bg-cyan-400" />
        </div>
      </div>

      {/* Micro-Telemetry Footer */}
      <div className="w-full mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between px-2 text-[9px] font-mono text-slate-500">
        <span>YAW: <strong className="text-slate-300">{telemetry.yaw}</strong></span>
        <span>PITCH: <strong className="text-slate-300">{telemetry.pitch}</strong></span>
        <span>FLUX: <strong style={{ color: brandColor }}>{telemetry.flux}</strong></span>
      </div>
    </div>
  );
};
