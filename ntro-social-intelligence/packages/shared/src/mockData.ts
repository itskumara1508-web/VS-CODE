import type {
  Post,
  AnonymizedUser,
  Topic,
  SentimentResult,
  Emotion,
  Stance,
  Sentiment,
  Trend,
  TrendStatus,
  Influencer,
  Community,
  NetworkEdge,
  NetworkNode,
  Alert,
  AIInsight,
  TimelineEvent,
  DemographicSegment,
  Platform,
  Confidence,
  DataSource,
  SystemServiceHealth,
  EventIntelligenceData,
  PropagationStep,
} from '@ntro/types';
import {
  TOPICS,
  COMMUNITIES,
  REGIONS,
  PROFESSIONS,
  SEED_INFLUENCERS,
  DEMO_EVENT_SCRIPT,
} from './constants.js';

/**
 * Deterministic PRNG so the demo is reproducible.
 * Uses a simple mulberry32 implementation.
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => rand() * (max - min) + min;
const chance = (p: number) => rand() < p;

/** Confidence helper - inferred values carry a confidence interval. */
function confidence(base: number): Confidence {
  const score = Math.min(0.99, Math.max(0.5, base));
  const margin = 0.08;
  return {
    score,
    low: Math.max(0, score - margin),
    high: Math.min(1, score + margin),
  };
}

/** Build a deterministic hash-based id from a seed string. */
function hashId(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return `m_${(h >>> 0).toString(36)}`;
}

// ------------------------------------------------------------
// Post content templates, keyed to topics & sentiment
// ------------------------------------------------------------
interface Template {
  topicIdx: number;
  sentiment: Sentiment;
  texts: string[];
}

function buildTemplates(): Template[] {
  const t: Template[] = [];
  // For each topic, generate positive / negative / neutral sample texts.
  TOPICS.forEach((topic, idx) => {
    t.push({
      topicIdx: idx,
      sentiment: 'positive',
      texts: [
        `Great to see ${topic.aliases[0]} getting real momentum. This is exactly the kind of infrastructure investment we need.`,
        `Finally, ${topic.aliases[0]} is expanding. This will make a tangible difference for daily life.`,
        `The new ${topic.aliases[0]} push is a positive step. More access and better coverage for everyone.`,
        `Impressed by the pace of ${topic.aliases[0]} rollout. Huge win for the sector.`,
      ],
    });
    t.push({
      topicIdx: idx,
      sentiment: 'negative',
      texts: [
        `The ${topic.aliases[0]} situation is a mess. No clear plan and the rollout keeps slipping.`,
        `Another day, another problem with ${topic.aliases[0]}. This is not working as promised.`,
        `${topic.aliases[0]} is failing to deliver. Costs are up and quality is down.`,
        `I'm fed up with the lack of progress on ${topic.aliases[0]}. Nothing is getting fixed.`,
      ],
    });
    t.push({
      topicIdx: idx,
      sentiment: 'neutral',
      texts: [
        `Just spotted a new update about ${topic.aliases[0]}. Let's see how it develops.`,
        `Reading the latest coverage on ${topic.aliases[0]}. Seems like a mixed picture.`,
        `A report on ${topic.aliases[0]} was published today. Worth a look.`,
        `Curious what the data says about ${topic.aliases[0]} this month.`,
      ],
    });
  });
  return t;
}

const TEMPLATES = buildTemplates();
const HASHTAG_PREFIX: Record<Platform, string> = {
  x: '',
  telegram: '',
  instagram: '',
  facebook: '',
  reddit: '',
  youtube: '',
  linkedin: '',
  tiktok: '',
  news: '',
  other: '',
  mock: '',
};

function topicHashtag(topicIdx: number): string {
  const base = TOPICS[topicIdx].aliases[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^/, '');
  return `${HASHTAG_PREFIX.x}${base}`;
}

// ------------------------------------------------------------
// Users
// ------------------------------------------------------------
function buildUsers(count: number): AnonymizedUser[] {
  const users: AnonymizedUser[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    const handle = `user_${randInt(1000, 99999)}_${randInt(1000, 9999)}`;
    if (seen.has(handle)) continue;
    seen.add(handle);
    const community = pick(COMMUNITIES);
    const isInfluencer = chance(0.06);
    users.push({
      id: hashId(handle),
      handle,
      platform: chance(0.6) ? 'x' : 'telegram',
      displayName: `User ${randInt(1, 999)}${pick(['Alpha', 'Beta', 'Gamma', 'Delta', 'Orion', 'Nova'])}`,
      followerCount: isInfluencer ? randInt(5000, 450000) : randInt(5, 5000),
      followingCount: randInt(5, 2000),
      postCount: randInt(1, 400),
      bio: pick(PROFESSIONS),
      location: pick(REGIONS),
      language: pick(['en', 'hi', 'en', 'en', 'hi']),
      createdAt: new Date(Date.now() - randInt(30, 900) * 86400000).toISOString(),
      communities: [community],
      influenceScore: isInfluencer ? randFloat(0.6, 0.95) : randFloat(0.01, 0.4),
      isVerified: chance(0.05),
    });
  }
  return users;
}

// ------------------------------------------------------------
// Posts, mapped onto a realistic narrative
// ------------------------------------------------------------
interface PostBundle {
  posts: Post[];
  users: AnonymizedUser[];
  topics: Topic[];
}

/**
 * Generates a realistic event narrative:
 * - Topic 0 (EV Charging Infrastructure) experiences a surge over the demo window.
 * - Other topics produce background "ambient" volume.
 */
