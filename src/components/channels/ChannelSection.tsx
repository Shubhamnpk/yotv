import { motion } from 'framer-motion';
import QuickFilters from '../QuickFilters';
import ChannelGrid from '../ChannelGrid';
import type { Channel, Category, Language } from '../../types';

interface ChannelSectionProps {
  channels: Channel[];
  categories: Category[];
  languages: Language[];
  selectedCategory: string | null;
  selectedLanguage: string | null;
  onCategoryChange: (category: string | null) => void;
  onLanguageChange: (language: string | null) => void;
  onChannelSelect: (channel: Channel) => void;
}

export function ChannelSection({
  channels,
  categories,
  languages,
  selectedCategory,
  selectedLanguage,
  onCategoryChange,
  onLanguageChange,
  onChannelSelect,
}: ChannelSectionProps) {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <QuickFilters
        categories={categories}
        languages={languages}
        countries={[]}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        onLanguageChange={onLanguageChange}
      />
      <ChannelGrid
        channels={channels}
        categories={categories}
        selectedCategory={selectedCategory}
        onChannelSelect={onChannelSelect}
      />
    </motion.div>
  );
}