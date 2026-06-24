'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, TabType, MatchOverride, Match } from '@/data/types';

interface AppState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  expandedMatchId: string | null;
  setExpandedMatchId: (id: string | null) => void;
  settings: UserSettings;
  setSettings: (s: Partial<UserSettings>) => void;
  // Admin
  isAdmin: boolean;
  setAdmin: (v: boolean) => void;
  matchOverrides: Record<string, MatchOverride>;
  setMatchOverride: (matchId: string, override: MatchOverride) => void;
  removeMatchOverride: (matchId: string) => void;
  // Custom matches
  customMatches: Match[];
  addCustomMatch: (match: Match) => void;
  updateCustomMatch: (matchId: string, match: Partial<Match>) => void;
  removeCustomMatch: (matchId: string) => void;
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
      // Admin
      isAdmin: false,
      setAdmin: (v) => set({ isAdmin: v }),
      matchOverrides: {},
      setMatchOverride: (matchId, override) =>
        set((state) => ({
          matchOverrides: {
            ...state.matchOverrides,
            [matchId]: {
              ...state.matchOverrides[matchId],
              ...override,
            },
          },
        })),
      removeMatchOverride: (matchId) =>
        set((state) => {
          const { [matchId]: _, ...rest } = state.matchOverrides;
          return { matchOverrides: rest };
        }),
      // Custom matches
      customMatches: [],
      addCustomMatch: (match) =>
        set((state) => ({
          customMatches: [...state.customMatches, match],
        })),
      updateCustomMatch: (matchId, data) =>
        set((state) => ({
          customMatches: state.customMatches.map((m) =>
            m.id === matchId ? { ...m, ...data } : m
          ),
        })),
      removeCustomMatch: (matchId) =>
        set((state) => ({
          customMatches: state.customMatches.filter((m) => m.id !== matchId),
        })),
    }),
    {
      name: 'wc26live-settings',
      partialize: (state) => ({
        settings: state.settings,
        matchOverrides: state.matchOverrides,
        isAdmin: state.isAdmin,
        customMatches: state.customMatches,
      }),
    }
  )
);