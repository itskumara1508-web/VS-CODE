import { Router, Request, Response } from "express";

export const docsRouter = Router();

/**
 * OpenAPI 3.0.3 Specification for SOCIOINTELL Backend API
 */
const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "SOCIOINTELL - AI-Powered Social Media Intelligence API",
    version: "2.4.0",
    description: "Production API for Smart India Hackathon (SIH) Social Media Intelligence & Network Analysis platform.",
    contact: {
      name: "NTRO Social Intelligence Operations",
      email: "support@sociointell.gov.in"
    }
  },
  servers: [
    { url: "http://localhost:4000", description: "Local Development Server" },
    { url: "https://api.sociointell.gov.in", description: "Production Gateway" }
  ],
  paths: {
    "/api/health": {
      get: {
        summary: "System Health Check",
        responses: { "200": { description: "Service status and telemetry" } }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Authenticate Analyst",
        requestBody: {
          content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } } } } }
        },
        responses: { "200": { description: "JWT Access Token" } }
      }
    },
    "/api/dashboard/summary": {
      get: {
        summary: "Overview Command Center KPIs & Distributions",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Dashboard summary matrix" } }
      }
    },
    "/api/platforms": {
      get: {
        summary: "List Supported Social Platforms with Telemetry",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Array of PlatformIntelligence objects" } }
      }
    },
    "/api/platforms/compare": {
      get: {
        summary: "Cross-Platform Metrics, Sentiment & Propagation Comparison",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "CrossPlatformComparison dataset" } }
      }
    },
    "/api/posts": {
      get: {
        summary: "Live & Filtered Post Stream",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "platform", in: "query", schema: { type: "string" } },
          { name: "sentiment", in: "query", schema: { type: "string" } },
          { name: "topicId", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer" } }
        ],
        responses: { "200": { description: "Paginated list of normalized social posts" } }
      }
    },
    "/api/sentiment/timeline": {
      get: {
        summary: "Hourly Sentiment Polarity Trajectory",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Array of hourly sentiment buckets" } }
      }
    },
    "/api/audience": {
      get: {
        summary: "Aggregate Anonymized Demographic Intelligence",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Demographic breakdown and segments" } }
      }
    },
    "/api/trends": {
      get: {
        summary: "Real-Time Detected Trends & Growth Velocity",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "List of active trend objects" } }
      }
    },
    "/api/network": {
      get: {
        summary: "Network Graph Topology (Nodes & Edges)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Nodes and edges with PageRank and Centrality" } }
      }
    },
    "/api/investigations": {
      get: {
        summary: "List Active Investigation Case Folders",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Array of investigations" } }
      },
      post: {
        summary: "Create New Investigation Dossier",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Created investigation object" } }
      }
    },
    "/api/alerts": {
      get: {
        summary: "Active Intelligence Alerts & Watchlists",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "List of system alerts" } }
      }
    },
    "/api/reports/generate": {
      post: {
        summary: "Generate Automated Cryptographic Intelligence Report",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Generated report with SHA-256 Chain of Custody" } }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

docsRouter.get("/", (_req: Request, res: Response) => {
  res.json(openApiSpec);
});

docsRouter.get("/ui", (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SOCIOINTELL API Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
        <style>
          body { margin: 0; background: #fafafa; font-family: sans-serif; }
          .topbar { display: none; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: /api/docs,
              dom_id: #swagger-ui,
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout"
            });
          };
        </script>
      </body>
    </html>
  `);
});
