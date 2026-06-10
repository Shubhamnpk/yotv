import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Category } from '../types';
import { cn } from '../utils/cn';
import CategoryExpanded from './CategoryExpanded';

interface QuickFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
}

export default function QuickFilters({
  categories,
  selectedCategory,
  onCategoryChange
}: QuickFiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/30 p-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Categories
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpandedSection(expandedSection === 'categories' ? null : 'categories')}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-primary transition-all hover:bg-primary/10"
        >
          Browse All
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 pt-1 -mx-4 px-4 snap-x">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(null)}
          className={cn(
            'px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex-shrink-0 snap-start shadow-sm',
            selectedCategory === null
              ? 'bg-primary text-primary-foreground font-extrabold ring-2 ring-primary/20'
              : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card/80'
          )}
        >
          All Channels
        </motion.button>
        
        {categories.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(item.id)}
            className={cn(
              'px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex-shrink-0 snap-start shadow-sm',
              selectedCategory === item.id
                ? 'bg-primary text-primary-foreground font-extrabold ring-2 ring-primary/20'
                : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card/80'
            )}
          >
            {item.name}
          </motion.button>
        ))}
      </div>

      <CategoryExpanded
        isOpen={expandedSection === 'categories'}
        onClose={() => setExpandedSection(null)}
        title="Categories"
        items={categories}
        selectedItem={selectedCategory}
        onItemSelect={onCategoryChange}
        getLabel={(item: Category) => item.name}
        getValue={(item: Category) => item.id}
      />
    </div>
  );
}
