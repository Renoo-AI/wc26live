'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/settings';
import { TopNav } from '@/components/wc/TopNav';
import { LiveBanner } from '@/components/wc/LiveBanner';
import { DatePillSelector } from '@/components/wc/DatePillSelector';
import { MatchCard } from '@/components/wc/MatchCard';
import { MatchSkeletonList } from '@/components/wc/MatchSkeleton';
import { BracketView } from '@/components/wc/BracketView';
import { SettingsPanel } from '@/components/wc/SettingsPanel';
import { BottomNav } from '@/components/wc/BottomNav';
import { Disclaimer } from '@/components/wc/Disclaimer';
import { getMatchesByDate, getLiveMatches, allMatches, getAllMatchDates, getUpcomingMatches, setGlobalOverrides } from '@/data/matches';
import { checkAndNotifyMatches, requestNotificationPermission, hasNotificationPermission } from '@/lib/notifications';
import { cn } from '@/lib/utils';

const pageVariants = {
  matches: { x: 0, opacity: 1 },
  bracket: { x: 30, opacity: 0 },
  settings: { x: 30, opacity: 0 },
};

const pageTransition = { duration: 0.25, ease: 'easeInOut' as const };

export default function Home() {
  const {
    activeTab,
    selectedDate,
    expandedMatchId,
    setExpandedMatchId,
    settings,
    setSettings,
    matchOverrides,
  } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mount hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Geolocation detection
  useEffect(() => {
    async function detectCountry() {
      try {
        const res = await fetch('/api/geolocation');
        const data = await res.json();
        if (data.countryCode) {
          setSettings({
            countryCode: data.countryCode,
            countryName: data.countryName,
            flag: data.flag,
          });
        }
      } catch {
        // Keep default US
      } finally {
        setLoading(false);
      }
    }
    detectCountry();
  }, [setSettings]);

  // Sync admin overrides to matches module
  useEffect(() => {
    setGlobalOverrides(matchOverrides);
  }, [matchOverrides]);

  // Auto-notification polling (checks every 30s for upcoming match times)
  useEffect(() => {
    // Request permission on first load
    if (!hasNotificationPermission()) {
      requestNotificationPermission();
    }

    const interval = setInterval(() => {
      const upcoming = getUpcomingMatches();
      checkAndNotifyMatches(upcoming, settings.notifications);
    }, 30000); // every 30 seconds

    // Run once immediately
    const upcoming = getUpcomingMatches();
    checkAndNotifyMatches(upcoming, settings.notifications);

    return () => clearInterval(interval);
  }, [settings.notifications]);

  // Auto-select first date if none selected
  const allDates = useMemo(() => getAllMatchDates(), []);
  const effectiveDate = selectedDate || allDates[0] || '';

  // Get matches for selected date
  const dateMatches = useMemo(() => {
    if (!effectiveDate) return [];
    return getMatchesByDate(effectiveDate);
  }, [effectiveDate]);

  // Sort: live first, then by time
  const sortedMatches = useMemo(() => {
    const live = getLiveMatches();
    const liveIds = new Set(live.map((m) => m.id));
    return [...dateMatches].sort((a, b) => {
      const aLive = liveIds.has(a.id) ? 0 : 1;
      const bLive = liveIds.has(b.id) ? 0 : 1;
      if (aLive !== bLive) return aLive - bLive;
      return a.date.localeCompare(b.date);
    });
  }, [dateMatches, matchOverrides]);

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  // Hydration guard
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] dark:bg-[#1C1917] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-[#D97757]/30 border-t-[#D97757] animate-spin" />
          <span className="text-[#9C908A] dark:text-[#7D7570] text-sm">Loading Wc26Live...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] dark:bg-[#1C1917] flex flex-col">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <main className="flex-1 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'matches' && (
            <motion.div
              key="matches"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={pageTransition}
              className="flex flex-col gap-3"
            >
              {/* Live Banner */}
              <LiveBanner />

              {/* Date Selector */}
              <DatePillSelector />

              {/* Match List */}
              <div className="px-4 flex flex-col gap-2">
                {loading ? (
                  <MatchSkeletonList count={4} />
                ) : sortedMatches.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 py-16"
                  >
                    <div className="text-4xl">⚽</div>
                    <div className="text-center">
                      <p className="text-[#6B5F57] dark:text-[#A89E96] text-sm font-medium">
                        No matches on this day
                      </p>
                      <p className="text-[#9C908A] dark:text-[#7D7570] text-xs mt-1">
                        Select another date or check the bracket for upcoming knockout matches
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  sortedMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      isExpanded={expandedMatchId === match.id}
                      onToggle={() =>
                        setExpandedMatchId(
                          expandedMatchId === match.id ? null : match.id
                        )
                      }
                    />
                  ))
                )}
              </div>

              {/* Disclaimer (mobile) */}
              <div className="lg:hidden px-4 mt-4">
                <Disclaimer />
              </div>
            </motion.div>
          )}

          {activeTab === 'bracket' && (
            <motion.div
              key="bracket"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={pageTransition}
              className="flex flex-col gap-4 pt-2"
            >
              <div className="px-4">
                <h2 className="text-lg font-bold text-[#1A1614] dark:text-[#FAF5F0]">Knockout Stage</h2>
                <p className="text-xs text-[#9C908A] dark:text-[#7D7570] mt-1">
                  Tap a match to view broadcast details
                </p>
              </div>
              <BracketView />
              <div className="px-4 mt-2 lg:hidden">
                <Disclaimer />
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={pageTransition}
            >
              <div className="pt-2">
                <SettingsPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (mobile) */}
      <BottomNav />
    </div>
  );
}