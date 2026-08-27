import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import Seo from "@/components/Seo";
import NotFound from "./NotFound";
import {
  fetchContributorAuthor,
  fetchPublishedPostBySlug,
  plainTextExcerpt,
  registerPostView,
  type PublishedPost,
} from "@/lib/contributor";

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const ContributorArticleDetail = ({ slug }: { slug: string }) => {
  const [post, setPost] = useState<PublishedPost | null>(null);
  const [author, setAuthor] = useState<{ display_name: string; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void (async () => {
      const p = await fetchPublishedPostBySlug(slug);
      if (!active) return;
      setPost(p);
      setLoading(false);
      if (p) {
        void registerPostView(slug);
        const a = await fetchContributorAuthor(p.author_id);
        if (active) setAuthor(a);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center">
        <Loader2 className="w-5 h-5 animate-spin text-foreground/50" />
      </div>
    );
  }

  if (!post) return <NotFound />;

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
  const description =
    plainTextExcerpt(post.blocks, 155) || `${post.title} — a lighting guide from Everyone Can Light.`;

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
          title={`${post.title} — Everyone Can Light`}
          description={description}
          path={`/articles/${post.slug}`}
          type="article"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            image: post.cover_image_url ?? undefined,
            datePublished: post.published_at ?? undefined,
            author: author ? [{ "@type": "Person", name: author.display_name }] : undefined,
            publisher: { "@type": "Organization", name: "Everyone Can Light" },
            mainEntityOfPage: `https://everyonecanlight.co/articles/${post.slug}`,
          }}
        />
        <SiteNav />

        <main className="flex-1 px-6 md:px-8 max-w-3xl mx-auto w-full py-12 md:py-16">
          <article>
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/70 mb-4">
                {post.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-tight">
                {post.title}
              </h1>
              <p className="mt-3 flex items-center gap-4 text-sm text-foreground/60">
                <span>{date}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> {post.view_count}
                </span>
              </p>
            </header>

            {post.cover_image_url && (
              <div className="rounded-xl overflow-hidden aspect-[2/1] bg-[hsl(var(--surface))] mb-10">
                <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-6">
              {post.blocks.map((block) => {
                if (block.type === "image") {
                  return (
                    <figure key={block.id} className="rounded-xl overflow-hidden bg-[hsl(var(--surface))]">
                      <img src={block.src} alt={block.alt} loading="lazy" className="w-full h-auto object-contain" />
                    </figure>
                  );
                }
                if (block.type === "title") {
                  return (
                    <h2 key={block.id} className="text-xl md:text-2xl font-semibold tracking-tight pt-4">
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "subtitle") {
                  return (
                    <h3 key={block.id} className="text-base md:text-lg font-semibold pt-2">
                      {block.text}
                    </h3>
                  );
                }
                return (
                  <p
                    key={block.id}
                    className="text-sm md:text-base leading-relaxed text-foreground/85 whitespace-pre-line"
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>

            {author && (
              <section className="mt-16">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm text-foreground/70">Writer(s)</span>
                  <span className="flex-1 h-px bg-foreground/15" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[hsl(var(--surface))] flex items-center justify-center text-xs font-medium text-foreground/80 overflow-hidden">
                    {author.avatar_url ? (
                      <img src={author.avatar_url} alt={author.display_name} className="w-full h-full object-cover" />
                    ) : (
                      initials(author.display_name)
                    )}
                  </div>
                  <span className="text-sm">{author.display_name}</span>
                </div>
              </section>
            )}

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
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ContributorArticleDetail;
