import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import masterclassBand from "@/assets/landing/masterclass-band.png.asset.json";
import comingSoonSticker from "@/assets/landing/coming-soon-sticker.png.asset.json";
import heroCollage from "@/assets/landing/hero-collage.png.asset.json";
import singleLightFood from "@/assets/landing/single-light-food.png.asset.json";
import setupDiagram from "@/assets/landing/setup-diagram.png.asset.json";
import equipmentAnnotated from "@/assets/landing/equipment-annotated.png.asset.json";
import SiteNav from "@/components/SiteNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Video } from "lucide-react";

const courseTopics = [
  "Talking Head Lighting",
  "Podcast Lighting",
  "Lighting For Products",
  "Lighting For Interviews",
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
        <section className="px-8 max-w-[1400px] mx-auto w-full pt-10 pb-20 text-center">
          <h1 className="font-medium tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-[64px] max-w-4xl mx-auto">
            Everything you need
            <br />
            to light <span className="text-[hsl(var(--accent-lime))]">better</span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
            We've built every tool in one place, whether you're learning, renting, or preparing for
            your next production.
          </p>

          <img
            src={heroCollage.url}
            alt="Lighting equipment, learning videos and equipment specs available on Everyone Can Light"
            className="mt-12 w-full max-w-5xl mx-auto h-auto object-contain"
          />

          <Link
            to="/rent-equipment"
            className="mt-10 inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            Start Renting Light Gears
          </Link>
        </section>

        {/* Control apps band */}
        <section className="px-8 py-24 border-t border-foreground/10 bg-[hsl(var(--surface))]">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1fr_auto] gap-x-12 gap-y-8 items-center">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight leading-[1.15]">
              Control lights easily on your phone
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <p className="text-sm text-foreground/60 leading-relaxed max-w-sm">
                Simultaneously control multiple lights from the comfort of your phone even if they are
                at a distant away.
              </p>
              <Link
                to="/control-apps"
                className="shrink-0 inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Browse Control Apps
              </Link>
            </div>
          </div>
        </section>

        {/* One single light */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16">
          <div className="grid lg:grid-cols-[1.1fr_1.2fr_1fr] gap-6 items-stretch">
            <div className="rounded-2xl overflow-hidden bg-[hsl(var(--surface))]">
              <img
                src={singleLightFood.url}
                alt="Plate of jollof spaghetti lit with one single light source"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-2xl bg-[hsl(var(--surface))] border border-foreground/10 p-7">
                <h3 className="text-2xl sm:text-[28px] font-medium tracking-tight leading-snug">
                  It starts with knowing how to work with{" "}
                  <span className="text-[hsl(var(--accent-lime))]">one single light.</span>
                </h3>
                <p className="mt-4 text-sm text-foreground/55 leading-relaxed">
                  Don't fall into the trap of many lights makes the image finer. The direction,
                  intensity and modification of 1 light can shape an entire scene.
                </p>
              </div>

              <div className="rounded-2xl bg-[hsl(var(--band-soft-lime))] text-[hsl(var(--page-light-foreground))] p-7">
                <p className="text-sm leading-relaxed">
                  Understand how to read lighting setup diagrams and replicate them in your space.
                </p>
              </div>

              <div className="mt-auto">
                <Link
                  to="/articles"
                  className="inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                >
                  Read Articles on Lighting
                </Link>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-[hsl(var(--surface))]">
              <img
                src={setupDiagram.url}
                alt="Overhead lighting setup diagram showing key light, subject and camera position"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Equipment database */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16 grid lg:grid-cols-2 gap-12 items-center border-t border-foreground/10">
          <img
            src={equipmentAnnotated.url}
            alt="Aputure 300D COB light annotated with colour temperature, CRI, wattage and control apps"
            className="w-full h-auto object-contain"
            loading="lazy"
          />
          <div className="space-y-5">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight">
              Lighting Equipment Database
            </h2>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-md">
              Explore over 200 lighting equipment specifications, reviews, comparisons, and
              recommended lights for different budgets and use cases.
            </p>
            <Link
              to="/lighting-equipment"
              className="inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Explore Equipment Database
            </Link>
          </div>
        </section>

        {/* Courses — coming soon */}
        <section
          id="notify"
          className="relative px-8 py-20 bg-[hsl(var(--band-soft-lime))] text-[hsl(var(--page-light-foreground))] scroll-mt-24"
        >
          <div className="max-w-[1400px] mx-auto text-center">
            <div className="absolute left-8 lg:left-24 top-10 w-24 h-24 rounded-full bg-[hsl(var(--accent-lime))] flex items-center justify-center -rotate-12 shadow-lg">
              <span className="text-sm font-semibold italic leading-tight text-center">
                COMING
                <br />
                SOON
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight leading-[1.2] max-w-2xl mx-auto">
              Access the right courses on Lighting to fit every of your productions
            </h2>

            <ul className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4">
              {courseTopics.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>

            <form
              className="mt-10 flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
                className="flex-1 rounded-md bg-[hsl(var(--page-light))] border border-[hsl(var(--page-light-foreground))]/20 text-[hsl(var(--page-light-foreground))] px-4 py-2.5 text-sm placeholder:text-[hsl(var(--page-light-foreground))]/40 focus:outline-none focus:border-[hsl(var(--cta))]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Get Early Access"}
              </button>
            </form>
          </div>
        </section>

        {/* Masterclass band */}
        <section className="relative bg-[hsl(var(--band-navy))] overflow-hidden">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 items-center">
            <div className="px-8 py-20 space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight leading-[1.2]">
                Be a part of this year's
                <br />
                <span className="text-[hsl(var(--accent-lime))]">ShiftTheLight</span> Masterclass
                <br />
                in Lagos.
              </h2>
              <Link
                to="/masterclass"
                className="inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Book Your Entry
              </Link>
            </div>
            <div className="h-64 lg:h-full min-h-[320px]">
              <img
                src={masterclassHero.url}
                alt="Creator lit in blue light at the ShiftTheLight masterclass"
                className="w-full h-full object-cover"
                loading="lazy"
              />
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
