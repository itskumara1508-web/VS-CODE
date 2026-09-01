"use client";

import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = "md",
  showText = true,
  className = "",
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-xs tracking-wider",
    md: "text-sm tracking-wide",
    lg: "text-base tracking-wide",
    xl: "text-xl tracking-tight",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* 4-Petal Optical Lens / Interlocking Circle Geometric Glyph */}
      <div className={`relative shrink-0 ${iconSizes[size]} flex items-center justify-center`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0062FF] via-[#6366F1] to-[#8B5CF6] opacity-60 blur-md animate-pulse-ring" />

        {/* 4 Intersecting Optical Circles SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 drop-shadow-[0_2px_10px_rgba(0,98,255,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="topPetal" x1="50" y1="10" x2="50" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0062FF" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="bottomPetal" x1="50" y1="40" x2="50" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="leftPetal" x1="10" y1="50" x2="60" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0062FF" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="rightPetal" x1="40" y1="50" x2="90" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="centerCore" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* 4 Optical Lens Circles with Overlap Blend */}
          <circle cx="50" cy="34" r="24" fill="url(#topPetal)" style={{ mixBlendMode: "screen" }} />
          <circle cx="50" cy="66" r="24" fill="url(#bottomPetal)" style={{ mixBlendMode: "screen" }} />
          <circle cx="34" cy="50" r="24" fill="url(#leftPetal)" style={{ mixBlendMode: "screen" }} />
          <circle cx="66" cy="50" r="24" fill="url(#rightPetal)" style={{ mixBlendMode: "screen" }} />

          {/* Central Intersection Gem */}
          <circle cx="50" cy="50" r="10" fill="url(#centerCore)" />
          <circle cx="50" cy="50" r="4" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-slate-900 font-sans ${textSizes[size]} tracking-wider uppercase`}>
              SOCIOINTELL
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-[#0062FF] border border-blue-200 font-bold">
              v2.4
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase font-medium">
            AI-POWERED SOCIAL INTELLIGENCE
          </span>
        </div>
      )}
    </div>
  );
}
