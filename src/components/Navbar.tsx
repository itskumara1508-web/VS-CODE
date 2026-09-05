import React, { useState } from 'react';
import {
  Activity,
  Zap,
  RotateCw,
  FileText,
  Menu,
  X,
  Radio,
  Share2,
  TrendingUp,
  Users,
  Database,
  Layers,
  Sparkles,
  Lock,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { AuthUser, Platform } from '../types';
import { SocioIntellLogo } from './SocioIntellLogo';
import {
  XLogo,
  TelegramLogo,
  InstagramLogo,
  FacebookLogo,
  RedditLogo,
  YoutubeLogo,
} from './PlatformLogos';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onRefresh: () => void;
  onTriggerBurst: () => void;
  onOpenReport: () => void;
  isBursting: boolean;
  pulseCount: number;
  user: AuthUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onSelectPlatform?: (platform: Platform) => void;
  activePlatform?: Platform | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onRefresh,
  onTriggerBurst,
  onOpenReport,
  isBursting,
  user,
  onOpenLogin,
  onLogout,
  onSelectPlatform,
  activePlatform,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'narrative', label: 'Narrative Spread', icon: Sparkles, badge: 'KEY' },
    { id: 'sentiment', label: 'Sentiment', icon: Radio },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'network', label: 'Network Graph', icon: Share2 },
    { id: 'audience', label: 'Audience DNA', icon: Users },
    { id: 'sources', label: 'Data Ingestion', icon: Database },
    { id: 'insights', label: 'AI Insights', icon: Layers },
  ];

  const platforms: { name: Platform; label: string; icon: React.ReactNode; color: string; border: string }[] = [
    { name: 'X', label: 'X (Twitter)', icon: <XLogo className="w-3.5 h-3.5" />, color: 'text-sky-400', border: 'border-sky-500/40' },
    { name: 'Telegram', label: 'Telegram', icon: <TelegramLogo className="w-3.5 h-3.5" />, color: 'text-cyan-400', border: 'border-cyan-500/40' },
    { name: 'Instagram', label: 'Instagram', icon: <InstagramLogo className="w-3.5 h-3.5" />, color: 'text-pink-400', border: 'border-pink-500/40' },
    { name: 'Facebook', label: 'Facebook', icon: <FacebookLogo className="w-3.5 h-3.5" />, color: 'text-blue-400', border: 'border-blue-500/40' },
    { name: 'Reddit', label: 'Reddit', icon: <RedditLogo className="w-3.5 h-3.5" />, color: 'text-orange-400', border: 'border-orange-500/40' },
    { name: 'YouTube', label: 'YouTube', icon: <YoutubeLogo className="w-3.5 h-3.5" />, color: 'text-red-400', border: 'border-red-500/40' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlatformClick = (p: Platform) => {
    setMobileMenuOpen(false);
    setPlatformMenuOpen(false);
    if (onSelectPlatform) {
      onSelectPlatform(p);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyan-500/30 backdrop-blur-xl shadow-2xl">
      {/* Top Cyber Telemetry Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced SocioIntell Tactical Logo */}
          <SocioIntellLogo
            size="md"
            onClick={() => handleNavClick('overview')}
            className="hover:opacity-90 transition-opacity"
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !activePlatform;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/40 shadow-glow-cyan'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1 py-0.2 text-[8px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-400/30 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Dedicated Platforms Dropdown/Switcher in HUD */}
            <div className="relative pl-1">
              <button
                onClick={() => setPlatformMenuOpen(!platformMenuOpen)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  activePlatform
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/50 shadow-glow-cyan font-bold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activePlatform ? `Platform: ${activePlatform}` : 'Platform Pages'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {platformMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 p-2 rounded-xl bg-[#071328]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider px-2 py-1 border-b border-slate-800">
                    Dedicated Intelligence Pages
                  </div>
                  {platforms.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => handlePlatformClick(p.name)}
                      className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
                        activePlatform === p.name
                          ? 'bg-cyan-500/20 text-white font-bold border border-cyan-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span className={p.color}>{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Platform Icons Bar (Desktop Extra) */}
            <div className="hidden xl:flex items-center space-x-1 pl-2 border-l border-slate-800">
              {platforms.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handlePlatformClick(p.name)}
                  title={`Open ${p.label} dedicated page`}
                  className={`p-1.5 rounded-md transition-all ${
                    activePlatform === p.name
                      ? `bg-slate-800 border ${p.border} ${p.color} ring-1 ring-cyan-400`
                      : `hover:bg-slate-800/80 ${p.color} opacity-70 hover:opacity-100`
                  }`}
                >
                  {p.icon}
                </button>
              ))}
            </div>
          </nav>

          {/* Actions & Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Live Indicator */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400">
                6 FEEDS LIVE
              </span>
            </div>

            {/* Ingestion Burst Trigger */}
            <button
              onClick={onTriggerBurst}
              disabled={isBursting}
              title="Simulate coordinated viral burst across platforms"
              className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/30 text-cyan-300 transition-all ${
                isBursting ? 'opacity-60 ring-2 ring-cyan-400' : ''
              }`}
            >
              <Zap className={`w-3 h-3 text-amber-400 ${isBursting ? 'animate-bounce' : ''}`} />
              <span className="hidden md:inline">Burst</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              title="Poll latest social feeds"
              className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Report Generator Modal Trigger */}
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-glow-cyan transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>

            {/* Officer Login / Profile Badge */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-mono font-bold text-cyan-300">{user.name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-semibold">{user.clearance}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out of NTRO Session"
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 hover:border-rose-400/60 transition-all text-xs font-mono font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase rounded bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-400/50 text-cyan-300 shadow-glow-cyan transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Officer Login</span>
                <span className="xl:hidden">Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {user ? (
              <button
                onClick={onLogout}
                className="px-2 py-1 text-xs font-mono rounded bg-rose-950/80 border border-rose-500/40 text-rose-300"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300"
              >
                <Lock className="w-3 h-3" />
                <span>Login</span>
              </button>
            )}
            <button
              onClick={onOpenReport}
              className="px-2 py-1 text-xs rounded bg-cyan-600/80 text-white"
            >
              Report
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-slate-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-1 bg-cyber-dark/95 border-b border-cyan-500/20 backdrop-blur-2xl">
          <div className="flex items-center justify-between py-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span>SIH 2026 • NTRO PS-26152</span>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE ANALYTICS</span>
            </div>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono bg-violet-500/20 text-violet-300 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Mobile Platform Pages Section */}
          <div className="pt-3 border-t border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider px-3">
              Dedicated Platform Hubs
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-2">
              {platforms.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handlePlatformClick(p.name)}
                  className={`flex items-center space-x-2 px-2.5 py-2 rounded-lg text-xs font-mono border ${
                    activePlatform === p.name
                      ? `bg-slate-800 text-white font-bold ${p.border}`
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span className={p.color}>{p.icon}</span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

