import SiteFooter from "@/components/SiteFooter";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { X, ArrowLeftRight, ArrowLeft, ChevronDown, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import starlightIcon from "@/assets/starlight.png.asset.json";
import { compareVerdict } from "@/lib/compareVerdict";
import SiteNav from "@/components/SiteNav";
import { equipment, getEquipmentBySlug, type Equipment } from "@/data/equipment";
import Seo from "@/components/Seo";

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
        <Seo
          title="Compare Lighting Equipment — Everyone Can Light"
          description="Compare any two lights side by side: CRI, wattage, colour temperature, output, mounting and app control, so you can pick the right fixture for your shoot."
          path="/lighting-equipment/compare"
          noindex
        />
        <SiteNav />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-8 py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to={backHref}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors px-3 py-2 rounded-md border border-border hover:border-foreground/40"
            >
              <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Equipment Database</span><span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
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
                <X className="w-4 h-4" /> <span className="hidden sm:inline">Close comparison</span>
              </button>
            </div>
          </div>

          <h1 className="mt-6 sm:mt-8 text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight">Compare Equipment</h1>
          <p className="mt-2 text-foreground/60 text-sm">
            Pick any two items to see their specs side by side. Change either selection at any time.
          </p>

          {/* Selection + product heads: always side by side */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-6">
            {columns.map(({ slot, item }) => (
              <div key={slot} className="bg-white text-neutral-900 rounded-sm p-3 sm:p-6 flex flex-col">
                <label className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500">
                  {slot === "a" ? "Item 1" : "Item 2"}
                </label>
                <div className="relative mt-1.5">
                  <select
                    value={item?.slug ?? ""}
                    onChange={(e) => setSlot(slot, e.target.value)}
                    className="w-full appearance-none border border-neutral-300 rounded-md pl-3 pr-8 py-2.5 text-[13px] sm:text-sm bg-white truncate focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500"
                    aria-label={`Select equipment ${slot === "a" ? "one" : "two"}`}
                  >
                    <option value="">Select equipment…</option>
                    {equipment.map((e) => (
                      <option key={e.slug} value={e.slug}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>

                {item ? (
                  <>
                    <div className="mt-4 h-[120px] sm:h-[240px] flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="max-h-full w-auto object-contain" />
                    </div>
                    <h2 className="mt-3 text-sm sm:text-xl font-medium text-center leading-snug">{item.name}</h2>
                    <Link
                      to={`/lighting-equipment/${item.slug}`}
                      className="mt-2 text-center text-sky-600 hover:text-sky-700 hover:underline underline-offset-2 text-xs sm:text-sm"
                    >
                      View details
                    </Link>
                  </>
                ) : (
                  <p className="my-10 text-center text-neutral-500 text-xs sm:text-sm">Nothing selected yet.</p>
                )}
              </div>
            ))}
          </div>

          {/* Spec rows: label above, two values side by side */}
          {(a || b) && (
            <div className="mt-4 sm:mt-6 bg-white text-neutral-900 rounded-sm divide-y divide-neutral-200">
              {ROWS.map((r) => (
                <div key={r.label} className="px-3 sm:px-6 py-3">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-500">{r.label}</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-3 sm:gap-6">
                    <p className="text-[13px] sm:text-sm text-neutral-800 break-words">{a ? r.get(a) : "—"}</p>
                    <p className="text-[13px] sm:text-sm text-neutral-800 break-words">{b ? r.get(b) : "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Final verdict */}
          {(a || b) && (
            <section className="mt-4 sm:mt-6">
              <h2 className="text-lg sm:text-xl font-medium tracking-tight">The final call</h2>
              <p className="mt-1 text-sm text-foreground/60">
                A plain-language read on which one belongs in your kit.
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                {columns.map(({ slot, item }) => (
                  <div
                    key={slot}
                    className="rounded-sm border border-border bg-[hsl(var(--surface))] p-4 sm:p-6"
                  >
                    {item ? (
                      <>
                        <p className="text-sm sm:text-base font-medium">
                          Choose the {item.name} if:
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                          {compareVerdict(item, slot === "a" ? b : a)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-foreground/50">
                        Select a second item to see the verdict.
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-sm border border-primary/30 bg-primary/5 p-4">
                <img
                  src={starlightIcon.url}
                  alt="Starlight, your lighting companion"
                  className="h-10 w-10 shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Still not sure? Ask Starlight</p>
                  <p className="text-xs text-foreground/60">
                    Tell her what you're shooting and she'll pick one for you.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("starlight:ask", {
                        detail: {
                          text:
                            a && b
                              ? `I'm comparing the ${a.name} and the ${b.name}. Which one should I choose and why?`
                              : "Help me choose between two lights — what should I be comparing?",
                        },
                      })
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
                >
                  <Sparkles className="h-4 w-4" /> Ask Starlight
                </button>
              </div>
            </section>
          )}

        </main>

        <SiteFooter />
      </div>
    </div>
  );
};

export default EquipmentCompare;
