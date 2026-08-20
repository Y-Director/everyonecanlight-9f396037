import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { X, ArrowLeftRight, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { equipment, getEquipmentBySlug, type Equipment } from "@/data/equipment";

const ROWS: { label: string; get: (e: Equipment) => string }[] = [
  { label: "Category", get: (e) => e.category },
  { label: "Type/Kind", get: (e) => e.typeKind },
  { label: "Color", get: (e) => e.color ?? "—" },
  { label: "CRI", get: (e) => e.cri ?? "—" },
  { label: "Watts", get: (e) => e.watts ?? "—" },
  { label: "App", get: (e) => e.app ?? "—" },
  { label: "Best Use Case", get: (e) => e.bestUseCase },
  { label: "Product details", get: (e) => e.productDetails },
];

const EquipmentCompare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const slugA = searchParams.get("a") ?? "";
  const slugB = searchParams.get("b") ?? "";
  const fromQuery = searchParams.get("from") ?? "";
  const backHref = `/lighting-equipment${fromQuery ? `?${fromQuery}` : ""}`;

  const a = getEquipmentBySlug(slugA);
  const b = getEquipmentBySlug(slugB);

  const setSlot = (slot: "a" | "b", slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set(slot, slug);
    else next.delete(slot);
    setSearchParams(next, { replace: true });
  };

  const swap = () => {
    const next = new URLSearchParams(searchParams);
    next.set("a", slugB);
    next.set("b", slugA);
    setSearchParams(next, { replace: true });
  };

  const columns: { slot: "a" | "b"; item?: Equipment }[] = [
    { slot: "a", item: a },
    { slot: "b", item: b },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <SiteNav />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to={backHref}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors px-3 py-2 rounded-md border border-border hover:border-foreground/40"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Equipment Database
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={swap}
                disabled={!a || !b}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-border text-foreground/80 hover:text-foreground hover:border-foreground/40 disabled:opacity-40"
              >
                <ArrowLeftRight className="w-4 h-4" /> Swap
              </button>
              <button
                onClick={() => navigate(backHref)}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-border text-foreground/80 hover:text-foreground hover:border-foreground/40"
                aria-label="Close comparison"
              >
                <X className="w-4 h-4" /> Close comparison
              </button>
            </div>
          </div>

          <h1 className="mt-8 text-3xl md:text-4xl font-medium tracking-tight">Compare Equipment</h1>
          <p className="mt-2 text-foreground/60 text-sm">
            Pick any two items to see their specs side by side. Change either selection at any time.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {columns.map(({ slot, item }) => (
              <div key={slot} className="bg-white text-neutral-900 rounded-sm p-6">
                <select
                  value={item?.slug ?? ""}
                  onChange={(e) => setSlot(slot, e.target.value)}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white"
                  aria-label={`Select equipment ${slot === "a" ? "one" : "two"}`}
                >
                  <option value="">Select equipment…</option>
                  {equipment.map((e) => (
                    <option key={e.slug} value={e.slug}>
                      {e.name}
                    </option>
                  ))}
                </select>

                {item ? (
                  <>
                    <div className="mt-5 h-[240px] flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-h-[240px] w-auto object-contain" />
                    </div>
                    <h2 className="mt-4 text-xl font-medium text-center">{item.name}</h2>
                    <dl className="mt-5 divide-y divide-neutral-200">
                      {ROWS.map((r) => (
                        <div key={r.label} className="py-3">
                          <dt className="text-xs uppercase tracking-wider text-neutral-500">{r.label}</dt>
                          <dd className="mt-1 text-sm text-neutral-800">{r.get(item)}</dd>
                        </div>
                      ))}
                    </dl>
                    <Link
                      to={`/lighting-equipment/${item.slug}`}
                      className="mt-5 inline-block text-sky-600 hover:text-sky-700 hover:underline underline-offset-2 text-sm"
                    >
                      View full details
                    </Link>
                  </>
                ) : (
                  <p className="mt-10 mb-10 text-center text-neutral-500 text-sm">
                    Nothing selected yet.
                  </p>
                )}
              </div>
            ))}
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

export default EquipmentCompare;
