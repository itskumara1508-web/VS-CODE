"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import {
  LayoutDashboard,
  Globe2,
  Radio,
  Brain,
  Users,
  TrendingUp,
  Network,
  Clock3,
  Zap,
  FolderLock,
  Bot,
  BellRing,
  FileBarChart,
  Database,
  Activity,
  Settings,
  Search,
  Play,
  Loader2,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { api } from "@/lib/api";

export interface NavModule {
  href: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  badge?: string;
  group: "MONITORING" | "PLATFORMS" | "INTELLIGENCE" | "TIMELINE" | "CASES" | "AI" | "OPERATIONS" | "SYSTEM";
}

export const NAV_MODULES: NavModule[] = [
  // 1. Overview
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "MONITORING" },

  // 2. Social Platforms
  { href: "/platforms", label: "Social Platforms", shortLabel: "Platforms", icon: Globe2, badge: "10", group: "PLATFORMS" },

  // 3. Live Monitoring
  { href: "/live", label: "Live Monitoring", shortLabel: "Live Stream", icon: Radio, badge: "LIVE", group: "MONITORING" },

  // 4. Sentiment Intelligence
  { href: "/sentiment", label: "Sentiment Intelligence", shortLabel: "Sentiment", icon: Brain, group: "INTELLIGENCE" },

  // 5. Audience Intelligence
  { href: "/audience", label: "Audience Intelligence", shortLabel: "Audience", icon: Users, group: "INTELLIGENCE" },

  // 6. Trend Intelligence
  { href: "/trends", label: "Trend Intelligence", shortLabel: "Trends", icon: TrendingUp, group: "INTELLIGENCE" },

  // 7. Network Analysis
  { href: "/network", label: "Network Analysis", shortLabel: "Network", icon: Network, group: "INTELLIGENCE" },

  // 8. Timeline Explorer
  { href: "/timeline", label: "Timeline Explorer", shortLabel: "Timeline", icon: Clock3, group: "TIMELINE" },

  // 9. Event Intelligence
  { href: "/event-intelligence", label: "Event Intelligence", shortLabel: "Event Intel", icon: Zap, badge: "UNIFIED", group: "TIMELINE" },

  // 10. Investigations
  { href: "/investigations", label: "Investigations", shortLabel: "Cases", icon: FolderLock, badge: "NEW", group: "CASES" },

  // 11. AI Analyst
  { href: "/ai-analyst", label: "AI Analyst", icon: Bot, badge: "AI", group: "AI" },

  // 12. Alert Centre
  { href: "/alerts", label: "Alert Centre", shortLabel: "Alerts", icon: BellRing, badge: "3", group: "CASES" },

  // 13. Intelligence Reports
  { href: "/reports", label: "Intelligence Reports", shortLabel: "Reports", icon: FileBarChart, group: "OPERATIONS" },

  // 14. Data Sources
  { href: "/datasources", label: "Data Sources", icon: Database, group: "SYSTEM" },

  // 15. System Health
  { href: "/health", label: "System Health", shortLabel: "Health", icon: Activity, group: "SYSTEM" },

  // 16. Settings
  { href: "/settings", label: "Settings", icon: Settings, group: "SYSTEM" },
];

