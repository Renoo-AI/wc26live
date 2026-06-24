export type Stage =
  | 'group'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'third_place'
  | 'final';

export type MatchStatus = 'upcoming' | 'live' | 'finished';

export interface Team {
  code: string;
  name: string;
  flag: string;
  group?: string;
}

export interface BroadcasterInfo {
  name: string;
  url: string;
  type: 'free' | 'cable' | 'geo_blocked';
  note?: string;
  logo?: string;
}

export interface Match {
  id: string;
  stage: Stage;
  group?: string;
  roundLabel?: string;
  matchNumber: number;
  date: string;
  venue: string;
  city: string;
  teamA: Team | null;
  teamB: Team | null;
  scoreA?: number;
  scoreB?: number;
  status: MatchStatus;
  minute?: number;
}

export interface CountryBroadcaster {
  countryCode: string;
  countryName: string;
  flag: string;
  broadcasters: BroadcasterInfo[];
}

export interface UserSettings {
  countryCode: string;
  countryName: string;
  flag: string;
  timeFormat: '12h' | '24h';
  theme: 'dark' | 'light';
  notifications: {
    matchStart: boolean;
    thirtyMinBefore: boolean;
  };
}

export type TabType = 'matches' | 'bracket' | 'settings';

export interface MatchOverride {
  status?: MatchStatus;
  scoreA?: number;
  scoreB?: number;
  minute?: number;
}