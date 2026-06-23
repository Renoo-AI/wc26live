'use client';

import { cn } from '@/lib/utils';

interface DisclaimerProps {
  className?: string;
}

export function Disclaimer({ className }: DisclaimerProps) {
  return (
    <p className={cn('text-[11px] text-[#B5ADA7] dark:text-[#7D7570] text-center leading-relaxed px-2', className)}>
      Wc26Live links to official broadcasters only. We do not host or stream any content.
    </p>
  );
}