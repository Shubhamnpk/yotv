import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import SearchButton from './SearchButton';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { cn } from '../../utils/cn';

interface ExpandableSearchProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export default function ExpandableSearch({
  onSearch,
  className,
  placeholder = 'Search...'
}: ExpandableSearchProps) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const suggestions = useSearchSuggestions(query);
  const { isListening, startListening, stopListening, transcript } = useVoiceRecognition();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'News',
    'Sports Live',
    'Movies',
    'Entertainment',
    'Documentary'
  ]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      handleSearch(transcript);
    }
  }, [transcript]);

  useClickOutside(containerRef, () => {
    if (expanded && !query) {
      setExpanded(false);
    }
    setShowSuggestions(false);
  });

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Update recent searches
    const updated = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    onSearch(searchQuery.trim());
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSuggestionSelect = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  const clearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              initial={{ width: 44, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 44, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <div className="relative">
                <SearchInput
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onClear={handleClear}
                  placeholder={placeholder}
                  expanded={expanded}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleVoiceSearch}
                  type="button"
                  className={cn(
                    "absolute right-12 top-1/2 -translate-y-1/2",
                    "p-1.5 rounded-full transition-colors",
                    isListening
                      ? "bg-red-500 text-white"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  )}
                  aria-label={isListening ? "Stop voice search" : "Start voice search"}
                >
                  <Mic className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SearchButton 
                onClick={() => setExpanded(true)} 
                label="Expand search"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {expanded && query && (
          <SearchButton 
            onClick={handleSubmit}
            className="shrink-0"
          />
        )}
      </form>

      <AnimatePresence>
        {expanded && showSuggestions && (
          <SearchSuggestions
            isVisible={showSuggestions}
            recentSearches={recentSearches}
            trendingSearches={trendingSearches}
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            onClearHistory={clearHistory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}