import React from 'react';
import {
  Sparkles,
  FileText,
  Clock,
} from 'lucide-react';
import { AIInsight } from '../types';
import { aiIntelligenceInsights } from '../data/mockData';

interface AIInsightsProps {
  onOpenReport: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ onOpenReport }) => {
  const getSeverityStyle = (sev: AIInsight['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'MEDIUM':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      case 'INFO':
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <section id="insights" className="w-full py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Autonomous Reasoning • AI Insight Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              AI-Generated Intelligence Briefings
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Continuous neural heuristics detecting anomalies, coordinated sentiment manipulations, and viral amplification vectors.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-glow-cyan transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Full NTRO Report</span>
            </button>
          </div>
        </div>

        {/* 4 AI Intelligence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiIntelligenceInsights.map((ins, idx) => (
            <div
              key={ins.id}
              className="glass-panel rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="text-cyan-400 font-bold">INSIGHT 0{idx + 1}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{ins.category}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${getSeverityStyle(
                        ins.severity
                      )}`}
                    >
                      {ins.severity}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">
                      {ins.confidence}% CONF
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-wide mb-2">
                  {ins.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {ins.summary}
                </p>

                {/* Supporting Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs text-center mb-4">
                  {ins.supportingMetrics.map((sm) => (
                    <div key={sm.label}>
                      <span className="text-[9px] text-slate-500 uppercase block">{sm.label}</span>
                      <span className="font-bold text-cyan-300">{sm.value}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Operational Action */}
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono">
                  <span className="text-cyan-400 uppercase font-bold text-[10px] block mb-1">
                    ✦ Tactical Action Directive
                  </span>
                  <p className="text-slate-300">{ins.recommendedAction}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>Detected: {ins.timestamp}</span>
                </span>
                <span className="text-cyan-400">NTRO_NEURAL_ENGINE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
