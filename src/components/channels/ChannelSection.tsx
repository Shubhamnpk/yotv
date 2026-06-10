import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioTower, Sparkles, Grid, List, History } from 'lucide-react';
import QuickFilters from '../QuickFilters';
import ChannelGrid from '../ChannelGrid';
import ChannelCard from '../ChannelCard';
import type { Channel, Category } from '../../types';
import useStore from '../../store/useStore';
import { cn } from '../../utils/cn';

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
  const { settings, updateUISettings } = useStore();
  const categoryName = selectedCategory
    ? categories.find((category) => category.id === selectedCategory)?.name
    : null;

  // Resolve recently watched channel objects from store history
  const recentlyWatched = useMemo(() => {
    if (!settings.watchHistory) return [];
    return settings.watchHistory
      .map((item) => channels.find((c) => c.id === item.channelId))
      .filter((c): c is Channel => !!c)
      .slice(0, 10);
  }, [settings.watchHistory, channels]);

  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Welcome & Counter Header Card */}
      <section className="overflow-hidden rounded-2xl border border-border/50 bg-card/30 shadow-md backdrop-blur-md relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between relative z-10">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-primary">
              <Sparkles className="h-4 w-4" />
              <span>{categoryName || (searchQuery ? 'Search View' : 'Global Streams')}</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {categoryName || (searchQuery ? `Results for "${searchQuery}"` : 'Your Gateway to Global TV')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg">
              Enjoy lightning-fast IPTV streaming. Switch layout view modes, filter categories, and mark your favorite streams.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Grid vs List view Toggle */}
            <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-background/50 p-1 shadow-inner">
              <button
                type="button"
                onClick={() => updateUISettings({ viewMode: 'grid' })}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  settings.ui.viewMode === 'grid'
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Grid view"
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => updateUISettings({ viewMode: 'list' })}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  settings.ui.viewMode === 'list'
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="List view"
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-4 py-2 shadow-inner">
              <RadioTower className="h-5 w-5 text-primary animate-pulse" />
              <div>
                <div className="text-xl font-extrabold leading-none">{channels.length}</div>
                <div className="mt-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">channels</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Watched Carousel */}
      <AnimatePresence>
        {!searchQuery && !selectedCategory && recentlyWatched.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary shadow-inner">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Recently Watched</h3>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide snap-x snap-mandatory">
              {recentlyWatched.map((channel) => (
                <div key={`recent-${channel.id}`} className="w-64 flex-shrink-0 snap-start">
                  <ChannelCard
                    channel={channel}
                    viewMode="grid"
                    onClick={() => onChannelSelect(channel)}
                  />
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

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
          className="flex flex-col items-center justify-center py-16 px-6 glass-panel rounded-2xl"
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
              onClick={() => window.location.reload()}
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
