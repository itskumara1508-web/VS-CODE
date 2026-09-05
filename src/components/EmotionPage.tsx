import React, { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  Sparkles,
  Activity,
  Zap,
  TrendingUp,
  Shield,
  Radio,
  Send,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { Platform } from '../types';
import {
  emotionVectors,
  emotionRadarData,
  emotionTimeline24H,
  emotionTimeline7D,
  emotionTimeline30D,
  platformEmotionComparison,
  emotionViralityIndex,
  sampleEmotionInputs,
  SampleEmotionInput,
} from '../data/emotionTelemetryData';
import {
  XLogo,
  TelegramLogo,
  InstagramLogo,
  FacebookLogo,
  RedditLogo,
  YoutubeLogo,
} from './PlatformLogos';

interface EmotionPageProps {
  onBackToDashboard: () => void;
  onSelectPlatform: (platform: Platform) => void;
}

export const EmotionPage: React.FC<EmotionPageProps> = ({
  onBackToDashboard,
  onSelectPlatform,
}) => {
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D'>('24H');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [activeClassifierResult, setActiveClassifierResult] = useState<SampleEmotionInput>(sampleEmotionInputs[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const platformList: { name: Platform; logo: React.ReactNode; color: string }[] = [
    { name: 'X', logo: <XLogo className="w-3.5 h-3.5" />, color: 'text-sky-400' },
    { name: 'Telegram', logo: <TelegramLogo className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
    { name: 'Instagram', logo: <InstagramLogo className="w-3.5 h-3.5" />, color: 'text-pink-400' },
    { name: 'Facebook', logo: <FacebookLogo className="w-3.5 h-3.5" />, color: 'text-blue-400' },
    { name: 'Reddit', logo: <RedditLogo className="w-3.5 h-3.5" />, color: 'text-orange-400' },
    { name: 'YouTube', logo: <YoutubeLogo className="w-3.5 h-3.5" />, color: 'text-red-400' },
  ];

  const timelineData =
    timeRange === '24H'
      ? emotionTimeline24H
      : timeRange === '7D'
      ? emotionTimeline7D
      : emotionTimeline30D;

  // Custom Tooltip for Timeline with Emojis
  const CustomTimelineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3.5 rounded-xl bg-[#070d1e]/95 border border-cyan-500/40 shadow-2xl font-mono text-xs space-y-1.5 backdrop-blur-md">
          <p className="text-cyan-400 font-bold text-xs pb-1 border-b border-slate-800">
            TIMESTAMP: {label} ({timeRange})
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300">{entry.name}:</span>
                <span className="font-bold text-white ml-auto">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Polar Axis Tick with Emoji
  const renderCustomPolarTick = ({ payload, x, y, textAnchor }: any) => {
    const item = emotionRadarData.find((d) => d.subject === payload.value);
    const emoji = item?.emoji || '';
    return (
      <text
        x={x}
        y={y}
        textAnchor={textAnchor}
        fill="#94a3b8"
        fontSize={12}
        fontFamily="JetBrains Mono"
      >
        <tspan dy="-2">{emoji} </tspan>
        <tspan fill="#f1f5f9" fontWeight="bold">
          {payload.value}
        </tspan>
      </text>
    );
  };

  // Handle live custom text classification simulation
  const handleClassifyCustom = () => {
    if (!customText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const lower = customText.toLowerCase();
      let dominant = 'Support & Trust';
      let emoji = '🤝';
      let sarcasm = 5;
      let sentiment: 'Positive' | 'Neutral' | 'Negative' = 'Positive';
      let confidence = 94;
      let explanation = 'Text demonstrates positive alignment and civic reinforcement keywords.';

      if (lower.includes('kya baat') || lower.includes('genius move') || lower.includes('waah') || lower.includes('🙄') || lower.includes('surely')) {
        dominant = 'Sarcasm & Cynicism';
        emoji = '🎭';
        sarcasm = 88;
        sentiment = 'Negative';
        confidence = 92;
        explanation = 'Surface complimentary phrase inverted by cynical phrasing or sarcastic hyperbole.';
      } else if (lower.includes('wow') || lower.includes('proud') || lower.includes('bharat') || lower.includes('super') || lower.includes('🚀') || lower.includes('revolution')) {
        dominant = 'Excitement & Euphoria';
        emoji = '🤩';
        sarcasm = 4;
        sentiment = 'Positive';
        confidence = 97;
        explanation = 'Strong enthusiastic lexical markers and positive exclamation density.';
      } else if (lower.includes('worry') || lower.includes('risk') || lower.includes('concern') || lower.includes('danger') || lower.includes('threat')) {
        dominant = 'Anxiety & Caution';
        emoji = '😰';
        sarcasm = 8;
        sentiment = 'Negative';
        confidence = 89;
        explanation = 'Presence of apprehensive sentiment keywords regarding safety or regulations.';
      } else if (lower.includes('bad') || lower.includes('fail') || lower.includes('scam') || lower.includes('shame') || lower.includes('angry')) {
        dominant = 'Outrage & Hostility';
        emoji = '😡';
        sarcasm = 12;
        sentiment = 'Negative';
        confidence = 95;
        explanation = 'High affective hostility markers expressing severe dissatisfaction.';
      } else if (lower.includes('data') || lower.includes('report') || lower.includes('official') || lower.includes('update')) {
        dominant = 'Objective Neutrality';
        emoji = '😐';
        sarcasm = 1;
        sentiment = 'Neutral';
        confidence = 98;
        explanation = 'Factual informative tone devoid of subjective sentiment bias.';
      }

      setActiveClassifierResult({
        text: customText,
        language: 'Auto-Detected',
        dominantEmotion: dominant,
        emoji: emoji,
        sarcasmScore: sarcasm,
        sentimentType: sentiment,
        confidence: confidence,
        explanation: explanation,
      });

      setIsAnalyzing(false);
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f0926] via-[#050818] to-[#030712] text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Top Navigation & Platform Switcher Bar */}
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
              Platform Views:
            </span>
            {platformList.map((p) => (
              <button
                key={p.name}
                onClick={() => onSelectPlatform(p.name)}
                className="flex items-center space-x-1.5 px-3 py-1 text-xs font-mono rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <span>{p.logo}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Hero Emotional Command Banner */}
        <div className="relative rounded-2xl glass-panel-glow p-6 sm:p-8 border border-pink-500/30 shadow-[0_0_35px_rgba(236,72,153,0.15)] overflow-hidden laser-sweep">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 bg-gradient-to-bl from-pink-500 via-purple-600 to-cyan-400" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40">
                  🎭 NTRO PSYCHO-COGNITIVE TELEMETRY • PS 26152
                </span>
                <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>8 EMOTION VECTORS ACTIVE</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Emotional Intelligence & Sentiment Vector Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Continuous real-time multi-dimensional emotion decoding across 6 major social platforms.
                Tracks affective valence, sarcasm innuendos, public trust index, and viral emotional contagion across regional and English streams.
              </p>
            </div>

            {/* Composite National Mood Gauge */}
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/80 border border-pink-500/40 shrink-0 card-tilt-3d shadow-glow-cyan">
              <div className="text-4xl sm:text-5xl animate-float-slow select-none">
                ❤️‍🔥
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  National Sentiment Index:
                </span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    75.8<span className="text-sm text-slate-400">/100</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +4.2%
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-semibold block">
                  HIGH RESILIENCE • NET POSITIVE
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Dominant Emotion:</span>
              <strong className="text-white text-sm flex items-center space-x-1">
                <span>🤝</span>
                <span>Support & Trust (32%)</span>
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Fastest Surge:</span>
              <strong className="text-cyan-300 text-sm flex items-center space-x-1">
                <span>🤩</span>
                <span>Excitement (+16.4%)</span>
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Sarcasm Index:</span>
              <strong className="text-pink-400 text-sm flex items-center space-x-1">
                <span>🎭</span>
                <span>2.4% (Normal bounds)</span>
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Outrage Containment:</span>
              <strong className="text-emerald-400 text-sm flex items-center space-x-1">
                <span>🛡️</span>
                <span>96.0% Peaceful</span>
              </strong>
            </div>
          </div>
        </div>

        {/* 3. Eight Interactive Emotion Cards with Emojis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Real-Time 8-Dimension Emotion Vectors (Click to Inspect)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              UPDATED LIVE EVERY 2.5s
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {emotionVectors.map((em) => {
              const isSelected = selectedEmotion === em.id;
              return (
                <button
                  key={em.id}
                  onClick={() => setSelectedEmotion(isSelected ? null : em.id)}
                  className={`p-3.5 rounded-xl glass-panel text-left border transition-all duration-300 card-tilt-3d relative overflow-hidden group ${
                    isSelected
                      ? 'border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.35)] bg-slate-900/90'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">
                      {em.emoji}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      {em.change}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-white font-mono truncate">
                      {em.name.split('&')[0]}
                    </h4>
                    <div className="flex items-baseline justify-between font-mono">
                      <span className="text-base sm:text-lg font-extrabold text-white">
                        {em.share}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PULSE: {em.intensity}
                      </span>
                    </div>
                  </div>

                  {/* Intensity mini-bar */}
                  <div className="w-full h-1 rounded-full bg-slate-800 mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${em.intensity}%`, backgroundColor: em.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Main Two Primary Graphs: Emoji Radar & Multi-Vector Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Graph 1: 8-Dimension Emoji Radar Spider Chart (5 Cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/20 flex flex-col justify-between card-tilt-3d laser-sweep">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 animate-float-slow">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-1.5">
                    <span>Graph 1: Emotional Radar (Polar Mesh)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    8 Emotion Vectors vs Historical 30D Baseline
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold">
                LOCKED
              </span>
            </div>

            {/* Radar Spider Container */}
            <div className="w-full h-72 sm:h-80 my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={emotionRadarData}>
                  <PolarGrid stroke="rgba(56, 189, 248, 0.15)" />
                  <PolarAngleAxis dataKey="subject" tick={renderCustomPolarTick} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                  <Radar
                    name="Current Ingestion (24H)"
                    dataKey="current"
                    stroke="#00f0ff"
                    fill="#00f0ff"
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />
                  <Radar
                    name="30D Baseline"
                    dataKey="baseline"
                    stroke="#ec4899"
                    fill="#ec4899"
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: '11px',
                      fontFamily: 'JetBrains Mono',
                      paddingTop: '8px',
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(7, 13, 30, 0.95)',
                      borderColor: 'rgba(0, 240, 255, 0.4)',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Dominant Axis: <strong className="text-cyan-300">🤩 Excitement (92/100)</strong></span>
              <span>Baseline Divergence: <strong className="text-emerald-400">+24 pts</strong></span>
            </div>
          </div>

          {/* Graph 2: Multi-Vector Emotional Timeline (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/20 space-y-4 card-tilt-3d laser-sweep">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 animate-float-slow">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                    <span>Graph 2: Real-Time Multi-Vector Emotion Timeline</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Temporal evolution of emotional sentiment across monitored channels
                  </p>
                </div>
              </div>

              {/* Time Range Switcher */}
              <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
                {(['24H', '7D', '30D'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 rounded transition-all ${
                      timeRange === r
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-glow-cyan'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Area Spline */}
            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="emExcitement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="emSupport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="emHope" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} unit="%" />
                  <Tooltip content={<CustomTimelineTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="supportive"
                    name="🤝 Support"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#emSupport)"
                  />
                  <Area
                    type="monotone"
                    dataKey="excitement"
                    name="🤩 Excitement"
                    stroke="#00f0ff"
                    strokeWidth={2}
                    fill="url(#emExcitement)"
                  />
                  <Area
                    type="monotone"
                    dataKey="hope"
                    name="💖 Hope"
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                    fill="url(#emHope)"
                  />
                  <Area
                    type="monotone"
                    dataKey="anxiety"
                    name="😰 Anxiety"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="outrage"
                    name="😡 Outrage"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    fill="transparent"
                  />
                  <Area
                    type="monotone"
                    dataKey="sarcasm"
                    name="🎭 Sarcasm"
                    stroke="#ec4899"
                    strokeWidth={1.5}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro Legend & Summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                  <span>🤝 Supportive: 32%</span>
                </span>
                <span className="flex items-center space-x-1 text-cyan-400 font-bold">
                  <span>🤩 Excitement: 28%</span>
                </span>
                <span className="flex items-center space-x-1 text-blue-400 font-bold">
                  <span>💖 Hope: 14%</span>
                </span>
                <span className="flex items-center space-x-1 text-amber-400 font-bold">
                  <span>😰 Anxiety: 6%</span>
                </span>
                <span className="flex items-center space-x-1 text-rose-400 font-bold">
                  <span>😡 Outrage: 4%</span>
                </span>
              </div>
              <span className="text-cyan-300 font-semibold">
                Composite Mood: 75.8/100
              </span>
            </div>
          </div>
        </div>

        {/* 5. Second Row: Platform Emotion Comparison & Virality Multiplier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Graph 3: Cross-Platform Emotion Distribution Matrix (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/20 space-y-4 card-tilt-3d laser-sweep">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 animate-float-slow">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                    <span>Graph 3: Platform Emotion Distribution Matrix</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Affective composition benchmarked across X, Telegram, Instagram, Facebook, Reddit & YouTube
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                CROSS-CHANNEL
              </span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformEmotionComparison} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
                  <XAxis dataKey="platform" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(7, 13, 30, 0.95)',
                      borderColor: 'rgba(0, 240, 255, 0.4)',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '6px' }} />
                  <Bar dataKey="excitement" name="🤩 Excitement" stackId="a" fill="#00f0ff" />
                  <Bar dataKey="supportive" name="🤝 Support" stackId="a" fill="#10b981" />
                  <Bar dataKey="hope" name="💖 Hope" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="neutral" name="😐 Neutral" stackId="a" fill="#94a3b8" />
                  <Bar dataKey="anxiety" name="😰 Anxiety" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="outrage" name="😡 Outrage" stackId="a" fill="#ef4444" />
                  <Bar dataKey="sarcasm" name="🎭 Sarcasm" stackId="a" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">HIGHEST EXCITEMENT 🤩:</span>
                <strong className="text-pink-400">Instagram (42%)</strong>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">HIGHEST TRUST 🤝:</span>
                <strong className="text-cyan-400">Telegram (42%)</strong>
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">HIGHEST SARCASM 🎭:</span>
                <strong className="text-orange-400">Reddit (10%)</strong>
              </div>
            </div>
          </div>

          {/* Graph 4: Emotion Virality Multiplier (5 Cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/20 space-y-4 card-tilt-3d laser-sweep">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 animate-float-slow">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    Graph 4: Emotion Virality Multiplier
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Relative dissemination velocity & engagement acceleration
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
                MULTIPLIER
              </span>
            </div>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionViralityIndex} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" unit="x" />
                  <YAxis
                    type="category"
                    dataKey="emotion"
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="JetBrains Mono"
                    tick={({ x, y, payload }) => {
                      const item = emotionViralityIndex.find((i) => i.emotion === payload.value);
                      return (
                        <text x={x - 6} y={y + 4} textAnchor="end" fill="#f1f5f9" fontSize={11} fontFamily="JetBrains Mono">
                          {item?.emoji} {payload.value}
                        </text>
                      );
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(7, 13, 30, 0.95)',
                      borderColor: 'rgba(0, 240, 255, 0.4)',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                    }}
                    formatter={(val: number) => [`${val}x Velocity Multiplier`, 'Amplification']}
                  />
                  <Bar dataKey="multiplier" name="Virality Multiplier" radius={[0, 4, 4, 0]}>
                    {emotionViralityIndex.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-[11px] font-mono text-amber-200">
              ⚡ <strong>Key Finding:</strong> Content driven by <strong>Excitement 🤩 (4.8x)</strong> and <strong>Outrage 😡 (4.2x)</strong> exhibits 300% faster dissemination half-life than factual neutrality.
            </div>
          </div>
        </div>

        {/* 6. Third Row: Graph 5 (Donut Wheel) + Interactive Live NLP Emotion & Sarcasm Classifier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Graph 5: Interactive Donut Wheel (4 Cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/20 space-y-4 card-tilt-3d laser-sweep">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    Graph 5: Emotion Share Donut Wheel
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    8 Emotion Classes Proportional Distribution
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold">
                100% DISCOURSE
              </span>
            </div>

            <div className="relative w-full h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionVectors}
                    dataKey="share"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {emotionVectors.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={entry.color}
                        stroke="#030712"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(7, 13, 30, 0.95)',
                      borderColor: 'rgba(0, 240, 255, 0.4)',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                    }}
                    formatter={(val: number, name: string) => {
                      const item = emotionVectors.find((v) => v.name === name);
                      return [`${val}%`, `${item?.emoji || ''} ${name}`];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Score Badge */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl select-none">🤝</span>
                <span className="text-lg font-bold font-mono text-white">32%</span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">
                  TRUST LEAD
                </span>
              </div>
            </div>

            {/* Quick Emoji Breakdown List */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {emotionVectors.map((v) => (
                <div key={v.id} className="flex items-center space-x-2 p-1.5 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-base select-none">{v.emoji}</span>
                  <span className="text-slate-300 truncate text-[11px]">{v.name.split('&')[0]}</span>
                  <span className="text-white font-bold ml-auto">{v.share}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live NLP Emotion & Sarcasm Classifier (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-5 sm:p-6 border border-pink-500/30 space-y-4 card-tilt-3d laser-sweep">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 animate-float-slow">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                    <span>Live AI Emotion & Sarcasm Classification Testbed</span>
                    <span className="px-1.5 py-0.5 rounded bg-pink-950/80 border border-pink-500/40 text-[9px] text-pink-300 font-bold">
                      MULTILINGUAL NLP
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Evaluate raw text in English, Hindi, or Hinglish to detect hidden sarcasm and primary emotion vectors
                  </p>
                </div>
              </div>
            </div>

            {/* Presets Selection Pill Strip */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Select Pre-Analyzed Tactical Test Scenarios:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleEmotionInputs.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomText(sample.text);
                      setActiveClassifierResult(sample);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center space-x-1 ${
                      activeClassifierResult.text === sample.text
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold shadow-glow-cyan'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{sample.emoji}</span>
                    <span>{sample.dominantEmotion.split('&')[0]}</span>
                    <span className="text-[10px] text-slate-500">({sample.language})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Field */}
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Type or paste any post/comment to classify in real-time (e.g. 'Wah kya baat hai, aisi security pehle kabhi nahi dekhi 🙄')..."
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-pink-400 transition-all placeholder:text-slate-600"
                />
                <button
                  onClick={handleClassifyCustom}
                  disabled={isAnalyzing || !customText.trim()}
                  className={`absolute bottom-3 right-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-mono text-xs font-bold shadow-lg transition-all ${
                    isAnalyzing ? 'opacity-50 cursor-wait' : ''
                  }`}
                >
                  <Send className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>Run NLP Inference</span>
                </button>
              </div>
            </div>

            {/* Inference Result Card */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-[11px]">
                <span className="text-slate-400">
                  INFERENCE CONFIDENCE: <strong className="text-emerald-400">{activeClassifierResult.confidence}%</strong>
                </span>
                <span className="text-slate-400">
                  LANGUAGE: <strong className="text-cyan-300">{activeClassifierResult.language}</strong>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="text-slate-400">POLARITY:</span>
                  <span
                    className={`font-bold ${
                      activeClassifierResult.sentimentType === 'Positive'
                        ? 'text-emerald-400'
                        : activeClassifierResult.sentimentType === 'Negative'
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {activeClassifierResult.sentimentType.toUpperCase()}
                  </span>
                </span>
              </div>

              {/* Dominant Emotion & Sarcasm Index */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center space-x-3">
                  <span className="text-3xl sm:text-4xl select-none animate-float-slow">
                    {activeClassifierResult.emoji}
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Primary Classified Emotion:
                    </span>
                    <strong className="text-white text-sm">
                      {activeClassifierResult.dominantEmotion}
                    </strong>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-pink-400" />
                      <span>Sarcasm / Irony Nuance:</span>
                    </span>
                    <strong
                      className={`text-xs ${
                        activeClassifierResult.sarcasmScore > 50 ? 'text-pink-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {activeClassifierResult.sarcasmScore}%
                    </strong>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        activeClassifierResult.sarcasmScore > 50
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${activeClassifierResult.sarcasmScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {activeClassifierResult.sarcasmScore > 50
                      ? '⚠️ Inverted Sentiment: Sarcastic dissent detected'
                      : '✓ Literal Expression: Direct valence'}
                  </span>
                </div>
              </div>

              {/* Linguistic Explanation */}
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200">
                💡 <strong>Linguistic Rationale:</strong> {activeClassifierResult.explanation}
              </div>
            </div>
          </div>
        </div>

        {/* 7. NTRO Intelligence Directive Notice */}
        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Emotional telemetry processed under NTRO SIH-26152 zero-PII privacy architecture. Emojis and affective vectors are aggregated in memory with differential privacy safeguards.
            </span>
          </div>
          <button
            onClick={onBackToDashboard}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs shrink-0 transition-all"
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
