-- ============================================================
-- NTRO Social Media Intelligence & Network Analysis Platform
-- Production PostgreSQL + TimescaleDB Schema & Neo4j Model Spec
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable TimescaleDB extension if installed
-- CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- 1. Organizations & Authenticated Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'analyst', -- 'analyst' | 'administrator'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Social Media Data Source Registry
CREATE TABLE IF NOT EXISTS data_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'x', 'telegram', 'reddit', 'youtube', 'instagram', 'facebook'
    status VARCHAR(50) NOT NULL DEFAULT 'DEMO_MODE', -- 'CONNECTED', 'DISCONNECTED', 'DEMO_MODE', 'ERROR'
    rate_limit_remaining INT NOT NULL DEFAULT 500,
    rate_limit_max INT NOT NULL DEFAULT 500,
    events_ingested BIGINT NOT NULL DEFAULT 0,
    is_priority BOOLEAN NOT NULL DEFAULT FALSE,
    credentials_encrypted TEXT,
    last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Anonymized Social Author Nodes (Privacy-Preserving)
CREATE TABLE IF NOT EXISTS anonymized_accounts (
    id VARCHAR(100) PRIMARY KEY,
    handle VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    follower_count INT NOT NULL DEFAULT 0,
    following_count INT NOT NULL DEFAULT 0,
    post_count INT NOT NULL DEFAULT 0,
    influence_score DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    pagerank DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    betweenness_centrality DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    degree_centrality INT NOT NULL DEFAULT 0,
    community_id VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user', -- 'amplifier', 'bridge', 'authority', 'hub', 'user'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Semantic Topic Entities
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    aliases TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Normalized Social Media Posts & Messages
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(100) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    anonymized_user_id VARCHAR(100) NOT NULL REFERENCES anonymized_accounts(id) ON DELETE CASCADE,
    post_id VARCHAR(100) NOT NULL,
    parent_post_id VARCHAR(100),
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    hashtags TEXT[] DEFAULT '{}',
    mentions TEXT[] DEFAULT '{}',
    location VARCHAR(100),
    likes INT NOT NULL DEFAULT 0,
    comments INT NOT NULL DEFAULT 0,
    shares INT NOT NULL DEFAULT 0,
    reposts INT NOT NULL DEFAULT 0,
    collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    provenance VARCHAR(20) NOT NULL DEFAULT 'observed'
);

-- Indexing for high-throughput time-series & relational filtering
CREATE INDEX IF NOT EXISTS idx_posts_timestamp ON posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(anonymized_user_id);
CREATE INDEX IF NOT EXISTS idx_posts_language ON posts(language);

-- Convert posts to hypertable if TimescaleDB is active
-- SELECT create_hypertable('posts', 'timestamp', if_not_exists => TRUE);

-- 6. Multi-Dimensional Sentiment & Emotion Results
CREATE TABLE IF NOT EXISTS sentiment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id VARCHAR(100) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    sentiment VARCHAR(20) NOT NULL, -- 'positive', 'negative', 'neutral'
    sentiment_score DOUBLE PRECISION NOT NULL, -- -1.0 to 1.0
    stance VARCHAR(20) NOT NULL DEFAULT 'neutral', -- 'support', 'against', 'neutral'
    stance_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    sarcasm_probability DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    emotions JSONB NOT NULL DEFAULT '{}', -- joy, anger, fear, sadness, etc.
    analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    provenance VARCHAR(20) NOT NULL DEFAULT 'inferred'
);

CREATE INDEX IF NOT EXISTS idx_sentiment_post ON sentiment_results(post_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_polarity ON sentiment_results(sentiment);

-- 7. Real-Time Trends & Velocity
CREATE TABLE IF NOT EXISTS trends (
    id VARCHAR(100) PRIMARY KEY,
    topic_id VARCHAR(100) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    topic_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'emerging', -- 'emerging', 'growing', 'viral', 'stable', 'declining'
    mention_count INT NOT NULL DEFAULT 0,
    mention_velocity INT NOT NULL DEFAULT 0, -- mentions per hour
    engagement_velocity INT NOT NULL DEFAULT 0,
    unique_users INT NOT NULL DEFAULT 0,
    growth_rate DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    sentiment_change DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    influencer_participation DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Privacy-Preserving Aggregate Demographics
CREATE TABLE IF NOT EXISTS demographic_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dimension VARCHAR(50) NOT NULL, -- 'age', 'language', 'location', 'profession'
    label VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    percentage DOUBLE PRECISION NOT NULL,
    sample_size INT NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Graph Network Communities
CREATE TABLE IF NOT EXISTS communities (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size INT NOT NULL DEFAULT 0,
    dominant_language VARCHAR(20) NOT NULL DEFAULT 'en',
    sentiment VARCHAR(20) NOT NULL DEFAULT 'neutral',
    avg_influence DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Graph Topology Edges
CREATE TABLE IF NOT EXISTS network_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id VARCHAR(100) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    edge_type VARCHAR(50) NOT NULL, -- 'reply', 'mention', 'repost', 'share', 'interaction'
    weight DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_edge_source ON network_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_edge_target ON network_edges(target_id);

-- 11. Threat & Anomaly Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(100) PRIMARY KEY,
    level VARCHAR(20) NOT NULL, -- 'INFO', 'WARNING', 'HIGH', 'CRITICAL'
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    acked_by VARCHAR(100),
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_level ON alerts(level);
CREATE INDEX IF NOT EXISTS idx_alerts_acked ON alerts(acknowledged);

-- 12. Grounded AI Insights
CREATE TABLE IF NOT EXISTS ai_insights (
    id VARCHAR(100) PRIMARY KEY,
    kind VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    evidence JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. System Audit & Ingestion Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

