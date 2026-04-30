import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import equipmentHero from "@/assets/light-product.png";

const LightingEquipment = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--page-light))] text-[hsl(var(--page-light-foreground))] relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--page-light-grid)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--page-light-grid)) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="flex items-center justify-between bg-[hsl(var(--surface))] text-foreground px-8 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src={logo} alt="EveryoneCanLight logo" className="w-8 h-8 rounded-md object-contain" />
            <span>EveryoneCanLight</span>
          </Link>
          <ul className="hidden md:flex items-center gap-12 text-sm">
            <li><Link to="/articles" className="text-foreground/60 hover:text-foreground">Articles</Link></li>
            <li><Link to="/lighting-equipment" className="text-foreground">Lighting Equipment</Link></li>
            <li><a href="/#courses" className="text-foreground/60 hover:text-foreground">Courses</a></li>
          </ul>
        </nav>

        {/* Content */}
        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight">Lighting Equipment Database</h1>
          <p className="mt-6 max-w-2xl mx-auto text-[hsl(var(--page-light-foreground))]/75 leading-relaxed">
            Explore lighting equipment specifications, reviews, comparisons, and recommended lights for different budgets and usecases.
          </p>

          {/* Product showcase — replaced with attachment */}
          <div className="mt-16 mx-auto max-w-3xl">
            <img
              src={equipmentHero}
              alt="Apurture 300D COB Light with specs: Color Daylight, CRI 96+, Watts 300W, App Sidus, Amaran"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Coming soon */}
          <div className="mt-24 space-y-2">
            <p className="text-3xl md:text-4xl font-medium">
              More than <span className="font-semibold">210+</span> Lighting equipment explained
            </p>
            <p className="text-2xl md:text-3xl font-medium text-[hsl(var(--cta))]">Coming soon to You</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 px-8 border-t border-[hsl(var(--page-light-grid))] text-sm bg-[hsl(var(--surface))] text-foreground">
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