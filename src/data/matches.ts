import { Match, Stage, MatchOverride } from './types';
import { teams } from './teams';

const t = teams;

// Group stage: 12 groups × 6 matches = 72
// Matchday 1: A1vA2, A3vA4 for each group
// Matchday 2: A1vA3, A2vA4 for each group
// Matchday 3: A1vA4, A2vA3 for each group

const groups: { group: string; teams: [string, string, string, string] }[] = [
  { group: 'A', teams: ['USA', 'EGY', 'SRB', 'WAL'] },
  { group: 'B', teams: ['MEX', 'GRE', 'POL', 'CMR'] },
  { group: 'C', teams: ['BRA', 'JPN', 'UKR', 'CIV'] },
  { group: 'D', teams: ['ARG', 'GER', 'TUR', 'ALG'] },
  { group: 'E', teams: ['POR', 'URU', 'AUS', 'TUN'] },
  { group: 'F', teams: ['NED', 'COL', 'IRN', 'GHA'] },
  { group: 'G', teams: ['BEL', 'ECU', 'KSA', 'RSA'] },
  { group: 'H', teams: ['CRO', 'QAT', 'CHI', 'COD'] },
  { group: 'I', teams: ['ITA', 'PER', 'UAE', 'MLI'] },
  { group: 'J', teams: ['SUI', 'SEN', 'HUN', 'ZAM'] },
  { group: 'K', teams: ['DEN', 'MAR', 'SWE', 'SVN'] },
  { group: 'L', teams: ['AUT', 'BOL', 'CZE', 'NGA'] },
];

