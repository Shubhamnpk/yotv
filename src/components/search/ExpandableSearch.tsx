import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
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
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const suggestions = useSearchSuggestions(query);
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


  useClickOutside(containerRef, () => {
    setShowSuggestions(false);
  });

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
        <div className="relative flex-1">
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
            expanded={true}
          />
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && (
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