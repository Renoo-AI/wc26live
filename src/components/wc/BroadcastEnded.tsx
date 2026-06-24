'use client';

import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';

interface Props {
  message: string;
  onDismiss: () => void;
}

export function BroadcastEnded({ message, onDismiss }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mx-4 mt-2"
    >
      <div className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-5 text-center shadow-[0_1px_3px_rgba(26,22,20,0.04)]">
        <div className="size-12 rounded-full bg-[#EDE8E2] dark:bg-[#3D3632] flex items-center justify-center mx-auto mb-3">
          <Tv className="size-5 text-[#9C908A] dark:text-[#7D7570]" />
        </div>
        <p className="text-sm text-[#6B5F57] dark:text-[#A89E96] leading-relaxed">
          {message}
        </p>
        <button
          onClick={onDismiss}
          className="text-xs text-[#9C908A] dark:text-[#7D7570] hover:text-[#D97757] mt-3 font-medium transition-colors"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}