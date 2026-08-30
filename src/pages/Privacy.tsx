import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import { PRIVACY_POLICY, PRIVACY_POLICY_UPDATED } from "@/lib/privacyPolicy";

const Privacy = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Seo
      title="Privacy & Data Protection Policy — Everyone Can Light"
      description="How Everyone Can Light Technologies Ltd. collects, protects and uses your information for equipment rentals, masterclasses and contributor accounts."
      path="/privacy"
    />
    <SiteNav />

    <main className="flex-1 w-full max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Legal</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight">
        Privacy &amp; Data Protection Policy
      </h1>
      <p className="mt-3 text-sm text-foreground/60">
        Everyone Can Light Technologies Ltd. · Last updated {PRIVACY_POLICY_UPDATED}
      </p>

      <div className="mt-10 space-y-8">
        {PRIVACY_POLICY.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-medium tracking-tight">{s.title}</h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-foreground/70">{s.body}</p>
          </section>
        ))}
      </div>
    </main>

    <SiteFooter />
  </div>
);

export default Privacy;
