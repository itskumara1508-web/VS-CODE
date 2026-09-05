import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Users,
  MessageSquare,
  Eye,
  Send,
  Radio,
  LayoutGrid,
  Activity,
} from 'lucide-react';
import { Platform } from '../types';
import { getPlatformTelemetry, TimeRange } from '../data/platformTelemetryData';

interface PlatformGraphsProps {
  platform: Platform;
  brandColor: string;
}

export const PlatformGraphs: React.FC<PlatformGraphsProps> = ({
  platform,
  brandColor,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'comments' | 'views' | 'posting' | 'emotions'>('all');

  const data = getPlatformTelemetry(platform, timeRange);

  // Formatting helpers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg bg-[#070d1e]/95 border border-cyan-500/40 shadow-2xl font-mono text-xs space-y-1 backdrop-blur-md">
          <p className="text-cyan-400 font-bold text-[11px] pb-1 border-b border-slate-800">
            TIMESTAMP: {label} ({timeRange})
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-3 text-[11px]">
              <span style={{ color: entry.color || brandColor }} className="font-medium">
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                {typeof entry.value === 'number'
                  ? entry.unit === '%'
                    ? `${entry.value}%`
                    : formatNumber(entry.value)
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // 1. Graph: Live People
  const renderLivePeopleChart = (height = 280) => (
    <div className="w-full glass-panel rounded-xl p-5 border border-cyan-500/20 relative space-y-3 card-tilt-3d laser-sweep transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 animate-float-slow">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <span>Graph 1: Live People / Active Audience</span>
              <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE</span>
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Concurrent active users & online listeners on {platform}
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-500 block uppercase">Peak Live:</span>
          <span className="text-sm font-bold text-cyan-300">
            {formatNumber(Math.max(...data.map((d) => d.livePeople)))} online
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="peopleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={brandColor} stopOpacity={0.45} />
                <stop offset="95%" stopColor={brandColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} tickFormatter={formatNumber} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="livePeople"
              name="Active People"
              stroke={brandColor}
              strokeWidth={2.5}
              fill="url(#peopleGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // 2. Graph: Comments
  const renderCommentsChart = (height = 280) => (
    <div className="w-full glass-panel rounded-xl p-5 border border-cyan-500/20 relative space-y-3 card-tilt-3d laser-sweep transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 animate-float-slow">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <span>Graph 2: Comments & Discussion Volume</span>
              <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>THREADS</span>
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Total replies, direct thread feedback, and user discussion count
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-500 block uppercase">Total Volume:</span>
          <span className="text-sm font-bold text-emerald-400">
            {formatNumber(data.reduce((acc, curr) => acc + curr.comments, 0))} comments
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} tickFormatter={formatNumber} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="comments"
              name="Comments & Replies"
              fill={brandColor}
              radius={[4, 4, 0, 0]}
              opacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // 3. Graph: Views
  const renderViewsChart = (height = 280) => (
    <div className="w-full glass-panel rounded-xl p-5 border border-cyan-500/20 relative space-y-3 card-tilt-3d laser-sweep transition-all duration-300 hover:border-violet-400/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 animate-float-slow">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <span>Graph 3: Views, Impressions & Reach</span>
              <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-500/40 text-[9px] text-violet-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
                <span>IMPRINTS</span>
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Aggregated exposure trajectories & broadcast reads
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-500 block uppercase">Peak Reach:</span>
          <span className="text-sm font-bold text-violet-300">
            {formatNumber(Math.max(...data.map((d) => d.views)))} views
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} tickFormatter={formatNumber} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="views"
              name="Views & Imprints"
              stroke="#a78bfa"
              strokeWidth={2.5}
              fill="url(#viewsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // 4. Graph: Posting Frequency
  const renderPostingChart = (height = 280) => (
    <div className="w-full glass-panel rounded-xl p-5 border border-cyan-500/20 relative space-y-3 card-tilt-3d laser-sweep transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 animate-float-slow">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <span>Graph 4: Posting Frequency & Ingestion Rate</span>
              <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-[9px] text-amber-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>BURST</span>
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">
              Posts, reels, or video broadcasts published per interval
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] text-slate-500 block uppercase">Surge Rate:</span>
          <span className="text-sm font-bold text-amber-400">
            +{formatNumber(Math.max(...data.map((d) => d.postingRate)))}/unit
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} tickFormatter={formatNumber} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="postingRate"
              name="Posts Published"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // 5. Graph: Emotional Breakdown
  const renderEmotionsChart = (height = 280) => {
    const emotionLines = [
      { key: 'supportive', name: 'Supportive', color: '#10b981' },
      { key: 'excitement', name: 'Excitement', color: '#00f0ff' },
      { key: 'neutral', name: 'Neutral', color: '#94a3b8' },
      { key: 'anxiety', name: 'Anxiety', color: '#f59e0b' },
      { key: 'against', name: 'Against / Cynical', color: '#ef4444' },
    ];

    return (
      <div className="w-full glass-panel rounded-xl p-5 border border-cyan-500/20 relative space-y-3 card-tilt-3d laser-sweep transition-all duration-300 hover:border-rose-400/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.2)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 animate-float-slow">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
                <span>Graph 5: Emotional Breakdown & Multi-Vector Sentiment</span>
                <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[9px] text-rose-300 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  <span>5-VECTORS</span>
                </span>
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">
                5 distinct NLP emotional sentiment vectors tracked across {platform}
              </p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 block uppercase">Dominant Sentiment:</span>
            <span className="text-sm font-bold text-emerald-400">Supportive / Net Positive</span>
          </div>
        </div>

        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '8px' }} />
              {emotionLines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    );
  };

  const tabs = [
    { id: 'all', label: '✦ All 5 Graphs Grid', icon: LayoutGrid },
    { id: 'people', label: '1. Live People', icon: Users },
    { id: 'comments', label: '2. Comments', icon: MessageSquare },
    { id: 'views', label: '3. Views & Reach', icon: Eye },
    { id: 'posting', label: '4. Posting Rate', icon: Send },
    { id: 'emotions', label: '5. Emotional', icon: Radio },
  ];

  return (
    <div className="space-y-5">
      {/* Analytics Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl glass-panel border border-slate-800">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider">
            {platform} Multi-Dimensional Telemetry Graphs
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold hidden sm:inline-block">
            5 MODULES ACTIVE
          </span>
        </div>

        {/* Filters and View Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono rounded-md transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{tab.label}</span>
                  <span className="xl:hidden">{tab.id === 'all' ? 'All' : tab.label.split('.')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Time Range Switcher */}
          <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
            {(['24H', '7D', '30D'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded transition-all ${
                  timeRange === r
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Render Chart Content Based on View Mode */}
      {activeTab === 'all' ? (
        <div className="space-y-6">
          {/* Top Row: Live People & Comments side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {renderLivePeopleChart(280)}
            {renderCommentsChart(280)}
          </div>

          {/* Middle Row: Views & Posting Rate side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {renderViewsChart(280)}
            {renderPostingChart(280)}
          </div>

          {/* Bottom Row: Full-width Emotional Breakdown */}
          {renderEmotionsChart(320)}
        </div>
      ) : (
        <div className="w-full">
          {activeTab === 'people' && renderLivePeopleChart(380)}
          {activeTab === 'comments' && renderCommentsChart(380)}
          {activeTab === 'views' && renderViewsChart(380)}
          {activeTab === 'posting' && renderPostingChart(380)}
          {activeTab === 'emotions' && renderEmotionsChart(380)}
        </div>
      )}
    </div>
  );
};
