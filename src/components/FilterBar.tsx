import { motion } from 'framer-motion';
import { Filter as FilterIcon } from 'lucide-react';

interface FilterBarProps {
  categories: { id: string; name: string }[];
  languages: { code: string; name: string }[];
  selectedCategory: string | null;
  selectedLanguage: string | null;
  onCategoryChange: (category: string | null) => void;
  onLanguageChange: (language: string | null) => void;
}

export default function FilterBar({
  categories,
  languages,
  selectedCategory,
  selectedLanguage,
  onCategoryChange,
  onLanguageChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <FilterIcon className="w-5 h-5" />
        <h2 className="font-semibold">Filters</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground'
              }`}
            >
              All
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Languages</h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLanguageChange(null)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedLanguage === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground'
              }`}
            >
              All
            </motion.button>
            {languages.map((language) => (
              <motion.button
                key={language.code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLanguageChange(language.code)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedLanguage === language.code
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground'
                }`}
              >
                {language.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}