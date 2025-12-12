import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  fetchChannels,
  fetchStreams,
  fetchCategories,
  fetchLanguages,
  fetchCountries,
  fetchLogos,
} from './api';
import type { Channel, Stream, Category, Language, Country, Logo } from './types';
import { isValidStreamUrl } from './utils/streamUtils';
import { filterChannels } from './hooks/useSearchSuggestions';
import LoadingScreen from './components/LoadingScreen';
import MobileNav from './components/MobileNav';
import SearchOverlay from './components/SearchOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/layout/Header';
import { PlayerSection } from './components/player/PlayerSection';
import { ChannelSection } from './components/channels/ChannelSection';
import Onboarding from './components/Onboarding';
import useStore from './store/useStore';
import { applyTheme } from './utils/themeUtils';
import youtubeSourcesData from './data/youtube-sources.json';

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [logos, setLogos] = useState<Logo[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopstate = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, []);

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
  const { settings } = useStore();

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    if (!loading && countries.length > 0 && settings.preferredCountries.length === 0) {
      setShowOnboarding(true);
    }
  }, [loading, countries, settings.preferredCountries]);

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

        const logoMap = new Map<string, string>();
        logosData.forEach((logo: Logo) => {
          if (!logoMap.has(logo.channel)) {
            logoMap.set(logo.channel, logo.url);
          }
        });

        const countryLanguages = new Map<string, string[]>();
        const countryNameToCode = new Map<string, string>();
        countriesData.forEach((country: Country) => {
          countryLanguages.set(country.code, country.languages);
          countryNameToCode.set(country.name, country.code);
        });

        const apiChannels = channelsData.map((channel: Channel) => ({
          ...channel,
          logo: logoMap.get(channel.id),
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
        setStreams([
          ...streamsData.filter((stream: Stream) => isValidStreamUrl(stream.url)),
          ...youtubeStreams,
        ]);
        setCategories(categoriesData);
        setLanguages(languagesData);
        setCountries(countriesData);
        setLogos(logosData);
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
                  countries={countries}
                  selectedCategory={selectedCategory}
                  selectedLanguage={selectedLanguage}
                  searchQuery={searchQuery}
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
                      countries={countries}
                      selectedCategory={selectedCategory}
                      selectedLanguage={selectedLanguage}
                      onCategoryChange={setSelectedCategory}
                      onLanguageChange={setSelectedLanguage}
                      onChannelSelect={handleChannelSelect} searchQuery={''}                />
              )}
            </>
          )}
        </main>

        <Onboarding
          countries={countries}
          isOpen={showOnboarding}
          onComplete={() => setShowOnboarding(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
