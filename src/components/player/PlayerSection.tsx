import { motion } from 'framer-motion';
import { Suspense, useCallback, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Radio,
  RotateCcw,
  Tv,
  Loader2,
} from 'lucide-react';
import VideoPlayer from '../VideoPlayer';
import type { Channel, Stream } from '../../types';
import { isYouTubeUrl } from '../../utils/streamUtils';

interface PlayerSectionProps {
  channel: Channel;
  stream: Stream;
  streams: Stream[];
  onBack: () => void;
}

export function PlayerSection({ channel, stream, streams, onBack }: PlayerSectionProps) {
  const streamOptions = useMemo(() => {
    const seen = new Set<string>();

    return [stream, ...streams]
      .filter((option) => option.channel === channel.id && option.url)
      .filter((option) => {
        if (seen.has(option.url)) return false;
        seen.add(option.url);
        return true;
      });
  }, [channel.id, stream, streams]);

  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [permanentError, setPermanentError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
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
        setPlayerError('Trying another available stream...');
        window.setTimeout(() => {
          setActiveStreamIndex((index) => index + 1);
          setPlayerError(null);
        }, 900);
        return;
      }

      // All streams exhausted — show permanent error, hide player
      setPermanentError(message);
      setPlayerError(null);
    },
    [activeStreamIndex, streamOptions.length],
  );

  const retryCurrentStream = () => {
    setPermanentError(null);
    setPlayerError(null);
    setIsReady(false);
    setActiveStreamIndex(0);
    setRetryCount((count) => count + 1);
  };

  const streamType = isYouTubeUrl(activeStream.url) ? 'YouTube' : 'HLS';

  return (
    <motion.div
      key="player"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-5xl space-y-5"
    >
      <motion.button
        whileHover={{ x: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/40 backdrop-blur-md px-4 py-2.5 text-sm font-bold text-muted-foreground shadow-sm transition hover:border-primary/40 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 text-primary" />
        Back to channels
      </motion.button>

      <section className="overflow-hidden rounded-2xl border border-border/40 bg-card/25 shadow-xl backdrop-blur-md">
        {/* Permanent error — replaces the player entirely when all sources fail */}
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
                Tried all {streamOptions.length} available source
                {streamOptions.length > 1 ? 's' : ''} — none could be played.
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
            <Suspense
              fallback={
                <div className="flex aspect-video items-center justify-center bg-black/80">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              }
            >
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

        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-600/10 px-3 py-1 font-bold text-red-500 border border-red-500/20 uppercase tracking-wider">
                  <Radio className="h-3.5 w-3.5 animate-pulse" />
                  Live
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 font-bold text-primary border border-primary/20 uppercase tracking-wider">
                  <Tv className="h-3.5 w-3.5" />
                  {streamType}
                </span>
                {isReady && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1 font-bold text-green-500 border border-green-500/20 uppercase tracking-wider">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Connected
                  </span>
                )}
              </div>
              <h2 className="truncate text-3xl font-extrabold tracking-tight text-card-foreground">
                {channel.name}
              </h2>
              <p className="mt-1.5 text-sm font-medium text-muted-foreground">
                {channel.country}
                {channel.languages?.length ? ` • ${channel.languages.join(', ')}` : ''}
              </p>
            </div>

            {streamOptions.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {streamOptions.map((option, index) => (
                  <button
                    key={option.url}
                    type="button"
                    onClick={() => {
                      setActiveStreamIndex(index);
                      setPlayerError(null);
                      setPermanentError(null);
                      setIsReady(false);
                      setRetryCount(0);
                    }}
                    className={`rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                      index === activeStreamIndex
                        ? 'border-primary bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20'
                        : 'border-border/60 bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:bg-background/80'
                    }`}
                  >
                    Source {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
            {channel.categories.map((category) => (
              <span
                key={category}
                className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
