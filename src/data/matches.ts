import { Match, Stage, MatchOverride } from './types';
import { teams } from './teams';

const t = teams;

// All times in CET (UTC+2 in June). Converted to UTC ISO.
const matches: Match[] = [
  // ── June 24 ──────────────────────────────────────────────
  {
    id: 'match_qat_bih', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 1,
    date: '2026-06-24T18:00:00Z',   // 20:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.QAT, teamB: t.BIH, status: 'upcoming',
  },
  {
    id: 'match_mar_hai', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 2,
    date: '2026-06-24T21:00:00Z',   // 23:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.MAR, teamB: t.HAI, status: 'upcoming',
  },
  {
    id: 'match_bra_sco', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 3,
    date: '2026-06-24T21:00:00Z',   // 23:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.BRA, teamB: t.SCO, status: 'upcoming',
  },

  // ── June 25 ──────────────────────────────────────────────
  {
    id: 'match_ger_ecu', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 4,
    date: '2026-06-25T19:00:00Z',   // 21:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.GER, teamB: t.ECU, status: 'upcoming',
  },

  // ── June 26 ──────────────────────────────────────────────
  {
    id: 'match_tun_ned', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 5,
    date: '2026-06-25T22:00:00Z',   // 00:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.TUN, teamB: t.NED, status: 'upcoming',
  },
  {
    id: 'match_irq_sen', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 6,
    date: '2026-06-26T18:00:00Z',   // 20:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.IRQ, teamB: t.SEN, status: 'upcoming',
  },
  {
    id: 'match_fra_nor', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 7,
    date: '2026-06-26T18:00:00Z',   // 20:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.FRA, teamB: t.NOR, status: 'upcoming',
  },

  // ── June 27 ──────────────────────────────────────────────
  {
    id: 'match_ksa_cpv', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 8,
    date: '2026-06-26T23:00:00Z',   // 01:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.KSA, teamB: t.CPV, status: 'upcoming',
  },
  {
    id: 'match_esp_uru', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 9,
    date: '2026-06-26T23:00:00Z',   // 01:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.ESP, teamB: t.URU, status: 'upcoming',
  },
  {
    id: 'match_egy_irn', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 10,
    date: '2026-06-27T02:00:00Z',   // 04:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.EGY, teamB: t.IRN, status: 'upcoming',
  },

  // ── June 28 ──────────────────────────────────────────────
  {
    id: 'match_por_col', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 11,
    date: '2026-06-27T22:30:00Z',   // 00:30 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.POR, teamB: t.COL, status: 'upcoming',
  },
  {
    id: 'match_arg_jor', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 12,
    date: '2026-06-28T01:00:00Z',   // 03:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.ARG, teamB: t.JOR, status: 'upcoming',
  },
  {
    id: 'match_alg_aut', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 13,
    date: '2026-06-28T01:00:00Z',   // 03:00 CET
    venue: 'Stadium', city: 'TBD',
    teamA: t.ALG, teamB: t.AUT, status: 'upcoming',
  },
];

export const allMatches: Match[] = matches;

// ── Custom matches (set from outside) ─────────────────────────────
let globalCustomMatches: Match[] = [];

export function setGlobalCustomMatches(custom: Match[]) {
  globalCustomMatches = custom || [];
}

export function getAllMatches(): Match[] {
  return [...allMatches, ...globalCustomMatches];
}

// ── Global overrides ──────────────────────────────────────────────
let globalOverrides: Record<string, MatchOverride> = {};

export function setGlobalOverrides(overrides: Record<string, MatchOverride>) {
  globalOverrides = overrides || {};
}

function applyOverrides(match: Match): Match {
  const override = globalOverrides[match.id];
  if (!override) return match;
  return {
    ...match,
    status: override.status ?? match.status,
    scoreA: override.scoreA ?? match.scoreA,
    scoreB: override.scoreB ?? match.scoreB,
    minute: override.minute ?? match.minute,
  };
}

// ── Queries ───────────────────────────────────────────────────────
export function getMatchesByDate(dateStr: string): Match[] {
  return getAllMatches().map(applyOverrides).filter((m) => m.date.slice(0, 10) === dateStr);
}

export function getMatchesByStage(stage: Stage): Match[] {
  return getAllMatches().map(applyOverrides).filter((m) => m.stage === stage);
}

export function getMatchById(id: string): Match | undefined {
  const m = getAllMatches().find((m) => m.id === id);
  return m ? applyOverrides(m) : undefined;
}

export function getGroupMatches(group: string): Match[] {
  return getAllMatches().map(applyOverrides).filter((m) => m.group === group);
}

export function getUpcomingMatches(): Match[] {
  const now = new Date();
  return getAllMatches()
    .map(applyOverrides)
    .filter((m) => new Date(m.date) > now && m.status !== 'live')
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getLiveMatches(): Match[] {
  return getAllMatches().map(applyOverrides).filter((m) => m.status === 'live');
}

export function getAllMatchDates(): string[] {
  const dates = new Set(getAllMatches().map((m) => m.date.slice(0, 10)));
  return Array.from(dates).sort();
}

export function getAllMatchesWithOverrides(): Match[] {
  return getAllMatches().map(applyOverrides);
}

export function getRoundOf16Matches(): Match[] { return getMatchesByStage('round_of_16'); }
export function getQuarterFinalMatches(): Match[] { return getMatchesByStage('quarter_final'); }
export function getSemiFinalMatches(): Match[] { return getMatchesByStage('semi_final'); }
export function getThirdPlaceMatch(): Match | undefined { return getAllMatches().find(m => m.stage === 'third_place'); }
export function getFinalMatch(): Match | undefined { return getAllMatches().find(m => m.stage === 'final'); }