const venues: Record<string, { venue: string; city: string }> = {
  A1: { venue: 'SoFi Stadium', city: 'Los Angeles' },
  A2: { venue: 'MetLife Stadium', city: 'New York' },
  A3: { venue: 'AT&T Stadium', city: 'Dallas' },
  B1: { venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  B2: { venue: 'Hard Rock Stadium', city: 'Miami' },
  B3: { venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  C1: { venue: 'Lumen Field', city: 'Seattle' },
  C2: { venue: 'Gillette Stadium', city: 'Boston' },
  C3: { venue: 'NRG Stadium', city: 'Houston' },
  D1: { venue: 'Arrowhead Stadium', city: 'Kansas City' },
  D2: { venue: 'Levi\'s Stadium', city: 'San Francisco' },
  D3: { venue: 'Soldier Field', city: 'Chicago' },
  E1: { venue: 'Rose Bowl', city: 'Pasadena' },
  E2: { venue: 'State Farm Stadium', city: 'Phoenix' },
  F1: { venue: 'Estadio Azteca', city: 'Mexico City' },
  F2: { venue: 'Estadio BBVA', city: 'Monterrey' },
  G1: { venue: 'BC Place', city: 'Vancouver' },
  G2: { venue: 'Estadio Akron', city: 'Guadalajara' },
  H1: { venue: 'BMO Field', city: 'Toronto' },
  H2: { venue: 'Allegiant Stadium', city: 'Las Vegas' },
};

// Group stage start dates (matchdays spaced ~4 days apart)
const groupDates: string[][] = [
  // Matchday 1: June 11-13
  ['2026-06-11T18:00:00Z', '2026-06-11T21:00:00Z', '2026-06-12T15:00:00Z', '2026-06-12T18:00:00Z',
   '2026-06-12T21:00:00Z', '2026-06-13T15:00:00Z', '2026-06-13T18:00:00Z', '2026-06-13T21:00:00Z',
   '2026-06-14T01:00:00Z', '2026-06-14T02:00:00Z', '2026-06-14T03:00:00Z', '2026-06-14T03:30:00Z'],
  // Matchday 2: June 15-17
  ['2026-06-15T15:00:00Z', '2026-06-15T18:00:00Z', '2026-06-15T21:00:00Z', '2026-06-16T15:00:00Z',
   '2026-06-16T18:00:00Z', '2026-06-16T21:00:00Z', '2026-06-17T01:00:00Z', '2026-06-17T02:00:00Z',
   '2026-06-17T03:00:00Z', '2026-06-17T03:30:00Z', '2026-06-18T01:00:00Z', '2026-06-18T02:00:00Z'],
  // Matchday 3: June 19-21
  ['2026-06-19T18:00:00Z', '2026-06-19T21:00:00Z', '2026-06-20T15:00:00Z', '2026-06-20T18:00:00Z',
   '2026-06-20T21:00:00Z', '2026-06-21T15:00:00Z', '2026-06-21T18:00:00Z', '2026-06-21T21:00:00Z',
   '2026-06-22T01:00:00Z', '2026-06-22T02:00:00Z', '2026-06-22T03:00:00Z', '2026-06-22T03:30:00Z'],
];

const venueKeys = Object.keys(venues);

let matchNum = 1;
const matches: Match[] = [];

// Generate group stage matches
groups.forEach((g, gi) => {
  const [a1, a2, a3, a4] = g.teams;
  const vk = (i: number) => venueKeys[(gi * 3 + i) % venueKeys.length];

  // Matchday 1: 1v2, 3v4
  matches.push({
    id: `g${g.group}1`, stage: 'group', group: g.group, matchNumber: matchNum++,
    date: groupDates[0][gi], ...venues[vk(0)],
    teamA: t[a1], teamB: t[a2], status: 'upcoming',
  });
  matches.push({
    id: `g${g.group}2`, stage: 'group', group: g.group, matchNumber: matchNum++,
    date: groupDates[0][(gi + 1) % 12], ...venues[vk(1)],
    teamA: t[a3], teamB: t[a4], status: 'upcoming',
  });

  // Matchday 2: 1v3, 2v4
  matches.push({
    id: `g${g.group}3`, stage: 'group', group: g.group, matchNumber: matchNum++,
    date: groupDates[1][gi], ...venues[vk(2)],
    teamA: t[a1], teamB: t[a3], status: 'upcoming',
  });
  matches.push({
    id: `g${g.group}4`, stage: 'group', group: g.group, matchNumber: matchNum++,
    date: groupDates[1][(gi + 3) % 12], ...venues[vk(0)],
    teamA: t[a2], teamB: t[a4], status: 'upcoming',
  });

  // Matchday 3: 1v4, 2v3
  matches.push({
    id: `g${g.group}5`, stage: 'group', group: g.group, matchNumber: matchNum++,
    date: groupDates[2][gi], ...venues[vk(1)],
    teamA: t[a1], teamB: t[a4], status: 'upcoming',
  });
  matches.push({
    id: `g${g.group}6`, stage: 'group', group: g.group, matchNumber: matchNum++,
    date: groupDates[2][(gi + 5) % 12], ...venues[vk(2)],
    teamA: t[a2], teamB: t[a3], status: 'upcoming',
  });
});

// Helper for knockout TBD
const tbd: null = null;

// Knockout stage matches (TBD teams)
const knockoutStages: { stage: Stage; label: string; count: number; startDate: string; venueIdx: number }[] = [
  { stage: 'round_of_16', label: 'Round of 16', count: 16, startDate: '2026-06-27T18:00:00Z', venueIdx: 0 },
  { stage: 'quarter_final', label: 'Quarter Final', count: 8, startDate: '2026-07-04T18:00:00Z', venueIdx: 6 },
  { stage: 'semi_final', label: 'Semi Final', count: 4, startDate: '2026-07-09T21:00:00Z', venueIdx: 10 },
  { stage: 'third_place', label: 'Third Place', count: 1, startDate: '2026-07-17T18:00:00Z', venueIdx: 14 },
  { stage: 'final', label: 'Final', count: 1, startDate: '2026-07-19T20:00:00Z', venueIdx: 18 },
];

knockoutStages.forEach((ks) => {
  for (let i = 0; i < ks.count; i++) {
    const hoursOffset = i * 3;
    const d = new Date(ks.startDate);
    d.setHours(d.getHours() + hoursOffset);
    const vk = venueKeys[(ks.venueIdx + i) % venueKeys.length];

    matches.push({
      id: `${ks.stage}_${i + 1}`,
      stage: ks.stage,
      roundLabel: ks.label,
      matchNumber: matchNum++,
      date: d.toISOString(),
      ...venues[vk],
      teamA: tbd,
      teamB: tbd,
      status: 'upcoming',
    });
  }
});

export const allMatches: Match[] = matches;

// Global overrides reference — set via setGlobalOverrides() from the store
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
  return allMatches.map(applyOverrides).filter((m) => new Date(m.date) > now && m.status !== 'live').sort((a, b) => a.date.localeCompare(b.date));
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