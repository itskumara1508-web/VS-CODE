import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Lock,
  CheckCircle2,
  LogIn,
  ArrowLeft,
  Terminal,
  RefreshCcw,
  ShieldCheck,
} from 'lucide-react';
import { AuthUser } from '../types';

interface LogoutPageProps {
  lastUser: AuthUser | null;
  onNavigateLogin: () => void;
  onNavigateDashboard: () => void;
}

export const LogoutPage: React.FC<LogoutPageProps> = ({
  lastUser,
  onNavigateLogin,
  onNavigateDashboard,
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const terminationTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  useEffect(() => {
    const sequence = [
      'INITIALIZING SECURE SESSION TERMINATION PROTOCOL...',
      'REVOKING HARDWARE SECURITY TOKENS & EPHEMERAL KEYS...',
      'PURGING SENSITIVE IN-MEMORY TACTICAL CACHE...',
      'DISCONNECTING ACTIVE WEBSOCKET TELEMETRY CHANNELS...',
      'NTRO AUDIT LEDGER: SESSION CLOSED SUCCESSFULLY.',
    ];

    sequence.forEach((msg, idx) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, msg]);
        if (idx === sequence.length - 1) {
          setIsDone(true);
        }
      }, (idx + 1) * 350);
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#030712] overflow-hidden font-sans">
      {/* Background Cyber Grid & Radar */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/80 to-[#030712] pointer-events-none" />

      {/* Ambient ambient glow circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Back to Dashboard */}
      <button
        onClick={onNavigateDashboard}
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
        <span>Return to Public Command Center</span>
      </button>

      {/* Main Logout Card */}
      <div className="relative z-10 w-full max-w-lg glass-panel-glow rounded-2xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl">
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-950/60 border-2 border-rose-500/50 shadow-glow-rose mb-3">
            <ShieldAlert className="w-8 h-8 text-rose-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-rose-500/40 text-rose-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold mb-1.5">
            SESSION DE-AUTHORIZED • NTRO PROTOCOL
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Socio<span className="text-cyan-400">Intell</span> Session Terminated
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            ALL CLASSIFIED CHANNELS SECURELY DISCONNECTED
          </p>
        </div>

        {/* Audit / Officer Summary */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
            <span>TERMINATION TIME:</span>
            <span className="text-white font-bold">{terminationTime} IST</span>
          </div>
          {lastUser ? (
            <>
              <div className="flex justify-between items-center text-slate-400">
                <span>OFFICER NAME:</span>
                <span className="text-cyan-300 font-bold">{lastUser.name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>SERVICE BADGE ID:</span>
                <span className="text-slate-200">{lastUser.badgeId}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>SECURITY CLEARANCE:</span>
                <span className="text-emerald-400 font-semibold">{lastUser.clearance}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center text-slate-400">
              <span>OFFICER STATUS:</span>
              <span className="text-slate-200">GUEST / EVALUATION SESSION</span>
            </div>
          )}
          <div className="flex justify-between items-center text-slate-400 pt-1">
            <span>RESIDUAL DATA RECORDED:</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0 BYTES (ZERO PII)</span>
            </span>
          </div>
        </div>

        {/* Live Terminal De-Auth Logs */}
        <div className="mb-6 p-3 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-36 overflow-y-auto">
          <div className="flex items-center space-x-1.5 text-slate-500 mb-1">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>SECURE AUDIT TERMINAL</span>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span className="text-cyan-500 font-bold">›</span>
              <span className={i === logs.length - 1 ? 'text-cyan-300 font-semibold' : 'text-slate-400'}>
                {log}
              </span>
            </div>
          ))}
          {!isDone && (
            <div className="flex items-center space-x-2 text-cyan-400 animate-pulse pt-1">
              <RefreshCcw className="w-3 h-3 animate-spin" />
              <span>EXECUTING HARDWARE SHUTDOWN SEQUENCE...</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onNavigateLogin}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 text-xs font-mono font-bold uppercase rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Re-Authenticate / Officer Login</span>
          </button>

          <button
            onClick={onNavigateDashboard}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-mono font-semibold rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Access Public Command Center</span>
          </button>
        </div>

        {/* Defense Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center font-mono text-[10px] text-slate-500 leading-relaxed">
          <p>
            National Technical Research Organisation • SOCIOINTELL Defense Intelligence Suite.
            Your session audit token has been safely stored in cryptographically sealed format.
          </p>
        </div>
      </div>
    </div>
  );
};

