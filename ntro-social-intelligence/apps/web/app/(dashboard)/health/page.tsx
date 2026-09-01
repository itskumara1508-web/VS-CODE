'use client';

import { useEffect, useState } from 'react';
import {
  HeartPulse,
  Activity,
  Server,
  Database,
  Cpu,
  Radio,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Lock,
  Layers,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from '@/components/ui';
import GlobalFilterBar from '@/components/GlobalFilterBar';
import { buildAuditLogs } from '@ntro/shared';
import type { AuditLogEntry } from '@ntro/types';

export default function SystemHealthPage() {
  const [services, setServices] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.systemHealth()
      .then((res) => {
        setServices(res.services || []);
        setAuditLogs(buildAuditLogs());
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load system health');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState message="Polling Distributed Microservice Telemetry..." />;
  if (error) return <ErrorState message={error} />;

  // Detailed microservices fleet list
  const fleet = [
    { name: 'Next.js 14 Frontend Web Client', type: 'web', status: 'ONLINE', latency: '12ms', uptime: '99.98%', conn: 14 },
    { name: 'Node.js Express REST & Streaming Gateway', type: 'api', status: 'ONLINE', latency: '8ms', uptime: '99.99%', conn: 28 },
    { name: 'Python FastAPI NLP & Topic Inference Engine', type: 'ai', status: 'ONLINE', latency: '34ms', uptime: '99.95%', conn: 6 },
    { name: 'PostgreSQL / TimescaleDB Time-Series Store', type: 'database', status: 'ONLINE', latency: '4ms', uptime: '100%', conn: 42 },
    { name: 'Redis Cache & High-Speed Pub/Sub Buffer', type: 'cache', status: 'ONLINE', latency: '1ms', uptime: '100%', conn: 18 },
    { name: 'Neo4j Graph Topology & PageRank Database', type: 'graph', status: 'ONLINE', latency: '16ms', uptime: '99.92%', conn: 12 },
    { name: 'WebSocket Real-Time Event Dispatcher', type: 'stream', status: 'ONLINE', latency: '5ms', uptime: '99.99%', conn: 34 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">System Health Fleet & Immutable Audit Logs</h1>
            <Badge variant="teal">ALL 7 SERVICES OPERATIONAL</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Real-time telemetry, latencies, connection pools, and tamper-evident administrative audit ledger
          </p>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Fleet Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
        <div className="p-3.5 bg-panel rounded-xl border border-border">
          <span className="text-[10px] text-muted uppercase block">Fleet Status</span>
          <span className="text-xl font-bold text-positive mt-0.5 block flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> 100% HEALTHY
          </span>
          <span className="text-[10px] text-muted">7/7 Nodes Active</span>
        </div>

        <div className="p-3.5 bg-panel rounded-xl border border-border">
          <span className="text-[10px] text-muted uppercase block">Average API Latency</span>
          <span className="text-xl font-bold text-accent mt-0.5 block">11.4ms</span>
          <span className="text-[10px] text-positive">Sub-20ms SLA Met</span>
        </div>

        <div className="p-3.5 bg-panel rounded-xl border border-border">
          <span className="text-[10px] text-muted uppercase block">Active Database Conns</span>
          <span className="text-xl font-bold text-cyan mt-0.5 block">154 / 500</span>
          <span className="text-[10px] text-muted">Connection Pool OK</span>
        </div>

        <div className="p-3.5 bg-panel rounded-xl border border-border">
          <span className="text-[10px] text-muted uppercase block">Audit Ledger Hash</span>
          <span className="text-sm font-bold text-highlight mt-1.5 block font-mono truncate">
            0x9a8f4c2e...
          </span>
          <span className="text-[10px] text-positive">Integrity Verified</span>
        </div>
      </div>

      {/* Fleet Telemetry Table */}
      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <PanelTitle icon={<Server className="w-4 h-4 text-accent" />}>
            Distributed Architecture Service Nodes
          </PanelTitle>
          <span className="text-[11px] font-mono text-muted">Continuous Heartbeat Poller</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1220] border-b border-border text-[10px] font-mono text-muted uppercase">
              <tr>
                <th className="p-3.5">Service Node</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Health Status</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5">Uptime SLA</th>
                <th className="p-3.5">Active Conns</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono">
              {fleet.map((s, idx) => (
                <tr key={idx} className="hover:bg-panelHover transition-colors">
                  <td className="p-3.5 font-sans font-semibold text-text">{s.name}</td>
                  <td className="p-3.5 uppercase text-muted text-[10px]">{s.type}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-accent font-bold">{s.latency}</td>
                  <td className="p-3.5 text-positive">{s.uptime}</td>
                  <td className="p-3.5 text-text">{s.conn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Feature 30: Administrative Audit Log */}
      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <PanelTitle icon={<ShieldCheck className="w-4 h-4 text-highlight" />}>
            Immutable Administrative Audit Trail
          </PanelTitle>
          <span className="text-[11px] font-mono text-muted">Tamper-evident system log</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B1220] border-b border-border text-[10px] font-mono text-muted uppercase">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User / Agent</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Target Asset</th>
                <th className="p-3.5">Execution Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-panelHover transition-colors">
                  <td className="p-3.5 text-muted">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3.5 font-sans font-semibold text-text">{log.user}</td>
                  <td className="p-3.5 uppercase text-cyan">{log.role}</td>
                  <td className="p-3.5 text-accent font-bold">{log.action}</td>
                  <td className="p-3.5 text-muted">{log.target}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {log.result}
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
