'use client';

import { useState } from 'react';
import {
  Settings,
  Sliders,
  Shield,
  Bell,
  Database,
  Lock,
  Sparkles,
  Save,
  CheckCircle2,
  Bookmark,
  Eye,
  Plus,
  Trash2,
  Users,
  Layers,
} from 'lucide-react';
import { Panel, PanelTitle, Badge } from '@/components/ui';
import GlobalFilterBar from '@/components/GlobalFilterBar';
import { buildSavedInvestigations, buildWatchlistItems } from '@ntro/shared';
import type { SavedInvestigation, WatchlistItem } from '@ntro/types';

export default function SettingsPage() {
  const [activeRole, setActiveRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER'>('ANALYST');
  const [zScoreThreshold, setZScoreThreshold] = useState(2.5);
  const [velocityThreshold, setVelocityThreshold] = useState(150);
  const [influenceThreshold, setInfluenceThreshold] = useState(0.8);
  const [sarcasmFilter, setSarcasmFilter] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [investigations, setInvestigations] = useState<SavedInvestigation[]>(buildSavedInvestigations());
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(buildWatchlistItems());

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteInvestigation = (id: string) => {
    setInvestigations((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleDeleteWatchlist = (id: string) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">System Settings, Watchlists & Dossier Configurations</h1>
            <Badge variant="teal">CONFIG MANAGER</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Manage statistical anomaly thresholds, analyst watchlists, saved investigations, and role-based permissions
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn btn-primary text-xs py-1.5 px-4 font-bold flex items-center gap-1.5 shadow-glow"
        >
          <Save className="w-3.5 h-3.5" />
          <span>SAVE CONFIGURATION</span>
        </button>
      </div>

      <GlobalFilterBar />

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-positive font-bold animate-in fade-in duration-100">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configuration parameters and alert sensitivity thresholds saved successfully.</span>
        </div>
      )}

      {/* Feature 31: Role-Based Access Control Switcher */}
      <Panel className="p-5 bg-surface/90 border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold text-text uppercase tracking-wider font-mono">
              Role-Based Access Control (RBAC) Role Profile
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20">
            CURRENT: {activeRole}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {(
            [
              { role: 'ADMIN', title: 'Administrator', desc: 'Full root access: modify providers, purge cache, manage analyst accounts and security policies.' },
              { role: 'ANALYST', title: 'Intelligence Analyst', desc: 'Standard access: run queries, launch simulations, export intelligence dossiers, investigate alerts.' },
              { role: 'VIEWER', title: 'Executive Viewer', desc: 'Read-only access: view overview dashboards, telemetry graphs, and compiled executive briefings.' },
            ] as const
          ).map((r) => (
            <div
              key={r.role}
              onClick={() => setActiveRole(r.role)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                activeRole === r.role
                  ? 'bg-panel border-accent shadow-glow'
                  : 'bg-panel/50 border-border hover:border-cyan/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-text">{r.title}</span>
                <span className="text-[10px] font-mono font-bold uppercase text-accent">{r.role}</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Feature 33: Saved Investigations Dossiers */}
      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <PanelTitle icon={<Bookmark className="w-4 h-4 text-highlight" />}>
            Saved Investigation Dossiers ({investigations.length})
          </PanelTitle>
          <span className="text-[11px] font-mono text-muted">Pinned filters & evidence</span>
        </div>

        <div className="divide-y divide-border">
          {investigations.map((inv) => (
            <div key={inv.id} className="p-4 hover:bg-panelHover transition-colors space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-text">{inv.title}</h3>
                  <span className="text-[10px] font-mono text-muted">Created: {inv.createdAt} • Topic: <strong className="text-accent">{inv.topic}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-cyan">
                    {inv.timeRange}
                  </span>
                  <button
                    onClick={() => handleDeleteInvestigation(inv.id)}
                    className="text-muted hover:text-rose-400 p-1 rounded"
                    title="Delete Investigation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-text/90 leading-relaxed font-medium">{inv.notes}</p>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {inv.tags.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-panel border border-border text-[9px] font-mono font-bold text-highlight uppercase">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Feature 34: Analyst Watchlist Monitors */}
      <Panel className="p-0 overflow-hidden">
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <PanelTitle icon={<Eye className="w-4 h-4 text-accent" />}>
            Analyst Watchlist Monitors ({watchlist.length})
          </PanelTitle>
          <span className="text-[11px] font-mono text-muted">Auto-alert triggers on surge</span>
        </div>

        <div className="divide-y divide-border">
          {watchlist.map((w) => (
            <div key={w.id} className="p-3.5 hover:bg-panelHover transition-colors flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-surface text-cyan border border-cyan/20">
                  {w.entityType}
                </span>
                <span className="font-bold text-text font-sans">{w.name}</span>
                <span className="text-muted text-[10px]">Velocity: {w.currentVelocity}/hr</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-positive font-bold">Delta &gt; {w.sensitivityThresholdPct}%</span>
                {w.alertTriggered && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    SURGE ACTIVE
                  </span>
                )}
                <button
                  onClick={() => handleDeleteWatchlist(w.id)}
                  className="text-muted hover:text-rose-400 p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Statistical Sensitivity Tuning Sliders */}
      <Panel className="p-5 space-y-4">
        <PanelTitle icon={<Sliders className="w-4 h-4 text-cyan" />}>
          Statistical Algorithm & Anomaly Sensitivity Sliders
        </PanelTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs pt-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text">Z-Score Anomaly Deviation</span>
              <span className="font-mono text-accent font-bold">{zScoreThreshold} σ</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="4.0"
              step="0.1"
              value={zScoreThreshold}
              onChange={(e) => setZScoreThreshold(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <p className="text-[10px] text-muted">Lower values trigger more sensitive alerts.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text">Emerging Velocity Threshold</span>
              <span className="font-mono text-cyan font-bold">{velocityThreshold}/hr</span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={velocityThreshold}
              onChange={(e) => setVelocityThreshold(Number(e.target.value))}
              className="w-full accent-cyan"
            />
            <p className="text-[10px] text-muted">Minimum hourly mention velocity for emerging topic status.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-text">Authority Node Min PageRank</span>
              <span className="font-mono text-highlight font-bold">{influenceThreshold}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={influenceThreshold}
              onChange={(e) => setInfluenceThreshold(Number(e.target.value))}
              className="w-full accent-highlight"
            />
            <p className="text-[10px] text-muted">Threshold for classifying accounts as key opinion leaders.</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
