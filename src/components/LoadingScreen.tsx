import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-6 text-center">
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
            className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg"
          >
            <Tv className="h-8 w-8" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="h-2 overflow-hidden rounded-full bg-muted"
          >
            <motion.div
              initial={{ x: -200 }}
              animate={{ x: 200 }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="h-full w-1/2 rounded-full bg-primary"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-muted-foreground"
          >
            Loading live channels...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
