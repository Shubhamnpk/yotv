import React, { useState, Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowLeft, Heart, History, Moon, Sun, Monitor, Play, Eye } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import WatchHistory from './WatchHistory';
import { applyTheme, watchSystemTheme } from '../utils/themeUtils';

const PreferenceSelector = lazy(() => import('./PreferenceSelector'));

interface SettingsPageProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
  onBack: () => void;
  defaultTab?: string;
}

const TabLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

export default function SettingsPage({
  languages,
  countries,
  categories,
  onBack,
  defaultTab = 'appearance'
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { settings, updateSettings, updatePlayerSettings, updateUISettings } = useStore();

  // Apply theme on mount and when settings change
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  // Watch for system theme changes when system theme is selected
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const cleanup = watchSystemTheme((systemTheme) => {
      applyTheme('system');
    });

    return cleanup;
  }, [settings.theme]);

  const getThemeIcon = () => {
    if (settings.theme === 'system') return Monitor;
    if (settings.theme.startsWith('dark-')) return Moon;
    return Sun;
  };

  const tabs = [
    { id: 'appearance', icon: getThemeIcon(), label: 'Appearance' },
    { id: 'playback', icon: Play, label: 'Playback & Interface' },
    { id: 'preferences', icon: Heart, label: 'Preferences' },
    { id: 'history', icon: History, label: 'History' }
  ];

  const handleThemeChange = (theme: 'system' | 'dark-blue' | 'dark-purple' | 'dark-green' | 'dark-red' | 'dark-orange' | 'light-blue' | 'light-purple' | 'light-green' | 'light-red' | 'light-orange' | 'dark-brown' | 'light-brown') => {
    updateSettings({ theme });
    applyTheme(theme);
  };

  const themes: Array<{ id: 'system' | 'dark-blue' | 'dark-purple' | 'dark-green' | 'dark-red' | 'dark-orange' | 'light-blue' | 'light-purple' | 'light-green' | 'light-red' | 'light-orange' | 'dark-brown' | 'light-brown', name: string, color: string }> = [
    { id: 'system', name: 'System', color: 'hsl(210 10% 50%)' },
    { id: 'dark-blue', name: 'Dark Blue', color: 'hsl(217.2 91.2% 59.8%)' },
    { id: 'dark-purple', name: 'Dark Purple', color: 'hsl(270 91.2% 59.8%)' },
    { id: 'dark-green', name: 'Dark Green', color: 'hsl(150 91.2% 59.8%)' },
    { id: 'dark-red', name: 'Dark Red', color: 'hsl(0 91.2% 59.8%)' },
    { id: 'dark-orange', name: 'Dark Orange', color: 'hsl(30 91.2% 59.8%)' },
    { id: 'light-blue', name: 'Light Blue', color: 'hsl(210 91.2% 40.2%)' },
    { id: 'light-purple', name: 'Light Purple', color: 'hsl(270 91.2% 40.2%)' },
    { id: 'light-green', name: 'Light Green', color: 'hsl(150 91.2% 40.2%)' },
    { id: 'light-red', name: 'Light Red', color: 'hsl(0 91.2% 40.2%)' },
    { id: 'light-orange', name: 'Light Orange', color: 'hsl(30 91.2% 40.2%)' },
    { id: 'dark-brown', name: 'Dark Brown', color: 'hsl(25 35% 45%)' },
    { id: 'light-brown', name: 'Light Brown', color: 'hsl(25 25% 35%)' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-bold">Settings</h1>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={settings.ui?.animations ?? true ? { opacity: 0, y: 20 } : {}}
          animate={settings.ui?.animations ?? true ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl shadow-xl border border-border p-6"
        >
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex gap-1 p-2 border-b border-border overflow-x-auto scrollbar-hide mb-6">
              {tabs.map((tab) => (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 rounded-lg transition-all card-hover whitespace-nowrap text-sm',
                    'min-w-0 flex-shrink-0',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="content-spacing">
              <Tabs.Content value="appearance" className="focus:outline-none">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Theme</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.id}
                          onClick={() => handleThemeChange(themeOption.id)}
                          className={cn(
                            'p-3 rounded-lg border transition-all card-hover text-center',
                            settings.theme === themeOption.id
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div
                            className="w-6 h-6 rounded-full mx-auto mb-2 border border-border"
                            style={{ backgroundColor: themeOption.color }}
                          />
                          <p className={cn(
                            'text-xs font-medium',
                            settings.theme === themeOption.id
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}>
                            {themeOption.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="playback" className="focus:outline-none">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Player Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Autoplay</span>
                          <input
                            type="checkbox"
                            checked={settings.player?.autoplay ?? false}
                            onChange={(e) => updatePlayerSettings({ autoplay: e.target.checked })}
                            className="w-4 h-4"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Loop</span>
                          <input
                            type="checkbox"
                            checked={settings.player?.loop ?? false}
                            onChange={(e) => updatePlayerSettings({ loop: e.target.checked })}
                            className="w-4 h-4"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Subtitles</span>
                          <input
                            type="checkbox"
                            checked={settings.player?.subtitles ?? false}
                            onChange={(e) => updatePlayerSettings({ subtitles: e.target.checked })}
                            className="w-4 h-4"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Muted</span>
                          <input
                            type="checkbox"
                            checked={settings.player?.muted ?? false}
                            onChange={(e) => updatePlayerSettings({ muted: e.target.checked })}
                            className="w-4 h-4"
                          />
                        </label>
                      </div>
                      <label className="block">
                        <span className="block mb-2 text-sm">Volume</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.player?.volume ?? 0.8}
                          onChange={(e) => updatePlayerSettings({ volume: parseFloat(e.target.value) })}
                          className="w-full"
                        />
                        <span className="text-sm text-muted-foreground">{Math.round((settings.player?.volume ?? 0.8) * 100)}%</span>
                      </label>
                      <label className="block">
                        <span className="block mb-2 text-sm">Quality</span>
                        <select
                          value={settings.player?.quality ?? 'auto'}
                          onChange={(e) => updatePlayerSettings({ quality: e.target.value as any })}
                          className="w-full p-2 border border-input rounded-lg bg-background text-sm"
                        >
                          <option value="auto">Auto</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="ultra">Ultra</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Interface Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Animations</span>
                          <input
                            type="checkbox"
                            checked={settings.ui?.animations ?? true}
                            onChange={(e) => updateUISettings({ animations: e.target.checked })}
                            className="w-4 h-4"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Compact Mode</span>
                          <input
                            type="checkbox"
                            checked={settings.ui?.compactMode ?? false}
                            onChange={(e) => updateUISettings({ compactMode: e.target.checked })}
                            className="w-4 h-4"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Show Logos</span>
                          <input
                            type="checkbox"
                            checked={settings.ui?.showChannelLogos ?? true}
                            onChange={(e) => updateUISettings({ showChannelLogos: e.target.checked })}
                            className="w-4 h-4"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Show Numbers</span>
                          <input
                            type="checkbox"
                            checked={settings.ui?.showChannelNumbers ?? false}
                            onChange={(e) => updateUISettings({ showChannelNumbers: e.target.checked })}
                            className="w-4 h-4"
                          />
                        </label>
                      </div>
                      <label className="block">
                        <span className="block mb-2 text-sm">Grid Size</span>
                        <select
                          value={settings.ui?.gridSize ?? 'medium'}
                          onChange={(e) => updateUISettings({ gridSize: e.target.value as any })}
                          className="w-full p-2 border border-input rounded-lg bg-background text-sm"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="preferences" className="focus:outline-none">
                <Suspense fallback={<TabLoader />}>
                  <PreferenceSelector
                    languages={languages}
                    countries={countries}
                    categories={categories}
                  />
                </Suspense>
              </Tabs.Content>

              <Tabs.Content value="history" className="focus:outline-none">
                <WatchHistory />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </motion.div>
      </main>
    </div>
  );
}