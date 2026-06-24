'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F0EB] dark:bg-[#1C1917] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 text-center max-w-sm"
      >
        {/* Icon */}
        <div className="size-20 rounded-2xl bg-[rgba(217,119,87,0.06)] dark:bg-[rgba(232,139,110,0.08)] flex items-center justify-center">
          <span className="text-4xl">⚽</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#1A1614] dark:text-[#FAF5F0]">Page not found</h1>
          <p className="text-sm text-[#9C908A] dark:text-[#7D7570] mt-2 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            <br />
            Head back to catch the latest World Cup action.
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[#D97757] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#C66A4A] transition-colors min-h-[48px]"
          >
            <Home className="size-4" />
            Go Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-[#EDE8E2] dark:bg-[#3D3632] text-[#6B5F57] dark:text-[#A89E96] text-sm font-medium px-5 py-3 rounded-xl hover:bg-[#E0D9D2] dark:hover:bg-[#4A433E] transition-colors min-h-[48px]"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>

        <p className="text-xs text-[#B5ADA7] dark:text-[#7D7570]">
          Wc26Live — Free Legal World Cup 2026
        </p>
      </motion.div>
    </div>
  );
}