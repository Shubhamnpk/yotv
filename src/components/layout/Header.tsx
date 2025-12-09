import { Menu, Search } from 'lucide-react';
import SimpleSearch from '../search/SimpleSearch';
import Settings from '../Settings';
import Logo from '../Logo';
import type { Category, Language } from '../../types';

interface HeaderProps {
  searchQuery: string;
  onMobileMenuOpen: () => void;
  onSearch: (query: string) => void;
  onMobileSearchOpen?: () => void;
  languages: Language[];
  categories: Category[];
  countries?: { code: string; name: string }[];
}

export function Header({ searchQuery, onMobileMenuOpen, onSearch, onMobileSearchOpen, languages, categories, countries = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuOpen}
              className="lg:hidden p-2 rounded-lg hover:bg-accent min-w-[44px] min-h-[44px]
                flex items-center justify-center touch-target"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo />
          </div>

          <div className="flex items-center gap-4">
            <SimpleSearch
              value={searchQuery}
              onChange={onSearch}
              className="w-full max-w-md"
              placeholder="Search channels..."
            />
            {onMobileSearchOpen && (
              <button
                onClick={onMobileSearchOpen}
                className="sm:hidden p-2 rounded-lg hover:bg-accent min-w-[44px] min-h-[44px]
                  flex items-center justify-center touch-target"
                aria-label="Open search"
              >
                <Search className="w-6 h-6" />
              </button>
            )}
            <Settings languages={languages} countries={countries} categories={categories} />
          </div>
        </div>
      </div>
    </header>
  );
}
