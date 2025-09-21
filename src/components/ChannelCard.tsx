import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Channel } from '../types';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import FavoriteButton from './FavoriteButton';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
}

function ChannelCard({ channel, onClick }: ChannelCardProps) {
  const { settings, toggleFavorite } = useStore();
  const isFavorite = settings.favorites.includes(channel.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative bg-card rounded-2xl shadow-lg overflow-hidden
        hover:shadow-xl transition-all duration-300 border border-border card-hover"
      onClick={onClick}
    >
      <div className="aspect-video bg-muted relative">
        <img
          src={channel.logo}
          alt={channel.name}
          className="w-full h-full object-contain p-4"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Logo';
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            toggleFavorite(channel.id);
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      <div className="p-4 pb-6">
        <h3 className="font-semibold text-card-foreground truncate mb-3">
          {channel.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {channel.categories.slice(0, 2).map(category => (
            <span
              key={category}
              className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-full font-medium"
            >
              {category}
            </span>
          ))}
          {channel.categories.length > 2 && (
            <span className="text-xs px-3 py-1.5 bg-muted text-muted-foreground rounded-full font-medium"
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