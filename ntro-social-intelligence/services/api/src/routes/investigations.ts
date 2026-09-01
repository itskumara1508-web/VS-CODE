import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.js";
import type { Investigation, InvestigationItem, AnalystNote, ChainOfCustody } from "@ntro/types";
import crypto from "crypto";

export const investigationsRouter = Router();

// In-memory investigations store with realistic NTRO case dossiers
const investigations: Investigation[] = [
  {
    id: "inv_case_001",
    caseNumber: "NTRO-2026-089",
    title: "EV Charging Grid Failure & Sentiment Cascades",
    description: "Investigating abnormal surge in negative sentiment and rapid cross-community propagation following urban power grid fluctuations.",
    status: "IN_PROGRESS",
    priority: "CRITICAL",
    targetTopic: "topic_0",
    timeRange: "Last 24 Hours",
    assignedTo: "Senior Intelligence Analyst #409",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    tags: ["EV_Grid", "Cascade_Analysis", "Sentiment_Inversion", "Critical_Infrastructure"],
    pinnedItems: [
      {
        id: "pin_001",
        type: "topic",
        title: "EV Charging Infrastructure & Grid Outage",
        referenceId: "topic_0",
        data: { velocity: "340 mentions/hr", growthRate: "+243%", state: "VIRAL" },
        pinnedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        pinnedBy: "Analyst #409",
        annotation: "Primary epicenter of narrative acceleration.",
      },
      {
        id: "pin_002",
        type: "account",
        title: "@tech_analyst_in (Bridge Node)",
        referenceId: "user_003",
        data: { pagerank: 0.88, betweenness: 0.92, community: "Tech Enthusiasts" },
        pinnedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        pinnedBy: "Analyst #409",
        annotation: "Acts as cross-community bridge account to Startup Ecosystem.",
      },
      {
        id: "pin_003",
        type: "alert",
        title: "Statistical Z-Score Sentiment Shift Alert (3.12σ)",
        referenceId: "alert_001",
        data: { severity: "CRITICAL", delta: "+31.4% Negative" },
        pinnedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        pinnedBy: "Analyst #409",
        annotation: "Automated statistical threshold breach confirmed.",
      },
    ],
    notes: [
      {
        id: "note_001",
        author: "Lead Analyst #409",
        authorRole: "Senior Threat Analyst",
        text: "Initial anomaly detected at 14:12 UTC. Cross-community amplification verified between Community #1 and Community #4 within 47 minutes.",
        createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
      },
      {
        id: "note_002",
        author: "Lead Analyst #409",
        authorRole: "Senior Threat Analyst",
        text: "Recommended issuing official technical bulletin clarifying charging telemetry to halt further cascade amplification.",
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
    summaryMetrics: {
      totalPosts: 18420,
      flaggedAccounts: 4,
      dominantSentiment: "negative",
      threatScore: 84.5,
    },
  },
  {
    id: "inv_case_002",
    caseNumber: "NTRO-2026-092",
    title: "5G Spectrum & Telecom Infrastructure Discourse",
    description: "Routine monitoring of public telecommunications rollout sentiment and spectrum testing benchmarks.",
    status: "OPEN",
    priority: "MEDIUM",
    targetTopic: "topic_1",
    timeRange: "Last 7 Days",
    assignedTo: "Network Intelligence Analyst #214",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    tags: ["Telecom", "5G_Expansion", "Public_Sentiment"],
    pinnedItems: [
      {
        id: "pin_004",
        type: "topic",
        title: "5G Rollout & Coverage Expansion",
        referenceId: "topic_1",
        data: { velocity: "180 mentions/hr", growthRate: "+42%", state: "GROWING" },
        pinnedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        pinnedBy: "Analyst #214",
        annotation: "Steady organic growth with positive carrier benchmark reports.",
      },
    ],
    notes: [
      {
        id: "note_003",
        author: "Analyst #214",
        authorRole: "Network Analyst",
        text: "Conversation remains overwhelmingly positive across Tier-1 and Tier-2 regions.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
    summaryMetrics: {
      totalPosts: 24100,
      flaggedAccounts: 0,
      dominantSentiment: "positive",
      threatScore: 12.0,
    },
  },
];

// Validation schemas
const createCaseSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(5).max(1000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  targetTopic: z.string().optional(),
  timeRange: z.string().default("Last 24 Hours"),
  tags: z.array(z.string()).default([]),
});

const pinItemSchema = z.object({
  type: z.enum(["post", "account", "topic", "alert", "graph_cluster", "insight"]),
  title: z.string().min(1),
  referenceId: z.string().min(1),
  data: z.record(z.unknown()).default({}),
  annotation: z.string().optional(),
});

const addNoteSchema = z.object({
  text: z.string().min(2).max(2000),
  author: z.string().default("Analyst #409"),
  authorRole: z.string().default("Intelligence Analyst"),
});

// GET /api/investigations
investigationsRouter.get("/", (_req, res) => {
  res.json(investigations);
});

// GET /api/investigations/:id
investigationsRouter.get("/:id", (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id);
  if (!inv) {
    return res.status(404).json({ error: "not_found", message: "Investigation case not found." });
  }
  res.json(inv);
});

// POST /api/investigations
investigationsRouter.post("/", validateBody(createCaseSchema), (req, res) => {
  const count = investigations.length + 90;
  const newCase: Investigation = {
    id: "inv_case_" + Date.now(),
    caseNumber: "NTRO-2026-" + String(count).padStart(3, "0"),
    title: req.body.title,
    description: req.body.description,
    status: "OPEN",
    priority: req.body.priority || "MEDIUM",
    targetTopic: req.body.targetTopic,
    timeRange: req.body.timeRange || "Last 24 Hours",
    assignedTo: "Lead Intelligence Analyst",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: req.body.tags || ["General_Investigation"],
    pinnedItems: [],
    notes: [
      {
        id: "note_" + Date.now(),
        author: "System Intake",
        authorRole: "Automated Case Manager",
        text: "Investigation dossier initiated for " + req.body.title + ".",
        createdAt: new Date().toISOString(),
      },
    ],
    summaryMetrics: {
      totalPosts: 0,
      flaggedAccounts: 0,
      dominantSentiment: "neutral",
      threatScore: 25.0,
    },
  };

  investigations.unshift(newCase);
  res.status(201).json(newCase);
});

// POST /api/investigations/:id/items (Pin item)
investigationsRouter.post("/:id/items", validateBody(pinItemSchema), (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id);
  if (!inv) {
    return res.status(404).json({ error: "not_found", message: "Investigation case not found." });
  }

  const newItem: InvestigationItem = {
    id: "pin_" + Date.now(),
    type: req.body.type,
    title: req.body.title,
    referenceId: req.body.referenceId,
    data: req.body.data || {},
    pinnedAt: new Date().toISOString(),
    pinnedBy: "Active Analyst",
    annotation: req.body.annotation,
  };

  inv.pinnedItems.unshift(newItem);
  inv.updatedAt = new Date().toISOString();
  res.status(201).json(inv);
});

// POST /api/investigations/:id/notes (Add note)
investigationsRouter.post("/:id/notes", validateBody(addNoteSchema), (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id);
  if (!inv) {
    return res.status(404).json({ error: "not_found", message: "Investigation case not found." });
  }

  const newNote: AnalystNote = {
    id: "note_" + Date.now(),
    author: req.body.author || "Analyst",
    authorRole: req.body.authorRole || "Analyst",
    text: req.body.text,
    createdAt: new Date().toISOString(),
  };

  inv.notes.push(newNote);
  inv.updatedAt = new Date().toISOString();
  res.status(201).json(inv);
});

