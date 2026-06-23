'use client';

import { motion } from 'framer-motion';
import { Moon, Sun, Globe, Bell, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/settings';
import { Switch } from '@/components/ui/switch';
import { CountrySelector } from './CountrySelector';
import { Disclaimer } from './Disclaimer';

export function SettingsPanel() {
  const { settings, setSettings } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 px-4 pb-24"
    >
      <h2 className="text-lg font-bold text-white">Settings</h2>

      {/* Country */}
      <section className="bg-[#151B2E] border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="size-4 text-[#00E676]" />
          <span className="text-sm font-semibold text-white">Country</span>
        </div>
        <p className="text-xs text-white/40 mb-3">
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
      <section className="bg-[#151B2E] border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="size-4 text-[#00E676]" />
          <span className="text-sm font-semibold text-white">Time Format</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">
            {settings.timeFormat === '24h' ? '24-hour (14:00)' : '12-hour (2:00 PM)'}
          </span>
          <Switch
            checked={settings.timeFormat === '12h'}
            onCheckedChange={(checked) =>
              setSettings({ timeFormat: checked ? '12h' : '24h' })
            }
            className="data-[state=checked]:bg-[#00E676]"
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-[#151B2E] border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="size-4 text-[#00E676]" />
          <span className="text-sm font-semibold text-white">Notifications</span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-white/80">Match Start</span>
              <p className="text-[11px] text-white/40">Notify when a match begins</p>
            </div>
            <Switch
              checked={settings.notifications.matchStart}
              onCheckedChange={(checked) =>
                setSettings({
                  notifications: { ...settings.notifications, matchStart: checked },
                })
              }
              className="data-[state=checked]:bg-[#00E676]"
            />
          </div>
          <div className="w-full h-px bg-white/5" />
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-white/80">30 Minutes Before</span>
              <p className="text-[11px] text-white/40">Remind 30 min before kickoff</p>
            </div>
            <Switch
              checked={settings.notifications.thirtyMinBefore}
              onCheckedChange={(checked) =>
                setSettings({
                  notifications: { ...settings.notifications, thirtyMinBefore: checked },
                })
              }
              className="data-[state=checked]:bg-[#00E676]"
            />
          </div>
        </div>
      </section>

      {/* Theme */}
      <section className="bg-[#151B2E] border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          {settings.theme === 'dark' ? (
            <Moon className="size-4 text-[#00E676]" />
          ) : (
            <Sun className="size-4 text-[#FFD700]" />
          )}
          <span className="text-sm font-semibold text-white">Theme</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">
            {settings.theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
          <Switch
            checked={settings.theme === 'light'}
            onCheckedChange={(checked) =>
              setSettings({ theme: checked ? 'light' : 'dark' })
            }
            className="data-[state=checked]:bg-[#FFD700]"
          />
        </div>
      </section>

      {/* Disclaimer */}
      <Disclaimer />
    </motion.div>
  );
}