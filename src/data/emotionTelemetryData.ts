import { Platform } from '../types';

export interface EmotionVector {
  id: string;
  name: string;
  emoji: string;
  color: string;
  share: number; // percentage of overall discourse
  change: string;
  intensity: number; // 0-100 index
  description: string;
  keywords: string[];
}

export const emotionVectors: EmotionVector[] = [
  {
    id: 'excitement',
    name: 'Excitement & Euphoria',
    emoji: '🤩',
    color: '#00f0ff',
    share: 28,
    change: '+16.4%',
    intensity: 92,
    description: 'Technological triumphs, breakthrough hype, viral celebrations, national pride milestones',
    keywords: ['innovative', 'historic', 'proud', 'milestone', 'incredible', 'revolution', 'bharat'],
  },
  {
    id: 'supportive',
    name: 'Support & Trust',
    emoji: '🤝',
    color: '#10b981',
    share: 32,
    change: '+8.2%',
    intensity: 86,
    description: 'Solidarity, institutional faith, grassroots backing, civic alignment',
    keywords: ['stand with', 'commendable', 'trust', 'progress', 'safety', 'visionary', 'leadership'],
  },
  {
    id: 'hope',
    name: 'Hope & Gratitude',
    emoji: '💖',
    color: '#3b82f6',
    share: 14,
    change: '+5.1%',
    intensity: 78,
    description: 'Future optimism, youth empowerment, societal well-being, community gratitude',
    keywords: ['bright future', 'thankful', 'inspiring', 'opportunity', 'empowered', 'grateful'],
  },
  {
    id: 'neutral',
    name: 'Objective Neutrality',
    emoji: '😐',
    color: '#94a3b8',
    share: 12,
    change: '-2.4%',
    intensity: 50,
    description: 'Fact-checking, news reporting, technical documentation, objective data reads',
    keywords: ['reported', 'according to', 'statistics', 'update', 'official notice', 'briefing'],
  },
  {
    id: 'anxiety',
    name: 'Anxiety & Caution',
    emoji: '😰',
    color: '#f59e0b',
    share: 6,
    change: '-3.8%',
    intensity: 62,
    description: 'Security alerts, regulatory ambiguity, economic uncertainty, privacy tension',
    keywords: ['concerning', 'risk', 'warning', 'uncertain', 'vulnerability', 'threat', 'cost'],
  },
  {
    id: 'outrage',
    name: 'Outrage & Hostility',
    emoji: '😡',
    color: '#ef4444',
    share: 4,
    change: '-9.6%',
    intensity: 84,
    description: 'Coordinated counter-narratives, public indignation, breach complaints, grievance spikes',
    keywords: ['disgrace', 'unacceptable', 'scam', 'failure', 'culprit', 'boycott', 'corruption'],
  },
  {
    id: 'empathy',
    name: 'Empathy & Sorrow',
    emoji: '😢',
    color: '#8b5cf6',
    share: 2,
    change: '+1.0%',
    intensity: 46,
    description: 'Humanitarian compassion, crisis condolences, solidarity with victims',
    keywords: ['prayers', 'heartbroken', 'condolences', 'strength', 'support for families'],
  },
  {
    id: 'sarcasm',
    name: 'Sarcasm & Cynicism',
    emoji: '🎭',
    color: '#ec4899',
    share: 2,
    change: '+2.5%',
    intensity: 74,
    description: 'Ironic memes, double-edged satire, satirical punchlines, skepticism masking praise',
    keywords: ['obviously', 'as if', 'surely', 'genius move', 'waah', 'kya baat', 'masterstroke'],
  },
];

// Radar Spider Chart Dataset
export interface EmotionRadarPoint {
  subject: string;
  emoji: string;
  current: number;
  baseline: number;
  fullMark: number;
}

