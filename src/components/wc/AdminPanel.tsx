'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Play,
  X,
  ChevronDown,
  Plus,
  Minus,
  Flag,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { allMatches, getLiveMatches } from '@/data/matches';
import { formatMatchTime, getStageLabel } from '@/lib/match-utils';
import type { Match } from '@/data/types';

export function AdminPanel() {
  const {
    settings,
    matchOverrides,
    setMatchOverride,
    removeMatchOverride,
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const liveMatches = getLiveMatches();
  const liveMatch = liveMatches[0] || null;

  // Upcoming matches (not live, not finished)
  const upcomingMatches = useMemo(
    () =>
      allMatches
        .filter((m) => {
          const override = matchOverrides[m.id];
          const status = override?.status ?? m.status;
          return status === 'upcoming';
        })
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 20), // limit to next 20 matches
    [matchOverrides]
  );

  function handleSetLive(match: Match) {
    // If there's already a live match, clear it first
    const currentLive = allMatches.find((m) => {
      const override = matchOverrides[m.id];
      return (override?.status ?? m.status) === 'live';
    });
    if (currentLive) {
      removeMatchOverride(currentLive.id);
    }

    setMatchOverride(match.id, {
      status: 'live',
      scoreA: 0,
      scoreB: 0,
      minute: 1,
    });
    setPickerOpen(false);
  }

  function handleUpdateScore(matchId: string, team: 'A' | 'B', delta: number) {
    const override = matchOverrides[matchId] || {};
    const currentScore = team === 'A' ? (override.scoreA ?? 0) : (override.scoreB ?? 0);
    const newScore = Math.max(0, currentScore + delta);
    setMatchOverride(matchId, {
      ...override,
      [team === 'A' ? 'scoreA' : 'scoreB']: newScore,
    });
  }

  function handleUpdateMinute(matchId: string, delta: number) {
    const override = matchOverrides[matchId] || {};
    const currentMinute = override.minute ?? 0;
    const newMinute = Math.max(0, currentMinute + delta);
    setMatchOverride(matchId, {
      ...override,
      minute: newMinute,
    });
  }

  function handleEndMatch(matchId: string) {
    const override = matchOverrides[matchId] || {};
    setMatchOverride(matchId, {
      ...override,
      status: 'finished',
    });
  }

  function handleResetMatch(matchId: string) {
    removeMatchOverride(matchId);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mt-2"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border transition-colors min-h-[48px]',
          'bg-[rgba(217,119,87,0.06)] border-[rgba(217,119,87,0.25)] dark:bg-[rgba(232,139,110,0.08)] dark:border-[rgba(232,139,110,0.2)]',
          'hover:bg-[rgba(217,119,87,0.1)] dark:hover:bg-[rgba(232,139,110,0.12)]'
        )}
      >
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-[#D97757] dark:text-[#E88B6E]" />
          <span className="text-sm font-semibold text-[#D97757] dark:text-[#E88B6E]">
            Admin Panel
          </span>
          {liveMatch && (
            <span className="inline-flex items-center gap-1 bg-[rgba(217,72,72,0.08)] text-[#D94848] text-[10px] font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D94848] soft-pulse" />
              LIVE
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-4 text-[#D97757] dark:text-[#E88B6E]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 flex flex-col gap-3">
              {/* Live Match Controls */}
              {liveMatch ? (
                <div className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0]">
                      🔴 Live Match Controls
                    </span>
                    <button
                      onClick={() => handleResetMatch(liveMatch.id)}
                      className="text-[10px] text-[#9C908A] dark:text-[#7D7570] hover:text-[#D94848] transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Match info */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium text-[#1A1614] dark:text-[#FAF5F0]">
                        {liveMatch.teamA?.name ?? 'TBD'}
                      </span>
                      <span className="text-lg font-bold text-[#1A1614] dark:text-[#FAF5F0] tabular-nums">
                        {matchOverrides[liveMatch.id]?.scoreA ?? 0} – {matchOverrides[liveMatch.id]?.scoreB ?? 0}
                      </span>
                      <span className="font-medium text-[#1A1614] dark:text-[#FAF5F0]">
                        {liveMatch.teamB?.name ?? 'TBD'}
                      </span>
                      <span className="text-xs text-[#9C908A] dark:text-[#7D7570]">
                        ({getStageLabel(liveMatch.stage, liveMatch.group)})
                      </span>
                    </div>

                    {/* Score controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#9C908A] dark:text-[#7D7570]">
                          {liveMatch.teamA?.code ?? 'A'}
                        </span>
                        <button
                          onClick={() => handleUpdateScore(liveMatch.id, 'A', -1)}
                          className="size-8 rounded-lg bg-[#EDE8E2] dark:bg-[#3D3632] flex items-center justify-center hover:bg-[#E0D9D2] dark:hover:bg-[#4A433E] transition-colors"
                        >
                          <Minus className="size-3.5 text-[#3D3530] dark:text-[#A89E96]" />
                        </button>
                        <button
                          onClick={() => handleUpdateScore(liveMatch.id, 'A', 1)}
                          className="size-8 rounded-lg bg-[#EDE8E2] dark:bg-[#3D3632] flex items-center justify-center hover:bg-[#E0D9D2] dark:hover:bg-[#4A433E] transition-colors"
                        >
                          <Plus className="size-3.5 text-[#3D3530] dark:text-[#A89E96]" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#9C908A] dark:text-[#7D7570]">
                          {liveMatch.teamB?.code ?? 'B'}
                        </span>
                        <button
                          onClick={() => handleUpdateScore(liveMatch.id, 'B', -1)}
                          className="size-8 rounded-lg bg-[#EDE8E2] dark:bg-[#3D3632] flex items-center justify-center hover:bg-[#E0D9D2] dark:hover:bg-[#4A433E] transition-colors"
                        >
                          <Minus className="size-3.5 text-[#3D3530] dark:text-[#A89E96]" />
                        </button>
                        <button
                          onClick={() => handleUpdateScore(liveMatch.id, 'B', 1)}
                          className="size-8 rounded-lg bg-[#EDE8E2] dark:bg-[#3D3632] flex items-center justify-center hover:bg-[#E0D9D2] dark:hover:bg-[#4A433E] transition-colors"
                        >
                          <Plus className="size-3.5 text-[#3D3530] dark:text-[#A89E96]" />
                        </button>
                      </div>
                    </div>

                    {/* Minute controls */}
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-[#9C908A] dark:text-[#7D7570]" />
                      <span className="text-xs text-[#9C908A] dark:text-[#7D7570] mr-1">Minute:</span>
                      <button
                        onClick={() => handleUpdateMinute(liveMatch.id, -1)}
                        className="size-7 rounded-lg bg-[#EDE8E2] dark:bg-[#3D3632] flex items-center justify-center hover:bg-[#E0D9D2] dark:hover:bg-[#4A433E] transition-colors"
                      >
                        <Minus className="size-3 text-[#3D3530] dark:text-[#A89E96]" />
                      </button>
                      <span className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0] tabular-nums w-8 text-center">
                        {matchOverrides[liveMatch.id]?.minute ?? 0}&apos;
                      </span>
                      <button
                        onClick={() => handleUpdateMinute(liveMatch.id, 1)}
                        className="size-7 rounded-lg bg-[#EDE8E2] dark:bg-[#3D3632] flex items-center justify-center hover:bg-[#E0D9D2] dark:hover:bg-[#4A433E] transition-colors"
                      >
                        <Plus className="size-3 text-[#3D3530] dark:text-[#A89E96]" />
                      </button>
                    </div>

                    {/* End match button */}
                    <button
                      onClick={() => handleEndMatch(liveMatch.id)}
                      className="w-full flex items-center justify-center gap-2 bg-[rgba(217,72,72,0.08)] text-[#D94848] dark:text-[#F87171] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[rgba(217,72,72,0.15)] transition-colors min-h-[44px]"
                    >
                      <Flag className="size-4" />
                      End Match (Full Time)
                    </button>
                  </div>
                </div>
              ) : (
                /* No live match — show picker */
                <div className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0]">
                      Pick a match to start live
                    </span>
                    {pickerOpen && (
                      <button
                        onClick={() => setPickerOpen(false)}
                        className="text-[10px] text-[#9C908A] dark:text-[#7D7570] hover:text-[#D94848] transition-colors"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>

                  {!pickerOpen ? (
                    <button
                      onClick={() => setPickerOpen(true)}
                      className="w-full flex items-center justify-center gap-2 bg-[#D97757] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#C66A4A] transition-colors min-h-[44px]"
                    >
                      <Play className="size-4" />
                      Pick Match &amp; Start Live
                    </button>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-[320px] overflow-y-auto">
                      {upcomingMatches.map((match) => (
                        <motion.button
                          key={match.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSetLive(match)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] hover:bg-[#FAF8F5] dark:hover:bg-[#3D3632] transition-colors text-left"
                        >
                          <div className="flex flex-col items-center min-w-[40px]">
                            <span className="text-xs font-semibold text-[#1A1614] dark:text-[#FAF5F0] tabular-nums">
                              {formatMatchTime(match.date, settings.timeFormat)}
                            </span>
                            <span className="text-[10px] text-[#B5ADA7] dark:text-[#7D7570]">
                              {getStageLabel(match.stage, match.group)}
                            </span>
                          </div>
                          <span className="text-xs text-[#6B5F57] dark:text-[#A89E96] flex-1 truncate">
                            {match.teamA?.name ?? 'TBD'} vs {match.teamB?.name ?? 'TBD'}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Live match indicator for picker when live already */}
              {liveMatch && (
                <div className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-3 shadow-[0_1px_3px_rgba(26,22,20,0.04)]">
                  <p className="text-xs text-[#9C908A] dark:text-[#7D7570] text-center">
                    To start a different match, end the current live match first.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}