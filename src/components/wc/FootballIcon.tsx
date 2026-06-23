'use client';

import { cn } from '@/lib/utils';

interface FootballIconProps {
  size?: number;
  className?: string;
}

export function FootballIcon({ size = 24, className }: FootballIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('drop-shadow-[0_0_8px_#00E676]', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="football-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="100%" stopColor="#00C853" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer circle */}
      <circle cx="32" cy="32" r="30" fill="url(#football-grad)" filter="url(#glow)" />
      {/* Pentagon pattern - simplified classic football design */}
      <polygon points="32,8 40,20 36,34 28,34 24,20" fill="#0A0E1A" opacity="0.9" />
      <polygon points="12,40 24,34 28,46 20,52" fill="#0A0E1A" opacity="0.9" />
      <polygon points="52,40 40,34 36,46 44,52" fill="#0A0E1A" opacity="0.9" />
      <polygon points="32,52 28,46 32,38 36,46" fill="#0A0E1A" opacity="0.85" />
      <polygon points="8,24 24,20 20,32 8,28" fill="#0A0E1A" opacity="0.85" />
      <polygon points="56,24 40,20 44,32 56,28" fill="#0A0E1A" opacity="0.85" />
      {/* Seam lines */}
      <line x1="32" y1="8" x2="24" y2="20" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="32" y1="8" x2="40" y2="20" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="24" y1="20" x2="28" y2="34" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="40" y1="20" x2="36" y2="34" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="28" y1="34" x2="24" y2="34" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="24" y1="34" x2="20" y2="52" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="36" y1="34" x2="44" y2="52" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="20" y1="52" x2="32" y2="52" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="32" y1="52" x2="44" y2="52" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="24" y1="20" x2="8" y2="24" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
      <line x1="40" y1="20" x2="56" y2="24" stroke="#0A0E1A" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}