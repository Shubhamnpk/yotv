import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, X, History, TrendingUp } from 'lucide-react';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { useTrendingSearches } from '../../hooks/useTrendingSearches';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { cn } from '../../utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  className?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  onFocus,
  className,
  autoFocus,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isListening, startListening, stopListening, transcript } = useVoiceRecognition();
  const { trendingSearches } = useTrendingSearches();
  const { searchHistory, addToHistory, clearHistory } = useSearchHistory();

  useEffect(() => {
    if (transcript) {
      onChange(transcript);
    }
  }, [transcript, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      addToHistory(value.trim());
    }
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
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
          className="w-full pl-12 pr-24 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 
            border border-gray-300 dark:border-gray-700 focus:border-blue-500 
            dark:focus:border-blue-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500/30 dark:focus:ring-blue-400/30 text-base"
          autoFocus={autoFocus}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => onChange('')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={18} />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleVoiceSearch}
            className={cn(
              "p-2 rounded-full transition-colors",
              isListening
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
          >
            <Mic size={18} />
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && (value || searchHistory.length > 0 || trendingSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-gray-800 
              rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 
              max-h-[60vh] overflow-y-auto"
          >
            {searchHistory.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Recent Searches
                    </span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-blue-500 hover:text-blue-600 
                      dark:hover:text-blue-400"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((search, index) => (
                    <button
                      key={`${search}-${index}`}
                      onClick={() => onChange(search)}
                      className="w-full px-4 py-2 text-left rounded-md hover:bg-gray-100 
                        dark:hover:bg-gray-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {trendingSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Trending
                  </span>
                </div>
                <div className="space-y-1">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={`${search}-${index}`}
                      onClick={() => onChange(search)}
                      className="w-full px-4 py-2 text-left rounded-md hover:bg-gray-100 
                        dark:hover:bg-gray-700 transition-colors"
                    >
                      {search}
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