"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Clock,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Activity,
  Eye,
  Filter,
  BarChart2,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Radio,
  User,
  Hash,
  MessageSquare,
} from "lucide-react";
import { api } from "@/lib/api";
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from "@/components/ui";
import Card3D from "@/components/Card3D";
import EvidenceModal from "@/components/EvidenceModal";
import GlobalFilterBar from "@/components/GlobalFilterBar";
import type { Alert, WatchlistRule, WatchlistMatch } from "@ntro/types";

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<"ALERTS" | "WATCHLISTS">("ALERTS");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [watchlistData, setWatchlistData] = useState<{
    rules: WatchlistRule[];
    matches: WatchlistMatch[];
    stats: { totalRules: number; activeRules: number; totalMatches24h: number };
  }>({ rules: [], matches: [], stats: { totalRules: 0, activeRules: 0, totalMatches24h: 0 } });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

  // New Watchlist Rule Modal
  const [newRuleModalOpen, setNewRuleModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState<"keyword" | "account" | "hashtag" | "topic">("keyword");
  const [ruleQuery, setRuleQuery] = useState("");
  const [ruleSeverity, setRuleSeverity] = useState<"INFO" | "WARNING" | "HIGH" | "CRITICAL">("WARNING");
  const [ruleThreshold, setRuleThreshold] = useState(75);

  const loadData = async () => {
    try {
      const [alertsRes, watchRes] = await Promise.all([api.alerts(), api.watchlists()]);
      setAlerts(alertsRes);
      setWatchlistData(watchRes);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load alerts & watchlists");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAck = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      const updated = await api.toggleWatchlistRule(ruleId);
      setWatchlistData((prev) => ({
        ...prev,
        rules: prev.rules.map((r) => (r.id === ruleId ? updated : r)),
        stats: {
          ...prev.stats,
          activeRules: updated.enabled ? prev.stats.activeRules + 1 : prev.stats.activeRules - 1,
        },
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await api.deleteWatchlistRule(ruleId);
      setWatchlistData((prev) => ({
        ...prev,
        rules: prev.rules.filter((r) => r.id !== ruleId),
        stats: {
          ...prev.stats,
          totalRules: prev.stats.totalRules - 1,
        },
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !ruleQuery.trim()) return;
    try {
      const newRule = await api.createWatchlistRule({
        name: ruleName,
        type: ruleType,
        query: ruleQuery,
        alertLevel: ruleSeverity,
        sensitivityThreshold: ruleThreshold,
      });
      setWatchlistData((prev) => ({
        ...prev,
        rules: [newRule, ...prev.rules],
        stats: {
          ...prev.stats,
          totalRules: prev.stats.totalRules + 1,
          activeRules: prev.stats.activeRules + 1,
        },
      }));
      setNewRuleModalOpen(false);
      setRuleName("");
      setRuleQuery("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleInvestigate = (alert: Alert) => {
    setSelectedEvidence({
      title: "Evidence for Alert: " + alert.title,
      claim: alert.message,
      confidence: { score: 0.96, low: 0.91, high: 0.99 },
      topicName: "EV Charging Infrastructure",
      timeRange: "14:00 - 15:00 UTC",
      evidenceItems: [
        { type: "alert_level", label: "Threat Severity", value: alert.level },
        { type: "z_score", label: "Anomaly Deviation (Z-Score)", value: "3.12 σ (Threshold: 2.5 σ)" },
        { type: "negative_delta", label: "Negative Sentiment Delta", value: "+31.4%" },
        { type: "affected_nodes", label: "Network Modularity Impact", value: "4 Communities" },
      ],
    });
    setEvidenceOpen(true);
  };

  if (loading) return <LoadingState message="Scanning Real-Time Threat Alerts & Watchlist Engine..." />;
  if (error) return <ErrorState message={error} />;

  const anomalyBaselines = [
    {
      metric: "Posting Frequency (Velocity)",
      currentVal: "340 posts/hr",
      baselineVal: "85 posts/hr",
      deviation: "+300% (Z: 3.4σ)",
      status: "CRITICAL ANOMALY",
      topic: "EV Charging Infrastructure",
    },
    {
      metric: "Negative Polarity Surge",
      currentVal: "46.1%",
      baselineVal: "18.2%",
      deviation: "+27.9% (Z: 3.1σ)",
      status: "HIGH ANOMALY",
      topic: "EV Charging Infrastructure",
    },
    {
      metric: "Inter-Community Link Formation",
      currentVal: "14 new bridge ties",
      baselineVal: "2 bridge ties",
      deviation: "+600% (Z: 2.8σ)",
      status: "CASCADE DETECTED",
      topic: "EV Charging Infrastructure",
    },
  ];

  const filtered = alerts.filter((a) => (filterLevel === "ALL" ? true : a.level === filterLevel));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#00F0FF]" />
              Watchlists & Threat Alert Centre
            </h1>
            <Badge variant="teal">REAL-TIME ANOMALY DISPATCH</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Statistical threshold baselines, keyword/account watchlist matching, and threat dispatch triage.
          </p>
        </div>

        {/* Tab Switcher & Create Rule CTA */}
        <div className="flex items-center gap-2">
          <div className="bg-[#111C35] border border-[#1E3156] rounded-xl p-1 flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab("ALERTS")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === "ALERTS"
                  ? "bg-[#00F0FF] text-[#070B14] shadow-glow"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              DISPATCH ALERTS ({alerts.length})
            </button>
            <button
              onClick={() => setActiveTab("WATCHLISTS")}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeTab === "WATCHLISTS"
                  ? "bg-[#00F0FF] text-[#070B14] shadow-glow"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              WATCHLIST MONITORS ({watchlistData.rules.length})
            </button>
          </div>

          {activeTab === "WATCHLISTS" && (
            <button
              onClick={() => setNewRuleModalOpen(true)}
              className="btn btn-primary text-xs py-1.5 px-3 font-bold flex items-center gap-1.5 shadow-glow"
            >
              <Plus className="w-3.5 h-3.5" /> ADD RULE
            </button>
          )}
        </div>
      </div>

      <GlobalFilterBar />

      {activeTab === "ALERTS" ? (
        <>
          {/* Statistical Anomaly Detection Telemetry Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted uppercase flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#00F0FF]" /> Statistical Baseline Deviation Triggers (Z &gt; 2.5σ)
              </span>
              <span className="text-[10px] font-mono text-[#00FF9D]">Continuous Kernel Density Estimation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {anomalyBaselines.map((anom, idx) => (
                <Card3D key={idx} glowColor="rose" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#FF3366]">{anom.status}</span>
                    <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-ping" />
                  </div>
                  <h4 className="text-xs font-bold text-[#F8FAFC]">{anom.metric}</h4>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#070B14] p-2 rounded-xl border border-[#1E3156]">
                      <span className="text-[9px] text-muted block">Observed Value</span>
                      <span className="text-sm font-bold text-[#00F0FF]">{anom.currentVal}</span>
                    </div>
                    <div className="bg-[#070B14] p-2 rounded-xl border border-[#1E3156]">
                      <span className="text-[9px] text-muted block">Expected Baseline</span>
                      <span className="text-sm font-bold text-muted">{anom.baselineVal}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1E3156] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#FF3366] font-bold">{anom.deviation}</span>
                    <span className="text-muted truncate">{anom.topic}</span>
                  </div>
                </Card3D>
              ))}
            </div>
          </div>

          {/* Filter Level Pills */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[10px] text-muted uppercase">Filter Severity:</span>
            {["ALL", "CRITICAL", "HIGH", "WARNING", "INFO"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1 rounded-xl uppercase transition-all font-bold ${
                  filterLevel === lvl
                    ? "bg-[#00F0FF] text-[#070B14] shadow-glow"
                    : "text-muted hover:text-text bg-[#111C35] border border-[#1E3156]"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Alerts Dispatch List */}
          <Panel className="p-0 overflow-hidden bg-[#0D1527]/90 backdrop-blur-2xl border-[#1E3156]">
            <div className="p-4 border-b border-[#1E3156] bg-[#070B14]/60 flex items-center justify-between">
              <PanelTitle icon={<BellRing className="w-4 h-4 text-[#00F0FF]" />}>
                Active Intelligence Alerts ({filtered.length} Dispatched)
              </PanelTitle>
              <span className="text-[11px] font-mono text-muted">Acknowledge or Investigate</span>
            </div>

            <div className="divide-y divide-[#1E3156]">
              {filtered.map((alert) => {
                const isCrit = alert.level === "CRITICAL";
                const isHigh = alert.level === "HIGH";
                return (
                  <div
                    key={alert.id}
                    className={`p-4 hover:bg-[#111C35]/60 transition-colors space-y-3 ${
                      alert.acknowledged ? "opacity-60 bg-[#070B14]/40" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            isCrit
                              ? "bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/40 shadow-[0_0_10px_rgba(255,51,102,0.2)]"
                              : isHigh
                              ? "bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40"
                              : "bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30"
                          }`}
                        >
                          {alert.level}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">{alert.title}</h3>
                        {alert.acknowledged && (
                          <span className="text-[10px] font-mono text-[#00FF9D] bg-[#00FF9D]/10 px-2 py-0.5 rounded border border-[#00FF9D]/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> ACKNOWLEDGED
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-muted">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-xs text-[#CBD5E1] leading-relaxed">{alert.message}</p>

                    {/* Actions Toolbar */}
                    <div className="pt-2 border-t border-[#1E3156]/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-muted">ID: {alert.id}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleInvestigate(alert)}
                          className="btn btn-primary text-xs py-1 px-3 flex items-center gap-1.5 shadow-glow"
                        >
                          <Eye className="w-3.5 h-3.5" /> Investigate Evidence
                        </button>

                        {!alert.acknowledged && (
                          <button
                            onClick={() => handleAck(alert.id)}
                            className="btn btn-ghost text-xs py-1 px-3 text-[#00FF9D] hover:bg-[#00FF9D]/15 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </>
      ) : (
        /* WATCHLIST KEYWORD & ACCOUNT MONITOR TAB */
        <div className="space-y-6">
          {/* Watchlist Telemetry Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card3D glowColor="teal" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase">Active Keyword Monitors</span>
              <div className="text-2xl font-bold text-[#00F0FF] font-mono">{watchlistData.stats.activeRules} / {watchlistData.stats.totalRules}</div>
              <span className="text-[10px] font-mono text-[#00FF9D]">Continuous Packet Inspection</span>
            </Card3D>

            <Card3D glowColor="amber" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase">Matched Posts (24h)</span>
              <div className="text-2xl font-bold text-[#FFB800] font-mono">{watchlistData.stats.totalMatches24h.toLocaleString()}</div>
              <span className="text-[10px] font-mono text-[#FFB800]">Multi-Platform Ingestion</span>
            </Card3D>

            <Card3D glowColor="cyan" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase">Triggered Alerts</span>
              <div className="text-2xl font-bold text-[#38BDF8] font-mono">{watchlistData.matches.length}</div>
              <span className="text-[10px] font-mono text-muted">Automated Priority Escalation</span>
            </Card3D>
          </div>

          {/* Rules List Panel */}
          <Panel className="p-5 bg-[#0D1527]/90 backdrop-blur-2xl border-[#1E3156] space-y-4 shadow-glass">
            <PanelTitle icon={<Radio className="w-4 h-4 text-[#00F0FF]" />}>
              Configured Watchlist Rules & Sensitivity Matrix
            </PanelTitle>

            <div className="space-y-3">
              {watchlistData.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 bg-[#111C35]/80 rounded-2xl border border-[#1E3156] hover:border-[#00F0FF]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#070B14] text-[#00F0FF] border border-[#1E3156] font-bold">
                        {rule.type}
                      </span>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">{rule.name}</h4>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        rule.alertLevel === "CRITICAL" ? "bg-[#FF3366]/20 text-[#FF3366]" : "bg-[#FFB800]/20 text-[#FFB800]"
                      }`}>
                        {rule.alertLevel}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#94A3B8] bg-[#070B14] px-2.5 py-1 rounded-lg border border-[#1E3156]/60">
                      Query: <strong className="text-[#00F0FF]">{rule.query}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-[10px] font-mono text-muted">
                      <div>Matches: <strong className="text-[#F8FAFC]">{rule.matchesCount}</strong></div>
                      <div>Sensitivity: <strong className="text-[#00FF9D]">{rule.sensitivityThreshold}%</strong></div>
                    </div>

                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className="p-1.5 text-muted hover:text-white"
                      title={rule.enabled ? "Disable Rule" : "Enable Rule"}
                    >
                      {rule.enabled ? <ToggleRight className="w-6 h-6 text-[#00FF9D]" /> : <ToggleLeft className="w-6 h-6 text-muted" />}
                    </button>

                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1.5 text-muted hover:text-[#FF3366]"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Recent Live Watchlist Matches */}
          <Panel className="p-5 bg-[#0D1527]/90 backdrop-blur-2xl border-[#1E3156] space-y-3">
            <PanelTitle icon={<Search className="w-4 h-4 text-[#FFB800]" />}>
              Real-Time Watchlist Intercept Matches
            </PanelTitle>

            <div className="space-y-2.5">
              {watchlistData.matches.map((m) => (
                <div key={m.id} className="p-3.5 bg-[#111C35]/90 rounded-2xl border border-[#1E3156] space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#F8FAFC] flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#070B14] text-[#00F0FF] uppercase">{m.platform}</span>
                      {m.author}
                    </span>
                    <span className="text-[10px] text-muted">{new Date(m.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-xs text-[#CBD5E1]">{m.text}</p>
                  <div className="text-[10px] font-mono text-[#FFB800] pt-0.5">
                    Matched Term: <strong>&quot;{m.matchedTerm}&quot;</strong> (Rule: {m.ruleName})
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* CREATE WATCHLIST RULE MODAL */}
      {newRuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1527] border border-[#1E3156] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-[#F8FAFC] font-mono uppercase flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#00F0FF]" /> Create Watchlist Monitor Rule
            </h3>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-muted uppercase">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Critical Grid Outage Keywords"
                  className="w-full bg-[#070B14] border border-[#1E3156] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] mt-1 focus:border-[#00F0FF] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-muted uppercase">Rule Target Type</label>
                <select
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value as any)}
                  className="w-full bg-[#070B14] border border-[#1E3156] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] mt-1 font-mono focus:border-[#00F0FF] outline-none"
                >
                  <option value="keyword">Keywords / Text Phrases</option>
                  <option value="account">Account Handles (@...)</option>
                  <option value="hashtag">Hashtags (#...)</option>
                  <option value="topic">Semantic Topic Clusters</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-muted uppercase">Query / Match Terms (Comma separated)</label>
                <input
                  type="text"
                  required
                  value={ruleQuery}
                  onChange={(e) => setRuleQuery(e.target.value)}
                  placeholder="e.g. blackout, substation, voltage drop"
                  className="w-full bg-[#070B14] border border-[#1E3156] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] mt-1 focus:border-[#00F0FF] outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-muted uppercase">Alert Level</label>
                  <select
                    value={ruleSeverity}
                    onChange={(e) => setRuleSeverity(e.target.value as any)}
                    className="w-full bg-[#070B14] border border-[#1E3156] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] mt-1 font-mono focus:border-[#00F0FF] outline-none"
                  >
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-muted uppercase">Sensitivity ({ruleThreshold}%)</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={ruleThreshold}
                    onChange={(e) => setRuleThreshold(Number(e.target.value))}
                    className="w-full mt-3 accent-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1E3156]">
                <button
                  type="button"
                  onClick={() => setNewRuleModalOpen(false)}
                  className="btn btn-ghost text-xs py-1.5 px-3"
                >
                  CANCEL
                </button>
                <button type="submit" className="btn btn-primary text-xs py-1.5 px-4 font-bold shadow-glow">
                  ACTIVATE RULE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVIDENCE INVESTIGATION MODAL */}
      <EvidenceModal
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        title={selectedEvidence?.title || 'Alert Evidence'}
        claim={selectedEvidence?.claim || ''}
        confidence={selectedEvidence?.confidence}
        topicName={selectedEvidence?.topicName}
        timeRange={selectedEvidence?.timeRange}
        evidenceItems={selectedEvidence?.evidenceItems || []}
      />
    </div>
  );
}
