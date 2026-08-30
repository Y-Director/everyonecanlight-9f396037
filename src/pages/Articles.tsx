import SiteFooter from "@/components/SiteFooter";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { articles, fixDarkVideosArticle, differentTypesArticle, talkingHead1LightArticle, whatIsWattageArticle } from "@/data/articles";
import Seo from "@/components/Seo";
import { fetchPublishedPosts, type PublishedPost } from "@/lib/contributor";

const Articles = () => {
  const [expanded, setExpanded] = useState(false);
  const [community, setCommunity] = useState<PublishedPost[]>([]);
  const usefulArticles = [talkingHead1LightArticle, whatIsWattageArticle, articles[2], fixDarkVideosArticle, differentTypesArticle];
  const visibleUseful = expanded ? usefulArticles.slice(0, 5) : usefulArticles.slice(0, 3);

  useEffect(() => {
    void fetchPublishedPosts("article").then(setCommunity);
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Grid background */}
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
          title="Lighting Guides and Articles — Everyone Can Light"
          description="Practical lighting guides from real productions: wattage explained, talking-head setups with one light, fixing dark video and choosing your first modifier."
          path="/articles"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Lighting Guides and Articles",
            url: "https://everyonecanlight.lovable.app/articles",
          }}
        />
        <SiteNav />

        {/* Content */}
        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-16">
          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Lighting Guides and Articles</h1>
            <p className="mt-3 text-xs tracking-[0.2em] text-foreground/60 uppercase font-thin">For all creators</p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleUseful.map((a, i) => (
              <Link
                key={`${a.slug}-${i}`}
                to={`/articles/${a.slug}`}
                className="group space-y-4 block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-xl"
              >
                <article className="space-y-4">
                  <div className="rounded-xl overflow-hidden aspect-[2/1] bg-[hsl(var(--surface))]">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/80">
                    {a.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-medium leading-snug group-hover:text-foreground/90">
                    {a.title}
                  </h2>
                  <p className="text-sm text-foreground/60">{a.date}</p>
                </article>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-sm text-foreground underline underline-offset-4 decoration-[hsl(var(--cta))] decoration-2 hover:opacity-80 transition"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          </div>

          <header className="mt-24 mb-12">
            <h2 className="text-5xl md:text-6xl font-medium tracking-tight">Lighting Guides and Updates</h2>
            <p className="mt-3 text-xs tracking-[0.2em] text-foreground/60 uppercase">Tips and guides from real life experiences</p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a, i) => (
              <Link
                key={`guides-${a.slug}-${i}`}
                to={`/articles/${a.slug}`}
                className="group space-y-4 block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-xl"
              >
                <article className="space-y-4">
                  <div className="rounded-xl overflow-hidden aspect-[2/1] bg-[hsl(var(--surface))]">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground/80">
                    {a.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-medium leading-snug group-hover:text-foreground/90">
                    {a.title}
                  </h3>
                  <p className="text-sm text-foreground/60">{a.date}</p>
                </article>
              </Link>
            ))}
          </div>

          {community.length > 0 && (
            <>
              <header className="mt-24 mb-12">
                <h2 className="text-5xl md:text-6xl font-medium tracking-tight">From Our Contributors</h2>
                <p className="mt-3 text-xs tracking-[0.2em] text-foreground/60 uppercase">
                  Published by creators in the Everyone Can Light community
                </p>
              </header>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {community.map((p) => (
                  <Link
                    key={p.id}
                    to={`/articles/${p.slug}`}
                    className="group space-y-4 block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 rounded-xl"
                  >
                    <article className="space-y-4">
                      <div className="rounded-xl overflow-hidden aspect-[2/1] bg-[hsl(var(--surface))]">
                        {p.cover_image_url && (
                          <img
                            src={p.cover_image_url}
                            alt={p.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/80">
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-medium leading-snug group-hover:text-foreground/90">
                        {p.title}
                      </h3>
                      <p className="flex items-center gap-4 text-sm text-foreground/60">
                        <span>
                          {p.published_at
                            ? new Date(p.published_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> {p.view_count}
                        </span>
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};

export default Articles;