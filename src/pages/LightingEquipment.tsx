import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, ArrowLeft, ArrowRight, ArrowUpDown } from "lucide-react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import placeholderLight from "@/assets/light-product.png";
import godoxVl150 from "@/assets/lights/godox-vl150.png";
import colbor220r from "@/assets/lights/colbor-cl220r.png";
import amaran200xs from "@/assets/lights/amaran-200xs.png";

type Category = "All Equipment" | "COB Lights" | "Mat Lights" | "Tube Lights" | "Panel Lights" | "Stands & Grips" | "Others";

type Equipment = {
  slug: string;
  name: string;
  image: string;
  category: Exclude<Category, "All Equipment">;
};

const CATEGORIES: Category[] = [
  "All Equipment",
  "COB Lights",
  "Mat Lights",
  "Tube Lights",
  "Panel Lights",
  "Stands & Grips",
  "Others",
];

const EQUIPMENT: Equipment[] = [
  { slug: "aputure-120d", name: "Aputure 120D", image: placeholderLight, category: "COB Lights" },
  { slug: "godox-vl-150", name: "Godox VL 150", image: godoxVl150, category: "COB Lights" },
  { slug: "colbor-220r", name: "Colbor 220R", image: colbor220r, category: "COB Lights" },
  { slug: "aputure-nova-300c", name: "Aputure Nova 300C", image: placeholderLight, category: "Panel Lights" },
  { slug: "amaran-200x-s", name: "Amaran 200X S", image: amaran200xs, category: "COB Lights" },
  { slug: "reflector-dish", name: "Reflector Dish", image: placeholderLight, category: "Others" },
  { slug: "aputure-600d", name: "Aputure 600D", image: placeholderLight, category: "COB Lights" },
  { slug: "amaran-pt2c", name: "Amaran PT2C", image: placeholderLight, category: "Tube Lights" },
  { slug: "amaran-f22c", name: "Amaran F22C", image: placeholderLight, category: "Mat Lights" },
  { slug: "aputure-mc", name: "Aputure MC", image: placeholderLight, category: "Panel Lights" },
  { slug: "aputure-b7c", name: "Aputure B7C", image: placeholderLight, category: "Others" },
  { slug: "nanlite-gobo-disk", name: "Nanlite Gobo Disk", image: placeholderLight, category: "Others" },
  { slug: "nanlite-fs-200", name: "Nanlite FS 200", image: placeholderLight, category: "COB Lights" },
  { slug: "sutefoto-p230bi", name: "Sutefoto P230Bi", image: placeholderLight, category: "COB Lights" },
  { slug: "feelworld-fl-125d", name: "Feelworld FL 125D", image: placeholderLight, category: "COB Lights" },
];

const PAGE_SIZE = 15;

const LightingEquipment = () => {
  const [category, setCategory] = useState<Category>("All Equipment");
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const list = EQUIPMENT.filter((e) => {
      const matchCat = category === "All Equipment" || e.category === category;
      const matchQuery = e.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
    return [...list].sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  }, [category, query, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <SiteNav />

        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-12">
          {/* Top bar: search + categories */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
            <div className="relative w-full lg:w-[360px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" aria-hidden="true" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search for Lights"
                className="w-full bg-muted/40 border border-border rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    setPage(1);
                  }}
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

          {/* Sort control */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSortAsc((s) => !s)}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
              aria-label={`Sort ${sortAsc ? "Z to A" : "A to Z"}`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortAsc ? "Sort A-Z" : "Sort Z-A"}
            </button>
          </div>

          {/* Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {pageItems.map((item) => (
              <Link
                key={item.slug}
                to={`/lighting-equipment/${item.slug}`}
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
                <div className="bg-muted/60 text-center py-4 px-3 text-sm text-foreground/85 group-hover:text-foreground">
                  {item.name}
                </div>
              </Link>
            ))}
          </div>

          {pageItems.length === 0 && (
            <p className="mt-12 text-center text-foreground/60">No equipment found.</p>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-4 text-sm">
              <span className="text-foreground/70 mr-2">Page</span>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-foreground/70 hover:text-foreground disabled:opacity-30"
                aria-label="Previous page"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-md transition-colors ${
                    p === currentPage ? "text-foreground font-medium" : "text-foreground/55 hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-foreground/70 hover:text-foreground disabled:opacity-30"
                aria-label="Next page"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
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