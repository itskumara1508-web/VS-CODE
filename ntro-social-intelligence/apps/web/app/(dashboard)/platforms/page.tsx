"use client";

import { useEffect, useState } from "react";
import {
  Globe2,
  Radio,
  Share2,
  TrendingUp,
  Activity,
  Users,
  Eye,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  BarChart3,
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  Clock,
  MessageSquare,
  Flame,
  ArrowRightLeft,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
import { api } from "@/lib/api";
import { Panel, PanelTitle, KpiCard, Badge, LoadingState, ErrorState } from "@/components/ui";
import Card3D from "@/components/Card3D";
import type { PlatformIntelligence, CrossPlatformComparison, Platform } from "@ntro/types";

const PLATFORM_ICONS: Record<string, string> = {
  x: "𝕏",
  telegram: "✈️",
  reddit: "👾",
  youtube: "▶️",
  instagram: "📸",
  facebook: "📘",
  linkedin: "💼",
  tiktok: "🎵",
  news: "📰",
  other: "🌐",
};

const PLATFORM_COLORS: Record<string, string> = {
  x: "#1D63FF",
  telegram: "#0EA5E9",
  reddit: "#F97316",
  youtube: "#EF4444",
  instagram: "#EC4899",
  facebook: "#3B82F6",
  linkedin: "#0A66C2",
  tiktok: "#8B5CF6",
  news: "#10B981",
  other: "#64748B",
};

export default function SocialPlatformsPage() {
  const [platforms, setPlatforms] = useState<PlatformIntelligence[]>([]);
  const [comparison, setComparison] = useState<CrossPlatformComparison | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        api.platforms(),
        api.platformsCompare(),
      ]);
      setPlatforms(pRes.data || []);
      setComparison(cRes.data || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load platform intelligence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setSyncingId(id);
      await api.syncPlatform(id);
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  };

  if (loading && platforms.length === 0) {
    return <LoadingState message="Aggregating multi-platform intelligence matrix..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const activePlatformData =
    selectedPlatform === "all"
      ? null
      : platforms.find((p) => p.id === selectedPlatform);

  const filteredPlatforms = platforms.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute Aggregates
  const totalPostsAcross = platforms.reduce((acc, p) => acc + p.totalPosts, 0);
  const totalMentionsAcross = platforms.reduce((acc, p) => acc + p.totalMentions, 0);
  const totalReachAcross = platforms.reduce((acc, p) => acc + p.estimatedReach, 0);
  const liveCount = platforms.filter((p) => p.isLive).length;

  return (
    <div className="space-y-6">
      {/* Header with Title & Live Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-[#0062FF]" />
              Social Platforms Intelligence
            </h1>
            <Badge variant="blue" className="font-mono text-xs">
              10 CONNECTORS
            </Badge>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Real-time cross-platform telemetry, information propagation tracking, and normalized multi-source ingestion.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>{liveCount} Active Streams</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#0062FF] font-semibold">Demo Simulation Active</span>
          </div>

          <button
            onClick={fetchData}
            className="btn btn-ghost text-xs py-1.5 px-3 font-mono"
            title="Refresh All Stream Matrix"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Sync All</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Aggregated Posts"
          value={totalPostsAcross.toLocaleString()}
          icon={<MessageSquare className="w-5 h-5 text-[#0062FF]" />}
          trend="+18.4% vs last cycle"
          trendDirection="up"
          accentColor="blue"
        />
        <KpiCard
          label="Total Mentions Intercepted"
          value={totalMentionsAcross.toLocaleString()}
          icon={<Flame className="w-5 h-5 text-[#8B5CF6]" />}
          trend="+24.1% surge"
          trendDirection="up"
          accentColor="violet"
        />
        <KpiCard
          label="Estimated Cross-Platform Reach"
          value={`${(totalReachAcross / 1000000).toFixed(1)}M`}
          icon={<Eye className="w-5 h-5 text-[#38BDF8]" />}
          trend="89.2% deduplicated"
          trendDirection="up"
          accentColor="cyan"
        />
        <KpiCard
          label="Cross-Platform Propagation Velocity"
          value="480 /hr"
          icon={<Zap className="w-5 h-5 text-[#F59E0B]" />}
          trend="High cascade speed"
          trendDirection="up"
          accentColor="amber"
        />
      </div>

      {/* Platform Selector Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => setSelectedPlatform("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedPlatform === "all"
                ? "bg-gradient-to-r from-[#0062FF] to-[#8B5CF6] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            All Platforms ({platforms.length})
          </button>

          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedPlatform === p.id
                  ? "bg-[#0062FF] text-white font-bold shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span>{PLATFORM_ICONS[p.id] || "🌐"}</span>
              <span>{p.name.split(" ")[0]}</span>
              {p.isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />}
            </button>
          ))}
        </div>

        {/* Search filter input */}
        <div className="relative shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0062FF] w-40"
          />
        </div>
      </div>

      {/* Grid of Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPlatforms.map((plat) => {
          const isSelected = selectedPlatform === plat.id;
          return (
            <div
              key={plat.id}
              onClick={() => setSelectedPlatform(isSelected ? "all" : plat.id)}
              className={`bg-white border rounded-2xl p-5 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md ${
                isSelected
                  ? "border-[#0062FF] ring-2 ring-[#0062FF]/20"
                  : "border-slate-200 hover:border-[#0062FF]/40"
              }`}
            >
              {/* Header: Platform Icon, Name, Status */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm"
                    style={{ backgroundColor: `${PLATFORM_COLORS[plat.id] || "#1D63FF"}15`, color: PLATFORM_COLORS[plat.id] || "#1D63FF" }}
                  >
                    {PLATFORM_ICONS[plat.id] || "🌐"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {plat.name}
                      {plat.isLive && (
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" title="Live Stream" />
                      )}
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      Category: {plat.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      plat.status === "CONNECTED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : plat.status === "DEMO DATA"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {plat.status}
                  </span>

                  <button
                    onClick={(e) => handleSync(plat.id, e)}
                    disabled={syncingId === plat.id}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                    title="Synchronize Connector"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingId === plat.id ? "animate-spin text-[#0062FF]" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 border border-slate-100 rounded-xl mb-3 text-center">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">Mentions</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {plat.totalMentions.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">Posts</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {plat.totalPosts.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">Reach</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {(plat.estimatedReach / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              {/* Sentiment & Velocity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 text-[11px]">Sentiment Polarity</span>
                  <span className="text-slate-800 font-bold">
                    {plat.sentiment.positive}% Pos • {plat.sentiment.negative}% Neg
                  </span>
                </div>

                {/* 3-color sentiment split bar */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div style={{ width: `${plat.sentiment.positive}%` }} className="bg-[#10B981] h-full" />
                  <div style={{ width: `${plat.sentiment.neutral}%` }} className="bg-slate-300 h-full" />
                  <div style={{ width: `${plat.sentiment.negative}%` }} className="bg-[#EF4444] h-full" />
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-500">
                  <span>Velocity: <strong className="text-slate-800">{plat.trendVelocity} evt/hr</strong></span>
                  <span>Engagement: <strong className="text-[#0062FF]">{plat.engagementRatePct}%</strong></span>
                </div>
              </div>

              {/* Footer with Sync info */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Quality Score: {plat.dataQualityScore}%</span>
                <span>Synced: {new Date(plat.lastSyncAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Platform Deep Dive Details (if single platform selected) */}
      {activePlatformData && (
        <div className="bg-white border-2 border-[#0062FF]/40 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm"
                style={{ backgroundColor: `${PLATFORM_COLORS[activePlatformData.id] || "#1D63FF"}15`, color: PLATFORM_COLORS[activePlatformData.id] || "#1D63FF" }}
              >
                {PLATFORM_ICONS[activePlatformData.id] || "🌐"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  {activePlatformData.name} — Deep Intelligence Dossier
                  <Badge variant="blue">{activePlatformData.status}</Badge>
                </h2>
                <p className="text-xs text-slate-600">
                  Granular stream analysis, key opinion leaders, and information propagation dynamics on {activePlatformData.name}.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlatform("all")}
              className="btn btn-ghost text-xs py-1.5 px-3 font-mono"
            >
              Back to Cross-Platform Overview
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline Activity Chart */}
            <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#0062FF]" />
                24-Hour Ingestion Activity & Volume
              </h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activePlatformData.activityTimeline}>
                    <defs>
                      <linearGradient id="platGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0062FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0062FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", borderRadius: "8px", color: "#0F172A" }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#0062FF" strokeWidth={2} fillOpacity={1} fill="url(#platGrad)" name="Events" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Influencers & Propagation */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8B5CF6]" />
                Top Opinion Leaders
              </h3>
              <div className="space-y-2">
                {activePlatformData.topInfluencers.map((inf, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">@{inf.handle}</span>
                      <span className="text-[10px] text-slate-500 capitalize">{inf.role} • {(inf.followers / 1000).toFixed(0)}k followers</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#0062FF]">
                      {(inf.score * 100).toFixed(0)}% Inf
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-mono text-slate-600">
                <span>Inflow Cascade: <strong>{activePlatformData.propagationInflowPct}%</strong></span>
                <span>Outflow Cascade: <strong>{activePlatformData.propagationOutflowPct}%</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cross-Platform Comparison & Information Propagation (Always Visible in Overview Mode) */}
      {comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Comparison Across Platforms */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0062FF]" />
              Cross-Platform Sentiment Comparison
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparison.sentimentComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="platform" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", borderRadius: "8px", color: "#0F172A" }}
                  />
                  <Legend />
                  <Bar dataKey="positive" fill="#10B981" name="Positive %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="neutral" fill="#94A3B8" name="Neutral %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="negative" fill="#EF4444" name="Negative %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cross-Platform Information Propagation Events */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[#8B5CF6]" />
                Cross-Platform Propagation Events
              </h3>
              <Badge variant="violet">MULTI-SOURCE DETECTED</Badge>
            </div>

            <div className="space-y-3">
              {comparison.crossPlatformEvents.map((evt) => (
                <div key={evt.eventId} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-[#0062FF]/40 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#0062FF] border border-blue-200 font-bold">
                      {evt.velocity} evt/hr
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
                    <span>Origin: <strong className="uppercase text-slate-900">{evt.originPlatform}</strong></span>
                    <span>➔</span>
                    <span>Spread to:</span>
                    <div className="flex items-center gap-1">
                      {evt.spreadPlatforms.map((sp) => (
                        <span key={sp} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] uppercase font-bold">
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Reach: {(evt.totalReach / 1000000).toFixed(1)}M users</span>
                    <span>Polarity Score: {evt.sentimentScore > 0 ? "+" : ""}{evt.sentimentScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
