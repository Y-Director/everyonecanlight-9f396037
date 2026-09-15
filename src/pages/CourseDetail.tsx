import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import SignInGate from "@/components/SignInGate";
import { useAuthSession } from "@/hooks/useAuthSession";
import { findCourseVideo, posterFor, streamIframeSrc } from "@/data/courses";

const CourseDetail = () => {
  const { slug = "" } = useParams();
  const video = findCourseVideo(slug);
  const { session, loading } = useAuthSession();

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

  const hasSource = Boolean(video.streamId || video.playbackUrl);

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
                  <iframe
                    src={streamIframeSrc(video.streamId)}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                    className="w-full aspect-video border-0"
                  />
                ) : (
                  <video
                    src={video.playbackUrl}
                    poster={posterFor(video)}
                    controls
                    playsInline
                    preload="metadata"
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
