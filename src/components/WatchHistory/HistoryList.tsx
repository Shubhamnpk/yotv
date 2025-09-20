import { AnimatePresence } from 'framer-motion';
import HistoryItem from './HistoryItem';
import type { WatchHistoryItem } from '../../types';

interface HistoryListProps {
  items: WatchHistoryItem[];
  onRemoveItem: (channelId: string) => void;
}

export default function HistoryList({ items, onRemoveItem }: HistoryListProps) {
  const groupedItems = items.reduce((groups, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    return {
      ...groups,
      [date]: [...(groups[date] || []), item],
    };
  }, {} as Record<string, WatchHistoryItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([date, dateItems]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 sticky top-0 
            bg-white dark:bg-gray-800 py-2"
          >
            {date}
          </h3>
          <AnimatePresence mode="popLayout">
            {dateItems.map((item) => (
              <HistoryItem
                key={`${item.channelId}-${item.timestamp}`}
                item={item}
                onRemove={onRemoveItem}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}