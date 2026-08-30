import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { TERMS_PDF_URL } from "@/lib/rentalTerms";

const linkClass = "text-foreground/60 hover:text-foreground transition-colors";

const SiteFooter = () => (
  <footer className="border-t border-foreground/10 bg-[hsl(var(--surface))] text-sm">
    <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-12">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Everyone Can Light logo" className="w-8 h-8 rounded object-contain" />
            <span className="font-medium">Everyone Can Light</span>
          </div>
          <p className="mt-3 text-foreground/55 leading-relaxed">
            Lighting equipment, learning and tools for creators.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Explore</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="/rent-equipment" className={linkClass}>Rent Equipment</Link></li>
            <li><Link to="/lighting-equipment" className={linkClass}>Equipment Database</Link></li>
            <li><Link to="/learn" className={linkClass}>Learn</Link></li>
            <li><Link to="/control-apps" className={linkClass}>Control Apps</Link></li>
            <li><Link to="/masterclass" className={linkClass}>Shift The Light</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Support</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a href="mailto:hello@everyonecanlight.co" className={linkClass}>Contact</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Legal</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="/privacy" className={linkClass}>Privacy &amp; Data Protection</Link></li>
            <li>
              <Link to="/rental-terms" className={linkClass}>Rental Terms</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/45">Connect</p>
          <ul className="mt-4 space-y-2.5">
            <li><a href="https://www.instagram.com/everyonecanlight" target="_blank" rel="noopener noreferrer" className={linkClass}>Instagram</a></li>
            <li><a href="https://www.youtube.com/@everyonecanlight" target="_blank" rel="noopener noreferrer" className={linkClass}>YouTube</a></li>
            <li><a href="https://www.tiktok.com/@everyonecanlight" target="_blank" rel="noopener noreferrer" className={linkClass}>TikTok</a></li>
            <li><a href="https://www.linkedin.com/company/everyone-can-light/" target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-foreground/10 pt-6 text-foreground/50">
        © 2026 Everyone Can Light Technologies Ltd.
      </div>
    </div>
  </footer>
);

export default SiteFooter;
