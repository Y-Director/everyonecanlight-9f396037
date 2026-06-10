import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { equipment, getEquipmentBySlug } from "@/data/equipment";

const LightingEquipmentDetail = () => {
  const { slug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const item = getEquipmentBySlug(slug);

  // Preserve listing state across navigation. The listing page passes its
  // query string in `from` so the back button can restore filters.
  const fromQuery = searchParams.get("from") ?? "";
  const backHref = `/lighting-equipment${fromQuery ? `?${fromQuery}` : ""}`;
  const detailHref = (s: string) =>
    `/lighting-equipment/${s}${fromQuery ? `?from=${encodeURIComponent(fromQuery)}` : ""}`;

  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => setActiveImage(0), [slug]);

  if (!item) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="max-w-[1400px] mx-auto px-8 py-24 text-center">
          <h1 className="text-3xl font-medium">Equipment not found</h1>
          <Link to={backHref} className="mt-6 inline-flex items-center gap-2 text-foreground/70 hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Lighting Equipment
          </Link>
        </main>
      </div>
    );
  }

  const others = equipment.filter((e) => e.slug !== item.slug).slice(0, 10);

  const badges: { label: string; bg: string }[] = [];
  if (item.color) badges.push({ label: `Color: ${item.color}`, bg: "bg-[hsl(48_92%_86%)] text-[hsl(36_40%_25%)]" });
  if (item.cri) badges.push({ label: `CRI: ${item.cri}`, bg: "bg-[hsl(200_85%_88%)] text-[hsl(210_50%_25%)]" });
  if (item.watts) badges.push({ label: `Watts: ${item.watts}`, bg: "bg-[hsl(265_70%_88%)] text-[hsl(265_40%_30%)]" });
  if (item.app) badges.push({ label: `App: ${item.app}`, bg: "bg-[hsl(140_55%_82%)] text-[hsl(150_45%_22%)]" });

  const gallery = item.images.length > 0 ? item.images : [item.image];
  const mainImage = gallery[Math.min(activeImage, gallery.length - 1)];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <SiteNav />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-8">
          {/* Back button — returns to the listing with prior search/sort applied. */}
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors mb-6 px-3 py-2 rounded-md border border-border hover:border-foreground/40"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Lighting Equipment
          </Link>

          <article className="bg-white text-neutral-900 rounded-sm p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-start">
              {/* Gallery */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center min-h-[320px] bg-white">
                  <img
                    key={mainImage}
                    src={mainImage}
                    alt={item.name}
                    className="max-h-[360px] w-auto object-contain"
                  />
                </div>
                {gallery.length > 1 && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {gallery.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        aria-label={`Show image ${i + 1} of ${gallery.length}`}
                        className={`w-20 h-20 rounded border bg-white flex items-center justify-center p-2 transition ${
                          i === activeImage
                            ? "border-neutral-900 ring-2 ring-neutral-900/20"
                            : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        <img src={src} alt="" className="max-w-full max-h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight">{item.name}</h1>
                <div className="mt-5 border-t border-neutral-200" />

                {badges.length > 0 && (
                  <div className="mt-6 flex flex-col gap-3 items-start">
                    {badges.map((b) => (
                      <span
                        key={b.label}
                        className={`inline-block px-4 py-1.5 rounded-full text-sm ${b.bg}`}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-7 border-t border-neutral-200" />

                <section className="mt-6">
                  <h2 className="text-lg font-semibold">Type/Kind</h2>
                  <p className="mt-2 text-neutral-700">{item.typeKind}</p>
                </section>

                <section className="mt-6">
                  <h2 className="text-lg font-semibold">Best Use Case</h2>
                  <p className="mt-2 text-neutral-700">{item.bestUseCase}</p>
                </section>

                <section className="mt-6">
                  <h2 className="text-lg font-semibold">Product details</h2>
                  <p className="mt-2 text-neutral-700 leading-relaxed">{item.productDetails}</p>
                </section>

                <Link
                  to="/courses"
                  className="mt-6 inline-block text-sky-600 hover:text-sky-700 underline-offset-2 hover:underline"
                >
                  See Related Courses
                </Link>
              </div>
            </div>
          </article>

          <div className="mt-16 flex items-center gap-6">
            <div className="flex-1 h-px bg-border" />
            <h2 className="text-sm md:text-base uppercase tracking-[0.2em] text-foreground/70">
              Explore More
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={detailHref(o.slug)}
                className="group block overflow-hidden rounded-sm bg-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-foreground/30"
              >
                <div className="aspect-square bg-white flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src={o.image}
                    alt={o.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="bg-[#373737] text-white text-center py-4 px-3 text-sm">
                  {o.name}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to={backHref}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all equipment
            </Link>
          </div>
        </main>

        <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 px-8 border-t border-border text-sm bg-[hsl(var(--surface))] text-foreground mt-16">
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

export default LightingEquipmentDetail;
