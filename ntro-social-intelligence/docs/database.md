# Database Architecture & Storage Specification

## 1. Relational & Time-Series: PostgreSQL + TimescaleDB

The primary persistence engine uses PostgreSQL 16 extended with TimescaleDB for hypertable compression and fast time-series rollups.

### Key Relational Tables:
- `users`: Authenticated analysts and administrators.
- `data_sources`: Stream connectors and provider state.
- `anonymized_accounts`: Social node profiles with PageRank and centrality metrics.
- `topics`: Semantic entity dictionary and alias mappings.
- `posts`: Normalized social posts partitioned across time.
- `sentiment_results`: Polarity, emotion distribution (JSONB), and stance scores.
- `trends`: Hourly mention velocities, growth rates, and viral classifications.
- `demographic_aggregates`: Privacy-preserving population distributions.
- `communities`: Detected modular network clusters.
- `network_edges`: Link relationships between accounts and topics.
- `alerts`: Active and historical anomalies.
- `ai_insights`: Synthesized intelligence observations.

### Optimized Indexes:
- `idx_posts_timestamp`: `posts(timestamp DESC)` for streaming timelines.
- `idx_posts_platform`: `posts(platform)` for source filtering.
- `idx_sentiment_polarity`: `sentiment_results(sentiment)` for fast shift metrics.
- `idx_edge_source` & `idx_edge_target`: For sub-graph queries.

## 2. Graph Storage: Neo4j

Used for topology traversal, community detection algorithms, and multi-hop propagation chains.

### Node Labels:
- `(:User {id, handle, influenceScore, pagerank, role})`
- `(:Topic {id, name, category})`
- `(:Community {id, name, dominantLanguage})`

### Relationship Types:
- `[:MENTIONS {timestamp, weight}]`
- `[:REPOSTS {timestamp, weight}]`
- `[:REPLIES_TO {timestamp}]`
- `[:DISCUSSES {sentiment}]`
- `[:BELONGS_TO]`

## 3. In-Memory Cache: Redis

- Session token blacklisting and rate limiting.
- Real-time Pub/Sub for live event stream broadcasting to WebSockets.
- Cached dashboard summaries (TTL: 15 seconds).

