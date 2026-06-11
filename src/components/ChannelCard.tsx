import { memo, useState } from 'react';
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
  const [imageError, setImageError] = useState(false);
  const isFavorite = settings.favorites.includes(channel.id);
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const logoFallback = (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-base font-bold text-white shadow-lg backdrop-blur-sm">
        {initials || 'TV'}
      </div>
    </div>
  );

  /* ── List Mode ── */
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
            {channel.logo && !imageError ? (
              <img
                src={channel.logo}
                alt={channel.name}
                className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                onError={() => setImageError(true)}
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
              {(channel.countryName || channel.country) && (
                <span className="text-xs text-muted-foreground">
                  {channel.countryName || channel.country}
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

  /* ── Netflix-style Grid Card ── */
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ scale: 1.06, zIndex: 10 }}
      transition={{ duration: 0.18 }}
      className="group relative overflow-hidden rounded-lg cursor-pointer shadow-lg hover:shadow-2xl"
      onClick={onClick}
      style={{ transformOrigin: 'center' }}
    >
      {/* Thumbnail — 16:9 */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-primary/10 overflow-hidden">
        {channel.logo && !imageError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="h-full w-full object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : logoFallback}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Live badge */}
        <span className="absolute top-2 left-2 flex items-center gap-1 rounded-sm bg-red-600 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase opacity-90">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Live
        </span>

        {/* Favourite */}
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={(e?: React.MouseEvent) => {
            e?.stopPropagation();
            toggleFavorite(channel.id);
          }}
          className="absolute top-2 right-2 opacity-0 transition-all duration-200 group-hover:opacity-100 z-10 scale-90 group-hover:scale-100"
        />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black opacity-0 scale-75 shadow-xl transition-all duration-200 group-hover:opacity-100 group-hover:scale-100">
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </div>
        </div>

        {/* Channel name strip at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 pt-6">
          <p className="truncate text-xs font-bold text-white drop-shadow-md leading-tight">
            {channel.name}
          </p>
          {channel.categories[0] && (
            <p className="truncate text-[9px] text-white/60 mt-0.5 uppercase tracking-wide">
              {channel.categories[0]}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(ChannelCard);
