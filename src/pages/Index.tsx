import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import collage from "@/assets/collage.png";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
                Learn Lighting,<br />
                Create <span className="text-[hsl(var(--accent-lime))]">better</span> stories.
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
