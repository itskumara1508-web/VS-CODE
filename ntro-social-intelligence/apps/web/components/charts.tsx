'use client';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CHART_PALETTE = ['#19D3C5', '#38BDF8', '#F5B942', '#22C55E', '#818CF8', '#F43F5E', '#A78BFA'];

export function SentimentAreaChart({
  data,
}: {
  data: Array<{ timestamp: string; positive: number; negative: number; neutral: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="posGradTeal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#19D3C5" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#19D3C5" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="negGradRose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        />
        <Legend wrapperStyle={{ color: '#F8FAFC', fontSize: 11 }} />
        <Area type="monotone" dataKey="positive" stroke="#19D3C5" strokeWidth={2} fill="url(#posGradTeal)" name="Positive" />
        <Area type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} fill="url(#negGradRose)" name="Negative" />
        <Area type="monotone" dataKey="neutral" stroke="#94A3B8" strokeWidth={1.5} fill="transparent" name="Neutral" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function EmotionPieChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={entries}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={92}
          innerRadius={48}
          paddingAngle={2}
          stroke="#162238"
          strokeWidth={2}
          label
        >
          {entries.map((_, i) => (
            <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
          }}
        />
        <Legend wrapperStyle={{ color: '#F8FAFC', fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PlatformBarChart({ data }: { data: Array<{ platform: string; count: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
        <XAxis dataKey="platform" tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
          }}
        />
        <Bar dataKey="count" fill="#38BDF8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EngagementLineChart({
  data,
}: {
  data: Array<{ timestamp: string; likes: number; comments: number; shares: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
          }}
        />
        <Legend wrapperStyle={{ color: '#F8FAFC', fontSize: 11 }} />
        <Line type="monotone" dataKey="likes" stroke="#19D3C5" strokeWidth={2} name="Likes" dot={{ r: 3, fill: '#19D3C5' }} />
        <Line type="monotone" dataKey="comments" stroke="#38BDF8" strokeWidth={2} name="Comments" dot={{ r: 3, fill: '#38BDF8' }} />
        <Line type="monotone" dataKey="shares" stroke="#F5B942" strokeWidth={2} name="Shares" dot={{ r: 3, fill: '#F5B942' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TrendBarChart({ data }: { data: Array<{ topicName: string; mentionVelocity: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
        <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <YAxis type="category" dataKey="topicName" width={160} tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
          }}
        />
        <Bar dataKey="mentionVelocity" fill="#F5B942" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StanceBarChart({ data }: { data: { support: number; against: number; neutral: number } }) {
  const chartData = [
    { name: 'Support', value: data.support, fill: '#19D3C5' },
    { name: 'Neutral', value: data.neutral, fill: '#94A3B8' },
    { name: 'Against', value: data.against, fill: '#EF4444' },
  ];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EmotionBarChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data)
    .map(([name, value]) => ({ name: name.toUpperCase(), value: Math.round(value * 10) / 10 }))
    .sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
        <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
          }}
        />
        <Bar dataKey="value" fill="#38BDF8" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DemographicBarChart({ data }: { data: Array<{ label: string; percentage: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
        <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" unit="%" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
          }}
        />
        <Bar dataKey="percentage" fill="#19D3C5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TopicEvolutionChart({
  data,
}: {
  data: Array<{ timestamp: string; topicA: number; topicB: number; topicC: number; topicD: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#223354" opacity={0.6} />
        <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#162238',
            border: '1px solid #223354',
            color: '#F8FAFC',
            borderRadius: 8,
          }}
        />
        <Legend wrapperStyle={{ color: '#F8FAFC', fontSize: 11 }} />
        <Area type="monotone" dataKey="topicA" stroke="#F5B942" fill="#F5B942" fillOpacity={0.25} name="EV Charging" />
        <Area type="monotone" dataKey="topicB" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.25} name="5G Rollout" />
        <Area type="monotone" dataKey="topicC" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="AI Regulation" />
        <Area type="monotone" dataKey="topicD" stroke="#19D3C5" fill="#19D3C5" fillOpacity={0.25} name="UPI Payments" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
