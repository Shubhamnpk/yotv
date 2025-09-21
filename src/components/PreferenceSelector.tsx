import { useState, useMemo, useCallback } from 'react';
import { Search, Check, Globe, MapPin, Tag, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';

interface PreferenceSelectorProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
}

interface Section {
  title: string;
  items: any[];
  selected: string[];
  idKey: string;
  nameKey: string;
  updateKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Highlight text component
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-600 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

// Get flag emoji for country code
const getCountryFlag = (code: string) => {
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function PreferenceSelector({
  languages,
  countries,
  categories
}: PreferenceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({});
  const { settings, updateSettings } = useStore();

  const sections = useMemo(() => [
    {
      title: 'Languages',
      items: languages,
      selected: settings.preferredLanguages,
      idKey: 'code',
      nameKey: 'name',
      updateKey: 'preferredLanguages',
      icon: Globe
    },
    {
      title: 'Countries',
      items: countries,
      selected: settings.preferredCountries,
      idKey: 'code',
      nameKey: 'name',
      updateKey: 'preferredCountries',
      icon: MapPin
    },
    {
      title: 'Categories',
      items: categories,
      selected: settings.preferredCategories,
      idKey: 'id',
      nameKey: 'name',
      updateKey: 'preferredCategories',
      icon: Tag
    }
  ], [languages, countries, categories, settings]);

  const handleToggleAll = useCallback((section: Section, select: boolean) => {
    const ids = select ? section.items.map((item: any) => item[section.idKey]) : [];
    updateSettings({ [section.updateKey]: ids });
  }, [updateSettings]);

  const handleToggleItem = useCallback((section: Section, itemId: string) => {
    const newSelection = section.selected.includes(itemId)
      ? section.selected.filter((id: string) => id !== itemId)
      : [...section.selected, itemId];
    updateSettings({ [section.updateKey]: newSelection });
  }, [updateSettings]);

  const handleShowMore = (sectionTitle: string) => {
    setShowMore(prev => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }));
  };

  const filteredItems = (items: any[], nameKey: string) => {
    return items.filter((item: any) => item[nameKey].toLowerCase().includes(searchQuery));
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Search preferences..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          className="w-full pl-10 pr-10 py-3 border border-input rounded-lg
            bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Search preferences"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {sections.map(section => {
        const filtered = filteredItems(section.items, section.nameKey);
        const isExpanded = showMore[section.title];
        const displayItems = isExpanded ? filtered : filtered.slice(0, 5);

        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <span className="text-sm text-muted-foreground">
                  ({section.selected.length}/{section.items.length})
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleAll(section, true)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  aria-label={`Select all ${section.title.toLowerCase()}`}
                >
                  Select All
                </button>
                <button
                  onClick={() => handleToggleAll(section, false)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  aria-label={`Clear all ${section.title.toLowerCase()}`}
                >
                  Clear
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isExpanded ? 'expanded' : 'collapsed'}
                initial={{ height: 'auto', opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {displayItems.map((item: any) => (
                    <motion.button
                      key={item[section.idKey]}
                      onClick={() => handleToggleItem(section, item[section.idKey])}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 border',
                        section.selected.includes(item[section.idKey])
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground border-border hover:border-primary/50'
                      )}
                      title={`${section.title}: ${item[section.nameKey]}`}
                      aria-label={`${section.selected.includes(item[section.idKey]) ? 'Deselect' : 'Select'} ${item[section.nameKey]} ${section.title.toLowerCase().slice(0, -1)}`}
                    >
                      {section.title === 'Countries' && (
                        <span className="text-lg" role="img" aria-label={`${item[section.nameKey]} flag`}>
                          {getCountryFlag(item[section.idKey])}
                        </span>
                      )}
                      {section.selected.includes(item[section.idKey]) ? (
                        <Check className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-current opacity-30" />
                      )}
                      <span className="truncate flex-1">
                        <HighlightText text={item[section.nameKey]} highlight={searchQuery} />
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {filtered.length > 5 && (
              <motion.button
                onClick={() => handleShowMore(section.title)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`${isExpanded ? 'Show less' : 'Show more'} ${section.title.toLowerCase()}`}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show More ({filtered.length - 5} more)
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}