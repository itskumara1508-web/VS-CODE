import { Router } from "express";
import { store } from "../store/dataStore.js";
import type { ComparisonData, Sentiment } from "@ntro/types";

export const compareRouter = Router();

// GET /api/compare?range=6h&vs=prev_6h
compareRouter.get("/", (req, res) => {
  const range = (req.query.range as string) || "6h";
  const vs = (req.query.vs as string) || "prev_6h";
  const currentKPIs = store.dashboardKPIs();

  // Baseline previous period metrics (synthesized delta for demonstration)
  const comparison: ComparisonData = {
    currentPeriod: {
      label: "Current Window (" + range.toUpperCase() + ")",
      range,
      kpis: currentKPIs,
      sentimentDistribution: { positive: 54.2, negative: 22.8, neutral: 23.0 },
      volumePerHour: [
        { time: "T-5h", count: 4200 },
        { time: "T-4h", count: 4500 },
        { time: "T-3h", count: 5100 },
        { time: "T-2h", count: 6800 },
        { time: "T-1h", count: 8200 },
        { time: "Now", count: 9400 },
      ],
    },
    previousPeriod: {
      label: "Comparison Baseline (" + vs.replace("_", " ").toUpperCase() + ")",
      range: vs,
      kpis: {
        totalPosts: Math.floor(currentKPIs.totalPosts * 0.88),
        activeAccounts: Math.floor(currentKPIs.activeAccounts * 0.94),
        currentSentiment: 'positive' as Sentiment,
        currentSentimentScore: 0.38,
        emergingTrends: Math.max(1, currentKPIs.emergingTrends - 5),
        influencersDetected: Math.max(1, currentKPIs.influencersDetected - 12),
        criticalAlerts: 0,
        postsPerHour: Math.floor(currentKPIs.postsPerHour * 0.82),
      },
      sentimentDistribution: { positive: 68.5, negative: 11.2, neutral: 20.3 },
      volumePerHour: [
        { time: "T-5h", count: 3900 },
        { time: "T-4h", count: 4100 },
        { time: "T-3h", count: 4200 },
        { time: "T-2h", count: 4350 },
        { time: "T-1h", count: 4500 },
        { time: "Now", count: 4600 },
      ],
    },
    deltas: {
      postsChangePct: +13.6,
      activeAccountsChangePct: +6.4,
      sentimentShiftPct: -28.5, // Negative shift in polarity
      postsPerHourChangePct: +22.0,
      emergingTrendsDiff: +5,
      criticalAlertsDiff: +3,
      influencersChangePct: +16.7,
    },
  };

  res.json(comparison);
});
