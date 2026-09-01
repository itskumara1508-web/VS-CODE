'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  Smile,
  Users,
  TrendingUp,
  Share2,
  History,
  BrainCircuit,
  Bell,
  FileText,
  Settings,
  LogOut,
  Database,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react';
import { setToken } from '@/lib/api';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'live' | 'ai' | 'count';
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/live', label: 'Live Monitoring', icon: Activity, badge: 'LIVE', badgeType: 'live' },
  { href: '/sentiment', label: 'Sentiment Intelligence', icon: Smile },
  { href: '/audience', label: 'Audience Intelligence', icon: Users },
  { href: '/trends', label: 'Trend Intelligence', icon: TrendingUp },
  { href: '/network', label: 'Network Analysis', icon: Share2 },
  { href: '/timeline', label: 'Timeline Explorer', icon: History },
  { href: '/ai-analyst', label: 'AI Analyst', icon: BrainCircuit, badge: 'AI', badgeType: 'ai' },
  { href: '/alerts', label: 'Alert Center', icon: Bell },
  { href: '/reports', label: 'Intelligence Reports', icon: FileText },
  { href: '/datasources', label: 'Data Sources', icon: Database },
  { href: '/health', label: 'System Health', icon: HeartPulse },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    setToken(null);
    router.push('/login');
  };

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-surface flex flex-col z-20 select-none">
      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted/70">
          Navigation Modules
        </div>
        {NAV.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group ${
                active
                  ? 'bg-panel text-accent font-semibold border border-accent/30 shadow-sm'
                  : 'text-muted hover:text-text hover:bg-panel/60 hover:border-border/50 border border-transparent'
              }`}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  active ? 'text-accent' : 'text-muted group-hover:text-cyan'
                }`}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider ${
                    item.badgeType === 'live'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                      : 'bg-accent/15 text-accent border border-accent/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Analyst Profile & Security Sign Out */}
      <div className="p-3 border-t border-border bg-ink/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-panel border border-border">
          <div className="w-8 h-8 rounded-lg bg-cyan/15 border border-cyan/30 flex items-center justify-center text-xs font-mono font-bold text-cyan">
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-text truncate">{userName}</div>
            <div className="text-[10px] text-muted font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Active Session</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-surface transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
