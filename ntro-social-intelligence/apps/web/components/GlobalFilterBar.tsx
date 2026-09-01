'use client';

import { useState } from 'react';
import { Calendar, Filter, Globe, MessageSquare, Smile, Users, X, RotateCcw } from 'lucide-react';

export interface GlobalFilterState {
  dateRange: '15m' | '1h' | '6h' | '24h' | '7d' | '30d' | 'custom';
  platform: string;
  topic: string;
  language: string;
  sentiment: string;
  community: string;
}

interface GlobalFilterBarProps {
  onFilterChange?: (filters: GlobalFilterState) => void;
}

export default function GlobalFilterBar({ onFilterChange }: GlobalFilterBarProps) {
  const [filters, setFilters] = useState<GlobalFilterState>({
    dateRange: '24h',
    platform: 'all',
    topic: 'all',
    language: 'all',
    sentiment: 'all',
    community: 'all',
  });

  const update = (key: keyof GlobalFilterState, val: string) => {
    const next = { ...filters, [key]: val };
    setFilters(next);
    onFilterChange?.(next);
  };

  const resetFilters = () => {
    const defaultState: GlobalFilterState = {
      dateRange: '24h',
      platform: 'all',
      topic: 'all',
      language: 'all',
      sentiment: 'all',
      community: 'all',
    };
    setFilters(defaultState);
    onFilterChange?.(defaultState);
  };

  const isFiltered =
    filters.dateRange !== '24h' ||
    filters.platform !== 'all' ||
    filters.topic !== 'all' ||
    filters.language !== 'all' ||
    filters.sentiment !== 'all' ||
    filters.community !== 'all';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs mb-6 shadow-sm select-none relative overflow-hidden">
      {/* Date Range Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1.5 shrink-0 mr-1 font-semibold">
          <Calendar className="w-3.5 h-3.5 text-[#0062FF]" /> Window:
        </span>
        {(['15m', '1h', '6h', '24h', '7d', '30d', 'custom'] as const).map((r) => (
          <button
            key={r}
            onClick={() => update('dateRange', r)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-mono transition-all uppercase ${
              filters.dateRange === r
                ? 'bg-gradient-to-r from-[#0062FF] to-[#8B5CF6] text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Select Dropdowns */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Platform */}
        <div className="flex items-center gap-1 text-slate-600">
          <span className="text-[10px] font-mono uppercase text-slate-500">Src:</span>
          <select
            value={filters.platform}
            onChange={(e) => update('platform', e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-[#0062FF]/50 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF] font-mono transition-colors"
          >
            <option value="all">All Platforms</option>
            <option value="x">X (Twitter)</option>
            <option value="telegram">Telegram</option>
            <option value="reddit">Reddit</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="news">News / Web</option>
          </select>
        </div>

        {/* Topic */}
        <div className="flex items-center gap-1 text-slate-600">
          <span className="text-[10px] font-mono uppercase text-slate-500">Topic:</span>
          <select
            value={filters.topic}
            onChange={(e) => update('topic', e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-[#0062FF]/50 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF] transition-colors"
          >
            <option value="all">All Topics</option>
            <option value="topic_0">EV Charging Infrastructure</option>
            <option value="topic_1">5G Rollout</option>
            <option value="topic_2">AI Regulation</option>
            <option value="topic_3">UPI Digital Payments</option>
          </select>
        </div>

        {/* Sentiment */}
        <div className="flex items-center gap-1 text-slate-600">
          <span className="text-[10px] font-mono uppercase text-slate-500">Polarity:</span>
          <select
            value={filters.sentiment}
            onChange={(e) => update('sentiment', e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-[#0062FF]/50 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF] font-mono transition-colors"
          >
            <option value="all">All Polarity</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        {/* Language */}
        <div className="flex items-center gap-1 text-slate-600">
          <span className="text-[10px] font-mono uppercase text-slate-500">Lang:</span>
          <select
            value={filters.language}
            onChange={(e) => update('language', e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-[#0062FF]/50 rounded-xl px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#0062FF] font-mono transition-colors"
          >
            <option value="all">All (EN/HI)</option>
            <option value="en">English (EN)</option>
            <option value="hi">Hindi (HI)</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </div>

        {/* Clear Filters CTA */}
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] font-mono text-[#0062FF] hover:text-white bg-blue-50 hover:bg-[#0062FF] border border-blue-200 px-2.5 py-1 rounded-xl transition-all shadow-sm"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