export const emotionRadarData: EmotionRadarPoint[] = [
  { subject: 'Excitement', emoji: '🤩', current: 92, baseline: 68, fullMark: 100 },
  { subject: 'Support', emoji: '🤝', current: 86, baseline: 76, fullMark: 100 },
  { subject: 'Hope', emoji: '💖', current: 78, baseline: 62, fullMark: 100 },
  { subject: 'Neutral', emoji: '😐', current: 50, baseline: 58, fullMark: 100 },
  { subject: 'Anxiety', emoji: '😰', current: 38, baseline: 52, fullMark: 100 },
  { subject: 'Outrage', emoji: '😡', current: 32, baseline: 46, fullMark: 100 },
  { subject: 'Empathy', emoji: '😢', current: 46, baseline: 42, fullMark: 100 },
  { subject: 'Sarcasm', emoji: '🎭', current: 54, baseline: 48, fullMark: 100 },
];

// Time-Series Emotion Telemetry
export interface EmotionTimelineEntry {
  time: string;
  excitement: number;
  supportive: number;
  hope: number;
  neutral: number;
  anxiety: number;
  outrage: number;
  empathy: number;
  sarcasm: number;
  compositeScore: number;
}

export const emotionTimeline24H: EmotionTimelineEntry[] = [
  { time: '00:00', excitement: 22, supportive: 34, hope: 12, neutral: 16, anxiety: 8, outrage: 4, empathy: 2, sarcasm: 2, compositeScore: 71.4 },
  { time: '03:00', excitement: 20, supportive: 36, hope: 14, neutral: 15, anxiety: 7, outrage: 4, empathy: 2, sarcasm: 2, compositeScore: 72.8 },
  { time: '06:00', excitement: 24, supportive: 35, hope: 15, neutral: 14, anxiety: 6, outrage: 3, empathy: 2, sarcasm: 1, compositeScore: 74.2 },
  { time: '09:00', excitement: 31, supportive: 32, hope: 13, neutral: 11, anxiety: 6, outrage: 4, empathy: 1, sarcasm: 2, compositeScore: 75.6 },
  { time: '12:00', excitement: 29, supportive: 31, hope: 15, neutral: 12, anxiety: 6, outrage: 4, empathy: 1, sarcasm: 2, compositeScore: 74.9 },
  { time: '15:00', excitement: 34, supportive: 30, hope: 14, neutral: 10, anxiety: 5, outrage: 3, empathy: 2, sarcasm: 2, compositeScore: 76.5 },
  { time: '18:00', excitement: 36, supportive: 31, hope: 13, neutral: 9, anxiety: 5, outrage: 3, empathy: 1, sarcasm: 2, compositeScore: 77.8 },
  { time: '21:00', excitement: 30, supportive: 33, hope: 14, neutral: 11, anxiety: 5, outrage: 3, empathy: 2, sarcasm: 2, compositeScore: 75.9 },
];

export const emotionTimeline7D: EmotionTimelineEntry[] = [
  { time: 'Mon', excitement: 24, supportive: 32, hope: 14, neutral: 14, anxiety: 8, outrage: 5, empathy: 1, sarcasm: 2, compositeScore: 72.1 },
  { time: 'Tue', excitement: 26, supportive: 33, hope: 13, neutral: 13, anxiety: 7, outrage: 4, empathy: 2, sarcasm: 2, compositeScore: 73.5 },
  { time: 'Wed', excitement: 29, supportive: 31, hope: 15, neutral: 11, anxiety: 6, outrage: 4, empathy: 2, sarcasm: 2, compositeScore: 75.0 },
  { time: 'Thu', excitement: 32, supportive: 30, hope: 16, neutral: 10, anxiety: 5, outrage: 3, empathy: 2, sarcasm: 2, compositeScore: 76.8 },
  { time: 'Fri', excitement: 35, supportive: 29, hope: 15, neutral: 10, anxiety: 4, outrage: 3, empathy: 2, sarcasm: 2, compositeScore: 78.2 },
  { time: 'Sat', excitement: 31, supportive: 33, hope: 14, neutral: 11, anxiety: 5, outrage: 3, empathy: 1, sarcasm: 2, compositeScore: 76.4 },
  { time: 'Sun', excitement: 28, supportive: 34, hope: 15, neutral: 11, anxiety: 5, outrage: 3, empathy: 2, sarcasm: 2, compositeScore: 75.7 },
];

