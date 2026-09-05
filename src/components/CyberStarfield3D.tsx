import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Platform } from '../types';

interface CyberStarfield3DProps {
  activePlatform?: Platform | 'emotion' | null;
}

export const CyberStarfield3D: React.FC<CyberStarfield3DProps> = ({ activePlatform }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Platform-specific color palettes
    const getPlatformColors = (platform?: Platform | 'emotion' | null) => {
      switch (platform) {
        case 'emotion':
          return [0xec4899, 0x8b5cf6, 0x00f0ff, 0xf43f5e];
        case 'X':
          return [0x1da1f2, 0x38bdf8, 0x0284c7, 0xbae6fd];
        case 'Telegram':
          return [0x229ed9, 0x00c0ff, 0x38bdf8, 0x7dd3fc];
        case 'Instagram':
          return [0xe1306c, 0xc13584, 0xf77737, 0x833ab4];
        case 'Facebook':
          return [0x1877f2, 0x2563eb, 0x3b82f6, 0x60a5fa];
        case 'Reddit':
          return [0xff4500, 0xf97316, 0xfb923c, 0xf59e0b];
        case 'YouTube':
          return [0xff0000, 0xef4444, 0xdc2626, 0xf87171];
        default:
          return [0x00f0ff, 0x3b82f6, 0x8b5cf6, 0x06b6d4];
      }
    };

    const colors = getPlatformColors(activePlatform);

    // 1. Three.js Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.0008);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 800;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Generate Star Particles (1,400 3D Star Nodes)
    const starCount = 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const baseColorObjects = colors.map((c) => new THREE.Color(c));

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2400;
      positions[i3 + 1] = (Math.random() - 0.5) * 2400;
      positions[i3 + 2] = (Math.random() - 0.5) * 2200;

      const chosenColor = baseColorObjects[Math.floor(Math.random() * baseColorObjects.length)];
      starColors[i3] = chosenColor.r;
      starColors[i3 + 1] = chosenColor.g;
      starColors[i3 + 2] = chosenColor.b;

      starSizes[i] = Math.random() * 3.5 + 1.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    // Custom circle particle texture
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(32, 32, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const starTexture = createStarTexture();

    const starMaterial = new THREE.PointsMaterial({
      size: 4,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starField = new THREE.Points(geometry, starMaterial);
    scene.add(starField);

    // 5. Constellation Grid Web (Geometric line connections)
    const lineCount = 100;
    const linePositions = new Float32Array(lineCount * 2 * 3);
    const lineColors = new Float32Array(lineCount * 2 * 3);

    for (let i = 0; i < lineCount; i++) {
      const p1 = Math.floor(Math.random() * 300);
      const p2 = Math.floor(Math.random() * 300);

      const i6 = i * 6;
      linePositions[i6] = positions[p1 * 3];
      linePositions[i6 + 1] = positions[p1 * 3 + 1];
      linePositions[i6 + 2] = positions[p1 * 3 + 2];

      linePositions[i6 + 3] = positions[p2 * 3];
      linePositions[i6 + 4] = positions[p2 * 3 + 1];
      linePositions[i6 + 5] = positions[p2 * 3 + 2];

      const c = baseColorObjects[0];
      lineColors[i6] = c.r;
      lineColors[i6 + 1] = c.g;
      lineColors[i6 + 2] = c.b;
      lineColors[i6 + 3] = c.r;
      lineColors[i6 + 4] = c.g;
      lineColors[i6 + 5] = c.b;
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });

    const constellationLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(constellationLines);

    // 6. Shooting Comets / Cyber Data Streaks
    const comets: {
      mesh: THREE.Line;
      direction: THREE.Vector3;
      speed: number;
      reset: () => void;
    }[] = [];

    for (let c = 0; c < 3; c++) {
      const cometGeo = new THREE.BufferGeometry();
      const cometPos = new Float32Array(6);
      cometGeo.setAttribute('position', new THREE.BufferAttribute(cometPos, 3));
      const cometMat = new THREE.LineBasicMaterial({
        color: baseColorObjects[0],
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const cometLine = new THREE.Line(cometGeo, cometMat);
      scene.add(cometLine);

      const comet = {
        mesh: cometLine,
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize(),
        speed: 8 + Math.random() * 8,
        reset: function () {
          this.mesh.position.set(
            (Math.random() - 0.5) * 1600,
            (Math.random() - 0.5) * 1600,
            (Math.random() - 0.5) * 1600
          );
          this.direction
            .set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2)
            .normalize();
          this.speed = 8 + Math.random() * 8;
        },
      };
      comet.reset();
      comets.push(comet);
    }

    // 7. Interactive Parallax Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 0.35;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      camera.position.x = currentMouseX;
      camera.position.y = -currentMouseY;
      camera.lookAt(0, 0, 0);

      // Cosmic rotation
      starField.rotation.y = elapsedTime * 0.02;
      starField.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

      constellationLines.rotation.y = elapsedTime * 0.02;
      constellationLines.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

      // Animate Shooting Comets
      comets.forEach((comet) => {
        comet.mesh.position.addScaledVector(comet.direction, comet.speed);
        const cometPos = comet.mesh.geometry.attributes.position.array as Float32Array;
        cometPos[0] = 0;
        cometPos[1] = 0;
        cometPos[2] = 0;
        cometPos[3] = -comet.direction.x * 60;
        cometPos[4] = -comet.direction.y * 60;
        cometPos[5] = -comet.direction.z * 60;
        comet.mesh.geometry.attributes.position.needsUpdate = true;

        if (comet.mesh.position.length() > 1800) {
          comet.reset();
        }
      });

      // Pulse brightness
      starMaterial.opacity = 0.75 + Math.sin(elapsedTime * 2) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      starMaterial.dispose();
      starTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      comets.forEach((c) => {
        c.mesh.geometry.dispose();
        (c.mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [activePlatform]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};

