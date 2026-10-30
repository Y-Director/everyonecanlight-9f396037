import { useState } from "react";
import goBlack from "@/assets/eclgo/ecl-go-black.png.asset.json";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { ECL_GO_KITS, type EclGoKit, kitDailyTotal } from "@/data/eclGo";
import { formatNaira } from "@/data/rentalCatalog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EclGoHero = () => {
  const navigate = useNavigate();
  const [infoKit, setInfoKit] = useState<EclGoKit | null>(null);

  return (
    <section className="px-6 sm:px-8 max-w-[1400px] mx-auto w-full pt-6 pb-12 sm:pt-10 sm:pb-20 text-center">
      <h1 className="font-medium tracking-tight leading-[1.05] text-[32px] sm:text-5xl lg:text-[60px] max-w-4xl mx-auto">
        Hey, Creator.
        <br />
        What are you <span className="text-[hsl(var(--accent-lime))]">shooting</span> today?
      </h1>
      <p className="mt-5 text-lg sm:text-xl font-medium">Choose your Go</p>
      <p className="mt-1 text-sm sm:text-base text-foreground/60">
        The right lights for whatever you're creating
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {ECL_GO_KITS.map((kit) => (
          <div
            key={kit.slug}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/light-house?go=${kit.slug}`)}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/light-house?go=${kit.slug}`)}
            className="group relative overflow-hidden rounded-3xl min-h-[480px] p-6 text-left cursor-pointer flex flex-col transition-transform hover:-translate-y-1 text-background"
            style={{
              background: `linear-gradient(160deg, hsl(${kit.from}), hsl(${kit.to}))`,
            }}
          >
            {/* geometric shape */}
            <div
              aria-hidden
              className="absolute -right-16 top-1/3 w-64 h-64 rotate-45 rounded-3xl opacity-25 bg-background/40"
            />
            <div className="relative flex items-start justify-between">
              <img src={goBlack.url} alt="ECL Go" className="h-5 w-auto object-contain" />
              <button
                type="button"
                aria-label={`${kit.name} instructions and placement`}
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoKit(kit);
                }}
                className="flex items-center gap-1 rounded-full bg-background/20 hover:bg-background/35 px-2.5 py-1 text-[11px] font-medium backdrop-blur"
              >
                <Info className="h-3.5 w-3.5" /> Placement
              </button>
            </div>
            <h2 className="relative mt-4 text-3xl font-semibold leading-tight">{kit.name}</h2>
            <p className="relative mt-1 text-sm opacity-80">{kit.tagline}</p>

            <div className="relative flex-1 flex items-center justify-center py-6">
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-110">
                <ArrowRight className="h-8 w-8" />
              </span>
            </div>

            <ul className="relative text-xs space-y-0.5 opacity-90">
              {kit.items.map(([n, q]) => (
                <li key={n}>
                  {q > 1 ? `${q}× ` : ""}
                  {n}
                </li>
              ))}
            </ul>
            <p className="relative mt-3 text-sm font-semibold">{formatNaira(kitDailyTotal(kit))} / day</p>
          </div>
        ))}
      </div>

      <Dialog open={!!infoKit} onOpenChange={(o) => !o && setInfoKit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{infoKit?.name}: Instructions & placement</DialogTitle>
            <DialogDescription>
              {infoKit?.instructions ?? "Setup and light placement guide coming soon."}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default EclGoHero;
