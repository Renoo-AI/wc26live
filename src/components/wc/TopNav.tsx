'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { FootballIcon } from './FootballIcon';
import { CountrySelector } from './CountrySelector';

export function TopNav() {
  const { settings, setSettings } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

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
          ? 'bg-[#0A0E1A]/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      {/* Left: Wordmark */}
      <div className="flex items-center gap-2">
        <FootballIcon size={28} />
        <span className="text-lg font-bold tracking-tight text-white">
          Wc26<span className="text-[#00E676]">Live</span>
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