export const emotionTimeline30D: EmotionTimelineEntry[] = [
  { time: 'Week 1', excitement: 22, supportive: 30, hope: 13, neutral: 16, anxiety: 10, outrage: 6, empathy: 1, sarcasm: 2, compositeScore: 69.8 },
  { time: 'Week 2', excitement: 25, supportive: 32, hope: 14, neutral: 13, anxiety: 8, outrage: 5, empathy: 1, sarcasm: 2, compositeScore: 72.4 },
  { time: 'Week 3', excitement: 30, supportive: 31, hope: 15, neutral: 11, anxiety: 6, outrage: 4, empathy: 1, sarcasm: 2, compositeScore: 75.9 },
  { time: 'Week 4', excitement: 33, supportive: 32, hope: 14, neutral: 10, anxiety: 5, outrage: 3, empathy: 1, sarcasm: 2, compositeScore: 77.4 },
];

// Platform Emotion Comparison Matrix
export interface PlatformEmotionDistribution {
  platform: Platform;
  color: string;
  excitement: number;
  supportive: number;
  hope: number;
  neutral: number;
  anxiety: number;
  outrage: number;
  empathy: number;
  sarcasm: number;
}

export const platformEmotionComparison: PlatformEmotionDistribution[] = [
  {
    platform: 'X',
    color: '#1DA1F2',
    excitement: 34,
    supportive: 26,
    hope: 10,
    neutral: 14,
    anxiety: 7,
    outrage: 5,
    empathy: 1,
    sarcasm: 3,
  },
  {
    platform: 'Telegram',
    color: '#229ED9',
    excitement: 22,
    supportive: 42,
    hope: 12,
    neutral: 12,
    anxiety: 6,
    outrage: 3,
    empathy: 1,
    sarcasm: 2,
  },
  {
    platform: 'Instagram',
    color: '#E1306C',
    excitement: 42,
    supportive: 24,
    hope: 20,
    neutral: 6,
    anxiety: 3,
    outrage: 2,
    empathy: 2,
    sarcasm: 1,
  },
  {
    platform: 'Facebook',
    color: '#1877F2',
    excitement: 20,
    supportive: 38,
    hope: 18,
    neutral: 12,
    anxiety: 5,
    outrage: 4,
    empathy: 2,
    sarcasm: 1,
  },
  {
    platform: 'Reddit',
    color: '#FF4500',
    excitement: 16,
    supportive: 22,
    hope: 8,
    neutral: 24,
    anxiety: 10,
    outrage: 8,
    empathy: 2,
    sarcasm: 10, // Sarcasm is highest on Reddit
  },
  {
    platform: 'YouTube',
    color: '#FF0000',
    excitement: 36,
    supportive: 32,
    hope: 16,
    neutral: 8,
    anxiety: 3,
    outrage: 3,
    empathy: 1,
    sarcasm: 1,
  },
];

// Emotion Virality Multiplier (Velocity Multiplier)
export interface EmotionVirality {
  emotion: string;
  emoji: string;
  multiplier: number;
  avgSharesPerPost: number;
  propagationHalfLifeHours: number;
  color: string;
}

