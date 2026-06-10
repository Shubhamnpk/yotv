import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle, Tv2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { PlayerSection } from '../components/player/PlayerSection';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Header } from '../components/layout/Header';
import LoadingScreen from '../components/LoadingScreen';
import ChannelCard from '../components/ChannelCard';
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

  // Find related channels: same category first, then same country — up to 18
  const relatedChannels = useMemo(() => {
    if (!channel) return [];

    const sameCat = channels.filter((c) => {
      if (c.id === channel.id) return false;
      return c.categories.some((cat) => channel.categories.includes(cat));
    });

    const sameCountry = channels.filter(
      (c) => c.id !== channel.id && c.country === channel.country && !sameCat.find((x) => x.id === c.id)
    );

    return [...sameCat, ...sameCountry].slice(0, 18);
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

  const categoryLabel = channel.categories
    .map((cat) => categories.find((c) => c.id === cat)?.name || cat)
    .join(' · ');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        {sharedHeader}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
          {/* Player */}
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

          {/* Related channels */}
          {relatedChannels.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Tv2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-foreground">More Like This</h2>
                  {categoryLabel && (
                    <p className="text-xs text-muted-foreground">{categoryLabel}</p>
                  )}
                </div>
                <span className="ml-auto text-xs font-semibold text-muted-foreground border border-border/50 rounded-full px-3 py-1">
                  {relatedChannels.length} channels
                </span>
              </div>

              {/* Netflix-style 4-col grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {relatedChannels.map((relatedChannel) => (
                  <ChannelCard
                    key={relatedChannel.id}
                    channel={relatedChannel}
                    viewMode="grid"
                    onClick={() => handleChannelSelect(relatedChannel.id)}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}