import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX, Maximize2 } from "lucide-react";
import brandVideo from "@/assets/landing/brand-refresh.mp4.asset.json";
import brandPoster from "@/assets/landing/brand-refresh-poster.jpg.asset.json";

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const BrandVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const progress = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <section className="px-8 pb-16 max-w-[1400px] mx-auto w-full">
      <div className="max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
          Everyone Can Light — the brand refresh
        </h2>
        <p className="mt-3 text-sm sm:text-base text-foreground/55 leading-relaxed">
          A short look at who we are, what we build and why lighting should be simple for every
          creator.
        </p>
      </div>

      <div className="mt-8 relative overflow-hidden rounded-3xl border border-foreground/10 bg-[hsl(var(--surface))]">
        <video
          ref={ref}
          className="w-full aspect-video object-cover bg-black"
          src={brandVideo.url}
          poster={brandPoster.url}
          playsInline
          muted={muted}
          preload="metadata"
          onClick={toggle}
        />

        {/* Center play overlay */}
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Play brand refresh video"
            className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/15"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] shadow-2xl transition-transform hover:scale-105">
              <Play className="h-8 w-8 translate-x-0.5 fill-current" aria-hidden="true" />
            </span>
          </button>
        )}

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-white/70 w-10">{fmt(time)}</span>
            <div className="relative flex-1 h-1.5 rounded-full bg-white/25">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ width: `${progress}%` }}
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-white shadow"
                style={{ left: `${progress}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={time}
                aria-label="Video timeline"
                onChange={(e) => {
                  const v = ref.current;
                  if (!v) return;
                  v.currentTime = Number(e.target.value);
                  setTime(Number(e.target.value));
                }}
                className="absolute inset-0 w-full h-6 -top-2 cursor-pointer opacity-0"
              />
            </div>
            <span className="text-xs tabular-nums text-white/70 w-10">{fmt(duration)}</span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause video" : "Play video"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] transition-transform hover:scale-105"
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4 translate-x-px fill-current" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                const v = ref.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
              }}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => void ref.current?.requestFullscreen?.()}
              aria-label="Play video fullscreen"
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandVideo;
