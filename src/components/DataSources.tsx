import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
  ArrowRight,
  Upload,
  Layers,
  Cpu,
  ShieldCheck,
  TrendingUp,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { PlatformSource, IngestionEvent } from '../types';

interface DataSourcesProps {
  sources: PlatformSource[];
  events: IngestionEvent[];
  totalPosts: number;
  activeUsers: number;
  totalInteractions: number;
}

export const DataSources: React.FC<DataSourcesProps> = ({
  sources,
  events,
  totalPosts,
  activeUsers,
  totalInteractions,
}) => {
  const [activeMode, setActiveMode] = useState<'live' | 'historical' | 'upload'>('live');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadStatus(`Parsing ${file.name} (${(file.size / 1024).toFixed(1)} KB)...`);
      setTimeout(() => {
        setUploadStatus(`✓ Successfully ingested 480 simulated posts from ${file.name}!`);
        setTimeout(() => setUploadStatus(null), 4000);
      }, 1200);
    }
  };

  const pipelineStages = [
    { title: 'Social Platforms', desc: 'X, Telegram, Reddit, IG, YT', icon: Radio, color: 'text-cyan-400' },
    { title: 'Data Ingestion', desc: 'Firehose & REST Connectors', icon: Database, color: 'text-blue-400' },
    { title: 'Token & Scrubbing', desc: 'PII Removal & Language Detect', icon: Cpu, color: 'text-indigo-400' },
    { title: 'AI Inference', desc: 'Transformer Sentiment & Graph', icon: Sparkles, color: 'text-violet-400' },
    { title: 'Command Center', desc: 'Real-time NTRO Dashboard', icon: ShieldCheck, color: 'text-emerald-400' },
  ];

  return (
    <section id="sources" className="w-full py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
              <Database className="w-4 h-4" />
              <span>Module A • Continuous Data Collection & Timeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Data Sources & Ingestion Pipeline
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Multi-platform connectors capturing live streams, community messages, and comments across 6 social channels.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-1.5 mt-4 md:mt-0 p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveMode('live')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                activeMode === 'live'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Ingestion
            </button>
            <button
              onClick={() => setActiveMode('historical')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                activeMode === 'historical'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Historical Data
            </button>
            <button
              onClick={() => setActiveMode('upload')}
              className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                activeMode === 'upload'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>CSV/JSON Upload</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between border-l-4 border-l-cyan-400">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase">Total Posts Ingested</p>
              <p className="text-2xl font-bold font-mono text-white mt-0.5">{totalPosts.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between border-l-4 border-l-emerald-400">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase">Monitored User Handles</p>
              <p className="text-2xl font-bold font-mono text-white mt-0.5">{activeUsers.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between border-l-4 border-l-violet-400">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase">Total Interactions</p>
              <p className="text-2xl font-bold font-mono text-white mt-0.5">{totalInteractions.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-violet-500/10 text-violet-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Animated Data Ingestion Pipeline */}
        <div className="glass-panel rounded-xl p-6 mb-10 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono font-semibold tracking-wider text-cyan-300 uppercase">
              End-to-End Ingestion & Processing Architecture
            </h3>
            <span className="text-[10px] font-mono text-slate-500">PIPELINE LATENCY: ~42ms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
            {pipelineStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div key={stage.title} className="relative flex flex-col items-center">
                  <div className="w-full glass-panel rounded-lg p-3 text-center border border-slate-700/60 hover:border-cyan-400/40 transition-all">
                    <div className="inline-flex p-2 rounded-lg bg-slate-900 mb-2 border border-slate-800">
                      <Icon className={`w-5 h-5 ${stage.color}`} />
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-wide">{stage.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{stage.desc}</p>
                  </div>
                  {idx < pipelineStages.length - 1 && (
                    <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="w-4 h-4 text-cyan-400/60 animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upload Mode Modal/Box */}
        {activeMode === 'upload' && (
          <div className="glass-panel-glow rounded-xl p-6 mb-8 border border-cyan-400/40 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>Manual Dataset Ingestion (CSV / JSON)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Upload historical social dumps or custom NTRO intelligence packets for offline processing.
                </p>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                PROTOTYPE UPLOADER
              </span>
            </div>

            <div className="mt-4 border-2 border-dashed border-cyan-500/30 rounded-lg p-6 text-center hover:border-cyan-400/60 transition-all">
              <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-70" />
              <label className="cursor-pointer text-xs font-mono text-cyan-300 hover:text-cyan-200 underline">
                Select CSV / JSON File
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleSimulatedUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500 mt-1">Supports UTF-8 CSV with columns: platform, text, timestamp, author</p>
              {uploadStatus && (
                <div className="mt-3 inline-block px-3 py-1 rounded text-xs font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6 Platform Source Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {sources.map((src) => {
            const isConnected = src.status === 'Connected';
            return (
              <div
                key={src.id}
                className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-cyan-500/30 transition-all duration-200 relative group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: src.color }}
                    />
                    <h3 className="text-sm font-bold text-white">{src.name}</h3>
                  </div>

                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full ${
                      isConnected
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                        : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                    }`}
                  >
                    {isConnected ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-amber-400" />
                    )}
                    <span>{src.status.toUpperCase()}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 h-8">
                  {src.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Posts</span>
                    <span className="text-xs font-bold text-white">{src.postsCollected.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Comments</span>
                    <span className="text-xs font-bold text-white">{src.commentsCollected.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Latency</span>
                    <span className="text-xs font-bold text-cyan-400">{src.apiLatencyMs}ms</span>
                  </div>
                </div>

                {/* Footer status */}
                <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Sync: {src.lastSync}</span>
                  </span>
                  <span className="text-emerald-400/90 font-medium">Health {src.healthScore}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Ingestion Event Stream Ticker */}
        <div className="glass-panel rounded-xl p-5 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-sm font-mono font-semibold tracking-wider text-white uppercase">
                Live Ingestion Event Ticker
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Streaming real-time parsed entries
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/60 hover:border-cyan-500/30 text-xs font-mono transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-slate-500">{evt.time}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                    {evt.platform}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    +{evt.count.toLocaleString()} {evt.type}
                  </span>
                  <span className="text-slate-400 truncate max-w-md hidden md:inline">
                    "{evt.sampleText}"
                  </span>
                </div>

                <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                    {evt.language}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                      evt.sentiment === 'supportive' || evt.sentiment === 'excitement'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : evt.sentiment === 'against' || evt.sentiment === 'anxiety'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {evt.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>DISCLAIMER: DEMO & PROTOYPE FEEDS ACTIVE UNTIL PRODUCTION FASTAPI CREDENTIALS ARE APPLIED</span>
            <span className="text-cyan-400">NTRO_INGEST_NODE_01</span>
          </div>
        </div>
      </div>
    </section>
  );
};
