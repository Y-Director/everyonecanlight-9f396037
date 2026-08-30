import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Seo from "@/components/Seo";
import { Download } from "lucide-react";
import { RENTAL_TERMS, TERMS_PDF_URL } from "@/lib/rentalTerms";

const RentalTerms = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Seo
      title="Rental Terms & Conditions — Everyone Can Light"
      description="Pick-up and return times, Lighting Operator rules, swaps, damage responsibility and inspection terms for renting lighting equipment from Everyone Can Light Technologies Ltd."
      path="/rental-terms"
    />
    <SiteNav />

    <main className="flex-1 w-full max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Legal</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight">
        Rental Terms &amp; Conditions
      </h1>
      <p className="mt-3 text-sm text-foreground/60">
        Everyone Can Light Technologies Ltd. · Please read before you pay.
      </p>

      <a
        href={TERMS_PDF_URL}
        download="ECL-Rental-Terms-and-Conditions.pdf"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary underline decoration-primary underline-offset-4"
      >
        <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
      </a>

      <div className="mt-10 space-y-8">
        {RENTAL_TERMS.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-medium tracking-tight">{s.title}</h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-foreground/70">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-foreground/10 pt-6">
        <p className="text-sm font-medium">Signed:</p>
        <p className="text-sm text-foreground/60">
          Management of Rentals, Everyone Can Light Technologies Ltd.
        </p>
      </div>
    </main>

    <SiteFooter />
  </div>
);

export default RentalTerms;
