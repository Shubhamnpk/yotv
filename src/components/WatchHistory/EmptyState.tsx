import { History } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full
        flex items-center justify-center mb-4"
      >
        <History className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No watch history yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
        Your watch history will appear here after you start watching channels
      </p>
    </motion.div>
  );
}