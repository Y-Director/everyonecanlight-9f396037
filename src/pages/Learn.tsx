import { Link } from "react-router-dom";
import { Video, FileText, ArrowRight } from "lucide-react";
import coursesHero from "@/assets/courses-hero.png";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";

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

const learnCards = [
  {
    header: "📖  Articles",
    body: "Learn lighting concepts in minutes.",
    cta: "Explore Articles",
    to: "/articles",
  },
  {
    header: "🎥 Courses (Coming Soon)",
    body: "Structured learning paths.",
    cta: "Join Waitlist",
    to: "/#notify",
  },
  {
    header: "🎬 Shift The Light Masterclass",
    body: "Hands-on practical training.",
    cta: "Reserve Your Spot",
    to: "/masterclass",
  },
  {
    header: "💡 Lighting Diagrams",
    body: "Study real lighting setups.",
    cta: "Explore Diagrams",
    to: "/articles",
  },
];

const Learn = () => {
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
        <Seo
          title="Learn Lighting — Courses, Guides & Diagrams"
          description="A lighting curriculum for creators: free guides, video courses, the Shift The Light masterclass and real production lighting diagrams you can recreate."
          path="/learn"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Learn Lighting",
            url: "https://everyonecanlight.lovable.app/learn",
            about: "Lighting courses, guides and diagrams for filmmakers and creators",
          }}
        />
        <SiteNav />

        {/* Content */}
        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-12">
          {/* Hero copy */}
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="font-medium tracking-tight text-[32px] sm:text-5xl lg:text-[64px] leading-[1.05]">
              Learn lighting, one lesson at a time.
            </h1>
            <p className="mt-5 text-sm sm:text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
              Perfectly designed curriculum from beginner levels to advanced.
            </p>
            <Link
              to="/articles"
              className="mt-7 inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Explore Free Guides
            </Link>
          </section>

          {/* Hero image */}
          <section className="mt-12 rounded-[2rem] overflow-hidden">
            <img
              src={coursesHero}
              alt="Creator learning lighting on a lit set"
              className="w-full h-auto object-cover"
            />
          </section>

          {/* Learning paths */}
          <section className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learnCards.map((c) => (
              <div
                key={c.header}
                className="flex flex-col rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-7"
              >
                <h2 className="text-lg font-medium tracking-tight">{c.header}</h2>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">{c.body}</p>
                <Link
                  to={c.to}
                  className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:gap-3 transition-all"
                >
                  {c.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
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
            <Link
              to="/#notify"
              className="rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Notify me
            </Link>
          </section>
        </main>

        <div className="mt-20">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
};

export default Learn;