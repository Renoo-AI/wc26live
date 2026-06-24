'use client';

import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Bell, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { Switch } from '@/components/ui/switch';
import { CountrySelector } from './CountrySelector';
import { Disclaimer } from './Disclaimer';

export function SettingsPanel() {
  const { settings, setSettings, isAdmin, setAdmin } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 px-4 pb-24"
    >
      <h2 className="text-lg font-bold text-[#1A1614] dark:text-[#FAF5F0]">Settings</h2>

      {/* Country */}
      <section className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04),0_1px_2px_rgba(26,22,20,0.03)]">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="size-4 text-[#D97757] dark:text-[#E88B6E]" />
          <span className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0]">Country</span>
        </div>
        <p className="text-xs text-[#9C908A] dark:text-[#7D7570] mb-3">
          Select your country to find available free streams in your region.
        </p>
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
      </section>

      {/* Time Format */}
      <section className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04),0_1px_2px_rgba(26,22,20,0.03)]">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="size-4 text-[#D97757] dark:text-[#E88B6E]" />
          <span className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0]">Time Format</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6B5F57] dark:text-[#A89E96]">
            {settings.timeFormat === '24h' ? '24-hour (14:00)' : '12-hour (2:00 PM)'}
          </span>
          <Switch
            checked={settings.timeFormat === '12h'}
            onCheckedChange={(checked) =>
              setSettings({ timeFormat: checked ? '12h' : '24h' })
            }
            className="data-[state=checked]:bg-[#D97757] dark:data-[state=checked]:bg-[#E88B6E]"
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04),0_1px_2px_rgba(26,22,20,0.03)]">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="size-4 text-[#D97757] dark:text-[#E88B6E]" />
          <span className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0]">Notifications</span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-[#3D3530] dark:text-[#FAF5F0]">Match Start</span>
              <p className="text-[11px] text-[#9C908A] dark:text-[#7D7570]">Notify when a match begins</p>
            </div>
            <Switch
              checked={settings.notifications.matchStart}
              onCheckedChange={(checked) =>
                setSettings({
                  notifications: { ...settings.notifications, matchStart: checked },
                })
              }
              className="data-[state=checked]:bg-[#D97757] dark:data-[state=checked]:bg-[#E88B6E]"
            />
          </div>
          <div className="w-full h-px bg-[#F0EBE5] dark:bg-[rgba(250,245,240,0.06)]" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-[#3D3530] dark:text-[#FAF5F0]">30 Minutes Before</span>
              <p className="text-[11px] text-[#9C908A] dark:text-[#7D7570]">Remind 30 min before kickoff</p>
            </div>
            <Switch
              checked={settings.notifications.thirtyMinBefore}
              onCheckedChange={(checked) =>
                setSettings({
                  notifications: { ...settings.notifications, thirtyMinBefore: checked },
                })
              }
              className="data-[state=checked]:bg-[#D97757] dark:data-[state=checked]:bg-[#E88B6E]"
            />
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="bg-white dark:bg-[#292524] border border-[#E8E1DA] dark:border-[rgba(250,245,240,0.08)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04),0_1px_2px_rgba(26,22,20,0.03)]">
        <div className="flex items-center gap-2 mb-3">
          {settings.theme === 'dark' ? (
            <Moon className="size-4 text-[#D97757] dark:text-[#E88B6E]" />
          ) : (
            <Sun className="size-4 text-[#C4953A]" />
          )}
          <span className="text-sm font-semibold text-[#1A1614] dark:text-[#FAF5F0]">Theme</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6B5F57] dark:text-[#A89E96]">
            {settings.theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
          <Switch
            checked={settings.theme === 'light'}
            onCheckedChange={(checked) =>
              setSettings({ theme: checked ? 'light' : 'dark' })
            }
            className="data-[state=checked]:bg-[#C4953A]"
          />
        </div>
      </section>

      {/* Admin Mode */}
      <section className="bg-[rgba(217,119,87,0.03)] dark:bg-[rgba(232,139,110,0.06)] border border-[rgba(217,119,87,0.25)] dark:border-[rgba(232,139,110,0.2)] rounded-2xl p-4 shadow-[0_1px_3px_rgba(26,22,20,0.04),0_1px_2px_rgba(26,22,20,0.03)]">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="size-4 text-[#D97757] dark:text-[#E88B6E]" />
          <span className="text-sm font-semibold text-[#D97757] dark:text-[#E88B6E]">Admin Mode</span>
        </div>
        <p className="text-xs text-[#9C908A] dark:text-[#7D7570] mb-3">
          Enable admin controls to manage live match status, scores, and timers.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#6B5F57] dark:text-[#A89E96]">
            {isAdmin ? '🛡️ Admin Enabled' : '🔒 Admin Disabled'}
          </span>
          <Switch
            checked={isAdmin}
            onCheckedChange={(checked) => setAdmin(checked)}
            className="data-[state=checked]:bg-[#D97757] dark:data-[state=checked]:bg-[#E88B6E]"
          />
        </div>
      </section>

      {/* Disclaimer */}
      <Disclaimer />
    </motion.div>
  );
}