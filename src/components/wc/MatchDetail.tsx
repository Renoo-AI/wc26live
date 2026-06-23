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
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
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
                    ? 'bg-[#00E676]/5 border-[#00E676]/20'
                    : b.type === 'cable'
                    ? 'bg-white/5 border-white/10'
                    : 'bg-[#FF3B3B]/5 border-[#FF3B3B]/20'
                )}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-white truncate">{b.name}</span>
                  {b.note && (
                    <span className="text-[11px] text-white/40 truncate">{b.note}</span>
                  )}
                </div>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors min-h-[36px]',
                    b.type === 'free'
                      ? 'bg-[#00E676]/20 text-[#00E676] hover:bg-[#00E676]/30'
                      : b.type === 'cable'
                      ? 'bg-white/10 text-white/60 hover:bg-white/15'
                      : 'bg-[#FF3B3B]/20 text-[#FF3B3B] hover:bg-[#FF3B3B]/30'
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
            <Globe className="size-8 text-white/20" />
            <p className="text-sm text-white/40">No free stream in your region</p>
            <p className="text-xs text-white/30 max-w-[260px]">
              Free legal streams may not be available in {country.countryName}. Check with local
              broadcasters or consider using a legal streaming service.
            </p>
            <a
              href="https://www.fifa.com/fifaplus/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#FFD700] hover:underline mt-1"
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
            className="flex-1 inline-flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/80 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors min-h-[44px]"
          >
            <CalendarPlus className="size-4" />
            Add to Calendar
          </a>
        )}
      </div>

      {/* Venue info */}
      <div className="flex flex-col gap-1.5 text-xs text-white/40">
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