import { Team } from './types';

// All 48 qualified teams for FIFA World Cup 2026
// Using country code flags via flagcdn.com
export const teams: Record<string, Team> = {
  // Host nations
  USA: { code: 'USA', name: 'United States', flag: '🇺🇸', group: 'A' },
  CAN: { code: 'CAN', name: 'Canada', flag: '🇨🇦', group: 'A' },
  MEX: { code: 'MEX', name: 'Mexico', flag: '🇲🇽', group: 'B' },

  // South America (CONMEBOL)
  BRA: { code: 'BRA', name: 'Brazil', flag: '🇧🇷', group: 'C' },
  ARG: { code: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'D' },
  URU: { code: 'URU', name: 'Uruguay', flag: '🇺🇾', group: 'E' },
  COL: { code: 'COL', name: 'Colombia', flag: '🇨🇴', group: 'F' },
  ECU: { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'G' },
  CHI: { code: 'CHI', name: 'Chile', flag: '🇨🇱', group: 'H' },
  PER: { code: 'PER', name: 'Peru', flag: '🇵🇪', group: 'I' },
  PAR: { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'J' },
  VEN: { code: 'VEN', name: 'Venezuela', flag: '🇻🇪', group: 'K' },
  BOL: { code: 'BOL', name: 'Bolivia', flag: '🇧🇴', group: 'L' },

  // Europe (UEFA)
  FRA: { code: 'FRA', name: 'France', flag: '🇫🇷', group: 'A' },
  ESP: { code: 'ESP', name: 'Spain', flag: '🇪🇸', group: 'B' },
  ENG: { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'C' },
  GER: { code: 'GER', name: 'Germany', flag: '🇩🇪', group: 'D' },
  POR: { code: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'E' },
  NED: { code: 'NED', name: 'Netherlands', flag: '🇳🇱', group: 'F' },
  BEL: { code: 'BEL', name: 'Belgium', flag: '🇧🇪', group: 'G' },
  CRO: { code: 'CRO', name: 'Croatia', flag: '🇭🇷', group: 'H' },
  ITA: { code: 'ITA', name: 'Italy', flag: '🇮🇹', group: 'I' },
  SUI: { code: 'SUI', name: 'Switzerland', flag: '🇨🇭', group: 'J' },
  DEN: { code: 'DEN', name: 'Denmark', flag: '🇩🇰', group: 'K' },
  AUT: { code: 'AUT', name: 'Austria', flag: '🇦🇹', group: 'L' },
  SRB: { code: 'SRB', name: 'Serbia', flag: '🇷🇸', group: 'A' },
  POL: { code: 'POL', name: 'Poland', flag: '🇵🇱', group: 'B' },
  UKR: { code: 'UKR', name: 'Ukraine', flag: '🇺🇦', group: 'C' },
  TUR: { code: 'TUR', name: 'Turkey', flag: '🇹🇷', group: 'D' },
  ROM: { code: 'ROM', name: 'Romania', flag: '🇷🇴', group: 'E' },
  NOR: { code: 'NOR', name: 'Norway', flag: '🇳🇴', group: 'F' },
  SCO: { code: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'G' },
  SWE: { code: 'SWE', name: 'Sweden', flag: '🇸🇪', group: 'H' },
  CZE: { code: 'CZE', name: 'Czech Republic', flag: '🇨🇿', group: 'I' },
  HUN: { code: 'HUN', name: 'Hungary', flag: '🇭🇺', group: 'J' },
  SVN: { code: 'SVN', name: 'Slovenia', flag: '🇸🇮', group: 'K' },
  SVK: { code: 'SVK', name: 'Slovakia', flag: '🇸🇰', group: 'L' },
  WAL: { code: 'WAL', name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', group: 'A' },
  GRE: { code: 'GRE', name: 'Greece', flag: '🇬🇷', group: 'B' },

  // Asia (AFC)
  JPN: { code: 'JPN', name: 'Japan', flag: '🇯🇵', group: 'C' },
  KOR: { code: 'KOR', name: 'South Korea', flag: '🇰🇷', group: 'D' },
  AUS: { code: 'AUS', name: 'Australia', flag: '🇦🇺', group: 'E' },
  IRN: { code: 'IRN', name: 'Iran', flag: '🇮🇷', group: 'F' },
  KSA: { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', group: 'G' },
  QAT: { code: 'QAT', name: 'Qatar', flag: '🇶🇦', group: 'H' },
  UAE: { code: 'UAE', name: 'UAE', flag: '🇦🇪', group: 'I' },

  // Africa (CAF)
  SEN: { code: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'J' },
  MAR: { code: 'MAR', name: 'Morocco', flag: '🇲🇦', group: 'K' },
  NGA: { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', group: 'L' },
  EGY: { code: 'EGY', name: 'Egypt', flag: '🇪🇬', group: 'A' },
  CMR: { code: 'CMR', name: 'Cameroon', flag: '🇨🇲', group: 'B' },
  CIV: { code: 'CIV', name: 'Ivory Coast', flag: '🇨🇮', group: 'C' },
  ALG: { code: 'ALG', name: 'Algeria', flag: '🇩🇿', group: 'D' },
  TUN: { code: 'TUN', name: 'Tunisia', flag: '🇹🇳', group: 'E' },
  GHA: { code: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'F' },
  RSA: { code: 'RSA', name: 'South Africa', flag: '🇿🇦', group: 'G' },
  COD: { code: 'COD', name: 'DR Congo', flag: '🇨🇩', group: 'H' },
  MLI: { code: 'MLI', name: 'Mali', flag: '🇲🇱', group: 'I' },
  ZAM: { code: 'ZAM', name: 'Zambia', flag: '🇿🇲', group: 'J' },

  // Additional teams
  JOR: { code: 'JOR', name: 'Jordan', flag: '🇯🇴' },
  IRQ: { code: 'IRQ', name: 'Iraq', flag: '🇮🇶' },
  HAI: { code: 'HAI', name: 'Haiti', flag: '🇭🇹' },
  BIH: { code: 'BIH', name: 'Bosnia-Herzegovina', flag: '🇧🇦' },
  CPV: { code: 'CPV', name: 'Cape Verde', flag: '🇨🇻' },
};

export function getTeam(code: string): Team | undefined {
  return teams[code];
}

export function getFlagUrl(code: string, size: number = 40): string {
  return `https://flagcdn.com/w${size}/${code.toLowerCase().replace('eng', 'gb-eng').replace('sco', 'gb-sct').replace('wal', 'gb-wls')}.png`;
}