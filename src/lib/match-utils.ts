import { format, parseISO, formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { Match, BroadcasterInfo } from '@/data/types';
import { getBroadcasterForCountry, defaultBroadcaster } from '@/data/broadcasters';

export function formatMatchTime(
  isoDate: string,
  timeFormat: '12h' | '24h',
  timeZone?: string
): string {
  const date = parseISO(isoDate);
  const fmt = timeFormat === '12h' ? 'h:mm a' : 'HH:mm';
  if (timeZone) {
    return format(date, fmt, { timeZone });
  }
  return format(date, fmt);
}

export function formatMatchDate(isoDate: string, timeZone?: string): string {
  const date = parseISO(isoDate);
  if (timeZone) {
    return format(date, 'MMM d, yyyy', { timeZone });
  }
  return format(date, 'MMM d, yyyy');
}

export function getStageLabel(stage: string, group?: string): string {
  if (stage === 'group' && group) return `Group ${group}`;
  if (stage === 'round_of_16') return 'Round of 16';
  if (stage === 'quarter_final') return 'Quarter Final';
  if (stage === 'semi_final') return 'Semi Final';
  if (stage === 'third_place') return 'Third Place';
  if (stage === 'final') return 'Final';
  return stage;
}

export function getTimeUntilMatch(isoDate: string): string {
  const now = new Date();
  const matchDate = parseISO(isoDate);
  return formatDistanceToNow(matchDate, { addSuffix: true });
}

export function getMinutesUntilMatch(isoDate: string): number {
  return differenceInMinutes(parseISO(isoDate), new Date());
}

export function isMatchLive(match: Match): boolean {
  return match.status === 'live';
}

export function isMatchFinished(match: Match): boolean {
  return match.status === 'finished';
}

export function getBroadcasterForMatch(
  _match: Match,
  countryCode: string
): { broadcaster: BroadcasterInfo[]; country: typeof defaultBroadcaster } {
  const country = getBroadcasterForCountry(countryCode) || defaultBroadcaster;
  return {
    broadcaster: country.broadcasters,
    country,
  };
}

export function generateGoogleCalendarUrl(match: Match): string {
  if (!match.teamA || !match.teamB) return '';
  const startDate = match.date.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const endDate = new Date(new Date(match.date).getTime() + 2 * 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
  const title = `${match.teamA.name} vs ${match.teamB.name} – World Cup 2026`;
  const details = `Watch the FIFA World Cup 2026 match: ${match.teamA.name} vs ${match.teamB.name}\nVenue: ${match.venue}, ${match.city}\n\nFind free legal streams at Wc26Live`;
  const location = `${match.venue}, ${match.city}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}

export function getMatchStatusBadge(match: Match): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (match.status === 'live') {
    return { label: 'LIVE', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  }
  if (match.status === 'finished') {
    return { label: 'FT', color: 'text-zinc-400', bgColor: 'bg-zinc-500/20' };
  }
  return { label: '', color: '', bgColor: '' };
}