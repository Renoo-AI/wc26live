import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  path: '/match-socket',
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ── Match state (in-memory, single source of truth) ────────────────

interface MatchState {
  matchId: string;
  status: 'upcoming' | 'live' | 'finished';
  scoreA: number;
  scoreB: number;
  minute: number;
  updatedAt: string;
}

let currentMatch: MatchState | null = null;
let broadcastMessage: string | null = null; // "excuse" when admin ends broadcast

// ── Socket events ──────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`[match-server] Client connected: ${socket.id}`);

  // Send current state immediately on connect
  socket.emit('match-state', {
    match: currentMatch,
    broadcastMessage,
  });

  // Admin: start/update a match
  socket.on('admin:set-match', (data: MatchState) => {
    currentMatch = { ...data, updatedAt: new Date().toISOString() };
    broadcastMessage = null; // clear any previous excuse
    console.log(`[match-server] Match set: ${data.matchId} status=${data.status}`);
    io.emit('match-state', { match: currentMatch, broadcastMessage: null });
  });

  // Admin: end broadcast (stops live, shows excuse)
  socket.on('admin:end-broadcast', (data: { message: string }) => {
    broadcastMessage = data.message || 'Broadcast has ended. Thanks for watching!';
    currentMatch = null;
    console.log('[match-server] Broadcast ended:', broadcastMessage);
    io.emit('match-state', { match: null, broadcastMessage });
  });

  // Admin: update score/minute only
  socket.on('admin:update-score', (data: { matchId: string; scoreA: number; scoreB: number; minute: number }) => {
    if (currentMatch && currentMatch.matchId === data.matchId) {
      currentMatch.scoreA = data.scoreA;
      currentMatch.scoreB = data.scoreB;
      currentMatch.minute = data.minute;
      currentMatch.updatedAt = new Date().toISOString();
      io.emit('match-state', { match: currentMatch, broadcastMessage });
    }
  });

  // Ping for health checks
  socket.on('ping', () => {
    socket.emit('pong', { time: new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    console.log(`[match-server] Client disconnected: ${socket.id}`);
  });
});

const PORT = parseInt(process.env.MATCH_SERVER_PORT || '3005', 10);
httpServer.listen(PORT, () => {
  console.log(`[match-server] WebSocket running on port ${PORT}`);
});

process.on('SIGTERM', () => { httpServer.close(() => process.exit(0)); });
process.on('SIGINT', () => { httpServer.close(() => process.exit(0)); });