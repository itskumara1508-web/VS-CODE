import React, { useState } from 'react';
import {
  Users,
  ShieldAlert,
  MapPin,
  Sparkles,
  Compass,
  CheckCircle,
  Hash,
} from 'lucide-react';
import { audienceDemographics } from '../data/mockData';

export const AudienceDNA: React.FC = () => {
  const [activeGeo, setActiveGeo] = useState<string>('Delhi NCR');
  const { age, languages, geography, interests, confidence, disclaimer } = audienceDemographics;

  return (
    <section id="audience" className="w-full py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
              <Users className="w-4 h-4" />
              <span>Module C • Automated Demographic Profiling</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Audience DNA & Spatial Clusters
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Aggregated population cohorts, multilingual distribution, and regional density inferred from public discourse signals.
            </p>
          </div>

          {/* Prominent Confidence & Ethics Badge */}
          <div className="mt-4 md:mt-0 flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-400/40 shadow-glow-cyan font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold">AI ESTIMATE • {confidence}% CONFIDENCE</span>
          </div>
        </div>

        {/* Ethical Privacy Guarantee Banner */}
        <div className="glass-panel rounded-xl p-3.5 mb-8 border border-emerald-500/30 flex items-start space-x-3 text-xs font-mono">
          <ShieldAlert className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-slate-300">
            <span className="text-emerald-300 font-bold uppercase mr-1">Privacy Guarantee:</span>
            {disclaimer}
          </div>
        </div>

        {/* 4 Demographics Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 1. Age Cohorts */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase">Age Distribution</h3>
              <span className="text-[10px] font-mono text-slate-400">4 BANDS</span>
            </div>

            <div className="space-y-3.5">
              {age.map((item) => (
                <div key={item.range}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">{item.range}</span>
                    <span className="text-cyan-300 font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              Youth skew: <span className="text-cyan-400 font-bold">73%</span> under age 35 driving early narrative amplification.
            </div>
          </div>

          {/* 2. Multilingual Composition */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold text-violet-300 uppercase">Languages</h3>
              <span className="text-[10px] font-mono text-slate-400">BHARAT NLP</span>
            </div>

            <div className="space-y-3.5">
              {languages.map((item) => (
                <div key={item.language}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">{item.language}</span>
                    <span className="text-violet-300 font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              Hindi & Hinglish account for <span className="text-violet-400 font-bold">58%</span> of cumulative engagement.
            </div>
          </div>

          {/* 3. Topical Interests */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold text-emerald-300 uppercase">Top Interests</h3>
              <span className="text-[10px] font-mono text-slate-400">INDEX /100</span>
            </div>

            <div className="space-y-2.5">
              {interests.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs font-mono"
                >
                  <div className="flex items-center space-x-2">
                    <Hash className="w-3 h-3 text-emerald-400" />
                    <span className="text-slate-200 truncate">{item.name}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{item.score}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              High cross-affinity between <span className="text-emerald-300 font-semibold">AI</span> & <span className="text-emerald-300 font-semibold">Cybersecurity</span>.
            </div>
          </div>

          {/* 4. Geography Ranking */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-bold text-amber-300 uppercase">Geographic Hubs</h3>
              <span className="text-[10px] font-mono text-slate-400">REGIONS</span>
            </div>

            <div className="space-y-2.5">
              {geography.map((item) => (
                <button
                  key={item.region}
                  onClick={() => setActiveGeo(item.region)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs font-mono transition-all text-left ${
                    activeGeo === item.region
                      ? 'bg-amber-500/20 text-amber-200 border-amber-400/50'
                      : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <MapPin className={`w-3 h-3 ${activeGeo === item.region ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.region}</span>
                  </div>
                  <span className="font-bold">{item.percentage}%</span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              Delhi NCR, Mumbai & BLR represent <span className="text-amber-400 font-bold">57%</span> of initial discourse volume.
            </div>
          </div>
        </div>

        {/* Futuristic India Geographic Radar Visualizer */}
        <div className="glass-panel rounded-xl p-6 border border-cyan-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-2 text-cyan-300 font-bold uppercase">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>National Spatial Cluster Radar • Bharat Discourse Grid</span>
            </div>
            <span className="text-slate-400 mt-1 sm:mt-0">
              Active Regional Focus: <strong className="text-white">{activeGeo}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Radar Canvas / Graphic */}
            <div className="lg:col-span-2 relative h-64 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center overflow-hidden">
              {/* Radar concentric rings */}
              <div className="absolute w-48 h-48 rounded-full border border-cyan-500/20 animate-pulse" />
              <div className="absolute w-32 h-32 rounded-full border border-cyan-500/30" />
              <div className="absolute w-16 h-16 rounded-full border border-cyan-500/40" />

              {/* Crosshair lines */}
              <div className="absolute w-full h-[1px] bg-cyan-500/10" />
              <div className="absolute h-full w-[1px] bg-cyan-500/10" />

              {/* Rotating radar sweep */}
              <div
                className="absolute w-48 h-48 rounded-full pointer-events-none animate-radar-sweep"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(0, 240, 255, 0.25) 0deg, transparent 60deg, transparent 360deg)',
                }}
              />

              {/* Nodes representing Indian Metros */}
              {geography.map((g) => {
                // Project lat/lng to stylized coordinate box
                const xPct = Math.min(85, Math.max(15, ((g.coordinates[1] - 70) / (85 - 70)) * 70 + 15));
                const yPct = Math.min(85, Math.max(15, 100 - ((g.coordinates[0] - 10) / (32 - 10)) * 70 - 15));
                const isSelected = activeGeo === g.region;

                return (
                  <button
                    key={g.region}
                    onClick={() => setActiveGeo(g.region)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all ${
                      isSelected ? 'scale-125' : 'hover:scale-110'
                    }`}
                    style={{ left: `${xPct}%`, top: `${yPct}%` }}
                  >
                    <div className="relative flex items-center justify-center">
                      {isSelected && (
                        <span className="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping" />
                      )}
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 ${
                          isSelected
                            ? 'bg-cyan-400 border-white shadow-glow-cyan'
                            : 'bg-slate-800 border-cyan-400/60'
                        }`}
                      />
                    </div>
                    <span
                      className={`absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                          : 'bg-slate-900/90 text-slate-400'
                      }`}
                    >
                      {g.region} ({g.percentage}%)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Region Details Inspector */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400 uppercase">Selected Region</span>
                <span className="text-cyan-300 font-bold">{activeGeo}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase">Est. Users</span>
                  <span className="text-white font-bold">
                    {geography.find((g) => g.region === activeGeo)?.count.toLocaleString() || '2,377'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block uppercase">Share</span>
                  <span className="text-cyan-400 font-bold">
                    {geography.find((g) => g.region === activeGeo)?.percentage || 28}%
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>Dominant Language: Hindi / Hinglish</span>
                </p>
                <p className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3 h-3 text-cyan-400" />
                  <span>Primary Vector: X Handles & Telegram Broadcasts</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
