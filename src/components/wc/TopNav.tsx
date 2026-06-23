'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { FootballIcon } from './FootballIcon';
import { CountrySelector } from './CountrySelector';

export function TopNav() {
  const { settings, setSettings } = useAppStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        'sticky top-0 z-50 flex h-14 items-center justify-between px-4 transition-all duration-300',
        scrolled
          ? 'bg-[#F5F0EB]/95 border-b border-[#F0EBE5] dark:bg-[#1C1917]/95 dark:border-[rgba(250,245,240,0.08)]'
          : 'bg-transparent'
      )}
    >
      {/* Left: Wordmark */}
      <div className="flex items-center gap-2">
        <FootballIcon size={28} />
        <span className="text-lg font-bold tracking-tight text-[#1A1614] dark:text-[#FAF5F0]">
          Wc26<span className="text-[#D97757] dark:text-[#E88B6E]">Live</span>
        </span>
      </div>

      {/* Right: Country pill */}
      <CountrySelector
        countryCode={settings.countryCode}
        countryName={settings.countryName}
        flag={settings.flag}
        onSelect={(c) =>
          setSettings({
            countryCode: c.countryCode,
            countryName: c.countryName,
            flag: c.flag,
          })
        }
      />
    </motion.header>
  );
}