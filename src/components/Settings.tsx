import React, { useState, Suspense, lazy, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Settings as SettingsIcon,
  X,
  Heart,
  History,
  Moon,
  Sun,
  Monitor,
  Play,
  Volume2,
  Gauge,
  Layers,
  Hash,
  Sparkles,
  Check,
} from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import WatchHistory from './WatchHistory';
import { applyTheme, watchSystemTheme } from '../utils/themeUtils';

const PreferenceSelector = lazy(() => import('./PreferenceSelector'));

interface SettingsProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
}

const TabLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

/* Toggle switch component */
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

/* Row for a toggle setting */
function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  id,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-card/40 px-4 py-3 cursor-pointer hover:border-primary/30 hover:bg-card/60 transition-all"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
          )}
        </div>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </label>
  );
}

export default function Settings({
  languages,
  countries,
  categories,
  defaultTab = 'appearance',
}: SettingsProps & { defaultTab?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { settings, updateSettings, updatePlayerSettings, updateUISettings } = useStore();

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    if (settings.theme !== 'system') return;
    const cleanup = watchSystemTheme(() => applyTheme('system'));
    return cleanup;
  }, [settings.theme]);

  const getThemeIcon = () => {
    if (settings.theme === 'system') return Monitor;
    if (settings.theme.startsWith('dark-')) return Moon;
    return Sun;
  };

  const ThemeIcon = getThemeIcon();

  const tabs = [
    { id: 'appearance', icon: ThemeIcon, label: 'Appearance' },
    { id: 'playback', icon: Play, label: 'Playback' },
    { id: 'preferences', icon: Heart, label: 'Preferences' },
    { id: 'history', icon: History, label: 'History' },
  ];

  const handleThemeChange = (
    theme:
      | 'system'
      | 'dark-blue'
      | 'dark-purple'
      | 'dark-green'
      | 'dark-red'
      | 'dark-orange'
      | 'light-blue'
      | 'light-purple'
      | 'light-green'
      | 'light-red'
      | 'light-orange'
      | 'dark-brown'
      | 'light-brown'
  ) => {
    updateSettings({ theme });
    applyTheme(theme);
  };

  const themes: Array<{
    id:
      | 'system'
      | 'dark-blue'
      | 'dark-purple'
      | 'dark-green'
      | 'dark-red'
      | 'dark-orange'
      | 'light-blue'
      | 'light-purple'
      | 'light-green'
      | 'light-red'
      | 'light-orange'
      | 'dark-brown'
      | 'light-brown';
    name: string;
    color: string;
    dark: boolean;
  }> = [
    { id: 'system', name: 'System', color: 'hsl(210 10% 50%)', dark: false },
    { id: 'dark-blue', name: 'Blue', color: 'hsl(217 91% 60%)', dark: true },
    { id: 'dark-purple', name: 'Purple', color: 'hsl(270 91% 60%)', dark: true },
    { id: 'dark-green', name: 'Green', color: 'hsl(150 91% 50%)', dark: true },
    { id: 'dark-red', name: 'Red', color: 'hsl(0 91% 60%)', dark: true },
    { id: 'dark-orange', name: 'Orange', color: 'hsl(30 91% 60%)', dark: true },
    { id: 'dark-brown', name: 'Brown', color: 'hsl(25 35% 45%)', dark: true },
    { id: 'light-blue', name: 'Blue', color: 'hsl(210 91% 40%)', dark: false },
    { id: 'light-purple', name: 'Purple', color: 'hsl(270 91% 40%)', dark: false },
    { id: 'light-green', name: 'Green', color: 'hsl(150 80% 35%)', dark: false },
    { id: 'light-red', name: 'Red', color: 'hsl(0 91% 40%)', dark: false },
    { id: 'light-orange', name: 'Orange', color: 'hsl(30 91% 40%)', dark: false },
    { id: 'light-brown', name: 'Brown', color: 'hsl(25 25% 35%)', dark: false },
  ];

  const darkThemes = themes.filter((t) => t.dark || t.id === 'system');
  const lightThemes = themes.filter((t) => !t.dark && t.id !== 'system');

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Open Settings"
          className="p-2 rounded-full hover:bg-accent transition-colors touch-target"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 focus:outline-none"
              >
                <div className="bg-card/95 backdrop-blur-xl rounded-2xl border border-border/60 shadow-2xl overflow-hidden">

                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <SettingsIcon className="h-4 w-4" />
                      </div>
                      <Dialog.Title className="text-lg font-bold tracking-tight">
                        Settings
                      </Dialog.Title>
                    </div>
                    <Dialog.Close asChild>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                    {/* Tab bar */}
                    <Tabs.List className="flex gap-1 px-4 pt-3 pb-0 border-b border-border/40">
                      {tabs.map((tab) => (
                        <Tabs.Trigger
                          key={tab.id}
                          value={tab.id}
                          className={cn(
                            'relative flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none',
                            activeTab === tab.id
                              ? 'text-primary bg-primary/10'
                              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                          )}
                        >
                          <tab.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="hidden sm:inline">{tab.label}</span>
                          {activeTab === tab.id && (
                            <motion.span
                              layoutId="tab-underline"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                            />
                          )}
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>

                    <div className="h-[55vh] overflow-y-auto px-6 py-5 space-y-6">

                      {/* ── APPEARANCE ── */}
                      <Tabs.Content value="appearance" className="focus:outline-none space-y-6">
                        {/* Dark themes */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            <Moon className="h-3.5 w-3.5" />
                            Dark Themes
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                            {darkThemes.map((t) => {
                              const active = settings.theme === t.id;
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => handleThemeChange(t.id)}
                                  className="group flex flex-col items-center gap-2 focus:outline-none"
                                  title={t.name}
                                >
                                  <div
                                    className={cn(
                                      'relative h-10 w-10 rounded-full border-2 transition-all duration-200 shadow-md',
                                      active
                                        ? 'border-primary scale-110 shadow-primary/40'
                                        : 'border-border/50 group-hover:border-primary/50 group-hover:scale-105'
                                    )}
                                    style={{ backgroundColor: t.color }}
                                  >
                                    {active && (
                                      <span className="absolute inset-0 flex items-center justify-center">
                                        <Check className="h-4 w-4 text-white drop-shadow" />
                                      </span>
                                    )}
                                  </div>
                                  <span className={cn('text-[10px] font-medium', active ? 'text-primary' : 'text-muted-foreground')}>
                                    {t.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Light themes */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            <Sun className="h-3.5 w-3.5" />
                            Light Themes
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {lightThemes.map((t) => {
                              const active = settings.theme === t.id;
                              return (
                                <button
                                  key={t.id}
                                  onClick={() => handleThemeChange(t.id)}
                                  className="group flex flex-col items-center gap-2 focus:outline-none"
                                  title={t.name}
                                >
                                  <div
                                    className={cn(
                                      'relative h-10 w-10 rounded-full border-2 transition-all duration-200 shadow-md',
                                      active
                                        ? 'border-primary scale-110 shadow-primary/40'
                                        : 'border-border/50 group-hover:border-primary/50 group-hover:scale-105'
                                    )}
                                    style={{ backgroundColor: t.color }}
                                  >
                                    {active && (
                                      <span className="absolute inset-0 flex items-center justify-center">
                                        <Check className="h-4 w-4 text-white drop-shadow" />
                                      </span>
                                    )}
                                  </div>
                                  <span className={cn('text-[10px] font-medium', active ? 'text-primary' : 'text-muted-foreground')}>
                                    {t.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </Tabs.Content>

                      {/* ── PLAYBACK ── */}
                      <Tabs.Content value="playback" className="focus:outline-none space-y-6">
                        <div className="space-y-3">
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Play className="h-3.5 w-3.5" />Player
                          </p>
                          <div className="space-y-2">
                            <ToggleRow
                              id="autoplay"
                              icon={Play}
                              label="Autoplay"
                              description="Start playing when you open a channel"
                              checked={settings.player?.autoplay ?? false}
                              onChange={(v) => updatePlayerSettings({ autoplay: v })}
                            />
                            <ToggleRow
                              id="loop"
                              icon={Layers}
                              label="Loop"
                              description="Restart stream when it ends"
                              checked={settings.player?.loop ?? false}
                              onChange={(v) => updatePlayerSettings({ loop: v })}
                            />
                            <ToggleRow
                              id="muted"
                              icon={Volume2}
                              label="Start Muted"
                              description="Begin streams with audio off"
                              checked={settings.player?.muted ?? false}
                              onChange={(v) => updatePlayerSettings({ muted: v })}
                            />
                          </div>
                        </div>

                        {/* Volume slider */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm font-medium">
                              <Volume2 className="h-4 w-4 text-primary" />
                              Volume
                            </label>
                            <span className="text-sm font-bold text-primary">
                              {Math.round((settings.player?.volume ?? 0.8) * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={settings.player?.volume ?? 0.8}
                            onChange={(e) => updatePlayerSettings({ volume: parseFloat(e.target.value) })}
                            className="w-full accent-primary"
                          />
                        </div>

                        {/* Quality */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium">
                            <Gauge className="h-4 w-4 text-primary" />
                            Stream Quality
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {['auto', 'low', 'medium', 'high', 'ultra'].map((q) => (
                              <button
                                key={q}
                                onClick={() => updatePlayerSettings({ quality: q as 'auto' | 'low' | 'medium' | 'high' | 'ultra' })}
                                className={cn(
                                  'rounded-lg border py-2 text-xs font-semibold capitalize transition-all',
                                  (settings.player?.quality ?? 'auto') === q
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                )}
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interface Settings */}
                        <div className="space-y-3">
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5" />Interface
                          </p>
                          <div className="space-y-2">
                            <ToggleRow
                              id="animations"
                              icon={Sparkles}
                              label="Animations"
                              description="Enable smooth UI transitions"
                              checked={settings.ui?.animations ?? true}
                              onChange={(v) => updateUISettings({ animations: v })}
                            />
                            <ToggleRow
                              id="compact"
                              icon={Layers}
                              label="Compact Mode"
                              description="Reduce spacing throughout the app"
                              checked={settings.ui?.compactMode ?? false}
                              onChange={(v) => updateUISettings({ compactMode: v })}
                            />
                            <ToggleRow
                              id="showlogos"
                              icon={Monitor}
                              label="Show Logos"
                              description="Display channel logos in cards"
                              checked={settings.ui?.showChannelLogos ?? true}
                              onChange={(v) => updateUISettings({ showChannelLogos: v })}
                            />
                            <ToggleRow
                              id="shownumbers"
                              icon={Hash}
                              label="Show Numbers"
                              description="Show channel numbers"
                              checked={settings.ui?.showChannelNumbers ?? false}
                              onChange={(v) => updateUISettings({ showChannelNumbers: v })}
                            />
                          </div>
                        </div>
                      </Tabs.Content>

                      {/* ── PREFERENCES ── */}
                      <Tabs.Content value="preferences" className="focus:outline-none">
                        <Suspense fallback={<TabLoader />}>
                          <PreferenceSelector
                            languages={languages}
                            countries={countries}
                            categories={categories}
                          />
                        </Suspense>
                      </Tabs.Content>

                      {/* ── HISTORY ── */}
                      <Tabs.Content value="history" className="focus:outline-none">
                        <WatchHistory />
                      </Tabs.Content>
                    </div>
                  </Tabs.Root>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}