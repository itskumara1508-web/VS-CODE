# NTRO AI-Powered Social Media Intelligence & Network Analysis Platform

[![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald)](#)
[![Theme](https://img.shields.io/badge/Theme-NTRO%20%2F%20SIH-blue)](#)
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Express%20%7C%20FastAPI%20%7C%20PostgreSQL-amber)](#)

> **National Technical Research Organisation (NTRO) / Smart India Hackathon (SIH)**
> A production-grade social media intelligence, multi-dimensional sentiment analysis, trend forecasting, and network topology analysis platform designed for intelligence analysts and decision-makers.

---

## 🎯 Key Capabilities & The 5 Integrated Pillars

1. **Continuous Data Collection & Timeline Management**:
   - Ingests and normalizes multi-platform data (X, Telegram, Reddit, YouTube, Instagram, Facebook).
   - Reconstructs chronological information cascade progression: `POST → INTERACTION → SENTIMENT → TOPIC → INFLUENCE → PROPAGATION`.
2. **Multi-Dimensional Sentiment & Emotion Inference**:
   - Polarity scores (-1.0 to +1.0).
   - 10-Emotion taxonomy distribution (Joy, Anger, Fear, Sadness, Surprise, Excitement, Anxiety, Supportive, Hostile, Neutral).
   - Ideological stance classification (Support, Neutral, Against).
   - Sarcasm probability & statistical confidence bounds.
   - Automated sudden sentiment shift alarms (+31% negative surge alert).
3. **Aggregate Demographic Profiling**:
   - Privacy-preserving statistical profiling across Age Brackets, Geographic Regions of India, Languages, and Public Professional Interests.
   - Strictly zero sensitive individual profiling.
4. **Real-Time Trend & Semantic Narrative Detection**:
   - Velocity tracking (mentions/hour, engagement velocity).
   - State classification: `EMERGING`, `VIRAL`, `GROWING`, `STABLE`, `DECLINING`.
   - Multi-topic volume evolution forecasting.
5. **Link Analysis & Network Topology**:
   - Interactive SVG graph visualizer with Pan, Zoom, and Node Inspector.
   - Algorithmic centrality computation: PageRank, Betweenness Centrality, Degree Centrality, and Louvain Modularity Community Partitioning.

---

## ⚡ Core SIH Differentiator: Unified Event Intelligence

Unlike fragmented dashboards, selecting any topic/event opens the **Event Intelligence View** combining:
- **Discourse Velocity & Emergence Timestamp**
- **Sentiment Shift Polarity Inversion**
- **Top Influencer Amplification Node**
- **4-Step Interactive Propagation Path** (`Grassroots Community A → Key Influencer → Policy Community B → Media Hub C`)
- **Grounded AI Intelligence Summary with Evidence Data Points**

---

## 🚀 Quick Start (Zero-Setup Demo Mode)

### Prerequisites
- Node.js &gt;= 18
- Python &gt;= 3.10
- npm &gt;= 9

### 1. Clone & Install Dependencies
```bash
git clone <repo-url> ntro-social-intelligence
cd ntro-social-intelligence
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(Default configuration runs in zero-setup `MOCK_DATA_MODE=true` without requiring external API keys).*

### 3. Build All Packages
```bash
npm run build
```

### 4. Start the Application

Open separate terminal windows:

#### Terminal A: Start the Backend API (Port `4000`)
```bash
npm run dev:api
```

#### Terminal B: Start the Frontend Web App (Port `3000`)
```bash
npm run dev:web
```

#### Terminal C (Optional): Start the Python NLP AI Service (Port `5001`)
```bash
cd services/ai-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 5001 --reload
```

---

## 🔑 Access Points & Credentials

- **Web Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **AI NLP Microservice:** [http://localhost:5001/health](http://localhost:5001/health)

### Demo Login Accounts:
| Role | Email | Password |
|---|---|---|
| **Analyst** | `analyst@ntro.gov.in` | `Analyst@123` |
| **Administrator** | `admin@ntro.gov.in` | `Admin@123` |

---

## 🖥️ Navigation Pages (All 13 Operational Views)

| # | Page | Route | Description |
|---|---|---|---|
| 1 | **Overview** | `/dashboard` | Command-center KPIs, 4 analytical charts, active alerts, top influencers |
| 2 | **Live Monitoring** | `/live` | Continuous real-time multi-platform streaming event feed with filters |
| 3 | **Sentiment Intelligence** | `/sentiment` | 10-emotion taxonomy, stance distribution, sarcasm & shift detectors |
| 4 | **Audience Intelligence** | `/audience` | Privacy-preserving demographic profiling (Age, Geography, Languages) |
| 5 | **Trend Intelligence** | `/trends` | Emerging and viral topic velocity, evolution curves, and narrative states |
| 6 | **Network Analysis** | `/network` | Interactive network topology graph with PageRank & betweenness inspector |
| 7 | **Timeline Explorer** | `/timeline` | 6-stage chronological cascade explorer with multi-parameter filtering |
| 8 | **AI Analyst** | `/ai-analyst` | Conversational assistant grounded in collected data with evidence chips |
| 9 | **Alert Center** | `/alerts` | Severity-graded anomaly alerts feed with acknowledgement workflow |
| 10 | **Reports** | `/reports` | 12-section intelligence dossier generator with PDF/CSV/JSON export |
| 11 | **Data Sources** | `/datasources` | Modular streaming connectors (X, TG, Reddit, YT, IG, FB) |
| 12 | **System Health** | `/health` | Engine telemetry, microservice heartbeats, uptime, & latency diagnostics |
| 13 | **Settings** | `/settings` | AI sensitivity sliders, alert rules, JWT security, & profile credentials |

---

## ⌨️ Keyboard Shortcuts

- Press <kbd>Cmd + K</kbd> (or <kbd>Ctrl + K</kbd>) from any page to open the **NTRO Command Bar** for instant search across topics, accounts, and views.

---

## 🧪 Testing & Verification

Run the automated test suites across all workspaces:

```bash
# Run TypeScript compilation check across all packages
npm run typecheck

# Run Node.js / Jest unit tests
npm test

# Run Python AI Service NLP tests
npm run test:ai

# Run complete build
npm run build
```

---

## 🐳 Docker Deployment

To launch the full stack (PostgreSQL + TimescaleDB, Redis, Neo4j, Node API, Python AI Service, and Web App):

```bash
cd infrastructure/docker
docker compose up -d --build
```

---

## 📚 Documentation Directory

- [System Architecture](file:///Users/ankitsheoran/Documents/VS%20CODE/ntro-social-intelligence/docs/architecture.md)
- [Database & Storage Specification](file:///Users/ankitsheoran/Documents/VS%20CODE/ntro-social-intelligence/docs/database.md)
- [REST & Real-Time API Reference](file:///Users/ankitsheoran/Documents/VS%20CODE/ntro-social-intelligence/docs/api.md)
- [AI & NLP Models](file:///Users/ankitsheoran/Documents/VS%20CODE/ntro-social-intelligence/docs/ai.md)
- [Deployment Guide](file:///Users/ankitsheoran/Documents/VS%20CODE/ntro-social-intelligence/docs/deployment.md)
- [SIH Demonstration Walkthrough](file:///Users/ankitsheoran/Documents/VS%20CODE/ntro-social-intelligence/docs/demo.md)
- [SIH Presentation Notes](file:///Users/ankitsheoran/Documents/VS%20CODE/ntro-social-intelligence/docs/sih-presentation.md)

---

## ⚖️ Privacy & Security Standard

1. **Zero Unauthorized Scraping:** Collects only from authorized APIs or high-fidelity synthetic demo generators.
2. **Aggregated Demographics:** Strictly no sensitive individual attribute profiling.
3. **Encrypted Credentials:** API tokens and credentials are encrypted using AES-256 and never logged or exposed.

