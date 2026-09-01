import { Router } from 'express';
import { z } from 'zod';
import { store } from '../store/dataStore.js';
import { validateBody } from '../middleware/validate.js';
import type { ChainOfCustody } from '@ntro/types';
import crypto from 'crypto';

const reportSchema = z.object({
  title: z.string().min(3).max(200),
  format: z.enum(['pdf', 'csv', 'json']).default('json'),
});

export const reportsRouter = Router();

reportsRouter.get('/', (_req, res) => {
  // List available/previous reports. In the prototype we generate on the fly.
  res.json([]);
});

reportsRouter.post('/generate', validateBody(reportSchema), (req, res) => {
  const { title, format } = req.body;
  const now = new Date().toISOString();
  const reportId = `REP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const rawHashPayload = `${reportId}:${title}:${now}:RESTRICTED_NTRO`;
  const sha256Hash = crypto.createHash('sha256').update(rawHashPayload).digest('hex');

  const chainOfCustody: ChainOfCustody = {
    reportId,
    classification: 'RESTRICTED // NTRO',
    generatedAt: now,
    generatedBy: 'Senior Intelligence Analyst #409',
    analystRole: 'Senior Threat Analyst',
    dataTimeRange: 'Last 24 Hours (Active Rolling Window)',
    recordCount: store.posts.length,
    systemNodeId: 'NODE-DELHI-INTEL-01',
    cryptographicHash: sha256Hash,
    digitalSignature: `SIG_NTRO_${sha256Hash.slice(0, 16).toUpperCase()}`,
    exportFormat: format.toUpperCase(),
  };

  const data = {
    title,
    format,
    chainOfCustody,
    generatedAt: now,
    executiveSummary: `Strategic intelligence analysis of ${store.posts.length} posts across ${store.users.length} anonymized accounts.`,
    kpis: store.dashboardKPIs(),
    timeline: store.timeline,
    sentiment: store.sentimentTimeline(),
    audience: store.demographics,
    trendingTopics: store.trends,
    influencers: store.influencers,
    network: {
      communities: store.communities,
      centrality: store.influencers.map((i) => ({
        handle: i.handle,
        pagerank: i.pagerank,
        betweenness: i.betweennessCentrality,
        degree: i.degreeCentrality,
      })),
    },
    propagation: store.network.edges.filter((e) => e.type === 'community_link'),
    aiInsights: store.insights,
  };
  if (format === 'csv') {
    const header = 'field,value\n';
    const rows = Object.entries(data.kpis).map(([k, v]) => `${k},${v}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_')}.csv"`);
    res.send(header + rows);
    return;
  }
  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_')}.json"`);
    res.send(JSON.stringify(data, null, 2));
    return;
  }
  // PDF placeholder: return a JSON payload with an HTML-renderable structure.
  res.json({
    ...data,
    message: 'PDF export is generated on the web client from this structured payload.',
  });
});

reportsRouter.get('/download/:format', (req, res) => {
  const format = req.params.format as 'pdf' | 'csv' | 'json';
  const title = 'NTRO Social Intelligence Report';
  const data = {
    title,
    generatedAt: new Date().toISOString(),
    kpis: store.dashboardKPIs(),
    timeline: store.timeline,
    sentiment: store.sentimentTimeline(),
    trendingTopics: store.trends,
  };
  if (format === 'csv') {
    const rows = Object.entries(data.kpis).map(([k, v]) => `${k},${v}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ntro_report.csv"');
    res.send(`field,value\n${rows}`);
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="ntro_report.json"');
  res.send(JSON.stringify(data, null, 2));
});
