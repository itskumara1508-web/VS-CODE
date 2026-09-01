'use client';

import { useEffect, useRef } from 'react';

export default function HolographicRadar3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += 0.025;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.45;

      // 3D Perspective Elliptical Concentric Rings (Oode Interlocking Ring Aesthetic)
      for (let r = 0.25; r <= 1; r += 0.25) {
        const rad = maxR * r;
        ctx.strokeStyle = r % 0.5 === 0 ? `rgba(139, 92, 246, ${0.08 + r * 0.12})` : `rgba(0, 98, 255, ${0.06 + r * 0.1})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.ellipse(cx, cy, rad, rad * 0.45, -0.15, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3D Rotating Radar Sweep Cone
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.15); // Perspective slant
      ctx.scale(1, 0.45); // 3D Tilt perspective

      const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
      sweepGrad.addColorStop(0, 'rgba(0, 98, 255, 0.45)');
      sweepGrad.addColorStop(0.6, 'rgba(139, 92, 246, 0.25)');
      sweepGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxR, angle, angle + Math.PI * 0.35);
      ctx.closePath();
      ctx.fill();

      // Radar Sweep Leading Beam Line
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxR * Math.cos(angle + Math.PI * 0.35), maxR * Math.sin(angle + Math.PI * 0.35));
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none opacity-60"
    />
  );
}

