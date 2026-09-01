'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNavigation from '@/components/TopNavigation';
import CommandPalette from '@/components/CommandPalette';
import EventIntelligenceModal from '@/components/EventIntelligenceModal';
import { getToken } from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState('Analyst');
  const [ready, setReady] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [eventIntelOpen, setEventIntelOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ntro_user_name');
      if (stored) setUserName(stored);
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="min-h-screen bg-ink" />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-x-hidden text-slate-900">
      {/* Subtle Geometric Circular Ambient Watermark */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[500px] bg-[#0062FF]/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-1/4 w-[600px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[400px] bg-[#38BDF8]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Level 1 & Level 2 Sticky Top Navigation System */}
      <div className="relative z-40">
        <TopNavigation
          userName={userName}
          onOpenCommandPalette={() => setCmdOpen(true)}
          onOpenEventIntel={() => setEventIntelOpen(true)}
        />
      </div>

      {/* Main Content Area (Full Width Enterprise Layout) */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 md:p-8 overflow-x-hidden relative z-10">
        {children}
      </main>

      {/* SOCIOINTELL Enterprise Brand Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/90 backdrop-blur-md py-4 px-6 text-center text-xs text-slate-500 font-mono select-none shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-wider">SOCIOINTELL</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#0062FF] font-semibold">AI-Powered Social Media Intelligence</span>
          </div>
          <div className="text-[11px] text-[#7C3AED] font-semibold">
            Understand. Analyze. Predict. • Smart India Hackathon (SIH)
          </div>
        </div>
      </footer>

      {/* Global Modals & Shortcuts */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onOpenEventIntel={() => setEventIntelOpen(true)}
      />

      <EventIntelligenceModal
        isOpen={eventIntelOpen}
        onClose={() => setEventIntelOpen(false)}
      />
    </div>
  );
}
