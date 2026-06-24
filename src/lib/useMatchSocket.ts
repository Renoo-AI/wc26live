'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppStore } from '@/store/settings';

// Try WebSocket first, fall back to local store if unavailable
const WS_URL = process.env.NEXT_PUBLIC_MATCH_WS_URL || '';

interface MatchState {
  matchId: string;
  status: 'upcoming' | 'live' | 'finished';
  scoreA: number;
  scoreB: number;
  minute: number;
  updatedAt: string;
}

interface MatchStatePayload {
  match: MatchState | null;
  broadcastMessage: string | null;
}

export function useMatchSocket() {
  const { matchOverrides, setMatchOverride, removeMatchOverride } = useAppStore();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);

  // Connect
  useEffect(() => {
    if (!WS_URL) {
      console.log('[match-socket] No WS_URL, using local-only mode');
      return;
    }

    const socket = io(WS_URL, {
      path: '/match-socket',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[match-socket] Connected:', socket.id);
      setConnected(true);
    });

    socket.on('match-state', (payload: MatchStatePayload) => {
      console.log('[match-socket] State received:', payload);

      setBroadcastMessage(payload.broadcastMessage);

      if (payload.match) {
        const m = payload.match;
        setMatchOverride(m.matchId, {
          status: m.status,
          scoreA: m.scoreA,
          scoreB: m.scoreB,
          minute: m.minute,
        });
      }

      // If broadcast ended, clear all live matches
      if (payload.broadcastMessage && !payload.match) {
        // Find and clear any live match
        const liveKeys = Object.keys(matchOverrides).filter(
          (k) => matchOverrides[k]?.status === 'live'
        );
        liveKeys.forEach((k) => removeMatchOverride(k));
      }
    });

    socket.on('disconnect', () => {
      console.log('[match-socket] Disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('[match-socket] Connection error:', err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Admin: send match state
  const broadcastMatch = useCallback(
    (data: MatchState) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('admin:set-match', data);
      }
      // Also update local store as fallback
      setMatchOverride(data.matchId, {
        status: data.status,
        scoreA: data.scoreA,
        scoreB: data.scoreB,
        minute: data.minute,
      });
    },
    [setMatchOverride]
  );

  // Admin: update score/minute
  const broadcastScore = useCallback(
    (matchId: string, scoreA: number, scoreB: number, minute: number) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('admin:update-score', { matchId, scoreA, scoreB, minute });
      }
      setMatchOverride(matchId, { scoreA, scoreB, minute });
    },
    [setMatchOverride]
  );

  // Admin: end broadcast
  const endBroadcast = useCallback(
    (message?: string) => {
      const msg = message || 'Broadcast has ended. Thanks for watching!';
      if (socketRef.current?.connected) {
        socketRef.current.emit('admin:end-broadcast', { message: msg });
      }
      setBroadcastMessage(msg);
    },
    []
  );

  return {
    connected,
    broadcastMessage,
    broadcastMatch,
    broadcastScore,
    endBroadcast,
    clearBroadcastMessage: () => setBroadcastMessage(null),
  };
}