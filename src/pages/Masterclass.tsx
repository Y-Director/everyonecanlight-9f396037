import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import logo from "@/assets/logo.png";
import heroAsset from "@/assets/masterclass-hero.png.asset.json";
import t1Asset from "@/assets/masterclass/t1.png.asset.json";
import t2Asset from "@/assets/masterclass/t2.png.asset.json";
import t3Asset from "@/assets/masterclass/t3.jpg.asset.json";
import t5Asset from "@/assets/masterclass/t5.png.asset.json";
import boluwatifeAsset from "@/assets/masterclass/boluwatife.jpg.asset.json";
import g1Asset from "@/assets/masterclass/g-IMG_4093.jpg.asset.json";
import g2Asset from "@/assets/masterclass/g-IMG_4101.jpg.asset.json";
import g3Asset from "@/assets/masterclass/g-IMG_4161.jpg.asset.json";
import g4Asset from "@/assets/masterclass/g-IMG_4169.jpg.asset.json";
import g5Asset from "@/assets/masterclass/g-IMG_4173.jpg.asset.json";
import g6Asset from "@/assets/masterclass/g-IMG_4184.jpg.asset.json";
import SiteNav from "@/components/SiteNav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/Seo";

const heroImg = heroAsset.url;

type Testimonial = {
  name: string;
  role: string;
  year: string;
  quote: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Titobiloba Oyetunji",
    role: "Content Director and Producer",
    year: "STL 2025",
    avatar: t1Asset.url,
    quote:
      "The past 2 days have been very impactful, learnt a lot about different types of light. What this class also taught me is more than light, it opened my eyes to collaboration.",
  },
  {
    name: "Faith Bassey",
    role: "Content Creator",
    year: "STL 2025",
    avatar: t2Asset.url,
    quote:
      "The class opened my eyes to a lot about lighting setup, and cameras, and how lighting setup is very important in every production no matter your camera.",
  },
  {
    name: "Osoba Tobiloba",
    role: "Photographer",
    year: "STL 2025",
    avatar: t3Asset.url,
    quote:
      "Our facilitator is very good at what he does, He brought it down to us to a very simple way to understand. I learnt the power of light, cause without light even with that your Sony FX you can't get a good shot.",
  },
  {
    name: "Samuel Boluwatife",
    role: "Video Editor and Videographer",
    year: "STL 2025",
    avatar: boluwatifeAsset.url,
    quote:
      "I learnt a lot about positioning of light, the different types and the different brands, including the direction of light.",
  },
  {
    name: "Victor Adewunmi",
    role: "Headshot Photographer",
    year: "STL 2025",
    avatar: t5Asset.url,
    quote:
      "In those days of the masterclass, I saw light differently to be honest. The way you can draw with light, like let light obey your command. I feel like the class taught how to control my light and shape it differently.",
  },
];

// Past masterclass gallery — add or replace image URLs here.
const galleryImages: { src: string; caption: string }[] = [
  { src: g1Asset.url, caption: "Shift The Light 2025 — On set" },
  { src: g2Asset.url, caption: "Shift The Light 2025 — Practical session" },
  { src: g3Asset.url, caption: "Shift The Light 2025 — Lighting demo" },
  { src: g4Asset.url, caption: "Shift The Light 2025 — Group work" },
  { src: g5Asset.url, caption: "Shift The Light 2025 — Portrait lab" },
  { src: g6Asset.url, caption: "Shift The Light 2025 — Behind the scenes" },
];

