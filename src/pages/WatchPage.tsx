import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
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
    streams,
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

  const primaryStream = useMemo(() => {
    return channelStreams[0] || null;
  }, [channelStreams]);

  // Find related channels based on matching categories
  const relatedChannels = useMemo(() => {
    if (!channel || !channel.categories.length) return [];
    
    return channels
      .filter((c) => {
        if (c.id === channel.id) return false;
        const hasMatchingCategory = c.categories.some((cat) =>
          channel.categories.includes(cat)
        );
        return hasMatchingCategory;
      })
      .slice(0, 12);
  }, [channels, channel]);

  // Add to watch history when channel is viewed
  useEffect(() => {
    if (channelId) {
      addToWatchHistory(channelId);
    }
  }, [channelId, addToWatchHistory]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChannelSelect = (channelId: string) => {
    navigate(`/watch/${channelId}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!channel || !primaryStream) {
    return (
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
                  ? `The channel with ID "${channelId}" was not found. It may have been removed or the link is incorrect.`
                  : 'This channel does not have any working streams at the moment.'
                }
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

          {/* More Channels Section - Related by Category */}
          {relatedChannels.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-10 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-primary" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  More Channels
                </h2>
                <span className="text-sm text-muted-foreground">
                  {channel.categories
                    .map((cat) => categories.find((c) => c.id === cat)?.name || cat)
                    .join(', ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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