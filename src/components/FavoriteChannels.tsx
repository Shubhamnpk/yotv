import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Channel } from '../types';
import ChannelCard from './ChannelCard';

interface FavoriteChannelsProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
  viewMode?: 'grid' | 'list';
}

export default function FavoriteChannels({ channels, onChannelSelect, viewMode = 'grid' }: FavoriteChannelsProps) {
  if (channels.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="p-2 bg-red-500/10 rounded-full"
        >
          <Heart className="w-5 h-5 text-red-500 fill-current" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold"
        >
          Favorite Channels
        </motion.h2>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
        >
          {channels.length}
        </motion.span>
      </div>
      
      <div className={
        viewMode === 'list'
          ? "grid grid-cols-1 md:grid-cols-2 gap-3"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      }>
        <AnimatePresence mode="popLayout">
          {channels.map((channel) => (
            <motion.div
              key={channel.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ 
                duration: 0.2,
                layout: { duration: 0.3 }
              }}
            >
              <ChannelCard
                channel={channel}
                viewMode={viewMode}
                onClick={() => onChannelSelect(channel)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}