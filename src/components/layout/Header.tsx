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

export function Header({
  searchQuery,
  onMobileMenuOpen,
  onSearch,
  onMobileSearchOpen,
  languages,
  categories,
  countries = []
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onMobileMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo />
          </div>

          <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
            <SimpleSearch
              value={searchQuery}
              onChange={onSearch}
              className="w-full max-w-lg"
              placeholder="Search channels..."
            />
            <Settings languages={languages} countries={countries} categories={categories} />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onMobileSearchOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Settings languages={languages} countries={countries} categories={categories} />
          </div>
        </div>
      </div>
    </header>
  );
}
