import React, { useState, useMemo } from 'react';
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
} from 'recharts';
import {
  ArrowLeft,
  FileText,
  PlusCircle,
  Trash2,
  Download,
  Printer,
  Copy,
  Shield,
  AlertTriangle,
  Activity,
  Share2,
  Eye,
  MessageSquare,
  Sparkles,
  Search,
  RefreshCw,
  Bot,
  Database,
  Layers,
} from 'lucide-react';
import { Platform } from '../types';
import {
  ManualIngestionRecord,
  ThreatLevel,
  initialManualRecords,
  presetTemplates,
} from '../data/manualReportData';
import {
  XLogo,
  TelegramLogo,
  InstagramLogo,
  FacebookLogo,
  RedditLogo,
  YoutubeLogo,
} from './PlatformLogos';

interface ManualReportPageProps {
  onBackToDashboard: () => void;
  onSelectPlatform: (platform: Platform) => void;
}

const EMOTION_OPTIONS = [
  { name: 'Excitement & Euphoria', emoji: '🤩', color: '#00f0ff' },
  { name: 'Support & Trust', emoji: '🤝', color: '#10b981' },
  { name: 'Hope & Gratitude', emoji: '💖', color: '#3b82f6' },
  { name: 'Objective Neutrality', emoji: '😐', color: '#94a3b8' },
  { name: 'Anxiety & Caution', emoji: '😰', color: '#f59e0b' },
  { name: 'Outrage & Hostility', emoji: '😡', color: '#ef4444' },
  { name: 'Grief & Despair', emoji: '😢', color: '#64748b' },
  { name: 'Sarcasm & Cynicism', emoji: '🎭', color: '#ec4899' },
];

const PLATFORM_OPTIONS: (Platform | 'DarkWeb' | 'Custom')[] = [
  'X',
  'Telegram',
  'Instagram',
  'Facebook',
  'Reddit',
  'YouTube',
  'DarkWeb',
  'Custom',
];

