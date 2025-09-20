import { useState, useEffect } from 'react';

export function useTrendingSearches() {
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setTrendingSearches([
      'News',
      'Sports',
      'Entertainment',
      'Movies',
      'Music'
    ]);
  }, []);

  return { trendingSearches };
}