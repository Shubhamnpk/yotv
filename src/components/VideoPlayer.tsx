import { memo, useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import ReactPlayer from 'react-player/lazy';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Loader2,
  Radio,
  PictureInPicture2,
  Settings2,
  SkipForward,
  SkipBack,
} from 'lucide-react';
import { isYouTubeUrl } from '../utils/streamUtils';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';

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

// Maximum HLS fatal error retries before giving up
const MAX_HLS_RETRIES = 3;

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VideoPlayer({ src, poster, onReady, onError }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const { settings } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [playing, setPlaying] = useState(settings.player?.autoplay ?? true);
  const [volume, setVolume] = useState(settings.player?.volume ?? 0.8);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [seekableStart, setSeekableStart] = useState(0);
  const [seekableEnd, setSeekableEnd] = useState(0);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const [availableQualities, setAvailableQualities] = useState<{ height: number; index: number; name: string }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = auto
  const hlsRef = useRef<Hls | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const isYouTube = isYouTubeUrl(src);
  const lastPauseTimeRef = useRef(0);
  const wasPlayingRef = useRef(playing);

  const seekTo = useCallback((seconds: number) => {
    if (isYouTube && playerRef.current) {
      playerRef.current.seekTo(seconds);
      youTubeProgressRef.current = { playedSeconds: seconds, timestamp: Date.now() };
    } else if (videoRef.current) {
      videoRef.current.currentTime = seconds;
    }
    setCurrentTime(seconds);
  }, [isYouTube]);

  const getMaxTime = useCallback(() => {
    if (isYouTube) return duration || Infinity;
    if (seekableEnd > seekableStart) return seekableEnd;
    return videoRef.current?.duration || Infinity;
  }, [isYouTube, duration, seekableEnd, seekableStart]);

  const handleYouTubeProgress = useCallback((state: { playedSeconds: number; loadedSeconds: number }) => {
    youTubeProgressRef.current = { playedSeconds: state.playedSeconds, timestamp: Date.now() };
    setCurrentTime(state.playedSeconds);
    setBuffered(state.loadedSeconds);
  }, []);

  const handleYouTubeDuration = useCallback((d: number) => {
    setDuration(d);
  }, []);

  const handleYouTubeReady = useCallback(() => {
    setIsLoading(false);
    onReady?.();
  }, [onReady]);

  const handleYouTubeError = useCallback(() => {
    setIsLoading(false);
    onError?.('This YouTube stream is unavailable or blocked.');
  }, [onError]);

  const handleYouTubeBuffer = useCallback(() => setIsLoading(true), []);
  const handleYouTubeBufferEnd = useCallback(() => setIsLoading(false), []);

  // Save position on pause, restore on resume (fixes live streams seeking to live)
  useEffect(() => {
    if (playing === wasPlayingRef.current) return;
    wasPlayingRef.current = playing;

    if (!playing) {
      const pos = isYouTube ? currentTime : (videoRef.current?.currentTime ?? currentTime);
      lastPauseTimeRef.current = pos;
    } else if (lastPauseTimeRef.current > 0) {
      const saved = lastPauseTimeRef.current;
      lastPauseTimeRef.current = 0;
      const id = setTimeout(() => seekTo(saved), 120);
      return () => clearTimeout(id);
    }
  }, [playing, isYouTube, currentTime, seekTo]);
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => {
      if (playing) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [showControls, playing]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (playing) {
      setShowControls(false);
      setShowQualityMenu(false);
    }
  }, [playing]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error entering fullscreen:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Error exiting fullscreen:', err));
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Picture-in-Picture
  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          setPlaying(p => !p);
          setShowControls(true);
          break;
        case 'm':
          e.preventDefault();
          setMuted(m => !m);
          setShowControls(true);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'p':
          if (isYouTube) break;
          e.preventDefault();
          togglePiP();
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(v => Math.min(1, parseFloat((v + 0.05).toFixed(2))));
          setMuted(false);
          setShowControls(true);
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(v => Math.max(0, parseFloat((v - 0.05).toFixed(2))));
          setShowControls(true);
          break;
        case 'arrowright':
          e.preventDefault();
          {
            const maxTime = getMaxTime();
            const cur = isYouTube ? currentTime : (videoRef.current?.currentTime || currentTime);
            seekTo(Math.min(cur + 10, maxTime));
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          {
            const cur = isYouTube ? currentTime : (videoRef.current?.currentTime || currentTime);
            seekTo(Math.max(cur - 10, 0));
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, togglePiP, seekTo, getMaxTime, currentTime, isYouTube]);

  // Keep playing state in a ref to avoid recreating the HLS effect
  const playingRef = useRef(playing);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Track last onProgress timestamp for YouTube smooth progress estimation
  const youTubeProgressRef = useRef({ playedSeconds: 0, timestamp: 0 });

  // Progress tracking for HLS player and YouTube fallback
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = window.setInterval(() => {
      if (isYouTube) {
        // Estimate current time based on last known onProgress tick + elapsed wall time
        const r = youTubeProgressRef.current;
        if (r.timestamp > 0 && playing) {
          const elapsed = (Date.now() - r.timestamp) / 1000;
          setCurrentTime(r.playedSeconds + elapsed);
        }
        return;
      }
      const video = videoRef.current;
      if (!video) return;
      setCurrentTime(video.currentTime);
      const d = video.duration;
      setDuration(isFinite(d) && d > 0 ? d : 0);
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
      if (video.seekable.length > 0) {
        setSeekableStart(video.seekable.start(0));
        setSeekableEnd(video.seekable.end(video.seekable.length - 1));
      }
    }, 250);
  }, [isYouTube, playing]);

  // HLS stream logic
  useEffect(() => {
    if (!videoRef.current || isYouTube) return;

    const video = videoRef.current;
    let hls: Hls | null = null;
    let hlsErrorCount = 0;
    let manifestParsed = false;
    let destroyed = false;
    setIsLoading(true);

    const handleReady = () => {
      if (destroyed) return;
      setIsLoading(false);
      onReady?.();
      if (playingRef.current) {
        video.play().catch(() => {});
      }
    };

    const handleError = () => {
      if (destroyed) return;
      setIsLoading(false);
      onError?.('This stream could not be played in the browser.');
    };

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        const d = video.duration;
        setDuration(isFinite(d) && d > 0 ? d : 0);
      });
      startProgressTracking();
      if (playingRef.current && video.readyState >= 1) {
        video.play().catch(() => {});
      }
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 30,
        liveDurationInfinity: false,
        manifestLoadingTimeOut: 15000,
        levelLoadingTimeOut: 15000,
        fragLoadingTimeOut: 20000,
        startLevel: -1,
        debug: false,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (destroyed) return;
        manifestParsed = true;
        setIsLoading(false);
        const d = video.duration;
        setDuration(isFinite(d) && d > 0 ? d : 0);

        // Build quality menu from available levels
        if (hls && hls.levels.length > 0) {
          const levels = hls.levels.map((level, index) => ({
            height: level.height,
            index,
            name: level.height >= 1080 ? '1080p' :
                  level.height >= 720 ? '720p' :
                  level.height >= 540 ? '540p' :
                  level.height >= 480 ? '480p' :
                  level.height >= 360 ? '360p' :
                  level.height >= 240 ? '240p' :
                  level.height >= 144 ? '144p' :
                  `${level.height}p`,
          }));
          // Deduplicate heights, keep highest bitrate for each
          const seenHeights = new Set<number>();
          const uniqueLevels = levels.filter(l => {
            if (seenHeights.has(l.height)) return false;
            seenHeights.add(l.height);
            return true;
          }).sort((a, b) => b.height - a.height);
          setAvailableQualities(uniqueLevels);
        }

        const quality = settings.player?.quality ?? 'auto';

        if (quality !== 'auto') {
          const targetHeight = qualityHeightMap[quality];
          const bestLevel = hls!.levels.reduce((bestIndex, level, index) => {
            const best = hls!.levels[bestIndex];
            if (!best) return index;
            const levelDelta = Math.abs((level.height || targetHeight) - targetHeight);
            const bestDelta = Math.abs((best.height || targetHeight) - targetHeight);
            return levelDelta < bestDelta ? index : bestIndex;
          }, 0);
          hls!.currentLevel = bestLevel;
          setCurrentQuality(bestLevel);
        } else {
          setCurrentQuality(-1);
        }

        startProgressTracking();

        if (playingRef.current) {
          video.play().catch((err) => {
            console.warn('HLS autoplay prevented:', err);
          });
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setCurrentQuality(data.level);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (destroyed) return;

        if (!data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            console.warn('HLS non-fatal network error, recovering...');
          }
          return;
        }

        hlsErrorCount++;

        if (hlsErrorCount > MAX_HLS_RETRIES) {
          console.error(`HLS fatal error after ${MAX_HLS_RETRIES} retries:`, data.type, data.details);
          handleError();
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          console.warn(`HLS network error (attempt ${hlsErrorCount}/${MAX_HLS_RETRIES}), trying to recover...`);
          hls?.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          console.warn(`HLS media error (attempt ${hlsErrorCount}/${MAX_HLS_RETRIES}), trying to recover...`);
          hls?.recoverMediaError();
          return;
        }

        handleError();
      });
    } else {
      handleError();
      return;
    }

    const handleLoadStart = () => {
      if (!destroyed) setIsLoading(true);
    };

    const handleCanPlay = () => {
      if (!destroyed) {
        if (!hls || manifestParsed) {
          handleReady();
        }
      }
    };

    const handleWaiting = () => {
      if (!destroyed) setIsLoading(true);
    };

    const handlePlaying = () => {
      if (!destroyed) setIsLoading(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', () => {
      if (!destroyed && !hls) {
        handleError();
      }
    });

    return () => {
      destroyed = true;
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      if (hls) {
        hls.destroy();
        hlsRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [onError, onReady, settings.player?.quality, src, startProgressTracking]);

  // Sync state with HTML5 video element
  useEffect(() => {
    if (!videoRef.current || isYouTube) return;
    const video = videoRef.current;

    video.volume = volume;
    video.muted = muted;
  }, [volume, muted, isYouTube]);

  // Play/Pause sync
  useEffect(() => {
    if (!videoRef.current || isYouTube) return;
    const video = videoRef.current;

    if (playing) {
      if (video.readyState >= 1) {
        video.play().catch((err) => {
          console.warn('Playback failed:', err);
          if (err.name === 'NotAllowedError') {
            setPlaying(false);
          }
        });
      }
    } else {
      video.pause();
    }
  }, [playing, isYouTube]);

  // Seek handler - uses live video properties at seek time, not stale state
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressEl = progressRef.current;
    if (!progressEl) return;
    const rect = progressEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(x / rect.width, 1));

    if (isYouTube && playerRef.current) {
      const dur = duration;
      if (dur <= 0) return;
      playerRef.current.seekTo(clickRatio * dur);
      setCurrentTime(clickRatio * dur);
    } else {
      const video = videoRef.current;
      if (!video) return;
      const seekable = video.seekable;
      if (seekable.length > 0) {
        const rangeStart = seekable.start(0);
        const rangeEnd = seekable.end(seekable.length - 1);
        video.currentTime = rangeStart + clickRatio * (rangeEnd - rangeStart);
      } else {
        const vidDuration = video.duration;
        if (!isFinite(vidDuration) || vidDuration <= 0) return;
        video.currentTime = clickRatio * vidDuration;
      }
      setCurrentTime(video.currentTime);
    }
  };

  // Drag-based seeking - uses live video properties
  const getSeekTimeFromEvent = useCallback((clientX: number): number | null => {
    const progressEl = progressRef.current;
    if (!progressEl) return null;
    const rect = progressEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(x / rect.width, 1));

    if (isYouTube) {
      const dur = duration;
      if (dur <= 0) return null;
      return clickRatio * dur;
    }

    const video = videoRef.current;
    if (!video) return null;
    const seekable = video.seekable;
    if (seekable.length > 0) {
      const rangeStart = seekable.start(0);
      const rangeEnd = seekable.end(seekable.length - 1);
      return rangeStart + clickRatio * (rangeEnd - rangeStart);
    }
    const vidDuration = video.duration;
    if (!isFinite(vidDuration) || vidDuration <= 0) return null;
    return clickRatio * vidDuration;
  }, [isYouTube, duration]);

  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    const seekTime = getSeekTimeFromEvent(e.clientX);
    if (seekTime !== null) {
      seekTo(seekTime);
    }
  }, [getSeekTimeFromEvent, seekTo]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const seekTime = getSeekTimeFromEvent(e.clientX);
      if (seekTime !== null) {
        seekTo(seekTime);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, getSeekTimeFromEvent, seekTo]);

  // Quality change handler
  const handleQualityChange = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
    }
    setShowQualityMenu(false);
  };

  const handleAutoQuality = () => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = -1;
      setCurrentQuality(-1);
    }
    setShowQualityMenu(false);
  };

  const getVolumeIcon = () => {
    if (muted || volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.4) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.controls-overlay-element')) return;
    if ((e.target as HTMLElement).closest('.quality-menu')) return;
    setPlaying(p => !p);
  };

  const hasLiveSeekable = seekableEnd > seekableStart;
  const effectiveDuration = hasLiveSeekable ? seekableEnd - seekableStart : (isFinite(duration) && duration > 0 ? duration : 0);
  const effectiveCurrentTime = hasLiveSeekable ? currentTime - seekableStart : currentTime;
  const progressPercent = effectiveDuration > 0 ? (effectiveCurrentTime / effectiveDuration) * 100 : 0;
  const bufferedPercent = effectiveDuration > 0 ? (buffered / effectiveDuration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
      onDoubleClick={toggleFullscreen}
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-border/40 shadow-2xl group cursor-pointer select-none"
    >
      {/* Dynamic Ambient Glow */}
      {ambientGlow && (
        <div className="ambient-glow-layer ambient-glow-pulse" />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="text-xs text-white/60 font-medium tracking-wide">Buffering stream...</span>
          </div>
        </div>
      )}

      {isYouTube ? (
        <div className="absolute inset-0">
          <ReactPlayer
            ref={playerRef}
            url={src}
            width="100%"
            height="100%"
            controls={false}
            playing={playing}
            volume={volume}
            muted={muted}
            loop={settings.player?.loop ?? false}
            style={{ pointerEvents: 'none' }}
            config={{
                youtube: {
                  playerVars: {
                    showinfo: 0,
                    modestbranding: 1,
                    rel: 0,
                    controls: 0,
                    iv_load_policy: 3,
                    fs: 0,
                    disablekb: 1,
                    autoplay: 0,
                    playsinline: 1,
                    origin: window.location.origin
                  }
                }
            }}
            onReady={handleYouTubeReady}
            onProgress={handleYouTubeProgress}
            onDuration={handleYouTubeDuration}
            onBuffer={handleYouTubeBuffer}
            onBufferEnd={handleYouTubeBufferEnd}
            onError={handleYouTubeError}
          />
          <div className="absolute inset-0 z-10" />
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="h-full w-full bg-black object-contain"
            poster={poster}
            playsInline
            autoPlay={playing}
            muted={muted}
            loop={settings.player?.loop ?? false}
            preload="auto"
          />

          {/* Buffering state shown as a subtle pulse on the video */}
          <div
            className={cn(
              "absolute inset-0 bg-white/0 pointer-events-none transition-all duration-500",
              isLoading && "bg-white/[0.02]"
            )}
          />
        </>
      )}

      {/* Modern custom controls overlay */}
      <div
        className={cn(
          "absolute inset-0 z-20 flex flex-col justify-end transition-all duration-300 ease-out",
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Gradient background for controls readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Top bar */}
        <div className="relative flex items-center justify-between px-4 pt-4 controls-overlay-element">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg bg-red-600/90 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-lg backdrop-blur-sm">
              <Radio className="h-3 w-3 animate-pulse" />
              LIVE
            </span>
            <span className="text-[11px] text-white/70 font-mono bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
              {formatTime(effectiveCurrentTime)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quality selector */}
            {availableQualities.length > 0 && (
              <div className="relative quality-menu">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowQualityMenu(!showQualityMenu); }}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200 border border-white/10 shadow-lg backdrop-blur-md",
                    "bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
                  )}
                  title="Quality"
                >
                  <Settings2 className="h-4 w-4" />
                </button>
                {showQualityMenu && (
                  <div
                    className="absolute bottom-12 right-0 min-w-[140px] rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl p-1.5 shadow-2xl quality-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handleAutoQuality}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        currentQuality === -1
                          ? "bg-primary/30 text-primary"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      )}
                    >
                      Auto
                    </button>
                    {availableQualities.map((q) => (
                      <button
                        key={q.index}
                        onClick={() => handleQualityChange(q.index)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                          currentQuality === q.index
                            ? "bg-primary/30 text-primary"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {q.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ambient Glow Toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setAmbientGlow(prev => !prev); }}
              className={cn(
                "p-2 rounded-xl transition-all duration-200 border border-white/10 shadow-lg backdrop-blur-md",
                ambientGlow
                  ? "bg-primary text-primary-foreground"
                  : "bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
              )}
              title="Ambient Glow"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Center play/pause indicator */}
        <div className="relative flex-1 flex items-center justify-center pointer-events-none">
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full text-white transition-all duration-300",
              !playing
                ? "opacity-100 scale-100 bg-primary/80 shadow-lg"
                : "opacity-0 scale-75 bg-primary/20"
            )}
          >
            {!playing ? <Play className="ml-1 h-7 w-7 fill-current" /> : <Pause className="h-7 w-7" />}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative px-4 pb-4 pt-2 controls-overlay-element">
          {/* Progress bar - fully draggable, always visible like native controls */}
          <div
            ref={progressRef}
            className={cn(
              "group/progress mb-3 cursor-pointer",
              isDragging && "cursor-grabbing"
            )}
            onClick={(e) => { e.stopPropagation(); handleSeek(e); }}
            onMouseDown={handleProgressMouseDown}
          >
            <div className={cn(
              "relative rounded-full bg-white/20 overflow-hidden transition-all duration-150",
              isDragging ? "h-3" : "h-1.5 group-hover/progress:h-2.5"
            )}>
              {/* Buffered */}
              <div
                className="absolute inset-y-0 left-0 bg-white/20 rounded-full transition-all duration-200"
                style={{ width: `${bufferedPercent}%` }}
              />
              {/* Progress */}
              <div
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              >
                <div className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_10px_2px] shadow-primary/60 transition-all duration-150",
                  isDragging ? "opacity-100 scale-110" : "opacity-0 group-hover/progress:opacity-100"
                )} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={() => setPlaying(p => !p)}
                className="p-1 text-white/90 hover:text-white hover:scale-110 transition-transform"
                title={playing ? 'Pause (k)' : 'Play (k)'}
              >
                {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>

              {/* Skip 10s back */}
              <button
                onClick={() => { const cur = isYouTube ? currentTime : (videoRef.current?.currentTime || 0); seekTo(Math.max(cur - 10, 0)); }}
                className="p-1 text-white/70 hover:text-white hover:scale-110 transition-transform hidden sm:block"
                title="Rewind 10s"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              {/* Skip 10s forward */}
              <button
                onClick={() => { const cur = isYouTube ? currentTime : (videoRef.current?.currentTime || 0); const maxT = getMaxTime(); seekTo(Math.min(cur + 10, maxT)); }}
                className="p-1 text-white/70 hover:text-white hover:scale-110 transition-transform hidden sm:block"
                title="Forward 10s"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  onClick={() => setMuted(m => !m)}
                  className="p-1 text-white/80 hover:text-white hover:scale-110 transition-transform"
                  title="Mute (m)"
                >
                  {getVolumeIcon()}
                </button>
                <div className="w-0 group-hover/vol:w-16 sm:group-hover/vol:w-20 overflow-hidden transition-all duration-200">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : volume}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setMuted(false);
                    }}
                    className="premium-range w-16 sm:w-20 accent-primary"
                    title={`Volume: ${Math.round((muted ? 0 : volume) * 100)}%`}
                  />
                </div>
              </div>

              {/* Time display */}
              <span className="text-[11px] text-white/70 font-mono hidden sm:block">
                {formatTime(effectiveCurrentTime)} / {formatTime(effectiveDuration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Keyboard shortcut hints */}
              <div className="hidden lg:flex items-center gap-1 text-[10px] text-white/30 font-mono mr-1">
                <kbd className="px-1 py-0.5 rounded bg-white/5">Space</kbd>
                <kbd className="px-1 py-0.5 rounded bg-white/5">F</kbd>
                {!isYouTube && <kbd className="px-1 py-0.5 rounded bg-white/5">P</kbd>}
              </div>

              {/* Picture-in-Picture - only available for HLS */}
              {!isYouTube && document.pictureInPictureEnabled && (
                <button
                  onClick={(e) => { e.stopPropagation(); togglePiP(); }}
                  className="p-1.5 text-white/70 hover:text-white hover:scale-110 transition-transform"
                  title="Picture-in-Picture (p)"
                >
                  <PictureInPicture2 className="h-4 w-4" />
                </button>
              )}

              {/* Fullscreen */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                className="p-1.5 text-white/80 hover:text-white hover:scale-110 transition-transform"
                title="Fullscreen (f)"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(VideoPlayer);