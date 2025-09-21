import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, Globe, Palette } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import type { Country } from '../types';

interface OnboardingProps {
  countries: Country[];
  isOpen: boolean;
  onComplete: () => void;
}

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

export default function Onboarding({ countries, isOpen, onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'country' | 'theme'>('country');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<'system' | 'dark-blue' | 'dark-purple' | 'dark-green' | 'dark-red' | 'dark-orange' | 'light-blue' | 'light-purple' | 'light-green' | 'light-red' | 'light-orange' | 'dark-brown' | 'light-brown'>('system');
  const { updateSettings } = useStore();

  const handleNext = () => {
    if (step === 'country' && selectedCountry) {
      setStep('theme');
    }
  };

  const handleComplete = () => {
    updateSettings({
      preferredCountries: selectedCountry === '' ? [] : [selectedCountry],
      theme: selectedTheme
    });
    onComplete();
  };

  const canProceed = step === 'country' ? true : true; // Both steps always allow proceed

  return (
    <Dialog.Root open={isOpen} modal>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full max-w-md mx-auto bg-card text-card-foreground rounded-3xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col"
                >
                  <div className="p-8 flex-1 overflow-y-auto">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {step === 'country' ? (
                          <Globe className="w-8 h-8 text-primary" />
                        ) : (
                          <Palette className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <h2 className="text-2xl font-bold mb-2">
                        {step === 'country' ? 'Welcome!' : 'Choose Your Theme'}
                      </h2>
                      <p className="text-muted-foreground">
                        {step === 'country'
                          ? 'Select your country to personalize your experience'
                          : 'Pick a theme that suits your style'
                        }
                      </p>
                    </div>

                    {step === 'country' && (
                      <div className="space-y-4">
                        <label className="block text-sm font-medium mb-2">Country</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            placeholder="Search and select country or leave empty for all"
                            className="w-full p-3 border border-input rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            list="countries"
                          />
                          <datalist id="countries">
                            <option value="">All Countries</option>
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.flag} {country.name}
                              </option>
                            ))}
                          </datalist>
                        </div>
                      </div>
                    )}

                    {step === 'theme' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                          {themes.map((themeOption) => (
                            <button
                              key={themeOption.id}
                              onClick={() => setSelectedTheme(themeOption.id)}
                              className={cn(
                                'p-4 rounded-xl border transition-all text-center hover:scale-105',
                                selectedTheme === themeOption.id
                                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-lg'
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <div
                                className="w-8 h-8 rounded-full mx-auto mb-3 border border-border"
                                style={{ backgroundColor: themeOption.color }}
                              />
                              <p className={cn(
                                'text-sm font-medium',
                                selectedTheme === themeOption.id
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              )}>
                                {themeOption.name}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-border bg-card sticky bottom-0">
                    <div className="flex gap-3">
                      <button
                        onClick={() => onComplete()}
                        className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl transition-colors"
                      >
                        Skip
                      </button>
                      {step === 'theme' && (
                        <button
                          onClick={() => setStep('country')}
                          className="flex-1 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-xl transition-colors"
                        >
                          Back
                        </button>
                      )}
                      <button
                        onClick={step === 'country' ? handleNext : handleComplete}
                        disabled={!canProceed}
                        className={cn(
                          'flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2',
                          canProceed
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        )}
                      >
                        {step === 'country' ? 'Next' : 'Get Started'}
                        {step === 'theme' && <Check className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </Dialog.Overlay>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}