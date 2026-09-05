import { Platform } from '../types';

export interface TelemetryPoint {
  time: string;
  livePeople: number;
  comments: number;
  views: number;
  postingRate: number;
  supportive: number;
  excitement: number;
  neutral: number;
  anxiety: number;
  against: number;
}

export type TimeRange = '24H' | '7D' | '30D';

// Multipliers and baseline characteristics per platform
const platformBaselines: Record<
  Platform,
  {
    peopleBase: number;
    peoplePeak: number;
    commentsBase: number;
    commentsPeak: number;
    viewsBase: number;
    viewsPeak: number;
    postingBase: number;
    postingPeak: number;
    emotionWeights: { supportive: number; excitement: number; neutral: number; anxiety: number; against: number };
  }
> = {
  X: {
    peopleBase: 18400,
    peoplePeak: 48900,
    commentsBase: 3200,
    commentsPeak: 14800,
    viewsBase: 420000,
    viewsPeak: 2450000,
    postingBase: 840,
    postingPeak: 4200,
    emotionWeights: { supportive: 34, excitement: 26, neutral: 16, anxiety: 14, against: 10 },
  },
  Telegram: {
    peopleBase: 12200,
    peoplePeak: 34500,
    commentsBase: 1400,
    commentsPeak: 5800,
    viewsBase: 240000,
    viewsPeak: 1650000,
    postingBase: 420,
    postingPeak: 2890,
    emotionWeights: { supportive: 42, excitement: 18, neutral: 24, anxiety: 10, against: 6 },
  },
  Instagram: {
    peopleBase: 24500,
    peoplePeak: 68400,
    commentsBase: 4800,
    commentsPeak: 22400,
    viewsBase: 850000,
    viewsPeak: 4800000,
    postingBase: 510,
    postingPeak: 1980,
    emotionWeights: { supportive: 36, excitement: 44, neutral: 10, anxiety: 6, against: 4 },
  },
  Facebook: {
    peopleBase: 15800,
    peoplePeak: 44200,
    commentsBase: 2200,
    commentsPeak: 11200,
    viewsBase: 380000,
    viewsPeak: 2200000,
    postingBase: 380,
    postingPeak: 1240,
    emotionWeights: { supportive: 32, excitement: 14, neutral: 22, anxiety: 16, against: 16 },
  },
  Reddit: {
    peopleBase: 8900,
    peoplePeak: 31200,
    commentsBase: 4200,
    commentsPeak: 24500,
    viewsBase: 180000,
    viewsPeak: 1350000,
    postingBase: 220,
    postingPeak: 980,
    emotionWeights: { supportive: 22, excitement: 8, neutral: 26, anxiety: 18, against: 26 },
  },
  YouTube: {
    peopleBase: 28400,
    peoplePeak: 79600,
    commentsBase: 2800,
    commentsPeak: 16400,
    viewsBase: 1450000,
    viewsPeak: 7800000,
    postingBase: 110,
    postingPeak: 620,
    emotionWeights: { supportive: 38, excitement: 36, neutral: 14, anxiety: 7, against: 5 },
  },
};

export const getPlatformTelemetry = (platform: Platform, range: TimeRange): TelemetryPoint[] => {
  const base = platformBaselines[platform] || platformBaselines.X;

  if (range === '24H') {
    const hours = [
      '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
      '12:00', '14:00', '16:00', '18:00', '20:00', '22:00',
    ];
    // Realistic diurnial cycle with peak in evening (18:00 - 22:00)
    const diurnalFactors = [0.45, 0.32, 0.28, 0.42, 0.65, 0.82, 0.88, 0.79, 0.86, 0.98, 1.0, 0.74];

    return hours.map((hour, idx) => {
      const factor = diurnalFactors[idx];
      const variance = 0.92 + Math.sin(idx * 1.5) * 0.08;
      const effectiveFactor = factor * variance;

      return {
        time: hour,
        livePeople: Math.round(base.peopleBase + (base.peoplePeak - base.peopleBase) * effectiveFactor),
        comments: Math.round(base.commentsBase + (base.commentsPeak - base.commentsBase) * effectiveFactor),
        views: Math.round(base.viewsBase + (base.viewsPeak - base.viewsBase) * effectiveFactor),
        postingRate: Math.round(base.postingBase + (base.postingPeak - base.postingBase) * effectiveFactor),
        supportive: Math.round(base.emotionWeights.supportive + Math.sin(idx) * 4),
        excitement: Math.round(base.emotionWeights.excitement + Math.cos(idx) * 3),
        neutral: Math.round(base.emotionWeights.neutral - Math.sin(idx) * 2),
        anxiety: Math.round(base.emotionWeights.anxiety + (idx >= 8 ? 3 : -2)),
        against: Math.round(base.emotionWeights.against + (idx >= 9 ? 2 : -1)),
      };
    });
  }

  if (range === '7D') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekendFactors = [0.82, 0.85, 0.89, 0.94, 1.0, 0.96, 0.91];

    return days.map((day, idx) => {
      const factor = weekendFactors[idx];
      return {
        time: day,
        livePeople: Math.round(base.peopleBase * 1.1 + (base.peoplePeak - base.peopleBase) * factor),
        comments: Math.round(base.commentsBase * 1.2 + (base.commentsPeak - base.commentsBase) * factor),
        views: Math.round(base.viewsBase * 1.15 + (base.viewsPeak - base.viewsBase) * factor),
        postingRate: Math.round(base.postingBase * 1.1 + (base.postingPeak - base.postingBase) * factor),
        supportive: Math.round(base.emotionWeights.supportive + (idx % 2 === 0 ? 3 : -2)),
        excitement: Math.round(base.emotionWeights.excitement + (idx >= 4 ? 4 : -2)),
        neutral: Math.round(base.emotionWeights.neutral + (idx < 4 ? 2 : -2)),
        anxiety: Math.round(base.emotionWeights.anxiety + (idx === 3 ? 4 : -1)),
        against: Math.round(base.emotionWeights.against + (idx === 2 ? 3 : 0)),
      };
    });
  }

  // 30D Monthly aggregated telemetry
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const monthGrowth = [0.78, 0.86, 0.94, 1.0];

  return weeks.map((week, idx) => {
    const factor = monthGrowth[idx];
    return {
      time: week,
      livePeople: Math.round(base.peopleBase * 1.2 + (base.peoplePeak - base.peopleBase) * factor),
      comments: Math.round(base.commentsBase * 1.3 + (base.commentsPeak - base.commentsBase) * factor),
      views: Math.round(base.viewsBase * 1.3 + (base.viewsPeak - base.viewsBase) * factor),
      postingRate: Math.round(base.postingBase * 1.25 + (base.postingPeak - base.postingBase) * factor),
      supportive: Math.round(base.emotionWeights.supportive + idx * 2),
      excitement: Math.round(base.emotionWeights.excitement + idx * 1.5),
      neutral: Math.max(8, Math.round(base.emotionWeights.neutral - idx * 2)),
      anxiety: Math.round(base.emotionWeights.anxiety + (idx === 1 ? 3 : -1)),
      against: Math.round(base.emotionWeights.against - idx),
    };
  });
};

