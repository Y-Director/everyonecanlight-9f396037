import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, ArrowLeft, ArrowRight, ArrowUpDown, Check, X } from "lucide-react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { equipment as EQUIPMENT, type EquipmentCategory } from "@/data/equipment";
import Seo from "@/components/Seo";
import { matchesSearch } from "@/lib/searchMatch";

type Category = "All Equipment" | EquipmentCategory;

const CATEGORIES: Category[] = [
  "All Equipment",
  "COB Lights",
  "Mat Lights",
  "Tube Lights",
  "Panel Lights",
  "Stands & Grips",
  "Others",
];

const PAGE_SIZE = 15;

const LightingEquipment = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const category = (searchParams.get("cat") as Category) || "All Equipment";
  const sortAsc = searchParams.get("sort") !== "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const [compare, setCompare] = useState<string[]>([]);

  const toggleCompare = (slug: string) => {
    setCompare((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length >= 2
          ? [prev[1], slug]
          : [...prev, slug]
    );
  };

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    });
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const list = EQUIPMENT.filter((e) => {
      const matchCat = category === "All Equipment" || e.category === category;
      const matchQuery = matchesSearch(e.name, query);
      return matchCat && matchQuery;
    });
    return [...list].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [category, query, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Pass current listing state to each detail link so the back button can restore it.
  const listingQuery = searchParams.toString();
  const detailHref = (slug: string) => {
    const params = new URLSearchParams();
    if (listingQuery) params.set("from", listingQuery);
    const q = params.toString();
    return `/lighting-equipment/${slug}${q ? `?${q}` : ""}`;
  };

  // Compact pagination: show up to ~9 page buttons with ellipses.
  const pageButtons = useMemo(() => {
    const pages: (number | "...")[] = [];
    const max = totalPages;
    const cur = currentPage;
    const push = (p: number) => {
      if (!pages.includes(p) && p >= 1 && p <= max) pages.push(p);
    };
    if (max <= 9) {
      for (let p = 1; p <= max; p++) pages.push(p);
    } else {
      push(1);
      push(2);
      if (cur > 4) pages.push("...");
      for (let p = cur - 1; p <= cur + 1; p++) push(p);
      if (cur < max - 3) pages.push("...");
      push(max - 1);
      push(max);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <Seo
          title="Lighting Equipment Database — Specs & Comparisons"
          description="Browse 250+ lighting fixtures, stands and modifiers with CRI, wattage, colour temperature and control-app support. Search, filter and compare any two lights."
          path="/lighting-equipment"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Lighting Equipment Database",
            url: "https://everyonecanlight.lovable.app/lighting-equipment",
          }}
        />
        <SiteNav />

        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-12">
          <header className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight">Equipment Database</h1>
            <p className="mt-3 whitespace-pre-line text-sm md:text-base text-foreground/60">
              Specifications, comparisons and use cases for 250+ lights, stands, grips and modifiers,{"\n"}
              so you know exactly what a fixture does before you buy or rent it.
            </p>
          </header>

          <h2 className="sr-only">Search and filter lighting equipment</h2>
          <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
            <div className="relative w-full lg:w-[360px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => update({ q: e.target.value, page: null })}
                placeholder="Search for Lights"
                className="w-full bg-muted/40 border border-border rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => update({ cat: c === "All Equipment" ? null : c, page: null })}
                  className={`transition-colors ${
                    category === c ? "text-foreground" : "text-foreground/55 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6 border-t border-border" />

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => update({ sort: sortAsc ? "desc" : null })}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
              aria-label={`Sort ${sortAsc ? "Z to A" : "A to Z"}`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortAsc ? "Sort A-Z" : "Sort Z-A"}
            </button>
          </div>

          <h2 className="sr-only">Lighting equipment listings</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {pageItems.map((item) => {
              const selected = compare.includes(item.slug);
              return (
              <div key={item.slug} className="relative">
              <Link
                to={detailHref(item.slug)}
                className="group block overflow-hidden rounded-sm bg-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-foreground/30"
              >
                <div className="aspect-square bg-white flex items-center justify-center p-6 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="bg-[#373737] text-white text-center py-4 px-3 text-sm">
                  {item.name}
                </div>
              </Link>
              <button
                type="button"
                onClick={() => toggleCompare(item.slug)}
                aria-pressed={selected}
                className={`absolute top-2 left-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs border transition-colors ${
                  selected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-white/85 text-neutral-700 border-neutral-300 hover:bg-white"
                }`}
              >
                {selected ? <Check className="w-3 h-3" /> : null}
                {selected ? "Selected" : "Compare"}
              </button>
              </div>
              );
            })}
          </div>

          {pageItems.length === 0 && (
            <p className="mt-12 text-center text-foreground/60">No equipment found.</p>
          )}

          {filtered.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="text-foreground/70 mr-2">Page</span>
              <button
                onClick={() => update({ page: String(Math.max(1, currentPage - 1)) })}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-foreground/70 hover:text-foreground disabled:opacity-30"
                aria-label="Previous page"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              {pageButtons.map((p, idx) =>
                p === "..." ? (
                  <span key={`e-${idx}`} className="text-foreground/40 px-1">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => update({ page: String(p) })}
                    className={`w-8 h-8 rounded-md transition-colors ${
                      p === currentPage ? "text-foreground font-medium" : "text-foreground/55 hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => update({ page: String(Math.min(totalPages, currentPage + 1)) })}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-foreground/70 hover:text-foreground disabled:opacity-30"
                aria-label="Next page"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {compare.length > 0 && (
            <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] sm:w-auto max-w-sm sm:max-w-none rounded-lg border border-border bg-[hsl(var(--surface))] shadow-lg px-4 py-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-foreground/70 whitespace-nowrap">
                  {compare.length} selected{compare.length === 1 ? " — pick one more" : ""}
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    to={`/lighting-equipment/compare?a=${compare[0]}${compare[1] ? `&b=${compare[1]}` : ""}${
                      listingQuery ? `&from=${encodeURIComponent(listingQuery)}` : ""
                    }`}
                    className={`rounded-md px-3 sm:px-4 py-1.5 transition-colors whitespace-nowrap ${
                      compare.length === 2
                        ? "bg-foreground text-background hover:opacity-90"
                        : "pointer-events-none opacity-40 bg-foreground text-background"
                    }`}
                  >
                    Compare
                  </Link>
                  <button
                    onClick={() => setCompare([])}
                    className="inline-flex items-center gap-1 text-foreground/60 hover:text-foreground whitespace-nowrap"
                    aria-label="Clear comparison selection"
                  >
                    <X className="w-4 h-4" /> <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 px-8 border-t border-border text-sm bg-[hsl(var(--surface))] text-foreground mt-12">
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

export default LightingEquipment;
