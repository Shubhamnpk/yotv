import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, History, Star } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onFocus?: () => void;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  className,
  onFocus,
  autoFocus,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { settings } = useStore();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const saveSearch = (search: string) => {
    if (!search.trim()) return;
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      saveSearch(value.trim());
    }
  };

  const handleSelectRecent = (search: string) => {
    onChange(search);
    saveSearch(search);
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 
            text-gray-400 dark:text-gray-500"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search channels..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-12 pr-12 py-2.5 rounded-lg bg-gray-50 
            dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
            focus:border-blue-500 dark:focus:border-blue-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500/30 
            dark:focus:ring-blue-400/30 text-gray-700 dark:text-gray-200 
            placeholder-gray-400 dark:placeholder-gray-600 transition-all"
          autoFocus={autoFocus}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 
                text-gray-400 hover:text-gray-600 dark:text-gray-500 
                dark:hover:text-gray-400 transition-colors"
            >
              <X size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {isFocused && (recentSearches.length > 0 || settings.favorites.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 
              bg-white dark:bg-gray-800 rounded-lg shadow-lg border 
              border-gray-200 dark:border-gray-700 z-50"
          >
            {recentSearches.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 px-2 mb-2">
                  <History className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Recent Searches
                  </span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSelectRecent(search)}
                      className="w-full px-3 py-1.5 text-left rounded-md 
                        hover:bg-gray-100 dark:hover:bg-gray-700 
                        text-gray-700 dark:text-gray-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {settings.favorites.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Favorite Channels
                  </span>
                </div>
                <div className="space-y-1">
                  {settings.favorites.slice(0, 3).map((channelId) => (
                    <button
                      key={channelId}
                      onClick={() => onChange(channelId)}
                      className="w-full px-3 py-1.5 text-left rounded-md 
                        hover:bg-gray-100 dark:hover:bg-gray-700 
                        text-gray-700 dark:text-gray-200"
                    >
                      {channelId}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}