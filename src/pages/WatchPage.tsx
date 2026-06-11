import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { PlayerSection } from '../components/player/PlayerSection';
import { WatchSidebar } from '../components/watch/WatchSidebar';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Header } from '../components/layout/Header';
import LoadingScreen from '../components/LoadingScreen';
import MobileNav from '../components/MobileNav';
import SearchOverlay from '../components/SearchOverlay';
import useStore from '../store/useStore';

export function WatchPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const navigate = useNavigate();
  const {
    channels,
    categories,
    languages,
    countries,
    loading,
    getStreamsForChannel,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLanguage,
    setSelectedLanguage,
  } = useData();
  const { addToWatchHistory } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const channel = useMemo(() => {
    if (!channelId) return null;
    return channels.find((c) => c.id === channelId) || null;
  }, [channels, channelId]);

  const channelStreams = useMemo(() => {
    if (!channelId) return [];
    return getStreamsForChannel(channelId);
  }, [channelId, getStreamsForChannel]);

  const primaryStream = useMemo(() => channelStreams[0] || null, [channelStreams]);

  // Find related channels prioritized by: same language → same category → same country — up to 40
  const relatedChannels = useMemo(() => {
    if (!channel) return [];

    const channelLangs = channel.languages || [];
    const scored = channels
      .filter((c) => c.id !== channel.id)
      .map((c) => {
        const cLangs = c.languages || [];
        const sameLang = channelLangs.some((l) => cLangs.includes(l));
        const sameCat = c.categories.some((cat) => channel.categories.includes(cat));
        const sameCountry = c.country === channel.country;
        let score = 0;
        if (sameLang && sameCat) score = 4;
        else if (sameLang) score = 3;
        else if (sameCountry && sameCat) score = 2;
        else if (sameCountry) score = 1;
        return { channel: c, sameLang, sameCat, sameCountry, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map((item) => item.channel);

    return scored;
  }, [channels, channel]);

  useEffect(() => {
    if (channelId) addToWatchHistory(channelId);
  }, [channelId, addToWatchHistory]);

  const handleBack = () => navigate(-1);
  const handleChannelSelect = (id: string) => navigate(`/watch/${id}`);

  const sharedHeader = (
    <>
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
    </>
  );

  if (loading) return <LoadingScreen />;

  if (!channel || !primaryStream) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {sharedHeader}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-16">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-destructive/20 rounded-full" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10">
                <AlertTriangle className="h-9 w-9 text-destructive" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-foreground mb-1">
                {!channel ? 'Channel Not Found' : 'No Stream Available'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {!channel
                  ? `The channel with ID "${channelId}" was not found.`
                  : 'This channel does not have any working streams at the moment.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Channels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        {sharedHeader}

        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-4">
          {/* YouTube-style two-column layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left column: Player + info */}
            <div className="flex-1 min-w-0">
              <motion.div
                key={channelId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PlayerSection
                  channel={channel}
                  stream={primaryStream}
                  streams={channelStreams}
                  onBack={handleBack}
                />
              </motion.div>
            </div>

            {/* Right column: Suggestions sidebar */}
            <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
              <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto scrollbar-thin">
                <WatchSidebar
                  channels={channels}
                  categories={categories}
                  currentChannel={channel}
                  relatedChannels={relatedChannels}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}