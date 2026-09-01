import type { Platform } from '@ntro/types';

/** App-wide static configuration and reference data. */

export const APP_NAME = 'NTRO Social Intelligence';
export const APP_VERSION = '1.0.0';

/** Platforms that are fully enabled. */
export const ENABLED_PLATFORMS: Platform[] = ['x', 'telegram', 'mock'];

/** All platforms known to the system. */
export const ALL_PLATFORMS: Platform[] = [
  'x',
  'telegram',
  'instagram',
  'facebook',
  'reddit',
  'youtube',
  'mock',
];

export const LANGUAGES = [
  'en',
  'hi',
  'mr',
  'ta',
  'te',
  'bn',
  'gu',
  'kn',
  'pa',
  'ur',
] as const;

/** Topics relevant to NTRO national-security / tech intelligence themes. */
export const TOPICS: Array<{
  name: string;
  aliases: string[];
  category: string;
  description: string;
}> = [
  {
    name: 'EV Charging Infrastructure',
    aliases: ['EV charging', 'charging station', 'EV infrastructure', 'electric vehicle charger'],
    category: 'technology',
    description: 'Discussions around electric vehicle charging networks and infrastructure.',
  },
  {
    name: '5G Rollout',
    aliases: ['5G network', '5G launch', '5G coverage', '5G spectrum'],
    category: 'telecom',
    description: 'Conversations about 5G deployment, coverage and spectrum allocation.',
  },
  {
    name: 'AI Regulation',
    aliases: ['AI laws', 'AI policy', 'AI governance', 'AI regulation bill'],
    category: 'policy',
    description: 'Public discourse on regulation and governance of artificial intelligence.',
  },
  {
    name: 'Semiconductor Manufacturing',
    aliases: ['chip manufacturing', 'semiconductor fab', 'chip plant', 'semiconductor policy'],
    category: 'technology',
    description: 'Discussion about domestic semiconductor fabrication and chip policy.',
  },
  {
    name: 'Cyber Security',
    aliases: ['cyber attack', 'data breach', 'ransomware', 'cyber threat'],
    category: 'security',
    description: 'Conversations on cybersecurity incidents, threats and defence.',
  },
  {
    name: 'Digital Payments',
    aliases: ['UPI', 'digital wallet', 'online payment', 'payment app'],
    category: 'finance',
    description: 'Public opinion on digital payment systems and UPI adoption.',
  },
  {
    name: 'Space Technology',
    aliases: ['ISRO', 'space mission', 'satellite launch', 'space programme'],
    category: 'technology',
    description: 'Discussion on space missions, launches and related policy.',
  },
  {
    name: 'Renewable Energy',
    aliases: ['solar power', 'wind energy', 'green energy', 'clean energy'],
    category: 'energy',
    description: 'Conversations on transition to renewable energy sources.',
  },
  {
    name: 'Electric Vehicles',
    aliases: ['EV', 'electric car', 'e-mobility', 'e-vehicle'],
    category: 'automotive',
    description: 'Broad discussion on electric vehicles and adoption.',
  },
  {
    name: 'Border Security',
    aliases: ['border infra', 'border patrol', 'border fence', 'border surveillance'],
    category: 'security',
    description: 'Discussion on border security infrastructure and policy.',
  },
];

/** Seed influencers (anonymized) that drive the narrative. */
export interface SeedInfluencer {
  handle: string;
  displayName: string;
  community: string;
  influenceScore: number;
  language: string;
  location: string;
  followerCount: number;
}

export const SEED_INFLUENCERS: SeedInfluencer[] = [
  {
    handle: 'tech_watch_44',
    displayName: 'TechWatch',
    community: 'Tech Enthusiasts',
    influenceScore: 0.92,
    language: 'en',
    location: 'Bengaluru',
    followerCount: 412000,
  },
  {
    handle: 'policy_pulse_in',
    displayName: 'Policy Pulse',
    community: 'Policy Analysts',
    influenceScore: 0.87,
    language: 'en',
    location: 'New Delhi',
    followerCount: 278000,
  },
  {
    handle: 'urban_mobility',
    displayName: 'Urban Mobility',
    community: 'Urban Development',
    influenceScore: 0.81,
    language: 'en',
    location: 'Mumbai',
    followerCount: 156000,
  },
  {
    handle: 'green_future_india',
    displayName: 'Green Future',
    community: 'Environmentalists',
    influenceScore: 0.76,
    language: 'en',
    location: 'Pune',
    followerCount: 98400,
  },
  {
    handle: 'cyber_sentinel',
    displayName: 'Cyber Sentinel',
    community: 'Cyber Security',
    influenceScore: 0.89,
    language: 'en',
    location: 'Hyderabad',
    followerCount: 342000,
  },
  {
    handle: 'startup_nexus',
    displayName: 'Startup Nexus',
    community: 'Startup Ecosystem',
    influenceScore: 0.72,
    language: 'en',
    location: 'Bengaluru',
    followerCount: 61200,
  },
  {
    handle: 'rail_metro_watch',
    displayName: 'Rail & Metro Watch',
    community: 'Infrastructure',
    influenceScore: 0.68,
    language: 'en',
    location: 'Chennai',
    followerCount: 44100,
  },
];

/** Communities used for the network model. */
export const COMMUNITIES = [
  'Tech Enthusiasts',
  'Policy Analysts',
  'Urban Development',
  'Environmentalists',
  'Cyber Security',
  'Startup Ecosystem',
  'Infrastructure',
  'General Public',
] as const;

/** Regions/locations used for aggregate demo segmentation. */
export const REGIONS = [
  'Bengaluru',
  'Mumbai',
  'New Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
] as const;

/** Publicly stated professions used for aggregate demographic profiles. */
export const PROFESSIONS = [
  'Software Engineer',
  'Student',
  'Policy Researcher',
  'Journalist',
  'Business Owner',
  'Government Official',
  'Academic',
  'Marketer',
  'Automotive Enthusiast',
  'Security Professional',
] as const;

/** Demo event narrative script for the "Play Demo Event" button. */
export interface DemoEventStep {
  time: string;
  label: string;
  type: string;
  description: string;
}

export const DEMO_EVENT_SCRIPT: DemoEventStep[] = [
  {
    time: '14:00',
    label: 'Topic appears',
    type: 'topic_emergence',
    description: 'Initial posts mentioning "EV charging infrastructure" begin to appear.',
  },
  {
    time: '14:10',
    label: 'Mentions increasing',
    type: 'velocity_increase',
    description: 'Mention velocity starts rising across X and Telegram.',
  },
  {
    time: '14:15',
    label: 'Emerging trend detected',
    type: 'trend_detected',
    description: 'AI classifies "EV charging infrastructure" as an emerging trend.',
  },
  {
    time: '14:20',
    label: 'Influencer amplification',
    type: 'influencer_boost',
    description: 'High-influence account tech_watch_44 amplifies the topic.',
  },
  {
    time: '14:30',
    label: 'Community B engaged',
    type: 'community_propagation',
    description: 'Community B (startup-ecosystem) begins discussing the topic.',
  },
  {
    time: '14:45',
    label: 'Negative sentiment shift',
    type: 'sentiment_shift',
    description: 'Negative sentiment increases from 18% to 46% during propagation.',
  },
  {
    time: '15:00',
    label: 'Propagation detected',
    type: 'propagation_detected',
    description: 'AI detects topic propagation from Community A to Community B.',
  },
  {
    time: '15:05',
    label: 'Dashboard insight generated',
    type: 'ai_insight',
    description: 'System generates trend, sentiment shift, influencer, and propagation insights.',
  },
];
