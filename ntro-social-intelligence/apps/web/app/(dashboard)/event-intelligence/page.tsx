"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Clock,
  TrendingUp,
  Smile,
  Frown,
  Users,
  Network,
  Share2,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  FolderPlus,
  FileCheck,
  CheckCircle2,
  Info,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from "@/components/ui";
import Card3D from "@/components/Card3D";
import GlobalFilterBar from "@/components/GlobalFilterBar";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { EventIntelligenceData } from "@ntro/types";

export default function EventIntelligencePage() {
  const router = useRouter();
  const [data, setData] = useState<EventIntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("topic_0");
  const [pinSuccess, setPinSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.eventIntelligence(selectedTopic)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load Event Intelligence");
        setLoading(false);
      });
  }, [selectedTopic]);

  const handlePinToInvestigation = async () => {
    if (!data) return;
    try {
      // Find open investigation or pin to case_001
      await api.pinInvestigationItem("inv_case_001", {
        type: "topic",
        title: "Event: " + data.topicName,
        referenceId: data.topicId,
        data: {
          currentMentions: data.currentMentions,
          growthRate: data.growthRate,
          sentiment: data.sentiment,
          propagationSteps: data.propagationSteps.length,
        },
        annotation: "Cross-vector event dossier pinned directly from Unified Event Intelligence console.",
      });
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <LoadingState message="Synthesizing Unified Cross-Vector Event Intelligence..." />;
  if (error || !data) return <ErrorState message={error || "Event data unavailable."} />;

  const sentimentTrajectory = [
    { time: "14:00", positive: 65, negative: 18, neutral: 17 },
    { time: "14:15", positive: 52, negative: 26, neutral: 22 },
    { time: "14:30", positive: 38, negative: 39, neutral: 23 },
    { time: "14:45", positive: 30, negative: 46, neutral: 24 },
    { time: "15:00", positive: 28, negative: 47, neutral: 25 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00F0FF]" />
              Unified Event Intelligence Console
            </h1>
            <Badge variant="teal">CROSS-VECTOR SYNTHESIS</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Holistic cross-dimensional fusion answering: What, Why, Who, How it spread, and What changed.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Topic Switcher */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-[#111C35] border border-[#1E3156] rounded-xl px-3 py-1.5 text-xs text-[#F8FAFC] font-mono focus:border-[#00F0FF] outline-none"
          >
            <option value="topic_0">EV Charging Infrastructure Outage (Primary)</option>
            <option value="topic_1">5G Telecom Expansion</option>
            <option value="topic_2">AI Safety Standards Deliberation</option>
          </select>

          <button
            onClick={handlePinToInvestigation}
            className="btn btn-emerald text-xs py-1.5 px-3.5 font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,255,157,0.25)]"
          >
            {pinSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> PINNED TO CASE
              </>
            ) : (
              <>
                <FolderPlus className="w-3.5 h-3.5" /> PIN TO INVESTIGATION
              </>
            )}
          </button>
        </div>
      </div>

      <GlobalFilterBar />

      {/* 5-Vector Primary Summary Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <Card3D glowColor="teal" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>1. Trend Velocity</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#00F0FF]" />
          </div>
          <div className="text-2xl font-bold text-[#00F0FF] font-mono">+{data.growthRate}%</div>
          <div className="text-[10px] text-[#00FF9D] font-mono">{data.currentMentions.toLocaleString()} Mentions</div>
        </Card3D>

        <Card3D glowColor="rose" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>2. Sentiment Inversion</span>
            <Frown className="w-3.5 h-3.5 text-[#FF3366]" />
          </div>
          <div className="text-2xl font-bold text-[#FF3366] font-mono">{data.sentiment.negative}% Neg</div>
          <div className="text-[10px] text-[#FF3366] font-mono">+28.5% Shift from Baseline</div>
        </Card3D>

        <Card3D glowColor="cyan" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>3. Top Bridge Node</span>
            <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="text-base font-bold text-[#F8FAFC] truncate font-mono">{data.topInfluencer.handle}</div>
          <div className="text-[10px] text-muted font-mono">PageRank: {data.topInfluencer.influenceScore.toFixed(2)}</div>
        </Card3D>

        <Card3D glowColor="amber" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>4. Propagation Reach</span>
            <Network className="w-3.5 h-3.5 text-[#FFB800]" />
          </div>
          <div className="text-2xl font-bold text-[#FFB800] font-mono">{data.communitiesAffected} Clusters</div>
          <div className="text-[10px] text-muted font-mono">47 min Cross-Community</div>
        </Card3D>

        <Card3D glowColor="teal" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>5. AI Veracity Score</span>
            <Shield className="w-3.5 h-3.5 text-[#00FF9D]" />
          </div>
          <div className="text-2xl font-bold text-[#00FF9D] font-mono">{(data.confidence.score * 100).toFixed(1)}%</div>
          <div className="text-[10px] text-[#00FF9D] font-mono font-semibold">Auditable Evidence Trail</div>
        </Card3D>
      </div>

      {/* Grounded AI Narrative Synthesis with Evidence Badges */}
      <Panel className="p-5 bg-[#0D1527]/90 backdrop-blur-2xl border-[#1E3156] space-y-4 shadow-glass relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#FFB800]" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E3156] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            <h2 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono">
              AI Grounded Event Synthesis & Multi-Vector Causal Reasoning
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#00FF9D] bg-[#00FF9D]/15 border border-[#00FF9D]/30 px-2.5 py-0.5 rounded-full font-bold">
            CONFIDENCE: {(data.confidence.score * 100).toFixed(0)}% [CI: {data.confidence.low}-{data.confidence.high}]
          </span>
        </div>

        <p className="text-xs text-[#CBD5E1] leading-relaxed bg-[#111C35]/80 p-4 rounded-xl border border-[#1E3156] font-sans">
          {data.aiSummary}
        </p>

        {/* Verifiable Evidence Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[10px] font-mono text-muted uppercase flex items-center gap-1 mr-1">
            <Shield className="w-3 h-3 text-[#00F0FF]" /> Verified Evidence:
          </span>
          {data.evidence.map((ev, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono bg-[#111C35] text-[#94A3B8] border border-[#1E3156] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
            >
              <strong className="text-[#F8FAFC]">{ev.label}:</strong>
              <span className="text-[#00F0FF] font-semibold">{String(ev.value)}</span>
            </span>
          ))}
        </div>
      </Panel>

      {/* Main Analysis Grid: Sentiment Trajectory & Step-by-Step Propagation Path */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Evolution */}
        <Panel className="p-5 space-y-3">
          <PanelTitle icon={<Smile className="w-4 h-4 text-[#00F0FF]" />}>
            Event Sentiment Shift Trajectory (14:00 - 15:00 UTC)
          </PanelTitle>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentTrajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF9D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00FF9D" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3366" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF3366" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E3156" vertical={false} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} fontStyle="italic" />
                <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#070B14", borderColor: "#1E3156", borderRadius: "12px", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="positive" stroke="#00FF9D" fill="url(#posGrad)" strokeWidth={2} name="Positive %" />
                <Area type="monotone" dataKey="negative" stroke="#FF3366" fill="url(#negGrad)" strokeWidth={2} name="Negative %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-2 border-t border-[#1E3156]">
            <span className="flex items-center gap-1.5 text-[#00FF9D]">
              <span className="w-2 h-2 rounded-full bg-[#00FF9D]" /> Positive (Inversion from 65% → 28%)
            </span>
            <span className="flex items-center gap-1.5 text-[#FF3366]">
              <span className="w-2 h-2 rounded-full bg-[#FF3366]" /> Negative (Escalation from 18% → 47%)
            </span>
          </div>
        </Panel>

        {/* Step-by-Step Propagation Path (§5.8) */}
        <Panel className="p-5 space-y-3">
          <PanelTitle icon={<Share2 className="w-4 h-4 text-[#38BDF8]" />}>
            Step-by-Step Information Propagation Path
          </PanelTitle>
          <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
            {data.propagationSteps.map((step) => (
              <div
                key={step.step}
                className="p-3 bg-[#111C35]/90 rounded-xl border border-[#1E3156] hover:border-[#00F0FF]/40 transition-all flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[10px] font-mono font-bold text-[#00F0FF] shrink-0 mt-0.5">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F8FAFC] flex items-center gap-1 truncate">
                      {step.fromEntity} <ArrowRight className="w-3 h-3 text-[#00F0FF] shrink-0" /> {step.toEntity}
                    </span>
                    <span className="text-[10px] font-mono text-muted shrink-0">{step.time}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-tight">{step.description}</p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#070B14] text-[#38BDF8] border border-[#1E3156]">
                      {step.type}
                    </span>
                    <span className="text-[9px] font-mono text-[#FF3366]">
                      Δ Sentiment: {(step.sentimentDelta * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
