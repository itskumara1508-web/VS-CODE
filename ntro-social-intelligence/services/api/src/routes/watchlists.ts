import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import type { WatchlistRule, WatchlistMatch } from "@ntro/types";

export const watchlistsRouter = Router();

// In-memory watchlists store
let watchlistRules: WatchlistRule[] = [
  {
    id: "rule_001",
    name: "Power Grid Anomaly Keywords",
    type: "keyword",
    query: "grid failure, substation, power cut, black out, voltage spike",
    alertLevel: "CRITICAL",
    enabled: true,
    sensitivityThreshold: 85,
    matchesCount: 142,
    lastMatchAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdBy: "Analyst #409",
  },
  {
    id: "rule_002",
    name: "Key EV Infrastructure Influencer Watch",
    type: "account",
    query: "@ev_watch_india, @tech_analyst_in, @clean_energy_hub",
    alertLevel: "HIGH",
    enabled: true,
    sensitivityThreshold: 70,
    matchesCount: 89,
    lastMatchAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdBy: "Analyst #409",
  },
  {
    id: "rule_003",
    name: "Cyber & AI Security Standard Hashtags",
    type: "hashtag",
    query: "#AISafety, #CyberThreats, #CriticalInfra, #DataBreach",
    alertLevel: "WARNING",
    enabled: true,
    sensitivityThreshold: 60,
    matchesCount: 34,
    lastMatchAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdBy: "Analyst #214",
  },
];

let recentMatches: WatchlistMatch[] = [
  {
    id: "match_001",
    ruleId: "rule_001",
    ruleName: "Power Grid Anomaly Keywords",
    postId: "post_101",
    platform: "x",
    author: "@metro_grid_observer",
    text: "Multiple charging hubs across the central corridor are reporting voltage drops and substation power cuts.",
    matchedTerm: "substation power cuts",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    severity: "CRITICAL",
  },
  {
    id: "match_002",
    ruleId: "rule_002",
    ruleName: "Key EV Infrastructure Influencer Watch",
    postId: "post_102",
    platform: "telegram",
    author: "@tech_analyst_in",
    text: "Reviewing telemetry logs from three charging station clusters. Outage appears localized but propagation is accelerating.",
    matchedTerm: "@tech_analyst_in",
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    severity: "HIGH",
  },
  {
    id: "match_003",
    ruleId: "rule_001",
    ruleName: "Power Grid Anomaly Keywords",
    postId: "post_103",
    platform: "reddit",
    author: "@fleet_manager_delhi",
    text: "Is anyone else experiencing charging grid failures in sector 4? Vehicles stuck at 20% capacity.",
    matchedTerm: "grid failures",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    severity: "CRITICAL",
  },
];

const createRuleSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.enum(["keyword", "account", "hashtag", "topic"]),
  query: z.string().min(2).max(500),
  alertLevel: z.enum(["INFO", "WARNING", "HIGH", "CRITICAL"]).default("WARNING"),
  sensitivityThreshold: z.number().min(1).max(100).default(75),
});

// GET /api/watchlists
watchlistsRouter.get("/", (_req, res) => {
  res.json({
    rules: watchlistRules,
    matches: recentMatches,
    stats: {
      totalRules: watchlistRules.length,
      activeRules: watchlistRules.filter((r) => r.enabled).length,
      totalMatches24h: watchlistRules.reduce((acc, r) => acc + r.matchesCount, 0),
    },
  });
});

// POST /api/watchlists
watchlistsRouter.post("/", validateBody(createRuleSchema), (req, res) => {
  const newRule: WatchlistRule = {
    id: "rule_" + Date.now(),
    name: req.body.name,
    type: req.body.type,
    query: req.body.query,
    alertLevel: req.body.alertLevel || "WARNING",
    enabled: true,
    sensitivityThreshold: req.body.sensitivityThreshold || 75,
    matchesCount: 0,
    createdAt: new Date().toISOString(),
    createdBy: "Active Analyst",
  };

  watchlistRules.unshift(newRule);
  res.status(201).json(newRule);
});

// PATCH /api/watchlists/:id/toggle
watchlistsRouter.patch("/:id/toggle", (req, res) => {
  const rule = watchlistRules.find((r) => r.id === req.params.id);
  if (!rule) {
    return res.status(404).json({ error: "not_found", message: "Watchlist rule not found." });
  }
  rule.enabled = !rule.enabled;
  res.json(rule);
});

// DELETE /api/watchlists/:id
watchlistsRouter.delete("/:id", (req, res) => {
  const idx = watchlistRules.findIndex((r) => r.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "not_found", message: "Watchlist rule not found." });
  }
  watchlistRules.splice(idx, 1);
  res.json({ success: true, message: "Watchlist rule deleted." });
});
