import { Shield, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full glass-panel border-t border-cyan-500/20 py-12 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Brand & Problem */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-wider">
                Pulse<span className="text-cyan-400">X</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                SIH 2026 • NTRO
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              AI-Powered Social Media Intelligence Platform engineered for the National Technical Research Organisation (NTRO) under Smart India Hackathon 2026 (Problem Statement ID: 26152).
            </p>
            <div className="text-[11px] text-slate-500">
              Tech Stack: React • Vite • TypeScript • Tailwind CSS • Three.js • Recharts • Framer Motion
            </div>
          </div>

          {/* Col 2: Core SIH Modules */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
              Intelligence Modules
            </h4>
            <ul className="space-y-1 text-slate-400">
              <li><a href="#sources" className="hover:text-cyan-300">A. Continuous Ingestion</a></li>
              <li><a href="#sentiment" className="hover:text-cyan-300">B. Sentiment Inference</a></li>
              <li><a href="#audience" className="hover:text-cyan-300">C. Demographic DNA</a></li>
              <li><a href="#trends" className="hover:text-cyan-300">D. Trend Radar</a></li>
              <li><a href="#network" className="hover:text-cyan-300">E. Link & Topology Analysis</a></li>
              <li><a href="#narrative" className="text-cyan-400 font-semibold hover:underline">✦ Cross-Analysis Spread</a></li>
            </ul>
          </div>

          {/* Col 3: System Status & Security */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
              Security Protocol
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Zero PII Storage Architecture</span>
              </div>
              <p>Aggregated statistical models only</p>
              <p>FastAPI Microservice Ready</p>
              <p>GitHub Pages Compatible</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & scroll-to-top */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            © 2026 PulseX Intelligence • Smart India Hackathon 2026 • Built for NTRO Evaluation
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 hover:text-cyan-300 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
