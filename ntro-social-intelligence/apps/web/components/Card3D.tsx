'use client';

import { useState, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: 'teal' | 'cyan' | 'amber' | 'rose' | 'slate' | 'blue' | 'violet';
  onClick?: () => void;
}

export default function Card3D({
  children,
  className,
  intensity = 15,
  glowColor = 'blue',
  onClick,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * intensity;
    const rotY = ((x - centerX) / centerX) * intensity;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((g) => ({ ...g, opacity: 0 }));
  };

  const glowClass = {
    blue: 'hover:shadow-md hover:border-[#0062FF]/50',
    violet: 'hover:shadow-md hover:border-[#8B5CF6]/50',
    teal: 'hover:shadow-md hover:border-[#0062FF]/40',
    cyan: 'hover:shadow-md hover:border-[#0EA5E9]/50',
    amber: 'hover:shadow-md hover:border-[#F59E0B]/50',
    rose: 'hover:shadow-md hover:border-[#EF4444]/50',
    slate: 'hover:shadow-md hover:border-slate-300',
  }[glowColor] || 'hover:shadow-md hover:border-[#0062FF]/50';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition-all cursor-pointer select-none',
        glowClass,
        className
      )}
    >
      {/* Dynamic Specular 3D Glare Light Reflector */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0,98,255,${glarePos.opacity * 0.4}) 0%, transparent 65%)`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}

