import { Platform } from '../types';

export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ManualIngestionRecord {
  id: string;
  title: string;
  platform: Platform | 'DarkWeb' | 'Custom';
  author: string;
  sourceUrl?: string;
  content: string;
  language: string;
  emotion: string; // e.g., 'Excitement & Euphoria'
  emotionEmoji: string; // e.g., '🤩'
  emotionColor: string;
  threatLevel: ThreatLevel;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  isCoordinated: boolean;
  timestamp: string;
  tags: string[];
}

export const initialManualRecords: ManualIngestionRecord[] = [
  {
    id: 'MAN-26152-01',
    title: 'Coordinated Deepfake Narrative on Critical Infrastructure',
    platform: 'Telegram',
    author: '@ShadowIntel_Bharat',
    sourceUrl: 'https://t.me/ShadowIntel_Bharat/9421',
    content: 'Unverified video broadcast claiming electrical substation failure in Northern grid. Spread across 14 synchronized forward channels within 8 minutes.',
    language: 'Hindi / Hinglish',
    emotion: 'Anxiety & Caution',
    emotionEmoji: '😰',
    emotionColor: '#f59e0b',
    threatLevel: 'Critical',
    views: 184500,
    likes: 4200,
    shares: 28400,
    comments: 6100,
    isCoordinated: true,
    timestamp: '2026-09-06 14:22 IST',
    tags: ['#CriticalInfrastructure', '#Disinformation', '#Deepfake'],
  },
  {
    id: 'MAN-26152-02',
    title: 'Viral Appreciation Campaign for SIH 2026 NTRO Defense AI',
    platform: 'X',
    author: '@TechSovereign_IN',
    sourceUrl: 'https://x.com/TechSovereign_IN/status/1832049182',
    content: 'Incredible demonstration of indigenous AI analytics by youth teams today. Smart India Hackathon solving real national security challenges!',
    language: 'English',
    emotion: 'Excitement & Euphoria',
    emotionEmoji: '🤩',
    emotionColor: '#00f0ff',
    threatLevel: 'Low',
    views: 420000,
    likes: 38500,
    shares: 12800,
    comments: 2950,
    isCoordinated: false,
    timestamp: '2026-09-06 15:05 IST',
    tags: ['#SIH2026', '#NTRO', '#AIIntelligence', '#BharatTech'],
  },
  {
    id: 'MAN-26152-03',
    title: 'Cynical Satire & Innuendo on Digital Identity Policies',
    platform: 'Reddit',
    author: 'u/CynicPixel_99',
    sourceUrl: 'https://reddit.com/r/india/comments/948271',
    content: 'Waah kya masterstroke hai bhai! Now your toaster also needs biometric verification before dispensing bread. Truly 5D chess move! 🙄',
    language: 'Hinglish',
    emotion: 'Sarcasm & Cynicism',
    emotionEmoji: '🎭',
    emotionColor: '#ec4899',
    threatLevel: 'Medium',
    views: 96000,
    likes: 8400,
    shares: 3100,
    comments: 1820,
    isCoordinated: false,
    timestamp: '2026-09-06 15:40 IST',
    tags: ['#Satire', '#MemeWarfare', '#DigitalIdentity'],
  },
  {
    id: 'MAN-26152-04',
    title: 'Grassroots Community Solidarity for Border Personnel',
    platform: 'YouTube',
    author: 'BharatVichar Official',
    sourceUrl: 'https://youtube.com/watch?v=ntro_live_2026',
    content: 'Full broadcast detailing civilian welfare shipments to Himalayan patrol outposts. Net supportive comment polarity exceeding 94%.',
    language: 'Hindi',
    emotion: 'Support & Trust',
    emotionEmoji: '🤝',
    emotionColor: '#10b981',
    threatLevel: 'Low',
    views: 650000,
    likes: 82000,
    shares: 19400,
    comments: 14200,
    isCoordinated: false,
    timestamp: '2026-09-06 16:15 IST',
    tags: ['#CivilianSolidarity', '#ArmedForces', '#PublicTrust'],
  },
];

export const presetTemplates: Omit<ManualIngestionRecord, 'id' | 'timestamp'>[] = [
  {
    title: 'Coordinated Phishing Wave Targeting Defense Contractors',
    platform: 'X',
    author: '@GovAlert_Monitor',
    sourceUrl: 'https://x.com/alert/status/827192',
    content: 'Fake recruitment portals soliciting military engineering resumes discovered across multiple bot accounts with identical handle prefixes.',
    language: 'English',
    emotion: 'Outrage & Hostility',
    emotionEmoji: '😡',
    emotionColor: '#ef4444',
    threatLevel: 'High',
    views: 142000,
    likes: 3100,
    shares: 8900,
    comments: 1450,
    isCoordinated: true,
    tags: ['#Phishing', '#DefenseRecruitment', '#SybilAttack'],
  },
  {
    title: 'Youth Optimism on National Semiconductor Mission',
    platform: 'Instagram',
    author: '@NextGenBharat',
    sourceUrl: 'https://instagram.com/p/semicon_bharat_2026',
    content: 'Short visual reel showcasing domestic silicon wafer manufacturing plant in Gujarat. High comment resonance among university students.',
    language: 'English',
    emotion: 'Hope & Gratitude',
    emotionEmoji: '💖',
    emotionColor: '#3b82f6',
    threatLevel: 'Low',
    views: 310000,
    likes: 45000,
    shares: 14200,
    comments: 3200,
    isCoordinated: false,
    tags: ['#Semiconductor', '#MakeInIndia', '#TechFuture'],
  },
  {
    title: 'Technical Advisory Notice on Zero-Day CVE Patching',
    platform: 'Custom',
    author: 'CERT-In Feed Node #4',
    sourceUrl: 'https://cert-in.org.in/advisories/2026-09',
    content: 'High-severity vulnerability discovered in legacy VPN firmware. Mandatory remediation windows established for all defense perimeter routers.',
    language: 'English',
    emotion: 'Objective Neutrality',
    emotionEmoji: '😐',
    emotionColor: '#94a3b8',
    threatLevel: 'Medium',
    views: 45000,
    likes: 1200,
    shares: 5400,
    comments: 320,
    isCoordinated: false,
    tags: ['#CyberSec', '#CVE', '#PatchAdvisory'],
  },
];
