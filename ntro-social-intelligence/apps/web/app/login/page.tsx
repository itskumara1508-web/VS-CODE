'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { api, setToken } from '@/lib/api';
import Card3D from '@/components/Card3D';
import BrandLogo from '@/components/BrandLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('analyst@ntro.gov.in');
  const [password, setPassword] = useState('Analyst@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      setToken(res.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#040817] bg-interlocking-rings p-4 relative overflow-hidden">
      {/* 3D Cyber Perspective Depth Grid Floor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none cyber-grid-3d" />

      {/* Ambient Cobalt & Violet Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0062FF]/15 rounded-full blur-[140px] pointer-events-none animate-orb-glow" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-[#8B5CF6]/15 rounded-full blur-[120px] pointer-events-none animate-orb-glow" />

      <Card3D glowColor="blue" intensity={10} className="w-full max-w-md p-8 bg-[#0D1536]/90 backdrop-blur-2xl border border-[#1B2A63] rounded-3xl shadow-glass relative z-10 space-y-6">
        {/* Brand Identity with 4-Petal Optical Lens Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <BrandLogo size="xl" showText={true} />
          <p className="text-[11px] text-[#94A3B8] font-mono tracking-wide">
            Understand. Analyze. Predict.
          </p>
        </div>

        <div className="text-center pt-2 border-t border-[#1B2A63]/60">
          <h1 className="text-sm font-bold text-white">Analyst Intelligence Portal</h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">Secure authentication for social intelligence personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-muted uppercase font-mono tracking-wide block mb-1">
              Official Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-ink border border-border rounded-xl text-xs text-text placeholder:text-muted focus:outline-none focus:border-cyan/60"
              placeholder="analyst@ntro.gov.in"
              required
            />
          </div>

          <div>
            <label className="text-[10px] text-muted uppercase font-mono tracking-wide block mb-1">
              Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-ink border border-border rounded-xl text-xs text-text placeholder:text-muted focus:outline-none focus:border-cyan/60"
              placeholder="••••••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-950/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary justify-center text-xs py-2.5 shadow-glow"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter Command Center'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="p-3.5 bg-ink/70 rounded-xl border border-border text-[11px] text-muted space-y-1 font-mono">
          <div className="font-semibold text-text flex items-center gap-1.5 mb-1 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" /> SIH Evaluation Credentials
          </div>
          <div>• Analyst: <span className="text-cyan font-bold">analyst@ntro.gov.in</span> / <span className="text-accent font-bold">Analyst@123</span></div>
          <div>• Admin: <span className="text-cyan font-bold">admin@ntro.gov.in</span> / <span className="text-accent font-bold">Admin@123</span></div>
        </div>
      </Card3D>
    </div>
  );
}
