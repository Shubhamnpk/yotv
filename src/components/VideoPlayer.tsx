import { memo, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import ReactPlayer from 'react-player/lazy';
import { isYouTubeUrl } from '../utils/streamUtils';
import useStore from '../store/useStore';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onReady?: () => void;
  onError?: (message: string) => void;
}

const qualityHeightMap = {
  low: 360,
  medium: 540,
  high: 720,
  ultra: 1080,
} as const;

function VideoPlayer({ src, poster, onReady, onError }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useStore();

  useEffect(() => {
    if (!videoRef.current || isYouTubeUrl(src)) return;

    const video = videoRef.current;
    let hls: Hls | null = null;
    setIsLoading(true);

    const handleReady = () => {
      setIsLoading(false);
      onReady?.();
    };

    const handleError = () => {
      setIsLoading(false);
      onError?.('This stream could not be played in the browser.');
    };

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const quality = settings.player?.quality ?? 'auto';

        if (quality === 'auto') {
          hls!.currentLevel = -1;
          return;
        }

        const targetHeight = qualityHeightMap[quality];
        const bestLevel = hls!.levels.reduce((bestIndex, level, index) => {
          const best = hls!.levels[bestIndex];
          if (!best) return index;
          const levelDelta = Math.abs((level.height || targetHeight) - targetHeight);
          const bestDelta = Math.abs((best.height || targetHeight) - targetHeight);
          return levelDelta < bestDelta ? index : bestIndex;
        }, 0);

        hls!.currentLevel = bestLevel;
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls?.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls?.recoverMediaError();
          return;
        }

        handleError();
      });
    } else {
      handleError();
    }

    const handleLoadStart = () => setIsLoading(true);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleReady);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleReady);
      video.removeEventListener('error', handleError);
      if (hls) {
        hls.destroy();
      }
    };
  }, [onError, onReady, settings.player?.quality, src]);

  // Apply player settings to video element
  useEffect(() => {
    if (!videoRef.current || isYouTubeUrl(src)) return;

    const video = videoRef.current;
    video.volume = settings.player?.volume ?? 0.8;
    video.muted = settings.player?.muted ?? false;
  }, [settings.player?.volume, settings.player?.muted, src]);

  if (isYouTubeUrl(src)) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        <ReactPlayer
          url={src}
          width="100%"
          height="100%"
          controls
          playing={settings.player?.autoplay ?? false}
          volume={settings.player?.volume ?? 0.8}
          muted={settings.player?.muted ?? false}
          loop={settings.player?.loop ?? false}
          config={{
            youtube: {
              playerVars: {
                showinfo: 1,
                modestbranding: 1,
                rel: 0
              }
            }
          }}
          onReady={() => {
            setIsLoading(false);
            onReady?.();
          }}
          onBuffer={() => setIsLoading(true)}
          onBufferEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            onError?.('This YouTube stream is unavailable or blocked.');
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
      <video
        ref={videoRef}
        className="h-full w-full bg-black"
        controls
        poster={poster}
        playsInline
        autoPlay={settings.player?.autoplay ?? false}
        muted={settings.player?.muted ?? false}
        loop={settings.player?.loop ?? false}
      />
    </div>
  );
}

export default memo(VideoPlayer);
