import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e?: React.MouseEvent) => void;
  className?: string;
  showLabel?: boolean;
}

export default function FavoriteButton({ 
  isFavorite, 
  onClick, 
  className,
  showLabel = false 
}: FavoriteButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-full',
        'bg-white/10 backdrop-blur-sm',
        'transition-all duration-200',
        isFavorite ? 'text-red-500' : 'text-white hover:text-red-500',
        showLabel && 'px-4',
        className
      )}
    >
      <Heart 
        className={cn(
          'w-5 h-5 transition-transform duration-200',
          isFavorite && 'fill-current',
          'group-hover:scale-110'
        )} 
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </span>
      )}
    </motion.button>
  );
}