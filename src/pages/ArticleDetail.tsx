import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { getArticleBySlug } from "@/data/articles";
import NotFound from "./NotFound";

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const ArticleDetail = () => {
  const { slug = "" } = useParams();
  const article = getArticleBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!article) return <NotFound />;

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

        <main className="flex-1 px-6 md:px-8 max-w-3xl mx-auto w-full py-12 md:py-16">
          <article>
            <header className="mb-8">
              <div className="flex items-center gap-3 text-sm text-foreground/70 mb-4">
                {article.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">
                {article.title}
              </h1>
              <p className="mt-3 text-sm text-foreground/60">{article.date}</p>
            </header>

            <div className="rounded-xl overflow-hidden aspect-[2/1] bg-[hsl(var(--surface))] mb-10">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-6">
              {article.content.map((block, i) => {
                if (block.type === "heading") {
                  return (
                    <h2 key={i} className="text-base md:text-lg font-semibold pt-4">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "image") {
                  return (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden bg-[hsl(var(--surface))] max-w-sm"
                    >
                      <img
                        src={block.src}
                        alt={block.alt}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-sm md:text-base leading-relaxed text-foreground/85 whitespace-pre-line">
                    {block.text}
                  </p>
                );
              })}
            </div>

            {/* Writers */}
            <section className="mt-16">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-foreground/70">Writer(s)</span>
                <span className="flex-1 h-px bg-foreground/15" />
              </div>
              <ul className="flex flex-wrap gap-x-10 gap-y-4">
                {article.authors.map((author) => (
                  <li key={author.name} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[hsl(var(--surface))] flex items-center justify-center text-xs font-medium text-foreground/80 overflow-hidden">
                      {author.avatar ? (
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        initials(author.name)
                      )}
                    </div>
                    <span className="text-sm">{author.name}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex justify-center mt-16">
              <Link
                to="/articles"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-foreground/30 text-sm hover:bg-foreground/5 transition"
              >
                Read More Articles
              </Link>
            </div>
          </article>
        </main>

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

export default ArticleDetail;