import { ErrorBoundary } from '../components/ErrorBoundary';
import { Header } from '../components/layout/Header';
import { ChannelSection } from '../components/channels/ChannelSection';
import { Footer } from '../components/layout/Footer';
import MobileNav from '../components/MobileNav';
import SearchOverlay from '../components/SearchOverlay';
import LoadingScreen from '../components/LoadingScreen';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Trophy, Play } from 'lucide-react';

export function HomePage() {
  const {
    loading,
    filteredChannels,
    displayChannels,
    hasMore,
    loadMoreChannels,
    categories,
    languages,
    countries,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLanguage,
    setSelectedLanguage,
  } = useData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleChannelSelect = (channelId: string) => {
    navigate(`/watch/${channelId}`);
  };

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMoreChannels();
        }
      },
      { rootMargin: '300px' }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMoreChannels]);

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

        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-4">

          <ChannelSection
            channels={displayChannels}
            totalCount={filteredChannels.length}
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onChannelSelect={(channel) => handleChannelSelect(channel.id)}
          />
          {hasMore && <div ref={sentinelRef} className="h-4" />}
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}