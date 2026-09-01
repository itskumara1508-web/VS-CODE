'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  X,
  TrendingUp,
  Share2,
  History,
  BrainCircuit,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import type { EventIntelligenceData } from '@ntro/types';

export default function EventIntelligenceModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data?: EventIntelligenceData | null;
}) {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useState<number>(1);

  if (!isOpen) return null;

  const event = data || {
    topicId: 'topic_0',
    topicName: 'EV Charging Infrastructure Grid Overload',
    startedAt: '14:00:00 UTC',
    currentMentions: 18420,
    growthRate: 243,
    sentiment: { positive: 32, neutral: 22, negative: 46 },
    topInfluencer: {
      name: 'tech_analyst_in',
      handle: 'tech_analyst_in',
      influenceScore: 0.94,
      role: 'authority',
    },
    communitiesAffected: 4,
    propagationPath: [
      'Grassroots Community A',
      'Key Influencer (@tech_analyst_in)',
      'Policy Community B',
      'Media Hub C',
    ],
    propagationSteps: [
      {
        step: 1,
        time: '14:00:00',
        fromEntity: 'Citizen Community (Alpha)',
        toEntity: 'Public Forums',
        type: 'mention' as const,
        description: 'Initial discussion and grassroots posts regarding grid overload detected on X and Telegram.',
        sentimentDelta: -0.05,
      },
      {
        step: 2,
        time: '14:15:20',
        fromEntity: 'Public Forums',
        toEntity: '@tech_analyst_in',
        type: 'amplification' as const,
        description: 'Key influencer @tech_analyst_in reposted critical commentary, accelerating mention velocity by 240%.',
        sentimentDelta: -0.18,
      },
      {
        step: 3,
        time: '14:32:45',
        fromEntity: '@tech_analyst_in',
        toEntity: 'Policy & Academic Community',
        type: 'cross_community' as const,
        description: 'Discourse crossed community boundary into Policy & Tech Analysts with heightened engagement.',
        sentimentDelta: -0.12,
      },
      {
        step: 4,
        time: '14:47:10',
        fromEntity: 'Policy & Academic Community',
        toEntity: 'Mainstream News & Media Nodes',
        type: 'repost' as const,
        description: 'Regional media accounts published commentary referencing viral hashtags; negative stance solidified at 46%.',
        sentimentDelta: -0.21,
      },
    ],
    aiSummary:
      'Topic emerged at 14:00 and gained rapid traction within Community A. High-influence account @tech_analyst_in amplified the narrative at 14:15. Within 47 minutes the topic crossed community boundaries into 3 distinct network clusters, shifting negative sentiment from 18% to 46%.',
    confidence: { score: 0.92, low: 0.84, high: 0.98 },
    evidence: [
      { type: 'time_range', label: 'Time Window', value: '14:00 - 15:15 UTC' },
      { type: 'post_count', label: 'Total Posts Analyzed', value: 18420 },
      { type: 'sentiment_shift', label: 'Negative Sentiment Delta', value: '+28%' },
      { type: 'communities', label: 'Communities Reached', value: '4 Clusters' },
      { type: 'influence', label: 'Peak Centrality Score', value: '0.94' },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] bg-panel border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-glow">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                  Unified Incident Assessment
                </span>
                <Badge variant="teal">LIVE CASCADE</Badge>
              </div>
              <h2 className="text-lg font-bold text-text mt-0.5">{event.topicName}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-panel transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Discourse Volume</div>
              <div className="text-xl font-bold text-text mt-0.5">
                {event.currentMentions.toLocaleString()}
              </div>
              <div className="text-[10px] text-highlight font-mono mt-0.5">+{event.growthRate}% Growth</div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Negative Polarity Shift</div>
              <div className="text-xl font-bold text-rose-400 mt-0.5">
                {event.sentiment.negative}%
              </div>
              <div className="text-[10px] text-rose-400 font-mono mt-0.5">+31% in 2 hours</div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Key Node Amplifier</div>
              <div className="text-sm font-bold text-accent truncate mt-1">
                @{event.topInfluencer.handle}
              </div>
              <div className="text-[10px] text-muted font-mono mt-0.5">
                Influence: {(event.topInfluencer.influenceScore * 100).toFixed(0)}%
              </div>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Boundary Propagation</div>
              <div className="text-xl font-bold text-cyan mt-0.5">
                {event.communitiesAffected} Communities
              </div>
              <div className="text-[10px] text-muted font-mono mt-0.5">Cross-cluster spread</div>
            </div>
          </div>

          {/* 4-Step Propagation Chronology */}
          <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase font-mono text-cyan flex items-center gap-1.5">
                <History className="w-4 h-4" /> Multi-Stage Information Cascade Timeline
              </span>
              <span className="text-[10px] text-muted font-mono">Click step to inspect</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
              {event.propagationSteps.map((step) => {
                const isSelected = selectedStep === step.step;
                return (
                  <button
                    key={step.step}
                    onClick={() => setSelectedStep(step.step)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-panel border-accent shadow-glow'
                        : 'bg-panel/40 border-border hover:border-cyan/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-muted mb-1">
                      <span>{step.time}</span>
                      <span className={`font-bold ${isSelected ? 'text-accent' : ''}`}>
                        0{step.step}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-text truncate">{step.fromEntity}</div>
                    <div className="text-[10px] text-cyan flex items-center gap-1 mt-0.5 truncate">
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      <span>{step.toEntity}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Step Description Card */}
            {event.propagationSteps.find((s) => s.step === selectedStep) && (
              <div className="p-3.5 bg-panel rounded-xl border border-border text-xs text-text/90 flex items-start gap-3 mt-2">
                <div className="p-1.5 rounded-lg bg-accent/15 text-accent shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-text mb-0.5">
                    Step {selectedStep} Progression Detail:
                  </div>
                  <p className="text-muted leading-relaxed">
                    {event.propagationSteps.find((s) => s.step === selectedStep)?.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AI Synthesized Intelligence Summary */}
          <div className="p-4 bg-surface rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase font-mono text-accent flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Grounded AI Root Cause Synthesis
              </span>
              <span className="text-[10px] font-mono text-positive bg-positive/10 border border-positive/20 px-2 py-0.5 rounded-full">
                {(event.confidence.score * 100).toFixed(0)}% Confidence
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text leading-relaxed bg-panel p-4 rounded-xl border border-border">
              {event.aiSummary}
            </p>

            {/* Grounded Evidence Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {event.evidence.map((ev, i) => (
                <div key={i} className="p-2 bg-panel rounded-lg border border-border text-center">
                  <div className="text-[10px] text-muted">{ev.label}</div>
                  <div className="text-xs font-mono font-bold text-accent mt-0.5">{ev.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between">
          <div className="text-[11px] font-mono text-muted">
            Ref: NTRO-INCIDENT-{event.topicId.toUpperCase()}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                router.push(`/timeline?topic=${event.topicId}`);
              }}
              className="btn btn-ghost text-xs py-1.5 px-3"
            >
              Open Full Timeline
            </button>
            <button
              onClick={() => {
                onClose();
                router.push('/ai-analyst');
              }}
              className="btn btn-primary text-xs py-1.5 px-3"
            >
              Ask AI Analyst
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
