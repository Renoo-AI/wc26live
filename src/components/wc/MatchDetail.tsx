'use client';

import { Play, CalendarPlus, MapPin, Clock, Globe } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { getBroadcasterForMatch, generateGoogleCalendarUrl, formatMatchTime } from '@/lib/match-utils';
import type { Match } from '@/data/types';

interface MatchDetailProps {
  match: Match;
}

export function MatchDetail({ match }: MatchDetailProps) {
  const { settings } = useAppStore();
  const { broadcaster, country } = getBroadcasterForMatch(match, settings.countryCode);
  const freeBroadcaster = broadcaster.find((b) => b.type === 'free');
  const calendarUrl = generateGoogleCalendarUrl(match);
  const matchDate = parseISO(match.date);

  return (
    <div className="px-4 py-4 flex flex-col gap-4">
      {/* Broadcasters */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-[#9C908A] dark:text-[#7D7570] uppercase tracking-wider">
          Where to Watch ({country.flag} {country.countryName})
        </span>
        {broadcaster.length > 0 ? (
          <div className="flex flex-col gap-2">
            {broadcaster.map((b, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 border',
                  b.type === 'free'
                    ? 'bg-[rgba(45,139,94,0.08)] border-[rgba(45,139,94,0.2)]'
                    : b.type === 'cable'
                    ? 'bg-[#FAF8F5] dark:bg-[#3D3632] border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)]'
                    : 'bg-[rgba(217,72,72,0.08)] border-[rgba(217,72,72,0.2)]'
                )}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-[#1A1614] dark:text-[#FAF5F0] truncate">{b.name}</span>
                  {b.note && (
                    <span className="text-[11px] text-[#9C908A] dark:text-[#7D7570] truncate">{b.note}</span>
                  )}
                </div>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px]',
                    b.type === 'free'
                      ? 'bg-[#D97757] text-white hover:bg-[#C66A4A]'
                      : b.type === 'cable'
                      ? 'bg-[#EDE8E2] dark:bg-[#3D3632] text-[#3D3530] dark:text-[#A89E96] hover:bg-[#E8E1DA] dark:hover:bg-[rgba(250,245,240,0.1)]'
                      : 'bg-[rgba(217,72,72,0.08)] text-[#D94848] hover:bg-[rgba(217,72,72,0.15)]'
                  )}
                >
                  <Play className="size-3" />
                  {b.type === 'free' ? 'Watch Free' : b.type === 'cable' ? 'Watch' : 'Details'}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <Globe className="size-8 text-[#B5ADA7] dark:text-[#7D7570]" />
            <p className="text-sm text-[#9C908A] dark:text-[#7D7570]">No free stream in your region</p>
            <p className="text-xs text-[#B5ADA7] dark:text-[#7D7570] max-w-[260px]">
              Free legal streams may not be available in {country.countryName}. Check with local
              broadcasters or consider using a legal streaming service.
            </p>
            <a
              href="https://www.fifa.com/fifaplus/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#C4953A] hover:underline mt-1"
            >
              Try FIFA+ <Play className="size-3" />
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {calendarUrl && (
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#EDE8E2] dark:bg-[#3D3632] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] text-[#3D3530] dark:text-[#A89E96] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[#E8E1DA] dark:hover:bg-[rgba(250,245,240,0.1)] transition-colors min-h-[44px]"
          >
            <CalendarPlus className="size-4" />
            Add to Calendar
          </a>
        )}
      </div>

      {/* Venue info */}
      <div className="flex flex-col gap-1.5 text-xs text-[#9C908A] dark:text-[#7D7570]">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5" />
          <span>{match.venue}, {match.city}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-3.5" />
          <span>
            {format(matchDate, 'EEE, MMM d, yyyy')} at{' '}
            {formatMatchTime(match.date, settings.timeFormat)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]">⚽</span>
          <span>Match {match.matchNumber}</span>
        </div>
      </div>
    </div>
  );
}