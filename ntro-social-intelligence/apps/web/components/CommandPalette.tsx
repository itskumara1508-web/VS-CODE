'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  Radio,
  Brain,
  Users,
  TrendingUp,
  Network,
  Clock3,
  GitBranch,
  Bot,
  BellRing,
  FileBarChart,
  Database,
  Activity,
  Settings,
  Sparkles,
  Zap,
  X,
  ArrowRight,
  MessageSquare,
  Hash,
  AlertTriangle,
  FileText,
  Shield,
  Layers,
  Crown,
} from 'lucide-react';
import { Badge } from '@/components/ui';

interface SearchResultItem {
  id: string;
  type: 'POST' | 'ACCOUNT' | 'TOPIC' | 'COMMUNITY' | 'ALERT' | 'REPORT' | 'TIMELINE' | 'ACTION' | 'NAV';
  title: string;
  snippet?: string;
  platform?: string;
  timestamp?: string;
  relevanceScore: number;
  href?: string;
  action?: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenEventIntel,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenEventIntel?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  // Cross-entity intelligence database index
  const INTEL_INDEX: SearchResultItem[] = [
    // Navigation Modules
    { id: 'nav_dash', type: 'NAV', title: 'Overview Dashboard', snippet: 'Command center KPIs, live activity, and executive summary', relevanceScore: 1.0, href: '/dashboard' },
    { id: 'nav_live', type: 'NAV', title: 'Live Stream Monitoring', snippet: 'Continuous normalized event feed with real-time pump controls', relevanceScore: 1.0, href: '/live' },
    { id: 'nav_sentiment', type: 'NAV', title: 'Sentiment Intelligence', snippet: 'Multi-dimensional polarity, 10-emotion taxonomy, and stance heatmap', relevanceScore: 1.0, href: '/sentiment' },
    { id: 'nav_audience', type: 'NAV', title: 'Audience Intelligence', snippet: 'Aggregate privacy-preserving demographic cohorts and language distribution', relevanceScore: 1.0, href: '/audience' },
    { id: 'nav_trends', type: 'NAV', title: 'Trend Intelligence', snippet: 'Mention velocity, growth forecasting, and trend radar', relevanceScore: 1.0, href: '/trends' },
    { id: 'nav_network', type: 'NAV', title: 'Network Topology Graph', snippet: 'Interactive graph clustering, PageRank centrality, and bridge accounts', relevanceScore: 1.0, href: '/network' },
    { id: 'nav_timeline', type: 'NAV', title: 'Timeline Explorer', snippet: 'Chronological event cards and multi-stage information cascade log', relevanceScore: 1.0, href: '/timeline' },
    { id: 'nav_ai_time', type: 'NAV', title: 'AI Analysis Timeline', snippet: 'Step-by-step causal narrative propagation decomposition model', relevanceScore: 1.0, href: '/ai-timeline' },
    { id: 'nav_ai_analyst', type: 'NAV', title: 'AI Analyst QA', snippet: 'Conversational natural language assistant with verifiable evidence citations', relevanceScore: 1.0, href: '/ai-analyst' },
    { id: 'nav_alerts', type: 'NAV', title: 'Threat Alert Centre', snippet: 'Real-time statistical anomaly and sudden sentiment shift dispatch feed', relevanceScore: 1.0, href: '/alerts' },
    { id: 'nav_reports', type: 'NAV', title: 'Intelligence Reports', snippet: '12-section dossier compiler with PDF, CSV, and JSON export engines', relevanceScore: 1.0, href: '/reports' },
    { id: 'nav_sources', type: 'NAV', title: 'Data Source Connectors', snippet: 'Authorized streaming providers (X, Telegram, Reddit, YouTube)', relevanceScore: 1.0, href: '/datasources' },
    { id: 'nav_health', type: 'NAV', title: 'System Health & Audit Logs', snippet: 'Distributed microservice latency, TimescaleDB status, and audit trails', relevanceScore: 1.0, href: '/health' },
    { id: 'nav_settings', type: 'NAV', title: 'Algorithm Sensitivity & Settings', snippet: 'Z-score threshold sliders, watchlist monitors, and saved investigations', relevanceScore: 1.0, href: '/settings' },

    // Topics & Narratives
    { id: 'top_ev', type: 'TOPIC', title: 'EV Charging Infrastructure Grid Overload', snippet: 'Narrative surge detected; negative sentiment reached 46% (+31% delta)', relevanceScore: 0.98, href: '/timeline?topic=topic_0' },
    { id: 'top_5g', type: 'TOPIC', title: '5G Spectrum Allocation & Rollout', snippet: 'Predominantly positive public stance with 64% constructive feedback', relevanceScore: 0.92, href: '/trends' },
    { id: 'top_ai', type: 'TOPIC', title: 'AI Algorithmic Safety & Model Standards', snippet: 'Policy and academic discourse regarding regulatory guidelines', relevanceScore: 0.89, href: '/trends' },
    { id: 'top_upi', type: 'TOPIC', title: 'UPI Digital Payments Milestone', snippet: '14B monthly transactions record discussion across national channels', relevanceScore: 0.85, href: '/trends' },

    // Accounts / Influencer Nodes
    { id: 'acc_tech', type: 'ACCOUNT', title: '@tech_analyst_in', snippet: 'National Tech Analyst • PageRank: 0.084 • Authority Score: 0.94', platform: 'X', timestamp: '2 min ago', relevanceScore: 0.96, href: '/network' },
    { id: 'acc_ev_watch', type: 'ACCOUNT', title: '@ev_watch_india', snippet: 'Clean Mobility Monitor • Betweenness: 0.18 • Bridge Account', platform: 'Telegram', timestamp: '6 min ago', relevanceScore: 0.91, href: '/network' },
    { id: 'acc_telecom', type: 'ACCOUNT', title: '@telecom_insider', snippet: 'Spectrum & Telecom Engineering Forum • Influence: 0.82', platform: 'X', timestamp: '15 min ago', relevanceScore: 0.87, href: '/network' },

    // Posts & Discussions
    { id: 'pst_1', type: 'POST', title: 'Massive traffic jam near charging hub; power supply disruption reported...', snippet: 'By @local_commuter_hub on Telegram • Negative Sentiment (Polarity: -0.82)', platform: 'Telegram', timestamp: '14:00 UTC', relevanceScore: 0.95, href: '/live' },
    { id: 'pst_2', type: 'POST', title: 'Telecom circle A recorded 99.4% uptime on 5G standalone carrier deployment.', snippet: 'By @telecom_insider on X • Positive Sentiment (Polarity: +0.78)', platform: 'X', timestamp: '14:25 UTC', relevanceScore: 0.88, href: '/live' },

    // Communities & Clusters
    { id: 'comm_tech', type: 'COMMUNITY', title: 'National Tech Influencers', snippet: 'Modularity Cluster A • Size: 248 accounts • Dominant: English', relevanceScore: 0.90, href: '/network' },
    { id: 'comm_policy', type: 'COMMUNITY', title: 'Policy & Academic Community', snippet: 'Modularity Cluster B • Size: 182 accounts • Dominant: English/Hindi', relevanceScore: 0.89, href: '/network' },

    // Alerts
    { id: 'alt_crit', type: 'ALERT', title: 'CRITICAL: Negative Sentiment Surge on EV Charging (+31%)', snippet: 'Exceeded standard deviation anomaly threshold (z-score > 2.8)', timestamp: '14:48 UTC', relevanceScore: 0.97, href: '/alerts' },
    { id: 'alt_viral', type: 'ALERT', title: 'HIGH: Viral Growth Velocity Triggered on #EVChargingCrisis', snippet: 'Velocity surged to 340 mentions/hr in 30 minutes', timestamp: '14:35 UTC', relevanceScore: 0.94, href: '/alerts' },

    // Reports
    { id: 'rep_dossier', type: 'REPORT', title: 'NTRO Strategic Intelligence Assessment - EV Crisis', snippet: '12-Section comprehensive dossier with verified evidence audit trail', timestamp: 'Today', relevanceScore: 0.91, href: '/reports' },
  ];

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return INTEL_INDEX.filter((item) => {
      const matchesFilter = activeFilter === 'ALL' || item.type === activeFilter;
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.snippet?.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.platform?.toLowerCase().includes(q)
      );
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [query, activeFilter]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
      setQuery('');
      setSelectedIndex(0);
      setActiveFilter('ALL');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((idx) => (idx + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((idx) => (idx - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          if (selected.action) selected.action();
          else if (selected.href) {
            router.push(selected.href);
            onClose();
          }
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  const getTypeBadge = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'POST':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#19D3C5]/15 text-[#19D3C5] border border-[#19D3C5]/30">POST</span>;
      case 'ACCOUNT':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">ACCOUNT</span>;
      case 'TOPIC':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#F5B942]/15 text-[#F5B942] border border-[#F5B942]/30">TOPIC</span>;
      case 'COMMUNITY':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">COMMUNITY</span>;
      case 'ALERT':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">ALERT</span>;
      case 'REPORT':
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">REPORT</span>;
      default:
        return <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#162238] text-[#94A3B8] border border-[#223354]">NAV</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-4 bg-[#0B1220]/85 backdrop-blur-md animate-in fade-in duration-100 select-none">
      <div className="w-full max-w-2xl bg-[#162238] border border-[#223354] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-[#223354] bg-[#111C32]">
          <Search className="w-4 h-4 text-[#19D3C5] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search across Posts, Accounts, Topics, Alerts, Reports, Communities..."
            className="flex-1 bg-transparent text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none"
          />
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Entity Filter Pills */}
        <div className="px-4 py-2 bg-[#0B1220]/60 border-b border-[#223354] flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          {['ALL', 'TOPIC', 'ACCOUNT', 'POST', 'COMMUNITY', 'ALERT', 'REPORT', 'NAV'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-0.5 rounded-full transition-all uppercase ${
                activeFilter === f
                  ? 'bg-[#19D3C5] text-[#0B1220] font-bold shadow-glow'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111C32]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#94A3B8] font-mono">
              No matching records found across indexed intelligence entities.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.action) item.action();
                    else if (item.href) {
                      router.push(item.href);
                      onClose();
                    }
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#111C32] border border-[#19D3C5]/40 shadow-sm'
                      : 'hover:bg-[#111C32]/60 border border-transparent'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(item.type)}
                      <span className="text-xs font-bold text-[#F8FAFC] truncate">{item.title}</span>
                      {item.platform && (
                        <span className="text-[10px] text-[#38BDF8] font-mono uppercase bg-[#0B1220] px-1.5 py-0.2 rounded border border-[#223354]">
                          {item.platform}
                        </span>
                      )}
                    </div>
                    {item.snippet && (
                      <p className="text-[11px] text-[#94A3B8] line-clamp-1 leading-snug">{item.snippet}</p>
                    )}
                  </div>

                  <div className="shrink-0 text-right space-y-1">
                    <span className="text-[10px] font-mono text-[#19D3C5] font-semibold block">
                      {(item.relevanceScore * 100).toFixed(0)}% match
                    </span>
                    {item.timestamp && (
                      <span className="text-[9px] font-mono text-[#94A3B8] block">{item.timestamp}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-[#223354] bg-[#111C32] text-[11px] text-[#94A3B8] flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span>↑↓ to navigate</span>
            <span>•</span>
            <span>↵ to open</span>
            <span>•</span>
            <span>esc to close</span>
          </div>
          <span className="text-[#19D3C5] font-semibold">SOCIOINTELL Global Intelligence Index</span>
        </div>
      </div>
    </div>
  );
}
