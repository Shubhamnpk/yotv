import { motion, AnimatePresence } from 'framer-motion';
import { History, TrendingUp, Star, Search as SearchIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SearchSuggestionsProps {
  isVisible: boolean;
  recentSearches: string[];
  trendingSearches: string[];
  suggestions: string[];
  onSelect: (term: string) => void;
  onClearHistory: () => void;
}

export default function SearchSuggestions({
  isVisible,
  recentSearches,
  trendingSearches,
  suggestions,
  onSelect,
  onClearHistory,
}: SearchSuggestionsProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-3 bg-popover/80
        backdrop-blur-lg rounded-2xl shadow-2xl border border-border/50
        overflow-hidden z-50"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        {recentSearches.length > 0 && (
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-muted">
                  <History className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Recent Searches
                </h3>
              </div>
              <button
                onClick={onClearHistory}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((term, index) => (
                <SearchItem
                  key={`${term}-${index}`}
                  term={term}
                  icon={History}
                  onClick={() => onSelect(term)}
                />
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-muted">
                <SearchIcon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Suggestions
              </h3>
            </div>
            <div className="space-y-1">
              {suggestions.map((term, index) => (
                <SearchItem
                  key={`${term}-${index}`}
                  term={term}
                  icon={Star}
                  onClick={() => onSelect(term)}
                />
              ))}
            </div>
          </div>
        )}

        {trendingSearches.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-muted">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Trending Now
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {trendingSearches.map((term, index) => (
                <motion.button
                  key={`${term}-${index}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(term)}
                  className="flex items-center gap-2 p-3 rounded-xl
                    bg-muted hover:bg-accent transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {term}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface SearchItemProps {
  term: string;
  icon: React.ElementType;
  onClick: () => void;
}

function SearchItem({ term, icon: Icon, onClick }: SearchItemProps) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left",
        "hover:bg-accent",
        "transition-all duration-200 ease-in-out"
      )}
    >
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-muted-foreground">
        {term}
      </span>
    </motion.button>
  );
}