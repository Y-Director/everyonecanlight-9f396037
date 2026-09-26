import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import SignInGate from "@/components/SignInGate";
import { useAuthSession } from "@/hooks/useAuthSession";
import { findCourseVideo, posterFor, STREAM_CUSTOMER_CODE } from "@/data/courses";

const CourseDetail = () => {
  const { slug = "" } = useParams();
  const video = findCourseVideo(slug);
  const { session, loading } = useAuthSession();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const streamRef = useRef<any>();
  const [resumeAt, setResumeAt] = useState(0);

  useEffect(() => {
    if (!video || !session) return;
    const savedSeconds = Number(
      window.localStorage.getItem(`course-position:${session.user.id}:${video.slug}`),
    );
    setResumeAt(Number.isFinite(savedSeconds) ? Math.max(0, savedSeconds) : 0);
  }, [session, video]);

  useEffect(() => {
    if (!video?.streamId || !session) return;
    const SRC = "https://embed.cloudflarestream.com/embed/sdk.latest.js";
    let cancelled = false;
    const attach = () => {
      const S = (window as any).Stream;
      if (cancelled || !S || !iframeRef.current) return;
      const player = S(iframeRef.current);
      streamRef.current = player;
      const save = () => {
        const { currentTime, duration } = player;
        if (!Number.isFinite(duration) || duration <= 0) return;
        const pct = Math.min(100, Math.max(0, (currentTime / duration) * 100));
        localStorage.setItem(`course-position:${session.user.id}:${video.slug}`, String(currentTime));
        localStorage.setItem(`course-progress:${session.user.id}:${video.slug}`, String(pct));
      };
      player.addEventListener("timeupdate", save);
      player.addEventListener("pause", save);
      player.addEventListener("ended", save);
    };
    if ((window as any).Stream) attach();
    else {
      let el = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!el) { el = document.createElement("script"); el.src = SRC; el.async = true; document.head.appendChild(el); }
      el.addEventListener("load", attach);
    }
    return () => { cancelled = true; };
  }, [video, session, loading]);

  if (!video) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <SiteNav />
        <main className="flex-1 px-8 py-24 max-w-[900px] mx-auto w-full text-center">
          <h1 className="text-3xl font-medium">Lesson not found</h1>
          <Link to="/courses" className="mt-6 inline-block text-sm underline underline-offset-4">
            Back to courses
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const savedPct = session
    ? Number(window.localStorage.getItem(`course-progress:${session.user.id}:${video.slug}`)) || 0
    : 0;
  const initialStart = session && savedPct < 95
    ? Math.max(0, Number(window.localStorage.getItem(`course-position:${session.user.id}:${video.slug}`)) || 0)
    : 0;
  const hasSource = Boolean(video.streamId || video.playbackUrl);

  const saveStreamProgress = () => {
    if (!video || !streamRef.current || !session) return;
    const { currentTime, duration } = streamRef.current;
    if (!Number.isFinite(duration) || duration <= 0) return;
    const percent = Math.min(100, Math.max(0, (currentTime / duration) * 100));
    window.localStorage.setItem(`course-position:${session.user.id}:${video.slug}`, String(currentTime));
    window.localStorage.setItem(`course-progress:${session.user.id}:${video.slug}`, String(percent));
  };

  const saveNativeProgress = (element: HTMLVideoElement) => {
    if (!video || !session || !Number.isFinite(element.duration) || element.duration <= 0) return;
    const percent = Math.min(100, Math.max(0, (element.currentTime / element.duration) * 100));
    window.localStorage.setItem(`course-position:${session.user.id}:${video.slug}`, String(element.currentTime));
    window.localStorage.setItem(`course-progress:${session.user.id}:${video.slug}`, String(percent));
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Seo
          title={`${video.title} — Lighting Course`}
          description={video.description}
          path={`/courses/${video.slug}`}
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: video.description,
            thumbnailUrl: posterFor(video),
            url: `https://everyonecanlight.lovable.app/courses/${video.slug}`,
          }}
        />
        <SiteNav />

        <main className="flex-1 px-8 max-w-[1000px] mx-auto w-full py-14">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All courses
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-foreground/80">
            {video.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-medium tracking-tight leading-tight">
            {video.title}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-foreground/60 leading-relaxed max-w-2xl">
            {video.description}
          </p>

          <div className="mt-10">
            {loading ? (
              <div className="aspect-video w-full grid place-items-center rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))]">
                <Loader2 className="h-5 w-5 animate-spin text-foreground/50" />
              </div>
            ) : !session ? (
              <div className="relative overflow-hidden rounded-2xl border border-foreground/10">
                <img
                  src={posterFor(video)}
                  alt={video.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  aria-hidden="true"
                />
                <div className="relative grid place-items-center bg-background/85 px-5 py-12 backdrop-blur-sm">
                  <SignInGate blurb="This lesson is free to watch — sign in to unlock it." />
                </div>
              </div>
            ) : hasSource ? (
              <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-black">
                {video.streamId ? (
                  <div className="relative w-full aspect-video">
                    <iframe
                      ref={iframeRef}
                      key={video.streamId}
                      src={`https://${STREAM_CUSTOMER_CODE}.cloudflarestream.com/${video.streamId}/iframe?preload=auto&letterboxColor=transparent&primaryColor=${encodeURIComponent("#1f5bff")}&poster=${encodeURIComponent(new URL(posterFor(video), window.location.origin).href)}${initialStart > 0 ? `&startTime=${Math.floor(initialStart)}s` : ""}`}
                      title={video.title}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    src={video.playbackUrl}
                    poster={posterFor(video)}
                    controls
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(event) => {
                      if (resumeAt > 0) event.currentTarget.currentTime = resumeAt;
                    }}
                    onTimeUpdate={(event) => saveNativeProgress(event.currentTarget)}
                    onPause={(event) => saveNativeProgress(event.currentTarget)}
                    onEnded={(event) => saveNativeProgress(event.currentTarget)}
                    className="w-full aspect-video bg-black"
                  />
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-10 text-center">
                <p className="text-lg font-medium">This lesson is being uploaded.</p>
                <p className="mt-2 text-sm text-foreground/60">
                  Check back shortly — it will play right here.
                </p>
              </div>
            )}
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
};

export default CourseDetail;
