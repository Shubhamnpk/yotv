import { useState, useMemo, useCallback } from 'react';
import { Search, Check } from 'lucide-react';
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
}

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
      updateKey: 'preferredLanguages'
    },
    {
      title: 'Countries',
      items: countries,
      selected: settings.preferredCountries,
      idKey: 'code',
      nameKey: 'name',
      updateKey: 'preferredCountries'
    },
    {
      title: 'Categories',
      items: categories,
      selected: settings.preferredCategories,
      idKey: 'id',
      nameKey: 'name',
      updateKey: 'preferredCategories'
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
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg
            bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {sections.map(section => {
        const itemsToShow = showMore[section.title]
          ? filteredItems(section.items, section.nameKey)
          : filteredItems(section.items, section.nameKey).slice(0, 5);

        return (
          <div key={section.title} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleAll(section, true)}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Select All
                </button>
                <button
                  onClick={() => handleToggleAll(section, false)}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Clear
                </button>
              </div>
            </div>

            {showMore[section.title] && (
              <button
                onClick={() => handleShowMore(section.title)}
                className="text-sm text-primary hover:text-primary/80"
              >
                Show Less
              </button>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {itemsToShow.map((item: any) => (
                <button
                  key={item[section.idKey]}
                  onClick={() => handleToggleItem(section, item[section.idKey])}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg text-left transition-colors',
                    section.selected.includes(item[section.idKey])
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground'
                  )}
                >
                  {section.selected.includes(item[section.idKey]) ? (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                  <span className="truncate">{item[section.nameKey]}</span>
                </button>
              ))}
            </div>

            {filteredItems(section.items, section.nameKey).length > 5 && (
              <button
                onClick={() => handleShowMore(section.title)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                {showMore[section.title] ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}