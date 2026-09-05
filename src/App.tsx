import React, { useState, useEffect } from 'react';
import {
  Zap,
  Share2,
  Users,
  Shield,
  Radio,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero3D } from './components/Hero3D';
import { KPICard } from './components/KPICard';
import { DataSources } from './components/DataSources';
import { SentimentChart } from './components/SentimentChart';
import { EmotionDonut } from './components/EmotionDonut';
import { AudienceDNA } from './components/AudienceDNA';
import { TrendRadar } from './components/TrendRadar';
import { NetworkGraph } from './components/NetworkGraph';
import { NarrativeFlow } from './components/NarrativeFlow';
import { AIInsights } from './components/AIInsights';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { LogoutPage } from './components/LogoutPage';
import { PlatformPage } from './components/PlatformPage';
import { EmotionPage } from './components/EmotionPage';
import { CyberStarfield3D } from './components/CyberStarfield3D';
import { useLiveData } from './hooks/useLiveData';
import { AuthUser, Platform } from './types';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'login' | 'logout' | 'platform' | 'emotion'>('login');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('X');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [lastUser, setLastUser] = useState<AuthUser | null>(null);

  // Sync with URL hash or default to login
  useEffect(() => {
    const parseHash = () => {
      const raw = window.location.hash.toLowerCase().replace('#', '');
      if (raw.startsWith('platform/')) {
        const platName = raw.split('/')[1];
        const validPlatforms: Record<string, Platform> = {
          x: 'X',
          telegram: 'Telegram',
          instagram: 'Instagram',
          facebook: 'Facebook',
          reddit: 'Reddit',
          youtube: 'YouTube',
        };
        if (validPlatforms[platName]) {
          setSelectedPlatform(validPlatforms[platName]);
          setViewMode('platform');
          return;
        }
      }

      if (raw === 'emotion' || raw === 'emotions') {
        setViewMode('emotion');
      } else if (raw === 'dashboard') {
        setViewMode('dashboard');
      } else if (raw === 'logout') {
        setViewMode('logout');
      } else {
        setViewMode('login');
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Update URL hash when state changes
  useEffect(() => {
    let targetHash: string = viewMode;
    if (viewMode === 'platform') {
      targetHash = `platform/${selectedPlatform.toLowerCase()}`;
    } else if (viewMode === 'emotion') {
      targetHash = 'emotion';
    }
    if (window.location.hash.replace('#', '') !== targetHash) {
      window.location.hash = targetHash;
    }
  }, [viewMode, selectedPlatform]);

  // Load persistent session if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sociointell_session');
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        setCurrentUser(parsed);
      }
    } catch (e) {
      console.error('Session load error:', e);
    }
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sociointell_session', JSON.stringify(user));
    } catch (e) {
      console.error('Session save error:', e);
    }
    setViewMode('dashboard');
  };

  const handleLogout = () => {
    if (currentUser) {
      setLastUser(currentUser);
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('sociointell_session');
    } catch (e) {
      console.error('Session removal error:', e);
    }
    setViewMode('logout');
  };

  const handleSelectPlatform = (p: Platform) => {
    setSelectedPlatform(p);
    setViewMode('platform');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time live data simulation hook
  const {
    metrics,
    sources,
    events,
    trends,
    lastUpdated,
    pulseCount,
    isBursting,
    triggerDataBurst,
    refreshAnalytics,
  } = useLiveData(true);

  // Initial futuristic loading screen simulation (1.2s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    const el = document.getElementById('narrative');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] text-cyan-400 font-mono">
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-3 rounded-full border-2 border-violet-500/20 border-b-violet-400 animate-spin-slow" />
          <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-widest text-white mb-2">
          SOCIO<span className="text-cyan-400">INTELL</span>
        </h1>
        <p className="text-xs tracking-widest text-slate-400 uppercase animate-pulse">
          INITIALIZING CYBER INTELLIGENCE COMMAND...
        </p>
        <div className="mt-4 text-[10px] text-cyan-500/60 font-semibold">
          SIH 2026 • NTRO PROBLEM 26152
        </div>
      </div>
    );
  }

  // 1. Dedicated Login Page View
  if (viewMode === 'login') {
    return (
      <div className="relative min-h-screen bg-[#030712] overflow-x-hidden">
        <CyberStarfield3D activePlatform={null} />
        <div className="relative z-10">
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBackToDashboard={() => setViewMode('dashboard')}
          />
        </div>
      </div>
    );
  }

  // 2. Dedicated Logout Page View
  if (viewMode === 'logout') {
    return (
      <div className="relative min-h-screen bg-[#030712] overflow-x-hidden">
        <CyberStarfield3D activePlatform={null} />
        <div className="relative z-10">
          <LogoutPage
            lastUser={lastUser}
            onNavigateLogin={() => setViewMode('login')}
            onNavigateDashboard={() => setViewMode('dashboard')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Interactive Cyber Starfield Background */}
      <CyberStarfield3D activePlatform={viewMode === 'emotion' ? 'emotion' : viewMode === 'platform' ? selectedPlatform : null} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Classified Officer Session Header if Logged In */}
        {currentUser && (
          <div className="w-full py-1.5 px-4 sm:px-8 bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 font-mono text-[10px] tracking-widest flex flex-wrap items-center justify-between uppercase">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold">SECURE NTRO SESSION ACTIVE • {currentUser.role}</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-300">
              <span>OFFICER: <strong className="text-white">{currentUser.name}</strong></span>
              <span>ID: <strong className="text-cyan-300">{currentUser.badgeId}</strong></span>
              <span className="text-emerald-400 font-bold">{currentUser.clearance}</span>
            </div>
          </div>
        )}

      {/* Sticky High-Tech Navigation Bar HUD */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (viewMode !== 'dashboard') {
            setViewMode('dashboard');
          }
        }}
        onRefresh={refreshAnalytics}
        onTriggerBurst={triggerDataBurst}
        onOpenReport={() => setIsReportOpen(true)}
        isBursting={isBursting}
        pulseCount={pulseCount}
        user={currentUser}
        onOpenLogin={() => setViewMode('login')}
        onLogout={handleLogout}
        onSelectPlatform={handleSelectPlatform}
        activePlatform={viewMode === 'platform' ? selectedPlatform : null}
        onOpenEmotion={() => setViewMode('emotion')}
        isEmotionActive={viewMode === 'emotion'}
      />

      {/* View Switcher: Emotion Hub vs Platform Page vs Main Global Command Center */}
      {viewMode === 'emotion' ? (
        <main className="flex-1 w-full">
          <EmotionPage
            onBackToDashboard={() => setViewMode('dashboard')}
            onSelectPlatform={handleSelectPlatform}
          />
        </main>
      ) : viewMode === 'platform' ? (
        <main className="flex-1 w-full">
          <PlatformPage
            platform={selectedPlatform}
            onSelectPlatform={handleSelectPlatform}
            onBackToDashboard={() => setViewMode('dashboard')}
          />
        </main>
      ) : (
        <main className="flex-1 w-full">
          {/* 1. 3D Hero Section */}
          <Hero3D
            onExplore={handleExplore}
            onRefresh={refreshAnalytics}
            activeUsersCount={metrics.activeUsers}
            totalPostsCount={metrics.totalPosts}
          />

          {/* 2. Overview KPI Metrics Dashboard */}
          <section id="overview" className="w-full py-12 border-b border-cyan-500/10 scroll-mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                    Global Telemetry & Real-Time Pulse
                  </h2>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mt-2 sm:mt-0">
                  <span>Last Ingestion Sync:</span>
                  <span className="text-emerald-400 font-bold">{lastUpdated}</span>
                </div>
              </div>

              {/* 4 Core KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <KPICard
                  title="Sentiment Index"
                  value={metrics.sentimentIndex}
                  unit="/ 100"
                  change={metrics.sentimentChange}
                  changePeriod="vs last 24h"
                  icon={Radio}
                  sparklineData={[68, 69, 71, 70, 74, 72, 73]}
                  color="cyan"
                  badge="Net Positive"
                />
                <KPICard
                  title="Trend Velocity"
                  value={`+${metrics.trendVelocity}%`}
                  change={metrics.velocityChange}
                  changePeriod="surge momentum"
                  icon={Zap}
                  sparklineData={[12, 18, 22, 28, 31, 33, 35]}
                  color="blue"
                  badge="Accelerating"
                />
                <KPICard
                  title="Influence Score"
                  value={metrics.influenceScore}
                  unit="/ 100"
                  change={metrics.influenceChange}
                  changePeriod="network centrality"
                  icon={Share2}
                  sparklineData={[82, 84, 85, 87, 86, 88, 89]}
                  color="violet"
                  badge="KOL Density"
                />
                <KPICard
                  title="Audience Reach"
                  value={metrics.audienceReach}
                  change={metrics.reachChange}
                  changePeriod="estimated imprint"
                  icon={Users}
                  sparklineData={[1.8, 2.1, 2.3, 2.5, 2.7, 2.8, 2.84]}
                  color="emerald"
                  badge="Tier-1/2 Cities"
                />
              </div>
            </div>
          </section>

          {/* 3. Central Differentiator: Cross-Analysis ("How a narrative spreads") */}
          <NarrativeFlow />

          {/* 4. Module B: Multi-Dimensional Sentiment Analysis */}
          <section id="sentiment" className="w-full py-16 scroll-mt-16 border-t border-cyan-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SentimentChart />
              <EmotionDonut />
            </div>
          </section>

          {/* 5. Module D: Real-Time Trend Detection ("Rising Narratives") */}
          <TrendRadar trends={trends} />

          {/* 6. Module E: Link Analysis & Network Topology ("Follow the influence") */}
          <NetworkGraph />

          {/* 7. Module C: Automated Demographic Profiling ("Audience DNA") */}
          <AudienceDNA />

          {/* 8. Module A: Continuous Data Collection & Timeline */}
          <DataSources
            sources={sources}
            events={events}
            totalPosts={metrics.totalPosts}
            activeUsers={metrics.activeUsers}
            totalInteractions={metrics.totalInteractions}
            onSelectPlatform={handleSelectPlatform}
          />

          {/* 9. AI Insights Engine */}
          <AIInsights onOpenReport={() => setIsReportOpen(true)} />
        </main>
      )}

      {/* NTRO Executive Intelligence Report Modal */}
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />

      {/* Footer */}
      <Footer
        onOpenLogin={() => setViewMode('login')}
        onOpenLogout={() => setViewMode('logout')}
      />
      </div>
    </div>
  );
};
