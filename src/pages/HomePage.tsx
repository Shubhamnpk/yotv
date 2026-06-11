import { ErrorBoundary } from '../components/ErrorBoundary';
import { Header } from '../components/layout/Header';
import { ChannelSection } from '../components/channels/ChannelSection';
import MobileNav from '../components/MobileNav';
import SearchOverlay from '../components/SearchOverlay';
import LoadingScreen from '../components/LoadingScreen';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function HomePage() {
  const {
    loading,
    filteredChannels,
    visibleChannels,
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
  const navigate = useNavigate();

  const handleChannelSelect = (channelId: string) => {
    navigate(`/watch/${channelId}`);
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

        <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-4">
          <ChannelSection
            channels={visibleChannels}
            totalCount={filteredChannels.length}
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onChannelSelect={(channel) => handleChannelSelect(channel.id)}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}