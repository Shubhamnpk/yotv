import { useState, useEffect } from 'react';
import type { Channel } from '../types';

export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // Enhanced suggestions based on query
    const generateSuggestions = () => {
      const categories = [
        'News',
        'Sports',
        'Movies',
        'Entertainment',
        'Documentary',
        'Kids',
        'Music',
        'Education',
        'Lifestyle',
        'Science'
      ];

      const languages = [
        'English',
        'Spanish',
        'French',
        'German',
        'Italian',
        'Chinese',
        'Japanese',
        'Korean'
      ];

      const allSuggestions = [
        ...categories,
        ...languages.map(lang => `${lang} Channels`),
        'Live News',
        'Sports Live',
        'Movie Channels',
        'Music Videos',
        'Educational Content',
        'Documentary Films',
        'Kids Shows',
        'Entertainment Shows'
      ];

      return allSuggestions
        .filter(s => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6);
    };

    setSuggestions(generateSuggestions());
  }, [query]);

  return suggestions;
}

export function filterChannels(channels: Channel[], query: string): Channel[] {
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
  
  return channels.filter(channel => {
    const searchableText = [
      channel.name,
      ...channel.categories,
      ...channel.languages,
      channel.country
    ].join(' ').toLowerCase();

    return searchTerms.every(term => searchableText.includes(term));
  });
}