const Masterclass = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    whatsapp: "",
    countryCode: "+234",
    email: "",
    background: "",
    experience: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) return;
    window.history.replaceState({}, "", window.location.pathname);
    supabase.functions
      .invoke("paystack-verify", { body: { reference } })
      .then(({ data, error }) => {
        if (error || !data?.paid) {
          toast.error("We couldn't confirm your payment. Please contact us if you were debited.");
          return;
        }
        toast.success("Payment confirmed — your seat for Shift The Light 2 is booked!");
      });
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.fullName ||
      !form.whatsapp ||
      !form.email ||
      !form.background ||
      !form.experience
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    setPaying(true);
    const { data, error } = await supabase.functions.invoke("paystack-initialize", {
      body: {
        fullName: form.fullName,
        whatsapp: `${form.countryCode}${form.whatsapp}`,
        email: form.email,
        background: form.background,
        experience: form.experience,
        callbackUrl: `${window.location.origin}/masterclass`,
      },
    });
    if (error || !data?.authorization_url) {
      setPaying(false);
      toast.error("Could not start payment. Please try again.");
      return;
    }
    toast.success("Redirecting to secure payment...");
    window.location.href = data.authorization_url;
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setSlide((s) => (s + 1) % galleryImages.length),
      4000,
    );
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <Seo
          title="Shift The Light Masterclass 2026 — Lagos"
          description="Join Shift The Light in Lagos this November: an immersive, hands-on lighting masterclass built around real production scenarios for creators and filmmakers."
          path="/masterclass"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Shift The Light 2 (Creator Residency)",
            startDate: "2026-11",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: "Lagos, Nigeria", address: "Lagos, Nigeria" },
            organizer: { "@type": "Organization", name: "Everyone Can Light" },
            url: "https://everyonecanlight.lovable.app/masterclass",
          }}
        />
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
                  <button
                    type="button"
                    onClick={() => setRegisterOpen(true)}
                    className="inline-flex items-center rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleOpen(true)}
                    className="inline-flex items-center rounded-md border border-foreground/30 text-foreground px-6 py-3 text-sm font-medium hover:bg-foreground hover:text-background transition"
                  >
                    See Schedule
                  </button>
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
                    <img
                      src={t.avatar}
                      alt={`${t.name}, ${t.role}`}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover object-top bg-foreground/10"
                    />
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

          {/* Past masterclass gallery */}
          <section className="mt-20">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
              Gallery
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-medium tracking-tight">
              Moments from past Masterclasses
            </h2>

            <div className="mt-8 relative rounded-2xl overflow-hidden border border-foreground/10 bg-[hsl(var(--surface))]">
              <div className="relative h-[320px] md:h-[520px]">
                {galleryImages.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt={img.caption}
                    loading={i === 0 ? "eager" : "lazy"}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                      i === slide ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(0deg, hsl(0 0% 0% / 0.75) 0%, hsl(0 0% 0% / 0) 100%)",
                  }}
                  aria-hidden="true"
                />
                <p className="absolute left-6 bottom-6 text-sm text-foreground/90">
                  {galleryImages[slide]?.caption}
                </p>

                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => {
                    setPlaying(false);
                    setSlide((s) => (s - 1 + galleryImages.length) % galleryImages.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-foreground/25 bg-background/50 backdrop-blur flex items-center justify-center hover:bg-foreground hover:text-background transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => {
                    setPlaying(false);
                    setSlide((s) => (s + 1) % galleryImages.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-foreground/25 bg-background/50 backdrop-blur flex items-center justify-center hover:bg-foreground hover:text-background transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 p-4 border-t border-foreground/10">
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {galleryImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show photo ${i + 1}`}
                      onClick={() => {
                        setPlaying(false);
                        setSlide(i);
                      }}
                      className={`shrink-0 w-16 h-12 rounded-md overflow-hidden border transition ${
                        i === slide ? "border-foreground" : "border-foreground/15 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="shrink-0 text-xs uppercase tracking-[0.15em] text-foreground/70 hover:text-foreground transition"
                >
                  {playing ? "Pause" : "Play"} slideshow
                </button>
              </div>
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

      {/* Registration Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="max-w-lg bg-[hsl(var(--surface))] border-foreground/10">
          <DialogHeader>
            <DialogTitle className="text-2xl">Register — Shift The Light 2</DialogTitle>
            <DialogDescription>
              Creator Residency · Nov 19–21, 2026 · ₦250,000 (3 Days)
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <div className="flex gap-2">
                <Select
                  value={form.countryCode}
                  onValueChange={(v) => setForm({ ...form, countryCode: v })}
                >
                  <SelectTrigger className="w-[110px] shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+234">🇳🇬 +234</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+27">🇿🇦 +27</SelectItem>
                    <SelectItem value="+254">🇰🇪 +254</SelectItem>
                    <SelectItem value="+233">🇬🇭 +233</SelectItem>
                    <SelectItem value="+971">🇦🇪 +971</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="whatsapp"
                  type="tel"
                  inputMode="numeric"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })
                  }
                  placeholder="8012345678"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Creative Background</Label>
              <Select
                value={form.background}
                onValueChange={(v) => setForm({ ...form, background: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cinematographer">Cinematographer</SelectItem>
                  <SelectItem value="Content creator">Content Creator</SelectItem>
                  <SelectItem value="Filmmaker">Filmmaker</SelectItem>
                  <SelectItem value="Videographer">Videographer</SelectItem>
                  <SelectItem value="Photographer">Photographer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select
                value={form.experience}
                onValueChange={(v) => setForm({ ...form, experience: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Very Advanced">Very Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <button
                type="submit"
                disabled={paying}
                className="w-full inline-flex items-center justify-center rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {paying ? "Starting secure checkout..." : "Make Payment — ₦250,000"}
              </button>
            </DialogFooter>
            <p className="text-xs text-foreground/50 text-center">
              Secure checkout via Paystack.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[hsl(var(--surface))] border-foreground/10">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              ShiftTheLight Masterclass 2026 — Official Blueprint
            </DialogTitle>
            <DialogDescription>
              A three-day intensive: transform from technical operator into intentional visual storyteller.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 text-sm text-foreground/85 leading-relaxed">
            <section>
              <h3 className="text-base font-semibold text-foreground">Core Details</h3>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><strong>Date:</strong> Nov 19 – Nov 21, 2026 (3 Days)</li>
                <li><strong>Time:</strong> 8:45 AM – 6:00 PM Daily</li>
                <li><strong>Location:</strong> Revealed after registration</li>
                <li><strong>Audience:</strong> Videographers, content creators, filmmakers, gaffers, photographers</li>
                <li><strong>Capacity:</strong> Limited to 20 participants</li>
                <li><strong>Fee:</strong> ₦250,000 (Standard Experience)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-semibold text-foreground">Day 1 — Podcast & Interview Lighting</h3>
              <p className="mt-1 text-foreground/70">Master the art of lighting people. Practical, real-world commercial applications including podcasts and corporate setups.</p>
              <ul className="mt-2 space-y-2">
                <li><strong>09:00 – 12:00</strong> — Foundations of Light: colour temp, contrast, intensity, motivating sources, working with ambient light. Gear anatomy. Human face lighting: Butterfly, Rembrandt, Split, Additive & Negative Fill.</li>
                <li><strong>12:00 – 13:00</strong> — Lunch Break</li>
                <li><strong>13:30 – 15:00</strong> — Podcast Lighting · Corporate Interview · Natural Window Simulation</li>
                <li><strong>15:00 – 17:00</strong> — Group Exercise: 90-sec trailer documentary on a war survivor</li>
                <li><strong>17:00 – 18:00</strong> — Team grading & set down</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-semibold text-foreground">Day 2 — Food & Product Commercial Lighting</h3>
              <p className="mt-1 text-foreground/70">How food commercials are lit for that expensive look and feel.</p>
              <ul className="mt-2 space-y-2">
                <li><strong>09:00 – 11:30</strong> — Product Lighting with Knorr Seasoning · Food commercials</li>
                <li><strong>11:30 – 12:30</strong> — Lunch Break</li>
                <li><strong>12:30 – 13:00</strong> — Practical Lab selections (5 lighting questions decide picks)</li>
                <li><strong>13:00 – 16:30</strong> — Practical Labs: 1-min commercials for Chicken Republic ChickWizz · Fayrouz Pineapple · Oraimo Powerbank</li>
                <li><strong>16:30 – 18:00</strong> — Team grading, set down, Q&A</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-semibold text-foreground">Day 3 — Outdoor & Music Video Lighting</h3>
              <p className="mt-1 text-foreground/70">A full outdoor production combining everything learned.</p>
              <ul className="mt-2 space-y-2">
                <li><strong>09:00 – 15:00</strong> — Final Project: Full production of "Everyone Loves Football" music video featuring Malta Guinness. Sun control, sunlight balancing, car lighting, RGB lighting.</li>
                <li><strong>15:00 – 15:30</strong> — Lunch Break</li>
                <li><strong>15:30 – 17:00</strong> — Music Video Editing</li>
                <li><strong>17:00 – 18:00</strong> — Certification & Closing · Networking</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-semibold text-foreground">What to Bring</h3>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Specific lighting questions or challenges you're facing</li>
                <li>Optional: your own gear (professional gear is provided)</li>
                <li>Editing device (laptop or phone) for grading, SFX, basic edits</li>
                <li>Notebook or digital tablet for light maps</li>
                <li>Networking mindset</li>
                <li>Residency staycation: football jersey, sports shoes/workout wear, toiletries</li>
              </ul>
            </section>
          </div>

          <DialogFooter className="pt-4">
            <button
              type="button"
              onClick={() => {
                setScheduleOpen(false);
                setRegisterOpen(true);
              }}
              className="w-full inline-flex items-center justify-center rounded-md bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] px-6 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Register Now
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Masterclass;