'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellRing, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { getLiveMatches, getUpcomingMatches } from '@/data/matches';
import { formatMatchTime, getTimeUntilMatch, getBroadcasterForMatch } from '@/lib/match-utils';
import { requestNotificationPermission, hasNotificationPermission } from '@/lib/notifications';
import { TeamRow } from './TeamRow';
import { MatchCountdown } from './MatchCountdown';
import { BroadcasterBadge } from './BroadcasterBadge';

export function LiveBanner() {
  const { settings } = useAppStore();
  const [notifyOn, setNotifyOn] = useState(hasNotificationPermission());
  const liveMatches = getLiveMatches();
  const upcomingMatches = getUpcomingMatches();
  const liveMatch = liveMatches[0] || null;
  const nextMatch = upcomingMatches[0] || null;

  async function handleReminder() {
    const granted = await requestNotificationPermission();
    setNotifyOn(granted);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-2xl mx-4 mt-2',
        'bg-white dark:bg-[#292524]',
        'border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)]',
        'shadow-[0_1px_3px_rgba(26,22,20,0.04),0_1px_2px_rgba(26,22,20,0.03)] dark:shadow-none'
      )}
    >
      <div className="relative p-4 sm:p-5">
        {liveMatch ? (
          /* LIVE MATCH — clean scoreboard */
          <div className="flex flex-col gap-3">
            {/* Top row: LIVE badge + minute */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-[rgba(217,72,72,0.08)] text-[#D94848] text-xs font-bold px-2.5 py-1 rounded-full dark:bg-[rgba(248,113,113,0.08)] dark:text-[#F87171]">
                <span className="w-2 h-2 rounded-full bg-[#D94848] dark:bg-[#F87171] soft-pulse" />
                LIVE
                {liveMatch.minute ? <span>{liveMatch.minute}&apos;</span> : null}
              </span>
              <BroadcasterBadge
                type={
                  getBroadcasterForMatch(liveMatch, settings.countryCode).broadcaster[0]?.type || 'geo_blocked'
                }
              />
            </div>

            {/* Scoreboard row */}
            <div className="flex items-center justify-between">
              {/* Team A */}
              <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-2xl">{liveMatch.teamA?.flag || '🏳️'}</span>
                <span className="text-xs font-semibold text-[#1A1614] dark:text-[#FAF5F0] text-center truncate w-full">
                  {liveMatch.teamA?.name || 'TBD'}
                </span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center shrink-0 px-4">
                <span className="text-3xl font-bold text-[#1A1614] dark:text-[#FAF5F0] tabular-nums tracking-tight">
                  {liveMatch.scoreA ?? 0} – {liveMatch.scoreB ?? 0}
                </span>
                <span className="text-[10px] text-[#B5ADA7] dark:text-[#7D7570] mt-0.5">
                  {liveMatch.venue}
                </span>
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                <span className="text-2xl">{liveMatch.teamB?.flag || '🏳️'}</span>
                <span className="text-xs font-semibold text-[#1A1614] dark:text-[#FAF5F0] text-center truncate w-full">
                  {liveMatch.teamB?.name || 'TBD'}
                </span>
              </div>
            </div>

            {/* Watch button */}
            <a
              href={getBroadcasterForMatch(liveMatch, settings.countryCode).broadcaster[0]?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[rgba(45,139,94,0.08)] text-[#2D8B5E] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[rgba(45,139,94,0.15)] transition-colors min-h-[44px] dark:text-[#4ADE80] dark:hover:bg-[rgba(74,222,128,0.15)] w-full"
            >
              <Play className="size-4" />
              Watch Free on Wc26Live
            </a>
          </div>
        ) : nextMatch ? (
          /* NEXT MATCH COUNTDOWN */
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[#9C908A] dark:text-[#7D7570] text-xs font-medium uppercase tracking-wider">
                Next Match
              </span>
              <span className="text-[#B5ADA7] dark:text-[#7D7570] text-xs">
                {getTimeUntilMatch(nextMatch.date)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <TeamRow team={nextMatch.teamA} align="left" size="md" />
              <div className="flex flex-col items-center px-2">
                <span className="text-xs text-[#B5ADA7] dark:text-[#7D7570]">vs</span>
                <span className="text-[10px] text-[#B5ADA7] dark:text-[#7D7570] mt-0.5">
                  {nextMatch.venue}
                </span>
              </div>
              <TeamRow team={nextMatch.teamB} align="right" size="md" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-1">
              <MatchCountdown targetDate={nextMatch.date} className="scale-90 sm:scale-100" />
              <button
                onClick={handleReminder}
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl transition-colors min-h-[44px]',
                  notifyOn
                    ? 'bg-[rgba(45,139,94,0.08)] text-[#2D8B5E] dark:text-[#4ADE80]'
                    : 'bg-[#EDE8E2] text-[#6B5F57] hover:bg-[#E0D9D2] dark:bg-[#3D3632] dark:text-[#A89E96] dark:hover:bg-[#4A433E]'
                )}
              >
                {notifyOn ? <BellRing className="size-4" /> : <Bell className="size-4" />}
                {notifyOn ? 'Reminder Set' : 'Set Reminder'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-[#B5ADA7] dark:text-[#7D7570] text-sm">No upcoming matches</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}