// PATCH /api/investigations/:id (Update status/priority)
investigationsRouter.patch("/:id", (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id);
  if (!inv) {
    return res.status(404).json({ error: "not_found", message: "Investigation case not found." });
  }

  if (req.body.status) inv.status = req.body.status;
  if (req.body.priority) inv.priority = req.body.priority;
  if (req.body.title) inv.title = req.body.title;
  if (req.body.description) inv.description = req.body.description;
  inv.updatedAt = new Date().toISOString();

  res.json(inv);
});

// DELETE /api/investigations/:id
investigationsRouter.delete("/:id", (req, res) => {
  const idx = investigations.findIndex((i) => i.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "not_found", message: "Investigation case not found." });
  }
  investigations.splice(idx, 1);
  res.json({ success: true, message: "Case dossier archived." });
});

// GET /api/investigations/:id/report (Consolidated Report with Chain-of-Custody)
investigationsRouter.get("/:id/report", (req, res) => {
  const inv = investigations.find((i) => i.id === req.params.id);
  if (!inv) {
    return res.status(404).json({ error: "not_found", message: "Investigation case not found." });
  }

  const reportId = "REP-CASE-" + inv.caseNumber + "-" + Date.now().toString(36).toUpperCase();
  const now = new Date().toISOString();
  const rawHashPayload = reportId + ":" + inv.id + ":" + inv.caseNumber + ":" + now + ":NTRO_INTEL_HUB";
  const sha256Hash = crypto.createHash("sha256").update(rawHashPayload).digest("hex");

  const chainOfCustody: ChainOfCustody = {
    reportId,
    classification: "RESTRICTED // NTRO",
    generatedAt: now,
    generatedBy: inv.assignedTo,
    analystRole: "Senior Threat Analyst",
    dataTimeRange: inv.timeRange,
    recordCount: inv.pinnedItems.length * 1420 + 840,
    systemNodeId: "NODE-DELHI-INTEL-01",
    cryptographicHash: sha256Hash,
    digitalSignature: "SIG_NTRO_" + sha256Hash.slice(0, 16).toUpperCase(),
    exportFormat: "PDF/JSON Consolidated Case Dossier",
  };

  res.json({
    investigation: inv,
    chainOfCustody,
    executiveSummary: "Consolidated intelligence findings for Case " + inv.caseNumber + " (" + inv.title + "). Total " + inv.pinnedItems.length + " pinned primary evidence items and " + inv.notes.length + " verified analyst deliberations logged.",
    exportUrl: "/api/reports/download/" + reportId,
  });
});
