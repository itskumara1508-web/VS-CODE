import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  ArrowLeft,
  Search,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  Shield,
  ExternalLink,
  Cpu,
  PlusCircle,
  Download,
  Copy,
  Check,
  X,
  Radio,
  Bot,
  MapPin,
  Wifi,
  Terminal,
  Play,
  Pause,
  Printer,
  Crosshair,
  AlertOctagon,
  BatteryCharging,
  SlidersHorizontal,
  FileText,
  Zap,
} from 'lucide-react';
import { Platform } from '../types';
import {
  PostForensicsRecord,
  ForensicsDeviceCategory,
  ForensicsThreatLevel,
  BotSwarmCluster,
  initialForensicsRecords,
  initialBotSwarmClusters,
  initialDeviceStats,
  initialCountryStats,
  initialHourlyActivity,
  generateSimulatedLivePacket,
} from '../data/postForensicsData';
import {
  XLogo,
  TelegramLogo,
  InstagramLogo,
  FacebookLogo,
  RedditLogo,
  YoutubeLogo,
} from './PlatformLogos';
import { Globe3DForensics } from './Globe3DForensics';

interface PostForensicsPageProps {
  onBackToDashboard: () => void;
  onSelectPlatform?: (platform: Platform) => void;
}

type ForensicsTab = 'globe-3d' | 'table' | 'radar-map' | 'bot-swarms' | 'briefing';

const COUNTRY_OPTIONS = [
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
];

const DEVICE_CATEGORY_OPTIONS: ForensicsDeviceCategory[] = [
  'Mobile (iOS)',
  'Mobile (Android)',
  'Desktop (Windows)',
  'Desktop (macOS)',
  'Server / Bot API',
  'Tablet',
];

