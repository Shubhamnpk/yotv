import { createContext, useContext, useEffect, useState, useMemo, ReactNode, useCallback } from 'react';
import {
  fetchChannels,
  fetchStreams,
  fetchCategories,
  fetchLanguages,
  fetchCountries,
  fetchLogos,
} from '../api';
import type { Channel, Stream, Category, Language, Country } from '../types';
import { isValidStreamUrl } from '../utils/streamUtils';
import { filterChannels } from '../hooks/useSearchSuggestions';
import useStore from '../store/useStore';
import { applyTheme } from '../utils/themeUtils';
import youtubeSourcesData from '../data/youtube-sources.json';

interface DataContextValue {
  channels: Channel[];
  streams: Stream[];
  categories: Category[];
  languages: Language[];
  countries: Country[];
  loading: boolean;
  validChannels: Channel[];
  filteredChannels: Channel[];
  visibleChannels: Channel[];
  getChannelById: (id: string) => Channel | undefined;
  getStreamsForChannel: (channelId: string) => Stream[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedLanguage: string | null;
  setSelectedLanguage: (language: string | null) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const PREVIEW_CHANNELS_PER_CATEGORY = 10;

function limitChannelsByCategory(
  channels: Channel[],
  categories: Category[],
  limit: number
) {
  const selectedChannelIds = new Set<string>();
  const previewChannels: Channel[] = [];

  categories.forEach((category) => {
    let categoryCount = 0;

    for (const channel of channels) {
      if (categoryCount >= limit) break;
      if (selectedChannelIds.has(channel.id)) continue;
      if (!channel.categories.includes(category.id)) continue;

      selectedChannelIds.add(channel.id);
      previewChannels.push(channel);
      categoryCount += 1;
    }
  });

  return previewChannels;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const { settings } = useStore();

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q && q !== searchQuery) {
      setSearchQuery(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set('q', searchQuery);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url);
  }, [searchQuery]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const [channelsData, streamsData, categoriesData, languagesData, countriesData, logosData] =
          await Promise.all([
            fetchChannels(),
            fetchStreams(),
            fetchCategories(),
            fetchLanguages(),
            fetchCountries(),
            fetchLogos(),
          ]).catch((error) => {
            console.error('Error fetching data:', error);
            return [[], [], [], [], [], []];
          });

        if (abortController.signal.aborted) return;

        const workingStreams = streamsData.filter(
          (stream: Stream) => stream.channel && isValidStreamUrl(stream.url)
        );
        // Keep ALL streams per channel so users can pick from multiple sources
        const streamByChannel = new Map<string, Stream[]>();
        workingStreams.forEach((stream: Stream) => {
          if (stream.channel) {
            const existing = streamByChannel.get(stream.channel) || [];
            existing.push(stream);
            streamByChannel.set(stream.channel, existing);
          }
        });
        const apiStreams = Array.from(streamByChannel.values()).flat();

        const countryCodeToName = new Map<string, string>();
        const countryLanguages = new Map<string, string[]>();
        const countryNameToCode = new Map<string, string>();
        countriesData.forEach((country: Country) => {
          countryCodeToName.set(country.code.toUpperCase(), country.name);
          countryLanguages.set(country.code, country.languages);
          countryNameToCode.set(country.name, country.code);
        });

        const langCodeToName = new Map<string, string>();
        languagesData.forEach((lang: Language) => {
          langCodeToName.set(lang.code.toLowerCase(), lang.name);
        });

        const logoByChannelId = new Map<string, string>();
        logosData.forEach((logo: { channel: string; url: string }) => {
          logoByChannelId.set(logo.channel, logo.url);
        });

        const channelsWithStreams = new Set(streamByChannel.keys());
        const apiChannels = channelsData
          .filter((channel: Channel) => channelsWithStreams.has(channel.id))
          .map((channel: Channel) => {
            const rawLangs = countryLanguages.get(channel.country) || [];
            const languageNames = rawLangs.map((code) => langCodeToName.get(code.toLowerCase()) || code);
            const countryName = countryCodeToName.get(channel.country.toUpperCase()) || channel.country;
            return {
              ...channel,
              countryName,
              languageNames,
              languages: rawLangs,
              logo: logoByChannelId.get(channel.id),
            };
          });

        const youtubeChannels = youtubeSourcesData.sources.map((source) => {
          const countryCode = countryNameToCode.get(source.country) || source.country;
          const countryName = countryCodeToName.get(countryCode.toUpperCase()) || source.country;
          return {
            id: source.id,
            name: source.name,
            country: countryCode,
            countryName,
            languages: [source.lang.toLowerCase()],
            languageNames: [source.lang],
            categories: source.categories,
            logo: source.img,
          };
        });

        const youtubeStreams: Stream[] = youtubeSourcesData.sources.map((source) => ({
          channel: source.id,
          feed: null,
          title: source.name,
          url: source.url,
          referrer: null,
          user_agent: null,
          quality: null,
        }));

        setChannels([...apiChannels, ...youtubeChannels]);
        setStreams([...apiStreams, ...youtubeStreams]);
        setCategories(categoriesData);
        setLanguages(languagesData);
        setCountries(countriesData);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, []);

  const validChannels = useMemo(() => {
    return channels.filter((channel) =>
      streams.some((stream) => stream.channel === channel.id)
    );
  }, [channels, streams]);

  const filteredChannels = useMemo(() => {
    let result = searchQuery ? filterChannels(validChannels, searchQuery) : validChannels;
    result = result.filter((channel) => {
      const matchesCategory =
        !selectedCategory || channel.categories.includes(selectedCategory);
      const matchesLanguage =
        !selectedLanguage || (channel.languages && channel.languages.includes(selectedLanguage));
      const matchesPreferences =
        (settings.preferredCategories.length === 0 ||
        channel.categories.some((cat) =>
          settings.preferredCategories.includes(cat)
        )) &&
        (settings.preferredCountries.length === 0 ||
        settings.preferredCountries.includes(channel.country));
      return matchesCategory && matchesLanguage && matchesPreferences;
    });
    return result;
  }, [
    validChannels,
    searchQuery,
    selectedCategory,
    selectedLanguage,
    settings.preferredCategories,
    settings.preferredCountries,
  ]);

  const visibleChannels = useMemo(() => {
    const shouldShowFullList = Boolean(selectedCategory || searchQuery.trim() || selectedLanguage);

    if (shouldShowFullList) {
      return filteredChannels;
    }

    return limitChannelsByCategory(
      filteredChannels,
      categories,
      PREVIEW_CHANNELS_PER_CATEGORY
    );
  }, [filteredChannels, categories, searchQuery, selectedCategory, selectedLanguage]);

  const getChannelById = useCallback((id: string) => {
    return channels.find((c) => c.id === id);
  }, [channels]);

  const getStreamsForChannel = useCallback((channelId: string) => {
    return streams.filter((s) => s.channel === channelId);
  }, [streams]);

  const value = useMemo(() => ({
    channels,
    streams,
    categories,
    languages,
    countries,
    loading,
    validChannels,
    filteredChannels,
    visibleChannels,
    getChannelById,
    getStreamsForChannel,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLanguage,
    setSelectedLanguage,
  }), [
    channels, streams, categories, languages, countries, loading,
    validChannels, filteredChannels, visibleChannels, getChannelById, getStreamsForChannel,
    searchQuery, selectedCategory, selectedLanguage,
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}