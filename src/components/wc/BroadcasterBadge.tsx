'use client';

import { cn } from '@/lib/utils';

interface BroadcasterBadgeProps {
  type: 'free' | 'cable' | 'geo_blocked';
  className?: string;
}

const badgeConfig = {
  free: {
    label: '🆓 Free',
    className: 'bg-[#00E676]/15 text-[#00E676] border-[#00E676]/20',
  },
  cable: {
    label: '📺 Cable',
    className: 'bg-white/10 text-white/60 border-white/10',
  },
  geo_blocked: {
    label: '🔒 Geo-blocked',
    className: 'bg-[#FF3B3B]/15 text-[#FF3B3B] border-[#FF3B3B]/20',
  },
};

export function BroadcasterBadge({ type, className }: BroadcasterBadgeProps) {
  const config = badgeConfig[type];
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}