export const emotionViralityIndex: EmotionVirality[] = [
  { emotion: 'Excitement', emoji: '🤩', multiplier: 4.8, avgSharesPerPost: 342, propagationHalfLifeHours: 2.1, color: '#00f0ff' },
  { emotion: 'Outrage', emoji: '😡', multiplier: 4.2, avgSharesPerPost: 298, propagationHalfLifeHours: 1.8, color: '#ef4444' },
  { emotion: 'Sarcasm', emoji: '🎭', multiplier: 3.6, avgSharesPerPost: 220, propagationHalfLifeHours: 3.4, color: '#ec4899' },
  { emotion: 'Support', emoji: '🤝', multiplier: 2.8, avgSharesPerPost: 174, propagationHalfLifeHours: 6.2, color: '#10b981' },
  { emotion: 'Hope', emoji: '💖', multiplier: 2.4, avgSharesPerPost: 142, propagationHalfLifeHours: 5.5, color: '#3b82f6' },
  { emotion: 'Anxiety', emoji: '😰', multiplier: 2.2, avgSharesPerPost: 130, propagationHalfLifeHours: 4.1, color: '#f59e0b' },
  { emotion: 'Empathy', emoji: '😢', multiplier: 1.6, avgSharesPerPost: 95, propagationHalfLifeHours: 4.8, color: '#8b5cf6' },
  { emotion: 'Neutral', emoji: '😐', multiplier: 1.0, avgSharesPerPost: 45, propagationHalfLifeHours: 8.0, color: '#94a3b8' },
];

// Preset Test Samples for Real-Time Classifier
export interface SampleEmotionInput {
  text: string;
  language: string;
  dominantEmotion: string;
  emoji: string;
  sarcasmScore: number; // 0-100
  sentimentType: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  explanation: string;
}

export const sampleEmotionInputs: SampleEmotionInput[] = [
  {
    text: 'Bharat leading the global cyber defense initiative at SIH 2026 is pure genius! Proud moment for all of us! 🇮🇳🚀',
    language: 'English',
    dominantEmotion: 'Excitement & Euphoria',
    emoji: '🤩',
    sarcasmScore: 4,
    sentimentType: 'Positive',
    confidence: 98,
    explanation: 'High concentration of lexical superlatives ("pure genius", "proud moment") and celebratory exclamation.',
  },
  {
    text: 'Stand firmly behind our national defense organisations. Transparent, swift, and highly commendable work.',
    language: 'English',
    dominantEmotion: 'Support & Trust',
    emoji: '🤝',
    sarcasmScore: 2,
    sentimentType: 'Positive',
    confidence: 96,
    explanation: 'Unambiguous institutional trust vectors ("stand firmly", "commendable work").',
  },
  {
    text: 'Kya baat hai bhai! Aisi hi digital security chahiye thi, ab to server bhi hack hone se pehle permission mangega 🙄😂',
    language: 'Hinglish',
    dominantEmotion: 'Sarcasm & Cynicism',
    emoji: '🎭',
    sarcasmScore: 92,
    sentimentType: 'Negative',
    confidence: 94,
    explanation: 'Surface phrase "kya baat hai" inverted by absurd hyperbole ("server hack hone se pehle permission mangega") and rolling eyes emoji.',
  },
  {
    text: 'The advisory release 26152 specifies port 8080 encryption rules. Compliance mandatory before Q3 audit.',
    language: 'English',
    dominantEmotion: 'Objective Neutrality',
    emoji: '😐',
    sarcasmScore: 0,
    sentimentType: 'Neutral',
    confidence: 99,
    explanation: 'Pure factual dissemination with zero valence bias or affective markers.',
  },
  {
    text: 'Will this new framework disrupt open-source developers? Really worried about compliance overhead and legal penalties.',
    language: 'English',
    dominantEmotion: 'Anxiety & Caution',
    emoji: '😰',
    sarcasmScore: 8,
    sentimentType: 'Negative',
    confidence: 91,
    explanation: 'Direct expressions of apprehension ("worried", "disrupt", "penalties").',
  },
  {
    text: 'Kamaal ka innovation hai! Hamare desh ke young researchers ka talent world-class hai! ❤️‍🔥👏',
    language: 'Hindi / Hinglish',
    dominantEmotion: 'Hope & Gratitude',
    emoji: '💖',
    sarcasmScore: 5,
    sentimentType: 'Positive',
    confidence: 95,
    explanation: 'Patriotic appreciation and youth enablement validation.',
  },
];
