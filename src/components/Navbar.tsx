import React, { useState } from 'react';
import {
  Activity,
  Shield,
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
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onRefresh: () => void;
  onTriggerBurst: () => void;
  onOpenReport: () => void;
  isBursting: boolean;
  pulseCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onRefresh,
  onTriggerBurst,
  onOpenReport,
  isBursting,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyan-500/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & NTRO Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('overview')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-400/40 shadow-glow-cyan">
              <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-wider text-white">
                  Pulse<span className="text-cyan-400">X</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded">
                  NTRO • SIH 26152
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                SOCIAL INTELLIGENCE
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/40 shadow-glow-cyan'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-400/30 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions & Status Indicator */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Live Indicator */}
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-emerald-400">
                LIVE
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
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
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
        </div>
      )}
    </header>
  );
};

