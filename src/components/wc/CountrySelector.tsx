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
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-[#EDE8E2] dark:bg-[#3D3632] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-full px-3 py-1.5 text-sm text-[#3D3530] dark:text-[#FAF5F0] hover:bg-[#E8E1DA] dark:hover:bg-[rgba(250,245,240,0.1)] transition-colors min-h-[44px]"
      >
        <span>{flag}</span>
        <span className="hidden sm:inline text-xs">{countryName}</span>
        <ChevronDown
          className={cn('size-3.5 text-[#9C908A] dark:text-[#7D7570] transition-transform', open && 'rotate-180')}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 max-h-[340px] bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl shadow-[0_8px_24px_rgba(26,22,20,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden z-50 flex flex-col"
          >
            {/* Search */}
            <div className="p-3 border-b border-[#F0EBE5] dark:border-[rgba(250,245,240,0.06)]">
              <div className="flex items-center gap-2 bg-[#EDE8E2] dark:bg-[#3D3632] rounded-xl px-3 py-2">
                <Search className="size-4 text-[#B5ADA7] dark:text-[#7D7570]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  className="bg-transparent text-sm text-[#1A1614] dark:text-[#FAF5F0] placeholder:text-[#B5ADA7] dark:placeholder:text-[#7D7570] outline-none flex-1"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-1.5">
              {filtered.length === 0 ? (
                <p className="text-center text-[#B5ADA7] dark:text-[#7D7570] text-xs py-6">No countries found</p>
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
                        ? 'bg-[rgba(217,119,87,0.08)] text-[#D97757] dark:text-[#E88B6E]'
                        : 'text-[#6B5F57] dark:text-[#A89E96] hover:bg-[#FAF8F5] dark:hover:bg-[#3D3632]'
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