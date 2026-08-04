import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import collage from "@/assets/collage.png";
import logo from "@/assets/logo.png";
import masterclassHero from "@/assets/masterclass-hero.jpg";
import equipmentOptions from "@/assets/lighting-equipment-options.png";
import lightProduct from "@/assets/light-product.png";
import SiteNav from "@/components/SiteNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

const quickPaths = [
  {
    to: "/rent-equipment",
    title: "Rent Equipment",
    brief:
      "Book lights, stands, mats and modifiers from the ECL Light Bank. Pick your dates, pay online, and get it delivered with an operator.",
    cta: "Build a gear list",
    tint: "--card-sky",
    image: equipmentOptions,
  },
  {
    to: "/control-apps",
    title: "Control Apps",
    brief:
      "Every manufacturer control app in one place — what it does, which lights it pairs with, and where to download it.",
    cta: "Find your app",
    tint: "--card-mint",
    image: lightProduct,
  },
  {
    to: "/masterclass",
    title: "Masterclass",
    brief:
      "Shift the Light: our annual hands-on lighting masterclass. One day, real fixtures, real sets, this November.",
    cta: "Reserve a seat",
    tint: "--surface",
    image: masterclassHero,
  },
] as const;

const stats = [
  { value: "250+", label: "Lights and accessories catalogued" },
  { value: "100+", label: "Items available to rent" },
  { value: "5:30 AM", label: "Earliest daily pick-up time" },
  { value: "1", label: "Masterclass every year" },
];

const learnCards = [
  {
    to: "/articles",
    title: "Why your videos look dark",
    brief: "The exposure and placement mistakes that flatten a good camera.",
  },
  {
    to: "/articles",
    title: "What is wattage in lighting?",
    brief: "Power, output and dimming explained without the spec sheet.",
  },
  {
    to: "/courses",
    title: "Courses",
    brief: "Structured lighting lessons, from first light to full set.",
  },
];

