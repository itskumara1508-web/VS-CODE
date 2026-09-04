import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change: number;
  changePeriod?: string;
  icon: LucideIcon;
  sparklineData: number[];
  color: 'cyan' | 'blue' | 'violet' | 'emerald';
  badge?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  change,
  changePeriod = 'vs last 24h',
  icon: Icon,
  sparklineData,
  color,
  badge,
}) => {
  const isPositive = change >= 0;

  const colorStyles = {
    cyan: {
      border: 'hover:border-cyan-400/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      glow: 'hover:shadow-glow-cyan',
      stroke: '#00f0ff',
      fill: 'rgba(0, 240, 255, 0.12)',
    },
    blue: {
      border: 'hover:border-blue-400/50',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      glow: 'hover:shadow-glow-blue',
      stroke: '#3b82f6',
      fill: 'rgba(59, 130, 246, 0.12)',
    },
    violet: {
      border: 'hover:border-violet-400/50',
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      glow: 'hover:shadow-glow-violet',
      stroke: '#8b5cf6',
      fill: 'rgba(139, 92, 246, 0.12)',
    },
    emerald: {
      border: 'hover:border-emerald-400/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'hover:shadow-glow-emerald',
      stroke: '#10b981',
      fill: 'rgba(16, 185, 129, 0.12)',
    },
  }[color];

  // Generate SVG path for sparkline
  const min = Math.min(...sparklineData);
  const max = Math.max(...sparklineData);
  const range = max - min || 1;
  const width = 110;
  const height = 36;
  const points = sparklineData.map((d, i) => {
    const x = (i / (sparklineData.length - 1)) * width;
    const y = height - ((d - min) / range) * (height - 6) - 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;

  return (
    <div
      className={`relative glass-panel hud-corner rounded-xl p-5 transition-all duration-300 transform hover:-translate-y-1 ${colorStyles.border} ${colorStyles.glow}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-medium tracking-wider uppercase text-slate-400">
          {title}
        </span>
        <div className="flex items-center space-x-1.5">
          {badge && (
            <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-slate-800 border border-slate-700 text-slate-300 rounded">
              {badge}
            </span>
          )}
          <div className={`p-2 rounded-lg border ${colorStyles.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-mono font-semibold text-slate-400">
              {unit}
            </span>
          )}
        </div>

        {/* Sparkline visualization */}
        <div className="w-[110px] h-[36px]">
          <svg width={width} height={height} className="overflow-visible">
            <defs>
              <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={colorStyles.stroke} stopOpacity="0.35" />
                <stop offset="100%" stopColor={colorStyles.stroke} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#grad-${color})`} />
            <path
              d={pathD}
              fill="none"
              stroke={colorStyles.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sparkline final point dot */}
            <circle
              cx={(width).toFixed(1)}
              cy={(height - ((sparklineData[sparklineData.length - 1] - min) / range) * (height - 6) - 3).toFixed(1)}
              r="3"
              fill={colorStyles.stroke}
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex items-center space-x-1 font-mono">
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? '+' : ''}
            {change}%
          </span>
          <span className="text-slate-500 ml-1">{changePeriod}</span>
        </div>

        <span className="text-[10px] font-mono text-cyan-400/70 uppercase">
          AI VERIFIED
        </span>
      </div>
    </div>
  );
};

