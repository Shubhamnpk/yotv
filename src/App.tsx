import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  fetchChannels,
  fetchStreams,
  fetchCategories,
  fetchLanguages,
  fetchCountries,
} from './api';
import type { Channel, Stream, Category, Language, Country } from './types';
import { isValidStreamUrl } from './utils/streamUtils';
import { filterChannels } from './hooks/useSearchSuggestions';
import LoadingScreen from './components/LoadingScreen';
import MobileNav from './components/MobileNav';
import SearchOverlay from './components/SearchOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/layout/Header';
import { PlayerSection } from './components/player/PlayerSection';
import { ChannelSection } from './components/channels/ChannelSection';
import useStore from './store/useStore';
import { applyTheme } from './utils/themeUtils';
import youtubeSourcesData from './data/youtube-sources.json';

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

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q && q !== searchQuery) {
      setSearchQuery(q);
    }
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
  const { settings, addToWatchHistory } = useStore();

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const [channelsData, streamsData, categoriesData, languagesData, countriesData] =
          await Promise.all([
            fetchChannels(),
            fetchStreams(),
            fetchCategories(),
            fetchLanguages(),
            fetchCountries(),
          ]).catch((error) => {
            console.error('Error fetching data:', error);
            return [[], [], [], [], []];
          });

        if (abortController.signal.aborted) return;

        const workingStreams = streamsData.filter(
          (stream: Stream) => stream.channel && isValidStreamUrl(stream.url)
        );
        const streamByChannel = new Map<string, Stream>();
        workingStreams.forEach((stream: Stream) => {
          if (stream.channel && !streamByChannel.has(stream.channel)) {
            streamByChannel.set(stream.channel, stream);
          }
        });

        const countryLanguages = new Map<string, string[]>();
        const countryNameToCode = new Map<string, string>();
        countriesData.forEach((country: Country) => {
          countryLanguages.set(country.code, country.languages);
          countryNameToCode.set(country.name, country.code);
        });

        const apiChannels = channelsData
          .filter((channel: Channel) => streamByChannel.has(channel.id))
          .map((channel: Channel) => ({
            ...channel,
            languages: countryLanguages.get(channel.country) || [],
          }));

        const youtubeChannels = youtubeSourcesData.sources.map((source) => ({
          id: source.id,
          name: source.name,
          country: countryNameToCode.get(source.country) || source.country,
          languages: [source.lang],
          categories: source.categories,
          logo: source.img,
        }));

        const youtubeStreams = youtubeSourcesData.sources.map((source) => ({
          channel: source.id,
          url: source.url,
        }));

        setChannels([...apiChannels, ...youtubeChannels]);
        setStreams([...streamByChannel.values(), ...youtubeStreams]);
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

  const handleChannelSelect = (channel: Channel) => {
    const stream = streams.find((s) => s.channel === channel.id);
    setSelectedChannel(channel);
    setSelectedStream(stream || null);
    addToWatchHistory(channel.id);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <Header
          searchQuery={searchQuery}
          onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          onSearch={setSearchQuery}
          onMobileSearchOpen={() => setIsSearchOpen(true)}
          languages={languages}
          categories={categories}
          countries={countries}
        />

        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          categories={categories}
          languages={languages}
          selectedCategory={selectedCategory}
          selectedLanguage={selectedLanguage}
          onCategoryChange={setSelectedCategory}
          onLanguageChange={setSelectedLanguage}
        />

        <SearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${
          settings.ui?.compactMode ? 'py-3' : 'py-6'
        }`}>
          {settings.ui?.animations ?? true ? (
            <AnimatePresence mode="wait">
              {selectedChannel && selectedStream ? (
                <PlayerSection
                  channel={selectedChannel}
                  stream={selectedStream}
                  streams={streams}
                  onBack={() => {
                    setSelectedChannel(null);
                    setSelectedStream(null);
                  }}
                />
              ) : (
                <ChannelSection
                  channels={visibleChannels}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  onCategoryChange={setSelectedCategory}
                  onChannelSelect={handleChannelSelect}
                />
              )}
            </AnimatePresence>
          ) : (
            <>
              {selectedChannel && selectedStream ? (
                <PlayerSection
                  channel={selectedChannel}
                  stream={selectedStream}
                  streams={streams}
                  onBack={() => {
                    setSelectedChannel(null);
                    setSelectedStream(null);
                  }}
                />
              ) : (
                <ChannelSection
                  channels={visibleChannels}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  onCategoryChange={setSelectedCategory}
                  onChannelSelect={handleChannelSelect}
                />
              )}
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
