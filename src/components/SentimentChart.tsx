import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Radio, Sparkles } from 'lucide-react';
import { SentimentTimePoint } from '../types';
import { sentimentTimeline24H, sentimentTimeline7D, sentimentTimeline30D } from '../data/mockData';

export const SentimentChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D'>('24H');

  const data: SentimentTimePoint[] =
    timeRange === '24H'
      ? sentimentTimeline24H
      : timeRange === '7D'
      ? sentimentTimeline7D
      : sentimentTimeline30D;

  const lines = [
    { key: 'supportive', name: 'Supportive (38%)', color: '#10b981' },
    { key: 'excitement', name: 'Excitement (24%)', color: '#00f0ff' },
    { key: 'neutral', name: 'Neutral (18%)', color: '#94a3b8' },
    { key: 'anxiety', name: 'Anxiety (12%)', color: '#f59e0b' },
    { key: 'against', name: 'Against (8%)', color: '#ef4444' },
  ];

  return (
    <div className="glass-panel rounded-xl p-6 border border-cyan-500/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5" />
            <span>Multi-Dimensional Sentiment Inference</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Emotional Timeline</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Composite Score: 72.8/100
            </span>
          </h3>
        </div>

        {/* Time Filters */}
        <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
          {(['24H', '7D', '30D'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded transition-all ${
                timeRange === r
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === '24H' ? '24 Hours' : r === '7D' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Multi-line chart */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.08)" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(7, 13, 30, 0.95)',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
              labelStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '16px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
              }}
            />
            {lines.map((l) => (
              <Line
                key={l.key}
                type="monotone"
                dataKey={l.key}
                name={l.name}
                stroke={l.color}
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: l.color }}
                activeDot={{ r: 6, stroke: '#030712', strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insight Footnote */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-mono gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Supportive & Excitement emotions lead overall discourse at 62% aggregate share.</span>
        </div>
        <span className="text-emerald-400">Net Polarity: +26.0 (Stabilizing)</span>
      </div>
    </div>
  );
};