const PLATFORM_LIST: { name: Platform | 'All'; label: string; icon: React.ReactNode; color: string }[] = [
  { name: 'All', label: 'All Media', icon: <Radio className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  { name: 'X', label: 'X (Twitter)', icon: <XLogo className="w-3.5 h-3.5" />, color: 'text-sky-400' },
  { name: 'Telegram', label: 'Telegram', icon: <TelegramLogo className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  { name: 'Instagram', label: 'Instagram', icon: <InstagramLogo className="w-3.5 h-3.5" />, color: 'text-pink-400' },
  { name: 'Facebook', label: 'Facebook', icon: <FacebookLogo className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  { name: 'Reddit', label: 'Reddit', icon: <RedditLogo className="w-3.5 h-3.5" />, color: 'text-orange-400' },
  { name: 'YouTube', label: 'YouTube', icon: <YoutubeLogo className="w-3.5 h-3.5" />, color: 'text-red-400' },
];

export const PostForensicsPage: React.FC<PostForensicsPageProps> = ({
  onBackToDashboard,
  onSelectPlatform: _onSelectPlatform,
}) => {
  const [activeTab, setActiveTab] = useState<ForensicsTab>('globe-3d');
  const [records, setRecords] = useState<PostForensicsRecord[]>(initialForensicsRecords);
  const [botSwarmList] = useState<BotSwarmCluster[]>(initialBotSwarmClusters);
  const [selectedRecord, setSelectedRecord] = useState<PostForensicsRecord | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('All');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('All');
  const [selectedDeviceFilter, setSelectedDeviceFilter] = useState<string>('All');
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<string>('All');
  const [selectedSwarmFilter, setSelectedSwarmFilter] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [livePacketAlert, setLivePacketAlert] = useState<string | null>(null);
  const [simCounter, setSimCounter] = useState(0);

  // Time-Series Playback Engine States
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const [currentPlaybackHour, setCurrentPlaybackHour] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // New Post Form State
  const [formUserId, setFormUserId] = useState('@');
  const [formUserName, setFormUserName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCountry, setFormCountry] = useState(COUNTRY_OPTIONS[0]);
  const [formPlatform, setFormPlatform] = useState<Platform>('X');
  const [formDevice, setFormDevice] = useState('Apple iPhone 16 Pro');
  const [formDeviceCategory, setFormDeviceCategory] = useState<ForensicsDeviceCategory>('Mobile (iOS)');
  const [formClientApp, setFormClientApp] = useState('Twitter for iOS v10.45');
  const [formCarrier, setFormCarrier] = useState('Jio 5G True5G');
  const [formContent, setFormContent] = useState('');
  const [formThreatLevel, setFormThreatLevel] = useState<ForensicsThreatLevel>('Low');
  const [formSentiment, setFormSentiment] = useState<'Supportive' | 'Against' | 'Anxiety' | 'Neutral' | 'Excitement' | 'Sarcasm'>('Supportive');

  // Timeline Playback loop
  useEffect(() => {
    if (isPlayingTimeline) {
      const intervalMs = 2000 / playbackSpeed;
      playbackTimerRef.current = setInterval(() => {
        setCurrentPlaybackHour((prev) => {
          const next = prev === null ? 0 : (prev + 1) % 24;
          return next;
        });
      }, intervalMs);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlayingTimeline, playbackSpeed]);

  // Live Packet Alert Auto-dismiss
  useEffect(() => {
    if (livePacketAlert) {
      const timer = setTimeout(() => setLivePacketAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [livePacketAlert]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Swarm filter
      if (selectedSwarmFilter && rec.botSwarmId !== selectedSwarmFilter) {
        return false;
      }
      // Timeline playback hour filter
      if (currentPlaybackHour !== null && rec.hourOfDay !== currentPlaybackHour) {
        return false;
      }
      // Platform filter
      if (selectedPlatformFilter !== 'All' && rec.platform !== selectedPlatformFilter) {
        return false;
      }
      // Country filter
      if (selectedCountryFilter !== 'All' && rec.country !== selectedCountryFilter) {
        return false;
      }
      // Device filter
      if (selectedDeviceFilter !== 'All' && rec.deviceCategory !== selectedDeviceFilter) {
        return false;
      }
      // Threat filter
      if (selectedThreatFilter !== 'All' && rec.threatLevel !== selectedThreatFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesUser = rec.userId.toLowerCase().includes(q) || rec.userName.toLowerCase().includes(q);
        const matchesLoc = rec.userLocation.toLowerCase().includes(q) || rec.country.toLowerCase().includes(q);
        const matchesDev = rec.device.toLowerCase().includes(q) || rec.clientApp.toLowerCase().includes(q);
        const matchesIp = rec.ipAddress.includes(q) || rec.isp.toLowerCase().includes(q);
        const matchesCarrier = rec.carrier?.toLowerCase().includes(q);
        const matchesContent = rec.postContent.toLowerCase().includes(q);
        return matchesUser || matchesLoc || matchesDev || matchesIp || matchesCarrier || matchesContent;
      }
      return true;
    });
  }, [
    records,
    selectedSwarmFilter,
    currentPlaybackHour,
    selectedPlatformFilter,
    selectedCountryFilter,
    selectedDeviceFilter,
    selectedThreatFilter,
    searchQuery,
  ]);

  // Simulate Live Packet Ingestion
  const handleSimulateLivePacket = () => {
    const newRecord = generateSimulatedLivePacket(simCounter);
    setSimCounter((prev) => prev + 1);
    setRecords([newRecord, ...records]);
    setLivePacketAlert(`🚨 [LIVE INTERCEPT]: New packet captured from ${newRecord.userId} (${newRecord.userLocation}, ${newRecord.countryFlag} ${newRecord.country}) via ${newRecord.device}`);
  };

  // Handle Form Submission to add custom record
  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUserId || !formLocation || !formContent) return;

    const now = new Date();
    const utcString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const istString = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-IN') + ' IST';

    const newRecord: PostForensicsRecord = {
      id: `FOR-26152-${Date.now().toString().slice(-4)}`,
      userId: formUserId.startsWith('@') || formUserId.startsWith('u/') ? formUserId : `@${formUserId}`,
      userName: formUserName || formUserId,
      userAvatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
      isVerified: false,
      userLocation: formLocation,
      country: formCountry.name,
      countryCode: formCountry.code,
      countryFlag: formCountry.flag,
      geoRegion: 'Custom Ingestion',
      coordinates: [20.5937, 78.9629],
      ipAddress: `103.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
      isp: 'Direct Carrier Uplink / NTRO TAP AS',
      carrier: formCarrier,
      batteryLevel: '85%',
      deviceTimezone: 'UTC+05:30 (Asia/Kolkata)',
      isTimezoneSpoofed: formDeviceCategory === 'Server / Bot API',
      timezoneAnalysis: formDeviceCategory === 'Server / Bot API' ? 'WARNING: Cloud execution header detected.' : 'Nominal time sync.',
      isVpnOrProxy: formDeviceCategory === 'Server / Bot API',
      postTime: utcString,
      postTimeLocal: istString,
      relativeTime: 'Just now',
      hourOfDay: now.getHours(),
      platform: formPlatform,
      device: formDevice,
      deviceCategory: formDeviceCategory,
      clientApp: formClientApp,
      userAgent: `SocioIntell-Forensics/2.4 (${formDevice}; ${formDeviceCategory})`,
      postContent: formContent,
      postUrl: `https://${formPlatform.toLowerCase()}.com/forensics/${Date.now()}`,
      threatLevel: formThreatLevel,
      sentiment: formSentiment,
      engagement: { views: 1200, likes: 85, shares: 14, comments: 6 },
    };

    setRecords([newRecord, ...records]);
    setIsLogModalOpen(false);
    setFormUserId('@');
    setFormUserName('');
    setFormLocation('');
    setFormContent('');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sociointell_forensics_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = [
      'Record ID',
      'User ID',
      'User Name',
      'Location',
      'Country',
      'Coordinates',
      'Carrier',
      'Device Timezone',
      'Timezone Spoofed',
      'IP Address',
      'Post Time UTC',
      'Post Time Local',
      'Platform',
      'Device',
      'Device Category',
      'Client App',
      'Threat Level',
      'Sentiment',
      'Post Content',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      `"${r.userId}"`,
      `"${r.userName}"`,
      `"${r.userLocation}"`,
      `"${r.country}"`,
      `"${r.coordinates.join(', ')}"`,
      `"${r.carrier || ''}"`,
      `"${r.deviceTimezone || ''}"`,
      r.isTimezoneSpoofed ? 'YES' : 'NO',
      r.ipAddress,
      `"${r.postTime}"`,
      `"${r.postTimeLocal}"`,
      r.platform,
      `"${r.device}"`,
      r.deviceCategory,
      `"${r.clientApp}"`,
      r.threatLevel,
      r.sentiment,
      `"${r.postContent.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `sociointell_forensics_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getDeviceIcon = (cat: ForensicsDeviceCategory) => {
    switch (cat) {
      case 'Mobile (iOS)':
      case 'Mobile (Android)':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Desktop (Windows)':
      case 'Desktop (macOS)':
        return <Laptop className="w-4 h-4 text-cyan-400" />;
      case 'Server / Bot API':
        return <Bot className="w-4 h-4 text-rose-400" />;
      case 'Tablet':
        return <Smartphone className="w-4 h-4 text-pink-400" />;
      default:
        return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  const renderPlatformLogo = (p: string) => {
    switch (p.toLowerCase()) {
      case 'x':
        return <XLogo className="w-4 h-4 text-sky-400" />;
      case 'telegram':
        return <TelegramLogo className="w-4 h-4 text-cyan-400" />;
      case 'instagram':
        return <InstagramLogo className="w-4 h-4 text-pink-400" />;
      case 'facebook':
        return <FacebookLogo className="w-4 h-4 text-blue-400" />;
      case 'reddit':
        return <RedditLogo className="w-4 h-4 text-orange-400" />;
      case 'youtube':
        return <YoutubeLogo className="w-4 h-4 text-red-400" />;
      default:
        return <Radio className="w-4 h-4 text-slate-400" />;
    }
  };

  const threatBadgeClasses = (t: ForensicsThreatLevel) => {
    switch (t) {
      case 'Critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/60 animate-pulse';
      case 'High':
        return 'bg-orange-950/80 text-orange-300 border-orange-500/50';
      case 'Medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'Low':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
    }
  };

  // Convert GPS Coordinates to Percentage Coordinates on World Map SVG
  const projectCoordsToMapPercent = (lat: number, lng: number): { x: number; y: number } => {
    // Equirectangular projection mapping:
    // Longitude: -180 to +180 -> 0% to 100%
    // Latitude: +85 to -85 -> 0% to 100%
    const x = ((lng + 180) / 360) * 100;
    const y = ((85 - lat) / 170) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(10, Math.min(90, y)),
    };
  };

  const spoofedRecordsCount = useMemo(() => {
    return records.filter((r) => r.isTimezoneSpoofed).length;
  }, [records]);

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 font-sans pb-28">
      {/* Live Interception Alert Toast */}
      {livePacketAlert && (
        <div className="fixed top-20 right-6 z-50 max-w-md p-4 rounded-xl bg-[#0b1b36] border border-cyan-400/80 text-cyan-200 text-xs font-mono shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-bounce flex items-start space-x-3 backdrop-blur-2xl">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">{livePacketAlert}</div>
          <button onClick={() => setLivePacketAlert(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Futuristic Mission HUD Header */}
      <section className="relative w-full border-b border-cyan-500/20 bg-gradient-to-b from-[#071328] to-[#030712] px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Return & Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-all hover:border-cyan-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Global Command</span>
              </button>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold">NTRO FORENSIC TELEMETRY STREAM</span>
              </div>

              {spoofedRecordsCount > 0 && (
                <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono animate-pulse">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                  <span>{spoofedRecordsCount} CLOCK SKEWS / SPOOFS DETECTED</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2.5">
              {/* Intercept Live Packet Simulator Trigger */}
              <button
                onClick={handleSimulateLivePacket}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>+ Simulate Intercept</span>
              </button>

              <button
                onClick={exportCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-all"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>CSV</span>
              </button>

              <button
                onClick={exportJSON}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={() => setIsLogModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Log Post</span>
              </button>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                <span>Problem Statement 26152 • Multi-Dimensional OSINT Telemetry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <span>POST ORIGIN & DEVICE FORENSICS</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-bold">
                  DEEP TRACE
                </span>
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                Inspect post origin vectors: <strong className="text-cyan-300">User ID</strong>, exact <strong className="text-emerald-300">Location & Country</strong>, <strong className="text-amber-300">Post Timestamp</strong>, destination <strong className="text-purple-300">Media Platform</strong>, and <strong className="text-pink-300">Posting Device & Hardware</strong>.
              </p>
            </div>

            {/* View Mode Switcher Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-cyan-500/30 backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('globe-3d')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'globe-3d'
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-white border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span>3D World Globe</span>
                <span className="px-1 py-0.2 text-[8px] bg-cyan-950 text-cyan-300 border border-cyan-400/40 rounded">
                  3D LIVE
                </span>
              </button>

              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'table'
                    ? 'bg-cyan-500/25 text-white border border-cyan-400 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ledger View</span>
              </button>

              <button
                onClick={() => setActiveTab('radar-map')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'radar-map'
                    ? 'bg-emerald-500/25 text-white border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tactical Radar Map</span>
              </button>

              <button
                onClick={() => setActiveTab('bot-swarms')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'bot-swarms'
                    ? 'bg-rose-500/25 text-white border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-rose-400" />
                <span>Bot Swarm CIB</span>
              </button>

              <button
                onClick={() => setActiveTab('briefing')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'briefing'
                    ? 'bg-purple-500/25 text-white border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Classified Briefing</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top KPI Cards Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: User IDs */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Monitored User IDs</span>
              <span className="text-cyan-400">👤 Target Handles</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {records.length} <span className="text-xs text-slate-400 font-normal">Accounts Tracked</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
              <span className="text-emerald-400">● 64% Verified Accounts</span>
              <span className="text-rose-400">● {botSwarmList.length} Bot Swarms</span>
            </div>
          </div>

          {/* Card 2: Geolocations & Countries */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Geographic Spread</span>
              <span className="text-emerald-400">🌍 Country Origin</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {initialCountryStats.length} <span className="text-xs text-slate-400 font-normal">Sovereign Nations</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
              <span className="text-cyan-300">🇮🇳 India #1 (53.3%)</span>
              <span className="text-slate-400">🇺🇸 13% • 🇬🇧 7%</span>
            </div>
          </div>

          {/* Card 3: Platforms */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Social Platforms</span>
              <span className="text-purple-400">📡 Ingestion Feeds</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              6 <span className="text-xs text-slate-400 font-normal">Active Networks</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
              <span className="text-sky-300">X / Twitter Peak</span>
              <span className="text-cyan-300">Telegram Real-Time</span>
            </div>
          </div>

          {/* Card 4: Hardware & Devices */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-pink-500/30 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="uppercase tracking-wider">Hardware & Spoofing</span>
              <span className="text-pink-400">📱 Fingerprints</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {spoofedRecordsCount > 0 ? (
                <span className="text-rose-400">{spoofedRecordsCount} Spoofs</span>
              ) : (
                <span>0 Spoofs</span>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
              <span className="text-emerald-400">67% Mobile (Android/iOS)</span>
              <span className="text-rose-400 font-bold">{spoofedRecordsCount} Clock Skews</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Time-Series Timeline Playback Control Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="p-4 rounded-2xl bg-[#071328]/95 border border-cyan-500/40 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-center transition-all ${
                isPlayingTimeline
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              }`}
            >
              {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div>
              <div className="text-xs font-mono font-bold text-white flex items-center space-x-2">
                <span>CHRONOLOGICAL SPREAD PLAYBACK</span>
                {isPlayingTimeline && (
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] animate-pulse">
                    PLAYING @ {playbackSpeed}X
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {currentPlaybackHour !== null
                  ? `Active Window: ${currentPlaybackHour.toString().padStart(2, '0')}:00 - ${currentPlaybackHour.toString().padStart(2, '0')}:59 IST (${filteredRecords.length} posts)`
                  : 'Viewing Complete 24H Ingestion History'}
              </div>
            </div>
          </div>

          {/* Time Scrubber Slider */}
          <div className="flex-1 max-w-md w-full flex items-center space-x-3">
            <span className="text-[10px] font-mono text-slate-400">00:00</span>
            <input
              type="range"
              min="0"
              max="23"
              value={currentPlaybackHour ?? 12}
              onChange={(e) => {
                setIsPlayingTimeline(false);
                setCurrentPlaybackHour(parseInt(e.target.value));
              }}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[10px] font-mono text-slate-400">23:00</span>
          </div>

          {/* Speed & Reset */}
          <div className="flex items-center space-x-2">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd as any)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-all ${
                  playbackSpeed === spd
                    ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}

            {currentPlaybackHour !== null && (
              <button
                onClick={() => {
                  setIsPlayingTimeline(false);
                  setCurrentPlaybackHour(null);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono"
              >
                Show 24H
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. Tab Mode 0: Interactive 3D Holographic World Globe */}
      {activeTab === 'globe-3d' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Globe3DForensics
            records={filteredRecords}
            selectedRecord={selectedRecord}
            onSelectRecord={setSelectedRecord}
            onInspectRecord={setSelectedRecord}
          />
        </section>
      )}

      {/* 5. Tab Mode 1: Interactive Tactical Geolocation Radar Map */}
      {activeTab === 'radar-map' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative rounded-3xl bg-[#040d1e] border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden p-6">
            {/* Radar Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-emerald-500/20">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50">
                  <Crosshair className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-mono tracking-wider flex items-center gap-2">
                    <span>TACTICAL GEOLOCATION RADAR MATRIX</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] border border-emerald-500/50 animate-pulse">
                      GEO-LOCK ACTIVE
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Global coordinate mapping: click any pulsating node to isolate User ID, Country, Platform & Device.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Critical Target</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>Standard Origin</span>
                </div>
                <div className="text-emerald-400 font-bold">
                  {filteredRecords.length} Nodes Rendered
                </div>
              </div>
            </div>

            {/* Radar Canvas / SVG Container */}
            <div className="relative w-full h-[520px] rounded-2xl bg-[#030914] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
              {/* Tactical Radar Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

              {/* Concentric Radar Range Rings */}
              <div className="absolute w-[460px] h-[460px] rounded-full border border-emerald-500/15 pointer-events-none" />
              <div className="absolute w-[320px] h-[320px] rounded-full border border-emerald-500/20 pointer-events-none" />
              <div className="absolute w-[180px] h-[180px] rounded-full border border-emerald-500/30 pointer-events-none" />

              {/* Radar Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/20 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-emerald-500/20 pointer-events-none" />

              {/* Radar Sweep Animation Beam */}
              <div className="absolute w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent animate-spin-slow pointer-events-none" />

              {/* World Map Continental Silhouette Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none select-none">
                <svg viewBox="0 0 1000 500" className="w-full h-full fill-cyan-400">
                  <path d="M150,120 Q180,90 230,110 T300,160 Q260,220 220,260 T160,200 Z" />
                  <path d="M220,280 Q250,270 280,310 T260,420 Q220,440 200,360 Z" />
                  <path d="M480,90 Q540,80 580,110 T600,160 Q520,170 480,120 Z" />
                  <path d="M490,190 Q560,180 580,240 T540,380 Q480,360 460,260 Z" />
                  <path d="M640,90 Q780,80 840,140 T780,240 Q680,220 640,140 Z" />
                  <path d="M680,210 Q720,200 740,240 T710,290 Q670,280 670,240 Z" />
                  <path d="M780,320 Q840,300 880,340 T840,410 Q780,410 760,360 Z" />
                </svg>
              </div>

              {/* Interactive Post Geographic Pins */}
              {filteredRecords.map((rec) => {
                const pos = projectCoordsToMapPercent(rec.coordinates[0], rec.coordinates[1]);
                const isSelected = selectedRecord?.id === rec.id;
                const isCritical = rec.threatLevel === 'Critical';
                const isHigh = rec.threatLevel === 'High';

                return (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 cursor-pointer"
                    title={`${rec.userId} (${rec.userLocation}, ${rec.country})`}
                  >
                    {/* Ping rings */}
                    <span
                      className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${
                        isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}
                    />

                    {/* Pin Center Marker */}
                    <div
                      className={`relative flex items-center justify-center rounded-full p-1 border shadow-xl transition-transform transform group-hover:scale-125 ${
                        isSelected
                          ? 'ring-4 ring-cyan-400 scale-125 bg-white text-black'
                          : isCritical
                          ? 'bg-rose-600 border-rose-400 text-white'
                          : isHigh
                          ? 'bg-amber-500 border-amber-300 text-black'
                          : 'bg-cyan-950 border-cyan-400 text-cyan-300'
                      }`}
                    >
                      <span className="text-xs leading-none">{rec.countryFlag}</span>
                    </div>

                    {/* Floating Tactical Pin Label */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-0.5 rounded-md bg-[#071328]/95 border border-cyan-500/40 text-[10px] font-mono whitespace-nowrap shadow-2xl transition-opacity pointer-events-none ${
                        isSelected ? 'opacity-100 ring-1 ring-cyan-400' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <div className="font-bold text-white">{rec.userId}</div>
                      <div className="text-cyan-300 flex items-center gap-1 text-[9px]">
                        <span>{rec.userLocation}</span>
                        <span>•</span>
                        <span>{rec.platform}</span>
                      </div>
                      <div className="text-[9px] text-pink-300">{rec.device}</div>
                    </div>
                  </button>
                );
              })}

              {/* Selected Target HUD Overlay in Corner */}
              {selectedRecord && (
                <div className="absolute bottom-4 left-4 max-w-sm w-full p-4 rounded-2xl bg-[#081733]/95 border border-cyan-400/60 font-mono text-xs shadow-2xl backdrop-blur-xl z-30 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-[10px] text-cyan-300 font-bold uppercase">TARGET RADAR LOCK</span>
                    </div>
                    <button
                      onClick={() => setSelectedRecord(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{selectedRecord.userId}</div>
                      <div className="text-slate-400 text-[11px]">{selectedRecord.userName}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${threatBadgeClasses(selectedRecord.threatLevel)}`}>
                      {selectedRecord.threatLevel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400">Origin:</span>{' '}
                      <strong className="text-emerald-300">{selectedRecord.countryFlag} {selectedRecord.country}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">City:</span>{' '}
                      <strong className="text-white">{selectedRecord.userLocation}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Media:</span>{' '}
                      <strong className="text-purple-300">{selectedRecord.platform}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Hardware:</span>{' '}
                      <strong className="text-pink-300">{selectedRecord.device}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Post Time:</span>{' '}
                      <strong className="text-amber-300">{selectedRecord.relativeTime}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Carrier:</span>{' '}
                      <strong className="text-cyan-300 truncate">{selectedRecord.carrier}</strong>
                    </div>
                  </div>

                  {selectedRecord.isTimezoneSpoofed && (
                    <div className="p-2 rounded bg-rose-950/80 border border-rose-500/50 text-[10px] text-rose-300">
                      ⚠️ Clock Skew Spoofing Detected!
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(selectedRecord, null, 2), selectedRecord.id)}
                      className="text-cyan-400 hover:underline text-[10px]"
                    >
                      {copiedId === selectedRecord.id ? '✓ Copied' : 'Copy JSON'}
                    </button>
                    <button
                      onClick={() => setSelectedRecord(selectedRecord)}
                      className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                    >
                      Full Dossier →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. Tab Mode 2: Bot Swarm & Coordinated Inauthentic Behavior (CIB) Matrix */}
      {activeTab === 'bot-swarms' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="rounded-3xl bg-[#081329]/90 border border-rose-500/40 p-6 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-rose-500/20">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-rose-950/80 border border-rose-500/60">
                  <Bot className="w-6 h-6 text-rose-400 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-mono tracking-wider flex items-center gap-2">
                    <span>COORDINATED BOT SWARM & SYBIL CLUSTERS</span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-xs border border-rose-500/50 font-bold">
                      AUTOMATED THREAT ENGINE
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Cross-correlation heuristic isolating synchronized client signatures, rapid burst timing, and identical hardware footprints.
                  </p>
                </div>
              </div>

              {selectedSwarmFilter && (
                <button
                  onClick={() => setSelectedSwarmFilter(null)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-mono"
                >
                  Clear Swarm Filter ({selectedSwarmFilter})
                </button>
              )}
            </div>

            {/* Swarms List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {botSwarmList.map((swarm) => (
                <div
                  key={swarm.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    selectedSwarmFilter === swarm.id
                      ? 'bg-rose-950/40 border-rose-400 ring-2 ring-rose-500'
                      : 'bg-slate-900/80 border-slate-800 hover:border-rose-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/40">
                          {swarm.id}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{swarm.originFlag} {swarm.originCountry}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1 font-mono">{swarm.name}</h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 border border-rose-500/60 text-rose-300">
                      {swarm.severity}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-slate-300 py-2 border-y border-slate-800">
                    <div>
                      <span className="text-slate-400">Narrative Target:</span>{' '}
                      <strong className="text-amber-300">{swarm.narrativeTarget}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Member Nodes:</span>{' '}
                      <strong className="text-white">{swarm.totalNodes} accounts</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Posting Burst Interval:</span>{' '}
                      <strong className="text-rose-400">{swarm.averageIntervalSeconds}s sync cadence</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Hardware Fingerprint:</span>{' '}
                      <span className="text-cyan-300 text-[11px] block mt-0.5">{swarm.fingerprintSignature}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-[10px] font-mono text-emerald-400">{swarm.actionTaken}</div>
                    <button
                      onClick={() => {
                        setSelectedSwarmFilter(swarm.id);
                        setActiveTab('table');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono font-bold text-xs"
                    >
                      Isolate Swarm Posts →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Tab Mode 3: Classified Printable Briefing Report */}
      {activeTab === 'briefing' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0">
          <div className="p-8 rounded-3xl bg-[#09152b] border-2 border-cyan-500/40 shadow-2xl font-mono text-xs text-slate-200 space-y-6">
            {/* Classified Watermark Header */}
            <div className="flex items-center justify-between border-b-2 border-cyan-500/40 pb-4">
              <div>
                <div className="text-rose-400 font-bold tracking-widest text-xs">
                  TOP SECRET // NTRO CYBER INTELLIGENCE COMMAND // NOFORN
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  TACTICAL POST ORIGIN & HARDWARE FORENSIC DIRECTIVE
                </h2>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  DOCUMENT REF: NTRO-PS26152-FOR-2026 • GENERATED: {new Date().toUTCString()}
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-glow-cyan print:hidden"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Briefing</span>
              </button>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                1. EXECUTIVE INTELLIGENCE SUMMARY
              </h3>
              <p className="text-slate-300 leading-relaxed text-xs">
                During the current reporting interval, automated telemetry tracking monitored <strong>{records.length} distinct social media posts</strong> across 6 major platforms. Identified geolocation origins encompass <strong>{initialCountryStats.length} sovereign territories</strong>, with <strong>{spoofedRecordsCount} instances of malicious system clock skewing</strong> detected. A critical synchronized bot cluster ({botSwarmList[0]?.id}) was neutralized targeting critical infrastructure narratives.
              </p>
            </div>

            {/* High Priority Target Breakdown Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                2. CRITICAL & HIGH SEVERITY INCIDENT TELEMETRY
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-700 text-[11px]">
                  <thead>
                    <tr className="bg-slate-900 text-cyan-300 border-b border-slate-700">
                      <th className="p-2">Target Handle</th>
                      <th className="p-2">Location & Country</th>
                      <th className="p-2">Post Time</th>
                      <th className="p-2">Platform</th>
                      <th className="p-2">Device & Client</th>
                      <th className="p-2">Threat Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {records
                      .filter((r) => r.threatLevel === 'Critical' || r.threatLevel === 'High')
                      .map((r) => (
                        <tr key={r.id} className="hover:bg-slate-900/50">
                          <td className="p-2 font-bold text-white">{r.userId}</td>
                          <td className="p-2">{r.countryFlag} {r.userLocation}, {r.country}</td>
                          <td className="p-2 text-slate-300">{r.postTimeLocal}</td>
                          <td className="p-2 font-semibold text-cyan-300">{r.platform}</td>
                          <td className="p-2 text-pink-300">{r.device}</td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${threatBadgeClasses(r.threatLevel)}`}>
                              {r.threatLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operational Signoff */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[10px]">
              <div>AUTHENTICATED BY: NTRO CYBER INTELLIGENCE SENSOR MATRIX</div>
              <div>CLASSIFICATION STATUS: SOVEREIGN DEFENSE EYES ONLY</div>
            </div>
          </div>
        </section>
      )}

      {/* 7. Tab Mode 4: Main Telemetry Table & Charts View */}
      {activeTab === 'table' && (
        <>
          {/* Visual Analytics Section: Charts */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart 1: Device Breakdown Donut */}
              <div className="p-5 rounded-2xl bg-[#081329]/80 border border-cyan-500/30 backdrop-blur-xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>Posting Device Breakdown</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      HARDWARE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Distribution of client operating systems and hardware posting to monitored feeds.
                  </p>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={initialDeviceStats}
                        dataKey="count"
                        nameKey="deviceCategory"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {initialDeviceStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as any;
                            return (
                              <div className="p-2.5 rounded-lg bg-[#070d1e] border border-cyan-500/40 font-mono text-xs shadow-xl">
                                <p className="font-bold text-white">{data.deviceCategory}</p>
                                <p className="text-cyan-300">
                                  {data.count} posts ({data.percentage}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono">
                  {initialDeviceStats.map((item) => (
                    <div key={item.deviceCategory} className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 truncate">{item.deviceCategory}:</span>
                      <span className="text-white font-bold ml-auto">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart 2: Country Origin Distribution */}
              <div className="p-5 rounded-2xl bg-[#081329]/80 border border-emerald-500/30 backdrop-blur-xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>Country of Origin Volume</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      GEOGRAPHY
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Country-level forensic routing and detected physical jurisdiction of posters.
                  </p>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={initialCountryStats.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="countryCode"
                        stroke="#64748b"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(code) => {
                          const found = initialCountryStats.find((c) => c.countryCode === code);
                          return found ? `${found.countryFlag} ${code}` : code;
                        }}
                      />
                      <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as any;
                            return (
                              <div className="p-2.5 rounded-lg bg-[#070d1e] border border-emerald-500/40 font-mono text-xs shadow-xl">
                                <p className="font-bold text-white">
                                  {data.countryFlag} {data.country} ({data.countryCode})
                                </p>
                                <p className="text-emerald-300 font-bold">{data.count} Verified Posts</p>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  Critical: {data.threatDistribution.critical} • High: {data.threatDistribution.high} • Low: {data.threatDistribution.low}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
                  <span>Primary: 🇮🇳 India (8 posts)</span>
                  <span className="text-emerald-400 font-semibold">{initialCountryStats.length} Geofenced Regions</span>
                </div>
              </div>

              {/* Chart 3: Post Time Distribution Timeline */}
              <div className="p-5 rounded-2xl bg-[#081329]/80 border border-purple-500/30 backdrop-blur-xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>Posting Time Activity (24H)</span>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40">
                      TEMPORAL
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Hourly density showing at what times posts are submitted across platforms.
                  </p>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={initialHourlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBot" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="timeLabel" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                      <YAxis stroke="#64748b" fontSize={10} fontFamily="monospace" />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as any;
                            return (
                              <div className="p-2.5 rounded-lg bg-[#070d1e] border border-purple-500/40 font-mono text-xs shadow-xl">
                                <p className="font-bold text-white mb-1">{label}</p>
                                <p className="text-purple-300">Total Volume: {data.totalPosts}</p>
                                <p className="text-emerald-300">Mobile: {data.mobilePosts}</p>
                                <p className="text-rose-400">Automated Bots: {data.botPosts}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="totalPosts" stroke="#a855f7" fillOpacity={1} fill="url(#colorTotal)" name="Total Posts" />
                      <Area type="monotone" dataKey="botPosts" stroke="#ef4444" fillOpacity={1} fill="url(#colorBot)" name="Bot Swarm" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
                  <span className="text-purple-300">Peak Window: 18:00 - 22:00 IST</span>
                  <span className="text-rose-400">Nighttime Bot Bursts</span>
                </div>
              </div>
            </div>
          </section>

          {/* Filter & Search HUD Bar */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="p-4 rounded-2xl bg-[#081329]/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search User ID, City, Device, Carrier, text..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-cyan-400 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={selectedCountryFilter}
                    onChange={(e) => setSelectedCountryFilter(e.target.value)}
                    aria-label="Filter by Country"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="All">🌍 All Countries</option>
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={selectedDeviceFilter}
                    onChange={(e) => setSelectedDeviceFilter(e.target.value)}
                    aria-label="Filter by Device Type"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="All">📱 All Device Categories</option>
                    {DEVICE_CATEGORY_OPTIONS.map((dev) => (
                      <option key={dev} value={dev}>
                        {dev}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={selectedThreatFilter}
                    onChange={(e) => setSelectedThreatFilter(e.target.value)}
                    aria-label="Filter by Threat Level"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400 transition-all appearance-none cursor-pointer"
                  >
                    <option value="All">🛡️ All Threat Ratings</option>
                    <option value="Critical">🚨 Critical Threat Only</option>
                    <option value="High">⚠️ High Threat Only</option>
                    <option value="Medium">⚡ Medium Threat Only</option>
                    <option value="Low">✅ Low / Normal Threat</option>
                  </select>
                </div>
              </div>

              {/* Quick Platform Filter Badges */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-400 font-bold">MEDIA PLATFORM:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORM_LIST.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setSelectedPlatformFilter(p.name)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                          selectedPlatformFilter === p.name
                            ? 'bg-cyan-500/25 text-white font-bold border border-cyan-400 shadow-glow-cyan'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 font-bold">{filteredRecords.length} records</span>
                  {(selectedPlatformFilter !== 'All' ||
                    selectedCountryFilter !== 'All' ||
                    selectedDeviceFilter !== 'All' ||
                    selectedThreatFilter !== 'All' ||
                    searchQuery) && (
                    <button
                      onClick={() => {
                        setSelectedPlatformFilter('All');
                        setSelectedCountryFilter('All');
                        setSelectedDeviceFilter('All');
                        setSelectedThreatFilter('All');
                        setSearchQuery('');
                      }}
                      className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/40 text-[10px] hover:bg-rose-900"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Forensic Records Telemetry Table */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="rounded-2xl bg-[#081329]/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-cyan-500/20 bg-slate-900/90 text-cyan-400 font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-bold">1. User ID & Handle</th>
                      <th className="py-3.5 px-4 font-bold">2. User Location & Country</th>
                      <th className="py-3.5 px-4 font-bold">3. Post Time & Age</th>
                      <th className="py-3.5 px-4 font-bold">4. Media Platform</th>
                      <th className="py-3.5 px-4 font-bold">5. Device & Carrier</th>
                      <th className="py-3.5 px-4 font-bold">Threat & Content</th>
                      <th className="py-3.5 px-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Shield className="w-8 h-8 text-cyan-500/50 mx-auto mb-2 animate-pulse" />
                          <p className="text-sm font-bold text-slate-300">No forensic records match your current filter parameters.</p>
                          <button
                            onClick={() => {
                              setSelectedPlatformFilter('All');
                              setSelectedCountryFilter('All');
                              setSelectedDeviceFilter('All');
                              setSelectedThreatFilter('All');
                              setSearchQuery('');
                            }}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs"
                          >
                            Clear Filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((rec) => (
                        <tr
                          key={rec.id}
                          className="hover:bg-cyan-950/20 transition-colors group cursor-pointer"
                          onClick={() => setSelectedRecord(rec)}
                        >
                          {/* 1. User ID */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <img
                                  src={rec.userAvatar}
                                  alt={rec.userName}
                                  className="w-9 h-9 rounded-full object-cover border border-cyan-500/40"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                                {rec.isVerified && (
                                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-cyan-500 rounded-full flex items-center justify-center text-[9px] text-black font-bold">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center space-x-1.5">
                                  <span className="font-bold text-white hover:text-cyan-300 transition-colors">
                                    {rec.userId}
                                  </span>
                                  {rec.deviceCategory === 'Server / Bot API' && (
                                    <span className="px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 text-[9px] border border-rose-500/40">
                                      BOT
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400">{rec.userName}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Wifi className="w-2.5 h-2.5 text-cyan-400" />
                                  <span>{rec.ipAddress}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Location & Country */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-base">{rec.countryFlag}</span>
                                <span className="font-bold text-white">{rec.country}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                                  {rec.countryCode}
                                </span>
                              </div>
                              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{rec.userLocation}</span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                [{rec.coordinates[0].toFixed(2)}°, {rec.coordinates[1].toFixed(2)}°]
                                {rec.isTimezoneSpoofed && (
                                  <span className="ml-1 text-rose-400 font-bold">• Clock Spoofed</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 3. Post Time & Age */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-1 text-cyan-300 font-bold">
                                <Clock className="w-3 h-3 text-cyan-400" />
                                <span>{rec.relativeTime}</span>
                              </div>
                              <div className="text-[11px] text-slate-300 font-mono">{rec.postTimeLocal}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{rec.postTime}</div>
                            </div>
                          </td>

                          {/* 4. Media Platform */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                                {renderPlatformLogo(rec.platform)}
                              </div>
                              <div>
                                <div className="font-bold text-white">{rec.platform}</div>
                                <a
                                  href={rec.postUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                                >
                                  <span>View Post</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          </td>

                          {/* 5. Device & Carrier */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1.5">
                                {getDeviceIcon(rec.deviceCategory)}
                                <span className="font-bold text-white">{rec.device}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                <span className="truncate">{rec.carrier}</span>
                                {rec.batteryLevel && (
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                                    <BatteryCharging className="w-2.5 h-2.5" />
                                    {rec.batteryLevel}
                                  </span>
                                )}
                              </div>
                              <div className="inline-block px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                                {rec.deviceCategory}
                              </div>
                            </div>
                          </td>

                          {/* Threat & Content */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${threatBadgeClasses(rec.threatLevel)}`}>
                                  {rec.threatLevel} Threat
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">{rec.sentiment}</span>
                              </div>
                              <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                                "{rec.postContent}"
                              </p>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecord(rec);
                              }}
                              className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition-all hover:border-cyan-300"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 8. Deep-Dive Forensic Dossier Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#081329] border border-cyan-500/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-mono text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-cyan-500/20 bg-slate-900/80">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[10px] text-cyan-400 tracking-wider uppercase font-bold">
                    DEEP TELEMETRY DOSSIER • {selectedRecord.id}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{selectedRecord.userId}</span>
                    <span className="text-xs text-slate-400 font-normal">({selectedRecord.userName})</span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {/* 5 Core Spotlight Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* 1. User ID */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>1. User ID & Handle</span>
                    <span>{selectedRecord.isVerified ? '✓ Verified' : 'Standard'}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{selectedRecord.userId}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{selectedRecord.userName}</div>
                </div>

                {/* 2. User Location & Country */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                  <div className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>2. Location & Country</span>
                    <span className="text-base">{selectedRecord.countryFlag}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{selectedRecord.country}</div>
                  <div className="text-emerald-300 text-[11px] mt-0.5">{selectedRecord.userLocation}</div>
                </div>

                {/* 3. Post Time */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/30">
                  <div className="text-[10px] text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>3. Post Timestamp</span>
                    <span>{selectedRecord.relativeTime}</span>
                  </div>
                  <div className="font-bold text-white text-xs">{selectedRecord.postTimeLocal}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{selectedRecord.postTime}</div>
                </div>

                {/* 4. Media Platform */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/30">
                  <div className="text-[10px] text-purple-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>4. Media Platform</span>
                    <span>{renderPlatformLogo(selectedRecord.platform)}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{selectedRecord.platform}</div>
                  <a
                    href={selectedRecord.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 text-[11px] underline flex items-center gap-1 mt-0.5"
                  >
                    <span>Inspect live URL</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* 5. Posting Device */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-pink-500/30 sm:col-span-2">
                  <div className="text-[10px] text-pink-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>5. Device & Carrier Hardware</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-950 text-pink-300 border border-pink-500/40">
                      {selectedRecord.deviceCategory}
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    {getDeviceIcon(selectedRecord.deviceCategory)}
                    <span>{selectedRecord.device}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Carrier: {selectedRecord.carrier} • Battery: {selectedRecord.batteryLevel}</div>
                </div>
              </div>

              {/* Timezone Spoofing Inspection Card */}
              {selectedRecord.isTimezoneSpoofed && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 space-y-1">
                  <div className="text-rose-400 font-bold text-xs flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>CRITICAL HARDWARE TIMEZONE SKEW DETECTED</span>
                  </div>
                  <p className="text-rose-200 text-xs">{selectedRecord.timezoneAnalysis}</p>
                  <div className="text-[10px] text-rose-300 pt-1 font-mono">
                    Reported Timezone: {selectedRecord.deviceTimezone} vs Physical Region: {selectedRecord.country}
                  </div>
                </div>
              )}

              {/* Content Payload Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
                  <span>Intercepted Social Media Payload</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${threatBadgeClasses(selectedRecord.threatLevel)}`}>
                    {selectedRecord.threatLevel} Threat
                  </span>
                </div>
                <blockquote className="text-slate-200 text-xs italic bg-slate-900/90 p-3 rounded-lg border-l-2 border-cyan-400">
                  "{selectedRecord.postContent}"
                </blockquote>
                <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  <div>Views: <strong className="text-white">{selectedRecord.engagement.views.toLocaleString()}</strong></div>
                  <div>Likes: <strong className="text-white">{selectedRecord.engagement.likes.toLocaleString()}</strong></div>
                  <div>Shares: <strong className="text-white">{selectedRecord.engagement.shares.toLocaleString()}</strong></div>
                  <div>Comments: <strong className="text-white">{selectedRecord.engagement.comments.toLocaleString()}</strong></div>
                </div>
              </div>

              {/* Technical Network & Fingerprint */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                  Network & Hardware Fingerprint
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Origin IP:</span>{' '}
                    <strong className="text-cyan-300">{selectedRecord.ipAddress}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ISP / Routing:</span>{' '}
                    <strong className="text-slate-200">{selectedRecord.isp}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Coordinates:</span>{' '}
                    <strong className="text-slate-200">
                      {selectedRecord.coordinates[0]}° N, {selectedRecord.coordinates[1]}° E
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Carrier Network:</span>{' '}
                    <strong className="text-cyan-300">{selectedRecord.carrier}</strong>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-1">User-Agent Header:</div>
                  <pre className="p-2 rounded bg-black/60 text-[10px] text-cyan-400 font-mono overflow-x-auto whitespace-pre-wrap">
                    {selectedRecord.userAgent}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-cyan-500/20 bg-slate-900/80 flex items-center justify-between">
              <button
                onClick={() => copyToClipboard(JSON.stringify(selectedRecord, null, 2), selectedRecord.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-all"
              >
                {copiedId === selectedRecord.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Full Dossier!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy Raw JSON</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Log New Post Forensics Modal Form */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#081329] border border-cyan-500/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-900/80">
              <div className="flex items-center space-x-2.5">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Log Post Forensic Telemetry</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-cyan-400 uppercase tracking-wider mb-1">
                    User ID / Handle *
                  </label>
                  <input
                    type="text"
                    required
                    value={formUserId}
                    onChange={(e) => setFormUserId(e.target.value)}
                    placeholder="@target_handle"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Author / Display Name
                  </label>
                  <input
                    type="text"
                    value={formUserName}
                    onChange={(e) => setFormUserName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-emerald-400 uppercase tracking-wider mb-1">
                    City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Karnataka"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-emerald-400 uppercase tracking-wider mb-1">
                    Country of Origin *
                  </label>
                  <select
                    value={formCountry.name}
                    onChange={(e) => {
                      const found = COUNTRY_OPTIONS.find((c) => c.name === e.target.value);
                      if (found) setFormCountry(found);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-purple-400 uppercase tracking-wider mb-1">
                    Media Platform *
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as Platform)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none cursor-pointer"
                  >
                    <option value="X">X (Twitter)</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Reddit">Reddit</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-pink-400 uppercase tracking-wider mb-1">
                    Posting Device Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDevice}
                    onChange={(e) => setFormDevice(e.target.value)}
                    placeholder="e.g. Apple iPhone 16 Pro"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-pink-400 uppercase tracking-wider mb-1">
                    Device Category *
                  </label>
                  <select
                    value={formDeviceCategory}
                    onChange={(e) => setFormDeviceCategory(e.target.value as ForensicsDeviceCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none cursor-pointer"
                  >
                    {DEVICE_CATEGORY_OPTIONS.map((dev) => (
                      <option key={dev} value={dev}>
                        {dev}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    Carrier Network
                  </label>
                  <input
                    type="text"
                    value={formCarrier}
                    onChange={(e) => setFormCarrier(e.target.value)}
                    placeholder="e.g. Jio 5G SA / Airtel Fiber"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-pink-400 uppercase tracking-wider mb-1">
                    Client App Signature
                  </label>
                  <input
                    type="text"
                    value={formClientApp}
                    onChange={(e) => setFormClientApp(e.target.value)}
                    placeholder="e.g. Twitter for iOS v10.45"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-rose-400 uppercase tracking-wider mb-1">
                    Threat Assessment
                  </label>
                  <select
                    value={formThreatLevel}
                    onChange={(e) => setFormThreatLevel(e.target.value as ForensicsThreatLevel)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none cursor-pointer"
                  >
                    <option value="Low">Low Threat</option>
                    <option value="Medium">Medium Threat</option>
                    <option value="High">High Threat</option>
                    <option value="Critical">Critical Threat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-cyan-400 uppercase tracking-wider mb-1">
                    Sentiment Dimension
                  </label>
                  <select
                    value={formSentiment}
                    onChange={(e) => setFormSentiment(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none cursor-pointer"
                  >
                    <option value="Supportive">Supportive</option>
                    <option value="Against">Against</option>
                    <option value="Anxiety">Anxiety</option>
                    <option value="Excitement">Excitement</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Sarcasm">Sarcasm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-cyan-400 uppercase tracking-wider mb-1">
                  Post Content / Intercepted Payload *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Paste the intercepted message text, post body, or tweet content..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan"
                >
                  Ingest Telemetry Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
