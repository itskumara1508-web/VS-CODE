// ============================================================
// SOCIOINTELL Graph Database Schema & Seed Data (Neo4j Cypher)
// NTRO Social Media Intelligence & Network Analysis Platform
// ============================================================

// 1. Constraints & Unique Indexes
CREATE CONSTRAINT unique_account_id IF NOT EXISTS FOR (a:Account) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT unique_post_id IF NOT EXISTS FOR (p:Post) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT unique_topic_id IF NOT EXISTS FOR (t:Topic) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT unique_community_id IF NOT EXISTS FOR (c:Community) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT unique_platform_id IF NOT EXISTS FOR (pl:Platform) REQUIRE pl.id IS UNIQUE;

// 2. Seed Platforms
MERGE (x:Platform {id: "x", name: "X (Twitter)", category: "social"})
MERGE (tg:Platform {id: "telegram", name: "Telegram", category: "messaging"})
MERGE (rd:Platform {id: "reddit", name: "Reddit", category: "forum"})
MERGE (yt:Platform {id: "youtube", name: "YouTube", category: "video"})
MERGE (ig:Platform {id: "instagram", name: "Instagram", category: "social"})
MERGE (fb:Platform {id: "facebook", name: "Facebook", category: "social"})
MERGE (li:Platform {id: "linkedin", name: "LinkedIn", category: "professional"})
MERGE (nw:Platform {id: "news", name: "News & Web", category: "news_web"});

// 3. Seed Communities
MERGE (c1:Community {id: "comm_0", name: "EV & Green Tech Advocates", size: 420, modularityScore: 0.82})
MERGE (c2:Community {id: "comm_1", name: "National Policy & Regulatory Watch", size: 310, modularityScore: 0.79})
MERGE (c3:Community {id: "comm_2", name: "Tech Enthusiasts & Founders", size: 550, modularityScore: 0.76})
MERGE (c4:Community {id: "comm_3", name: "Public Sector & Infrastructure", size: 280, modularityScore: 0.84});

// 4. Seed Topics
MERGE (t1:Topic {id: "topic_0", name: "EV Charging Infrastructure", category: "Energy"})
MERGE (t2:Topic {id: "topic_1", name: "5G Telecom Grid", category: "Technology"})
MERGE (t3:Topic {id: "topic_2", name: "AI Ethics & Regulation", category: "Policy"})
MERGE (t4:Topic {id: "topic_3", name: "UPI Digital Payments 3.0", category: "Finance"});

// 5. Seed Influencers & Accounts
MERGE (a1:Account {id: "usr_01", handle: "tech_analyst_in", influenceScore: 0.94, role: "authority"})
MERGE (a2:Account {id: "usr_02", handle: "ev_watch_india", influenceScore: 0.88, role: "bridge"})
MERGE (a3:Account {id: "usr_03", handle: "policy_insider_delhi", influenceScore: 0.82, role: "hub"})
MERGE (a4:Account {id: "usr_04", handle: "grid_telemetry_bot", influenceScore: 0.65, role: "amplifier", botScore: 0.78});

// 6. Connect Relationships
MERGE (a1)-[:BELONGS_TO]->(c1)
MERGE (a2)-[:BELONGS_TO]->(c1)
MERGE (a3)-[:BELONGS_TO]->(c2)
MERGE (a4)-[:BELONGS_TO]->(c3)

MERGE (a1)-[:DISCUSSES {mentions: 142, sentiment: 0.45}]->(t1)
MERGE (a2)-[:DISCUSSES {mentions: 98, sentiment: -0.32}]->(t1)
MERGE (a3)-[:DISCUSSES {mentions: 64, sentiment: 0.12}]->(t3)

MERGE (a1)-[:FOLLOWS {weight: 0.9}]->(a2)
MERGE (a2)-[:MENTIONS {count: 24}]->(a3)
MERGE (a4)-[:SHARES {count: 85}]->(a1)

MERGE (t1)-[:APPEARS_ON]->(x)
MERGE (t1)-[:APPEARS_ON]->(tg)
MERGE (t1)-[:PROPAGATES_TO {velocity: 480, latencyMinutes: 12}]->(rd);
