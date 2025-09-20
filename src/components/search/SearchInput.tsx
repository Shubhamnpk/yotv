import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  expanded?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, expanded = true, ...props }, ref) => {
    return (
      <div className={cn(
        'relative flex items-center min-w-[200px]',
        expanded ? 'w-full' : 'w-11',
        'transition-all duration-300',
        className
      )}>
        <Search 
          className="absolute left-3 w-5 h-5 text-blue-500 dark:text-blue-400 
            pointer-events-none transform transition-transform" 
        />
        <input
          ref={ref}
          type="text"
          className={cn(
            'w-full h-12 pl-11 pr-11',
            'bg-gray-50 dark:bg-gray-800/50',
            'border-2 border-gray-200 dark:border-gray-700',
            'rounded-xl text-base',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
            'dark:focus:border-blue-400 dark:focus:ring-blue-400/20',
            'transition-all duration-200 ease-in-out',
            !expanded && 'opacity-0'
          )}
          {...props}
        />
        <AnimatePresence>
          {value && expanded && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClear}
              className="absolute right-3 p-1.5 rounded-full 
                bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 
                dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 
                dark:text-gray-400 dark:hover:text-gray-200 
                transition-all duration-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;