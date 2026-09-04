import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  Sparkles,
  CornerDownRight,
  Send,
  Zap,
} from 'lucide-react';
import { emotionBreakdown, sampleSarcasmDetections } from '../data/mockData';
import { SarcasmAnalysis } from '../types';
import { apiService } from '../services/api';

export const EmotionDonut: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<SarcasmAnalysis>(sampleSarcasmDetections[0]);
  const [customInput, setCustomInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeCustom = async () => {
    if (!customInput.trim()) return;
    setIsAnalyzing(true);
    const result = await apiService.analyzeCustomPost(customInput);
    setSelectedSample(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
      {/* 1. Emotion Donut Chart & Overall Score */}
      <div className="lg:col-span-5 glass-panel rounded-xl p-6 border border-cyan-500/20 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              Emotion Distribution
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              5 CLASSES
            </span>
          </div>

          {/* Donut with Center Score */}
          <div className="relative w-full h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={86}
                  paddingAngle={3}
                >
                  {emotionBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#030712" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(7, 13, 30, 0.95)',
                    borderColor: 'rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [`${val}%`, 'Discourse Share']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Sentiment Score */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-mono uppercase text-slate-400">Overall</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300">72.8</span>
              <span className="text-[9px] font-mono text-emerald-400 font-semibold">POSITIVE</span>
            </div>
          </div>

          {/* Legend Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-800/80 font-mono text-xs">
            {emotionBreakdown.map((item) => (
              <div key={item.name} className="flex items-center space-x-1.5 p-1 rounded bg-slate-900/60 border border-slate-800">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}</span>
                <span className="text-white font-bold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="mt-4 p-3.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono">
          <div className="flex items-center justify-between text-cyan-300 font-bold mb-1">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>✦ AI EMOTION INSIGHT</span>
            </span>
            <span className="text-[10px] text-slate-400">89% CONFIDENCE</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            "Negative sentiment increased 18% after a high-influence account amplified the topic regarding startup compliance burdens."
          </p>
        </div>
      </div>

      {/* 2. Sarcasm & Innuendo Decoder (Natural Language Intelligence) */}
      <div className="lg:col-span-7 glass-panel rounded-xl p-6 border border-cyan-500/20 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-violet-400 uppercase tracking-wider mb-0.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Deep Semantic Inversion & Nuance Detection</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Sarcasm & Innuendo Decoder
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded">
              SIH BENCHMARK
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Traditional lexicons misclassify cynical posts containing positive tokens ("amazing", "great job"). PulseX isolates polarity clashes and emoji context.
          </p>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {sampleSarcasmDetections.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setSelectedSample(s)}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-all ${
                  selectedSample.id === s.id
                    ? 'bg-violet-500/20 text-violet-200 border-violet-400/50 shadow-glow-violet'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Sample #{idx + 1} ({s.detectedNuance})
              </button>
            ))}
          </div>

          {/* Active Post Analysis Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-violet-500/30 shadow-inner-glow mb-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-cyan-400">{selectedSample.author} • {selectedSample.platform}</span>
              <span className="px-2 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-700/50">
                Nuance: {selectedSample.detectedNuance}
              </span>
            </div>

            <p className="text-sm font-medium text-white italic mb-3">
              "{selectedSample.postText}"
            </p>

            {/* Inference Comparison Table */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-center font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Surface Tokens</span>
                <span className="font-semibold text-emerald-400">{selectedSample.apparentSentiment}</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">AI Actual Sentiment</span>
                <span className="font-bold text-rose-400">{selectedSample.actualSentiment}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Model Confidence</span>
                <span className="font-bold text-cyan-300">{selectedSample.confidence}%</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-400 leading-relaxed flex items-start space-x-1.5 font-mono">
              <CornerDownRight className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
              <span>{selectedSample.explanation}</span>
            </div>
          </div>
        </div>

        {/* Live Input Tester */}
        <div className="pt-3 border-t border-slate-800/80">
          <span className="text-xs font-mono text-slate-400 block mb-1.5">
            Test custom post or phrase:
          </span>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Oh brilliant, our system crashed during the audit 🙃"
              className="flex-1 glass-input px-3 py-2 text-xs rounded-lg font-mono focus:ring-1 focus:ring-violet-400"
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeCustom()}
            />
            <button
              onClick={handleAnalyzeCustom}
              disabled={isAnalyzing || !customInput.trim()}
              className="px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs flex items-center space-x-1 disabled:opacity-50 transition-all"
            >
              <Send className="w-3 h-3" />
              <span>{isAnalyzing ? 'Testing...' : 'Infer'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
