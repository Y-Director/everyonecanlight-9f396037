import { Link } from "react-router-dom";
import { Video, FileText } from "lucide-react";
import logo from "@/assets/logo.png";
import coursesHero from "@/assets/courses-hero.png";

type Item = { label: string; icon: "video" | "doc" };

const items: Item[] = [
  { label: "Talking Head Lighting", icon: "video" },
  { label: "Mastering 1 Light", icon: "video" },
  { label: "Lighting Psychology", icon: "video" },
  { label: "Lighting on a Budget", icon: "video" },
  { label: "Podcast Lighting", icon: "video" },
  { label: "Lighting Equipment Types", icon: "video" },
  { label: "High Key vs Low Key", icon: "video" },
  { label: "Outdoor/Natural Lighting", icon: "video" },
  { label: "Lighting For Products", icon: "video" },
  { label: "Technology Behind Lights", icon: "doc" },
  { label: "Cinematic Lighting", icon: "video" },
  { label: "Light Diagrams", icon: "video" },
  { label: "Lighting For Interviews", icon: "video" },
  { label: "Light Setup Replication", icon: "video" },
  { label: "Lighting DIY Tips", icon: "doc" },
  { label: "Choosing the Right Light", icon: "video" },
];

const Courses = () => {
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
        {/* Nav */}
        <nav className="flex items-center justify-between bg-[hsl(var(--surface))] px-8 py-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src={logo} alt="EveryoneCanLight logo" className="w-8 h-8 rounded-md object-contain" />
            <span>EveryoneCanLight</span>
          </Link>
          <ul className="hidden md:flex items-center gap-12 text-sm">
            <li><Link to="/articles" className="text-foreground/60 hover:text-foreground">Articles</Link></li>
            <li><Link to="/lighting-equipment" className="text-foreground/60 hover:text-foreground">Lighting Equipment</Link></li>
            <li><Link to="/courses" className="text-foreground">Courses</Link></li>
          </ul>
        </nav>

        {/* Content */}
        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-12">
          {/* Hero */}
          <section className="relative rounded-[2rem] overflow-hidden">
            <img
              src={coursesHero}
              alt="Creator learning lighting"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="font-medium tracking-tight text-[hsl(var(--foreground))] text-6xl md:text-8xl lg:text-9xl drop-shadow-lg">
                50+ Videos
              </h1>
              <p className="mt-4 text-base md:text-xl text-foreground/90">
                Perfectly designed Curriculum from Beginner Levels to Advanced
              </p>
            </div>
          </section>

          {/* What you will learn */}
          <section className="mt-20">
            <h2 className="text-center text-4xl md:text-5xl font-medium">What You Will Learn</h2>

            <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-foreground/90">
                  <span className="flex items-center justify-center w-9 h-9 rounded-md border border-foreground/20">
                    {item.icon === "video" ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </span>
                  <span className="text-base">{item.label}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Coming soon CTA */}
          <section className="mt-20 flex items-center justify-center gap-6">
            <p className="text-xl md:text-2xl font-medium">Coming Soon To You</p>
            <button
              type="button"
              className="rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Notify me
            </button>
          </section>
        </main>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 px-8 mt-20 border-t border-foreground/10 text-sm bg-[hsl(var(--surface))]">
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

export default Courses;