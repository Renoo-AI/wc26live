'use client';

import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllCountries } from '@/data/broadcasters';
import type { CountryBroadcaster } from '@/data/types';

interface CountrySelectorProps {
  countryCode: string;
  countryName: string;
  flag: string;
  onSelect: (country: { countryCode: string; countryName: string; flag: string }) => void;
}

export function CountrySelector({ countryCode, countryName, flag, onSelect }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const allCountries = getAllCountries();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const filtered = allCountries.filter(
    (c) =>
      c.countryName.toLowerCase().includes(search.toLowerCase()) ||
      c.countryCode.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="relative" ref={popoverRef}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5 text-sm text-white/80 hover:bg-white/15 transition-colors min-h-[44px]"
      >
        <span>{flag}</span>
        <span className="hidden sm:inline text-xs">{countryName}</span>
        <ChevronDown
          className={cn('size-3.5 text-white/40 transition-transform', open && 'rotate-180')}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 max-h-[340px] bg-[#151B2E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Search */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                <Search className="size-4 text-white/30" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none flex-1"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-1.5">
              {filtered.length === 0 ? (
                <p className="text-center text-white/30 text-xs py-6">No countries found</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.countryCode}
                    onClick={() => {
                      onSelect({
                        countryCode: c.countryCode,
                        countryName: c.countryName,
                        flag: c.flag,
                      });
                      setOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors min-h-[44px]',
                      c.countryCode === countryCode
                        ? 'bg-[#00E676]/10 text-[#00E676]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="text-sm flex-1">{c.countryName}</span>
                    {c.countryCode === countryCode && <Check className="size-4" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}