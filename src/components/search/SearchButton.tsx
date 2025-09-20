import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
  label?: string;
}

export default function SearchButton({ 
  onClick, 
  className,
  label = 'Search'
}: SearchButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'min-w-[44px] h-12 flex items-center justify-center gap-2',
        'rounded-xl bg-gradient-to-r from-blue-500 to-blue-600',
        'text-white font-medium shadow-lg shadow-blue-500/25',
        'hover:from-blue-600 hover:to-blue-700',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        'dark:focus:ring-blue-400/50 dark:focus:ring-offset-gray-900',
        'transition-all duration-200 ease-in-out transform',
        className
      )}
      aria-label={label}
    >
      <Search className="w-5 h-5" />
      <span className="hidden sm:inline">Search</span>
    </motion.button>
  );
}