import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { Settings as SettingsIcon, X, Heart, History, Moon, Sun } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import WatchHistory from './WatchHistory';

const PreferenceSelector = lazy(() => import('./PreferenceSelector'));

interface SettingsProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
}

const TabLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

export default function Settings({ 
  languages, 
  countries, 
  categories,
  defaultTab = 'appearance' 
}: SettingsProps & { defaultTab?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { settings, updateSettings } = useStore();

  const tabs = [
    { id: 'appearance', icon: settings.theme === 'dark' ? Moon : Sun, label: 'Appearance' },
    { id: 'preferences', icon: Heart, label: 'Preferences' },
    { id: 'history', icon: History, label: 'History' }
  ];

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Open Settings"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <SettingsIcon className="w-6 h-6" />
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
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              >
                <div className="flex items-center justify-center min-h-screen p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl
                      border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                      <Dialog.Title className="text-2xl font-bold">
                        Settings
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                      <Tabs.List className="flex gap-2 p-2 border-b dark:border-gray-700">
                        {tabs.map((tab) => (
                          <Tabs.Trigger
                            key={tab.id}
                            value={tab.id}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                              activeTab === tab.id 
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            )}
                          >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                          </Tabs.Trigger>
                        ))}
                      </Tabs.List>

                      <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
                        <Tabs.Content value="appearance" className="focus:outline-none">
                          <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Theme</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                onClick={() => handleThemeChange('light')}
                                className={cn(
                                  'p-4 rounded-xl border transition-all',
                                  settings.theme === 'light'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                )}
                              >
                                <Sun className={cn(
                                  'w-8 h-8 mx-auto mb-2',
                                  settings.theme === 'light' 
                                    ? 'text-blue-500' 
                                    : 'text-gray-400'
                                )} />
                                <p className={cn(
                                  'text-sm font-medium',
                                  settings.theme === 'light'
                                    ? 'text-blue-600'
                                    : 'text-gray-600 dark:text-gray-400'
                                )}>
                                  Light Mode
                                </p>
                              </button>

                              <button
                                onClick={() => handleThemeChange('dark')}
                                className={cn(
                                  'p-4 rounded-xl border transition-all',
                                  settings.theme === 'dark'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                )}
                              >
                                <Moon className={cn(
                                  'w-8 h-8 mx-auto mb-2',
                                  settings.theme === 'dark' 
                                    ? 'text-blue-500' 
                                    : 'text-gray-400'
                                )} />
                                <p className={cn(
                                  'text-sm font-medium',
                                  settings.theme === 'dark'
                                    ? 'text-blue-600'
                                    : 'text-gray-600 dark:text-gray-400'
                                )}>
                                  Dark Mode
                                </p>
                              </button>
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
                </div>
              </motion.div>
            </Dialog.Overlay>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}