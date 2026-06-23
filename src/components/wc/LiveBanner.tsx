'use client';

import { motion } from 'framer-motion';
import { Bell, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { getLiveMatches, getUpcomingMatches } from '@/data/matches';
import { formatMatchTime, getTimeUntilMatch, getBroadcasterForMatch } from '@/lib/match-utils';
import { TeamRow } from './TeamRow';
import { MatchCountdown } from './MatchCountdown';
import { BroadcasterBadge } from './BroadcasterBadge';

export function LiveBanner() {
  const { settings } = useAppStore();
  const liveMatches = getLiveMatches();
  const upcomingMatches = getUpcomingMatches();
  const liveMatch = liveMatches[0] || null;
  const nextMatch = upcomingMatches[0] || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl mx-4 mt-2"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: liveMatch
            ? [
                'linear-gradient(135deg, #1a0a0a 0%, #2a1515 50%, #0A0E1A 100%)',
                'linear-gradient(135deg, #2a1515 0%, #1a0a0a 50%, #151B2E 100%)',
                'linear-gradient(135deg, #1a0a0a 0%, #2a1515 50%, #0A0E1A 100%)',
              ]
            : [
                'linear-gradient(135deg, #0A0E1A 0%, #0a1a12 50%, #0A0E1A 100%)',
                'linear-gradient(135deg, #0a1a12 0%, #0A0E1A 50%, #0a2015 100%)',
                'linear-gradient(135deg, #0A0E1A 0%, #0a1a12 50%, #0A0E1A 100%)',
              ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl" />

      <div className="relative p-4 sm:p-5">
        {liveMatch ? (
          /* LIVE MATCH */
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <motion.span
                className="inline-flex items-center gap-1.5 bg-red-500/20 text-[#FF3B3B] text-xs font-bold px-2.5 py-1 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-2 h-2 rounded-full bg-[#FF3B3B]" />
                LIVE
              </motion.span>
              {liveMatch.minute && (
                <span className="text-white/60 text-xs">{liveMatch.minute}&apos;</span>
              )}
              <BroadcasterBadge
                type={
                  getBroadcasterForMatch(liveMatch, settings.countryCode).broadcaster[0]?.type || 'geo_blocked'
                }
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-1">
                <TeamRow team={liveMatch.teamA} score={liveMatch.scoreA} align="left" size="md" />
                <div className="flex flex-col items-center px-2">
                  <span className="text-xl font-bold text-white">
                    {liveMatch.scoreA ?? 0} – {liveMatch.scoreB ?? 0}
                  </span>
                  <span className="text-[10px] text-white/40 mt-0.5">
                    {liveMatch.venue}
                  </span>
                </div>
                <TeamRow team={liveMatch.teamB} score={liveMatch.scoreB} align="right" size="md" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-1">
              <a
                href={getBroadcasterForMatch(liveMatch, settings.countryCode).broadcaster[0]?.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#00E676]/20 text-[#00E676] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#00E676]/30 transition-colors min-h-[44px]"
              >
                <Play className="size-4" />
                Watch Free →
              </a>
            </div>
          </div>
        ) : nextMatch ? (
          /* NEXT MATCH COUNTDOWN */
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                Next Match
              </span>
              <span className="text-white/40 text-xs">
                {getTimeUntilMatch(nextMatch.date)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <TeamRow team={nextMatch.teamA} align="left" size="md" />
              <div className="flex flex-col items-center px-2">
                <span className="text-xs text-white/40">vs</span>
                <span className="text-[10px] text-white/40 mt-0.5">
                  {nextMatch.venue}
                </span>
              </div>
              <TeamRow team={nextMatch.teamB} align="right" size="md" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-1">
              <MatchCountdown targetDate={nextMatch.date} className="scale-90 sm:scale-100" />
              <button className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/15 transition-colors min-h-[44px]">
                <Bell className="size-4" />
                Set Reminder
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-white/40 text-sm">No upcoming matches</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}