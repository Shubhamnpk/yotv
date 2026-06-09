import { motion } from 'framer-motion';
import { RadioTower, Sparkles } from 'lucide-react';
import QuickFilters from '../QuickFilters';
import ChannelGrid from '../ChannelGrid';
import type { Channel, Category } from '../../types';

interface ChannelSectionProps {
  channels: Channel[];
  categories: Category[];
  selectedCategory: string | null;
  searchQuery: string;
  onCategoryChange: (category: string | null) => void;
  onChannelSelect: (channel: Channel) => void;
}

export function ChannelSection({
  channels,
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onChannelSelect,
}: ChannelSectionProps) {
  const categoryName = selectedCategory
    ? categories.find((category) => category.id === selectedCategory)?.name
    : null;

  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>{categoryName || (searchQuery ? 'Search' : 'Live TV')}</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {categoryName || (searchQuery ? `Results for "${searchQuery}"` : 'Working channels, ready to watch')}
            </h2>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
            <RadioTower className="h-5 w-5 text-primary" />
            <div>
              <div className="text-lg font-semibold leading-none">{channels.length}</div>
              <div className="mt-1 text-xs text-muted-foreground">channels</div>
            </div>
          </div>
        </div>
      </section>

      <QuickFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
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
