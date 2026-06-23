'use client';

import { motion } from 'framer-motion';
import { Calendar, GitBranch, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import type { TabType } from '@/data/types';

const tabs: { id: TabType; label: string; Icon: typeof Calendar }[] = [
  { id: 'matches', label: 'Matches', Icon: Calendar },
  { id: 'bracket', label: 'Bracket', Icon: GitBranch },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:hidden"
    >
      <div className="flex items-center bg-[#151B2E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl shadow-black/40">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.92 }}
              onClick={() => setActiveTab(id)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 px-6 py-2 rounded-xl min-w-[72px] min-h-[44px] transition-colors',
                isActive ? 'text-[#00E676]' : 'text-white/40'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavActive"
                  className="absolute inset-0 bg-[#00E676]/10 border border-[#00E676]/20 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={cn('size-5 relative z-10', isActive && 'fill-[#00E676]/20')} />
              <span className="text-[10px] font-semibold relative z-10">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}