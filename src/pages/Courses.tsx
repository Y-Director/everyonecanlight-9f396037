import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Play } from "lucide-react";
import Seo from "@/components/Seo";
import CoursesTopBar, { displayNameOf } from "@/components/courses/CoursesTopBar";
import crownAsset from "@/assets/courses/course-crown.png.asset.json";
import { courseVideos, posterFor } from "@/data/courses";
import { useAuthSession } from "@/hooks/useAuthSession";

const progressFor = (userId: string | undefined, slug: string) => {
  if (typeof window === "undefined") return 0;
  const stored = Number(window.localStorage.getItem(`course-progress:${userId ?? "guest"}:${slug}`));
  return Number.isFinite(stored) ? Math.min(100, Math.max(0, stored)) : 0;
};

/** Courses portal dashboard — lessons only, behind sign-in. */
const Courses = () => {
  const { session, loading } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate("/courses/auth?next=/courses", { replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Seo
          title="Lighting Courses — Video Lessons for Creators"
          description="Watch practical lighting video lessons from real productions: quick tips, shorts and full course modules for filmmakers, photographers and creators."
          path="/courses"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Lighting Courses",
            url: "https://everyonecanlight.lovable.app/courses",
            hasPart: courseVideos.map((v) => ({
              "@type": "VideoObject",
              name: v.title,
              description: v.description,
              url: `https://everyonecanlight.lovable.app/courses/${v.slug}`,
            })),
          }}
        />
        <CoursesTopBar session={session} />

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 py-12 md:px-8">
          {loading || !session ? (
            <div className="grid min-h-[50vh] place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-foreground/50" />
            </div>
          ) : (
            <>
              <header className="mb-10">
                <p className="text-xs uppercase tracking-[0.2em] font-thin text-foreground/60">
                  Welcome, {displayNameOf(session)}
                </p>
                <h1 className="mt-2 text-4xl md:text-5xl font-medium tracking-tight">Your lessons</h1>
              </header>

              <section aria-label="Course videos">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {courseVideos.map((v) => {
                    const progress = progressFor(session.user.id, v.slug);
                    return (
                      <Link
                        key={v.slug}
                        to={`/courses/${v.slug}`}
                        className="group block space-y-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40"
                      >
                        <article className="space-y-4">
                          <div className="relative aspect-[2/1] overflow-hidden rounded-xl bg-[hsl(var(--surface))]">
                            <img
                              src={posterFor(v)}
                              alt={v.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                            <span
                              className="absolute left-3 top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-background/70 backdrop-blur-sm"
                              aria-label={v.access === "free" ? "Free lesson" : "Paid lesson"}
                              title={v.access === "free" ? "Free lesson" : "Paid lesson"}
                            >
                              <img
                                src={crownAsset.url}
                                alt=""
                                className={`h-3 w-3 object-contain ${v.access === "free" ? "brightness-0 invert" : ""}`}
                              />
                            </span>
                            <span className="absolute inset-0 grid place-items-center bg-black/25 transition-colors group-hover:bg-black/15">
                              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] shadow-xl transition-transform group-hover:scale-105">
                                <Play className="h-5 w-5 translate-x-px fill-current" aria-hidden="true" />
                              </span>
                            </span>
                            {v.duration && (
                              <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">
                                {v.duration}
                              </span>
                            )}
                            <span className="absolute inset-x-0 bottom-0 h-1 bg-foreground/20" aria-hidden="true">
                              <span
                                className="block h-full bg-[hsl(var(--cta))] transition-[width]"
                                style={{ width: `${progress}%` }}
                              />
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/80">
                            {v.tags.map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                          <h3 className="text-2xl font-medium leading-snug group-hover:text-foreground/90">
                            {v.title}
                          </h3>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Courses;
