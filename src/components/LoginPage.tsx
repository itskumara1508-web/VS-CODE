import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Scan,
  AlertTriangle,
  Fingerprint,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { AuthUser } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBackToDashboard: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToDashboard,
}) => {
  const [badgeId, setBadgeId] = useState('NTRO-OPS-8492');
  const [passcode, setPasscode] = useState('CYBER-INTEL-2026');
  const [clearance, setClearance] = useState('Level 4 (Directorate General)');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuthenticate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!badgeId.trim() || !passcode.trim()) {
      setErrorMsg('Please provide valid Service ID and Security Passcode.');
      return;
    }

    setErrorMsg(null);
    setIsVerifying(true);
    setVerificationStep('INITIALIZING BIOMETRIC SCAN...');

    setTimeout(() => {
      setVerificationStep('CROSS-REFERENCING NTRO DIRECTORY...');
    }, 600);

    setTimeout(() => {
      setVerificationStep('DECRYPTING CREDENTIAL TOKEN...');
    }, 1200);

    setTimeout(() => {
      setVerificationStep('AUTHENTICATION VERIFIED • ACCESS GRANTED');
    }, 1800);

    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        name: 'Cmdr. A. Sheoran',
        badgeId: badgeId.toUpperCase(),
        role: 'Chief Cyber Intelligence Officer',
        clearance: clearance.split(' ')[0] + ' ' + clearance.split(' ')[1],
        loginTime: new Date().toLocaleTimeString(),
      });
    }, 2200);
  };

  const handleQuickDemoLogin = () => {
    setBadgeId('NTRO-JURY-26152');
    setPasscode('SIH-2026-EVAL');
    setClearance('Level 4 (Directorate General)');
    setIsVerifying(true);
    setVerificationStep('ONE-CLICK JURY CLEARANCE GRANTED...');
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        name: 'SIH Jury Evaluator',
        badgeId: 'NTRO-JURY-26152',
        role: 'Senior Evaluation Officer',
        clearance: 'Level 4 (SCI)',
        loginTime: new Date().toLocaleTimeString(),
      });
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#030712] overflow-hidden">
      {/* Background Cyber Grid & Radar */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/80 to-[#030712] pointer-events-none" />

      {/* Ambient glowing circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Left Back Button */}
      <button
        onClick={onBackToDashboard}
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-xs transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
        <span>Return to Public Telemetry</span>
      </button>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md glass-panel-glow rounded-2xl p-6 sm:p-8 border border-cyan-400/40 shadow-2xl">
        {/* NTRO Header Seal */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400/50 shadow-glow-cyan mb-3">
            <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-[#030712]">
              <Lock className="w-3 h-3" />
            </div>
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold mb-1.5">
            SIH 2026 • NTRO PROBLEM 26152
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Socio<span className="text-cyan-400">Intell</span> Command Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            SECURE ACCESS GATEWAY • RESTRICTED CLEARANCE
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Verification Animation Overlay */}
        {isVerifying ? (
          <div className="py-12 flex flex-col items-center justify-center text-center font-mono">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              <Scan className="w-16 h-16 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            </div>
            <p className="text-xs font-bold text-cyan-300 tracking-wider animate-pulse">
              {verificationStep}
            </p>
            <span className="text-[10px] text-slate-500 mt-2">
              VERIFYING HARDWARE CRYPTO TOKEN & NTRO DIRECTORY
            </span>
          </div>
        ) : (
          <form onSubmit={handleAuthenticate} className="space-y-4">
            {/* Service ID Field */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 uppercase mb-1.5">
                Service Badge ID / Officer Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  placeholder="e.g. NTRO-OPS-8492"
                  className="w-full glass-input pl-9 pr-3 py-2 text-xs font-mono rounded-lg focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Security Passcode Field */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 uppercase mb-1.5">
                Encrypted Security Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full glass-input pl-9 pr-3 py-2 text-xs font-mono rounded-lg focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Clearance Level Selector */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 uppercase mb-1.5">
                Authorized Clearance Protocol
              </label>
              <select
                value={clearance}
                onChange={(e) => setClearance(e.target.value)}
                className="w-full glass-input px-3 py-2 text-xs font-mono rounded-lg focus:border-cyan-400 bg-slate-900 text-slate-200"
              >
                <option value="Level 2 (Tactical Analyst)">Level 2 (Tactical Analyst)</option>
                <option value="Level 3 (Forensic Lead)">Level 3 (Forensic Lead)</option>
                <option value="Level 4 (Directorate General)">Level 4 (Directorate General - Full Access)</option>
              </select>
            </div>

            {/* Authenticate Button */}
            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 text-xs font-mono font-bold uppercase rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Authenticate Credentials</span>
            </button>

            {/* Quick Demo Bypass for Judges */}
            <div className="pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-mono font-semibold rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>One-Click Jury Evaluation Access</span>
              </button>
            </div>
          </form>
        )}

        {/* Security & Regulatory Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center font-mono text-[10px] text-slate-500 leading-relaxed">
          <p>
            WARNING: Unauthorized attempts to access this national intelligence terminal are monitored and logged under the Indian Information Technology Act and NTRO Security Directives.
          </p>
        </div>
      </div>
    </div>
  );
};
