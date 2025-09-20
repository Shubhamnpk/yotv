import { motion } from 'framer-motion';
import { Suspense } from 'react';
import VideoPlayer from '../VideoPlayer';
import type { Channel, Stream } from '../../types';

interface PlayerSectionProps {
  channel: Channel;
  stream: Stream;
  onBack: () => void;
}

export function PlayerSection({ channel, stream, onBack }: PlayerSectionProps) {
  return (
    <motion.div
      key="player"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <motion.button
        whileHover={{ x: -5 }}
        onClick={onBack}
        className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 
          flex items-center gap-1 mb-4"
      >
        ← Back to channels
      </motion.button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <Suspense
          fallback={
            <div className="aspect-video bg-gray-900 animate-pulse" />
          }
        >
          <VideoPlayer
            src={stream.url}
            poster={channel.logo}
          />
        </Suspense>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {channel.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {channel.categories.map((category) => (
              <span
                key={category}
                className="text-sm px-3 py-1 bg-blue-50 dark:bg-blue-900/30 
                  text-blue-600 dark:text-blue-400 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}