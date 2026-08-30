import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import masterclassSection from "@/assets/landing/masterclass-section.png.asset.json";
import heroStatsDesktop from "@/assets/landing/hero-stats-desktop.png.asset.json";
import heroStatsMobile from "@/assets/landing/hero-stats-mobile.png.asset.json";
import controlAppsIllustration from "@/assets/landing/control-apps-illustration.png.asset.json";
import singleLightFood from "@/assets/landing/single-light-food.png.asset.json";
import oneLightVideo from "@/assets/landing/one-light-food.mp4.asset.json";
import equipmentAnnotated from "@/assets/landing/equipment-annotated.png.asset.json";
import trust1 from "@/assets/trust/trust-1.jpg.asset.json";
import trust2 from "@/assets/trust/trust-2.jpg.asset.json";
import trust3 from "@/assets/trust/trust-3.jpg.asset.json";
import trust4 from "@/assets/trust/trust-4.jpg.asset.json";
import trust5 from "@/assets/trust/trust-5.jpg.asset.json";
import trust6 from "@/assets/trust/trust-6.jpg.asset.json";
import trust7 from "@/assets/trust/trust-7.jpg.asset.json";
import trust8 from "@/assets/trust/trust-8.jpg.asset.json";
import contributorBanner from "@/assets/contributors/contributor-banner.png.asset.json";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BrandVideo from "@/components/BrandVideo";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import Seo from "@/components/Seo";

const bentoCards = [
  {
    header: "Rent",
    sub: "Get the gear.",
    body: "Professional lighting equipment when your production needs it.",
    cta: "Explore Rentals",
    to: "/rent-equipment",
  },
  {
    header: "Learn",
    sub: "Understand the light.",
    body: "Practical lessons, breakdowns and techniques you can use immediately.",
    cta: "Start Learning",
    to: "/learn",
  },
  {
    header: "Explore",
    sub: "Know your gear.",
    body: "Compare specifications and understand which lights work for different productions.",
    cta: "Explore Equipment",
    to: "/lighting-equipment",
  },
  {
    header: "Control",
    sub: "Take control.",
    body: "Find the right apps to control your lighting fixtures from your phone.",
    cta: "Explore Apps",
    to: "/control-apps",
  },
];

const trustImages = [
  { src: trust1.url, alt: "Softbox lighting a seated subject on a talking-head set" },
  { src: trust2.url, alt: "Stage lighting setup during a live worship production" },
  { src: trust3.url, alt: "Film crew lighting a wide studio set with a cyclorama" },
  { src: trust4.url, alt: "Interview set lit with overhead Godox flexible LED panels" },
  { src: trust5.url, alt: "Music video shoot lit with a large diffusion frame on set" },
  { src: trust6.url, alt: "Vintage green room set lit with warm practical lamps and window light" },
  { src: trust7.url, alt: "Interview shoot in a bright apartment with softbox and crew silhouettes" },
  { src: trust8.url, alt: "Dining scene lit with overhead LED panels and a blue rim light" },
];