const Index = () => {
  const { hash } = useLocation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hash === "#notify") {
      const el = document.getElementById("notify");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const input = el.querySelector("input[type=email]") as HTMLInputElement | null;
        input?.focus({ preventScroll: true });
      }
    }
  }, [hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const value = email.trim();
    if (!value) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value)) {
      toast({
        title: "Invalid email address",
        description: "Please include an \"@\" and a valid domain (e.g. name@example.com).",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("notify-signup", {
        body: { email: value },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Something went wrong");
      if (data?.duplicate) {
        toast({
          title: "You're already on the list",
          description: "This email has been added to our priority creators list.",
        });
      } else {
        toast({ title: "You're on the list!", description: "We'll be in touch soon." });
      }
      setEmail("");
    } catch (err: any) {
      toast({
        title: "Couldn't sign you up",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
        <SiteNav />

        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-12 items-center flex-1 px-8 max-w-[1400px] mx-auto w-full py-[22px]">
          {/* Left column — uses flex on mobile/tablet so the image can be reordered between headline and form */}
          <div className="flex flex-col gap-8 lg:space-y-8 lg:gap-0">
            {/* Headline */}
            <div className="order-1 space-y-6">
              <h1 className="font-medium tracking-tight leading-[1.05] text-5xl sm:text-6xl lg:text-[82px]">
                Everything a Creator<br />
                Needs for <span className="text-[hsl(var(--accent-lime))]">Lighting</span>
              </h1>
              <p className="text-lg text-foreground/70">
                Access hundreds of Videos and Lighting Gear Resources
              </p>
            </div>

            {/* Visual collage — shown between headline and form on mobile/tablet, hidden on lg (rendered in right column) */}
            <div className="order-2 lg:hidden">
              <img
                src={collage}
                alt="Creator learning lighting with stats and Amaran Ray equipment"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Email form */}
            <div id="notify" className="order-3 pt-4 lg:pt-12 space-y-4 max-w-md scroll-mt-24">
              <p className="text-foreground/80">
                Be the first to know when courses and lighting gear resources are accessible
              </p>
              <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-md bg-[#414141] border border-[#6B6B6B] text-[#888888] px-4 py-3 text-sm placeholder:text-[#888888] focus:outline-none focus:border-foreground/50"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Notify me"}
                </button>
              </form>
              <p className="text-xs text-foreground/60">
                Use the format <span className="text-foreground/80">name@example.com</span> — e.g. jane.doe@gmail.com, creator@studio.co
              </p>
            </div>
          </div>

          {/* Visual collage — right column on large screens only */}
          <div className="relative hidden lg:block">
            <img
              src={collage}
              alt="Creator learning lighting with stats and Amaran Ray equipment"
              className="w-full h-auto object-contain"
            />
          </div>
        </section>

        {/* Quick paths */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16 border-t border-foreground/10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
              Africa's largest lighting platform
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight">
              Rent the gear. Control the lights. Learn the craft.
            </h2>
            <p className="mt-4 text-foreground/70">
              Three things every creator asks us for — now in one place.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {quickPaths.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="group rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-6 flex flex-col hover:border-foreground/25 transition-colors"
              >
                <div
                  className="rounded-xl aspect-[16/10] overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: `hsl(var(${p.tint}))` }}
                >
                  {p.image ? (
                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs uppercase tracking-widest text-[hsl(var(--page-light-foreground))]/50">
                      Image
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-xl font-medium">{p.title}</h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed flex-1">{p.brief}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-[hsl(var(--accent-lime))]">
                  {p.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Rent Equipment segment */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16 grid lg:grid-cols-2 gap-12 items-center border-t border-foreground/10">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent-lime))]">
              Rent Equipment
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1]">
              The Light Bank, <span className="text-[hsl(var(--accent-lime))]">delivered</span> to
              your set.
            </h2>
            <p className="text-foreground/70 max-w-md leading-relaxed">
              Aputure, Amaran, Godox, Nanlite and the full support kit — stands, scrims, mats, tubes,
              cables and V-mounts. Build a gear list, pick your dates, pay online, and rentals from
              ₦60,000 up ride out with a Lighting Operator and free props.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/rent-equipment"
                className="rounded-full bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
              >
                Browse the Light Bank
              </Link>
              <Link
                to="/lighting-equipment"
                className="rounded-full border border-foreground/20 px-6 py-3 text-sm hover:border-foreground/40 transition"
              >
                Equipment Database
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-[hsl(var(--card-sky))] aspect-[4/3] flex items-center justify-center">
            <img src={equipmentOptions} alt="Lighting gear available in the ECL Light Bank" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Control Apps segment */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16 grid lg:grid-cols-2 gap-12 items-center border-t border-foreground/10">
          <div className="order-2 lg:order-1 rounded-2xl overflow-hidden bg-[hsl(var(--card-mint))] aspect-[4/3] flex items-center justify-center p-10">
            <img src={lightProduct} alt="Light controlled from a manufacturer app" className="w-full h-full object-contain" />
          </div>
          <div className="order-1 lg:order-2 space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent-lime))]">
              Control Apps
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1]">
              Every manufacturer app, one page.
            </h2>
            <p className="text-foreground/70 max-w-md leading-relaxed">
              Sidus Link, Amaran Link, Godox Light, NANLINK and more — with the right download for
              iOS and Android, what each app actually controls, and the quirks to know before you're
              on set with a client waiting.
            </p>
            <Link
              to="/control-apps"
              className="inline-block rounded-full bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              See the apps
            </Link>
          </div>
        </section>

        {/* Masterclass segment */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16 grid lg:grid-cols-2 gap-12 items-center border-t border-foreground/10">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent-lime))]">
              Masterclass
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1]">
              Shift the Light — hands on the lights, once a year.
            </h2>
            <p className="text-foreground/70 max-w-md leading-relaxed">
              A full day of practical lighting with real fixtures, real sets and real problems.
              Learn shaping, ratios, colour and motivation the way it happens on a working job — not
              from a slide deck.
            </p>
            <Link
              to="/masterclass"
              className="inline-block rounded-full bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Reserve a seat
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden bg-[hsl(var(--surface))] aspect-[4/3]">
            <img src={masterclassHero} alt="Shift the Light masterclass session" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Numbers band */}
        <section className="px-8 py-14 border-t border-foreground/10 bg-[hsl(var(--surface))]">
          <div className="max-w-[1400px] mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-medium tracking-tight text-[hsl(var(--accent-lime))]">
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-foreground/60">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Learn band */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
                Lighting guides and updates
              </h2>
              <p className="mt-3 text-foreground/70">
                Tips and guides from real life experiences on set.
              </p>
            </div>
            <Link
              to="/articles"
              className="text-sm text-foreground/80 underline decoration-[hsl(var(--cta))] decoration-2 underline-offset-4 hover:text-foreground"
            >
              Read the articles
            </Link>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {learnCards.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group rounded-2xl border border-foreground/10 p-6 hover:border-foreground/25 transition-colors"
              >
                <div className="rounded-xl aspect-[16/10] bg-foreground/5 flex items-center justify-center text-xs uppercase tracking-widest text-foreground/35">
                  Image
                </div>
                <h3 className="mt-5 font-medium">{c.title}</h3>
                <p className="mt-2 text-sm text-foreground/60">{c.brief}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-8 py-16 border-t border-foreground/10">
          <div className="max-w-[1400px] mx-auto rounded-3xl bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-8 py-14 text-center">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
              Light your next project properly.
            </h2>
            <p className="mt-3 text-[hsl(var(--cta-foreground))]/80 max-w-xl mx-auto">
              Rent the gear, learn the craft, and get told first when new courses and resources go
              live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link
                to="/rent-equipment"
                className="rounded-full bg-[hsl(var(--accent-lime))] text-[hsl(var(--page-light-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
              >
                Rent equipment
              </Link>
              <a
                href="#notify"
                className="rounded-full border border-[hsl(var(--cta-foreground))]/40 px-6 py-3 text-sm hover:border-[hsl(var(--cta-foreground))] transition"
              >
                Get notified
              </a>
            </div>
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

export default Index;
