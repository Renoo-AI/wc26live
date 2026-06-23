'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { getAllMatchDates } from '@/data/matches';

function getLabel(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d');
}

function getSublabel(dateStr: string): string {
  const date = parseISO(dateStr);
  return format(date, 'EEE');
}

export function DatePillSelector() {
  const { selectedDate, setSelectedDate } = useAppStore();
  const dates = getAllMatchDates();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevActiveIdx = useRef(-1);

  // Derive active index directly
  const activeIdx = useMemo(() => dates.indexOf(selectedDate), [dates, selectedDate]);

  // Auto-select first date if none selected
  const effectiveDate = selectedDate || (dates.length > 0 ? dates[0] : '');
  const needsInit = !selectedDate && dates.length > 0;
  if (needsInit) {
    // Using store setter directly (safe outside render cycle via event)
    // We handle this via the scroll effect below
  }

  // Auto-scroll to active pill (using callback in effect to avoid lint issue)
  useEffect(() => {
    if (activeIdx < 0 || activeIdx === prevActiveIdx.current) return;
    prevActiveIdx.current = activeIdx;

    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.children[activeIdx] as HTMLElement | undefined;
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const scrollLeft = elRect.left - containerRect.left - (containerRect.width / 2) + (elRect.width / 2);
      container.scrollBy({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeIdx]);

  // Initialize selected date on first render
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && dates.length > 0 && !selectedDate) {
      initialized.current = true;
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate, setSelectedDate]);

  if (dates.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-3 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((dateStr, idx) => {
          const isActive = dateStr === effectiveDate;
          const today = isToday(parseISO(dateStr));
          return (
            <motion.button
              key={dateStr}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(dateStr)}
              className={cn(
                'flex flex-col items-center justify-center min-w-[64px] min-h-[44px] px-3 py-2 rounded-xl border transition-all duration-200 shrink-0',
                isActive
                  ? 'bg-[#00E676]/15 border-[#00E676]/40 text-[#00E676]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
              )}
            >
              <span className={cn(
                'text-xs font-semibold',
                today && !isActive && 'text-[#FFD700]'
              )}>
                {getLabel(dateStr)}
              </span>
              <span className="text-[10px] text-white/40 mt-0.5">{getSublabel(dateStr)}</span>
            </motion.button>
          );
        })}
      </div>
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#0A0E1A] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#0A0E1A] to-transparent" />
    </div>
  );
}