const THREAT_LEVELS: { level: ThreatLevel; color: string; bg: string; border: string }[] = [
  { level: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-500/40' },
  { level: 'Medium', color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-500/40' },
  { level: 'High', color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-500/40' },
  { level: 'Critical', color: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-500/40' },
];

export const ManualReportPage: React.FC<ManualReportPageProps> = ({
  onBackToDashboard,
  onSelectPlatform: _onSelectPlatform,
}) => {
  const [activeTab, setActiveTab] = useState<'entry' | 'dossier'>('entry');
  const [records, setRecords] = useState<ManualIngestionRecord[]>(initialManualRecords);

  // Form states
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform | 'DarkWeb' | 'Custom'>('X');
  const [author, setAuthor] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('English');
  const [selectedEmotion, setSelectedEmotion] = useState(EMOTION_OPTIONS[0]);
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('Medium');
  const [views, setViews] = useState<number | ''>(12500);
  const [likes, setLikes] = useState<number | ''>(850);
  const [shares, setShares] = useState<number | ''>(320);
  const [comments, setComments] = useState<number | ''>(110);
  const [isCoordinated, setIsCoordinated] = useState(false);
  const [tagsInput, setTagsInput] = useState('#Intel, #SIH2026');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');
  const [filterThreat, setFilterThreat] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Preset Template Loader
  const handleLoadPreset = (index: number) => {
    const p = presetTemplates[index % presetTemplates.length];
    setTitle(p.title);
    setPlatform(p.platform);
    setAuthor(p.author);
    setSourceUrl(p.sourceUrl || '');
    setContent(p.content);
    setLanguage(p.language);
    const emo = EMOTION_OPTIONS.find((e) => e.name === p.emotion) || EMOTION_OPTIONS[0];
    setSelectedEmotion(emo);
    setThreatLevel(p.threatLevel);
    setViews(p.views);
    setLikes(p.likes);
    setShares(p.shares);
    setComments(p.comments);
    setIsCoordinated(p.isCoordinated);
    setTagsInput(p.tags.join(', '));
    showToast(`Loaded Preset: "${p.title.slice(0, 32)}..."`);
  };

  const handleAddBatchPresets = () => {
    const newRecords: ManualIngestionRecord[] = presetTemplates.map((p, i) => ({
      ...p,
      id: `MAN-BATCH-${Date.now().toString().slice(-4)}-0${i + 1}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
    }));
    setRecords((prev) => [...prev, ...newRecords]);
    showToast(`Added ${newRecords.length} tactical intelligence scenarios!`);
  };

  const handleResetToDefault = () => {
    setRecords(initialManualRecords);
    showToast('Reset to 4 initial NTRO intelligence records');
  };

  // Submit new manual record
  const handleSubmitRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('⚠️ Please provide both Title and Observation Content');
      return;
    }

    const cleanTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newRecord: ManualIngestionRecord = {
      id: `MAN-26152-${Date.now().toString().slice(-5)}`,
      title: title.trim(),
      platform,
      author: author.trim() || 'Unknown Operator',
      sourceUrl: sourceUrl.trim() || undefined,
      content: content.trim(),
      language: language.trim() || 'English',
      emotion: selectedEmotion.name,
      emotionEmoji: selectedEmotion.emoji,
      emotionColor: selectedEmotion.color,
      threatLevel,
      views: Number(views) || 0,
      likes: Number(likes) || 0,
      shares: Number(shares) || 0,
      comments: Number(comments) || 0,
      isCoordinated,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      tags: cleanTags.length > 0 ? cleanTags : ['#ManualSignal'],
    };

    setRecords((prev) => [newRecord, ...prev]);

    // Reset Form Fields
    setTitle('');
    setContent('');
    setAuthor('');
    setSourceUrl('');
    setViews(10000);
    setLikes(500);
    setShares(150);
    setComments(50);
    setIsCoordinated(false);
    showToast(`✓ Intercept ${newRecord.id} successfully recorded!`);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast(`Observation ${id} removed`);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesSearch =
        rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPlatform = filterPlatform === 'ALL' || rec.platform === filterPlatform;
      const matchesThreat = filterThreat === 'ALL' || rec.threatLevel === filterThreat;

      return matchesSearch && matchesPlatform && matchesThreat;
    });
  }, [records, searchQuery, filterPlatform, filterThreat]);

  // Aggregate Metrics
  const summaryMetrics = useMemo(() => {
    const totalObs = records.length;
    const totalViews = records.reduce((acc, r) => acc + r.views, 0);
    const totalShares = records.reduce((acc, r) => acc + r.shares, 0);
    const totalInteractions = records.reduce((acc, r) => acc + r.likes + r.shares + r.comments, 0);
    const coordinatedCount = records.filter((r) => r.isCoordinated).length;
    const criticalCount = records.filter((r) => r.threatLevel === 'Critical').length;
    const highCount = records.filter((r) => r.threatLevel === 'High').length;

    return {
      totalObs,
      totalViews,
      totalShares,
      totalInteractions,
      coordinatedCount,
      coordinatedPct: totalObs > 0 ? Math.round((coordinatedCount / totalObs) * 100) : 0,
      criticalCount,
      highCount,
    };
  }, [records]);

  // Chart Data: Platform Distribution
  const platformChartData = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach((r) => {
      map[r.platform] = (map[r.platform] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
    }));
  }, [records]);

  // Chart Data: Emotion Breakdown
  const emotionChartData = useMemo(() => {
    const map: Record<string, { count: number; emoji: string; color: string }> = {};
    records.forEach((r) => {
      if (!map[r.emotion]) {
        map[r.emotion] = { count: 0, emoji: r.emotionEmoji, color: r.emotionColor };
      }
      map[r.emotion].count += 1;
    });
    return Object.entries(map).map(([name, val]) => ({
      name: `${val.emoji} ${name}`,
      count: val.count,
      color: val.color,
    }));
  }, [records]);

  // Chart Data: Threat Level Severity
  const threatChartData = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    records.forEach((r) => {
      counts[r.threatLevel] = (counts[r.threatLevel] || 0) + 1;
    });
    return [
      { level: 'Low', count: counts.Low, color: '#10b981' },
      { level: 'Medium', count: counts.Medium, color: '#f59e0b' },
      { level: 'High', count: counts.High, color: '#f97316' },
      { level: 'Critical', count: counts.Critical, color: '#f43f5e' },
    ];
  }, [records]);

  // Export as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sociointell_manual_dossier_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('✓ Intelligence JSON exported successfully');
  };

  // Export as CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Title',
      'Platform',
      'Author',
      'ThreatLevel',
      'Emotion',
      'Views',
      'Likes',
      'Shares',
      'Comments',
      'Coordinated',
      'Timestamp',
      'Tags',
      'Content',
    ];
    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.platform}"`,
      `"${r.author.replace(/"/g, '""')}"`,
      `"${r.threatLevel}"`,
      `"${r.emotionEmoji} ${r.emotion}"`,
      r.views,
      r.likes,
      r.shares,
      r.comments,
      r.isCoordinated ? 'YES' : 'NO',
      `"${r.timestamp}"`,
      `"${r.tags.join(' ')}"`,
      `"${r.content.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sociointell_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('✓ Intelligence CSV exported successfully');
  };

  // Copy Markdown Dossier to Clipboard
  const handleCopyMarkdown = () => {
    const md = `# NTRO SOCIOINTELL — MANUAL INTELLIGENCE DOSSIER
**Document Ref:** NTRO-PS-26152-DOSSIER
**Generated:** ${new Date().toLocaleString()}
**Security Classification:** TOP SECRET // CODEWORD SIH-26152 // NOFORN

---

## 1. EXECUTIVE SUMMARY & TELEMETRY
- **Total Manual Signals:** ${summaryMetrics.totalObs}
- **Aggregate Potential Reach:** ${(summaryMetrics.totalViews / 1000000).toFixed(2)}M
- **Total Engagement Interactions:** ${summaryMetrics.totalInteractions.toLocaleString()}
- **Coordinated Disinformation Clusters:** ${summaryMetrics.coordinatedCount} (${summaryMetrics.coordinatedPct}% of observations)
- **High / Critical Threats:** ${summaryMetrics.highCount + summaryMetrics.criticalCount}

---

## 2. INTERCEPTED OBSERVATIONS LEDGER
${records
  .map(
    (r, i) => `### ${i + 1}. [${r.id}] ${r.title}
- **Platform:** ${r.platform} | **Author:** ${r.author}
- **Threat Level:** ${r.threatLevel} | **Emotion:** ${r.emotionEmoji} ${r.emotion}
- **Telemetry:** Views: ${r.views.toLocaleString()} | Likes: ${r.likes.toLocaleString()} | Shares: ${r.shares.toLocaleString()}
- **Coordinated Flag:** ${r.isCoordinated ? '🚨 CONFIRMED BOT/COORDINATED' : 'Organic'}
- **Timestamp:** ${r.timestamp}
- **Tags:** ${r.tags.join(', ')}
- **Content:**
> "${r.content}"
`
  )
  .join('\n')}

---
*Generated autonomously via SocioIntell Tactical Analytics Command Engine.*
`;

    navigator.clipboard.writeText(md).then(() => {
      showToast('✓ Classified Markdown Brief copied to clipboard!');
    });
  };

  // Print / Save PDF
  const handlePrint = () => {
    window.print();
  };

  const getPlatformIcon = (p: string) => {
    switch (p) {
      case 'X':
        return <XLogo className="w-3.5 h-3.5" />;
      case 'Telegram':
        return <TelegramLogo className="w-3.5 h-3.5" />;
      case 'Instagram':
        return <InstagramLogo className="w-3.5 h-3.5" />;
      case 'Facebook':
        return <FacebookLogo className="w-3.5 h-3.5" />;
      case 'Reddit':
        return <RedditLogo className="w-3.5 h-3.5" />;
      case 'YouTube':
        return <YoutubeLogo className="w-3.5 h-3.5" />;
      default:
        return <Database className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-100 font-sans print:p-0 print:m-0 print:max-w-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-cyan-950/90 border border-cyan-400 text-cyan-200 font-mono text-xs shadow-2xl backdrop-blur-md animate-fade-in print:hidden">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Navigation Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-cyan-500/20 print:hidden">
        <div>
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-3 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>RETURN TO GLOBAL COMMAND CENTER</span>
          </button>
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white">
                MANUAL INTELLIGENCE INGESTION & REPORTING
              </h1>
              <p className="text-xs sm:text-sm font-mono text-slate-400 mt-0.5">
                NTRO SIH-26152 • Manual Observation Entry, Telemetry Aggregation & Automated Executive Dossiers
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
          <button
            onClick={() => setActiveTab('entry')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'entry'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>📥 Data Entry & Records</span>
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'dossier'
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-glow-violet'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📑 Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DATA ENTRY & TELEMETRY LOG                                       */}
      {/* ========================================================================= */}
      {activeTab === 'entry' && (
        <div className="space-y-8 animate-fade-in print:hidden">
          {/* Quick Scenario Launchpad / Action Bar */}
          <div className="p-4 rounded-xl glass-panel border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>TACTICAL TEST PRESETS:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleLoadPreset(0)}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 hover:bg-slate-700 text-rose-300 border border-rose-500/30 transition-all"
              >
                Preset 1: Phishing Attack
              </button>
              <button
                onClick={() => handleLoadPreset(1)}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 hover:bg-slate-700 text-blue-300 border border-blue-500/30 transition-all"
              >
                Preset 2: Semicon Hype
              </button>
              <button
                onClick={() => handleLoadPreset(2)}
                className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all"
              >
                Preset 3: Zero-Day CVE
              </button>
              <button
                onClick={handleAddBatchPresets}
                className="px-3 py-1 text-xs font-mono rounded bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 transition-all font-semibold"
              >
                + Inject 3 Sample Scenarios
              </button>
              <button
                onClick={handleResetToDefault}
                title="Reset to 4 base NTRO signals"
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Form + Real-time Ingestion Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form Column (Span 2) */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg bg-cyan-950/80 border-l border-b border-cyan-500/30 text-[10px] font-mono text-cyan-400">
                FIELD INGESTION NODE // 26152
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300">
                  New Intelligence Signal Entry
                </h2>
              </div>

              <form onSubmit={handleSubmitRecord} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    NARRATIVE HEADLINE / OBSERVATION TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Coordinated Deepfake Campaign on Power Grid Operations..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm font-sans"
                  />
                </div>

                {/* Platform & Threat Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      TARGET PLATFORM / SOURCE DOMAIN
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as Platform | 'DarkWeb' | 'Custom')}
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                    >
                      {PLATFORM_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      THREAT SEVERITY LEVEL
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {THREAT_LEVELS.map((t) => (
                        <button
                          key={t.level}
                          type="button"
                          onClick={() => setThreatLevel(t.level)}
                          className={`py-1.5 px-2 rounded-md text-xs font-mono font-semibold transition-all border ${
                            threatLevel === t.level
                              ? `${t.bg} ${t.color} ${t.border} ring-1 ring-cyan-400`
                              : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          {t.level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Author & Source URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      AUTHOR / CHANNEL / SEED HANDLE
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="@Channel_Handle or Anonymous"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      SOURCE URL / ARCHIVE LINK (OPTIONAL)
                    </label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    PRIMARY INTERCEPT LANGUAGE
                  </label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="e.g. English, Hindi, Hinglish, Punjabi, Bengali..."
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono text-slate-300">
                      INTERCEPT OBSERVATION & RAW CONTENT *
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">{content.length} characters</span>
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter intercepted transmission, viral post transcript, coordinated talking points, or field observation text..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-sans"
                  />
                </div>

                {/* Emotion Taxonomy 8 Vectors with Emojis */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    PRIMARY EMOTION VECTOR (8-DIMENSIONAL CLASSIFICATION)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {EMOTION_OPTIONS.map((e) => (
                      <button
                        key={e.name}
                        type="button"
                        onClick={() => setSelectedEmotion(e)}
                        className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-mono text-left transition-all border ${
                          selectedEmotion.name === e.name
                            ? 'bg-slate-800/95 border-cyan-400 text-white shadow-glow-cyan'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-lg">{e.emoji}</span>
                        <span className="truncate text-[11px]">{e.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engagement Telemetry Row */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    ENGAGEMENT TELEMETRY METRICS
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>Views</span>
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={views}
                        onChange={(e) => setViews(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full mt-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-pink-400" />
                        <span>Likes</span>
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={likes}
                        onChange={(e) => setLikes(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full mt-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                        <Share2 className="w-3 h-3 text-emerald-400" />
                        <span>Shares</span>
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={shares}
                        onChange={(e) => setShares(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full mt-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                        <MessageSquare className="w-3 h-3 text-violet-400" />
                        <span>Comments</span>
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={comments}
                        onChange={(e) => setComments(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full mt-1 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Coordinated Disinformation Checkbox & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      TAGS / ENTITIES (COMMA SEPARATED)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="#Deepfake, #CyberSec"
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200"
                    />
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-rose-950/30 border border-rose-500/30 cursor-pointer hover:bg-rose-950/50 transition-all">
                      <input
                        type="checkbox"
                        checked={isCoordinated}
                        onChange={(e) => setIsCoordinated(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 bg-slate-900 border-slate-700"
                      />
                      <div className="flex items-center space-x-1.5 text-xs font-mono text-rose-300 font-semibold">
                        <Bot className="w-4 h-4 text-rose-400" />
                        <span>Flag as Astroturfing / Coordinated Bot Burst</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-sm shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>INGEST OBSERVATION INTO LIVE TELEMETRY</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Ingestion Real-time Summary Cards Column */}
            <div className="space-y-4">
              <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    Manual Telemetry Pulse
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">Total Observations</div>
                      <div className="text-xl font-bold font-mono text-cyan-400">{summaryMetrics.totalObs}</div>
                    </div>
                    <Database className="w-6 h-6 text-cyan-400/40" />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">Total Combined Reach</div>
                      <div className="text-xl font-bold font-mono text-emerald-400">
                        {(summaryMetrics.totalViews / 1000000).toFixed(2)}M
                      </div>
                    </div>
                    <Eye className="w-6 h-6 text-emerald-400/40" />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">Coordinated Disinfo Clusters</div>
                      <div className="text-xl font-bold font-mono text-rose-400">
                        {summaryMetrics.coordinatedCount}{' '}
                        <span className="text-xs font-normal text-rose-300/80">({summaryMetrics.coordinatedPct}%)</span>
                      </div>
                    </div>
                    <Bot className="w-6 h-6 text-rose-400/40" />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">Critical / High Severity</div>
                      <div className="text-xl font-bold font-mono text-amber-400">
                        {summaryMetrics.criticalCount + summaryMetrics.highCount}
                      </div>
                    </div>
                    <AlertTriangle className="w-6 h-6 text-amber-400/40" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => setActiveTab('dossier')}
                    className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-violet-950/80 hover:bg-violet-900/80 border border-violet-500/40 text-violet-300 font-mono text-xs font-bold transition-all shadow-glow-violet"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Synthesize Executive Dossier →</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Emotion Donut */}
              <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20">
                <div className="text-xs font-mono font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>EMOTION SPECTRUM (MANUAL)</span>
                  <span className="text-[10px] text-pink-400">8 VECTORS</span>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={58}
                        paddingAngle={3}
                        dataKey="count"
                      >
                        {emotionChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#030712" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#071328',
                          borderColor: '#06b6d4',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                  {emotionChartData.slice(0, 4).map((e) => (
                    <span
                      key={e.name}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800"
                    >
                      {e.name}: {e.count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Interactive Graphs: Platform Distribution & Threat Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    Platform Distribution (Active Records)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Signals Count</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#071328',
                        borderColor: '#06b6d4',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                    Threat Severity Breakdown
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Signals Count</span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={threatChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="level" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#071328',
                        borderColor: '#f59e0b',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {threatChartData.map((entry, index) => (
                        <Cell key={`cell-threat-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Active Records Ledger & Data Table */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  Active Intelligence Observations Ledger ({filteredRecords.length})
                </h3>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search signals..."
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 w-36 sm:w-48"
                  />
                </div>

                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Platforms</option>
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <select
                  value={filterThreat}
                  onChange={(e) => setFilterThreat(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Threats</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Signals Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Signal ID</th>
                    <th className="py-2.5 px-3">Headline / Content</th>
                    <th className="py-2.5 px-3">Platform</th>
                    <th className="py-2.5 px-3">Author</th>
                    <th className="py-2.5 px-3">Emotion</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Reach</th>
                    <th className="py-2.5 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                        No manual observations match active filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => {
                      const threatStyle = THREAT_LEVELS.find((t) => t.level === r.threatLevel);
                      return (
                        <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 font-mono font-semibold text-cyan-300 whitespace-nowrap">
                            {r.id}
                            {r.isCoordinated && (
                              <span
                                title="Coordinated Astroturfing Detected"
                                className="ml-1.5 inline-block text-[10px] text-rose-400"
                              >
                                🚨
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 max-w-xs">
                            <div className="font-semibold text-white truncate">{r.title}</div>
                            <div className="text-[11px] text-slate-400 truncate">{r.content}</div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="flex items-center space-x-1 font-mono text-slate-300">
                              {getPlatformIcon(r.platform)}
                              <span>{r.platform}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">{r.author}</td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
                              style={{
                                color: r.emotionColor,
                                borderColor: `${r.emotionColor}50`,
                                backgroundColor: `${r.emotionColor}15`,
                              }}
                            >
                              {r.emotionEmoji} {r.emotion.split(' ')[0]}
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${threatStyle?.bg} ${threatStyle?.color} ${threatStyle?.border}`}
                            >
                              {r.threatLevel}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">
                            {r.views.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteRecord(r.id)}
                              title="Delete observation"
                              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: EXECUTIVE INTELLIGENCE DOSSIER (REPORT VIEW)                     */}
      {/* ========================================================================= */}
      {activeTab === 'dossier' && (
        <div className="space-y-8 animate-fade-in">
          {/* Action Toolbar for Export Suite */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-violet-500/30 print:hidden">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-violet-400" />
              <div>
                <span className="text-xs font-mono font-bold text-white uppercase">
                  CLASSIFIED INTELLIGENCE DOSSIER READY
                </span>
                <p className="text-[10px] font-mono text-slate-400">
                  Synthesized from {records.length} authenticated field intercepts
                </p>
              </div>
            </div>

            {/* Export Actions Suite */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-glow-cyan"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-violet-300 border border-violet-500/40 font-mono text-xs font-bold transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Markdown Brief</span>
              </button>
            </div>
          </div>

          {/* Printable Classified Dossier Document */}
          <div className="p-8 sm:p-12 rounded-2xl bg-[#071328] border-2 border-slate-700 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-2 print:bg-white print:text-black">
            {/* Classified Watermark */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-800/20 font-black text-6xl sm:text-8xl tracking-widest pointer-events-none rotate-12 uppercase select-none print:hidden">
              CLASSIFIED // NTRO
            </div>

            {/* Official Classified Header */}
            <div className="border-b-2 border-slate-600 pb-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 font-mono font-black text-xl shadow-glow-cyan print:border-black print:text-black">
                    SI
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 print:text-slate-800">
                      NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO)
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide print:text-black">
                      SOCIOINTELL TACTICAL DISPATCH & THREAT ASSESSMENT
                    </h2>
                    <div className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                      SMART INDIA HACKATHON 2026 • PROBLEM ID 26152 • AUTONOMOUS INCIDENT BRIEFING
                    </div>
                  </div>
                </div>

                {/* Security Tag */}
                <div className="text-right font-mono text-xs space-y-1">
                  <div className="inline-block px-3 py-1 rounded bg-rose-950/80 border border-rose-500 text-rose-300 font-bold tracking-wider print:border-black print:text-black print:bg-slate-200">
                    TOP SECRET // CODEWORD NOFORN
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-slate-600">
                    DISPATCH REF: NTRO-SIH-{Date.now().toString().slice(-6)}
                  </div>
                  <div className="text-[10px] text-emerald-400 print:text-slate-700">
                    GENERATED: {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Automated Intelligence Synthesis */}
            <div className="mb-8 p-6 rounded-xl bg-slate-900/80 border border-cyan-500/30 print:bg-slate-50 print:border-slate-300 print:text-black">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2 print:text-black">
                <Sparkles className="w-4 h-4" />
                <span>Executive Intelligence Narrative Synthesis</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-200 font-sans print:text-black">
                This dossier compiles <strong className="text-white print:text-black">{records.length} active multi-source observations</strong>.
                Aggregated audience reach stands at{' '}
                <strong className="text-cyan-300 print:text-black">{(summaryMetrics.totalViews / 1000000).toFixed(2)}M potential impressions</strong>{' '}
                with <strong className="text-emerald-300 print:text-black">{summaryMetrics.totalInteractions.toLocaleString()} authenticated interactions</strong>.
                {summaryMetrics.coordinatedCount > 0 ? (
                  <span>
                    {' '}Critical security threat is active: <strong className="text-rose-400 print:text-black">{summaryMetrics.coordinatedCount} signals ({summaryMetrics.coordinatedPct}%)</strong> exhibit signatures of synchronized astroturfing and coordinated bot-cluster dissemination.
                  </span>
                ) : (
                  <span> Disinformation vectors currently remain within organic dispersion baselines.</span>
                )}
              </p>

              {/* Threat Matrix Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 print:border-slate-300">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 print:text-slate-600 uppercase">Primary Vector</span>
                  <div className="text-sm font-bold font-mono text-white print:text-black">
                    {emotionChartData[0]?.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 print:text-slate-600 uppercase">Top Ingestion Platform</span>
                  <div className="text-sm font-bold font-mono text-cyan-300 print:text-black">
                    {platformChartData[0]?.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 print:text-slate-600 uppercase">High/Critical Severity</span>
                  <div className="text-sm font-bold font-mono text-rose-400 print:text-black">
                    {summaryMetrics.criticalCount + summaryMetrics.highCount} Signals
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 print:text-slate-600 uppercase">Response Directive</span>
                  <div className="text-sm font-bold font-mono text-emerald-400 print:text-black">
                    Containment & Counter-Narrative
                  </div>
                </div>
              </div>
            </div>

            {/* Dossier Observations Ledger */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:border-slate-300">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider print:text-black">
                  Intercepted Case Files & Evidence Ledger ({records.length})
                </h3>
                <span className="text-xs font-mono text-slate-400 print:text-slate-600">NTRO PS-26152 ARCHIVE</span>
              </div>

              <div className="space-y-4">
                {records.map((r, idx) => {
                  const threatStyle = THREAT_LEVELS.find((t) => t.level === r.threatLevel);
                  return (
                    <div
                      key={r.id}
                      className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 print:border-slate-300 print:bg-white print:text-black"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-cyan-400 print:text-black">
                            #{idx + 1} • {r.id}
                          </span>
                          <span className="text-xs text-slate-500 print:text-slate-400">|</span>
                          <span className="flex items-center space-x-1 text-xs font-mono text-slate-300 print:text-black">
                            {getPlatformIcon(r.platform)}
                            <span>{r.platform}</span>
                          </span>
                          <span className="text-xs text-slate-500 print:text-slate-400">|</span>
                          <span className="text-xs font-mono text-slate-400 print:text-black">{r.author}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono border"
                            style={{
                              color: r.emotionColor,
                              borderColor: `${r.emotionColor}50`,
                              backgroundColor: `${r.emotionColor}15`,
                            }}
                          >
                            {r.emotionEmoji} {r.emotion}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${threatStyle?.bg} ${threatStyle?.color} ${threatStyle?.border}`}
                          >
                            {r.threatLevel} Threat
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-white print:text-black">{r.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans italic print:text-black">
                          "{r.content}"
                        </p>
                      </div>

                      {/* Case File Footer Telemetry */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 print:border-slate-200 print:text-slate-600">
                        <div className="flex items-center space-x-4">
                          <span>
                            Views: <strong className="text-slate-200 print:text-black">{r.views.toLocaleString()}</strong>
                          </span>
                          <span>
                            Shares: <strong className="text-slate-200 print:text-black">{r.shares.toLocaleString()}</strong>
                          </span>
                          <span>
                            Comments: <strong className="text-slate-200 print:text-black">{r.comments.toLocaleString()}</strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          {r.isCoordinated ? (
                            <span className="text-rose-400 font-bold flex items-center space-x-1 print:text-black">
                              <span>🚨 COORDINATED BOT CLUSTER</span>
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-semibold print:text-black">✓ ORGANIC DIFFUSION</span>
                          )}
                          <span>•</span>
                          <span>{r.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Authentication Footer */}
            <div className="mt-12 pt-6 border-t-2 border-slate-700 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 print:text-slate-600 print:border-slate-400">
              <div>
                CONFIDENTIAL DISPATCH // FOR OFFICIAL NTRO DEFENSE INTELLIGENCE USE ONLY
              </div>
              <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                <span>AUTHENTICATED BY:</span>
                <strong className="text-cyan-400 print:text-black">SOCIOINTELL CRYPTO-ENGINE</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

