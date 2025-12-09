import { motion } from 'framer-motion';
import QuickFilters from '../QuickFilters';
import ChannelGrid from '../ChannelGrid';
import type { Channel, Category, Language, Country } from '../../types';

interface ChannelSectionProps {
  channels: Channel[];
  categories: Category[];
  languages: Language[];
  countries: Country[];
  selectedCategory: string | null;
  selectedLanguage: string | null;
  searchQuery: string;
  onCategoryChange: (category: string | null) => void;
  onLanguageChange: (language: string | null) => void;
  onChannelSelect: (channel: Channel) => void;
}

export function ChannelSection({
  channels,
  categories,
  languages,
  countries,
  selectedCategory,
  selectedLanguage,
  searchQuery,
  onCategoryChange,
  onLanguageChange,
  onChannelSelect,
}: ChannelSectionProps) {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <QuickFilters
        categories={categories}
        languages={languages}
        countries={countries}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        onLanguageChange={onLanguageChange}
      />
      {channels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-16 px-6"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-full border border-primary/30">
              <svg
                className="w-16 h-16 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {searchQuery ? 'No Channels Found' : 'No Channels Available'}
          </h3>
          <p className="text-muted-foreground text-center max-w-md leading-relaxed">
            {searchQuery
              ? 'We couldn\'t find any channels matching your search. Try using different keywords or clear your search to explore all available channels.'
              : 'No channels were found matching your current filters. Try adjusting your filter preferences to see more results.'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => window.location.reload()} // or pass a clear function
              className="mt-4 px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium transition-colors"
            >
              Clear Search
            </button>
          )}
        </motion.div>
      ) : (
        <ChannelGrid
          channels={channels}
          categories={categories}
          selectedCategory={selectedCategory}
          onChannelSelect={onChannelSelect}
        />
      )}
    </motion.div>
  );
}
