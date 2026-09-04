import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  Clock,
  Sparkles,
  ArrowUpRight,
  Target,
} from 'lucide-react';
import { TrendItem } from '../types';

interface TrendRadarProps {
  trends: TrendItem[];
}

export const TrendRadar: React.FC<TrendRadarProps> = ({ trends }) => {
  const [selectedTopic, setSelectedTopic] = useState<TrendItem>(trends[0]);

  const getStatusBadge = (status: TrendItem['status']) => {
    switch (status) {
      case 'VIRAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse';
      case 'RISING':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'STABLE':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      case 'DECLINING':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <section id="trends" className="w-full py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Module D • Real-Time Trend & Topic Detection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Rising Narratives & Velocity Radar
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Algorithmic burst identification tracking rate of engagement acceleration, unique node adoption, and viral peak forecasts.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-mono">
            <span className="px-2 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>TOPIC ACCELERATION ACTIVE</span>
            </span>
          </div>
        </div>

        {/* Prediction Card & Constellation Visualizer Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Trending Topic Prediction Card */}
          <div className="lg:col-span-5 glass-panel-glow rounded-xl p-6 border border-cyan-400/40 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  TRENDING TOPIC PREDICTION
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedTopic.predictionConfidence}% CONFIDENCE</span>
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
                {selectedTopic.topic}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Originating in <span className="text-cyan-300 font-semibold">{selectedTopic.originCommunity}</span>, this narrative is accelerating along a power-law adoption curve across 4 distinct community silos.
              </p>

              {/* Predictive Stat Badges */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Current Velocity</span>
                  <span className="text-base font-bold text-rose-400">+{selectedTopic.velocity}% / hr</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Predicted Peak</span>
                  <span className="text-base font-bold text-cyan-300 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedTopic.predictedPeak}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Category: {selectedTopic.category}</span>
              <span className="text-cyan-400">Rank #{selectedTopic.rank} in National Grid</span>
            </div>
          </div>

          {/* Trend Velocity Constellation / Scatter Radar */}
          <div className="lg:col-span-7 glass-panel rounded-xl p-6 border border-cyan-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                <span>Trend Velocity Constellation</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Viral (&gt;30%)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Rising (15-30%)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>Stable (&lt;15%)</span>
                </span>
              </div>
            </div>

            {/* Constellation Radar Plot */}
            <div className="relative w-full h-56 rounded-xl bg-slate-950/70 border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
              {/* Radar concentric circles */}
              <div className="absolute w-56 h-56 rounded-full border border-slate-800" />
              <div className="absolute w-40 h-40 rounded-full border border-slate-800" />
              <div className="absolute w-24 h-24 rounded-full border border-slate-800" />
              <div className="absolute w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 animate-ping" />

              {/* Constellation Dots */}
              {trends.map((t, idx) => {
                const angle = (idx / trends.length) * Math.PI * 2 + 0.4;
                const distance = 35 + (t.growth / 360) * 55;
                const x = 50 + Math.cos(angle) * (distance * 0.42);
                const y = 50 + Math.sin(angle) * (distance * 0.42);
                const isSelected = selectedTopic.topic === t.topic;

                return (
                  <button
                    key={t.topic}
                    onClick={() => setSelectedTopic(t)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all group z-10 ${
                      isSelected ? 'scale-125' : 'hover:scale-110'
                    }`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${
                          t.status === 'VIRAL'
                            ? 'bg-rose-500 shadow-glow-cyan'
                            : t.status === 'RISING'
                            ? 'bg-amber-400'
                            : 'bg-cyan-400'
                        } ${isSelected ? 'ring-2 ring-white' : ''}`}
                      />
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-800 group-hover:text-white">
                        {t.topic} (+{t.growth}%)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Radial distance indicates cumulative growth acceleration.</span>
              <span className="text-cyan-400 font-bold">5 ACTIVE THREADS MAPPED</span>
            </div>
          </div>
        </div>

        {/* Ranked Narrative Table */}
        <div className="glass-panel rounded-xl border border-cyan-500/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
            <span className="text-cyan-300 font-bold">Ranked Real-Time Narratives</span>
            <span className="text-slate-400">SORTED BY VELOCITY MOMENTUM</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {trends.map((t) => {
              const isSelected = selectedTopic.topic === t.topic;
              return (
                <div
                  key={t.topic}
                  onClick={() => setSelectedTopic(t)}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 sm:px-6 cursor-pointer transition-all ${
                    isSelected ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400' : 'hover:bg-slate-900/50'
                  }`}
                >
                  {/* Left: Rank & Topic */}
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-mono font-bold text-slate-500 w-8">
                      0{t.rank}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white tracking-wide">{t.topic}</h4>
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded border ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {t.category} • {t.originCommunity}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Metrics */}
                  <div className="flex items-center space-x-6 my-3 md:my-0 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Mentions</span>
                      <span className="font-semibold text-white">{t.mentions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Unique Users</span>
                      <span className="font-semibold text-slate-300">{t.uniqueUsers.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Velocity</span>
                      <span className="font-semibold text-cyan-400">+{t.velocity}%</span>
                    </div>
                  </div>

                  {/* Right: Growth & Action */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right font-mono">
                      <div className="flex items-center text-emerald-400 font-bold text-sm">
                        <ArrowUpRight className="w-4 h-4 mr-0.5" />
                        <span>+{t.growth}%</span>
                      </div>
                      <span className="text-[10px] text-slate-500">24h growth</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
