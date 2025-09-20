import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '../../utils/dateUtils';
import type { WatchHistoryItem } from '../../types';

interface HistoryItemProps {
  item: WatchHistoryItem;
  onRemove: (channelId: string) => void;
}

export default function HistoryItem({ item, onRemove }: HistoryItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-between p-4 rounded-lg
        bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800
        transition-colors duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-full
          flex items-center justify-center text-blue-500"
        >
          {item.channelId.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-medium">{item.channelId}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatRelativeTime(item.timestamp)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.channelId)}
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
          hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
        aria-label={`Remove ${item.channelId} from watch history`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}