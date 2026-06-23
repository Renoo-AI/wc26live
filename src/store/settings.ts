'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, TabType } from '@/data/types';

interface AppState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  expandedMatchId: string | null;
  setExpandedMatchId: (id: string | null) => void;
  settings: UserSettings;
  setSettings: (s: Partial<UserSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: 'matches',
      setActiveTab: (tab) => set({ activeTab: tab }),
      selectedDate: '',
      setSelectedDate: (date) => set({ selectedDate: date }),
      expandedMatchId: null,
      setExpandedMatchId: (id) => set({ expandedMatchId: id }),
      settings: {
        countryCode: 'US',
        countryName: 'United States',
        flag: '🇺🇸',
        timeFormat: '24h',
        theme: 'light',
        notifications: {
          matchStart: true,
          thirtyMinBefore: true,
        },
      },
      setSettings: (s) =>
        set((state) => ({
          settings: { ...state.settings, ...s },
        })),
    }),
    {
      name: 'wc26live-settings',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);