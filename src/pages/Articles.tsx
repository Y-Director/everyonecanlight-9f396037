import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { articles, fixDarkVideosArticle, differentTypesArticle } from "@/data/articles";

const Articles = () => {
  const [expanded, setExpanded] = useState(false);
  const usefulArticles = [articles[0], articles[1], articles[2], fixDarkVideosArticle, differentTypesArticle];
  const visibleUseful = expanded ? usefulArticles.slice(0, 5) : usefulArticles.slice(0, 3);
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
        <SiteNav />

        {/* Content */}
        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-16">
          <header className="mb-12">
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight">Useful Information</h1>
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
        </main>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 px-8 border-t border-foreground/10 text-sm bg-[hsl(var(--surface))]">
          <div className="flex items-center gap-3 text-foreground/70">
            <img src={logo} alt="EveryoneCanLight logo" className="w-6 h-6 rounded object-contain" />
            © 2026 Everyone Can Light Technologies
          </div>
          <div className="flex items-center gap-6">
            <span className="text-foreground/50">Social</span>
            <a href="https://www.instagram.com/everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a>
            <a href="https://www.youtube.com/@everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">YouTube</a>
            <a href="https://www.tiktok.com/@everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">TikTok</a>
            <a href="https://www.linkedin.com/company/everyone-can-light/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Articles;