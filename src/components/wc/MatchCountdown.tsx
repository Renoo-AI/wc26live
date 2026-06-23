'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface MatchCountdownProps {
  targetDate: string;
  className?: string;
}

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function DigitBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 30 }}
            className="text-xl sm:text-2xl font-bold text-white tabular-nums"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export function MatchCountdown({ targetDate, className }: MatchCountdownProps) {
  const [time, setTime] = useState<TimeUnits>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate);

    function tick() {
      const now = new Date();
      setTime({
        days: Math.max(0, differenceInDays(target, now)),
        hours: Math.max(0, differenceInHours(target, now) % 24),
        minutes: Math.max(0, differenceInMinutes(target, now) % 60),
        seconds: Math.max(0, differenceInSeconds(target, now) % 60),
      });
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={cn('flex items-center gap-2 sm:gap-3', className)}>
      <DigitBox value={pad(time.days)} label="Days" />
      <span className="text-white/30 text-xl font-bold mt-[-18px]">:</span>
      <DigitBox value={pad(time.hours)} label="Hrs" />
      <span className="text-white/30 text-xl font-bold mt-[-18px]">:</span>
      <DigitBox value={pad(time.minutes)} label="Min" />
      <span className="text-white/30 text-xl font-bold mt-[-18px]">:</span>
      <DigitBox value={pad(time.seconds)} label="Sec" />
    </div>
  );
}