import collage from "@/assets/collage.png";
import logo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="flex items-center justify-between bg-[hsl(var(--surface))] px-8 py-4">
          <a href="/" className="flex items-center gap-2 font-semibold">
            <img src={logo} alt="EveryoneCanLight logo" className="w-8 h-8 rounded-md object-contain" />
            <span>EveryoneCanLight</span>
          </a>
          <ul className="hidden md:flex items-center gap-12 text-sm text-foreground/80">
            <li><a href="#articles" className="hover:text-foreground">Articles</a></li>
            <li><a href="#equipment" className="hover:text-foreground">Lighting Equipment</a></li>
            <li><a href="#courses" className="hover:text-foreground">Courses</a></li>
          </ul>
        </nav>

        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-12 items-center flex-1 px-8 max-w-[1400px] mx-auto w-full py-[22px]">
          <div className="space-y-8">
            <h1 className="font-medium tracking-tight leading-[1.05] text-[82px]">
              Learn Lighting,<br />
              Create <span className="text-[hsl(var(--accent-lime))]">better</span> stories.
            </h1>
            <p className="text-lg text-foreground/70">
              Access hundreds of Videos and Lighting Gear Resources
            </p>

            <div className="pt-12 space-y-4 max-w-md">
              <p className="text-foreground/80">
                Be the first to know when courses and lighting gear resources are accessible
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="flex-1 rounded-md bg-[#414141] border border-[#6B6B6B] text-[#888888] px-4 py-3 text-sm placeholder:text-[#888888] focus:outline-none focus:border-foreground/50"
                />
                <button
                  type="submit"
                  className="rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
                >
                  Notify me
                </button>
              </form>
            </div>
          </div>

          {/* Visual collage */}
          <div className="relative">
            <img
              src={collage}
              alt="Creator learning lighting with stats and Amaran Ray equipment"
              className="w-full h-auto object-contain"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 px-8 border-t border-foreground/10 text-sm bg-[hsl(var(--surface))]">
          <div className="flex items-center gap-3 text-foreground/70">
            <img src={logo} alt="EveryoneCanLight logo" className="w-6 h-6 rounded object-contain" />
            © 2026 Everyone Can Light Technologies
          </div>
          <div className="flex items-center gap-6">
            <span className="text-foreground/50">Social</span>
            <a href="#" className="hover:text-foreground">Instagram</a>
            <a href="#" className="hover:text-foreground">YouTube</a>
            <a href="#" className="hover:text-foreground">TikTok</a>
            <a href="#" className="hover:text-foreground">LinkedIn</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
