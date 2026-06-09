import { useState, useEffect, useRef } from 'react';
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
  const [maxFit, setMaxFit] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateMaxFit = () => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const buttonWidth = 85; // approximate width per button
      const fit = Math.floor(width / buttonWidth);
      setMaxFit(Math.max(fit, 1)); // at least 1
    }
  };

  useEffect(() => {
    updateMaxFit();
    const handleResize = () => {
      updateMaxFit();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    {
      id: 'categories',
      title: 'Categories',
      items: categories.slice(0, maxFit),
      allItems: categories,
      selected: selectedCategory ? [selectedCategory] : [],
      onChange: onCategoryChange,
      getLabel: (item: Category) => item.name,
      getValue: (item: Category) => item.id
    }
  ];

  return (
    <div className="relative rounded-lg border border-border bg-card shadow-sm">
      <div>
        {sections.map(section => (
          <div key={section.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {section.title}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-primary transition-colors hover:bg-accent hover:text-primary/80"
              >
                More
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            <div ref={containerRef} className="flex gap-2 overflow-hidden">
              {section.id === 'categories' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => section.onChange(null)}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md transition-all',
                    'hover:ring-2 hover:ring-primary/20',
                    selectedCategory === null
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  All
                </motion.button>
              )}
              {section.items.map(item => (
                <motion.button
                  key={section.getValue(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => section.onChange(section.getValue(item))}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md transition-all',
                    'hover:ring-2 hover:ring-primary/20',
                    section.selected.includes(section.getValue(item))
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {section.getLabel(item)}
                </motion.button>
              ))}
            </div>

            <CategoryExpanded
              isOpen={expandedSection === section.id}
              onClose={() => setExpandedSection(null)}
              title={section.title}
              items={section.allItems}
              selectedItem={section.selected[0] || null}
              onItemSelect={section.onChange}
              getLabel={section.getLabel}
              getValue={section.getValue}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
