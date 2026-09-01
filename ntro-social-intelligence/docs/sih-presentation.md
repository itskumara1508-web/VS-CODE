# SIH Presentation Notes & Key Differentiators

## Project Summary
- **Organization:** National Technical Research Organisation (NTRO)
- **Theme:** Miscellaneous
- **Project:** AI-Powered Social Media Intelligence & Network Analysis Platform

---

## The 5 Core Requirements & How We Solved Them

| SIH Requirement | NTRO Platform Implementation |
|---|---|
| **1. Continuous Data Collection & Timeline Management** | Modular `@ntro/ingestion` worker with normalized multi-platform schema (X, Telegram, Reddit, YouTube). Chronological timeline progression (`POST → INTERACTION → SENTIMENT → TOPIC → INFLUENCE → PROPAGATION`). |
| **2. Multi-Dimensional Sentiment Inference** | Real-time polarity (-1 to +1), 10-Emotion Taxonomy (Joy, Anger, Fear, Sadness, etc.), Stance inference (Support/Against), Sarcasm probability, and Sudden Shift detection alarms (+31% delta detection). |
| **3. Aggregate Demographic Profiling** | Macro-level statistical profiling across Age, Geography (Pan-India regions), Languages, and Professional clusters with strict privacy safeguards and zero individual tracking. |
| **4. Real-Time Trend & Topic Detection** | Velocity tracking, BERTopic semantic clustering, and dynamic state modeling (`EMERGING`, `VIRAL`, `GROWING`, `STABLE`, `DECLINING`). |
| **5. Link Analysis & Network Topology** | Interactive SVG/Canvas network graph with PageRank, Betweenness Centrality, Degree Centrality, and Louvain Modularity Community Partitioning to reveal information flow and bridge nodes. |

---

## Core Differentiators (Why This System Wins)

1. **Unified Event Intelligence (Not 5 Disjoint Dashboards)**:
   - When any topic is selected, the platform synthesizes Timeline + Sentiment Shift + Audience + Trend Velocity + Network Amplifiers + AI Explanation in a single unified view.

2. **Grounded AI Analyst QA Engine**:
   - ChatGPT-style analyst interface that backs every answer with database-grounded evidence cards and statistical confidence metrics.

3. **Zero-Setup SIH Demo Mode**:
   - Runs out-of-the-box with realistic synthetic Indian socio-technical scenarios without needing external paid API keys.
   - Smoothly transitions to authorized live APIs when credentials are provided in `.env`.

4. **Production Enterprise UI**:
   - Dark analytical command-center aesthetic, keyboard shortcuts (`Cmd + K`), real-time streaming feeds, and one-click PDF/CSV/JSON report exports.