export default function TopNavigation({
  userName,
  onOpenCommandPalette,
  onOpenEventIntel,
}: {
  userName: string;
  onOpenCommandPalette: () => void;
  onOpenEventIntel: () => void;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  const triggerDemo = async () => {
    try {
      setDemoRunning(true);
      setDemoMessage("Injecting Incident Anomaly...");
      await api.startDemo();

      setTimeout(async () => {
        setDemoMessage("Amplifying Cross-Platform Spread...");
        await api.stepDemoEvent();

        setTimeout(() => {
          setDemoMessage("Synthesizing Intelligence...");
          setDemoRunning(false);
          setDemoMessage(null);
          onOpenEventIntel();
        }, 1100);
      }, 900);
    } catch (e) {
      console.error(e);
      setDemoRunning(false);
      setDemoMessage(null);
    }
  };

  const groups: Array<{ name: string; items: NavModule[] }> = [
    { name: "MONITORING", items: NAV_MODULES.filter((m) => m.group === "MONITORING" || m.group === "PLATFORMS") },
    { name: "INTELLIGENCE", items: NAV_MODULES.filter((m) => m.group === "INTELLIGENCE") },
    { name: "TIMELINE & EVENTS", items: NAV_MODULES.filter((m) => m.group === "TIMELINE") },
    { name: "CASES & ALERTS", items: NAV_MODULES.filter((m) => m.group === "CASES") },
    { name: "AI & OPS", items: NAV_MODULES.filter((m) => m.group === "AI" || m.group === "OPERATIONS") },
    { name: "SYSTEM", items: NAV_MODULES.filter((m) => m.group === "SYSTEM") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 select-none shadow-sm">
      {/* =========================================================================
          LEVEL 1 — MAIN HEADER
          ========================================================================= */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-slate-100">
        {/* LEFT: Compact SOCIOINTELL Brand & Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/dashboard" className="hover:opacity-95 transition-opacity">
            <BrandLogo size="md" />
          </Link>
        </div>

        {/* RIGHT: Actions, Live Ingestion, Search, Demo, Analyst */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Simulation Demo Trigger */}
          <button
            onClick={triggerDemo}
            disabled={demoRunning}
            className="hidden sm:inline-flex btn bg-gradient-to-r from-[#0062FF] to-[#8B5CF6] text-white text-xs py-1.5 px-3 font-bold items-center gap-1.5 shadow-sm hover:opacity-95"
            title="Trigger Incident Simulation"
          >
            {demoRunning ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-[11px] font-mono">{demoMessage || "Simulating..."}</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span className="text-[11px] font-mono tracking-wide">SIMULATE EVENT</span>
              </>
            )}
          </button>

          {/* Event Intelligence Modal Shortcut */}
          <button
            onClick={onOpenEventIntel}
            title="Inspect Unified Event Intelligence"
            className="hidden sm:flex p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[#0062FF] hover:bg-slate-100 hover:border-[#0062FF]/50 transition-all"
          >
            <Zap className="w-4 h-4" />
          </button>

          {/* ● LIVE Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] sm:text-[11px] text-emerald-700 font-mono font-bold tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIVE MONITORING</span>
          </div>

          {/* Global Search Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0062FF]/50 text-xs text-slate-600 hover:text-slate-900 transition-all group shadow-sm"
            title="Global Search Console (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#0062FF]" />
            <span className="hidden md:inline text-[11px] font-medium font-mono">Search</span>
            <kbd className="hidden md:inline text-[9px] px-1.5 py-0.5 bg-white rounded-md border border-slate-200 text-slate-500 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Analyst Profile Pill */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0062FF] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 leading-tight">{userName}</span>
              <span className="text-[9px] font-mono text-[#0062FF] font-semibold">NTRO ANALYST</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEVEL 2 — HORIZONTAL TOP NAVIGATION (DESKTOP)
          ========================================================================= */}
      <nav
        aria-label="Intelligence Modules"
        className="hidden xl:flex items-center px-4 sm:px-6 overflow-x-auto scrollbar-none bg-slate-50/60 border-t border-slate-100"
      >
        <div className="flex items-center min-w-max gap-1 py-1.5">
          {groups.map((group, gIdx) => (
            <div key={group.name} className="flex items-center gap-1">
              {group.items.map((mod) => {
                const isActive =
                  pathname === mod.href ||
                  (mod.href !== "/dashboard" && pathname?.startsWith(mod.href));
                const Icon = mod.icon;

                return (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    title={mod.label}
                    className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap group focus:outline-none focus:ring-1 focus:ring-[#0062FF]/50 ${
                      isActive
                        ? "text-white font-bold bg-gradient-to-r from-[#0062FF] to-[#8B5CF6] shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-slate-500 group-hover:text-[#0062FF]"
                      }`}
                    />

                    <span className="tracking-tight">{mod.shortLabel || mod.label}</span>

                    {mod.badge && (
                      <span
                        className={`text-[8px] font-mono px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          mod.badge === "LIVE"
                            ? "bg-rose-500 text-white animate-pulse"
                            : isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-50 text-[#0062FF] border border-blue-200"
                        }`}
                      >
                        {mod.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {gIdx < groups.length - 1 && (
                <div className="h-4 w-[1px] bg-slate-200 mx-1 shrink-0" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* =========================================================================
          MOBILE / TABLET NAVIGATION DRAWER
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-14 z-50 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-80 max-w-[85vw] h-full bg-white border-r border-slate-200 p-4 overflow-y-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                16 Intelligence Modules
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {groups.map((grp) => (
                <div key={grp.name} className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider px-2">
                    {grp.name}
                  </div>
                  {grp.items.map((m) => {
                    const isActive = pathname === m.href || (m.href !== "/dashboard" && pathname?.startsWith(m.href));
                    const Icon = m.icon;
                    return (
                      <Link
                        key={m.href}
                        href={m.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-[#0062FF] to-[#8B5CF6] text-white font-bold shadow-sm"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#0062FF]"}`} />
                          <span>{m.label}</span>
                        </div>
                        {m.badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold uppercase ${
                              isActive ? "bg-white/20 text-white" : "bg-blue-50 text-[#0062FF] border border-blue-200"
                            }`}
                          >
                            {m.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
