'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Play, MapPin, Clock, Radio, Tv } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { getMatchById, setGlobalOverrides } from '@/data/matches';
import { formatMatchTime, getStageLabel } from '@/lib/match-utils';
import { LivePlayer } from '@/components/wc/LivePlayer';
import type { Match } from '@/data/types';

export function MatchView({ matchId }: { matchId: string }) {
  const { settings, matchOverrides } = useAppStore();
  const [match, setMatch] = useState<Match | undefined>(undefined);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setGlobalOverrides(matchOverrides);
  }, [matchOverrides]);

  useEffect(() => {
    setMatch(getMatchById(matchId));
  }, [matchId, matchOverrides]);

  if (!mounted || !match) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] dark:bg-[#1C1917] flex items-center justify-center">
        <span className="text-[#9C908A] text-sm">Loading...</span>
      </div>
    );
  }

  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const matchDate = parseISO(match.date);

  async function handleShare() {
    const url = window.location.href;
    const title = `${match!.teamA?.name ?? 'TBD'} vs ${match!.teamB?.name ?? 'TBD'} — Wc26Live`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      // Could show a toast here
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] dark:bg-[#1C1917] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between px-4 bg-[#F5F0EB]/95 dark:bg-[#1C1917]/95 border-b border-[#F0EBE5] dark:border-[rgba(250,245,240,0.08)]">
        <a href="/" className="flex items-center gap-2">
          <ArrowLeft className="size-4 text-[#9C908A] dark:text-[#7D7570]" />
          <span className="text-sm text-[#9C908A] dark:text-[#7D7570]">Back</span>
        </a>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm font-medium text-[#D97757] dark:text-[#E88B6E]"
        >
          <Share2 className="size-4" />
          Share
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-24 max-w-lg mx-auto w-full">
        {/* Status badge */}
        {isLive && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 bg-[rgba(217,72,72,0.08)] text-[#D94848] text-sm font-bold px-3 py-1 rounded-full mb-6"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#D94848] soft-pulse" />
            LIVE {match.minute}&apos;
          </motion.span>
        )}
        {isFinished && (
          <span className="text-sm font-semibold text-[#9C908A] mb-6">FULL TIME</span>
        )}
        {!isLive && !isFinished && (
          <span className="text-sm text-[#9C908A] mb-6">
            {format(matchDate, 'EEE, MMM d')} · {formatMatchTime(match.date, settings.timeFormat)}
          </span>
        )}

        {/* Scoreboard */}
        <div className="flex items-center justify-between w-full gap-4 mb-8">
          {/* Team A */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <span className="text-4xl">{match.teamA?.flag || '🏳️'}</span>
            <span className="text-sm font-bold text-[#1A1614] dark:text-[#FAF5F0] text-center truncate w-full">
              {match.teamA?.name || 'TBD'}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center shrink-0">
            <span className="text-5xl font-bold text-[#1A1614] dark:text-[#FAF5F0] tabular-nums tracking-tight">
              {match.scoreA ?? 0} – {match.scoreB ?? 0}
            </span>
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <span className="text-4xl">{match.teamB?.flag || '🏳️'}</span>
            <span className="text-sm font-bold text-[#1A1614] dark:text-[#FAF5F0] text-center truncate w-full">
              {match.teamB?.name || 'TBD'}
            </span>
          </div>
        </div>

        {/* Match info */}
        <div className="flex flex-col items-center gap-1 text-xs text-[#9C908A] dark:text-[#7D7570] mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="size-3" />
            <span>{match.venue}, {match.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-3" />
            <span>
              {format(matchDate, 'EEE, MMM d, yyyy')} at {formatMatchTime(match.date, settings.timeFormat)}
            </span>
          </div>
          <span>{getStageLabel(match.stage, match.group)} · Match {match.matchNumber}</span>
        </div>

        {/* Watch / Listen buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {isLive && (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setPlayerOpen(!playerOpen)}
                className={cn(
                  'w-full flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-xl transition-colors min-h-[52px]',
                  playerOpen
                    ? 'bg-[#6B5F57]'
                    : 'bg-[#2D8B5E] hover:bg-[#257A4E]'
                )}
              >
                <Tv className="size-5" />
                {playerOpen ? 'Hide Player' : 'Watch Live Free'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setPlayerOpen(!playerOpen)}
                className="w-full flex items-center justify-center gap-2 bg-[rgba(217,119,87,0.08)] text-[#D97757] dark:text-[#E88B6E] font-semibold px-6 py-3 rounded-xl hover:bg-[rgba(217,119,87,0.15)] transition-colors min-h-[52px] border border-[rgba(217,119,87,0.25)]"
              >
                <Radio className="size-5" />
                Listen Live Audio
              </motion.button>
            </>
          )}

          {!isLive && !isFinished && (
            <div className="text-center">
              <span className="text-sm text-[#9C908A] dark:text-[#7D7570]">
                Match hasn&apos;t started yet
              </span>
            </div>
          )}

          {isFinished && (
            <div className="text-center">
              <span className="text-sm text-[#9C908A] dark:text-[#7D7570]">
                Match has ended
              </span>
            </div>
          )}
        </div>

        {/* Player */}
        {playerOpen && isLive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="w-full max-w-xs mt-4"
          >
            <LivePlayer />
          </motion.div>
        )}
      </main>
    </div>
  );
}