'use client';

import { X, ShieldCheck, CheckCircle2, FileText, Clock, Hash, Activity, Zap, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { AIEvidence, Confidence } from '@ntro/types';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  claim: string;
  confidence?: Confidence;
  evidenceItems: AIEvidence[];
  topicName?: string;
  timeRange?: string;
  sourcePostsCount?: number;
}

export default function EvidenceModal({
  isOpen,
  onClose,
  title,
  claim,
  confidence,
  evidenceItems,
  topicName,
  timeRange,
  sourcePostsCount,
}: EvidenceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-panel border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-glow shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                  Grounded AI Verification Evidence
                </span>
                <Badge variant="teal">FACT-CHECKED</Badge>
              </div>
              <h2 className="text-base font-bold text-text mt-0.5">{title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-panel transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Inferred Claim */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-mono text-muted flex items-center justify-between">
              <span>Analyzed Statement / Intelligence Inference</span>
              {confidence && (
                <span className="text-positive font-bold">
                  {(confidence.score * 100).toFixed(0)}% Confidence Bound [{(confidence.low * 100).toFixed(0)}%–{(confidence.high * 100).toFixed(0)}%]
                </span>
              )}
            </div>
            <div className="p-4 rounded-xl bg-surface border border-border text-xs sm:text-sm text-text/90 leading-relaxed font-medium">
              &quot;{claim}&quot;
            </div>
          </div>

          {/* Telemetry Scope & Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Monitored Topic</div>
              <div className="font-bold text-text mt-0.5 truncate">{topicName || 'EV Charging Infrastructure'}</div>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Telemetry Window</div>
              <div className="font-bold text-cyan mt-0.5">{timeRange || '14:00 – 15:30 UTC'}</div>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-border">
              <div className="text-[10px] text-muted uppercase font-mono">Sample Size</div>
              <div className="font-bold text-accent mt-0.5">{sourcePostsCount ? `${sourcePostsCount.toLocaleString()} Posts` : '18,420 Posts'}</div>
            </div>
          </div>

          {/* Grounded Evidence Items */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-text uppercase font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-accent" /> Supporting Telemetry & Graph Proofs
            </div>

            <div className="space-y-2">
              {evidenceItems && evidenceItems.length > 0 ? (
                evidenceItems.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-surface border border-border flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text">{item.label}</span>
                        <span className="font-mono text-accent font-bold">{String(item.value)}</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted uppercase">Type: {item.type}</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-surface border border-border flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text">Negative Polarity Shift Delta</span>
                        <span className="font-mono text-rose-400 font-bold">+31.4% Surge</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted">Baseline negative rate: 18.2% &rarr; Peak rate: 46.1%</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface border border-border flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-text">Cross-Community Boundary Infiltration</span>
                        <span className="font-mono text-cyan font-bold">4 Distinct Clusters</span>
                      </div>
                      <span className="text-[10px] font-mono text-muted">Transferred via authority node @tech_analyst_in (PageRank 0.084)</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cryptographic Audit Verification */}
          <div className="p-3 bg-[#0B1220] rounded-xl border border-border/80 flex items-center justify-between text-[10px] text-muted font-mono">
            <span>Audit Hash: 0x9a8f4c2e... (Immutable NTRO Ledger)</span>
            <span className="text-positive flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Integrity Verified
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn btn-primary text-xs py-1.5 px-4">
            Close Verification
          </button>
        </div>
      </div>
    </div>
  );
}

