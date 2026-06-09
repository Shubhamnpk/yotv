import { motion } from 'framer-motion';
import { Suspense, useCallback, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  Radio,
  RotateCcw,
  Tv,
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
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const activeStream = streamOptions[activeStreamIndex] || stream;

  const handlePlayerReady = useCallback(() => {
    setIsReady(true);
    setPlayerError(null);
  }, []);

  const handlePlayerError = useCallback((message: string) => {
    setIsReady(false);

    if (activeStreamIndex < streamOptions.length - 1) {
      setPlayerError('Trying another available stream...');
      window.setTimeout(() => {
        setActiveStreamIndex((index) => index + 1);
        setPlayerError(null);
      }, 900);
      return;
    }

    setPlayerError(message);
  }, [activeStreamIndex, streamOptions.length]);

  const retryCurrentStream = () => {
    setPlayerError(null);
    setIsReady(false);
    setRetryCount((count) => count + 1);
  };

  const streamType = isYouTubeUrl(activeStream.url) ? 'YouTube' : 'HLS';

  return (
    <motion.div
      key="player"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-auto max-w-5xl space-y-4"
    >
      <motion.button
        whileHover={{ x: -5 }}
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to channels
      </motion.button>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="relative bg-black">
          <Suspense
            fallback={
              <div className="flex aspect-video items-center justify-center bg-black">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
            <div className="absolute inset-x-4 bottom-4 rounded-lg border border-destructive/30 bg-black/85 p-4 text-white shadow-xl backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                  <div>
                    <p className="font-medium">{playerError}</p>
                    <p className="mt-1 text-sm text-white/70">
                      Stream {activeStreamIndex + 1} of {streamOptions.length}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={retryCurrentStream}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-white/90"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 font-medium text-primary">
                  <Radio className="h-3.5 w-3.5" />
                  Live
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1">
                  <Tv className="h-3.5 w-3.5" />
                  {streamType}
                </span>
                {isReady && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-primary">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Playing
                  </span>
                )}
              </div>
              <h2 className="truncate text-2xl font-semibold tracking-tight text-card-foreground">
                {channel.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {channel.country}
                {channel.languages?.length ? ` - ${channel.languages.join(', ')}` : ''}
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
                      setIsReady(false);
                      setRetryCount(0);
                    }}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                      index === activeStreamIndex
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    Stream {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {channel.categories.map((category) => (
              <span
                key={category}
                className="rounded-md bg-muted px-3 py-1 text-sm font-medium text-muted-foreground"
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
