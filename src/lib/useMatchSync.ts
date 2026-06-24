'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '@/store/settings';

const CHANNEL_NAME = 'wc26live-match-sync';

interface MatchState {
  matchId: string;
  status: 'upcoming' | 'live' | 'finished';
  scoreA: number;
  scoreB: number;
  minute: number;
}

interface SyncMessage {
  type: 'match-set' | 'score-update' | 'broadcast-ended';
  match?: MatchState;
  message?: string;
}

// Broadcast across all tabs of the same origin
function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return null;
  return new BroadcastChannel(CHANNEL_NAME);
}

export function useMatchSync() {
  const { matchOverrides, setMatchOverride, removeMatchOverride } = useAppStore();
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  // Listen for sync messages from other tabs (e.g., admin tab)
  useEffect(() => {
    const channel = getChannel();
    if (!channel) return;

    const handler = (event: MessageEvent<SyncMessage>) => {
      const data = event.data;
      console.log('[match-sync] Received:', data.type);

      if (data.type === 'broadcast-ended') {
        setBroadcastMessage(data.message || 'Broadcast has ended. Thanks for watching!');
        // Clear live matches
        Object.keys(matchOverrides).forEach((k) => {
          if (matchOverrides[k]?.status === 'live') removeMatchOverride(k);
        });
      }

      if (data.match) {
        setBroadcastMessage(null); // clear excuse when match starts
        setMatchOverride(data.match.matchId, {
          status: data.match.status,
          scoreA: data.match.scoreA,
          scoreB: data.match.scoreB,
          minute: data.match.minute,
        });
      }
    };

    channel.addEventListener('message', handler);
    setSynced(true);
    console.log('[match-sync] Listening on BroadcastChannel');

    return () => {
      channel.removeEventListener('message', handler);
      channel.close();
    };
  }, [matchOverrides]); // eslint-disable-line react-hooks/exhaustive-deps

  // Admin: send match state to all tabs
  const broadcastMatch = useCallback(
    (data: MatchState) => {
      const channel = getChannel();
      if (channel) {
        channel.postMessage({ type: 'match-set', match: data } as SyncMessage);
      }
      // Also update local store
      setMatchOverride(data.matchId, {
        status: data.status,
        scoreA: data.scoreA,
        scoreB: data.scoreB,
        minute: data.minute,
      });
    },
    [setMatchOverride]
  );

  // Admin: send score update
  const broadcastScore = useCallback(
    (matchId: string, scoreA: number, scoreB: number, minute: number) => {
      const channel = getChannel();
      if (channel) {
        channel.postMessage({
          type: 'score-update',
          match: { matchId, status: 'live' as const, scoreA, scoreB, minute },
        } as SyncMessage);
      }
      setMatchOverride(matchId, { scoreA, scoreB, minute });
    },
    [setMatchOverride]
  );

  // Admin: end broadcast
  const endBroadcast = useCallback(
    (message?: string) => {
      const msg = message || 'Broadcast has ended. Thanks for watching!';
      const channel = getChannel();
      if (channel) {
        channel.postMessage({ type: 'broadcast-ended', message: msg } as SyncMessage);
      }
      setBroadcastMessage(msg);
    },
    []
  );

  return {
    synced,
    broadcastMessage,
    broadcastMatch,
    broadcastScore,
    endBroadcast,
    clearBroadcastMessage: () => setBroadcastMessage(null),
  };
}