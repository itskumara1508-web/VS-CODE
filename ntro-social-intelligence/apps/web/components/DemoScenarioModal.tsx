'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  X,
  Sparkles,
  TrendingUp,
  Smile,
  Share2,
  Crown,
  Layers,
  Activity,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { DEMO_SCENARIOS } from '@ntro/shared';
import type { DemoScenarioId } from '@ntro/types';
import { api } from '@/lib/api';

interface DemoScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSimulation: (scenarioId: DemoScenarioId) => void;
}

export default function DemoScenarioModal({
  isOpen,
  onClose,
  onStartSimulation,
}: DemoScenarioModalProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<DemoScenarioId>('emerging_trend');
  const [running, setRunning] = useState(false);
  const [stepMessage, setStepMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLaunch = async () => {
    setRunning(true);
    setStepMessage('Initializing SIH Demonstration Scenario...');

    try {
      await api.demoEvent();
      setTimeout(() => {
        setStepMessage('Injecting Multi-Platform Telemetry...');
        setTimeout(() => {
          setStepMessage('Scenario Active! Updating Dashboards...');
          setTimeout(() => {
            setRunning(false);
            setStepMessage(null);
            onStartSimulation(selectedId);
            onClose();
          }, 800);
        }, 700);
      }, 600);
    } catch (e) {
      console.error(e);
      setRunning(false);
      setStepMessage(null);
    }
  };

  const getScenarioIcon = (id: DemoScenarioId) => {
    switch (id) {
      case 'emerging_trend':
        return <TrendingUp className="w-5 h-5 text-highlight" />;
      case 'sentiment_shift':
        return <Smile className="w-5 h-5 text-rose-400" />;
      case 'rapid_propagation':
        return <Share2 className="w-5 h-5 text-accent" />;
      case 'influencer_amplification':
        return <Crown className="w-5 h-5 text-cyan" />;
      case 'cross_platform':
        return <Layers className="w-5 h-5 text-accent" />;
      case 'community_polarization':
        return <Activity className="w-5 h-5 text-highlight" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-panel border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-highlight/15 border border-highlight/30 flex items-center justify-center text-highlight shadow-glowAmber shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-highlight font-bold">
                  SOCIOINTELL SIH Demonstration Control Center
                </span>
                <Badge variant="amber">6 INTERACTIVE SCENARIOS</Badge>
              </div>
              <h2 className="text-base font-bold text-text mt-0.5">Select SIH Evaluation Scenario</h2>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-panel transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Scenario Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs text-muted leading-relaxed">
            Select an operational incident scenario to simulate continuous data harvesting, sentiment shift alerting, authority node amplification, and information cascade across the entire platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {DEMO_SCENARIOS.map((sc) => {
              const isSelected = selectedId === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedId(sc.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-surface border-accent shadow-glow'
                      : 'bg-surface/50 border-border hover:border-cyan/40 hover:bg-surface/80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-panel border border-border">
                          {getScenarioIcon(sc.id)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-text">{sc.title}</div>
                          <span className="text-[10px] font-mono text-muted uppercase">{sc.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                        {sc.highlightMetric}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted leading-relaxed line-clamp-2">
                      {sc.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-border/80 flex items-center justify-between text-[10px] font-mono text-muted">
                    <span>Topic: <strong className="text-text">{sc.affectedTopic}</strong></span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-accent" /> {sc.durationMinutes} min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between">
          <div className="text-xs text-muted font-mono">
            {stepMessage ? (
              <span className="text-accent flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> {stepMessage}
              </span>
            ) : (
              <span>Ready to demonstrate complete 5-question intelligence pipeline</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn btn-ghost text-xs py-1.5 px-3">
              Cancel
            </button>
            <button
              onClick={handleLaunch}
              disabled={running}
              className="btn btn-amber text-xs py-1.5 px-5 font-bold shadow-glowAmber flex items-center gap-1.5"
            >
              {running ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Simulating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>START SIH SIMULATION</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

