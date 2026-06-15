import { Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <Link to="/">
      <motion.div
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Tv className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">YoTV</h1>
      </motion.div>
    </Link>
  );
}
