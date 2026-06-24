'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Play, Flag, Clock, Plus, Minus, ArrowLeft, Key, Lock, ChevronDown, Bell, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { allMatches, setGlobalOverrides } from '@/data/matches';
import { formatMatchTime, getStageLabel } from '@/lib/match-utils';
import { requestNotificationPermission, hasNotificationPermission, notifyMatchLive, notifyMatchFinished, notifyGoal } from '@/lib/notifications';
import { useMatchSync } from '@/lib/useMatchSync';
import type { Match } from '@/data/types';

function getPasskey(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return hh + mm;
}

function isValidPasskey(input: string): boolean {
  if (input.length !== 4 || !/^\d{4}$/.test(input)) return false;
  const now = new Date();
  // Accept current minute +- 1 minute
  for (let offset = -1; offset <= 1; offset++) {
    const d = new Date(now.getTime() + offset * 60000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (input === hh + mm) return true;
  }
  return false;
}

export default function AdminPage() {
  const { settings, matchOverrides, setMatchOverride, removeMatchOverride } = useAppStore();
  const { synced, broadcastMatch, broadcastScore, endBroadcast } = useMatchSync();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authed = sessionStorage.getItem('wc26live-admin-auth');
    if (authed === 'true') setAuthenticated(true);
    // Check notification permission status
    setNotifyEnabled(hasNotificationPermission());
  }, []);

  // Sync overrides to matches module for main page
  useEffect(() => {
    setGlobalOverrides(matchOverrides);
  }, [matchOverrides]);

  // Derive live match DIRECTLY from store (not getLiveMatches which reads stale module state)
  const liveMatch = useMemo(() => {
    return (
      allMatches.find((m) => {
        const o = matchOverrides[m.id];
        return (o?.status ?? m.status) === 'live';
      }) || null
    );
  }, [matchOverrides]);

  const upcomingMatches = useMemo(
    () =>
      allMatches
        .filter((m) => {
          const override = matchOverrides[m.id];
          const status = override?.status ?? m.status;
          return status === 'upcoming';
        })
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 30),
    [matchOverrides]
  );

  function handleDigit(d: string) {
    setError(false);
    setPasscode((prev) => {
      const next = prev + d;
      if (next.length === 4) {
        // Validate after a short delay
        setTimeout(() => {
          if (isValidPasskey(next)) {
            sessionStorage.setItem('wc26live-admin-auth', 'true');
            setAuthenticated(true);
          } else {
            setError(true);
            setPasscode('');
          }
        }, 200);
      }
      return next.length <= 4 ? next : prev;
    });
  }

  function handleBackspace() {
    setError(false);
    setPasscode((prev) => prev.slice(0, -1));
  }

  function handleClear() {
    setError(false);
    setPasscode('');
  }

  function handleLogout() {
    sessionStorage.removeItem('wc26live-admin-auth');
    setAuthenticated(false);
    setPasscode('');
    setError(false);
    setPickerOpen(false);
  }

  async function handleSetLive(match: Match) {
    // Request notification permission on first live start
    if (!hasNotificationPermission()) {
      const granted = await requestNotificationPermission();
      setNotifyEnabled(granted);
    }

    // Broadcast to all tabs via BroadcastChannel
    broadcastMatch({
      matchId: match.id,
      status: 'live',
      scoreA: 0,
      scoreB: 0,
      minute: 1,
    });

    setPickerOpen(false);

    // Notify!
    notifyMatchLive(
      match.teamA?.name ?? 'Team A',
      match.teamB?.name ?? 'Team B'
    );
  }

  function handleUpdateScore(matchId: string, team: 'A' | 'B', delta: number) {
    const override = matchOverrides[matchId] || {};
    const currentScore = team === 'A' ? (override.scoreA ?? 0) : (override.scoreB ?? 0);
    const newScore = Math.max(0, currentScore + delta);
    const scoreA = team === 'A' ? newScore : (override.scoreA ?? 0);
    const scoreB = team === 'B' ? newScore : (override.scoreB ?? 0);

    // Broadcast to all tabs
    broadcastScore(matchId, scoreA, scoreB, override.minute ?? 0);

    // Notify on goal (+1)
    if (delta > 0) {
      const match = allMatches.find((m) => m.id === matchId);
      const teamName = team === 'A' ? match?.teamA?.name : match?.teamB?.name;
      notifyGoal(teamName ?? 'Unknown', scoreA, scoreB);
    }
  }

  function handleUpdateMinute(matchId: string, delta: number) {
    const override = matchOverrides[matchId] || {};
    const newMinute = Math.max(0, (override.minute ?? 0) + delta);
    broadcastScore(matchId, override.scoreA ?? 0, override.scoreB ?? 0, newMinute);
  }

  function handleEndMatch(matchId: string) {
    const override = matchOverrides[matchId] || {};
    const scoreA = override.scoreA ?? 0;
    const scoreB = override.scoreB ?? 0;

    // Final score update
    broadcastMatch({
      matchId,
      status: 'finished',
      scoreA,
      scoreB,
      minute: 90,
    });

    // End broadcast (shows excuse to viewers)
    const match = allMatches.find((m) => m.id === matchId);
    const teamA = match?.teamA?.name ?? 'Team A';
    const teamB = match?.teamB?.name ?? 'Team B';
    endBroadcast(`Broadcast has ended. ${teamA} ${scoreA} – ${scoreB} ${teamB}. Thanks for watching on Wc26Live!`);

    // Notify full time
    notifyMatchFinished(teamA, teamB, scoreA, scoreB);
  }

  function handleResetMatch(matchId: string) {
    removeMatchOverride(matchId);
  }

  if (!mounted) return null;

  // === PASSKEY GATE ===
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] dark:bg-[#1C1917] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 w-full max-w-sm"
        >
          {/* Icon */}
          <div className="size-16 rounded-2xl bg-[rgba(217,119,87,0.1)] dark:bg-[rgba(232,139,110,0.12)] flex items-center justify-center">
            <Shield className="size-8 text-[#D97757] dark:text-[#E88B6E]" />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-bold text-[#1A1614] dark:text-[#FAF5F0]">Admin Access</h1>
            <p className="text-sm text-[#9C908A] dark:text-[#7D7570] mt-1">
              Enter the 4-digit time passkey to continue
            </p>
          </div>

          {/* Passcode display */}
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={error ? { x: [0, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={cn(
                  'size-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-colors',
                  error
                    ? 'border-[#D94848] bg-[rgba(217,72,72,0.06)] text-[#D94848]'
                    : passcode.length > i
                    ? 'border-[#D97757] bg-[rgba(217,119,87,0.06)] text-[#D97757]'
                    : passcode.length === i
                    ? 'border-[#D97757] bg-white dark:bg-[#292524] text-[#1A1614] dark:text-[#FAF5F0]'
                    : 'border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] bg-white dark:bg-[#292524]'
                )}
              >
                {passcode[i] && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[#D97757] dark:text-[#E88B6E]"
                  >
                    ●
                  </motion.span>
                )}
                {passcode.length === i && !error && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-1 h-5 bg-[#D97757] dark:bg-[#E88B6E] rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-[#D94848] dark:text-[#F87171] font-medium"
            >
              Incorrect passkey — try again
            </motion.p>
          )}

          {/* Number pad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, idx) => {
              if (key === '') return <div key={idx} />;
              const isBackspace = key === '⌫';
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => (isBackspace ? handleBackspace() : handleDigit(key))}
                  className={cn(
                    'h-14 rounded-xl text-xl font-semibold transition-colors flex items-center justify-center',
                    isBackspace
                      ? 'bg-transparent text-[#9C908A] dark:text-[#7D7570] hover:text-[#D94848] text-sm'
                      : 'bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] text-[#1A1614] dark:text-[#FAF5F0] hover:bg-[#FAF8F5] dark:hover:bg-[#3D3632] active:bg-[#EDE8E2] dark:active:bg-[#4A433E] shadow-[0_1px_2px_rgba(26,22,20,0.04)]'
                  )}
                >
                  {isBackspace ? '⌫' : key}
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={handleClear}
            className="text-xs text-[#9C908A] dark:text-[#7D7570] hover:text-[#D94848] transition-colors"
          >
            Clear
          </button>
        </motion.div>
      </div>
    );
  }

  // === AUTHENTICATED — ADMIN PANEL ===
  return (
    <div className="min-h-screen bg-[#F5F0EB] dark:bg-[#1C1917] flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between px-4 bg-[#F5F0EB]/95 dark:bg-[#1C1917]/95 border-b border-[#F0EBE5] dark:border-[rgba(250,245,240,0.08)]">
        <a href="/" className="flex items-center gap-2">
          <ArrowLeft className="size-4 text-[#9C908A] dark:text-[#7D7570]" />
          <span className="text-sm text-[#9C908A] dark:text-[#7D7570]">Back to app</span>
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (notifyEnabled) {
                setNotifyEnabled(false);
              } else {
                const granted = await requestNotificationPermission();
                setNotifyEnabled(granted);
              }
            }}
            className={cn(
              'text-xs font-medium transition-colors',
              notifyEnabled
                ? 'text-[#2D8B5E] dark:text-[#4ADE80]'
                : 'text-[#9C908A] dark:text-[#7D7570] hover:text-[#D97757]'
            )}
            title={notifyEnabled ? 'Notifications ON' : 'Enable notifications'}
          >
            {notifyEnabled ? <BellRing className="size-4" /> : <Bell className="size-4" />}
          </button>
          <span className="text-xs text-[#B5ADA7] dark:text-[#7D7570] tabular-nums">
            {getPasskey()}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-[#D94848] dark:text-[#F87171] font-medium hover:underline"
          >
            Lock
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 flex flex-col gap-4 max-w-lg mx-auto w-full pb-24">
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-[#D97757] dark:text-[#E88B6E]" />
          <h1 className="text-lg font-bold text-[#1A1614] dark:text-[#FAF5F0]">Admin Panel</h1>
          {liveMatch && (
            <span className="inline-flex items-center gap-1 bg-[rgba(217,72,72,0.08)] text-[#D94848] text-[10px] font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D94848] soft-pulse" />
              LIVE
            </span>
          )}
        </div>

        {/* Live Match Controls */}
        {liveMatch ? (
          <section className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0]">
                🔴 Live Match
              </h2>
              <button
                onClick={() => handleResetMatch(liveMatch.id)}
                className="text-[11px] text-[#9C908A] dark:text-[#7D7570] hover:text-[#D94848] transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Match info */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-4">
                <span className="text-base font-semibold text-[#1A1614] dark:text-[#FAF5F0]">
                  {liveMatch.teamA?.name ?? 'TBD'}
                </span>
                <span className="text-2xl font-bold text-[#1A1614] dark:text-[#FAF5F0] tabular-nums">
                  {matchOverrides[liveMatch.id]?.scoreA ?? 0} – {matchOverrides[liveMatch.id]?.scoreB ?? 0}
                </span>
                <span className="text-base font-semibold text-[#1A1614] dark:text-[#FAF5F0]">
                  {liveMatch.teamB?.name ?? 'TBD'}
                </span>
              </div>
              <p className="text-xs text-[#9C908A] dark:text-[#7D7570] mt-1">
                {getStageLabel(liveMatch.stage, liveMatch.group)} · {liveMatch.venue}
              </p>
            </div>

            {/* Score controls — side by side */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Team A */}
              <div className="bg-[#FAF8F5] dark:bg-[#3D3632] rounded-xl p-3 text-center">
                <span className="text-xs text-[#9C908A] dark:text-[#7D7570] font-medium">
                  {liveMatch.teamA?.code ?? 'Team A'}
                </span>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleUpdateScore(liveMatch.id, 'A', -1)}
                    className="size-10 rounded-xl bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] flex items-center justify-center shadow-sm"
                  >
                    <Minus className="size-4 text-[#D94848]" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleUpdateScore(liveMatch.id, 'A', 1)}
                    className="size-10 rounded-xl bg-[#D97757] text-white flex items-center justify-center shadow-sm"
                  >
                    <Plus className="size-4" />
                  </motion.button>
                </div>
              </div>

              {/* Team B */}
              <div className="bg-[#FAF8F5] dark:bg-[#3D3632] rounded-xl p-3 text-center">
                <span className="text-xs text-[#9C908A] dark:text-[#7D7570] font-medium">
                  {liveMatch.teamB?.code ?? 'Team B'}
                </span>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleUpdateScore(liveMatch.id, 'B', -1)}
                    className="size-10 rounded-xl bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] flex items-center justify-center shadow-sm"
                  >
                    <Minus className="size-4 text-[#D94848]" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleUpdateScore(liveMatch.id, 'B', 1)}
                    className="size-10 rounded-xl bg-[#D97757] text-white flex items-center justify-center shadow-sm"
                  >
                    <Plus className="size-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Minute control */}
            <div className="flex items-center justify-center gap-3 mb-4 bg-[#FAF8F5] dark:bg-[#3D3632] rounded-xl p-3">
              <Clock className="size-4 text-[#9C908A] dark:text-[#7D7570]" />
              <span className="text-xs text-[#9C908A] dark:text-[#7D7570]">Minute</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleUpdateMinute(liveMatch.id, -1)}
                className="size-9 rounded-lg bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] flex items-center justify-center"
              >
                <Minus className="size-3.5 text-[#3D3530] dark:text-[#A89E96]" />
              </motion.button>
              <span className="text-lg font-bold text-[#1A1614] dark:text-[#FAF5F0] tabular-nums min-w-[3ch] text-center">
                {matchOverrides[liveMatch.id]?.minute ?? 0}&apos;
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleUpdateMinute(liveMatch.id, 1)}
                className="size-9 rounded-lg bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] flex items-center justify-center"
              >
                <Plus className="size-3.5 text-[#3D3530] dark:text-[#A89E96]" />
              </motion.button>
            </div>

            {/* End match */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEndMatch(liveMatch.id)}
              className="w-full flex items-center justify-center gap-2 bg-[rgba(217,72,72,0.08)] text-[#D94848] dark:text-[#F87171] text-sm font-semibold px-4 py-3 rounded-xl hover:bg-[rgba(217,72,72,0.15)] transition-colors"
            >
              <Flag className="size-4" />
              End Match (Full Time)
            </motion.button>
          </section>
        ) : (
          /* No live match */
          <section className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04)]">
            <div className="text-center mb-4">
              <div className="size-12 rounded-xl bg-[rgba(45,139,94,0.08)] dark:bg-[rgba(74,222,128,0.08)] flex items-center justify-center mx-auto mb-3">
                <Play className="size-6 text-[#2D8B5E] dark:text-[#4ADE80]" />
              </div>
              <h2 className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0]">
                No match is currently live
              </h2>
              <p className="text-xs text-[#9C908A] dark:text-[#7D7570] mt-1">
                Pick a match below to start tracking it live
              </p>
            </div>

            {!pickerOpen ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setPickerOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#D97757] text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-[#C66A4A] transition-colors"
              >
                <Play className="size-4" />
                Pick Match &amp; Start Live
              </motion.button>
            ) : (
              <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#9C908A] dark:text-[#7D7570]">
                    Upcoming matches
                  </span>
                  <button
                    onClick={() => setPickerOpen(false)}
                    className="text-xs text-[#D94848] dark:text-[#F87171]"
                  >
                    Cancel
                  </button>
                </div>
                {upcomingMatches.map((match) => (
                  <motion.button
                    key={match.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSetLive(match)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] hover:bg-[#FAF8F5] dark:hover:bg-[#3D3632] transition-colors text-left"
                  >
                    <div className="flex flex-col items-center min-w-[44px]">
                      <span className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0] tabular-nums">
                        {formatMatchTime(match.date, settings.timeFormat)}
                      </span>
                      <span className="text-[10px] text-[#B5ADA7] dark:text-[#7D7570]">
                        {getStageLabel(match.stage, match.group)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-[#6B5F57] dark:text-[#A89E96] truncate block">
                        {match.teamA?.name ?? 'TBD'} vs {match.teamB?.name ?? 'TBD'}
                      </span>
                      <span className="text-[10px] text-[#B5ADA7] dark:text-[#7D7570]">
                        {match.venue}
                      </span>
                    </div>
                    <Play className="size-3.5 text-[#D97757] dark:text-[#E88B6E] shrink-0" />
                  </motion.button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Info */}
        <div className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-3 text-center">
          <p className="text-[11px] text-[#9C908A] dark:text-[#7D7570]">
            Changes here update instantly on the main app. Passkey resets when you close the browser.
          </p>
        </div>
      </main>
    </div>
  );
}