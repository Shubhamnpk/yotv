import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  const addToHistory = useCallback((search: string) => {
    setSearchHistory(prev => {
      const newHistory = [
        search,
        ...prev.filter(s => s !== search)
      ].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setSearchHistory([]);
  }, []);

  return {
    searchHistory,
    addToHistory,
    clearHistory
  };
}