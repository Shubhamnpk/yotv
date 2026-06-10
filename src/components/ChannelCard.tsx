import { memo } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { Channel } from '../types';
import useStore from '../store/useStore';
import FavoriteButton from './FavoriteButton';

interface ChannelCardProps {
  channel: Channel;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}

function ChannelCard({ channel, onClick, viewMode = 'grid' }: ChannelCardProps) {
  const { settings, toggleFavorite } = useStore();
  const isFavorite = settings.favorites.includes(channel.id);
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const logoFallback = (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-primary/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-bold text-white shadow-lg backdrop-blur-sm">
        {initials || 'TV'}
      </div>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ x: 4 }}
        onClick={onClick}
        className="group flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-card/40 p-3 shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-950 border border-border/50">
            {channel.logo ? (
              <img
                src={channel.logo}
                alt={channel.name}
                className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : logoFallback}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              {channel.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {channel.categories.length > 0 && (
                <span className="text-xs text-primary font-medium px-2 py-0.5 rounded-full bg-primary/10">
                  {channel.categories[0]}
                </span>
              )}
              {channel.country && (
                <span className="text-xs text-muted-foreground">
                  {channel.country}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 scale-75 shadow-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
          </div>
          <FavoriteButton
            isFavorite={isFavorite}
            onClick={(e?: React.MouseEvent) => {
              e?.stopPropagation();
              toggleFavorite(channel.id);
            }}
            className="opacity-60 hover:opacity-100 transition-opacity"
          />
        </div>
      </motion.div>
    );
  }

  // Grid view (standard card layout, upgraded)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/30 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:bg-card cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-primary/10">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : logoFallback}
        
        {/* Visual Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
        
        {/* Play overlay button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground opacity-0 scale-50 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:bg-primary">
            <Play className="ml-1 h-5 w-5 fill-current" />
          </div>
        </div>

        <FavoriteButton
          isFavorite={isFavorite}
          onClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            toggleFavorite(channel.id);
          }}
          className="absolute top-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
        />
      </div>

      <div className="p-4 border-t border-border/20 bg-card/10">
        <h3 className="mb-2 truncate font-bold text-sm tracking-wide text-card-foreground group-hover:text-primary transition-colors">
          {channel.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {channel.categories.slice(0, 2).map(category => (
            <span
              key={category}
              className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase"
            >
              {category}
            </span>
          ))}
          {channel.categories.length > 2 && (
            <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
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
