# PulseX — AI Social Media Intelligence

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-blue.svg)](https://sih.gov.in/)
[![Problem ID](https://img.shields.io/badge/Problem%20ID-26152-cyan.svg)](https://sih.gov.in/)
[![Organization](https://img.shields.io/badge/Organization-NTRO-red.svg)](https://ntro.gov.in/)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Three.js%20%7C%20Tailwind-00f0ff.svg)](#tech-stack)
[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-success.svg)](#deployment)

> **PulseX** is an intelligence-grade, AI-powered social media command center designed for the **National Technical Research Organisation (NTRO)** under **Smart India Hackathon 2026** (Problem Statement ID: **26152** • Domain: *Social Media Analytics*).

---

## 🎯 Executive Overview

PulseX unifies real-time multi-platform social discourse signals across **X (Twitter)**, **Telegram**, **Instagram**, **Facebook**, **Reddit**, and **YouTube** into a cohesive cyber-intelligence command center. Rather than acting as a generic administrative dashboard, PulseX is engineered specifically for intelligence and security analysts to track, forecast, and deconstruct narrative weaponization, viral information cascades, and coordinated amplification.

### Key SIH Problem Statement Alignment

| SIH Requirement | Implementation in PulseX |
| :--- | :--- |
| **A. Continuous Data Collection & Timeline** | Live ingestion stream across 6 platforms, pipeline latency telemetry, and historical/CSV upload simulator. |
| **B. Multi-Dimensional Sentiment Inference** | 24H/7D/30D emotional timeline across 5 emotional vectors, composite sentiment gauge, and deep sarcasm/innuendo NLP decoder. |
| **C. Automated Demographic Profiling** | Aggregate estimates for Age, Multilingual discourse (Hindi, English, Hinglish), and National Spatial Cluster Radar (Delhi NCR, Mumbai, Bengaluru). Zero PII storage. |
| **D. Real-Time Trend & Topic Detection** | Ranked rising narratives, velocity momentum indexing, constellation radar, and AI peak time predictions. |
| **E. Link Analysis & Network Topology** | Interactive Canvas/WebGL network graph (1,284 nodes, 6,791 edges) with animated packet flow, PageRank/Centrality metrics, and Node Inspector. |
| **⭐ Central Differentiator: Cross-Analysis** | **"How a Narrative Spreads"**: Step-by-step interactive simulation tracing a trend from discovery to KOL amplification, cross-community bridging, sentiment inversion, and multi-platform cascade. |

---

## 🚀 Live Demo & Screenshots

- **Live GitHub Pages URL**: `https://<username>.github.io/<repo-name>/`
- **Demo Mode**: Ready out-of-the-box with high-fidelity simulated real-time data. No backend or API keys required for evaluation.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/) (Ultra-fast HMR and optimized chunking)
- **3D Visualization**: [Three.js](https://threejs.org/) (Interactive particle intelligence sphere, orbit rings, mouse parallax)
- **Styling & Theme**: [Tailwind CSS](https://tailwindcss.com/) (Cyber-intelligence dark theme, neon borders, glassmorphism)
- **Data Visualizations**: [Recharts](https://recharts.org/) (Multi-line sentiment timeline, emotion distribution donut)
- **Network Graph**: HTML5 Canvas engine with 60 FPS animated packet streaming, drag-and-drop, and zoom/pan physics
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📂 Project Architecture

```
/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Sticky glass HUD with live status & tab switcher
│   │   ├── Hero3D.tsx            # Three.js 3D Social Intelligence Sphere
│   │   ├── KPICard.tsx           # Animated metric counters with sparklines
│   │   ├── DataSources.tsx       # Module A: Connected platforms & ingestion pipeline
│   │   ├── SentimentChart.tsx    # Module B: Multi-line emotional timeline (24H/7D/30D)
│   │   ├── EmotionDonut.tsx      # Module B: Emotion breakdown & Sarcasm Decoder
│   │   ├── AudienceDNA.tsx       # Module C: Demographic profiling & India Spatial Radar
│   │   ├── TrendRadar.tsx        # Module D: Ranked rising narratives & peak prediction
│   │   ├── NetworkGraph.tsx      # Module E: Interactive Network topology & Node Inspector
│   │   ├── NarrativeFlow.tsx     # Central Feature: "How a narrative spreads" simulation
│   │   ├── AIInsights.tsx        # Heuristic neural intelligence alerts
│   │   ├── ReportModal.tsx       # Official NTRO Executive Briefing Generator & PDF export
│   │   └── Footer.tsx            # SIH & NTRO attribution
│   ├── data/
│   │   └── mockData.ts           # Realistic intelligence dataset
│   ├── hooks/
│   │   ├── useLiveData.ts        # Real-time event ticker, live counter ticks & burst generator
│   │   └── useWindowSize.ts      # Responsive layout breakpoint listener
│   ├── services/
│   │   └── api.ts                # API client with FastAPI switch & resilient mock fallback
│   ├── types/
│   │   └── index.ts              # Strict TypeScript interfaces
│   ├── App.tsx                   # Main command center layout
│   ├── index.css                 # Tailwind styles, scanlines, and glass utilities
│   └── main.tsx                  # React DOM mount point
├── .env.example                  # Environment variable blueprint
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Custom cyber theme palette & animations
├── tsconfig.json                 # TypeScript compiler options
└── vite.config.ts                # Vite config with relative base path ('./')
```

---

## ⚡ Getting Started Locally

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/itskumara1508-web/VS-CODE.git
   cd VS-CODE
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173` to explore the PulseX intelligence interface.

---

## 🔨 Production Build & Verification

To verify that the application compiles with zero TypeScript or bundling issues:

```bash
npm run build
```

This compiles optimized assets into the `dist/` directory with relative asset URLs (`./`), ensuring seamless loading from any hosting root or subdirectory.

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deploying to GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### How to enable automated deployment:

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Deploy PulseX AI Social Media Intelligence dashboard"
   git push origin main
   ```

2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.

3. The GitHub Actions runner will automatically build the project and deploy it to `https://<username>.github.io/<repository-name>/`.

---

## 🔌 Connecting a FastAPI / AI Backend (Future Integration)

PulseX is engineered with a clean decoupled API service layer in [`src/services/api.ts`](src/services/api.ts).

### Step 1: Configure Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set `VITE_API_URL` to your FastAPI server address:
```ini
VITE_API_URL=http://localhost:8000/api/v1
```

### Step 2: FastAPI Endpoint Signatures

Your FastAPI backend can implement the following REST endpoints:

- `GET /api/v1/metrics/kpi` → Returns current `KPIMetrics`
- `GET /api/v1/sources` → Returns array of connected `PlatformSource`
- `GET /api/v1/sources/events` → Returns recent `IngestionEvent` stream
- `GET /api/v1/sentiment/timeline?range=24H` → Returns `SentimentTimePoint[]`
- `GET /api/v1/audience/demographics` → Returns `DemographicData`
- `GET /api/v1/trends/rising` → Returns array of `TrendItem`
- `GET /api/v1/network/topology` → Returns `{ nodes, edges }`
- `POST /api/v1/analysis/sarcasm` → Accepts `{ text: string }` and returns `SarcasmAnalysis`

> **Note**: If `VITE_API_URL` is omitted or the backend is temporarily offline, PulseX automatically falls back to its local high-fidelity intelligence simulation without throwing breaking errors.

---

## 🛡️ Privacy & Compliance Guarantee

PulseX strictly conforms to government and defense ethical data standards:
- **Zero PII (Personally Identifiable Information)**: All demographic distributions are statistical approximations inferred across large population aggregates.
- **Compliance**: Adheres to the Indian Digital Personal Data Protection (DPDP) framework.
- **Non-Invasive Inference**: Public discourse telemetry only; no private chats or unauthorized access.

---

## 🏆 Smart India Hackathon 2026

- **Organization**: National Technical Research Organisation (NTRO)
- **Problem Statement**: Social Media Analytics (ID: 26152)
- **Category**: Software • Cyber Intelligence & Defense
- **Team Submission**: PulseX — AI Social Media Intelligence

