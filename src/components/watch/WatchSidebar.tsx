import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Tv2,
  Heart,
  Clock,
  ChevronDown,
  ChevronUp,
  Globe,
  Languages,
  FolderOpen,
  Music,
  Newspaper,
  Monitor,
  Gamepad2,
  Film,
  Mic2,
} from 'lucide-react';
import type { Channel, Category } from '../../types';
import useStore from '../../store/useStore';

interface WatchSidebarProps {
  channels: Channel[];
  categories: Category[];
  currentChannel: Channel;
  relatedChannels: Channel[];
}

/** YouTube-style compact suggestion item */
function SuggestionItem({
  channel,
  isActive,
  onClick,
}: {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`flex w-full gap-3 p-2 rounded-xl text-left transition-all duration-150 ${
        isActive
          ? 'bg-primary/10 ring-1 ring-inset ring-primary/20'
          : 'hover:bg-accent/40'
      }`}
    >
      <div className="relative w-[168px] flex-shrink-0 aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-primary/10 border border-border/30">
        {channel.logo && !imgErr ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="h-full w-full object-contain p-3 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-bold text-white">
              {initials || 'TV'}
            </div>
          </div>
        )}
        {isActive && (
          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-brightness-75">
            <span className="flex items-center gap-1 rounded-md bg-black/80 px-2 py-0.5 text-[9px] font-bold text-white uppercase shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_4px_1px] shadow-green-500" />
              Now
            </span>
          </div>
        )}
        <div className="absolute bottom-1 right-1 rounded-sm bg-red-600 px-1 py-0.5 text-[9px] font-bold text-white leading-none">
          LIVE
        </div>
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <p className={`text-sm font-semibold leading-tight line-clamp-2 ${
          isActive ? 'text-primary' : 'text-foreground'
        }`}>
          {channel.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground truncate">
          {channel.countryName || channel.country}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {channel.categories[0] && (
            <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 rounded-md px-1.5 py-0.5 truncate max-w-[100px]">
              {channel.categories[0]}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

const categoryIcons: Record<string, React.ElementType> = {
  news: Newspaper,
  sports: Monitor,
  music: Music,
  entertainment: Film,
  gaming: Gamepad2,
  general: Globe,
  talk: Mic2,
};

function getCategoryIcon(catId: string): React.ElementType {
  return categoryIcons[catId.toLowerCase()] || FolderOpen;
}

/** Collapsible suggestion section */
function SuggestionSection({
  label,
  icon: Icon,
  channels,
  currentChannelId,
  onChannelClick,
  defaultExpanded,
}: {
  label: string;
  icon: React.ElementType;
  channels: Channel[];
  currentChannelId: string;
  onChannelClick: (id: string) => void;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (channels.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/30 bg-card/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-accent/40"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
            {label}
          </span>
          <span className="flex-shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
            {channels.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/20"
          >
            <div className="p-2 space-y-0.5">
              {channels.map((ch) => (
                <SuggestionItem
                  key={ch.id}
                  channel={ch}
                  isActive={ch.id === currentChannelId}
                  onClick={() => onChannelClick(ch.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Collapsible category folder */
function CategoryFolder({
  categoryId,
  categoryName,
  channels,
  currentChannelId,
  onChannelClick,
  defaultExpanded,
}: {
  categoryId: string;
  categoryName: string;
  channels: Channel[];
  currentChannelId: string;
  onChannelClick: (id: string) => void;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const Icon = getCategoryIcon(categoryId);

  if (channels.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/30 bg-card/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-accent/40"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
            {categoryName}
          </span>
          <span className="flex-shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
            {channels.length}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/20"
          >
            <div className="p-2 space-y-0.5">
              {channels.map((ch) => (
                <SuggestionItem
                  key={ch.id}
                  channel={ch}
                  isActive={ch.id === currentChannelId}
                  onClick={() => onChannelClick(ch.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WatchSidebar({
  channels,
  categories,
  currentChannel,
  relatedChannels,
}: WatchSidebarProps) {
  const navigate = useNavigate();
  const { settings } = useStore();

  const handleChannelClick = (id: string) => {
    navigate(`/watch/${id}`);
  };

  const currentChannelId = currentChannel.id;

  // Resolve favorites (excluding current)
  const favoriteChannels = useMemo(() => {
    return channels
      .filter((c) => settings.favorites.includes(c.id) && c.id !== currentChannelId)
      .slice(0, 4);
  }, [channels, settings.favorites, currentChannelId]);

  // Resolve recently watched (excluding current)
  const recentChannels = useMemo(() => {
    if (!settings.watchHistory) return [];
    return settings.watchHistory
      .map((item) => channels.find((c) => c.id === item.channelId))
      .filter((c): c is Channel => !!c)
      .filter((c) => c.id !== currentChannelId)
      .slice(0, 4);
  }, [settings.watchHistory, channels, currentChannelId]);

  const currentLangs = currentChannel.languages || [];

  // Group related channels by relevance: same language first, then same country, then others
  const { sameLang, sameCountry, other } = useMemo(() => {
    const sl: Channel[] = [];
    const sc: Channel[] = [];
    const ot: Channel[] = [];

    for (const ch of relatedChannels) {
      if (ch.id === currentChannelId) continue;
      const chLangs = ch.languages || [];
      const sharesLang = currentLangs.some((l) => chLangs.includes(l));
      if (sharesLang) {
        sl.push(ch);
      } else if (ch.country === currentChannel.country) {
        sc.push(ch);
      } else {
        ot.push(ch);
      }
    }
    return { sameLang: sl, sameCountry: sc, other: ot };
  }, [relatedChannels, currentChannelId, currentLangs, currentChannel.country]);

  // Group all related channels (excluding current) by category for the category folders
  const allByCategory = useMemo(() => {
    const map = new Map<string, Channel[]>();
    for (const ch of relatedChannels) {
      if (ch.id === currentChannelId) continue;
      for (const catId of ch.categories) {
        const existing = map.get(catId) || [];
        if (!existing.find((x) => x.id === ch.id)) {
          existing.push(ch);
          map.set(catId, existing);
        }
      }
    }
    return map;
  }, [relatedChannels, currentChannelId]);

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || catId;
  };

  const langLabel = currentChannel.languageNames?.[0] || currentLangs[0] || 'Same Language';
  const countryLabel = currentChannel.countryName || currentChannel.country || 'Same Country';

  return (
    <aside className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Tv2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">Suggestions</h3>
      </div>

      {/* Favorites */}
      {favoriteChannels.length > 0 && (
        <div className="rounded-xl border border-border/30 bg-card/20 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/20">
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Favorites
            </span>
            <span className="ml-auto rounded-full bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-500">
              {favoriteChannels.length}
            </span>
          </div>
          <div className="divide-y divide-border/10">
            {favoriteChannels.map((ch) => {
              const isActive = ch.id === currentChannelId;
              const initials = ch.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleChannelClick(ch.id)}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all hover:bg-accent/30 ${
                    isActive ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : ''
                  }`}
                >
                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-border/30 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20">
                    {ch.logo ? (
                      <img src={ch.logo} alt={ch.name} className="h-full w-full object-contain p-1" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-primary">
                        {initials || 'TV'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {ch.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{ch.countryName || ch.country}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recently watched */}
      {recentChannels.length > 0 && (
        <div className="rounded-xl border border-border/30 bg-card/20 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/20">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Recent
            </span>
            <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
              {recentChannels.length}
            </span>
          </div>
          <div className="divide-y divide-border/10">
            {recentChannels.map((ch) => {
              const isActive = ch.id === currentChannelId;
              const initials = ch.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleChannelClick(ch.id)}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all hover:bg-accent/30 ${
                    isActive ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : ''
                  }`}
                >
                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-border/30 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20">
                    {ch.logo ? (
                      <img src={ch.logo} alt={ch.name} className="h-full w-full object-contain p-1" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[9px] font-bold text-primary">
                        {initials || 'TV'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {ch.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground">{ch.categories[0] || ch.countryName || ch.country}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Language-based suggestions */}
      <SuggestionSection
        label={langLabel}
        icon={Languages}
        channels={sameLang}
        currentChannelId={currentChannelId}
        onChannelClick={handleChannelClick}
        defaultExpanded={true}
      />

      {/* Same country suggestions */}
      <SuggestionSection
        label={countryLabel}
        icon={Globe}
        channels={sameCountry}
        currentChannelId={currentChannelId}
        onChannelClick={handleChannelClick}
        defaultExpanded={sameLang.length === 0}
      />

      {/* Category folders — includes English and all related channels */}
      {allByCategory.size > 0 && (
        <div className="space-y-2.5">
          {Array.from(allByCategory.entries()).map(([catId, catChannels]) => (
            <CategoryFolder
              key={catId}
              categoryId={catId}
              categoryName={getCategoryName(catId)}
              channels={catChannels}
              currentChannelId={currentChannelId}
              onChannelClick={handleChannelClick}
              defaultExpanded={catChannels.length <= 3}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {sameLang.length === 0 && sameCountry.length === 0 && other.length === 0 && favoriteChannels.length === 0 && recentChannels.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-border/30 bg-card/10">
          <Tv2 className="h-7 w-7 text-muted-foreground/30 mb-2" />
          <p className="text-xs font-medium text-muted-foreground text-center">
            Explore more channels to see suggestions here
          </p>
        </div>
      )}
    </aside>
  );
}