"use client";

import { useEffect, useState } from "react";
import {
  FolderLock,
  Plus,
  Pin,
  FileText,
  Shield,
  Clock,
  User,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Download,
  Share2,
  Sparkles,
  MessageSquare,
  Network,
  ExternalLink,
  ChevronRight,
  FileCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { Panel, PanelTitle, Badge, LoadingState, ErrorState } from "@/components/ui";
import Card3D from "@/components/Card3D";
import GlobalFilterBar from "@/components/GlobalFilterBar";
import type { Investigation, InvestigationItem, AnalystNote, ChainOfCustody } from "@ntro/types";

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedCase, setSelectedCase] = useState<Investigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Case Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("HIGH");
  const [newTags, setNewTags] = useState("EV_Grid, Urgent_Review");

  // New Note State
  const [noteText, setNoteText] = useState("");
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<{
    investigation: Investigation;
    chainOfCustody: ChainOfCustody;
    executiveSummary: string;
  } | null>(null);

  const loadCases = async () => {
    try {
      const res = await api.investigations();
      setInvestigations(res);
      if (res.length > 0 && !selectedCase) {
        setSelectedCase(res[0]);
      }
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load investigations");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const created = await api.createInvestigation({
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        tags: newTags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setInvestigations([created, ...investigations]);
      setSelectedCase(created);
      setCreateModalOpen(false);
      setNewTitle("");
      setNewDesc("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !noteText.trim()) return;
    try {
      const updated = await api.addInvestigationNote(selectedCase.id, noteText, "Senior Threat Analyst #409");
      setSelectedCase(updated);
      setInvestigations(investigations.map((i) => (i.id === updated.id ? updated : i)));
      setNoteText("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedCase) return;
    try {
      const rep = await api.investigationReport(selectedCase.id);
      setGeneratedReport(rep);
      setReportModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <LoadingState message="Accessing NTRO Investigation Dossier Repository..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
              <FolderLock className="w-5 h-5 text-[#00F0FF]" />
              Investigation Case Folders & Evidence Lockers
            </h1>
            <Badge variant="teal">NTRO CLASSIFIED DOSSIERS</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Structured forensic case management, pinned cross-vector evidence, analyst deliberation notes, and Chain-of-Custody exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn btn-primary text-xs py-1.5 px-3.5 font-bold flex items-center gap-1.5 shadow-glow"
          >
            <Plus className="w-3.5 h-3.5" /> NEW INVESTIGATION CASE
          </button>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Main Two-Column Layout: Left Case Selector | Right Case Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 4 COLS: Active Cases List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold text-muted uppercase">Active Dossiers ({investigations.length})</span>
            <span className="text-[10px] font-mono text-[#00FF9D]">ROLE: RESTRICTED</span>
          </div>

          <div className="space-y-3">
            {investigations.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2 relative overflow-hidden ${
                    isSelected
                      ? "bg-[#111C35] border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                      : "bg-[#0D1527]/80 hover:bg-[#111C35]/60 border-[#1E3156]"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#00F0FF] to-[#00FF9D]" />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-extrabold text-[#00F0FF] tracking-wider">
                      {c.caseNumber}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                        c.priority === "CRITICAL"
                          ? "bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/40"
                          : c.priority === "HIGH"
                          ? "bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40"
                          : "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
                      }`}
                    >
                      {c.priority}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#F8FAFC] line-clamp-1">{c.title}</h3>
                  <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-tight">{c.description}</p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-1 border-t border-[#1E3156]/60">
                    <span>{c.pinnedItems.length} Evidence Pins</span>
                    <span>{c.notes.length} Analyst Notes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT 8 COLS: Active Investigation Dossier Workspace */}
        {selectedCase && (
          <div className="lg:col-span-8 space-y-6">
            {/* Dossier Header Panel */}
            <Panel className="p-6 bg-[#0D1527]/90 backdrop-blur-2xl border-[#1E3156] space-y-4 shadow-glass relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#FFB800]" />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#1E3156] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 px-2 py-0.5 rounded">
                      {selectedCase.caseNumber}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#00FF9D] bg-[#00FF9D]/15 border border-[#00FF9D]/30 px-2 py-0.5 rounded-full font-bold">
                      {selectedCase.status}
                    </span>
                    <span className="text-[10px] font-mono text-muted">{selectedCase.timeRange}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#F8FAFC] tracking-tight">{selectedCase.title}</h2>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{selectedCase.description}</p>
                </div>

                <button
                  onClick={handleGenerateReport}
                  className="btn btn-emerald text-xs py-2 px-4 font-bold flex items-center gap-2 shrink-0 shadow-[0_0_15px_rgba(0,255,157,0.25)]"
                >
                  <FileCheck className="w-4 h-4" /> GENERATE FORENSIC REPORT
                </button>
              </div>

              {/* Tags and Lead Analyst */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-muted" />
                  {selectedCase.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#111C35] text-[#94A3B8] border border-[#1E3156]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] font-mono text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Assigned: <strong className="text-[#F8FAFC]">{selectedCase.assignedTo}</strong></span>
                </div>
              </div>
            </Panel>

            {/* Pinned Evidence Locker Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold text-[#F8FAFC] uppercase flex items-center gap-2">
                  <Pin className="w-4 h-4 text-[#00F0FF]" /> Pinned Evidence Locker ({selectedCase.pinnedItems.length})
                </h3>
                <span className="text-[10px] font-mono text-muted">Directly linkable from any view</span>
              </div>

              {selectedCase.pinnedItems.length === 0 ? (
                <div className="p-8 text-center bg-[#0D1527]/60 rounded-2xl border border-dashed border-[#1E3156] text-muted text-xs font-mono">
                  No evidence items pinned yet. Pin posts from Live Monitoring or topics from Event Intelligence.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedCase.pinnedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-[#111C35]/90 rounded-2xl border border-[#1E3156] hover:border-[#00F0FF]/40 transition-colors space-y-2 relative"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#070B14] text-[#00F0FF] border border-[#1E3156]">
                          {item.type}
                        </span>
                        <span className="text-[9px] font-mono text-muted">{new Date(item.pinnedAt).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#F8FAFC] truncate">{item.title}</h4>
                      {item.annotation && (
                        <p className="text-[11px] text-[#94A3B8] italic bg-[#070B14]/60 p-2 rounded-xl border border-[#1E3156]/60">
                          &quot;{item.annotation}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analyst Deliberation Notes Thread */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-[#F8FAFC] uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FFB800]" /> Analyst Notes & Deliberation Log ({selectedCase.notes.length})
              </h3>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {selectedCase.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 bg-[#111C35]/90 rounded-2xl border border-[#1E3156] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#F8FAFC] font-mono text-[11px] flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[#00F0FF]" /> {note.author} ({note.authorRole})
                      </span>
                      <span className="text-[10px] font-mono text-muted">{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Append forensic observation or analyst note..."
                  className="flex-1 bg-[#070B14] border border-[#1E3156] rounded-xl px-3.5 py-2 text-xs text-[#F8FAFC] focus:border-[#00F0FF] outline-none"
                />
                <button type="submit" className="btn btn-primary text-xs py-2 px-4 font-bold">
                  POST NOTE
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* CREATE INVESTIGATION MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1527] border border-[#1E3156] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-sm font-bold text-[#F8FAFC] font-mono uppercase flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-[#00F0FF]" /> Initiate New Investigation Dossier
            </h3>

            <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-muted uppercase">Case Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Critical Infrastructure Telemetry Spike"
                  className="w-full bg-[#070B14] border border-[#1E3156] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] mt-1 focus:border-[#00F0FF] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-muted uppercase">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Detailed case background, scope, and target entities..."
                  className="w-full bg-[#070B14] border border-[#1E3156] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] mt-1 focus:border-[#00F0FF] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-muted uppercase">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-[#070B14] border border-[#1E3156] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] mt-1 font-mono focus:border-[#00F0FF] outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-muted uppercase">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full bg-[#070B14] border border-[#1E3156] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] mt-1 font-mono focus:border-[#00F0FF] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#1E3156]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="btn btn-ghost text-xs py-1.5 px-3"
                >
                  CANCEL
                </button>
                <button type="submit" className="btn btn-primary text-xs py-1.5 px-4 font-bold shadow-glow">
                  CREATE DOSSIER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATED FORENSIC CASE REPORT MODAL WITH CHAIN OF CUSTODY */}
      {reportModalOpen && generatedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1527] border border-[#1E3156] rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E3156] pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#00FF9D]" />
                <h3 className="text-sm font-bold text-[#F8FAFC] font-mono uppercase">
                  Forensic Intelligence Dossier — {generatedReport.investigation.caseNumber}
                </h3>
              </div>
              <Badge variant="teal">CHAIN OF CUSTODY VERIFIED</Badge>
            </div>

            <p className="text-xs text-[#CBD5E1] bg-[#111C35] p-3.5 rounded-xl border border-[#1E3156]">
              {generatedReport.executiveSummary}
            </p>

            {/* Forensic Chain of Custody Box */}
            <div className="p-4 bg-[#070B14] rounded-xl border border-[#1E3156] space-y-2 text-xs font-mono">
              <div className="text-[10.5px] font-bold text-[#00F0FF] uppercase flex items-center justify-between">
                <span>Forensic Chain of Custody & Cryptographic Provenance</span>
                <span className="text-[9px] text-[#00FF9D]">{generatedReport.chainOfCustody.classification}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#94A3B8]">
                <div>Report ID: <strong className="text-[#F8FAFC]">{generatedReport.chainOfCustody.reportId}</strong></div>
                <div>Generated By: <strong className="text-[#F8FAFC]">{generatedReport.chainOfCustody.generatedBy}</strong></div>
                <div>Time Window: <strong className="text-[#F8FAFC]">{generatedReport.chainOfCustody.dataTimeRange}</strong></div>
                <div>Records Analyzed: <strong className="text-[#F8FAFC]">{generatedReport.chainOfCustody.recordCount.toLocaleString()}</strong></div>
              </div>
              <div className="pt-2 border-t border-[#1E3156]/60">
                <span className="text-[10px] text-muted">SHA-256 Digest:</span>
                <div className="text-[10px] text-[#00FF9D] break-all select-all mt-0.5">
                  {generatedReport.chainOfCustody.cryptographicHash}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReportModalOpen(false)}
                className="btn btn-ghost text-xs py-1.5 px-3"
              >
                CLOSE
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(generatedReport, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `NTRO_DOSSIER_${generatedReport.investigation.caseNumber}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="btn btn-primary text-xs py-1.5 px-4 font-bold flex items-center gap-1.5 shadow-glow"
              >
                <Download className="w-3.5 h-3.5" /> DOWNLOAD OFFICIAL DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
