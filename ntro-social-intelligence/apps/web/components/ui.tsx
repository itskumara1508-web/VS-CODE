'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Loader2 } from 'lucide-react';

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('panel', className)}>{children}</div>;
}

export function PanelTitle({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <div className="panel-title">
      {icon && <span className="text-accent">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

export function KpiCard({
  label,
  value,
  icon,
  trend,
  trendDirection = 'neutral',
  accentColor = 'teal',
  progressPercent,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  accentColor?: 'teal' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'violet' | 'blue';
  progressPercent?: number;
}) {
  const trendColor =
    trendDirection === 'up'
      ? 'text-[#059669]'
      : trendDirection === 'down'
      ? 'text-[#DC2626]'
      : 'text-slate-500';

  const iconBgMap = {
    teal: 'text-[#0062FF] bg-blue-50 border-blue-200 group-hover:border-blue-400',
    blue: 'text-[#0062FF] bg-blue-50 border-blue-200 group-hover:border-blue-400',
    violet: 'text-[#7C3AED] bg-purple-50 border-purple-200 group-hover:border-purple-400',
    cyan: 'text-[#0284C7] bg-sky-50 border-sky-200 group-hover:border-sky-400',
    amber: 'text-[#D97706] bg-amber-50 border-amber-200 group-hover:border-amber-400',
    emerald: 'text-[#059669] bg-emerald-50 border-emerald-200 group-hover:border-emerald-400',
    rose: 'text-[#DC2626] bg-rose-50 border-rose-200 group-hover:border-rose-400',
  };

  const meterGradientMap = {
    teal: 'from-[#0062FF] to-[#38BDF8]',
    blue: 'from-[#0062FF] to-[#60A5FA]',
    violet: 'from-[#7C3AED] to-[#A855F7]',
    cyan: 'from-[#0284C7] to-[#38BDF8]',
    amber: 'from-[#F59E0B] to-[#FBBF24]',
    emerald: 'from-[#10B981] to-[#34D399]',
    rose: 'from-[#EF4444] to-[#F87171]',
  };

  return (
    <div className="bg-white border border-slate-200 hover:border-[#0062FF]/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between relative overflow-hidden space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0062FF] animate-pulse shrink-0" />
            <div className="kpi-label truncate text-[10px] text-slate-500 tracking-wider font-semibold">{label}</div>
          </div>
          <div className="kpi-value text-slate-900 group-hover:text-[#0062FF] transition-colors text-xl font-bold tracking-tight">
            {value}
          </div>
        </div>

        {icon && (
          <div className={cn('rounded-xl p-2 border transition-all duration-200 shrink-0 shadow-sm', iconBgMap[accentColor] || iconBgMap.teal)}>
            {icon}
          </div>
        )}
      </div>

      {/* Bottom Telemetry Bar & Trend */}
      <div className="space-y-1.5 pt-1 border-t border-slate-100">
        {trend && (
          <div className={cn('text-[10.5px] font-mono flex items-center justify-between font-medium', trendColor)}>
            <div className="flex items-center gap-1">
              {trendDirection === 'up' && <TrendingUp className="w-3 h-3 text-[#059669]" />}
              {trendDirection === 'down' && <TrendingDown className="w-3 h-3 text-[#DC2626]" />}
              {trendDirection === 'neutral' && <Minus className="w-3 h-3 text-slate-400" />}
              <span className="truncate">{trend}</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400 uppercase">LIVE</span>
          </div>
        )}

        {/* Mini Stat Meter Bar */}
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', meterGradientMap[accentColor] || meterGradientMap.teal)}
            style={{ width: `${progressPercent ?? (trendDirection === 'up' ? 78 : trendDirection === 'down' ? 42 : 65)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode;
  variant?: 'default' | 'positive' | 'negative' | 'warning' | 'info' | 'teal' | 'amber' | 'violet' | 'blue';
  className?: string;
}) {
  const colors: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    positive: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    negative: 'bg-rose-50 text-rose-700 border border-rose-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    teal: 'bg-blue-50 text-[#0062FF] border border-blue-200',
    blue: 'bg-blue-50 text-[#0062FF] border border-blue-200',
    violet: 'bg-purple-50 text-purple-700 border border-purple-200',
  };
  return <span className={cn('badge', colors[variant] || colors.default, className)}>{children}</span>;
}

export function StatBar({
  label,
  value,
  percent,
  color = 'bg-accent',
}: {
  label: string;
  value: string;
  percent: number;
  color?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-muted text-[11px]">{label}</span>
        <span className="text-text font-bold">{value}</span>
      </div>
      <div className="h-2 bg-ink rounded-full overflow-hidden border border-border/50 p-0.5">
        <div
          className={cn('h-full rounded-full transition-all duration-700 shadow-sm', color)}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}

export function LoadingState({ message = 'Loading intelligence stream...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
      <Loader2 className="w-7 h-7 text-accent animate-spin" />
      <span className="text-xs font-mono tracking-wide">{message}</span>
    </div>
  );
}

export function EmptyState({ message = 'No intelligence data recorded' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted text-xs font-mono">
      <div className="p-3 rounded-xl bg-surface border border-border mb-2">
        <AlertCircle className="w-5 h-5 text-muted" />
      </div>
      <span>{message}</span>
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-bold text-text tracking-tight">{children}</h2>;
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 text-rose-400 text-xs font-mono flex items-center gap-3">
      <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
      <span>{message}</span>
    </div>
  );
}