const Index = () => {
  const { hash } = useLocation();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hash === "#notify") {
      const el = document.getElementById("notify");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
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
        <Seo
          title="Learn Lighting. Find Gear. Create Better - Everyone Can Light"
          description="Learn lighting with practical guides, compare 250+ lights in our equipment database, find control apps and rent professional lighting gear in Lagos."
          path="/"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Everyone Can Light",
            url: "https://everyonecanlight.lovable.app/",
            description:
              "Lighting education, equipment database and gear rentals for filmmakers and creators.",
          }}
        />
        <SiteNav />

        {/* Hero */}
        <section className="px-8 max-w-[1400px] mx-auto w-full pt-6 pb-12 sm:pt-10 sm:pb-20 text-center">
          <h1 className="font-medium tracking-tight leading-[1.05] text-[32px] sm:text-5xl lg:text-[64px] max-w-4xl mx-auto">
            <span className="sm:hidden">
              Everything a Creator
              <br />
              Needs for <span className="text-[hsl(var(--accent-lime))]">Lighting</span>
            </span>
            <span className="hidden sm:inline">
              Everything You Need
              <br />
              For <span className="text-[hsl(var(--accent-lime))]">Lighting</span>
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
            Learn lighting. Find the right gear. Rent what you need. Create better images.
          </p>

          {/* Desktop / tablet collage */}
          <img
            src={heroStatsDesktop.url}
            alt="Lighting gear available to rent, lighting lessons and equipment explainers on Everyone Can Light"
            className="hidden sm:block mt-10 w-full max-w-5xl mx-auto h-auto object-contain"
          />
          {/* Mobile collage */}
          <img
            src={heroStatsMobile.url}
            alt="Lighting gear available to rent, lighting lessons and equipment explainers on Everyone Can Light"
            className="sm:hidden mt-6 w-full max-w-xs mx-auto h-auto object-contain"
          />

          <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/rent-equipment"
              className="w-full sm:w-auto rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              Explore Rental Gear
            </Link>
            <Link
              to="/learn"
              className="w-full sm:w-auto rounded-md border border-[hsl(var(--cta))] text-foreground px-5 py-2.5 text-sm font-medium hover:bg-[hsl(var(--cta))]/10 transition"
            >
              Learn Lighting
            </Link>
          </div>
        </section>

        {/* Bento: four ways in */}
        <section className="px-8 max-w-[1400px] mx-auto w-full pb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bentoCards.map((c) => (
            <div
              key={c.header}
              className="flex flex-col rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-7"
            >
              <h2 className="text-2xl font-medium tracking-tight">{c.header}</h2>
              <p className="mt-1 text-sm text-[hsl(var(--accent-lime))]">{c.sub}</p>
              <p className="mt-4 text-sm text-foreground/55 leading-relaxed">{c.body}</p>
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

        {/* Trust */}
        <section className="px-8 py-20 border-t border-foreground/10 bg-[hsl(var(--surface))]">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight max-w-2xl">
              Built by people who actually light sets
            </h2>
            <p className="mt-5 text-sm text-foreground/60 leading-relaxed max-w-2xl">
              Everyone Can Light brings practical lighting knowledge from real productions into one
              accessible platform for filmmakers and creators.
            </p>

            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[200px]">
              {trustImages.map((img) => (
                <div
                  key={img.src}
                  className="rounded-2xl overflow-hidden bg-background"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Masterclass */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16">
          <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] grid lg:grid-cols-[1fr_1.1fr] items-center gap-8 p-8 sm:p-10">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--accent-lime))]">
                Shift The Light Masterclass
              </p>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight leading-[1.15]">
                Learn lighting by{" "}
                <span className="text-[hsl(var(--accent-lime))]">actually lighting</span>
              </h2>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-md">
                Join us in Lagos for this year's Shift The Light Masterclass: an immersive, hands-on
                lighting experience built around real production scenarios.
              </p>
              <Link
                to="/masterclass"
                className="inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Reserve Your Spot
              </Link>
            </div>
            <img
              src={masterclassSection.url}
              alt="Masterclass subject lit on a green backdrop beside the behind-the-scenes studio setup"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </section>

        {/* One single light */}
        <section className="px-8 max-w-[1400px] mx-auto w-full py-16">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--accent-lime))]">
              Lighting changes everything
            </p>
          </div>

          <div className="mt-8 grid lg:grid-cols-[1.1fr_1.2fr_1fr] gap-6 items-stretch">
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
                  <span className="text-[hsl(var(--accent-lime))]">one light source.</span>
                </h3>
                <p className="mt-4 text-sm text-foreground/55 leading-relaxed">
                  More lights don't always create better images. Understanding direction, intensity,
                  quality and modification can transform what a single light can do.
                </p>
              </div>

              <div className="rounded-2xl bg-[hsl(var(--surface))] border border-foreground/10 p-7">
                <h4 className="text-base font-medium tracking-tight">
                  Lighting is easier when you understand the setup.
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                  Explore real production lighting diagrams complete with equipment lists, light
                  placement, camera settings, and practical explanations. Study how professional
                  scenes are built, then recreate them using the gear you have or discover better
                  alternatives from our equipment database.
                </p>
              </div>

              <div className="mt-auto">
                <Link
                  to="/articles"
                  className="inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                >
                  Explore Lighting Guides
                </Link>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-[hsl(var(--surface))]">
              <video
                src={oneLightVideo.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Behind the scenes video of a food scene lit with one single light"
              />
            </div>
          </div>
        </section>

        {/* Become a contributor */}
        <section className="px-8 max-w-[1400px] mx-auto w-full pb-16">
          <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] grid lg:grid-cols-[0.9fr_1.1fr] items-center gap-8 p-8 sm:p-10">
            <img
              src={contributorBanner.url}
              alt="Contributor portrait lit with blue and orange light beside a plus symbol"
              className="w-full max-w-sm mx-auto lg:mx-0 h-auto object-contain object-left"
              loading="lazy"
            />
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--accent-lime))]">
                Become a contributor
              </p>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight leading-[1.15]">
                Share what you know about{" "}
                <span className="text-[hsl(var(--accent-lime))]">lighting</span>
              </h2>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-md">
                Publish your own articles, lighting breakdowns and behind-the-scenes lessons on
                Everyone Can Light, and track how many creators your work reaches.
              </p>
              <Link
                to="/contributors/auth"
                className="inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Start Contributing
              </Link>
            </div>
          </div>
        </section>

        {/* Brand refresh video */}
        <BrandVideo />

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


        {/* Control apps */}
        <section className="px-8 py-24 border-t border-foreground/10 bg-[hsl(var(--surface))]">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight leading-[1.15]">
                Control lights easily on your phone
              </h2>
              <p className="text-sm text-foreground/60 leading-relaxed max-w-md">
                Discover the apps that let you control compatible lights, adjust settings and manage
                multiple fixtures straight from your phone.
              </p>
              <Link
                to="/control-apps"
                className="inline-block rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                Browse Control Apps
              </Link>
            </div>
            <img
              src={controlAppsIllustration.url}
              alt="Phone running a lighting control app connected wirelessly to an LED fixture"
              className="w-full h-auto rounded-2xl object-contain"
              loading="lazy"
              width={1200}
              height={912}
            />
          </div>
        </section>

        {/* Courses — coming soon */}
        <section
          id="notify"
          className="relative px-8 py-20 border-t border-foreground/10 bg-background text-foreground scroll-mt-24"
        >
          <div className="max-w-[1400px] mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-medium tracking-tight leading-[1.2] max-w-2xl mx-auto">
              Practical lighting courses for real productions
            </h2>
            <p className="mt-5 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed text-foreground/60">
              Learn how to light interviews, podcasts, products, music videos and more, step by step.
            </p>

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
                className="flex-1 rounded-md bg-[hsl(var(--surface))] border border-foreground/20 text-foreground px-4 py-2.5 text-sm placeholder:text-foreground/40 focus:outline-none focus:border-[hsl(var(--cta))]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-5 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Join the Waitlist"}
              </button>
            </form>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
};

export default Index;
