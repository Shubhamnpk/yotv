import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Tv className="w-16 h-16 text-blue-500" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-2 bg-blue-500/20 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ x: -200 }}
              animate={{ x: 200 }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="h-full w-1/2 bg-blue-500 rounded-full"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Loading your channels...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}