import { Tv } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
    >
      <Tv className="h-8 w-8 text-blue-500" />
      <h1 className="text-xl font-bold">YoTV</h1>
    </motion.div>
  );
}