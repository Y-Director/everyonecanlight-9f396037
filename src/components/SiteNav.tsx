import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";

type Variant = "dark" | "light";

const links = [
  { to: "/rent-equipment", label: "Rent Equipment" },
  { to: "/lighting-equipment", label: "Equipment Database" },
  { to: "/control-apps", label: "Control Apps" },
];

const learnItems = [
  { to: "/articles", label: "Articles" },
  { to: "/masterclass", label: "Masterclass" },
  { to: "/#notify", label: "Courses" },
  { to: "/articles", label: "Diagrams" },
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
          <li className="relative group">
            <Link
              to="/learn"
              className={`inline-flex items-center gap-1 ${
                isActive("/learn") ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Learn
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </Link>
            <div className="absolute right-0 top-full pt-3 hidden group-hover:block group-focus-within:block z-50">
              <ul className="min-w-[180px] rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] py-2 shadow-lg">
                {learnItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
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
            <li>
              <Link
                to="/learn"
                onClick={() => setOpen(false)}
                className={`block px-8 py-3 text-sm ${
                  isActive("/learn") ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Learn
              </Link>
            </li>
            {learnItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block pl-12 pr-8 py-2.5 text-sm text-foreground/55 hover:text-foreground"
                >
                  {item.label}
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