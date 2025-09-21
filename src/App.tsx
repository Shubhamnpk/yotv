import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  fetchChannels,
  fetchStreams,
  fetchCategories,
  fetchLanguages,
} from './api';
import type { Channel, Stream, Category, Language } from './types';
import { isValidStreamUrl } from './utils/streamUtils';
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

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { settings } = useStore();

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const [channelsData, streamsData, categoriesData, languagesData] =
          await Promise.all([
            fetchChannels(),
            fetchStreams(),
            fetchCategories(),
            fetchLanguages(),
          ]).catch((error) => {
            console.error('Error fetching data:', error);
            return [[], [], [], []];
          });

        if (abortController.signal.aborted) return;

        const youtubeChannels = youtubeSourcesData.sources.map((source) => ({
          id: source.id,
          name: source.name,
          country: source.country,
          languages: [source.lang],
          categories: source.categories,
          logo: source.img,
        }));

        const youtubeStreams = youtubeSourcesData.sources.map((source) => ({
          channel: source.id,
          url: source.url,
        }));

        setChannels([...channelsData, ...youtubeChannels]);
        setStreams([
          ...streamsData.filter((stream: Stream) => isValidStreamUrl(stream.url)),
          ...youtubeStreams,
        ]);
        setCategories(categoriesData);
        setLanguages(languagesData);
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
    return validChannels.filter((channel) => {
      const matchesSearch = channel.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || channel.categories.includes(selectedCategory);
      const matchesLanguage =
        !selectedLanguage || channel.languages.includes(selectedLanguage);
      const matchesPreferences =
        settings.preferredCategories.length === 0 ||
        channel.categories.some((cat) =>
          settings.preferredCategories.includes(cat)
        );
      return matchesSearch && matchesCategory && matchesLanguage && matchesPreferences;
    });
  }, [
    validChannels,
    searchQuery,
    selectedCategory,
    selectedLanguage,
    settings.preferredCategories,
  ]);

  const handleChannelSelect = (channel: Channel) => {
    const stream = streams.find((s) => s.channel === channel.id);
    setSelectedChannel(channel);
    setSelectedStream(stream || null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <Header
          onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
          onSearch={setSearchQuery}
          onMobileSearchOpen={() => setIsSearchOpen(true)}
          languages={languages}
          categories={categories}
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
                  onBack={() => {
                    setSelectedChannel(null);
                    setSelectedStream(null);
                  }}
                />
              ) : (
                <ChannelSection
                  channels={filteredChannels}
                  categories={categories}
                  languages={languages}
                  selectedCategory={selectedCategory}
                  selectedLanguage={selectedLanguage}
                  onCategoryChange={setSelectedCategory}
                  onLanguageChange={setSelectedLanguage}
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
                  onBack={() => {
                    setSelectedChannel(null);
                    setSelectedStream(null);
                  }}
                />
              ) : (
                <ChannelSection
                  channels={filteredChannels}
                  categories={categories}
                  languages={languages}
                  selectedCategory={selectedCategory}
                  selectedLanguage={selectedLanguage}
                  onCategoryChange={setSelectedCategory}
                  onLanguageChange={setSelectedLanguage}
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