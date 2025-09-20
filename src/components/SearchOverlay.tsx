import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import SearchBar from './SearchBar';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
}: SearchOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-50 bg-white dark:bg-gray-900 lg:hidden"
        >
          <div className="safe-area-inset-top" />
          <div className="p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 
                  dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 
                  dark:hover:bg-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                className="flex-1"
                autoFocus
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}