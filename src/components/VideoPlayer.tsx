import { memo, useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import ReactPlayer from 'react-player/lazy';
import { isYouTubeUrl } from '../utils/streamUtils';
import useStore from '../store/useStore';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { settings } = useStore();

  useEffect(() => {
    if (!videoRef.current || isYouTubeUrl(src)) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

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
    }

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  // Apply player settings to video element
  useEffect(() => {
    if (!videoRef.current || isYouTubeUrl(src)) return;

    const video = videoRef.current;
    video.volume = settings.player?.volume ?? 0.8;
    video.muted = settings.player?.muted ?? false;
  }, [settings.player?.volume, settings.player?.muted, src]);

  if (isYouTubeUrl(src)) {
    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
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
          onBuffer={() => setIsLoading(true)}
          onBufferEnd={() => setIsLoading(false)}
        />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black rounded-lg"
        controls
        poster={poster}
        playsInline
        autoPlay={settings.player?.autoplay ?? false}
        muted={settings.player?.muted ?? false}
        loop={settings.player?.loop ?? false}
      />
    </>
  );
}

export default memo(VideoPlayer);