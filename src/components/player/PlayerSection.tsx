import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, useCallback, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Radio,
  RotateCcw,
  Tv,
  Loader2,
  Globe,
  Building2,
  CalendarDays,
  ExternalLink,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  Signal,
  Youtube,
  Wifi,
} from 'lucide-react';

import VideoPlayer from '../VideoPlayer';
import type { Channel, Stream } from '../../types';
import { isYouTubeUrl } from '../../utils/streamUtils';
import { useData } from '../../context/DataContext';

interface PlayerSectionProps {
  channel: Channel;
  stream: Stream;
  streams: Stream[];
  onBack: () => void;
}

/** Square channel logo / initials fallback */
function ChannelAvatar({ channel }: { channel: Channel }) {
  const [imgErr, setImgErr] = useState(false);
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20 shadow-lg">
      {channel.logo && !imgErr ? (
        <img
          src={channel.logo}
          alt={channel.name}
          className="h-full w-full object-contain p-2"
          onError={() => setImgErr(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg font-extrabold text-primary">
          {initials || 'TV'}
        </div>
      )}
    </div>
  );
}

/** Small info badge */
function Badge({
  icon: Icon,
  children,
  variant = 'default',
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  variant?: 'default' | 'live' | 'green' | 'muted';
}) {
  const cls = {
    default: 'bg-primary/10 text-primary border-primary/20',
    live: 'bg-red-600/10 text-red-500 border-red-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    muted: 'bg-muted/60 text-muted-foreground border-border/40',
  }[variant];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-wider ${cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

export function PlayerSection({ channel, stream, streams, onBack }: PlayerSectionProps) {
  const { countries } = useData();
  const countryFlag = useMemo(
    () => countries.find((c) => c.code.toUpperCase() === channel.country.toUpperCase())?.flag || '',
    [countries, channel.country]
  );

  const streamOptions = useMemo(() => {
    const seen = new Set<string>();
    return [stream, ...streams]
      .filter((o) => o.channel === channel.id && o.url)
      .filter((o) => {
        if (seen.has(o.url)) return false;
        seen.add(o.url);
        return true;
      });
  }, [channel.id, stream, streams]);

  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [permanentError, setPermanentError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const activeStream = streamOptions[activeStreamIndex] || stream;

  const handlePlayerReady = useCallback(() => {
    setIsReady(true);
    setPlayerError(null);
    setPermanentError(null);
  }, []);

  const handlePlayerError = useCallback(
    (message: string) => {
      setIsReady(false);
      if (activeStreamIndex < streamOptions.length - 1) {
        setPlayerError('Trying another available stream…');
        window.setTimeout(() => {
          setActiveStreamIndex((i) => i + 1);
          setPlayerError(null);
        }, 900);
        return;
      }
      setPermanentError(message);
      setPlayerError(null);
    },
    [activeStreamIndex, streamOptions.length]
  );

  const retryCurrentStream = () => {
    setPermanentError(null);
    setPlayerError(null);
    setIsReady(false);
    setActiveStreamIndex(0);
    setRetryCount((c) => c + 1);
  };

  const streamType = isYouTubeUrl(activeStream.url) ? 'YouTube' : 'HLS';
  const launchedYear = channel.launched ? new Date(channel.launched).getFullYear() : null;

  return (
    <motion.div
      key="player"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-5xl space-y-5"
    >
      {/* Back button */}
      <motion.button
        whileHover={{ x: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/40 backdrop-blur-md px-4 py-2.5 text-sm font-bold text-muted-foreground shadow-sm transition hover:border-primary/40 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 text-primary" />
        Back to channels
      </motion.button>

      {/* Main player card */}
      <section className="overflow-hidden rounded-2xl border border-border/40 bg-card/25 shadow-xl backdrop-blur-md">
        {/* Player or Error */}
        {permanentError ? (
          <div className="flex flex-col items-center justify-center gap-5 px-6 py-16">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-destructive/20 rounded-full" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10">
                <AlertTriangle className="h-9 w-9 text-destructive" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-foreground mb-1">Stream Unavailable</h3>
              <p className="text-sm text-muted-foreground max-w-sm">{permanentError}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Tried all {streamOptions.length} source{streamOptions.length > 1 ? 's' : ''} — none could be played.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={retryCurrentStream}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Other Channels
              </button>
            </div>
          </div>
        ) : (
          <div className="relative bg-black aspect-video rounded-t-2xl overflow-hidden border-b border-border/20">
            <Suspense fallback={
              <div className="flex aspect-video items-center justify-center bg-black/80">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            }>
              <VideoPlayer
                key={`${activeStream.url}-${activeStreamIndex}-${retryCount}`}
                src={activeStream.url}
                poster={channel.logo}
                onReady={handlePlayerReady}
                onError={handlePlayerError}
              />
            </Suspense>

            {playerError && (
              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-destructive/30 bg-black/85 p-4 text-white shadow-xl backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive animate-bounce" />
                  <div>
                    <p className="font-bold">{playerError}</p>
                    <p className="mt-1 text-xs text-white/70">
                      Stream {activeStreamIndex + 1} of {streamOptions.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Channel info panel */}
        <div className="p-6 space-y-5">
          {/* Top row: icon + name + badges */}
          <div className="flex items-start gap-4">
            <ChannelAvatar channel={channel} />

            <div className="flex-1 min-w-0">
              {/* Status badges */}
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <Badge icon={Radio} variant="live">Live</Badge>
                <Badge icon={Tv} variant="default">{streamType}</Badge>
                {isReady && <Badge icon={BadgeCheck} variant="green">Connected</Badge>}
                {streamOptions.length > 1 && (
                  <Badge icon={Layers} variant="muted">{streamOptions.length} sources</Badge>
                )}
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-card-foreground leading-tight">
                {channel.name}
              </h2>

              {/* Alt names */}
              {channel.alt_names?.length > 0 && (
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  Also known as: {channel.alt_names.slice(0, 3).join(', ')}
                </p>
              )}
            </div>

          </div>

          {/* ── Stream Picker ── */}
          {streamOptions.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Signal className="h-4 w-4 text-primary" />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Choose Stream Source
                </p>
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {streamOptions.length} available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {streamOptions.map((option, index) => {
                  const isActive = index === activeStreamIndex;
                  const isYT = isYouTubeUrl(option.url);
                  // Derive quality label: use API field, or parse from URL, or fallback
                  const qualityLabel = option.quality
                    ? option.quality.toUpperCase()
                    : isYT
                    ? 'Auto'
                    : 'HLS';
                  // Friendly title: use stream title if not just the channel name, else generic
                  const streamTitle =
                    option.title && option.title !== channel.name
                      ? option.title
                      : `Source ${index + 1}`;

                  return (
                    <motion.button
                      key={option.url}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveStreamIndex(index);
                        setPlayerError(null);
                        setPermanentError(null);
                        setIsReady(false);
                        setRetryCount(0);
                      }}
                      className={`relative flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                        isActive
                          ? 'border-primary bg-primary/10 shadow-md ring-1 ring-primary/30'
                          : 'border-border/50 bg-background/30 hover:border-primary/40 hover:bg-background/60'
                      }`}
                    >
                      {/* Type icon */}
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground'
                        }`}
                      >
                        {isYT ? (
                          <Youtube className="h-4 w-4" />
                        ) : (
                          <Wifi className="h-4 w-4" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${
                          isActive ? 'text-primary' : 'text-foreground'
                        }`}>
                          {streamTitle}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {isYT ? 'YouTube' : 'HLS'}
                          </span>
                          {qualityLabel !== 'HLS' && qualityLabel !== 'Auto' && (
                            <>
                              <span className="text-muted-foreground/40">·</span>
                              <span className="text-[10px] font-bold text-primary/80 uppercase">{qualityLabel}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div className="flex-shrink-0">
                          <span className="flex h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_6px_2px] shadow-primary/50" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}



          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Country */}
            <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background/30 px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                {countryFlag ? (
                  <span className="text-lg leading-none">{countryFlag}</span>
                ) : (
                  <Globe className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Country</p>
                <p className="truncate text-xs font-bold text-foreground">{channel.countryName || channel.country}</p>
              </div>
            </div>

            {/* Network */}
            {channel.network && (
              <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background/30 px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Network</p>
                  <p className="truncate text-xs font-bold text-foreground">{channel.network}</p>
                </div>
              </div>
            )}

            {/* Launched */}
            {launchedYear && (
              <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background/30 px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Launched</p>
                  <p className="truncate text-xs font-bold text-foreground">{launchedYear}</p>
                </div>
              </div>
            )}

            {/* Website */}
            {channel.website && (
              <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-background/30 px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Website</p>
                  <a
                    href={channel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 truncate text-xs font-bold text-primary hover:underline"
                  >
                    Visit site <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          {channel.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {channel.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Expandable more info */}
          {(channel.owners?.length > 0 || channel.languageNames?.length) && (
            <div className="border-t border-border/20 pt-3">
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info className="h-3.5 w-3.5" />
                {showMore ? 'Less info' : 'More info'}
                {showMore ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {channel.owners?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Owners</p>
                          <p className="text-xs text-foreground">{channel.owners.join(', ')}</p>
                        </div>
                      )}
                      {channel.languageNames?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Languages</p>
                          <p className="text-xs text-foreground">{channel.languageNames.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
