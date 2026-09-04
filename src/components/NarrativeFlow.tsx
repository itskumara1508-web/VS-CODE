import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Shield,
  CheckCircle2,
  TrendingDown,
  Globe2,
} from 'lucide-react';
import { narrativeFlowSteps } from '../data/mockData';
import { NarrativeStep } from '../types';

export const NarrativeFlow: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto-play timeline simulation
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % narrativeFlowSteps.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeStep: NarrativeStep = narrativeFlowSteps[currentStepIndex];

  return (
    <section id="narrative" className="w-full py-16 scroll-mt-16 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Cross-Module Synthesis • Core SIH Demonstration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              How a Narrative Spreads
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Cross-correlating Trend Detection, Link Topology, Demographic Sinks, and Sentiment Drift to reconstruct the viral contagion vector.
            </p>
          </div>

          {/* Stepper Playback Controls */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0 font-mono text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Simulation</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setCurrentStepIndex(0);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
              title="Restart from Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Central Synthesis Callout */}
        <div className="glass-panel-glow rounded-xl p-5 mb-8 border border-cyan-400/40">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 font-bold mb-2">
            <span className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>✦ NTRO CROSS-ANALYSIS INTELLIGENCE REPORT</span>
            </span>
            <span className="text-slate-400">VECTOR ID: #NX-26152-VIRAL</span>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">
            "AI Regulation began in <strong className="text-cyan-400">Community A (Tech Research)</strong> and was amplified by <strong className="text-cyan-400">3 high-influence nodes</strong>. It subsequently crossed bridge chokepoints into <strong className="text-cyan-400">Communities B & C</strong>. Negative sentiment surged <strong className="text-rose-400 font-bold">+18%</strong> following regulatory compliance panic across 4 platforms."
          </p>
        </div>

        {/* Horizontal Flow Stages Stepper */}
        <div className="glass-panel rounded-xl p-6 mb-8 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase">
              Narrative Propagation Stepper (Step {activeStep.stepNumber} of {narrativeFlowSteps.length})
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {activeStep.phase}
            </span>
          </div>

          {/* Stepper Node Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {narrativeFlowSteps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.stepNumber}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`p-2.5 rounded-lg border text-left font-mono transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-glow-cyan scale-102'
                      : isPast
                      ? 'bg-slate-900/80 border-cyan-500/30 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold">0{step.stepNumber}</span>
                    {isPast && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                    {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                  </div>
                  <h4 className={`text-xs font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {step.title}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Stage Details & Narrative Context */}
          <div className="lg:col-span-8 glass-panel rounded-xl p-6 border border-cyan-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  STAGE 0{activeStep.stepNumber}
                </span>
                <h3 className="text-xl font-bold text-white">{activeStep.title}</h3>
              </div>

              <p className="text-sm text-cyan-200 font-medium mb-4">
                {activeStep.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed mb-6">
                <span className="text-slate-500 uppercase block mb-1 text-[10px]">Deep Forensic Context</span>
                {activeStep.detail}
              </div>

              {/* Sentiment Shift Callout if applicable */}
              {activeStep.sentimentShiftText && (
                <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-start space-x-2.5 font-mono text-xs text-rose-200 mb-6">
                  <TrendingDown className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-rose-300 uppercase block mb-0.5">Sentiment Inversion:</span>
                    {activeStep.sentimentShiftText}
                  </div>
                </div>
              )}

              {/* Key Actors Involved */}
              <div className="font-mono text-xs">
                <span className="text-slate-500 uppercase block mb-2 text-[10px]">Identified Key Actors</span>
                <div className="flex flex-wrap gap-2">
                  {activeStep.actors.map((actor) => (
                    <span
                      key={actor}
                      className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-slate-200"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom active platform tags */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Channels:</span>
                <div className="flex space-x-1.5">
                  {activeStep.platforms.map((p) => (
                    <span key={p} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <span className="text-emerald-400 font-bold">
                {activeStep.confidenceScore}% MODEL CONFIDENCE
              </span>
            </div>
          </div>

          {/* Right Column: Key Stage Metrics */}
          <div className="lg:col-span-4 glass-panel rounded-xl p-6 border border-cyan-500/20 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
                Stage Metrics & Influx
              </h4>

              <div className="space-y-3 font-mono">
                {activeStep.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-400">{m.label}</span>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-white font-bold">{m.value}</span>
                      {m.delta && (
                        <span className="text-emerald-400 text-[10px] font-semibold">{m.delta}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono text-slate-400">
                <span className="text-cyan-300 uppercase block font-bold mb-1 text-[10px]">
                  Active Community Cluster
                </span>
                <p className="text-slate-200 font-semibold">{activeStep.activeCommunity}</p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>SYNTHESIS: NARRATIVE GRAPH</span>
              <span className="text-cyan-400">STEP 0{activeStep.stepNumber} / 07</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
