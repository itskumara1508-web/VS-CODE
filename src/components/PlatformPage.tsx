import React, { useState, useMemo } from 'react';
import {
  Shield,
  ArrowLeft,
  Zap,
  Download,
  Filter,
  TrendingUp,
  Share2,
  Users,
  Activity,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Platform, IngestionEvent, PlatformSource } from '../types';
import {
  XLogo,
  TelegramLogo,
  InstagramLogo,
  FacebookLogo,
  RedditLogo,
  YoutubeLogo,
} from './PlatformLogos';
import { PlatformGraphs } from './PlatformGraphs';
import { Platform3DHologram } from './Platform3DHologram';
import { platformSources, initialIngestionEvents, risingNarratives } from '../data/mockData';

interface PlatformPageProps {
  platform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  onBackToDashboard: () => void;
}

interface PlatformTheme {
  name: string;
  officialTitle: string;
  tagline: string;
  brandColor: string;
  accentText: string;
  badgeBg: string;
  badgeBorder: string;
  borderClass: string;
  glowClass: string;
  gradientBg: string;
  logo: React.ReactNode;
  kpis: {
    title: string;
    value: string;
    change: string;
    subtext: string;
    icon: any;
  }[];
  trendingTags: string[];
}

export const PlatformPage: React.FC<PlatformPageProps> = ({
  platform,
  onSelectPlatform,
  onBackToDashboard,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [isBursting, setIsBursting] = useState(false);
  const [localEvents, setLocalEvents] = useState<IngestionEvent[]>(() =>
    initialIngestionEvents.filter((e) => e.platform === platform)
  );

  const platformList: Platform[] = ['X', 'Telegram', 'Instagram', 'Facebook', 'Reddit', 'YouTube'];

  // Current platform metadata from mock sources
  const currentSource: PlatformSource = useMemo(() => {
    return (
      platformSources.find((s) => s.name.toLowerCase() === platform.toLowerCase()) ||
      platformSources[0]
    );
  }, [platform]);

  // Theme configurations for each platform
  const themes: Record<Platform, PlatformTheme> = {
    X: {
      name: 'X',
      officialTitle: 'X (Formerly Twitter) Firehose',
      tagline: 'Real-time microblogging stream, KOL influence chains, and viral velocity telemetry',
      brandColor: '#1DA1F2',
      accentText: 'text-sky-400',
      badgeBg: 'bg-sky-500/10',
      badgeBorder: 'border-sky-500/40 text-sky-300',
      borderClass: 'border-sky-500/40',
      glowClass: 'shadow-[0_0_35px_rgba(29,161,242,0.25)]',
      gradientBg: 'from-sky-950/40 via-[#030712] to-[#030712]',
      logo: <XLogo className="w-8 h-8 text-sky-400" />,
      kpis: [
        { title: 'Retweet Cascade Multiplier', value: '4.8x avg', change: '+14.2%', subtext: 'Dissemination velocity', icon: Share2 },
        { title: 'Monitored KOL Accounts', value: '1,420', change: '+8.4%', subtext: 'Verified defense & media', icon: Users },
        { title: 'Sybil & Bot Ratio', value: '4.2%', change: '-1.8%', subtext: 'Bot infiltration risk', icon: Shield },
        { title: 'Firehose Throughput', value: '42.8/s', change: '+22.5%', subtext: 'Real-time post intake', icon: Zap },
      ],
      trendingTags: ['#CyberDefenseBharat', '#DigitalSovereignty', '#NTROHackathon2026', '#AIIntelligence'],
    },
    Telegram: {
      name: 'Telegram',
      officialTitle: 'Telegram Open Channels Stream',
      tagline: 'Broadcast channel ingestion, forward cascade tracking, and network message propagation',
      brandColor: '#229ED9',
      accentText: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10',
      badgeBorder: 'border-cyan-500/40 text-cyan-300',
      borderClass: 'border-cyan-500/40',
      glowClass: 'shadow-[0_0_35px_rgba(34,158,217,0.25)]',
      gradientBg: 'from-cyan-950/40 via-[#030712] to-[#030712]',
      logo: <TelegramLogo className="w-8 h-8 text-cyan-400" />,
      kpis: [
        { title: 'Forward Chain Multiplier', value: '18.6x', change: '+28.4%', subtext: 'Channel-to-channel jump', icon: Share2 },
        { title: 'Public Groups Monitored', value: '840', change: '+12.0%', subtext: 'Cross-regional hubs', icon: Users },
        { title: 'External Leak Frequency', value: '34.2%', change: '+5.1%', subtext: 'Cross-bridged to X/Web', icon: Radio },
        { title: 'PII Scrubbing Integrity', value: '100%', change: 'Zero Log', subtext: 'Strict compliance check', icon: Shield },
      ],
      trendingTags: ['#RegionalBriefings', '#BroadcastAlerts', '#TechDiscourse', '#CommunityUpdates'],
    },
    Instagram: {
      name: 'Instagram',
      officialTitle: 'Instagram Visual Discourse Radar',
      tagline: 'Reel engagement analytics, OCR meme parsing, and influencer multimedia trends',
      brandColor: '#E1306C',
      accentText: 'text-pink-400',
      badgeBg: 'bg-pink-500/10',
      badgeBorder: 'border-pink-500/40 text-pink-300',
      borderClass: 'border-pink-500/40',
      glowClass: 'shadow-[0_0_35px_rgba(225,48,108,0.25)]',
      gradientBg: 'from-pink-950/30 via-[#030712] to-[#030712]',
      logo: <InstagramLogo className="w-8 h-8" />,
      kpis: [
        { title: 'Meme OCR Detections', value: '2,840', change: '+19.6%', subtext: 'Visual text extraction', icon: Activity },
        { title: 'Reel Comment Surge', value: '+58.4%', change: '+34.0%', subtext: 'Gen-Z & youth cohort', icon: TrendingUp },
        { title: 'Influencer Reach', value: '1.92M', change: '+16.5%', subtext: 'Tier-1 visual imprint', icon: Users },
        { title: 'Audio Trend Resonance', value: '89.2%', change: '+7.8%', subtext: 'Algorithmic sound match', icon: Sparkles },
      ],
      trendingTags: ['#VisualPulse', '#YouthDiscourse', '#CreativeIndia', '#TrendingNarratives'],
    },
    Facebook: {
      name: 'Facebook',
      officialTitle: 'Facebook Community Intelligence',
      tagline: 'Public regional groups, news publisher discourse, and civic sentiment distribution',
      brandColor: '#1877F2',
      accentText: 'text-blue-400',
      badgeBg: 'bg-blue-500/10',
      badgeBorder: 'border-blue-500/40 text-blue-300',
      borderClass: 'border-blue-500/40',
      glowClass: 'shadow-[0_0_35px_rgba(24,119,242,0.25)]',
      gradientBg: 'from-blue-950/40 via-[#030712] to-[#030712]',
      logo: <FacebookLogo className="w-8 h-8 text-blue-400" />,
      kpis: [
        { title: 'Community Group Reshares', value: '14.2K', change: '+9.3%', subtext: 'Public page syndication', icon: Share2 },
        { title: 'Demographic Reach (35+)', value: '62.4%', change: '+4.2%', subtext: 'Senior citizen & family', icon: Users },
        { title: 'Publisher Commentary', value: '8.4K/hr', change: '+11.8%', subtext: 'Editorial discussions', icon: Radio },
        { title: 'Propagation Half-Life', value: '4.1 hrs', change: '-35 min', subtext: 'Longevity in feed', icon: Clock },
      ],
      trendingTags: ['#NationalPolicy', '#CivicDiscourse', '#PublicWelfare', '#IndiaNewsRadar'],
    },
    Reddit: {
      name: 'Reddit',
      officialTitle: 'Reddit Community Forensics',
      tagline: 'Subreddit crawlers, deep nested debate trees, and dialectical sarcasm decoding',
      brandColor: '#FF4500',
      accentText: 'text-orange-400',
      badgeBg: 'bg-orange-500/10',
      badgeBorder: 'border-orange-500/40 text-orange-300',
      borderClass: 'border-orange-500/40',
      glowClass: 'shadow-[0_0_35px_rgba(255,69,0,0.25)]',
      gradientBg: 'from-orange-950/40 via-[#030712] to-[#030712]',
      logo: <RedditLogo className="w-8 h-8 text-orange-400" />,
      kpis: [
        { title: 'Upvote Polarity Ratio', value: '88.4%', change: '+6.2%', subtext: 'Net constructive votes', icon: TrendingUp },
        { title: 'Thread Comment Depth', value: '14 Levels', change: '+2.4 avg', subtext: 'Substantive discourse', icon: Activity },
        { title: 'Cynicism & Sarcasm Index', value: '41.8%', change: '+12.5%', subtext: 'Inverted lexical markers', icon: Sparkles },
        { title: 'Subreddits Monitored', value: '64 Subs', change: 'Continuous', subtext: 'r/india, r/tech, r/policy', icon: Users },
      ],
      trendingTags: ['#r_india_threads', '#TechPolicyDebate', '#OpenSourceCyber', '#InDepthAnalysis'],
    },
    YouTube: {
      name: 'YouTube',
      officialTitle: 'YouTube Media Intelligence',
      tagline: 'Video transcript NLP analysis, live chat stream telemetry, and audiovisual virality',
      brandColor: '#FF0000',
      accentText: 'text-red-400',
      badgeBg: 'bg-red-500/10',
      badgeBorder: 'border-red-500/40 text-red-300',
      borderClass: 'border-red-500/40',
      glowClass: 'shadow-[0_0_35px_rgba(255,0,0,0.25)]',
      gradientBg: 'from-red-950/40 via-[#030712] to-[#030712]',
      logo: <YoutubeLogo className="w-8 h-8 text-red-400" />,
      kpis: [
        { title: 'View-to-Comment Velocity', value: '1 : 124', change: '+18.2%', subtext: 'High engagement ratio', icon: TrendingUp },
        { title: 'Transcript Keyword Spikes', value: '18 Spikes', change: '+5 flagged', subtext: 'Semantic anomalies', icon: Activity },
        { title: 'Live Chat Sentiment', value: '74.2%', change: '+8.1%', subtext: 'Stream net favorability', icon: Radio },
        { title: 'Global Dissemination Rank', value: '#2 Global', change: 'Top Tier', subtext: 'Multilingual video reach', icon: Users },
      ],
      trendingTags: ['#VideoBriefings', '#LiveAnalysis', '#DocumentaryInsights', '#CyberAwareness'],
    },
  };

  const currentTheme = themes[platform] || themes.X;

  // Filter events by language if selected
  const filteredEvents = useMemo(() => {
    if (selectedLanguage === 'All') return localEvents;
    return localEvents.filter((e) => e.language === selectedLanguage);
  }, [localEvents, selectedLanguage]);

  // Simulate instant data burst for this platform
  const handleTriggerBurst = () => {
    setIsBursting(true);
    const newEvent: IngestionEvent = {
      id: `burst-${Date.now()}`,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      platform: platform,
      count: Math.floor(Math.random() * 80) + 40,
      type: platform === 'YouTube' ? 'videos' : platform === 'Instagram' ? 'comments' : 'posts',
      sampleText: `[HIGH MOMENTUM ALERT] Coordinated discussions surging across ${platform} network nodes. Sentiment telemetry updated in real time.`,
      sentiment: Math.random() > 0.4 ? 'supportive' : 'excitement',
      language: Math.random() > 0.5 ? 'English' : 'Hinglish',
    };

    setTimeout(() => {
      setLocalEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      setIsBursting(false);
    }, 600);
  };

  // Export JSON dossier for this specific platform
  const handleExportDossier = () => {
    const payload = {
      platform: platform,
      agency: 'National Technical Research Organisation (NTRO)',
      event: 'Smart India Hackathon 2026 • Problem 26152',
      telemetrySource: currentSource,
      kpis: currentTheme.kpis,
      trendingNarratives: risingNarratives.slice(0, 3),
      recentEvents: localEvents,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SocioIntell_${platform}_Intelligence_Dossier_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${currentTheme.gradientBg} text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navigation & Return Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Return to Global Command Center</span>
          </button>

          {/* Quick Platform Switcher Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase px-2 hidden md:inline">
              Platforms:
            </span>
            {platformList.map((p) => {
              const isActive = p === platform;
              const pTheme = themes[p];
              return (
                <button
                  key={p}
                  onClick={() => onSelectPlatform(p)}
                  className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                    isActive
                      ? `${pTheme.badgeBg} ${pTheme.accentText} border ${pTheme.borderClass} font-bold shadow-glow-cyan`
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="scale-75">{pTheme.logo}</span>
                  <span>{p}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. Main Platform Hero Banner */}
        {/* 1. Main Platform Hero Banner */}
        <div className={`relative rounded-2xl glass-panel-glow p-6 sm:p-8 border ${currentTheme.borderClass} ${currentTheme.glowClass} overflow-hidden laser-sweep`}>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 bg-gradient-to-bl from-cyan-400 to-transparent" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start space-x-4 max-w-2xl">
              {/* Platform Emblem Card with 3D Float */}
              <div className={`relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/90 border-2 ${currentTheme.borderClass} p-3 shrink-0 shadow-lg animate-float-slow`}>
                {currentTheme.logo}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#030712] animate-ping" />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#030712]" />
              </div>

              {/* Title and Descriptions */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded ${currentTheme.badgeBg} border ${currentTheme.badgeBorder}`}>
                    NTRO STREAM NODE • {platform.toUpperCase()}
                  </span>
                  <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>FEED STATUS: {currentSource.status.toUpperCase()}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {currentTheme.officialTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {currentTheme.tagline}
                </p>
              </div>
            </div>

            {/* Right: Interactive 3D Platform Hologram & Action Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Platform3DHologram
                brandColor={currentTheme.brandColor}
                platformName={platform}
                size={140}
              />

              <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleTriggerBurst}
                  disabled={isBursting}
                  className={`flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs font-mono font-bold uppercase rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-glow-cyan transition-all ${
                    isBursting ? 'opacity-50' : ''
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 text-amber-300 ${isBursting ? 'animate-spin' : ''}`} />
                  <span>Simulate Ingestion Burst</span>
                </button>

                <button
                  onClick={handleExportDossier}
                  className="flex items-center justify-center space-x-1.5 px-4 py-2.5 text-xs font-mono rounded-lg glass-panel hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export Platform Dossier</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Telemetry Strip */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Total Ingested:</span>
              <strong className="text-white text-sm">{currentSource.postsCollected.toLocaleString()} posts</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Stream Latency:</span>
              <strong className="text-emerald-400 text-sm">{currentSource.apiLatencyMs} ms</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Pipeline Health:</span>
              <strong className="text-cyan-300 text-sm">{currentSource.healthScore}% nominal</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Last Ingest Sync:</span>
              <strong className="text-slate-200 text-sm">{currentSource.lastSync}</strong>
            </div>
          </div>
        </div>

        {/* 2. Platform Tailored KPI Cards (4 Cards with 3D Hover Tilt) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentTheme.kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-xl glass-panel border ${currentTheme.borderClass} hover:border-white/40 card-tilt-3d transition-all space-y-2 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className={`p-1.5 rounded-lg ${currentTheme.badgeBg} ${currentTheme.accentText} animate-float-slow`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {kpi.value}
                  </span>
                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    {kpi.change}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono">
                  {kpi.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* 3. Five Dedicated Platform Telemetry Graphs */}
        <PlatformGraphs platform={platform} brandColor={currentTheme.brandColor} />

        {/* 4. Detailed Feeds & Trend Radar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1 & 2: Dedicated Filtered Live Stream */}
          <div className={`lg:col-span-2 rounded-xl glass-panel p-5 sm:p-6 border ${currentTheme.borderClass} space-y-4 laser-sweep`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <span>Live {platform} Ingestion Event Stream</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] text-emerald-400 font-bold">
                    ACTIVE
                  </span>
                </h3>
              </div>

              {/* Language Filter */}
              <div className="flex items-center space-x-1 text-xs font-mono text-slate-400">
                <Filter className="w-3 h-3 text-cyan-400" />
                <span>Language:</span>
                {['All', 'English', 'Hindi', 'Hinglish'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      selectedLanguage === lang
                        ? `${currentTheme.badgeBg} ${currentTheme.accentText} border ${currentTheme.borderClass} font-bold`
                        : 'hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Event List */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  No recent events match the selected filter.
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${currentTheme.badgeBg} ${currentTheme.accentText}`}>
                          {evt.type.toUpperCase()}
                        </span>
                        <span className="text-slate-300 font-semibold">{evt.language}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{evt.time}</span>
                      </div>
                    </div>

                    <p className="text-slate-200 font-sans text-xs sm:text-sm leading-relaxed">
                      "{evt.sampleText}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400">
                      <span className="text-emerald-400 font-bold">
                        Sentiment: {evt.sentiment.toUpperCase()}
                      </span>
                      <span>Impact: {evt.count} interactions</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Col 3: Platform Trending Tags & Origin Narratives */}
          <div className={`rounded-xl glass-panel p-5 sm:p-6 border ${currentTheme.borderClass} space-y-5 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 text-sm font-mono font-bold text-white uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Emerging {platform} Narratives</span>
              </div>

              {/* Hashtag Clouds */}
              <div className="mt-4 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Top Monitored Hashtags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentTheme.trendingTags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono ${currentTheme.badgeBg} ${currentTheme.accentText} border ${currentTheme.borderClass}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related High-Velocity Topic */}
              <div className="mt-6 space-y-3">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Active Platform Thread Origin:
                </span>
                {risingNarratives.slice(0, 2).map((item) => (
                  <div
                    key={item.rank}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1 font-mono text-xs"
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="text-cyan-400 font-bold">{item.topic}</span>
                      <span className="text-emerald-400">+{item.growth}%</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                      <span>Velocity: {item.velocity}/100</span>
                      <span>Origin: {item.originCommunity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NTRO Directive Notice */}
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 font-mono text-[10px] text-cyan-300 leading-relaxed">
              <div className="flex items-center space-x-1.5 font-bold mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span>CYBER INTELLIGENCE COMPLIANCE</span>
              </div>
              Public discourse stream ingested under NTRO SIH-26152 guidelines with automated zero-PII masking.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
