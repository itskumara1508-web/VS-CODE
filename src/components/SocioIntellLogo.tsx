import React from 'react';

interface SocioIntellLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SocioIntellLogo: React.FC<SocioIntellLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', subtext: 'text-[8px]', gap: 'space-x-2' },
    md: { icon: 'w-10 h-10', text: 'text-xl', subtext: 'text-[9px]', gap: 'space-x-3' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', subtext: 'text-[10px]', gap: 'space-x-3.5' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', subtext: 'text-xs', gap: 'space-x-4' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center ${currentSize.gap} group select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Tactical Cyber Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${currentSize.icon}`}>
        {/* Ambient Radial Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/30 via-blue-500/20 to-violet-600/30 blur-[6px] group-hover:blur-md transition-all duration-300" />

        {/* Outer Hexagon/Shield Cyber Frame */}
        <div className="relative w-full h-full rounded-xl bg-[#071328]/90 border border-cyan-400/50 group-hover:border-cyan-300 shadow-glow-cyan flex items-center justify-center overflow-hidden transition-all duration-300">
          {/* Cyber Scanline Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-transparent to-transparent pointer-events-none" />

          {/* High-Tech Vector Core */}
          <svg
            viewBox="0 0 48 48"
            className="w-[72%] h-[72%] text-cyan-400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Hexagonal Target Boundary */}
            <path
              d="M24 4L40 13.2V31.6L24 41L8 31.6V13.2L24 4Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeDasharray="4 2"
              className="opacity-60"
            />

            {/* Inner Tactical Shield */}
            <path
              d="M24 9L35 15.5V26.5C35 32.5 30 36.5 24 38.5C18 36.5 13 32.5 13 26.5V15.5L24 9Z"
              fill="url(#shieldGrad)"
              stroke="#00f0ff"
              strokeWidth="1.6"
            />

            {/* Neural Radar Pulses */}
            <circle cx="24" cy="23" r="6" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
            <circle cx="24" cy="23" r="2.5" fill="#00f0ff" />

            {/* Crosshair telemetry lines */}
            <line x1="24" y1="14" x2="24" y2="18" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="24" y1="28" x2="24" y2="32" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="15" y1="23" x2="19" y2="23" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="29" y1="23" x2="33" y2="23" stroke="#00f0ff" strokeWidth="1.5" />

            <defs>
              <linearGradient id="shieldGrad" x1="13" y1="9" x2="35" y2="38.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0d3268" stopOpacity="0.9" />
                <stop offset="1" stopColor="#081734" stopOpacity="0.95" />
              </linearGradient>
            </defs>
          </svg>

          {/* Live Ping Beacon */}
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center space-x-1.5 leading-none">
          <span className={`font-extrabold tracking-wider text-white ${currentSize.text} font-sans`}>
            SOCIO<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">INTELL</span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {showSubtitle && (
          <div className="flex items-center space-x-1.5 mt-1 font-mono tracking-widest uppercase">
            <span className={`${currentSize.subtext} font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors`}>
              NATIONAL CYBER INTELLIGENCE
            </span>
            <span className="text-[7px] px-1 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold hidden sm:inline-block">
              NTRO
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

