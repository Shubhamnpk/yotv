import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import CategoryExpanded from './CategoryExpanded';

interface QuickFiltersProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
  onLanguageChange: (lang: string | null) => void;
  onCategoryChange: (cat: string | null) => void;
}

export default function QuickFilters({
  languages,
  categories,
  onLanguageChange,
  onCategoryChange
}: QuickFiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { settings } = useStore();

  const sections = [
    {
      id: 'languages',
      title: 'Popular Languages',
      items: languages.slice(0, 5),
      allItems: languages,
      selected: settings.preferredLanguages,
      onChange: onLanguageChange,
      getLabel: (item: any) => item.name,
      getValue: (item: any) => item.code
    },
    {
      id: 'categories',
      title: 'Top Categories',
      items: categories.slice(0, 5),
      allItems: categories,
      selected: settings.preferredCategories,
      onChange: onCategoryChange,
      getLabel: (item: any) => item.name,
      getValue: (item: any) => item.id
    }
  ];

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x 
        divide-gray-200 dark:divide-gray-700">
        {sections.map(section => (
          <div key={section.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {section.title}
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1
                  px-2 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                More
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {section.items.map(item => (
                <motion.button
                  key={section.getValue(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => section.onChange(section.getValue(item))}
                  className={cn(
                    'px-2.5 py-1 text-sm rounded-full transition-all',
                    'hover:ring-2 hover:ring-blue-500/20',
                    section.selected.includes(section.getValue(item))
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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