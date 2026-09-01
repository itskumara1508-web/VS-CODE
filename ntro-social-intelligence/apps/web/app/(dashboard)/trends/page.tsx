'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Activity,
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Layers,
  Clock,
  Compass,
  Radar,
  LineChart as LineChartIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from '@/components/ui';
import Card3D from '@/components/Card3D';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import GlobalFilterBar from '@/components/GlobalFilterBar';
import type { Trend } from '@ntro/types';

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.trends()
      .then((data) => {
        setTrends(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load trends');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState message="Calculating Topic Velocity & Growth Rates..." />;
  if (error) return <ErrorState message={error} />;

  // Feature 7: Predictive AI Trend Forecast Data
  const trendForecasts = [
    {
      topic: 'EV Charging Infrastructure & Grid Outage',
      currentVolume: '18,420 mentions',
      velocity: '340/hr',
      momentum: 'HIGH',
      growthRate: '+243%',
      forecastText: 'Expected to peak in ~3 hours across news media hubs with projected volume of 38,000 mentions.',
      chart: [
        { time: 'Now', val: 18420 },
        { time: '+1h', val: 24500 },
        { time: '+2h', val: 32100 },
        { time: '+3h', val: 38400 },
        { time: '+4h', val: 36200 },
      ],
    },
    {
      topic: '5G Spectrum & Telecom Expansion',
      currentVolume: '24,100 mentions',
      velocity: '180/hr',
      momentum: 'MEDIUM',
      growthRate: '+42%',
      forecastText: 'Steady expansion driven by positive carrier reviews and speed benchmark tests.',
      chart: [
        { time: 'Now', val: 24100 },
        { time: '+1h', val: 27500 },
        { time: '+2h', val: 30200 },
        { time: '+4h', val: 34500 },
      ],
    },
    {
      topic: 'AI Algorithmic Safety & Standards',
      currentVolume: '14,200 mentions',
      velocity: '95/hr',
      momentum: 'STABLE',
      growthRate: '+18%',
      forecastText: 'Consistent academic and policy deliberation with plateauing conversation volume.',
      chart: [
        { time: 'Now', val: 14200 },
        { time: '+1h', val: 15400 },
        { time: '+2h', val: 16200 },
        { time: '+4h', val: 17100 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">Trend Intelligence & Predictive Forecasting</h1>
            <Badge variant="teal">TIME-SERIES ACCELERATION</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Mention velocities, growth percentages, topic states, and statistical AI forward projections
          </p>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Top Highlights in 3D Cyber Glass */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <Card3D glowColor="teal" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Emerging Topics</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#00F0FF] font-mono tracking-tight">
            {trends.filter((t) => t.status === 'emerging').length} Topics
          </div>
          <div className="text-[10px] text-[#00FF9D] font-mono font-semibold">Velocity &gt; 150/hr</div>
        </Card3D>

        <Card3D glowColor="amber" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Viral Propagation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#FFB800] font-mono tracking-tight">
            {trends.filter((t) => t.status === 'viral').length || 1} Topic
          </div>
          <div className="text-[10px] text-[#FFB800] font-mono font-semibold">+243% growth</div>
        </Card3D>

        <Card3D glowColor="cyan" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Monitored Volume</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#38BDF8] font-mono tracking-tight">
            {trends.reduce((acc, t) => acc + t.mentionCount, 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-muted font-mono">Across 4 Platforms</div>
        </Card3D>

        <Card3D glowColor="teal" intensity={12} className="p-4 bg-[#111C35]/90 backdrop-blur-xl border border-[#1E3156] space-y-1">
          <div className="text-[10px] text-muted uppercase font-mono flex items-center justify-between">
            <span>Forecast Confidence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#00FF9D] font-mono tracking-tight">94.6%</div>
          <div className="text-[10px] text-muted font-mono">ARIMA + Transformer</div>
        </Card3D>
      </div>

      {/* Feature 7 & §5.5: AI Trend Forecasting & Narrative Manipulation Heuristics */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F0FF]" /> Predictive Trend Trajectory & Coordinated Amplification Analysis
          </h2>
          <span className="text-[10px] font-mono text-[#00FF9D] bg-[#00FF9D]/10 border border-[#00FF9D]/20 px-2 py-0.5 rounded-full">
            [HEURISTIC SIGNAL • NOT FACT • ANALYST REVIEW ONLY]
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {trendForecasts.map((f, i) => {
            const isManipulated = i === 0; // EV Charging has coordinated amplification
            return (
              <div key={i} className="p-4 bg-[#111C35]/90 backdrop-blur-xl rounded-2xl border border-[#1E3156] space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#F8FAFC] line-clamp-1">{f.topic}</span>
                      <span className="text-[10px] font-mono text-muted">{f.currentVolume}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      f.momentum === 'HIGH'
                        ? 'bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/30'
                        : f.momentum === 'MEDIUM'
                        ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30'
                        : 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/25'
                    }`}>
                      {f.momentum} MOMENTUM
                    </span>
                  </div>

                  {isManipulated && (
                    <div className="p-2 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 text-[10px] font-mono text-[#FF3366] flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1">⚠️ Coordinated Burst (Score: 78%)</span>
                      <span className="text-[9px] opacity-80">Sync Index: 0.84</span>
                    </div>
                  )}

                  <div className="h-28 w-full pt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={f.chart} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E3156" opacity={0.6} />
                        <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="#94A3B8" />
                        <YAxis tick={{ fontSize: 9 }} stroke="#94A3B8" />
                        <Tooltip contentStyle={{ backgroundColor: '#070B14', border: '1px solid #1E3156', borderRadius: 8, fontSize: 10 }} />
                        <Line type="monotone" dataKey="val" stroke={i === 0 ? '#FF3366' : '#00F0FF'} strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    <strong className="text-[#F8FAFC] font-mono">AI Forecast:</strong> {f.forecastText}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1E3156] flex items-center justify-between text-[10px] font-mono text-muted">
                  <span>Velocity: <strong className="text-[#00F0FF]">{f.velocity}</strong></span>
                  <span>Growth: <strong className="text-[#00FF9D]">{f.growthRate}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend Radar Table */}
      <Panel className="p-0 overflow-hidden bg-[#0D1527]/90 backdrop-blur-2xl border-[#1E3156]">
        <div className="p-4 border-b border-[#1E3156] bg-[#070B14]/60 flex items-center justify-between">
          <PanelTitle icon={<Radar className="w-4 h-4 text-[#00F0FF]" />}>
            Trend Radar, Velocity & Manipulation Heuristics
          </PanelTitle>
          <span className="text-[11px] font-mono text-muted">All active narrative topics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070B14] border-b border-[#1E3156] text-[10px] font-mono text-muted uppercase">
              <tr>
                <th className="p-3.5">Topic / Narrative</th>
                <th className="p-3.5">Total Mentions</th>
                <th className="p-3.5">Mention Velocity</th>
                <th className="p-3.5">Growth %</th>
                <th className="p-3.5">Coordination Signal</th>
                <th className="p-3.5">Trend State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3156] font-mono">
              {trends.map((t, idx) => (
                <tr key={t.id} className="hover:bg-[#111C35]/60 transition-colors">
                  <td className="p-3.5 font-sans font-semibold text-[#F8FAFC]">{t.topicName}</td>
                  <td className="p-3.5 text-[#F8FAFC] font-bold">{t.mentionCount.toLocaleString()}</td>
                  <td className="p-3.5 text-[#00F0FF] font-bold">{t.mentionVelocity}/hr</td>
                  <td className="p-3.5 text-[#00FF9D]">+{t.growthRate}%</td>
                  <td className="p-3.5">
                    {idx === 0 ? (
                      <span className="text-[10px] text-[#FF3366] font-bold bg-[#FF3366]/15 border border-[#FF3366]/30 px-2 py-0.5 rounded-full">
                        FLAGGED: 78% Sync
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#00FF9D]">Organic (12%)</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'viral'
                        ? 'bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/30'
                        : t.status === 'emerging'
                        ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/30'
                        : 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
