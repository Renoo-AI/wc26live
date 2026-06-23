'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function MatchSkeleton() {
  return (
    <div className="rounded-2xl border border-[#F0EBE5] dark:border-[rgba(250,245,240,0.08)] bg-white dark:bg-[#292524] p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-10 rounded-md bg-[#EDE8E2] dark:bg-[#3D3632]" />
        <div className="w-px h-8 bg-[#F0EBE5] dark:bg-[rgba(250,245,240,0.08)]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-md bg-[#EDE8E2] dark:bg-[#3D3632]" />
          <Skeleton className="h-4 w-2/3 rounded-md bg-[#EDE8E2] dark:bg-[#3D3632]" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full bg-[#EDE8E2] dark:bg-[#3D3632]" />
      </div>
    </div>
  );
}

export function MatchSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <MatchSkeleton key={i} />
      ))}
    </div>
  );
}