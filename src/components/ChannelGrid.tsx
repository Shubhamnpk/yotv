import { MonitorPlay } from 'lucide-react';
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

export default function ChannelGrid({
  channels,
  categories,
  selectedCategory,
  onChannelSelect
}: ChannelGridProps) {
  const { settings } = useStore();
  const favoriteChannels = channels.filter((channel) =>
    settings.favorites.includes(channel.id)
  );
  const nonFavoriteChannels = channels.filter((channel) =>
    !settings.favorites.includes(channel.id)
  );
  const title = selectedCategory
    ? categories.find((category) => category.id === selectedCategory)?.name || 'Channels'
    : 'Live now';

  return (
    <div className="space-y-8">
      <FavoriteChannels
        channels={favoriteChannels}
        onChannelSelect={onChannelSelect}
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MonitorPlay className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {nonFavoriteChannels.length} channels
              </p>
            </div>
          </div>
          <span className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground">
            {nonFavoriteChannels.length}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nonFavoriteChannels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onClick={() => onChannelSelect(channel)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
