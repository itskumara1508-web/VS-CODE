# NTRO Social Intelligence - REST & Real-Time API Reference

Base URL: `http://localhost:4000/api`

## Authentication
| Method | Path | Description | Access |
|---|---|---|---|
| `POST` | `/auth/login` | Authenticate analyst and obtain JWT | Public |
| `GET` | `/auth/me` | Current authenticated analyst profile | Analyst |

## Dashboard & Telemetry
| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Full command-center KPI & chart bundle | Analyst |
| `GET` | `/dashboard/kpis` | Real-time numeric counters | Analyst |
| `GET` | `/dashboard/sentiment-timeline` | Hourly sentiment distribution | Analyst |
| `GET` | `/dashboard/emotion-distribution`| 10-emotion percentage share | Analyst |
| `GET` | `/dashboard/platform-distribution`| Ingest volume per source | Analyst |

## Posts & Stream
| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/posts` | Paginated normalized post feed with filters | Analyst |
| `GET` | `/posts/:id` | Post details and NLP inference metadata | Analyst |

## Intelligence Pillars
| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/sentiment/overview` | Polarity counts and sudden shift alarms | Analyst |
| `GET` | `/audience/overview` | Privacy-preserving aggregate demographics | Analyst |
| `GET` | `/trends` | Active trending narratives and velocities | Analyst |
| `GET` | `/network/graph` | Network topology nodes and edge links | Analyst |
| `GET` | `/network/influencers` | Centrality rankings (PageRank/Betweenness) | Analyst |
| `GET` | `/network/communities` | Clustered audience partitions | Analyst |
| `GET` | `/timeline/events` | Chronological information cascade steps | Analyst |
| `GET` | `/insights/event-intelligence` | SIH unified event deep dive | Analyst |
| `POST` | `/insights/ask` | Grounded conversational AI Analyst QA | Analyst |
| `GET` | `/alerts` | Threat and anomaly alerts feed | Analyst |
| `PATCH`| `/alerts/:id/ack` | Acknowledge active threat alert | Analyst |
| `POST` | `/reports/generate` | Generate and export PDF/CSV/JSON report | Analyst |

## Data Sources & System Health
| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/datasources` | Ingestion connectors and rate limits | Analyst |
| `PATCH`| `/datasources/:id/toggle`| Toggle connector connection | Analyst |
| `GET` | `/system/health` | Distributed engine telemetry & latency | Public |
| `POST` | `/demo/event` | Step SIH event simulation engine | Analyst |