function buildPosts(users: AnonymizedUser[], topicDefs: Topic[], baseTime: number): PostBundle {
  const posts: Post[] = [];
  const anchorTopicIdx = 0; // EV Charging Infrastructure is the demo anchor.

  const addPost = (
    text: string,
    user: AnonymizedUser,
    timestamp: Date,
    topicIdx: number[],
    sentiment: Sentiment,
    engagementScale: number,
    parentId: string | null,
    depth: number,
    platform: Platform = user.platform,
  ) => {
    const id = hashId(`${user.id}_${text}_${timestamp.getTime()}_${randInt(0, 100000)}`);
    const topicIds = topicIdx.map((ti) => topicDefs[ti].id);
    const mentions = chance(0.35) ? [pick(SEED_INFLUENCERS).handle] : [];
    const hashtags = topicIdx.map((ti) => topicHashtag(ti));
    const likes = Math.max(0, Math.round(randFloat(0, 500) * engagementScale));
    const comments = Math.max(0, Math.round(randFloat(0, 120) * engagementScale));
    const shares = Math.max(0, Math.round(randFloat(0, 80) * engagementScale));
    posts.push({
      id,
      platform,
      anonymizedUserId: user.id,
      postId: `post_${id}`,
      parentPostId: parentId ? `post_${parentId}` : null,
      text,
      timestamp: timestamp.toISOString(),
      language: user.language,
      hashtags,
      mentions,
      engagement: { likes, comments, shares, reposts: shares, views: likes * 4 },
      relationships: {
        repliesTo: parentId ? `post_${parentId}` : null,
        repostsOf: null,
        sharesOf: null,
        mentions,
        replyCount: comments,
        repostCount: shares,
        shareCount: shares,
      },
      location: chance(0.15) ? user.location : null,
      collectedAt: new Date(timestamp.getTime() + randInt(1, 30) * 1000).toISOString(),
      topicIds,
      provenance: 'observed',
    });
  };

  // Ambient posts — spread across all topics, moderate volume.
  const ambientPerTopic = 60;
  for (let ti = 0; ti < TOPICS.length; ti++) {
    for (let i = 0; i < ambientPerTopic; i++) {
      const user = pick(users);
      const template = pick(TEMPLATES.filter((t) => t.topicIdx === ti));
      const ts = new Date(baseTime - randInt(0, 24) * 3600000 - randInt(0, 3600) * 1000);
      addPost(
        pick(template.texts),
        user,
        ts,
        [ti],
        template.sentiment,
        randFloat(0.3, 1.2),
        null,
        0,
      );
    }
  }

  // The anchor narrative — EV Charging Infrastructure. Over 4 hours, from 14:00 to 18:00.
  const narrativeWindowMs = 4 * 3600000;
  const narrativeStart = baseTime - narrativeWindowMs;
  const anchorMentions = 900;

  for (let i = 0; i < anchorMentions; i++) {
    // Time skewed toward the middle/end of the window to simulate the surge.
    const frac = Math.pow(rand(), 1.8); // 0..1, weighted toward 1 = later time
    const ts = new Date(narrativeStart + frac * narrativeWindowMs);
    // Sentiment shifts: early = mostly positive/neutral, later = rising negative.
    let sentiment: Sentiment = 'neutral';
    if (frac < 0.5) sentiment = chance(0.6) ? 'positive' : 'neutral';
    else sentiment = chance(0.62) ? 'negative' : 'neutral';

    const user = pick(users);
    // Amplify engagement for influencer posts.
    const engagementScale = user.influenceScore > 0.6 ? randFloat(2.5, 8) : randFloat(0.3, 1.5);
    const template = TEMPLATES.find((t) => t.topicIdx === anchorTopicIdx && t.sentiment === sentiment)!;
    addPost(
      pick(template.texts),
      user,
      ts,
      [anchorTopicIdx],
      sentiment,
      engagementScale,
      null,
      0,
    );

    // Add replies/reposts with some probability to build a tree.
    if (chance(0.25)) {
      const parent = posts[posts.length - 1];
      const replyText = pick(TEMPLATES.find((t) => t.topicIdx === anchorTopicIdx)!.texts);
      addPost(
        replyText,
        pick(users),
        new Date(ts.getTime() + randInt(60, 1800) * 1000),
        [anchorTopicIdx],
        sentiment,
        randFloat(0.03, 0.5),
        parent.id,
        1,
      );
    }
  }

  return { posts, users, topics: topicDefs };
}

// ------------------------------------------------------------
// Topics / Sentiment / Trends / Network / Alerts / Insights
// ------------------------------------------------------------
function buildTopics(): Topic[] {
  return TOPICS.map((t, i) => ({
    id: `topic_${i}`,
    name: t.name,
    aliases: t.aliases,
    category: t.category,
    description: t.description,
    createdAt: new Date(2026, 0, 1).toISOString(),
    provenance: 'observed',
  }));
}

