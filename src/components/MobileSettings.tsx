import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Settings as SettingsIcon,
  X,
  Moon,
  Sun,
  Play,
  Volume2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import Settings from './Settings';
import { applyTheme } from '../utils/themeUtils';

interface MobileSettingsProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
}

export default function MobileSettings({
  languages,
  countries,
  categories,
}: MobileSettingsProps) {
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [isFullOpen, setIsFullOpen] = useState(false);
  const { settings, updateSettings, updatePlayerSettings } = useStore();

  const handleThemeChange = (theme: string) => {
    updateSettings({ theme: theme as any });
    applyTheme(theme as any);
  };

  const darkThemes = [
    { id: 'system', name: 'System', color: 'hsl(210 10% 50%)' },
    { id: 'dark-blue', name: 'Blue', color: 'hsl(217 91% 60%)' },
    { id: 'dark-purple', name: 'Purple', color: 'hsl(270 91% 60%)' },
    { id: 'dark-green', name: 'Green', color: 'hsl(150 91% 50%)' },
    { id: 'dark-red', name: 'Red', color: 'hsl(0 91% 60%)' },
  ];

  return (
    <>
      {/* Quick Settings Drawer */}
      <Dialog.Root open={isQuickOpen} onOpenChange={setIsQuickOpen}>
        <Dialog.Trigger asChild>
          <button
            aria-label="Quick Settings"
            className="p-2 rounded-full hover:bg-accent transition-colors touch-target"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </Dialog.Trigger>

        <AnimatePresence>
          {isQuickOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                  onClick={() => setIsQuickOpen(false)}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl focus:outline-none lg:hidden max-h-[90vh] md:max-h-[85vh]"
                >
                  <div className="bg-card/95 backdrop-blur-xl rounded-t-2xl border-t border-border/60 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border/50">
                      <Dialog.Title className="text-base sm:text-lg font-bold">
                        Quick Settings
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button 
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                          title="Close settings"
                          aria-label="Close settings"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="px-4 sm:px-6 py-4 space-y-4 max-h-[calc(90vh-80px)] md:max-h-[calc(85vh-80px)] overflow-y-auto">
                      {/* Theme Selector */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Moon className="h-3.5 w-3.5" />
                          Theme
                        </p>
                        <div className="flex gap-2 md:gap-3">
                          {darkThemes.map((t: any) => {
                            const active = settings.theme === t.id;
                            return (
                              <button
                                key={t.id}
                                onClick={() => handleThemeChange(t.id)}
                                className={cn(
                                  'relative h-8 w-8 md:h-9 md:w-9 rounded-full border-2 transition-all shadow-sm',
                                  active
                                    ? 'border-primary scale-110 shadow-primary/40'
                                    : 'border-border/50'
                                )}
                                style={{ backgroundColor: t.color }}
                                title={t.name}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Player Toggles */}
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Play className="h-3.5 w-3.5" />
                          Player
                        </p>

                        {/* Autoplay */}
                        <label className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-card/40 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-card/60 transition-all">
                          <span className="text-sm sm:text-base font-medium">Autoplay</span>
                          <button
                            onClick={() =>
                              updatePlayerSettings({
                                autoplay: !settings.player.autoplay,
                              })
                            }
                            className={cn(
                              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                              settings.player.autoplay ? 'bg-primary' : 'bg-muted'
                            )}
                          >
                            <span
                              className={cn(
                                'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform',
                                settings.player.autoplay
                                  ? 'translate-x-4'
                                  : 'translate-x-0'
                              )}
                            />
                          </button>
                        </label>

                        {/* Loop */}
                        <label className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-card/40 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-card/60 transition-all">
                          <span className="text-sm sm:text-base font-medium">Loop</span>
                          <button
                            onClick={() =>
                              updatePlayerSettings({
                                loop: !settings.player.loop,
                              })
                            }
                            className={cn(
                              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                              settings.player.loop ? 'bg-primary' : 'bg-muted'
                            )}
                          >
                            <span
                              className={cn(
                                'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform',
                                settings.player.loop ? 'translate-x-4' : 'translate-x-0'
                              )}
                            />
                          </button>
                        </label>

                        {/* Muted */}
                        <label className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-card/40 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer hover:bg-card/60 transition-all">
                          <span className="text-sm sm:text-base font-medium">Start Muted</span>
                          <button
                            onClick={() =>
                              updatePlayerSettings({
                                muted: !settings.player.muted,
                              })
                            }
                            className={cn(
                              'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                              settings.player.muted ? 'bg-primary' : 'bg-muted'
                            )}
                          >
                            <span
                              className={cn(
                                'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform',
                                settings.player.muted ? 'translate-x-4' : 'translate-x-0'
                              )}
                            />
                          </button>
                        </label>
                      </div>

                      {/* Volume */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm sm:text-base font-medium">
                            <Volume2 className="h-4 w-4 text-primary" />
                            Volume
                          </label>
                          <span className="text-sm font-bold text-primary">
                            {Math.round((settings.player.volume || 0.8) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={settings.player.volume || 0.8}
                          onChange={(e) =>
                            updatePlayerSettings({
                              volume: parseFloat(e.target.value),
                            })
                          }
                          className="w-full accent-primary"
                          title="Volume control"
                          aria-label="Volume"
                        />
                      </div>

                      {/* Full Settings Button */}
                      <button
                        onClick={() => {
                          setIsQuickOpen(false);
                          setIsFullOpen(true);
                        }}
                        className="w-full flex items-center justify-between gap-2 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/20 px-3 sm:px-4 py-3 sm:py-4 font-medium text-primary transition-all mt-4"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        Full Settings
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      {/* Full Settings Dialog */}
      {isFullOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsFullOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <Settings
              languages={languages}
              countries={countries}
              categories={categories}
              defaultTab="appearance"
            />
          </div>
        </div>
      )}
    </>
  );
}
