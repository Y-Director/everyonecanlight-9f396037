import logo from "@/assets/logo.png";
import { TERMS_PDF_URL } from "@/lib/rentalTerms";

const SiteFooter = () => (
  <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 px-8 border-t border-foreground/10 text-sm bg-[hsl(var(--surface))]">
    <div className="flex items-center gap-3 text-foreground/70">
      <img src={logo} alt="EveryoneCanLight logo" className="w-6 h-6 rounded object-contain" />
      © 2026 Everyone Can Light Technologies
    </div>
    <div className="flex flex-wrap items-center gap-6">
      <a
        href={TERMS_PDF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/70 hover:text-foreground"
      >
        Rental Policy
      </a>
      <span className="text-foreground/50">Social</span>
      <a href="https://www.instagram.com/everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a>
      <a href="https://www.youtube.com/@everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">YouTube</a>
      <a href="https://www.tiktok.com/@everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">TikTok</a>
      <a href="https://www.linkedin.com/company/everyone-can-light/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
    </div>
  </footer>
);

export default SiteFooter;