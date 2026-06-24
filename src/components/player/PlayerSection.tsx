import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, useCallback, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Radio,
  RotateCcw,
  Loader2,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  Signal,
  Youtube,
  Wifi,
} from 'lucide-react';

import VideoPlayer from '../VideoPlayer';
import type { Channel, Stream } from '../../types';
import { isYouTubeUrl, isDashUrl } from '../../utils/streamUtils';
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
    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-border/40 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20">
      {channel.logo && !imgErr ? (
        <img
          src={channel.logo}
          alt={channel.name}
          className="h-full w-full object-contain p-1.5"
          onError={() => setImgErr(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-extrabold text-primary">
          {initials || 'TV'}
        </div>
      )}
    </div>
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
  const [showStreamPicker, setShowStreamPicker] = useState(false);

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

  const streamType = isYouTubeUrl(activeStream.url) ? 'YouTube' : isDashUrl(activeStream.url) ? 'DASH' : 'HLS';
  const launchedYear = channel.launched ? new Date(channel.launched).getFullYear() : null;

  // Sort streams: YouTube first then HLS
  const sortedStreamOptions = useMemo(() => {
    return [...streamOptions].sort((a, b) => {
      const aIsYT = isYouTubeUrl(a.url) ? 0 : 1;
      const bIsYT = isYouTubeUrl(b.url) ? 0 : 1;
      return aIsYT - bIsYT;
    });
  }, [streamOptions]);

  return (
    <div className="w-full space-y-3">
      {/* Back button - subtle */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      {/* Player */}
      <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
        {permanentError ? (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
            <div className="relative">
              <div className="absolute inset-0 blur-2xl bg-destructive/20 rounded-full" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-foreground mb-1">Stream Unavailable</h3>
              <p className="text-xs text-muted-foreground max-w-sm">{permanentError}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={retryCurrentStream}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try Again
              </button>
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-bold text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Other Channels
              </button>
            </div>
          </div>
        ) : (
          <div className="relative bg-black aspect-video">
            <Suspense fallback={
              <div className="flex aspect-video items-center justify-center bg-black/80">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            }>
              <VideoPlayer
                key={`${activeStream.url}-${activeStreamIndex}-${retryCount}`}
                src={activeStream.url}
                onReady={handlePlayerReady}
                onError={handlePlayerError}
                drmConfig={activeStream.drm}
              />
            </Suspense>

            {playerError && (
              <div className="absolute inset-x-4 bottom-4 rounded-lg border border-destructive/30 bg-black/85 p-3 text-white shadow-xl backdrop-blur-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive animate-bounce" />
                  <div>
                    <p className="text-xs font-bold">{playerError}</p>
                    <p className="mt-0.5 text-[10px] text-white/70">
                      Stream {activeStreamIndex + 1} of {streamOptions.length}
                    </p>
                  </div>
                </div>
              </div>
            )}


          </div>
        )}
      </div>

      {/* Channel info bar - YouTube style */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <ChannelAvatar channel={channel} />
          <div className="min-w-0">
            <h2 className="text-base font-bold text-foreground truncate leading-tight">
              {channel.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {countryFlag && <span>{countryFlag}</span>}
                {channel.countryName || channel.country}
              </span>
              {channel.categories.length > 0 && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-primary font-medium">
                    {channel.categories[0]}
                  </span>
                </>
              )}
              {isReady && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                    <BadgeCheck className="h-3 w-3" />
                    Connected
                  </span>
                </>
              )}
            </div>
            {channel.alt_names?.length > 0 && (
              <p className="mt-0.5 text-[10px] text-muted-foreground truncate max-w-xs">
                Also known as: {channel.alt_names.slice(0, 2).join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Stream source selector - subtle button */}
        {sortedStreamOptions.length > 1 && (
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowStreamPicker(!showStreamPicker)}
              className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-card/30 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
            >
              <Signal className="h-3 w-3" />
              {activeStreamIndex + 1}/{sortedStreamOptions.length}
              {showStreamPicker ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            <AnimatePresence>
              {showStreamPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 z-50 w-64 rounded-xl border border-border/40 bg-card shadow-xl backdrop-blur-xl"
                >
                  <div className="p-2 space-y-0.5">
                    <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Sources
                    </p>
                    {sortedStreamOptions.map((option, index) => {
                      const isActive = index === activeStreamIndex;
                      const isYT = isYouTubeUrl(option.url);
                      const isDASH = isDashUrl(option.url);
                      const qualityLabel = option.quality ? option.quality.toUpperCase() : isYT ? 'Auto' : isDASH ? 'DASH' : 'HLS';

                      return (
                        <button
                          key={option.url}
                          type="button"
                          onClick={() => {
                            setActiveStreamIndex(index);
                            setPlayerError(null);
                            setPermanentError(null);
                            setIsReady(false);
                            setRetryCount(0);
                            setShowStreamPicker(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-all ${
                            isActive
                              ? 'bg-primary/10 ring-1 ring-primary/30'
                              : 'hover:bg-accent/50'
                          }`}
                        >
                          <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
                            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted/60 text-muted-foreground'
                          }`}>
                            {isYT ? <Youtube className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                              {option.title && option.title !== channel.name ? option.title : `Source ${index + 1}`}
                            </p>
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-medium text-muted-foreground uppercase">
                                {isYT ? 'YouTube' : isDASH ? 'DASH' : 'HLS'}
                              </span>
                              {qualityLabel !== 'HLS' && qualityLabel !== 'Auto' && qualityLabel !== 'DASH' && (
                                <>
                                  <span className="text-muted-foreground/40">·</span>
                                  <span className="text-[9px] font-bold text-primary/80 uppercase">{qualityLabel}</span>
                                </>
                              )}
                            </div>
                          </div>
                          {isActive && (
                            <span className="flex h-2 w-2 rounded-full bg-primary shadow-[0_0_4px_1px] shadow-primary/50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Match info for FIFA / event channels */}
      {channel.matchInfo && (
        <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_1px] shadow-green-500/60" />
            FIFA World Cup 2026
          </div>
          {channel.matchInfo.days?.slice(0, 2).map((day) => (
            <div key={day.label} className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{day.label}</p>
              {day.matches.map((m, i) => {
                const dt = new Date(m.kickoff);
                const now = Date.now();
                const matchStart = dt.getTime();
                const matchEnd = matchStart + 7200000;
                const isLive = now >= matchStart && now < matchEnd;
                const isPast = now >= matchEnd;
                const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <p key={i} className={`text-xs pl-3 border-l-2 flex items-center gap-1.5 ${
                    isLive ? 'text-green-400 border-green-500 font-semibold' :
                    isPast ? 'text-muted-foreground/50 border-border/20' :
                    'text-muted-foreground border-primary/30'
                  }`}>
                    {isLive && <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_1px] shadow-green-500/60 animate-pulse" />}
                    {time} — {m.label}
                  </p>
                );
              })}
            </div>
          ))}
          {channel.matchInfo.upcoming && channel.matchInfo.upcoming.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-border/20">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Upcoming Rounds</p>
              {channel.matchInfo.upcoming.map((m, i) => (
                <p key={i} className="text-xs text-muted-foreground pl-3 border-l-2 border-border/40">{m}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compact metadata chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
          <Radio className="h-3 w-3" />
          Live
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
          {streamType}
        </span>
        {channel.network && (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
            {channel.network}
          </span>
        )}
        {launchedYear && (
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/40">
            Since {launchedYear}
          </span>
        )}
        {channel.website && (
          <a
            href={channel.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-border/40 hover:bg-primary/10 transition-colors"
          >
            <ExternalLink className="h-2.5 w-2.5" />
            Website
          </a>
        )}
      </div>

      {/* More info toggle */}
      {(channel.owners?.length ?? 0) > 0 || (channel.languageNames?.length ?? 0) > 0 || channel.categories.length > 1 ? (
        <div>
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="h-3 w-3" />
            {showMore ? 'Show less' : 'Show more'}
            {showMore ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
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
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                  {(channel.owners?.length ?? 0) > 0 && (
                    <div>
                      <span className="font-semibold text-foreground">Owners: </span>
                      {channel.owners!.join(', ')}
                    </div>
                  )}
                  {(channel.languageNames?.length ?? 0) > 0 && (
                    <div>
                      <span className="font-semibold text-foreground">Languages: </span>
                      {channel.languageNames!.join(', ')}
                    </div>
                  )}
                  {channel.categories.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {channel.categories.map((cat) => (
                        <span key={cat} className="rounded-md bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary border border-primary/10">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}