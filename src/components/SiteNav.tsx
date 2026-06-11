import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

type Variant = "dark" | "light";

const links = [
  { to: "/articles", label: "Articles" },
  { to: "/lighting-equipment", label: "Lighting Equipment" },
  { to: "/control-apps", label: "Control Apps" },
  { to: "/courses", label: "Courses" },
];

interface SiteNavProps {
  variant?: Variant;
}

const SiteNav = ({ variant = "dark" }: SiteNavProps) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (to: string) => pathname === to;

  return (
    <nav className="relative bg-[hsl(var(--surface))] text-foreground">
      <div className="flex items-center justify-between px-8 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src={logo} alt="EveryoneCanLight logo" className="w-8 h-8 rounded-md object-contain" />
          <span>EveryoneCanLight</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-12 text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={
                  isActive(l.to)
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground"
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-foreground/10 transition"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-foreground/10 bg-[hsl(var(--surface))]">
          <ul className="flex flex-col py-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block px-8 py-3 text-sm ${
                    isActive(l.to)
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default SiteNav;