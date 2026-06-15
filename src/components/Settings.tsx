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
  Info,
  Star,
  Music,
  Radio,
  TrendingUp,
  ExternalLink,
  Github,
  Globe,
  Code2,
  Zap,
} from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import WatchHistory from './WatchHistory';
import { applyTheme, watchSystemTheme } from '../utils/themeUtils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

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
    { id: 'about', icon: Info, label: 'About' },
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
                className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full h-screen sm:h-auto sm:max-w-2xl mx-4 sm:rounded-2xl rounded-none focus:outline-none"
              >
                <div className="bg-card/95 backdrop-blur-xl w-full h-full sm:h-auto sm:rounded-2xl rounded-none border border-border/60 shadow-2xl overflow-hidden flex flex-col">

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

                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6 sm:h-[55vh]">

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

                      {/* ── ABOUT ── */}
                      <Tabs.Content value="about" className="focus:outline-none space-y-6">
                        {/* App Header */}
                        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
                                  YoGuru TV
                                </h2>
                                <p className="text-sm text-muted-foreground max-w-md">
                                  A modern, feature-rich IPTV streaming application with advanced search, multi-language support, and 13+ beautiful themes.
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-semibold text-primary">
                                  v2.1.0
                                </span>
                                <span className="hidden sm:inline px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-muted-foreground">
                                  {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-0" />
                        </div>

                        {/* Creator Info */}
                        <Card className="border-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Globe className="w-5 h-5 text-primary" />
                              Made with ❤️
                            </CardTitle>
                            <CardDescription>Crafted by Shubham Nepali</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              A passionate developer creating elegant digital experiences. This project showcases modern web technologies and thoughtful UI/UX design.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <a
                                href="https://github.com/shubhamnpk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 transition-all duration-300 text-sm font-medium text-primary hover:text-primary"
                              >
                                <Github className="w-4 h-4" />
                                GitHub
                              </a>
                              <a
                                href="https://shubhamnpk.github.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 transition-all duration-300 text-sm font-medium text-primary hover:text-primary"
                              >
                                <Globe className="w-4 h-4" />
                                Portfolio
                              </a>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Tech Stack */}
                        <Card className="border-0 bg-gradient-to-br from-blue/5 via-transparent to-blue/5">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Code2 className="w-5 h-5 text-blue-500" />
                              Built With
                            </CardTitle>
                            <CardDescription>Modern technologies powering YoTV</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { name: 'React', icon: '⚛️' },
                                { name: 'TypeScript', icon: '📘' },
                                { name: 'Vite', icon: '⚡' },
                                { name: 'Tailwind CSS', icon: '🎨' },
                                { name: 'Framer Motion', icon: '✨' },
                                { name: 'Zustand', icon: '🏪' },
                              ].map((tech) => (
                                <div
                                  key={tech.name}
                                  className="flex items-center gap-2 p-3 rounded-lg bg-card/40 border border-border/40 hover:border-primary/30 hover:bg-card/60 transition-all"
                                >
                                  <span className="text-xl">{tech.icon}</span>
                                  <span className="text-xs font-medium text-muted-foreground">{tech.name}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Features Highlights */}
                        <Card className="border-0 bg-gradient-to-br from-amber/5 via-transparent to-amber/5">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Zap className="w-5 h-5 text-amber-500" />
                              Key Features
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                '🎬 High-Quality IPTV Streaming',
                                '🔍 Advanced Search with Voice',
                                '❤️ Favorites & Watch History',
                                '🌍 Multi-Language Support',
                                '🎨 13+ Beautiful Themes',
                                '📱 Mobile Responsive Design',
                                '⚙️ Granular Settings Control',
                                '⌨️ Full Keyboard Navigation',
                              ].map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span className="text-lg">{feature.substring(0, 1)}</span>
                                  <span>{feature.substring(2)}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* The Yo Family */}
                        <Card className="border-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Star className="w-5 h-5 text-primary" />
                              The Yo Family
                            </CardTitle>
                            <CardDescription>Explore our elegant ecosystem</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {/* YoMusic Card */}
                              <a
                                href="https://theyomusic.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative border border-primary/20 rounded-xl p-4 bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 hover:border-primary/40 transition-all duration-300 overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <div className="relative">
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300">
                                      <Music className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-300">YoMusic</h3>
                                      <p className="text-xs text-muted-foreground">Music Streaming</p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                    Stream songs, albums, artists and playlists
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                                      <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                                  </div>
                                </div>
                              </a>

                              {/* YoRadio Card */}
                              <a
                                href="https://shubhamnpk.github.io/yoradio/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative border border-primary/20 rounded-xl p-4 bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 hover:border-primary/40 transition-all duration-300 overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <div className="relative">
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300">
                                      <Radio className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-300">YoRadio</h3>
                                      <p className="text-xs text-muted-foreground">Online Radio</p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                    Stream your favorite radio stations
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                                      <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                                  </div>
                                </div>
                              </a>

                              {/* YoNepse Card */}
                              <a
                                href="https://shubhamnpk.github.io/yonepse/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative border border-primary/20 rounded-xl p-4 bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/20 hover:to-primary/5 hover:border-primary/40 transition-all duration-300 overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <div className="relative">
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow duration-300">
                                      <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-300">YoNepse</h3>
                                      <p className="text-xs text-muted-foreground">Stock Exchange</p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                                    Real-time Nepal stock market insights
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full" />
                                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                                      <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                                  </div>
                                </div>
                              </a>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Footer */}
                        <div className="text-center pt-2 pb-4">
                          <p className="text-xs text-muted-foreground">
                            © 2024 YoGuru TV. Licensed under MIT.
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Made with passion for better streaming experience
                          </p>
                        </div>
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