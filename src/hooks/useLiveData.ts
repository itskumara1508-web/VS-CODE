import { useState, useEffect, useCallback } from 'react';
import { KPIMetrics, IngestionEvent, PlatformSource, TrendItem } from '../types';
import { initialKPIMetrics, platformSources, initialIngestionEvents, risingNarratives } from '../data/mockData';

const LIVE_TICK_INTERVAL = 3500;

export function useLiveData(isLiveEnabled: boolean = true) {
  const [metrics, setMetrics] = useState<KPIMetrics>(initialKPIMetrics);
  const [sources, setSources] = useState<PlatformSource[]>(platformSources);
  const [events, setEvents] = useState<IngestionEvent[]>(initialIngestionEvents);
  const [trends, setTrends] = useState<TrendItem[]>(risingNarratives);
  const [lastUpdated, setLastUpdated] = useState<string>('just now');
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [isBursting, setIsBursting] = useState<boolean>(false);

  // Periodic live update simulation
  useEffect(() => {
    if (!isLiveEnabled) return;

    const interval = setInterval(() => {
      // 1. Increment metrics slightly
      const newPostsDelta = Math.floor(Math.random() * 5) + 1;
      const newUsersDelta = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0;
      const newInteractionsDelta = Math.floor(Math.random() * 8) + 2;

      setMetrics((prev) => ({
        ...prev,
        totalPosts: prev.totalPosts + newPostsDelta,
        activeUsers: prev.activeUsers + newUsersDelta,
        totalInteractions: prev.totalInteractions + newInteractionsDelta,
        trendVelocity: +(prev.trendVelocity + (Math.random() * 0.4 - 0.2)).toFixed(1),
        sentimentIndex: +(prev.sentimentIndex + (Math.random() * 0.2 - 0.1)).toFixed(1),
      }));

      // 2. Pulse sources
      setSources((prev) =>
        prev.map((s, idx) => {
          if (idx === 0 || idx === 1 || Math.random() > 0.6) {
            return {
              ...s,
              postsCollected: s.postsCollected + Math.floor(Math.random() * 3) + 1,
              interactions: s.interactions + Math.floor(Math.random() * 6) + 1,
              apiLatencyMs: Math.max(30, Math.min(180, s.apiLatencyMs + Math.floor(Math.random() * 7 - 3))),
            };
          }
          return s;
        })
      );

      // 3. Occasionally add a live ingestion event
      if (Math.random() > 0.4) {
        const platforms: Array<IngestionEvent['platform']> = ['X', 'Telegram', 'Reddit', 'YouTube', 'Instagram'];
        const sentiments: Array<IngestionEvent['sentiment']> = ['supportive', 'neutral', 'excitement', 'anxiety'];
        const langs: Array<IngestionEvent['language']> = ['English', 'Hindi', 'Hinglish'];
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
        const randomSent = sentiments[Math.floor(Math.random() * sentiments.length)];
        const randomLang = langs[Math.floor(Math.random() * langs.length)];

        const sampleTexts = [
          'High throughput data verification running across national node clusters.',
          'सॉवरेन कंप्यूट इन्फ्रास्ट्रक्चर पर नई चर्चाएं शुरू हो गई हैं।',
          'Developers reviewing compliance frameworks for localized open weights.',
          'Encrypted channel relays note 34% shift towards decentralized model hosts.',
          'Policy symposium highlights ethical alignment with national cyber doctrine.',
        ];

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];

        const newEvent: IngestionEvent = {
          id: `evt-${Date.now()}`,
          time: timeStr,
          platform: randomPlatform,
          count: Math.floor(Math.random() * 450) + 50,
          type: randomPlatform === 'YouTube' ? 'comments' : randomPlatform === 'Telegram' ? 'messages' : 'posts',
          sampleText: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
          sentiment: randomSent,
          language: randomLang,
        };

        setEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      }

      setPulseCount((c) => c + 1);
      setLastUpdated('just now');
    }, LIVE_TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [isLiveEnabled]);

  // Manual burst simulation
  const triggerDataBurst = useCallback(() => {
    setIsBursting(true);
    setMetrics((prev) => ({
      ...prev,
      totalPosts: prev.totalPosts + 340,
      activeUsers: prev.activeUsers + 185,
      totalInteractions: prev.totalInteractions + 720,
      trendVelocity: +(prev.trendVelocity + 4.8).toFixed(1),
    }));

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const burstEvent: IngestionEvent = {
      id: `burst-${Date.now()}`,
      time: timeStr,
      platform: 'X',
      count: 1420,
      type: 'posts',
      sampleText: '🚨 INGESTION BURST: Detected coordinated viral surge across #AIRegulation and #DataSovereignty.',
      sentiment: 'anxiety',
      language: 'English',
    };

    setEvents((prev) => [burstEvent, ...prev.slice(0, 6)]);
    setTrends((prev) =>
      prev.map((t) => (t.rank === 1 ? { ...t, mentions: t.mentions + 420, velocity: +(t.velocity + 3.2).toFixed(1) } : t))
    );

    setTimeout(() => {
      setIsBursting(false);
    }, 1200);
  }, []);

  // Manual refresh
  const refreshAnalytics = useCallback(() => {
    setLastUpdated('Refreshed just now');
    setPulseCount((c) => c + 1);
  }, []);

  return {
    metrics,
    sources,
    events,
    trends,
    lastUpdated,
    pulseCount,
    isBursting,
    triggerDataBurst,
    refreshAnalytics,
  };
}
