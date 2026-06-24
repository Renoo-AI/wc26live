'use client';

import type { Match } from '@/data/types';

// ── Permission ──────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function hasNotificationPermission(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

// ── Send (with service-worker fallback) ─────────────────────────────

function send(title: string, options: NotificationOptions & { vibrate?: number[] }) {
  if (!hasNotificationPermission()) return;
  const { vibrate, ...rest } = options;
  try {
    const n = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: true,
      ...rest,
    });
    if (vibrate && navigator.vibrate) navigator.vibrate(vibrate);
  } catch {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => reg.showNotification(title, { icon: '/favicon.ico', ...rest }))
        .catch(() => {});
    }
  }
}

// ── Public API ──────────────────────────────────────────────────────

export function notifyMatchStartingSoon(match: Match) {
  const a = match.teamA?.name ?? 'TBD';
  const b = match.teamB?.name ?? 'TBD';
  send(`⏰ ${a} vs ${b} in 30 min!`, {
    body: `Kick-off soon at ${match.venue}. Watch live on Wc26Live.`,
    tag: `soon-${match.id}`,
    vibrate: [100, 50, 100],
  });
}

export function notifyMatchKickoff(match: Match) {
  const a = match.teamA?.name ?? 'TBD';
  const b = match.teamB?.name ?? 'TBD';
  send(`🔴 LIVE NOW: ${a} vs ${b}`, {
    body: `The match has kicked off! Watch on Wc26Live.`,
    tag: `kickoff-${match.id}`,
    vibrate: [200, 100, 200, 100, 200],
  });
}

export function notifyGoal(team: string, scoreA: number, scoreB: number) {
  send(`⚽ GOAL! ${team}`, {
    body: `Score: ${scoreA} – ${scoreB}`,
    tag: 'goal',
    vibrate: [300],
  });
}

export function notifyMatchFinished(teamA: string, teamB: string, scoreA: number, scoreB: number) {
  send(`🏁 Full Time: ${teamA} ${scoreA} – ${scoreB} ${teamB}`, {
    body: `Final score.`,
    tag: 'ft',
    vibrate: [100, 50, 100],
  });
}

export function notifyMatchLive(teamA: string, teamB: string) {
  send(`🔴 Match is LIVE!`, {
    body: `${teamA} vs ${teamB} has kicked off on Wc26Live`,
    tag: 'match-live',
    vibrate: [200, 100, 200],
  });
}

// ── Auto-notification tracker (session-level, no dupes) ────────────

const NOTIFIED_KEY = 'wc26live-notified';

function getNotified(): Set<string> {
  try {
    const raw = sessionStorage.getItem(NOTIFIED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markNotified(tag: string) {
  const set = getNotified();
  set.add(tag);
  sessionStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
}

export function checkAndNotifyMatches(matches: Match[], settings: {
  matchStart: boolean;
  thirtyMinBefore: boolean;
}) {
  if (!hasNotificationPermission()) return;

  const now = Date.now();
  const notified = getNotified();

  for (const match of matches) {
    const kickoff = new Date(match.date).getTime();
    const diffMin = Math.floor((kickoff - now) / 60000);

    // 30-min warning
    if (settings.thirtyMinBefore && diffMin <= 30 && diffMin >= 28) {
      const tag = `soon-${match.id}`;
      if (!notified.has(tag)) {
        notifyMatchStartingSoon(match);
        markNotified(tag);
      }
    }

    // Exact kickoff (within 90 seconds window)
    if (settings.matchStart && diffMin <= 1 && diffMin >= -1) {
      const tag = `kickoff-${match.id}`;
      if (!notified.has(tag)) {
        notifyMatchKickoff(match);
        markNotified(tag);
      }
    }
  }
}
