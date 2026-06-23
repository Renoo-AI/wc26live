'use client';

import { useRef, useEffect, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import {
  getRoundOf16Matches,
  getQuarterFinalMatches,
  getSemiFinalMatches,
  getThirdPlaceMatch,
  getFinalMatch,
} from '@/data/matches';
import { formatMatchTime } from '@/lib/match-utils';
import type { Match } from '@/data/types';

function BracketMatchNode({
  match,
  isGold,
  onTap,
}: {
  match: Match;
  isGold?: boolean;
  onTap?: (id: string) => void;
}) {
  const { settings } = useAppStore();
  const hasTeams = match.teamA && match.teamB;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onTap?.(match.id)}
      className={cn(
        'flex flex-col items-center rounded-xl border p-2 min-w-[120px] sm:min-w-[140px] transition-colors text-left',
        isGold
          ? 'bg-[#FFD700]/5 border-[#FFD700]/30 hover:border-[#FFD700]/50'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      )}
    >
      {/* Team A */}
      <div className="flex items-center gap-1.5 w-full py-1">
        <span className="text-sm shrink-0">{match.teamA?.flag || '🏳️'}</span>
        <span className={cn('text-[11px] truncate flex-1', hasTeams ? 'text-white/80' : 'text-white/30')}>
          {match.teamA?.name || 'TBD'}
        </span>
        {match.scoreA !== undefined && (
          <span className="text-[11px] font-bold text-white/60 tabular-nums">{match.scoreA}</span>
        )}
      </div>

      {/* Divider + info */}
      <div className="w-full flex items-center gap-1.5 py-0.5 border-y border-white/5 my-0.5">
        <span className={cn('text-[9px] font-semibold px-1.5 py-0.5 rounded', isGold ? 'bg-[#FFD700]/15 text-[#FFD700]' : 'bg-white/10 text-white/40')}>
          {match.roundLabel || `Match ${match.matchNumber}`}
        </span>
        <span className="text-[9px] text-white/30 ml-auto tabular-nums">
          {formatMatchTime(match.date, settings.timeFormat)}
        </span>
      </div>

      {/* Team B */}
      <div className="flex items-center gap-1.5 w-full py-1">
        <span className="text-sm shrink-0">{match.teamB?.flag || '🏳️'}</span>
        <span className={cn('text-[11px] truncate flex-1', hasTeams ? 'text-white/80' : 'text-white/30')}>
          {match.teamB?.name || 'TBD'}
        </span>
        {match.scoreB !== undefined && (
          <span className="text-[11px] font-bold text-white/60 tabular-nums">{match.scoreB}</span>
        )}
      </div>
    </motion.button>
  );
}

function BracketRound({
  title,
  matches,
  isGold,
  onMatchTap,
}: {
  title: string;
  matches: Match[];
  isGold?: boolean;
  onMatchTap?: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 shrink-0">
      <span className={cn(
        'text-[10px] font-bold uppercase tracking-wider text-center mb-1',
        isGold ? 'text-[#FFD700]' : 'text-white/40'
      )}>
        {title}
      </span>
      <div className="flex flex-col gap-3">
        {matches.map((m) => (
          <BracketMatchNode key={m.id} match={m} isGold={isGold} onTap={onMatchTap} />
        ))}
      </div>
    </div>
  );
}

function Connector({ isGold }: { isGold?: boolean }) {
  return (
    <div className="flex items-center justify-center shrink-0 px-1 sm:px-2">
      <svg width="32" height="100%" className="text-white/10" preserveAspectRatio="none" style={{ minHeight: '60px' }}>
        <line
          x1="0"
          y1="50%"
          x2="16"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={isGold ? undefined : '4 4'}
        />
        <line
          x1="16"
          y1="25%"
          x2="16"
          y2="75%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={isGold ? undefined : '4 4'}
        />
        <line
          x1="16"
          y1="25%"
          x2="32"
          y2="25%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={isGold ? undefined : '4 4'}
        />
        <line
          x1="16"
          y1="75%"
          x2="32"
          y2="75%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={isGold ? undefined : '4 4'}
        />
      </svg>
    </div>
  );
}

export function BracketView() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setExpandedMatchId, setActiveTab, setSelectedDate } = useAppStore();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const r16 = getRoundOf16Matches();
  const qf = getQuarterFinalMatches();
  const sf = getSemiFinalMatches();
  const third = getThirdPlaceMatch();
  const final_ = getFinalMatch();

  function handleMatchTap(id: string) {
    const match = [r16, qf, sf, third, final_].flat().find((m) => m?.id === id);
    if (match) {
      setSelectedDate(match.date.slice(0, 10));
      setExpandedMatchId(id);
      setActiveTab('matches');
    }
  }

  if (!mounted) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-4 px-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex items-start gap-0 min-w-max">
          {/* R16 - 16 matches in 2 columns of 8 */}
          <div className="flex gap-2">
            <BracketRound title="Round of 16" matches={r16.slice(0, 8)} onMatchTap={handleMatchTap} />
            <BracketRound title="" matches={r16.slice(8)} onMatchTap={handleMatchTap} />
          </div>
          <Connector />
          {/* QF */}
          <BracketRound title="Quarter Finals" matches={qf.slice(0, 4)} onMatchTap={handleMatchTap} />
          <Connector />
          <BracketRound title="" matches={qf.slice(4)} onMatchTap={handleMatchTap} />
          <Connector isGold />
          {/* SF */}
          <BracketRound title="Semi Finals" matches={sf} isGold onMatchTap={handleMatchTap} />
          <Connector isGold />
          {/* Third Place + Final */}
          <div className="flex flex-col gap-3 shrink-0">
            {third && (
              <BracketMatchNode match={third} isGold onTap={handleMatchTap} />
            )}
            {final_ && (
              <div className="relative">
                <div className="absolute -inset-1 bg-[#FFD700]/10 rounded-2xl blur-md" />
                <BracketMatchNode match={final_} isGold onTap={handleMatchTap} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Fade edges for mobile scroll hint */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#0A0E1A] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-[#0A0E1A] to-transparent" />
    </div>
  );
}