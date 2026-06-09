import { memo } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { Channel } from '../types';
import useStore from '../store/useStore';
import FavoriteButton from './FavoriteButton';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
}

function ChannelCard({ channel, onClick }: ChannelCardProps) {
  const { settings, toggleFavorite } = useStore();
  const isFavorite = settings.favorites.includes(channel.id);
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm
        transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="h-full w-full object-contain p-6"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-xl font-semibold text-white shadow-inner">
              {initials || 'TV'}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
        <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-950 opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </div>
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            toggleFavorite(channel.id);
          }}
          className="absolute top-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="p-4">
        <h3 className="mb-3 truncate font-semibold text-card-foreground">
          {channel.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {channel.categories.slice(0, 2).map(category => (
            <span
              key={category}
              className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {category}
            </span>
          ))}
          {channel.categories.length > 2 && (
            <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              +{channel.categories.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ChannelCard);
