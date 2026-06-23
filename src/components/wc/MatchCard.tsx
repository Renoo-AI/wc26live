'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { formatMatchTime, getStageLabel, getBroadcasterForMatch } from '@/lib/match-utils';
import type { Match } from '@/data/types';
import { TeamRow } from './TeamRow';
import { BroadcasterBadge } from './BroadcasterBadge';
import { MatchDetail } from './MatchDetail';

interface MatchCardProps {
  match: Match;
  isExpanded: boolean;
  onToggle: () => void;
}

const expandVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeInOut' as const },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' as const },
  },
};

export function MatchCard({ match, isExpanded, onToggle }: MatchCardProps) {
  const { settings } = useAppStore();
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const { broadcaster } = getBroadcasterForMatch(match, settings.countryCode);
  const primaryBroadcaster = broadcaster[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl border overflow-hidden transition-colors',
        isLive
          ? 'bg-[#151B2E] border-[#FF3B3B]/30 shadow-[0_0_20px_rgba(255,59,59,0.1)]'
          : 'bg-[#151B2E]/80 border-white/5',
        isExpanded && 'border-white/15'
      )}
    >
      {/* Main clickable row */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[44px] text-left"
      >
        {/* Time column */}
        <div className="flex flex-col items-center min-w-[48px]">
          {isLive ? (
            <div className="flex items-center gap-1">
              <motion.span
                className="w-2 h-2 rounded-full bg-[#FF3B3B]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-[#FF3B3B] text-xs font-bold">{match.minute ?? 0}&apos;</span>
            </div>
          ) : isFinished ? (
            <span className="text-white/40 text-xs font-medium">FT</span>
          ) : (
            <span className="text-white/80 text-sm font-semibold tabular-nums">
              {formatMatchTime(match.date, settings.timeFormat)}
            </span>
          )}
          <span className="text-[10px] text-white/30 mt-0.5">
            {getStageLabel(match.stage, match.group)}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-10 bg-white/10" />

        {/* Teams */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <TeamRow team={match.teamA} score={match.scoreA} align="left" size="sm" />
          <TeamRow team={match.teamB} score={match.scoreB} align="left" size="sm" />
        </div>

        {/* Right side: badge + chevron */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {primaryBroadcaster && (
            <BroadcasterBadge type={primaryBroadcaster.type} />
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4 text-white/30" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            variants={expandVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <div className="border-t border-white/5">
              <MatchDetail match={match} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}