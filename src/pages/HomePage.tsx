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
          {/* FIFA 2026 Banner */}
          <button
            onClick={() => navigate('/watch/dash-fifa')}
            className="w-full mb-6 group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer text-left"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />
            <div className="relative flex items-center gap-4 sm:gap-6 p-4 sm:p-6">
              <div className="flex h-14 w-14 sm:h-20 sm:w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner">
                <Trophy className="h-7 w-7 sm:h-10 sm:w-10 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400/90">Live Now</p>
                <h3 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">FIFA 2026</h3>
                <p className="text-xs sm:text-sm text-white/70 mt-1">Watch live football matches in HD</p>
              </div>
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300">
                <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white ml-0.5" />
              </div>
            </div>
          </button>

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