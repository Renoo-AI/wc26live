import { Match, Stage, MatchOverride } from './types';
import { teams } from './teams';

const t = teams;

// CET = UTC+2 (June = CEST). Convert CET → UTC by subtracting 2 hours.
const matches: Match[] = [
  // June 24
  {
    id: 'match_1', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 1,
    date: '2026-06-24T18:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.QAT, teamB: t.BIH, status: 'upcoming',
  },
  {
    id: 'match_2', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 2,
    date: '2026-06-24T21:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.MAR, teamB: t.HAI, status: 'upcoming',
  },
  {
    id: 'match_3', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 3,
    date: '2026-06-24T21:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.BRA, teamB: t.SCO, status: 'upcoming',
  },
  // June 25
  {
    id: 'match_4', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 4,
    date: '2026-06-25T19:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.GER, teamB: t.ECU, status: 'upcoming',
  },
  // June 26
  {
    id: 'match_5', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 5,
    date: '2026-06-25T22:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.TUN, teamB: t.NED, status: 'upcoming',
  },
  {
    id: 'match_6', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 6,
    date: '2026-06-26T18:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.IRQ, teamB: t.SEN, status: 'upcoming',
  },
  {
    id: 'match_7', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 7,
    date: '2026-06-26T18:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.FRA, teamB: t.NOR, status: 'upcoming',
  },
  // June 27
  {
    id: 'match_8', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 8,
    date: '2026-06-26T23:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.KSA, teamB: t.CPV, status: 'upcoming',
  },
  {
    id: 'match_9', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 9,
    date: '2026-06-26T23:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.ESP, teamB: t.URU, status: 'upcoming',
  },
  {
    id: 'match_10', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 10,
    date: '2026-06-27T02:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.EGY, teamB: t.IRN, status: 'upcoming',
  },
  // June 28
  {
    id: 'match_11', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 11,
    date: '2026-06-27T22:30:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.POR, teamB: t.COL, status: 'upcoming',
  },
  {
    id: 'match_12', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 12,
    date: '2026-06-28T01:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.ARG, teamB: t.JOR, status: 'upcoming',
  },
  {
    id: 'match_13', stage: 'round_of_16', roundLabel: 'Round of 16', matchNumber: 13,
    date: '2026-06-28T01:00:00Z', venue: 'Stadium', city: 'TBD',
    teamA: t.ALG, teamB: t.AUT, status: 'upcoming',
  },
];

export const allMatches: Match[] = matches;

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
  return allMatches.map(applyOverrides).filter((m) => m.date.slice(0, 10) === dateStr);
}

export function getMatchesByStage(stage: Stage): Match[] {
  return allMatches.map(applyOverrides).filter((m) => m.stage === stage);
}

export function getMatchById(id: string): Match | undefined {
  const m = allMatches.find((m) => m.id === id);
  return m ? applyOverrides(m) : undefined;
}

export function getGroupMatches(group: string): Match[] {
  return allMatches.map(applyOverrides).filter((m) => m.group === group);
}

export function getUpcomingMatches(): Match[] {
  const now = new Date();
  return allMatches
    .map(applyOverrides)
    .filter((m) => new Date(m.date) > now && m.status !== 'live')
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getLiveMatches(): Match[] {
  return allMatches.map(applyOverrides).filter((m) => m.status === 'live');
}

export function getAllMatchDates(): string[] {
  const dates = new Set(allMatches.map((m) => m.date.slice(0, 10)));
  return Array.from(dates).sort();
}

export function getAllMatchesWithOverrides(): Match[] {
  return allMatches.map(applyOverrides);
}

export function getRoundOf16Matches(): Match[] { return getMatchesByStage('round_of_16'); }
export function getQuarterFinalMatches(): Match[] { return getMatchesByStage('quarter_final'); }
export function getSemiFinalMatches(): Match[] { return getMatchesByStage('semi_final'); }
export function getThirdPlaceMatch(): Match | undefined { return allMatches.find(m => m.stage === 'third_place'); }
export function getFinalMatch(): Match | undefined { return allMatches.find(m => m.stage === 'final'); }