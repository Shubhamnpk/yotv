import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useInView } from 'react-intersection-observer';
import type { Channel } from '../types';
import ChannelCard from './ChannelCard';
import FavoriteChannels from './FavoriteChannels';
import useStore from '../store/useStore';

interface ChannelGridProps {
  channels: Channel[];
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  onChannelSelect: (channel: Channel) => void;
}

export default function ChannelGrid({ channels, categories, selectedCategory, onChannelSelect }: ChannelGridProps) {
  const { settings } = useStore();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const favoriteChannels = useMemo(() => 
    channels.filter(channel => settings.favorites.includes(channel.id)),
    [channels, settings.favorites]
  );

  const nonFavoriteChannels = useMemo(() =>
    channels.filter(channel => !settings.favorites.includes(channel.id)),
    [channels, settings.favorites]
  );

  const [columnCount, setColumnCount] = React.useState(Math.floor((window.innerWidth - 48) / 300));

  React.useEffect(() => {
    const handleResize = () => setColumnCount(Math.floor((window.innerWidth - 48) / 300));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allChannelsParentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(nonFavoriteChannels.length / columnCount),
    getScrollElement: () => allChannelsParentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  });

  return (
    <div ref={ref} className="space-y-8">
      {inView && (
        <>
          <FavoriteChannels
            channels={favoriteChannels}
            onChannelSelect={onChannelSelect}
          />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {selectedCategory
                  ? categories.find(cat => cat.id === selectedCategory)?.name || 'All Channels'
                  : 'All Channels'
                }
              </h2>
              <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full">
                {nonFavoriteChannels.length}
              </span>
            </div>

            <div
              ref={allChannelsParentRef}
              className="h-[600px] overflow-auto rounded-xl"
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const startIndex = virtualRow.index * columnCount;
                  const channelSlice = nonFavoriteChannels.slice(startIndex, startIndex + columnCount);

                  return (
                    <div
                      key={virtualRow.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className={`grid gap-6 p-4 ${
                        settings.ui?.gridSize === 'small'
                          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                          : settings.ui?.gridSize === 'large'
                          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      }`}
                    >
                      {channelSlice.map((channel) => (
                        <ChannelCard
                          key={channel.id}
                          channel={channel}
                          onClick={() => onChannelSelect(channel)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}