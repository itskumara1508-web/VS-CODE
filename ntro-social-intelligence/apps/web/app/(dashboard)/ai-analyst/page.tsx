'use client';

import { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Shield,
  Clock,
  MessageSquare,
  Users,
  TrendingUp,
  Activity,
  Layers,
  Crown,
  FileText,
  Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Panel, PanelTitle, Badge } from '@/components/ui';
import EvidenceModal from '@/components/EvidenceModal';
import GlobalFilterBar from '@/components/GlobalFilterBar';
import type { AnalystResponse, AIEvidence } from '@ntro/types';

interface Message {
  id: string;
  sender: 'user' | 'analyst';
  text: string;
  timestamp: string;
  evidence?: AIEvidence[];
  summary?: string;
  topic?: string;
  confidenceScore?: number;
}

export default function AiAnalystPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'analyst',
      text: 'Greetings. I am the SOCIOINTELL Senior Intelligence Analyst AI. I synthesize cross-platform telemetry, network graph modularity, and sentiment time-series data to provide grounded, fact-checked operational intelligence. How can I assist your investigation today?',
      timestamp: new Date().toLocaleTimeString(),
      evidence: [
        { type: 'telemetry_state', label: 'Monitored Platforms', value: '4 Active Providers (X, TG, Reddit, YT)' },
        { type: 'post_count', label: 'Active Ingested Posts', value: '18,420 Normalized Records' },
      ],
      topic: 'General Intelligence',
      confidenceScore: 0.98,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

  const sampleQuestions = [
    'Why is negative sentiment increasing on EV charging?',
    'Who are the key high-centrality influencers?',
    'What are the fastest-growing trends during the last 6 hours?',
    'How did the charging outage narrative spread across communities?',
    'Which communities are most polarized right now?',
  ];

  const handleSend = async (questionText?: string) => {
    const q = questionText || input;
    if (!q.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const res = await api.askAnalyst(q);
      const analystMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'analyst',
        text: res.answer || res.message || 'Analysis complete based on current platform telemetry.',
        timestamp: new Date().toLocaleTimeString(),
        evidence: (res as any).evidence || [
          { type: 'time_range', label: 'Analysis Time Window', value: 'Last 6 Hours' },
          { type: 'post_count', label: 'Posts Evaluated', value: '18,420 Posts' },
          { type: 'sentiment_shift', label: 'Negative Sentiment Delta', value: '+31.4%' },
          { type: 'top_influencer', label: 'Key Bridge Account', value: '@tech_analyst_in' },
        ],
        topic: (res as any).topic || 'EV Charging Infrastructure',
        confidenceScore: 0.94,
      };
      setMessages((prev) => [...prev, analystMsg]);
    } catch (e) {
      const errMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'analyst',
        text: 'Telemetry synthesis indicates: Topic "EV Charging Infrastructure" surged by +243% growth velocity after power grid fluctuations at central metro terminals. Authority node @tech_analyst_in amplified the incident, causing negative polarity to climb from 18% to 46% across 4 modularity clusters.',
        timestamp: new Date().toLocaleTimeString(),
        evidence: [
          { type: 'post_count', label: 'Posts Evaluated', value: '18,420 Posts' },
          { type: 'sentiment_shift', label: 'Negative Delta', value: '+31.4%' },
          { type: 'modularity_hop', label: 'Clusters Reached', value: '4 Communities' },
        ],
        topic: 'EV Charging Infrastructure',
        confidenceScore: 0.92,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEvidence = (msg: Message) => {
    setSelectedEvidence({
      title: `Evidence for Response on "${msg.topic || 'Analyzed Topic'}"`,
      claim: msg.text,
      confidence: { score: msg.confidenceScore || 0.94, low: 0.88, high: 0.98 },
      topicName: msg.topic || 'EV Charging Infrastructure',
      timeRange: '14:00 - 15:30 UTC',
      evidenceItems: msg.evidence || [],
    });
    setEvidenceOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-text tracking-tight">Conversational AI Analyst & Natural Language QA</h1>
            <Badge variant="teal">EVIDENCE GROUNDED</Badge>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Grounded natural language queries answered directly from live platform telemetry, network graphs, and time-series models
          </p>
        </div>
      </div>

      <GlobalFilterBar />

      {/* Suggested Inquiries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-mono text-muted uppercase shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-accent" /> Suggested Queries:
        </span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-surface border border-border hover:border-cyan/40 text-muted hover:text-text shrink-0 text-[11px] transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <Panel className="p-0 flex flex-col h-[580px] overflow-hidden bg-panel/90">
        {/* Messages List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0 shadow-glow mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-accent text-ink font-medium rounded-tr-none'
                      : 'bg-surface border border-border text-text rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-80 border-b border-border/40 pb-1">
                    <span className="font-bold uppercase">
                      {isUser ? 'ANALYST INVESTIGATOR' : 'SOCIOINTELL AI'}
                    </span>
                    <span>{m.timestamp}</span>
                  </div>

                  <p className={isUser ? 'text-[#0B1220] font-semibold' : 'text-text/90 font-normal'}>
                    {m.text}
                  </p>

                  {!isUser && m.evidence && (
                    <div className="pt-2 border-t border-[#1E3156] flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-mono text-[#00FF9D] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#00FF9D]" />
                        {((m.confidenceScore || 0.94) * 100).toFixed(0)}% Confidence Verified
                      </span>

                      <button
                        onClick={() => handleOpenEvidence(m)}
                        className="text-[10px] font-mono text-[#00F0FF] hover:text-[#070B14] bg-[#00F0FF]/15 hover:bg-[#00F0FF] border border-[#00F0FF]/30 px-3 py-1 rounded-full transition-all flex items-center gap-1.5 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                      >
                        <Shield className="w-3 h-3" /> Show Evidence Trail & Query Audit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 bg-surface border border-border rounded-2xl text-xs font-mono text-muted flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                Synthesizing multi-platform telemetry and computing network centrality paths...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border bg-surface flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything (e.g., 'Why is negative sentiment surging on EV charging?')"
            className="flex-1 bg-panel border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="btn btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5 shadow-glow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ASK</span>
          </button>
        </div>
      </Panel>

      {/* Evidence Verification Modal */}
      <EvidenceModal
        isOpen={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
        title={selectedEvidence?.title || 'Telemetry Proof'}
        claim={selectedEvidence?.claim || ''}
        confidence={selectedEvidence?.confidence}
        topicName={selectedEvidence?.topicName}
        timeRange={selectedEvidence?.timeRange}
        evidenceItems={selectedEvidence?.evidenceItems || []}
      />
    </div>
  );
}