function buildCommunities(topics: Topic[]): Community[] {
  const communitySentiments: Sentiment[] = ['positive', 'neutral', 'negative', 'positive', 'negative', 'positive', 'neutral', 'neutral'];
  return COMMUNITIES.map((c, i) => ({
    id: `community_${i}`,
    name: c,
    size: randInt(500, 25000),
    topicIds: topics.slice(0, 3).map((t) => t.id),
    sentiment: communitySentiments[i],
    sentimentScore: randFloat(-0.6, 0.7),
    dominantLanguage: pick(['en', 'hi']),
    avgInfluence: randFloat(0.2, 0.8),
    createdAt: new Date(2026, 0, 1).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

/** Map sentiment to a primary emotion distribution. */
function emotionForSentiment(s: Sentiment, lexiconScore: number): Record<Emotion, number> {
  const base: Record<Emotion, number> = {
    joy: 0,
    anger: 0,
    fear: 0,
    sadness: 0,
    surprise: 0,
    excitement: 0,
    anxiety: 0,
    supportive: 0,
    hostile: 0,
    neutral: 0,
  };
  if (s === 'positive') {
    base.joy = 0.4;
    base.excitement = 0.3;
    base.supportive = 0.2;
    base.neutral = 0.1;
  } else if (s === 'negative') {
    // Deeper negative -> more anger/fear.
    const ang = Math.min(0.5, 0.15 + Math.abs(lexiconScore) * 0.4);
    base.anger = ang;
    base.fear = 0.15;
    base.sadness = 0.2;
    base.hostile = 0.15;
    base.neutral = 0.1;
  } else {
    base.neutral = 0.8;
    base.surprise = 0.1;
    base.joy = 0.05;
    base.sadness = 0.05;
  }
  // Smooth tiny noise
  Object.keys(base).forEach((k) => {
    base[k as Emotion] += randFloat(-0.02, 0.02);
  });
  const sum = Object.values(base).reduce((a, b) => a + b, 0);
  Object.keys(base).forEach((k) => {
    base[k as Emotion] = Math.max(0, base[k as Emotion] / sum);
  });
  return base;
}

function buildSentiment(posts: Post[]): SentimentResult[] {
  return posts.map((post, i) => {
    // Derive a deterministic lexicon score from the text and the post's seed.
    const positiveWords = ['great', 'finally', 'positive', 'impressed', 'win', 'good', 'better', 'access', 'help', 'support'];
    const negativeWords = ['mess', 'problem', 'failing', 'fed up', 'lack', 'slips', 'down', 'not working', 'expensive'];
    const lower = post.text.toLowerCase();
    let score = 0;
    positiveWords.forEach((w) => {
      if (lower.includes(w)) score += 0.2;
    });
    negativeWords.forEach((w) => {
      if (lower.includes(w)) score -= 0.2;
    });
    const sentiment: Sentiment = score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral';
    const normalizedScore = Math.max(-1, Math.min(1, score + randFloat(-0.05, 0.05)));
    const stance: Stance = sentiment === 'positive' ? 'support' : sentiment === 'negative' ? 'against' : 'neutral';
    const sarcasmProbability = chance(0.12) ? randFloat(0.5, 0.9) : randFloat(0.01, 0.2);
    return {
      postId: post.id,
      sentiment,
      sentimentScore: normalizedScore,
      emotions: emotionForSentiment(sentiment, normalizedScore),
      stance,
      stanceScore: normalizedScore,
      sarcasmProbability,
      confidence: confidence(0.85),
      topicSentiment: {},
      analyzedAt: new Date(Date.now() + i * 1000).toISOString(),
      provenance: 'inferred',
    };
  });
}

function buildTrends(postBundle: PostBundle): Trend[] {
  const { posts, users } = postBundle;
  const result: Trend[] = [];
  // Compute per-topic stats over the last 6 hours.
  TOPICS.forEach((topic, ti) => {
    const topicPosts = posts.filter((p) => p.topicIds.includes(`topic_${ti}`));
    const window = 6 * 3600 * 1000;
    const now = Date.now();
    const recent = topicPosts.filter((p) => now - new Date(p.timestamp).getTime() < window);
    const hourly = Math.round(recent.length / (window / 3600000));
    const uniqueUsers = new Set(recent.map((p) => p.anonymizedUserId)).size;
    // Sentiment shift: compare current 1h window to previous 1h.
    const currentH = recent.filter((p) => now - new Date(p.timestamp).getTime() < 3600000);
    const currentNeg = currentH.filter((p) => p.text.toLowerCase().includes('mess') || p.text.toLowerCase().includes('failing') || p.text.toLowerCase().includes('not working')).length;
    const currentNegPct = currentH.length ? (currentNeg / currentH.length) * 100 : 0;
    const baselineNeg = 24;
    const sentimentChange = Math.round(currentNegPct - baselineNeg);
    const influencerCount = recent.filter((p) => {
      const u = users.find((us) => us.id === p.anonymizedUserId);
      return u && u.influenceScore > 0.6;
    }).length;
    let status: TrendStatus = 'stable';
    if (ti === 0) {
      // The anchor topic surges.
      status = hourly > 260 ? 'viral' : hourly > 120 ? 'growing' : 'emerging';
    } else {
      status = hourly > 180 ? 'growing' : hourly > 60 ? 'stable' : 'declining';
    }
    result.push({
      id: `trend_${ti}`,
      topicId: `topic_${ti}`,
      topicName: topic.name,
      status,
      mentionCount: recent.length,
      mentionVelocity: hourly,
      engagementVelocity: Math.round(recent.reduce((a, p) => a + p.engagement.likes + p.engagement.comments + p.engagement.shares, 0) / (window / 3600000)),
      uniqueUsers,
      sentimentChange,
      influencerParticipation: Math.min(1, influencerCount / Math.max(1, recent.length / 20)),
      firstSeenAt: new Date(Math.min(...recent.map((p) => new Date(p.timestamp).getTime()))).toISOString(),
      lastSeenAt: new Date(Math.max(...recent.map((p) => new Date(p.timestamp).getTime()))).toISOString(),
      growthRate: hourly > 0 ? Math.min(400, Math.round((hourly / 5) * 100) / 100) : 0,
      declineRate: 0,
      predicted: false,
      confidence: confidence(0.78),
      relatedTopics: ti === 0 ? ['topic_8'] : [],
    });
  });
  // Add a predicted trend (the model extrapolates).
  result.push({
    id: 'trend_pred_1',
    topicId: 'topic_0',
    topicName: TOPICS[0].name,
    status: 'growing',
    mentionCount: 0,
    mentionVelocity: 0,
    engagementVelocity: 0,
    uniqueUsers: 0,
    sentimentChange: 0,
    influencerParticipation: 0.4,
    firstSeenAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    growthRate: 0,
    declineRate: 0,
    predicted: true,
    confidence: confidence(0.6),
    relatedTopics: ['topic_8'],
  });
  return result;
}

function buildInfluencers(posts: Post[], users: AnonymizedUser[]): Influencer[] {
  return SEED_INFLUENCERS.map((seed, i) => {
    const user = users.find((u) => u.handle === seed.handle) ?? users[i % users.length];
    const userPosts = posts.filter((p) => p.anonymizedUserId === user.id);
    return {
      userId: user.id,
      handle: seed.handle,
      platform: seed.community.includes('Cyber') ? 'x' : chance(0.7) ? 'x' : 'telegram',
      influenceScore: seed.influenceScore,
      degreeCentrality: randFloat(0.4, 0.95),
      betweennessCentrality: randFloat(0.1, 0.8),
      pagerank: randFloat(0.3, 0.99),
      communityIds: [`community_${COMMUNITIES.indexOf(seed.community as typeof COMMUNITIES[number])}`],
      topicIds: userPosts.length ? [...new Set(userPosts.flatMap((p) => p.topicIds))].slice(0, 3) : ['topic_0'],
      engagementRate: randFloat(0.02, 0.2),
      role: i === 0 ? 'amplifier' : i === 1 ? 'bridge' : chance(0.5) ? 'authority' : 'hub',
    };
  });
}

function buildNetwork(posts: Post[], users: AnonymizedUser[], communities: Community[], topicDefs: Topic[]): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];
  // Nodes: users (sampled), communities, topics.
  const sampledUsers = users.slice(0, 200);
  sampledUsers.forEach((u) => {
    nodes.push({
      id: u.id,
      kind: 'user',
      label: u.handle,
      metadata: { community: u.communities[0], influence: u.influenceScore, platform: u.platform },
    });
  });
  communities.forEach((c, i) => {
    nodes.push({ id: c.id, kind: 'community', label: c.name, metadata: { size: c.size } });
  });
  topicDefs.slice(0, 5).forEach((t) => {
    nodes.push({ id: t.id, kind: 'topic', label: t.name, metadata: { category: t.category } });
  });

  // Edges: user->community, user->topic, user->user (reply/mention), community->community propagation.
  sampledUsers.forEach((u) => {
    edges.push({ source: u.id, target: u.communities[0] ? `community_${COMMUNITIES.indexOf(u.communities[0] as typeof COMMUNITIES[number])}` : 'community_7', type: 'interaction', weight: randFloat(0.2, 1), timestamp: new Date().toISOString() });
    if (chance(0.5)) {
      edges.push({ source: u.id, target: 'topic_0', type: 'topic_association', weight: randFloat(0.3, 1), timestamp: new Date().toISOString() });
    }
  });
  // Build a propagation chain for the anchor topic across communities.
  const propChain = [0, 2, 5, 1, 7]; // community indices
  for (let i = 0; i < propChain.length - 1; i++) {
    edges.push({
      source: `community_${propChain[i]}`,
      target: `community_${propChain[i + 1]}`,
      type: 'community_link',
      weight: 0.9 - i * 0.12,
      timestamp: new Date(Date.now() - (propChain.length - 1 - i) * 12 * 60000).toISOString(),
    });
  }
  return { nodes, edges };
}

function buildDemographics(): DemographicSegment[] {
  const segments: DemographicSegment[] = [];
  // Age brackets
  const ages = [
    { label: '18-24', value: '42' },
    { label: '25-34', value: '35' },
    { label: '35-44', value: '15' },
    { label: '45+', value: '8' },
  ];
  ages.forEach((a) => {
    segments.push({
      id: hashId(`age_${a.label}`),
      dimension: 'age',
      label: 'Age bracket',
      value: a.label,
      percentage: Number(a.value),
      sampleSize: randInt(2000, 12000),
      confidence: confidence(0.7),
      provenance: 'inferred',
      updatedAt: new Date().toISOString(),
    });
  });
  const langs = [
    { label: 'Hindi', value: '48' },
    { label: 'English', value: '40' },
    { label: 'Other', value: '12' },
  ];
  langs.forEach((l) => {
    segments.push({
      id: hashId(`lang_${l.label}`),
      dimension: 'language',
      label: 'Language',
      value: l.label,
      percentage: Number(l.value),
      sampleSize: randInt(3000, 15000),
      confidence: confidence(0.8),
      provenance: 'inferred',
      updatedAt: new Date().toISOString(),
    });
  });
  const locs = REGIONS.map((r) => ({
    label: r,
    value: String(randInt(2, 18)),
  }));
  const locTotal = locs.reduce((a, b) => a + Number(b.value), 0);
  locs.forEach((l) => {
    segments.push({
      id: hashId(`loc_${l.label}`),
      dimension: 'location',
      label: 'Geography',
      value: l.label,
      percentage: Math.round((Number(l.value) / locTotal) * 100),
      sampleSize: randInt(500, 9000),
      confidence: confidence(0.6),
      provenance: 'inferred',
      updatedAt: new Date().toISOString(),
    });
  });
  const interests = PROFESSIONS.slice(0, 6).map((p) => ({
    label: p,
    value: String(randInt(5, 22)),
  }));
  const intTotal = interests.reduce((a, b) => a + Number(b.value), 0);
  interests.forEach((p) => {
    segments.push({
      id: hashId(`prof_${p.label}`),
      dimension: 'profession',
      label: 'Profession',
      value: p.label,
      percentage: Math.round((Number(p.value) / intTotal) * 100),
      sampleSize: randInt(200, 4000),
      confidence: confidence(0.55),
      provenance: 'inferred',
      updatedAt: new Date().toISOString(),
    });
  });
  return segments;
}

function buildAlerts(postBundle: PostBundle): Alert[] {
  const alerts: Alert[] = [];
  alerts.push({
    id: 'alert_1',
    level: 'CRITICAL',
    type: 'sentiment_shift',
    title: 'Negative sentiment spike',
    message: 'Negative sentiment increased 42% in 90 minutes for "EV charging infrastructure".',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    acknowledged: false,
    ackedBy: null,
    metadata: { topic: 'EV Charging Infrastructure', change: 42, window: '90 minutes' },
  });
  alerts.push({
    id: 'alert_2',
    level: 'HIGH',
    type: 'viral_topic',
    title: 'Viral topic detected',
    message: '"5G Rollout" has become viral across X and Telegram.',
    createdAt: new Date(Date.now() - 55 * 60000).toISOString(),
    acknowledged: false,
    ackedBy: null,
    metadata: { topic: '5G Rollout', status: 'viral' },
  });
  alerts.push({
    id: 'alert_3',
    level: 'WARNING',
    type: 'influencer_activity',
    title: 'High-influence account active',
    message: 'Influencer tech_watch_44 is driving conversation on "EV charging infrastructure".',
    createdAt: new Date(Date.now() - 80 * 60000).toISOString(),
    acknowledged: false,
    ackedBy: null,
    metadata: { influencer: 'tech_watch_44', topic: 'EV Charging Infrastructure' },
  });
  alerts.push({
    id: 'alert_4',
    level: 'INFO',
    type: 'community_crossing',
    title: 'Community propagation',
    message: 'Topic crossed from "Tech Enthusiasts" into "Startup Ecosystem".',
    createdAt: new Date(Date.now() - 110 * 60000).toISOString(),
    acknowledged: true,
    ackedBy: 'analyst@ntro.gov.in',
    metadata: { from: 'Tech Enthusiasts', to: 'Startup Ecosystem' },
  });
  return alerts;
}

function buildInsights(postBundle: PostBundle, trends: Trend[], influencers: Influencer[]): AIInsight[] {
  const insights: AIInsight[] = [];
  insights.push({
    id: 'insight_1',
    kind: 'propagation',
    title: 'Topic propagation across communities',
    summary:
      '"EV charging infrastructure" began increasing at 14:12. The conversation initially appeared in Tech Enthusiasts. Three high-influence accounts amplified the topic. Within 47 minutes it reached the Startup Ecosystem community. Negative sentiment increased from 18% to 46% during propagation.',
    confidence: confidence(0.82),
    evidence: [
      { type: 'topic', label: 'Origin community', value: 'Tech Enthusiasts', timestamp: new Date(Date.now() - 4.6 * 3600000).toISOString() },
      { type: 'user', label: 'Amplifier', value: 'tech_watch_44' },
      { type: 'metric', label: 'Propagation time', value: 47 },
      { type: 'metric', label: 'Sentiment change', value: '18% -> 46%' },
    ],
    createdAt: new Date().toISOString(),
    relatedTopicIds: ['topic_0'],
    relatedCommunityIds: ['community_0', 'community_5'],
    relatedUserIds: influencers.slice(0, 3).map((i) => i.userId),
  });
  insights.push({
    id: 'insight_2',
    kind: 'sentiment',
    title: 'Rising negative sentiment',
    summary:
      'The share of negative posts about "EV charging infrastructure" rose from 18% to 46% over the last 2 hours. This correlates with 3 high-influence accounts joining the conversation.',
    confidence: confidence(0.79),
    evidence: [
      { type: 'metric', label: 'Negative share', value: '46%' },
      { type: 'metric', label: 'Change', value: '+31%' },
      { type: 'user', label: 'Participating influencers', value: 3 },
    ],
    createdAt: new Date().toISOString(),
    relatedTopicIds: ['topic_0'],
    relatedCommunityIds: ['community_0', 'community_2', 'community_5'],
    relatedUserIds: influencers.slice(0, 3).map((i) => i.userId),
  });
  const v = trends.find((t) => t.status === 'viral');
  if (v) {
    insights.push({
      id: 'insight_3',
      kind: 'trend',
      title: `Viral trend: ${v.topicName}`,
      summary: `${v.topicName} has entered a viral phase with a mention velocity of ${v.mentionVelocity}/hour and a growth rate of ${v.growthRate}%.`,
      confidence: confidence(0.85),
      evidence: [
        { type: 'metric', label: 'Mention velocity', value: v.mentionVelocity },
        { type: 'metric', label: 'Unique users', value: v.uniqueUsers },
        { type: 'metric', label: 'Growth rate', value: `${v.growthRate}%` },
      ],
      createdAt: new Date().toISOString(),
      relatedTopicIds: [v.topicId],
      relatedCommunityIds: [],
      relatedUserIds: [],
    });
  }
  return insights;
}

function buildTimeline(postBundle: PostBundle): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  DEMO_EVENT_SCRIPT.forEach((step, i) => {
    events.push({
      id: `event_${i}`,
      timestamp: new Date(Date.now() - (DEMO_EVENT_SCRIPT.length - i) * 10 * 60000).toISOString(),
      type: step.type,
      postIds: postBundle.posts.slice(0, Math.min(20, i + 3)).map((p) => p.id),
      topicId: 'topic_0',
      description: step.description,
      metadata: { time: step.time, label: step.label },
    });
  });
  return events;
}

// ------------------------------------------------------------
// Data Sources & System Health Generators
// ------------------------------------------------------------
export function buildDataSources(): DataSource[] {
  return [
    {
      id: 'ds-x',
      name: 'X (Twitter) Enterprise Stream',
      platform: 'x',
      status: 'DEMO_MODE',
      rateLimitRemaining: 450,
      rateLimitMax: 500,
      eventsIngested: 84210,
      lastSyncAt: new Date().toISOString(),
      isPriority: true,
      credentialsConfigured: false,
    },
    {
      id: 'ds-telegram',
      name: 'Telegram Public Channels Monitor',
      platform: 'telegram',
      status: 'DEMO_MODE',
      rateLimitRemaining: 980,
      rateLimitMax: 1000,
      eventsIngested: 41290,
      lastSyncAt: new Date().toISOString(),
      isPriority: true,
      credentialsConfigured: false,
    },
    {
      id: 'ds-reddit',
      name: 'Reddit Discussions & Subreddits',
      platform: 'reddit',
      status: 'DEMO_MODE',
      rateLimitRemaining: 58,
      rateLimitMax: 60,
      eventsIngested: 19480,
      lastSyncAt: new Date().toISOString(),
      isPriority: false,
      credentialsConfigured: false,
    },
    {
      id: 'ds-youtube',
      name: 'YouTube Public Comments & Video Insights',
      platform: 'youtube',
      status: 'DEMO_MODE',
      rateLimitRemaining: 9200,
      rateLimitMax: 10000,
      eventsIngested: 12500,
      lastSyncAt: new Date().toISOString(),
      isPriority: false,
      credentialsConfigured: false,
    },
    {
      id: 'ds-instagram',
      name: 'Instagram Public Graph & Hashtags',
      platform: 'instagram',
      status: 'DEMO_MODE',
      rateLimitRemaining: 180,
      rateLimitMax: 200,
      eventsIngested: 9340,
      lastSyncAt: new Date().toISOString(),
      isPriority: false,
      credentialsConfigured: false,
    },
    {
      id: 'ds-facebook',
      name: 'Facebook Public Pages Monitor',
      platform: 'facebook',
      status: 'DEMO_MODE',
      rateLimitRemaining: 190,
      rateLimitMax: 200,
      eventsIngested: 7810,
      lastSyncAt: new Date().toISOString(),
      isPriority: false,
      credentialsConfigured: false,
    },
  ];
}

export function buildSystemHealth(): SystemServiceHealth[] {
  return [
    {
      id: 'srv-api',
      name: 'Node.js REST & Real-Time API',
      type: 'backend',
      status: 'ONLINE',
      latencyMs: 14,
      uptime: '99.98% (14d 6h)',
      activeConnections: 42,
      details: { port: 4000, environment: 'production-ready', framework: 'Express / TypeScript' },
    },
    {
      id: 'srv-ai',
      name: 'Python FastAPI NLP Service',
      type: 'ai',
      status: 'ONLINE',
      latencyMs: 38,
      uptime: '99.95% (14d 6h)',
      activeConnections: 8,
      details: { port: 5001, sentimentModel: 'cardiffnlp/twitter-roberta', embeddingModel: 'all-MiniLM-L6-v2' },
    },
    {
      id: 'srv-db',
      name: 'PostgreSQL / TimescaleDB Engine',
      type: 'database',
      status: 'ONLINE',
      latencyMs: 6,
      uptime: '99.99% (30d)',
      activeConnections: 24,
      details: { version: 'PostgreSQL 16 + TimescaleDB 2.14', hypertable: 'posts_timeseries' },
    },
    {
      id: 'srv-cache',
      name: 'Redis In-Memory Cache & Pub/Sub',
      type: 'cache',
      status: 'ONLINE',
      latencyMs: 2,
      uptime: '100% (45d)',
      activeConnections: 18,
      details: { port: 6379, hitRate: '94.2%', memoryUsed: '148 MB' },
    },
    {
      id: 'srv-graph',
      name: 'Neo4j Graph Database Topology',
      type: 'graph',
      status: 'ONLINE',
      latencyMs: 19,
      uptime: '99.94% (12d)',
      activeConnections: 12,
      details: { boltPort: 7687, totalNodes: 850, totalRelationships: 3200 },
    },
    {
      id: 'srv-ws',
      name: 'WebSocket Stream & Event Gateway',
      type: 'stream',
      status: 'ONLINE',
      latencyMs: 5,
      uptime: '99.99% (7d)',
      activeConnections: 35,
      details: { path: '/ws', eventsPerSec: 120 },
    },
    {
      id: 'srv-ingest',
      name: 'Multi-Platform Stream Ingestion Worker',
      type: 'ingestion',
      status: 'ONLINE',
      latencyMs: 22,
      uptime: '99.90% (14d)',
      activeConnections: 6,
      details: { activeProviders: 'X, Telegram, Reddit, YouTube', queueSize: 0 },
    },
  ];
}

export function buildEventIntelligence(
  topics: Topic[],
  trends: Trend[],
  influencers: Influencer[],
  targetTopicId?: string,
): EventIntelligenceData {
  const chosenTopic = topics.find((t) => (targetTopicId ? t.id === targetTopicId : true)) || topics[0];
  const matchedTrend = trends.find((t) => t.topicId === chosenTopic.id) || trends[0];
  const topInf = influencers[0] || {
    handle: 'tech_analyst_in',
    influenceScore: 0.94,
    role: 'authority',
  };

  const steps: PropagationStep[] = [
    {
      step: 1,
      time: '14:00:00',
      fromEntity: 'Citizen Community (Alpha)',
      toEntity: 'Public Forums',
      type: 'mention',
      description: `Initial discussion and grassroots posts regarding ${chosenTopic.name} detected on X and Telegram.`,
      sentimentDelta: -0.05,
    },
    {
      step: 2,
      time: '14:15:20',
      fromEntity: 'Public Forums',
      toEntity: `@${topInf.handle}`,
      type: 'amplification',
      description: `Key influencer @${topInf.handle} reposted critical commentary, accelerating mention velocity by 240%.`,
      sentimentDelta: -0.18,
    },
    {
      step: 3,
      time: '14:32:45',
      fromEntity: `@${topInf.handle}`,
      toEntity: 'Policy & Academic Community',
      type: 'cross_community',
      description: 'Discourse crossed community boundary into Policy & Tech Analysts with heightened engagement.',
      sentimentDelta: -0.12,
    },
    {
      step: 4,
      time: '14:47:10',
      fromEntity: 'Policy & Academic Community',
      toEntity: 'Mainstream News & Media Nodes',
      type: 'repost',
      description: 'Regional media accounts published commentary referencing viral hashtags; negative stance solidified at 46%.',
      sentimentDelta: -0.21,
    },
  ];

  return {
    topicId: chosenTopic.id,
    topicName: chosenTopic.name,
    startedAt: '14:00:00 UTC',
    currentMentions: matchedTrend ? matchedTrend.mentionCount : 18420,
    growthRate: matchedTrend ? matchedTrend.growthRate : 243,
    sentiment: {
      positive: 32,
      neutral: 22,
      negative: 46,
    },
    topInfluencer: {
      name: topInf.handle,
      handle: topInf.handle,
      influenceScore: topInf.influenceScore,
      role: topInf.role,
    },
    communitiesAffected: 4,
    propagationPath: [
      'Grassroots Community A',
      `Key Influencer (@${topInf.handle})`,
      'Policy Community B',
      'Media Hub C',
    ],
    propagationSteps: steps,
    aiSummary: `Topic "${chosenTopic.name}" emerged at 14:00 and gained rapid traction within Community A. High-influence account @${topInf.handle} amplified the narrative at 14:15. Within 47 minutes the topic crossed community boundaries into 3 distinct network clusters, shifting negative sentiment from 18% to 46%.`,
    confidence: confidence(0.92),
    evidence: [
      { type: 'time_range', label: 'Time Window', value: '14:00 - 15:15 UTC' },
      { type: 'post_count', label: 'Total Posts Analyzed', value: matchedTrend ? matchedTrend.mentionCount : 18420 },
      { type: 'sentiment_shift', label: 'Negative Sentiment Delta', value: '+28%' },
      { type: 'communities', label: 'Network Communities Reached', value: 4 },
      { type: 'influence_peak', label: 'Peak Influencer Score', value: topInf.influenceScore },
    ],
  };
}

export const DEMO_SCENARIOS = [
  {
    id: 'emerging_trend' as const,
    title: 'Scenario 1: Emerging Viral Trend',
    category: 'Trend Velocity',
    description: 'Sudden organic emergence of discussion regarding AI algorithmic compliance standards spreading rapidly across tech enthusiast circles.',
    durationMinutes: 35,
    highlightMetric: '+280% Velocity',
    affectedTopic: 'AI Regulation & Standards',
    stagesCount: 4,
  },
  {
    id: 'sentiment_shift' as const,
    title: 'Scenario 2: Critical Sentiment Inversion',
    category: 'Sentiment Alarm',
    description: 'Rapid transition of public sentiment from positive baseline to 46% negative following regional EV charging grid downtime.',
    durationMinutes: 47,
    highlightMetric: '-31% Polarity Delta',
    affectedTopic: 'EV Charging Infrastructure',
    stagesCount: 4,
  },
  {
    id: 'rapid_propagation' as const,
    title: 'Scenario 3: Multi-Cluster Cascade',
    category: 'Information Cascade',
    description: 'Information breach crossing modularity barriers from grassroots citizen forums into academic policy groups and media nodes.',
    durationMinutes: 52,
    highlightMetric: '4 Clusters Infiltrated',
    affectedTopic: 'UPI Digital Payments Outage',
    stagesCount: 5,
  },
  {
    id: 'influencer_amplification' as const,
    title: 'Scenario 4: High-Centrality Node Amplification',
    category: 'Network Centrality',
    description: 'Authority account with PageRank > 0.08 quote-shares telemetry log, multiplying repost velocity by 3.2x in 15 minutes.',
    durationMinutes: 28,
    highlightMetric: '3.2x Multiplier',
    affectedTopic: '5G Spectrum Allocation',
    stagesCount: 3,
  },
  {
    id: 'cross_platform' as const,
    title: 'Scenario 5: Cross-Platform Narrative Migration',
    category: 'Cross-Platform',
    description: 'Hashtag initiated on X migrates into Telegram announcement channels and subsequently dominates Reddit discussion threads.',
    durationMinutes: 65,
    highlightMetric: '4 Platforms Bridged',
    affectedTopic: 'Semiconductor Fabrication Mission',
    stagesCount: 4,
  },
  {
    id: 'community_polarization' as const,
    title: 'Scenario 6: Community Polarization',
    category: 'Network Topology',
    description: 'Discourse splits into two polarized ideological clusters with high internal cohesion and minimal cross-cutting ties.',
    durationMinutes: 90,
    highlightMetric: '0.78 Modularity Index',
    affectedTopic: 'Satellite Broadband Policy',
    stagesCount: 4,
  },
];

export function buildTopicForecasts(trends: Trend[]) {
  return trends.map((t, idx) => {
    const momentum: 'HIGH' | 'MEDIUM' | 'LOW' = idx === 0 ? 'HIGH' : idx < 3 ? 'MEDIUM' : 'LOW';
    const growth = t.growthRate || 140;
    const current = t.mentionCount || 12000;
    return {
      topicId: t.topicId,
      topicName: t.topicName,
      currentVolume: current,
      growthRate: growth,
      historicalGrowth: [current * 0.2, current * 0.4, current * 0.65, current * 0.85, current],
      momentum,
      forecastTrajectory: [
        { time: '+1h', predictedVolume: Math.round(current * 1.3), lowerBound: Math.round(current * 1.15), upperBound: Math.round(current * 1.45) },
        { time: '+2h', predictedVolume: Math.round(current * 1.65), lowerBound: Math.round(current * 1.4), upperBound: Math.round(current * 1.9) },
        { time: '+4h', predictedVolume: Math.round(current * 2.1), lowerBound: Math.round(current * 1.7), upperBound: Math.round(current * 2.5) },
        { time: '+8h', predictedVolume: Math.round(current * 2.8), lowerBound: Math.round(current * 2.2), upperBound: Math.round(current * 3.4) },
      ],
      forecastSummary: `Statistical time-series models project topic "${t.topicName}" to maintain ${momentum.toLowerCase()} momentum over the next 4 hours with +${Math.round(growth * 0.75)}% estimated expansion.`,
      confidenceScore: 0.94 - idx * 0.03,
    };
  });
}

export function buildDataQualityMetrics() {
  return {
    missingDataPct: 0.04,
    duplicateRecordsPct: 0.12,
    invalidTimestampsPct: 0.0,
    languageDetectionSuccessPct: 99.82,
    aiConfidenceAvgPct: 94.6,
    apiFailuresCount: 0,
    processingLatencyMs: 38.4,
    overallQualityScore: 98.4,
  };
}

export function buildAuditLogs() {
  return [
    { id: 'aud_1', timestamp: new Date(Date.now() - 4 * 60000).toISOString(), user: 'Analyst (NTRO-SEC-01)', role: 'ANALYST', action: 'EXPORT_REPORT', target: 'Dossier PDF / EV Crisis', result: 'SUCCESS' as const },
    { id: 'aud_2', timestamp: new Date(Date.now() - 12 * 60000).toISOString(), user: 'Analyst (NTRO-SEC-01)', role: 'ANALYST', action: 'ACK_ALERT', target: 'ALT_001_CRITICAL', result: 'SUCCESS' as const },
    { id: 'aud_3', timestamp: new Date(Date.now() - 25 * 60000).toISOString(), user: 'Admin (NTRO-ADM)', role: 'ADMIN', action: 'TOGGLE_CONNECTOR', target: 'Telegram Streaming Adapter', result: 'SUCCESS' as const },
    { id: 'aud_4', timestamp: new Date(Date.now() - 40 * 60000).toISOString(), user: 'Analyst (NTRO-SEC-01)', role: 'ANALYST', action: 'EXECUTE_QUERY', target: 'AI Analyst QA', result: 'SUCCESS' as const },
    { id: 'aud_5', timestamp: new Date(Date.now() - 65 * 60000).toISOString(), user: 'System (DAEMON)', role: 'SYSTEM', action: 'AUTOMATED_PURGE', target: 'Raw Post Cache > 90d', result: 'SUCCESS' as const },
  ];
}

export function buildSavedInvestigations() {
  return [
    {
      id: 'inv_1',
      title: 'Investigation #402: EV Grid Failure & Outage Narrative',
      createdAt: '2026-09-01T10:30:00Z',
      updatedAt: '2026-09-01T12:00:00Z',
      topic: 'EV Charging Infrastructure',
      timeRange: 'Last 6 Hours',
      filters: { platform: 'All', sentiment: 'Negative', minInfluence: '0.7' },
      notes: 'Confirmed narrative bridge from @tech_analyst_in to energy policy nodes. Critical sentiment spike reached 46%.',
      tags: ['CRITICAL', 'INFRASTRUCTURE', 'VERIFIED_PROPAGATION'],
      pinnedKPIs: { posts: 18420, sentimentDelta: '-31%', influencers: 4 },
    },
    {
      id: 'inv_2',
      title: 'Investigation #401: 5G Spectrum Rollout Consumer Sentiment',
      createdAt: '2026-08-31T14:15:00Z',
      updatedAt: '2026-09-01T08:00:00Z',
      topic: '5G Rollout',
      timeRange: 'Last 24 Hours',
      filters: { platform: 'X, YouTube', sentiment: 'Positive' },
      notes: 'Overall adoption sentiment remains predominantly supportive with 64% net positivity.',
      tags: ['TELECOM', 'POSITIVE_STANCE'],
      pinnedKPIs: { posts: 42100, sentimentDelta: '+8%', influencers: 12 },
    },
  ];
}

export function buildWatchlistItems() {
  return [
    { id: 'wt_1', entityType: 'topic' as const, name: 'EV Charging Infrastructure', targetId: 'topic_0', sensitivityThresholdPct: 20, currentVelocity: 340, lastActive: '2 min ago', alertTriggered: true },
    { id: 'wt_2', entityType: 'account' as const, name: '@tech_analyst_in', targetId: 'user_42', sensitivityThresholdPct: 15, currentVelocity: 180, lastActive: '8 min ago', alertTriggered: true },
    { id: 'wt_3', entityType: 'hashtag' as const, name: '#EVChargingCrisis', targetId: 'hash_ev', sensitivityThresholdPct: 25, currentVelocity: 290, lastActive: '1 min ago', alertTriggered: true },
    { id: 'wt_4', entityType: 'community' as const, name: 'Policy & Academic Community', targetId: 'comm_policy', sensitivityThresholdPct: 15, currentVelocity: 95, lastActive: '14 min ago', alertTriggered: false },
  ];
}

export function buildTopicRelationMap() {
  return [
    {
      id: 'topic_0',
      name: 'EV Charging Infrastructure',
      volume: 18420,
      sentiment: 'negative' as const,
      connections: [
        { targetId: 'topic_power', targetName: 'National Power Grid Stability', similarity: 0.88 },
        { targetId: 'topic_urban', targetName: 'Metro Urban Mobility', similarity: 0.76 },
        { targetId: 'topic_semi', targetName: 'Semiconductor Hardware', similarity: 0.62 },
      ],
    },
    {
      id: 'topic_1',
      name: '5G Rollout & Expansion',
      volume: 24100,
      sentiment: 'positive' as const,
      connections: [
        { targetId: 'topic_telecom', targetName: 'Telecom Infrastructure Circles', similarity: 0.91 },
        { targetId: 'topic_sat', targetName: 'Satellite Broadband Mission', similarity: 0.74 },
      ],
    },
    {
      id: 'topic_2',
      name: 'AI Regulation & Model Standards',
      volume: 14200,
      sentiment: 'neutral' as const,
      connections: [
        { targetId: 'topic_data', targetName: 'Digital Personal Data Privacy', similarity: 0.84 },
        { targetId: 'topic_cyber', targetName: 'Critical Cyber Defenses', similarity: 0.79 },
      ],
    },
  ];
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------
export interface MockDataset {
  posts: Post[];
  users: AnonymizedUser[];
  topics: Topic[];
  sentiment: SentimentResult[];
  trends: Trend[];
  influencers: Influencer[];
  communities: Community[];
  network: { nodes: NetworkNode[]; edges: NetworkEdge[] };
  demographics: DemographicSegment[];
  alerts: Alert[];
  insights: AIInsight[];
  timeline: TimelineEvent[];
  dataSources: DataSource[];
  systemHealth: SystemServiceHealth[];
}

let cached: MockDataset | null = null;

/** Generate (or reuse) the full mock dataset. */
export function generateMockData(): MockDataset {
  if (cached) return cached;
  const baseTime = Date.now();
  const users = buildUsers(800);
  const topics = buildTopics();
  const postBundle = buildPosts(users, topics, baseTime);
  const sentiment = buildSentiment(postBundle.posts);
  const trends = buildTrends(postBundle);
  const influencers = buildInfluencers(postBundle.posts, users);
  const communities = buildCommunities(topics);
  const network = buildNetwork(postBundle.posts, users, communities, topics);
  const demographics = buildDemographics();
  const alerts = buildAlerts(postBundle);
  const insights = buildInsights(postBundle, trends, influencers);
  const timeline = buildTimeline(postBundle);
  const dataSources = buildDataSources();
  const systemHealth = buildSystemHealth();
  cached = {
    posts: postBundle.posts,
    users,
    topics,
    sentiment,
    trends,
    influencers,
    communities,
    network,
    demographics,
    alerts,
    insights,
    timeline,
    dataSources,
    systemHealth,
  };
  return cached;
}


