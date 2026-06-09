import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, Search } from "lucide-react";
import { useState, useEffect } from "react";
import type { Category } from "../types";
import { cn } from "../utils/cn";

interface CategoryExpandedProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: Category[];
  selectedItem: string | null;
  onItemSelect: (item: string | null) => void;
  getLabel: (item: Category) => string;
  getValue: (item: Category) => string;
}

export default function CategoryExpanded({
  isOpen,
  onClose,
  title,
  items,
  selectedItem,
  onItemSelect,
  getLabel,
  getValue,
}: CategoryExpandedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [visibleItems, setVisibleItems] = useState(items.slice(0,11));
  const [tempSelectedItem, setTempSelectedItem] = useState<string | null>(selectedItem);

  useEffect(() => {
    const filtered = items.filter((item) =>
      getLabel(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
    setVisibleItems(filtered.slice(0, 11));
  }, [searchQuery, items, getLabel]);

  const loadMoreItems = () => {
    setVisibleItems((prev) => [
      ...prev,
      ...filteredItems.slice(prev.length, prev.length + 6),
    ]);
  };

  const handleItemSelect = (item: string | null) => {
    setTempSelectedItem(item);
  };

  const handleSelectAll = () => {
    setTempSelectedItem(null);
  };

  const handleSave = () => {
    onItemSelect(tempSelectedItem);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute inset-x-0 top-full mt-2 bg-popover
            rounded-lg shadow-lg border border-border z-20"
        >
          {/* Header */}
          <div className="p-3 border-b border-border flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted-foreground
                hover:text-foreground transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-medium text-base">{title}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground
                hover:bg-accent rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full pl-10 pr-3 py-2 text-sm rounded-md bg-muted
                  border-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground
                  transition"
              />
            </div>
          </div>

          {/* Selected Items */}
          {tempSelectedItem && (
            <div className="border-b border-border pb-2 mb-2 px-3">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Selected Item
              </h3>
              <button
                onClick={() => handleItemSelect(null)}
                className="px-3 py-2 rounded-md bg-primary/10
                  text-primary font-medium text-sm shadow w-full"
              >
                {getLabel(
                  items.find((item) => getValue(item) === tempSelectedItem)
                )}
              </button>
            </div>
          )}

          {/* Items */}
          <div className="grid grid-cols-6 gap-2 px-3 py-2 max-h-[30vh] overflow-y-auto">
            <button
              onClick={handleSelectAll}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium text-center transition-all",
                tempSelectedItem === null
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground"
              )}
            >
              Select All
            </button>
            {visibleItems.map((item) => (
              <button
                key={getValue(item)}
                onClick={() => handleItemSelect(getValue(item))}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium truncate transition-all",
                  tempSelectedItem === getValue(item)
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground"
                )}
              >
                {getLabel(item)}
              </button>
            ))}
          </div>

          {/* Load More */}
          {filteredItems.length > visibleItems.length && (
            <div className="text-center py-2">
              <button
                onClick={loadMoreItems}
                className="text-primary text-sm font-medium hover:underline"
              >
                Load more
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="p-3 border-t border-border flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-muted
                text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground
                font-medium shadow hover:bg-primary/90 transition"
            >
              Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
