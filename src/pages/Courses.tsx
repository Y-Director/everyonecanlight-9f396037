import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import { courseCategories, courseVideos, posterFor } from "@/data/courses";

const Courses = () => {
  const categories = courseCategories(courseVideos);

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
        <SiteNav />

        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-16">
          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Lighting Courses</h1>
            <p className="mt-3 text-xs tracking-[0.2em] text-foreground/60 uppercase font-thin">
              Watch, then light it yourself
            </p>
          </header>

          {categories.map((category, ci) => (
            <section key={category} className={ci === 0 ? "" : "mt-24"}>
              <header className="mb-12">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight">{category}</h2>
                <p className="mt-3 text-xs tracking-[0.2em] text-foreground/60 uppercase">
                  Video lessons you can watch right now
                </p>
              </header>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courseVideos
                  .filter((v) => v.category === category)
                  .map((v) => (
                    <Link
                      key={v.slug}
                      to={`/courses/${v.slug}`}
                      className="group space-y-4 block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-xl"
                    >
                      <article className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden aspect-[2/1] bg-[hsl(var(--surface))]">
                          <img
                            src={posterFor(v)}
                            alt={v.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
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
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/80">
                          {v.tags.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                        <h3 className="text-2xl font-medium leading-snug group-hover:text-foreground/90">
                          {v.title}
                        </h3>
                        <p className="text-sm text-foreground/60">{v.category}</p>
                      </article>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </main>

        <SiteFooter />
      </div>
    </div>
  );
};

export default Courses;
