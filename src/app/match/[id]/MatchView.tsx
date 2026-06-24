'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, Play, Maximize, Minimize, Volume2, VolumeX, Bell, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { getMatchById, setGlobalOverrides } from '@/data/matches';
import { formatMatchTime, getStageLabel } from '@/lib/match-utils';
import { requestNotificationPermission, hasNotificationPermission } from '@/lib/notifications';
import type { Match } from '@/data/types';

function getStreamUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('wc26live-stream-url');
}

export function MatchView({ matchId }: { matchId: string }) {
  const { settings, matchOverrides } = useAppStore();
  const [match, setMatch] = useState<Match | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setGlobalOverrides(matchOverrides);
    setStreamUrl(getStreamUrl());
  }, [matchOverrides]);

  useEffect(() => {
    setMatch(getMatchById(matchId));
  }, [matchId, matchOverrides]);

  async function handleShare() {
    const url = window.location.href;
    const title = `${match?.teamA?.name ?? 'TBD'} vs ${match?.teamB?.name ?? 'TBD'} — Wc26Live`;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  }

  async function handleReminder() {
    await requestNotificationPermission();
  }

  if (!mounted || !match) return null;

  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  // ── YouTube Live style: video-first, minimal chrome ──────────

  return (
    <div className={cn(
      'bg-[#0A0A0A] min-h-screen flex flex-col',
      expanded && 'fixed inset-0 z-[100]'
    )}>
      {/* ── Header bar ─────────────────────────────────────── */}
      {!expanded && (
        <header className="flex h-12 items-center justify-between px-3 bg-[#0A0A0A] border-b border-white/5 shrink-0">
          <a href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="size-4" />
            <span className="text-xs font-medium">Wc26Live</span>
          </a>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 soft-pulse" />
                LIVE {match.minute}&apos;
              </span>
            )}
            <button onClick={handleShare} className="text-white/60 hover:text-white transition-colors">
              <Share2 className="size-4" />
            </button>
          </div>
        </header>
      )}

      {/* ── Video area ─────────────────────────────────────── */}
      <div className={cn(
        'relative bg-black flex items-center justify-center',
        expanded ? 'flex-1' : 'aspect-video w-full max-w-3xl mx-auto'
      )}>
        {/* Stream video */}
        {streamUrl ? (
          <>
            <video
              src={streamUrl}
              className="w-full h-full object-contain"
              playsInline
              muted={muted}
              autoPlay
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onLoadedData={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <Loader2 className="size-8 text-white/40 animate-spin" />
              </div>
            )}
          </>
        ) : isLive ? (
          /* No stream URL — show scoreboard placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1614] to-[#0A0A0A]">
            <span className="text-5xl mb-6">📡</span>
            <p className="text-white/40 text-sm text-center px-6">
              Live broadcast will appear here.<br />Set up your stream to go live.
            </p>
          </div>
        ) : isFinished ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1614] to-[#0A0A0A]">
            <span className="text-4xl mb-4">🏁</span>
            <p className="text-white/60 text-sm">Broadcast has ended</p>
          </div>
        ) : (
          /* Upcoming — countdown feel */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1614] to-[#0A0A0A]">
            <span className="text-5xl mb-4">⏳</span>
            <p className="text-white/60 text-sm">
              {format(parseISO(match.date), 'EEE, MMM d')} · {formatMatchTime(match.date, settings.timeFormat)}
            </p>
            <p className="text-white/30 text-xs mt-1">Match hasn&apos;t started yet</p>
          </div>
        )}

        {/* ── Score overlay (always visible during live/finished) ── */}
        {(isLive || isFinished) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-4">
            <div className="flex items-center justify-center gap-6">
              {/* Team A */}
              <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
                <span className="text-3xl">{match.teamA?.flag}</span>
                <span className="text-white text-xs font-semibold text-center truncate w-full">
                  {match.teamA?.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-4xl font-bold text-white tabular-nums tracking-tight">
                  {match.scoreA ?? 0} – {match.scoreB ?? 0}
                </span>
                {isLive && <span className="text-white/50 text-[10px]">{match.minute}&apos;</span>}
                {isFinished && <span className="text-white/50 text-[10px]">FT</span>}
              </div>

              {/* Team B */}
              <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
                <span className="text-3xl">{match.teamB?.flag}</span>
                <span className="text-white text-xs font-semibold text-center truncate w-full">
                  {match.teamB?.name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Video controls ──────────────────────────────── */}
        {streamUrl && isLive && (
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => setMuted(!muted)}
              className="size-8 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:bg-black/70 transition-colors"
            >
              {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="size-8 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:bg-black/70 transition-colors"
            >
              {expanded ? <Minimize className="size-3.5" /> : <Maximize className="size-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* ── Below video: info + actions ────────────────────── */}
      {!expanded && (
        <div className="flex-1 px-4 py-4 flex flex-col gap-4 max-w-3xl mx-auto w-full">
          {/* Title */}
          <div>
            <h1 className="text-white text-base font-bold">
              {match.teamA?.name ?? 'TBD'} vs {match.teamB?.name ?? 'TBD'}
            </h1>
            <p className="text-white/40 text-xs mt-0.5">
              {getStageLabel(match.stage, match.group)} · {match.venue} ·{' '}
              {format(parseISO(match.date), 'MMM d')} at {formatMatchTime(match.date, settings.timeFormat)}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {isLive ? (
              <>
                <motion.a
                  whileTap={{ scale: 0.97 }}
                  href={streamUrl || '#'}
                  target={streamUrl ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#2D8B5E] text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-[#257A4E] transition-colors min-h-[48px]"
                >
                  <Play className="size-4" />
                  Watch Live Free
                </motion.a>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]"
                >
                  <Share2 className="size-4" />
                  Share
                </motion.button>
              </>
            ) : isFinished ? (
              <div className="flex-1 text-center py-3">
                <span className="text-white/40 text-sm">Broadcast has ended</span>
              </div>
            ) : (
              /* Upcoming — REMINDER only, no Watch */
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleReminder}
                className="flex-1 flex items-center justify-center gap-2 bg-[#D97757] text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-[#C66A4A] transition-colors min-h-[48px]"
              >
                <Bell className="size-4" />
                Set Reminder
              </motion.button>
            )}
            {!isLive && !isFinished && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleShare}
                className="flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-sm px-4 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]"
              >
                <Share2 className="size-4" />
              </motion.button>
            )}
          </div>

          {/* No ads badge */}
          <div className="flex items-center justify-center gap-1.5 text-white/20">
            <span className="text-[10px]">⚡ No ads · Free · HD</span>
          </div>
        </div>
      )}
    </div>
  );
}