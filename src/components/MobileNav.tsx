import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Category, Language } from '../types';
import { cn } from '../utils/cn';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  languages: Language[];
  selectedCategory: string | null;
  selectedLanguage: string | null;
  onCategoryChange: (category: string | null) => void;
  onLanguageChange: (language: string | null) => void;
}

export default function MobileNav({
  isOpen,
  onClose,
  categories,
  languages,
  selectedCategory,
  selectedLanguage,
  onCategoryChange,
  onLanguageChange,
}: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 
              shadow-xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 
                    dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 
                    dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onCategoryChange(null);
                      onClose();
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left rounded-lg transition-colors',
                      selectedCategory === null
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        onCategoryChange(category.id);
                        onClose();
                      }}
                      className={cn(
                        'w-full px-3 py-2 text-left rounded-lg transition-colors',
                        selectedCategory === category.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Languages
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onLanguageChange(null);
                      onClose();
                    }}
                    className={cn(
                      'w-full px-3 py-2 text-left rounded-lg transition-colors',
                      selectedLanguage === null
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    All Languages
                  </button>
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        onLanguageChange(language.code);
                        onClose();
                      }}
                      className={cn(
                        'w-full px-3 py-2 text-left rounded-lg transition-colors',
                        selectedLanguage === language.code
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}