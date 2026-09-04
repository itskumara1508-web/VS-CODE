import React, { useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { initialKPIMetrics, risingNarratives, aiIntelligenceInsights } from '../data/mockData';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#3b82f6', '#8b5cf6', '#10b981'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      agency: 'National Technical Research Organisation (NTRO)',
      event: 'Smart India Hackathon 2026 • Problem 26152',
      project: 'PulseX — AI Social Media Intelligence',
      generatedAt: new Date().toISOString(),
      classification: 'OFFICIAL USE ONLY // NTRO DIRECTIVE',
      kpis: initialKPIMetrics,
      topNarratives: risingNarratives,
      tacticalInsights: aiIntelligenceInsights,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NTRO_PulseX_Intelligence_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel-glow rounded-2xl border border-cyan-400/50 shadow-2xl my-8 text-slate-100 font-sans max-h-[90vh] flex flex-col">
        {/* Modal Top Action Bar */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-950/80 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase font-bold">
              NTRO CYBER INTELLIGENCE DIRECTIVE // EXECUTIVE SUMMARY
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-glow-cyan"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0 font-mono text-xs">
          {/* Official Letterhead */}
          <div className="border-b-2 border-cyan-500/40 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wider">
                NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO)
              </h2>
              <p className="text-xs text-cyan-300 font-bold tracking-widest mt-0.5">
                SMART INDIA HACKATHON 2026 • PROBLEM STATEMENT ID 26152
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Project: PulseX — AI Social Media Intelligence & Network Dissemination
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <span className="block text-rose-400 font-bold uppercase">
                SECURITY: OFFICIAL USE ONLY
              </span>
              <span>DOC REF: NTRO-NX-26152-BRIEF</span>
              <span className="block">DATE: {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Section 1: Executive Scope */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span>01. EXECUTIVE INTELLIGENCE SUMMARY</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Automated multi-platform telemetry across X, Telegram, Reddit, Instagram, Facebook, and YouTube indicates an active, rapidly consolidating narrative centered around <strong>"AI Regulation & Sovereign Compute"</strong>. Within 49 minutes of algorithmic detection, the narrative transitioned from localized academic research clusters into mainstream policy channels, registering a +342% surge in engagement.
            </p>
          </div>

          {/* Section 2: Key Indicators Table */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span>02. CROSS-PLATFORM OPERATIONAL KPI REGISTER</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Total Posts Analyzed</span>
                <span className="text-white font-bold text-sm">12,847</span>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Active User Nodes</span>
                <span className="text-emerald-400 font-bold text-sm">8,492</span>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Sentiment Composite</span>
                <span className="text-cyan-300 font-bold text-sm">72.8 / 100</span>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Estimated Audience Reach</span>
                <span className="text-violet-400 font-bold text-sm">2.84M (+18.2%)</span>
              </div>
            </div>
          </div>

          {/* Section 3: Cross-Analysis Narrative Propagation Vector */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span>03. FORENSIC PROPAGATION VECTOR (HOW THE NARRATIVE SPREAD)</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                <span>Phase A (09:12):</span>
                <span className="text-slate-300 font-normal">Initial burst detected on X and developer forums (Cluster A).</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                <span>Phase B (09:42):</span>
                <span className="text-slate-300 font-normal">Amplified 8.4x by high-influence node <strong>KOL Alpha (@cyber_intel_in, Score 94.2)</strong>.</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                <span>Phase C (09:58):</span>
                <span className="text-slate-300 font-normal">Cross-community bridge conduit <strong>Bridge Delta</strong> forwarded thread to Telegram and Reddit.</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <span>Phase D (10:12):</span>
                <span className="text-slate-300 font-normal"><strong>Negative sentiment surged +18.2%</strong> as compliance fears and startup licensing ambiguity emerged.</span>
              </div>
            </div>
          </div>

          {/* Section 4: Demographic & Geographic Footprint */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span>04. DEMOGRAPHIC & REGIONAL DISSEMINATION</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Age Demographics</span>
                <p className="text-slate-300 mt-1">18–24: <strong>42%</strong> | 25–34: <strong>31%</strong></p>
                <p className="text-[10px] text-cyan-400 mt-1">Strong youth & developer cohort</p>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Linguistic Makeup</span>
                <p className="text-slate-300 mt-1">Hindi: <strong>46%</strong> | English: <strong>38%</strong></p>
                <p className="text-[10px] text-violet-400 mt-1">Hinglish accounts for 12%</p>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px] block">Top Geographic Metros</span>
                <p className="text-slate-300 mt-1">Delhi NCR: <strong>28%</strong> | Mumbai: <strong>16%</strong></p>
                <p className="text-[10px] text-emerald-400 mt-1">Bengaluru holds 13% tech share</p>
              </div>
            </div>
          </div>

          {/* Section 5: Strategic Directives */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <span>05. TACTICAL DIRECTIVES & RECOMMENDATIONS</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li>Deploy targeted developer clarification regarding open source compute and sandbox exemptions.</li>
              <li>Maintain persistent topological monitoring on <strong>Bridge Node Delta</strong> for cross-border narrative relay.</li>
              <li>Prioritize Hindi-language policy communications across Tier-2 media channels to prevent distortion.</li>
            </ul>
          </div>

          {/* Document Signoff Footer */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DIGITALLY SIGNED & VERIFIED BY PULSEX AI AGENT ENGINE</span>
            </div>
            <span className="mt-2 sm:mt-0 font-mono">NATIONAL TECHNICAL RESEARCH ORGANISATION</span>
          </div>
        </div>
      </div>
    </div>
  );
};
