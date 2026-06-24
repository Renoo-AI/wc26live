'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Admin sets this via localStorage or env — for now, read from a known key
function getStreamUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('wc26live-stream-url');
}

export function LivePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    const url = getStreamUrl();
    setStreamUrl(url);
    if (!url) {
      setLoading(false);
    }
  }, []);

  function handleSetUrl() {
    if (customUrl.trim()) {
      localStorage.setItem('wc26live-stream-url', customUrl.trim());
      setStreamUrl(customUrl.trim());
      setError(false);
      setLoading(true);
    }
  }

  function handlePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setError(true));
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function handleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  function handleFullscreen() {
    videoRef.current?.requestFullscreen?.();
  }

  // No stream URL configured yet
  if (!streamUrl) {
    return (
      <div className="bg-[#1A1614] rounded-2xl overflow-hidden border border-[#3D3632]">
        <div className="aspect-video flex flex-col items-center justify-center gap-3 p-6">
          <span className="text-3xl">📡</span>
          <p className="text-sm text-[#A89E96] text-center">
            No stream configured yet.<br />Enter an HLS or MP4 stream URL:
          </p>
          <div className="flex gap-2 w-full max-w-[260px]">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://...stream.m3u8"
              className="flex-1 text-xs bg-[#3D3632] border border-[#4A433E] rounded-lg px-3 py-2 text-[#FAF5F0] placeholder:text-[#7D7570]"
            />
            <button
              onClick={handleSetUrl}
              className="text-xs font-semibold bg-[#2D8B5E] text-white px-3 py-2 rounded-lg hover:bg-[#257A4E]"
            >
              Set
            </button>
          </div>
          <p className="text-[10px] text-[#7D7570]">
            HLS (.m3u8) or MP4 URLs supported
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1614] rounded-2xl overflow-hidden border border-[#3D3632]">
      {/* Video */}
      <div className="relative aspect-video">
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1A1614]">
            <Loader2 className="size-8 text-[#A89E96] animate-spin" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1A1614] p-4">
            <span className="text-2xl">⚠️</span>
            <p className="text-xs text-[#A89E96] text-center">
              Could not load stream. Check the URL or try again later.
            </p>
            <button
              onClick={() => { setError(false); setLoading(true); }}
              className="text-xs text-[#D97757] font-medium mt-1"
            >
              Retry
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          src={streamUrl}
          className="w-full h-full object-contain"
          playsInline
          muted={muted}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedData={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          onClick={handlePlay}
        />

        {/* Play overlay */}
        {!playing && !loading && !error && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
          >
            <div className="size-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Play className="size-6 text-white ml-0.5" />
            </div>
          </motion.button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            className="size-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            onClick={handleMute}
            className="size-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
        <button
          onClick={handleFullscreen}
          className="size-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Maximize className="size-3.5" />
        </button>
      </div>
    </div>
  );
}