'use client';

import { cn } from '@/lib/utils';

interface BroadcasterBadgeProps {
  type: 'free' | 'cable' | 'geo_blocked';
  className?: string;
}

const badgeConfig = {
  free: {
    label: '🆓 Free',
    className: 'bg-[rgba(45,139,94,0.08)] text-[#2D8B5E] border-[rgba(45,139,94,0.2)] dark:text-[#4ADE80] dark:border-[rgba(74,222,128,0.2)] dark:bg-[rgba(74,222,128,0.08)]',
  },
  cable: {
    label: '📺 Cable',
    className: 'bg-[#EDE8E2] text-[#6B5F57] border-[#E8E1DA] dark:bg-[#3D3632] dark:text-[#A89E96] dark:border-[rgba(250,245,240,0.08)]',
  },
  geo_blocked: {
    label: '🔒 Geo-blocked',
    className: 'bg-[rgba(217,72,72,0.08)] text-[#D94848] border-[rgba(217,72,72,0.2)] dark:text-[#F87171] dark:border-[rgba(248,113,113,0.2)] dark:bg-[rgba(248,113,113,0.08)]',
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