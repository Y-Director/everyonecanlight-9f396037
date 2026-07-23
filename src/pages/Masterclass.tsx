import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import logo from "@/assets/logo.png";
import heroImg from "@/assets/masterclass-hero.jpg";
import SiteNav from "@/components/SiteNav";

type Testimonial = {
  name: string;
  role: string;
  year: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Chidera O.",
    role: "Content Creator",
    year: "STL 2024",
    quote:
      "Shift The Light completely changed how I think about lighting. I walked in a hobbyist and walked out with a system I use on every shoot.",
  },
  {
    name: "Tomiwa A.",
    role: "Filmmaker",
    year: "STL 2024",
    quote:
      "The hands-on residency format is unmatched. Real fixtures, real diagrams, and feedback on my actual setup — worth every naira.",
  },
  {
    name: "Grace E.",
    role: "Photographer",
    year: "STL 2023",
    quote:
      "I finally understood color temperature, CRI and how to shape light for skin tones. My portraits look ten times more professional now.",
  },
  {
    name: "Femi K.",
    role: "YouTuber",
    year: "STL 2023",
    quote:
      "Adeyinka teaches with so much clarity. The 1-light and 2-light setups he broke down are still the backbone of my studio today.",
  },
  {
    name: "Ada M.",
    role: "Video Producer",
    year: "STL 2022",
    quote:
      "Best investment I've made in my craft. The community that came out of the class is still active and supportive years later.",
  },
];

const Masterclass = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <SiteNav />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-12">
          {/* Hero banner */}
          <section className="relative rounded-[2rem] overflow-hidden border border-foreground/10">
            <img
              src={heroImg}
              alt="Shift The Light 2 Masterclass"
              width={1920}
              height={1080}
              className="w-full h-[420px] md:h-[560px] object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, hsl(0 0% 0% / 0.85) 0%, hsl(0 0% 0% / 0.55) 45%, hsl(0 0% 0% / 0.15) 100%)",
              }}
              aria-hidden="true"
            />

            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-14 max-w-2xl">
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-foreground/70">
                  November 2026 · Creator Residency
                </p>
                <h1 className="mt-4 text-4xl md:text-6xl font-medium tracking-tight text-foreground leading-[1.05]">
                  Shift The Light 2
                  <span className="block text-foreground/80 text-2xl md:text-3xl font-normal mt-2">
                    (Creator Residency)
                  </span>
                </h1>
                <p className="mt-5 text-sm md:text-base text-foreground/75 max-w-lg">
                  A hands-on masterclass with Adeyinka Ibidapo for creators
                  ready to master lighting for video, photo and studio work.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#register"
                    className="inline-flex items-center rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
                  >
                    Register
                  </a>
                  <a
                    href="#schedule"
                    className="inline-flex items-center rounded-md border border-foreground/30 text-foreground px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition"
                  >
                    See Schedule
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mt-20">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  Testimonials
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl font-medium tracking-tight">
                  Voices from past Masterclasses
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Scroll testimonials left"
                  onClick={() => scrollBy(-1)}
                  className="w-10 h-10 rounded-full border border-foreground/25 flex items-center justify-center hover:bg-foreground hover:text-background transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Scroll testimonials right"
                  onClick={() => scrollBy(1)}
                  className="w-10 h-10 rounded-full border border-foreground/25 flex items-center justify-center hover:bg-foreground hover:text-background transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={scrollerRef}
              className="mt-8 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-8 px-8 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {testimonials.map((t, i) => (
                <article
                  key={i}
                  className="snap-start shrink-0 w-[85%] sm:w-[420px] rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-6 flex flex-col"
                >
                  <Quote className="w-6 h-6 text-foreground/40" aria-hidden="true" />
                  <p className="mt-4 text-base leading-relaxed text-foreground/85 flex-1">
                    "{t.quote}"
                  </p>
                  <footer className="mt-6 flex items-center gap-3 border-t border-foreground/10 pt-4">
                    <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-xs text-foreground/60">
                        {t.role} · {t.year}
                      </p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </section>
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

export default Masterclass;