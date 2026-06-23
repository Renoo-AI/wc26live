'use client';

import { cn } from '@/lib/utils';
import type { Team } from '@/data/types';

interface TeamRowProps {
  team: Team | null;
  score?: number;
  align?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { flag: 'text-base', name: 'text-xs', score: 'text-sm font-bold', gap: 'gap-1.5' },
  md: { flag: 'text-2xl', name: 'text-sm', score: 'text-base font-bold', gap: 'gap-2' },
  lg: { flag: 'text-4xl', name: 'text-base', score: 'text-xl font-bold', gap: 'gap-3' },
};

export function TeamRow({ team, score, align = 'left', size = 'sm' }: TeamRowProps) {
  const cfg = sizeConfig[size];

  return (
    <div
      className={cn(
        'flex items-center min-w-0',
        cfg.gap,
        align === 'right' && 'flex-row-reverse text-right'
      )}
    >
      <span className={cn('shrink-0', cfg.flag)} aria-label={team?.name || 'TBD'}>
        {team?.flag || '🏳️'}
      </span>
      <span className={cn('truncate', cfg.name, team ? 'text-[#1A1614] dark:text-[#FAF5F0]' : 'text-[#B5ADA7] dark:text-[#7D7570]')}>
        {team?.name || 'TBD'}
      </span>
      {score !== undefined && (
        <span className={cn('shrink-0 tabular-nums', cfg.score, 'text-[#1A1614] dark:text-[#FAF5F0]')}>
          {score}
        </span>
      )}
    </div>
  );
}