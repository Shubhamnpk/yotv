import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, History, Star, TrendingUp } from 'lucide-react';
import useStore from '../../store/useStore';
import { cn } from '../../utils/cn';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';

interface SimpleSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function SimpleSearch({
  value,
  onChange,
  className,
  placeholder = 'Search channels...'
}: SimpleSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { settings } = useStore();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'News',
    'Sports Live',
    'Movies',
    'Entertainment',
    'Documentary'
  ]);

  const suggestions = useSearchSuggestions(value);

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

  const handleSelectFavorite = (channelId: string) => {
    onChange(channelId);
    saveSearch(channelId);
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    saveSearch(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-12 pr-10 py-3 rounded-xl bg-background
            border-2 border-input focus:border-primary
            focus:outline-none focus:ring-2 focus:ring-primary/20
            text-foreground placeholder:text-muted-foreground
            transition-all duration-200"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange('')}
              className="absolute right-3 top-3
                text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full bg-muted hover:bg-accent"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {isFocused && (suggestions.length > 0 || recentSearches.length > 0 || settings.favorites.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full left-0 right-0 mt-2 p-4
              bg-popover/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-border/50 z-50"
          >
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 mb-3">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Suggestions
                </span>
              </div>
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full px-4 py-2 text-left rounded-xl
                        hover:bg-accent text-foreground
                        transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : value.trim() ? (
                <p className="px-4 py-2 text-sm text-muted-foreground">
                  No suggestions available for your search
                </p>
              ) : null}
            </div>

            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-2 mb-3">
                  <History className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Recent Searches
                  </span>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSelectRecent(search)}
                      className="w-full px-4 py-2 text-left rounded-xl
                        hover:bg-accent text-foreground
                        transition-all duration-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {settings.favorites.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 px-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Favorite Channels
                  </span>
                </div>
                <div className="space-y-2">
                  {settings.favorites.slice(0, 3).map((channelId) => (
                    <button
                      key={channelId}
                      onClick={() => handleSelectFavorite(channelId)}
                      className="w-full px-4 py-2 text-left rounded-xl
                        hover:bg-accent text-foreground
                        transition-all duration-200"
                    >
                      {channelId}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 px-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Trending Now
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectSuggestion(term)}
                    className="flex items-center gap-2 p-3 rounded-xl
                      bg-muted hover:bg-accent
                      transition-all duration-200"
                  >
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {term}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
