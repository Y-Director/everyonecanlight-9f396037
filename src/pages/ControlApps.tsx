import { useMemo, useState, type ComponentType } from "react";
import { Search, Smartphone, Globe } from "lucide-react";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { controlApps, type ControlApp } from "@/data/controlApps";
import Seo from "@/components/Seo";

// Apple company logo — outline only (no fill), stroke follows currentColor.
const AppleLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.5 12.5c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.2 3.1-2.4.7-1 1.3-2.2 1.6-3.4-1.4-.5-3-1.9-3-3.5z"/>
    <path d="M14.7 4.5c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.3.7-3 1.6-.6.8-1.2 2-1.1 3.2 1.2.1 2.3-.6 3-1.5z"/>
  </svg>
);

type IconType = ComponentType<{ className?: string }>;

const DownloadButton = ({
  href,
  label,
  icon: Icon,
}: {
  href?: string;
  label: string;
  icon: IconType;
}) => {
  const disabled = !href || href === "#";
  return (
    <a
      href={disabled ? undefined : href}
      target={disabled ? undefined : "_blank"}
      rel={disabled ? undefined : "noopener noreferrer"}
      aria-disabled={disabled}
      title={disabled ? "Link coming soon" : `Download for ${label}`}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs border transition ${
        disabled
          ? "border-foreground/15 text-foreground/40 cursor-not-allowed"
          : "border-foreground/25 text-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </a>
  );
};

const AppCard = ({ app }: { app: ControlApp }) => (
  <article className="group flex flex-col rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-5 hover:border-foreground/30 transition-colors">
    <header className="flex items-center gap-4">
      {app.iconUrl ? (
        <img
          src={app.iconUrl}
          alt={`${app.appName} icon`}
          loading="lazy"
          className="w-14 h-14 rounded-xl object-cover shadow-sm border border-foreground/10 bg-white"
        />
      ) : (
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-semibold text-white shadow-sm ${app.accent}`}
        >
          {app.initials}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-foreground/50">{app.brand}</p>
        <h3 className="text-base font-medium leading-tight break-words">{app.appName}</h3>
      </div>
    </header>

    <p className="mt-4 text-sm text-foreground/70 leading-relaxed flex-1">
      {app.description}
    </p>

    <div className="mt-5 flex flex-wrap gap-2">
      <DownloadButton href={app.ios} label="iOS" icon={AppleLogo} />
      <DownloadButton href={app.android} label="Android" icon={Smartphone} />
      {app.web !== undefined && (
        <DownloadButton href={app.web} label="Web" icon={Globe} />
      )}
    </div>
  </article>
);

const ControlApps = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return controlApps;
    return controlApps.filter(
      (a) =>
        a.brand.toLowerCase().includes(q) ||
        a.appName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <Seo
          title="Lighting Control Apps by Manufacturer — ECL"
          description="Find and download the official control apps for Aputure, Godox, Nanlite, Amaran, Falcon Eyes and more, so you can run your lights from your phone."
          path="/control-apps"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Lighting Control Apps",
            url: "https://everyonecanlight.lovable.app/control-apps",
          }}
        />
        <SiteNav />

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-8 py-12">
          <header className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
              Control your lights from your phone
            </h1>
            <p className="mt-4 text-foreground/70 text-base md:text-lg">
              Find the apps you need to connect, control and manage compatible lighting fixtures.
            </p>
          </header>

          <div className="mt-10 max-w-md mx-auto relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brand or app"
              className="w-full bg-muted/40 border border-border rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </div>

          <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((app) => (
              <AppCard key={`${app.brand}-${app.appName}`} app={app} />
            ))}
          </section>

          {filtered.length === 0 && (
            <p className="mt-16 text-center text-foreground/60">
              No apps match your search.
            </p>
          )}

          <p className="mt-12 text-center text-xs text-foreground/50">
            Links open the official App Store and Google Play listings. Where a
            platform button is dimmed, no official app is available.
          </p>
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
    </div>
  );
};

export default ControlApps;