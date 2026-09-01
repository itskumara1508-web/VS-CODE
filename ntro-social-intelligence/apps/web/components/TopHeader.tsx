'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Radar,
  Bell,
  Settings,
  Shield,
  Loader2,
  Play,
  Zap,
  Search,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function TopHeader({
  userName,
  onOpenCommandPalette,
  onOpenEventIntel,
}: {
  userName: string;
  onOpenCommandPalette: () => void;
  onOpenEventIntel: () => void;
}) {
  const router = useRouter();
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  const triggerDemo = async () => {
    setDemoRunning(true);
    setDemoMessage('Injecting Event: EV Grid Overload...');
    try {
      await api.demoEvent();
      setTimeout(() => {
        setDemoMessage('AI Intelligence Synthesized!');
        setTimeout(() => {
          setDemoMessage(null);
          setDemoRunning(false);
          onOpenEventIntel();
        }, 1100);
      }, 900);
    } catch (e) {
      console.error(e);
      setDemoRunning(false);
      setDemoMessage(null);
    }
  };

  return (
    <header className="h-14 border-b border-[#19D3C5]/20 bg-[#0B1220] px-5 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-sm">
      {/* LEFT: [ICON] SOCIOINTELL */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Intelligence Radar Icon in Electric Teal */}
        <div className="flex items-center justify-center text-[#19D3C5] shrink-0">
          <Radar className="w-5 h-5 sm:w-6 sm:h-6 text-[#19D3C5] stroke-[2.2]" />
        </div>

        {/* Title: ◈ SOCIOINTELL */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[#19D3C5] text-sm sm:text-base font-bold select-none">◈</span>
          <h1 className="text-base sm:text-lg md:text-[19px] tracking-[0.04em] text-[#F8FAFC] font-sans whitespace-nowrap leading-none font-extrabold">
            SOCIOINTELL
          </h1>
        </div>
      </div>

      {/* RIGHT: [● LIVE]  [Notification]  [Analyst/Profile]  [Settings] */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Simulation Demo Trigger (Compact) */}
        <button
          onClick={triggerDemo}
          disabled={demoRunning}
          className="hidden lg:inline-flex btn btn-amber text-xs py-1 px-2.5 font-bold items-center gap-1.5 shadow-glowAmber"
          title="Trigger Incident Simulation"
        >
          {demoRunning ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-[11px]">{demoMessage || 'Simulating...'}</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span className="text-[11px]">PLAY DEMO</span>
            </>
          )}
        </button>

        {/* Quick Search Shortcut */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#162238] border border-[#223354] hover:border-[#38BDF8]/50 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
          title="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-[#19D3C5]" />
          <kbd className="text-[9px] px-1 py-0.2 bg-[#0B1220] rounded border border-[#223354] text-[#94A3B8] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* ● LIVE Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#19D3C5]/10 border border-[#19D3C5]/30 text-[10px] sm:text-[11px] text-[#19D3C5] font-mono font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#19D3C5] animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* Notification Icon */}
        <button
          onClick={() => router.push('/alerts')}
          className="p-1.5 rounded-lg bg-[#162238] border border-[#223354] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#38BDF8]/40 relative transition-all"
          title="Threat & Anomaly Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#EF4444] ring-1 ring-[#162238]" />
        </button>

        {/* Analyst / Profile */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#162238] border border-[#223354]">
          <div className="w-5 h-5 rounded-md bg-[#19D3C5]/15 border border-[#19D3C5]/30 flex items-center justify-center text-[10px] font-mono font-bold text-[#19D3C5]">
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-[#F8FAFC] truncate max-w-[100px]">
            {userName}
          </span>
          <span className="hidden md:inline-block text-[10px] text-[#94A3B8] font-mono border-l border-[#223354] pl-1.5">
            Analyst
          </span>
        </div>

        {/* Settings Icon */}
        <button
          onClick={() => router.push('/settings')}
          className="p-1.5 rounded-lg bg-[#162238] border border-[#223354] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#38BDF8]/40 transition-all"
          title="System Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
