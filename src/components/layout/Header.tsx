import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import ExpandableSearch from '../search/ExpandableSearch';
import Settings from '../Settings';
import Logo from '../Logo';

interface HeaderProps {
  onMobileMenuOpen: () => void;
  onSearch: (query: string) => void;
}

export function Header({ onMobileMenuOpen, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 
      border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuOpen}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 
                dark:hover:bg-gray-700 min-w-[44px] min-h-[44px] 
                flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo />
          </div>

          <div className="flex items-center gap-4">
            <ExpandableSearch
              onSearch={onSearch}
              placeholder="Search channels..."
              className="w-full max-w-md hidden sm:block"
            />
            <Settings />
          </div>
        </div>
      </div>
    </header>
  );
}