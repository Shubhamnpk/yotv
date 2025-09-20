import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../../store/useStore';
import HistoryList from './HistoryList';
import EmptyState from './EmptyState';

export default function WatchHistory() {
  const { settings, clearWatchHistory, removeFromWatchHistory } = useStore();

  if (!settings.watchHistory?.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-white 
        dark:bg-gray-800 py-2 z-10"
      >
        <div>
          <h2 className="text-lg font-semibold">Watch History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {settings.watchHistory.length} {settings.watchHistory.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearWatchHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500
            hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </motion.button>
      </div>

      <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
        <HistoryList
          items={settings.watchHistory}
          onRemoveItem={removeFromWatchHistory}
        />
      </div>
    </div>
  );
}