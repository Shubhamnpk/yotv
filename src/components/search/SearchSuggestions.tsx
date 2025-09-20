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
      className="absolute top-full left-0 right-0 mt-3 bg-white/80 dark:bg-gray-800/80 
        backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 
        dark:border-gray-700/50 overflow-hidden z-50"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        {recentSearches.length > 0 && (
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <History className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Recent Searches
                </h3>
              </div>
              <button
                onClick={onClearHistory}
                className="text-xs font-medium text-blue-500 hover:text-blue-600 
                  dark:hover:text-blue-400 transition-colors"
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
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                <SearchIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                    bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100
                    dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
        "hover:bg-gray-50 dark:hover:bg-gray-700/50",
        "transition-all duration-200 ease-in-out"
      )}
    >
      <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {term}
      </span>
    </motion.button>
  );
}