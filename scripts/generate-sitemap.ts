// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://everyonecanlight.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const articleSlugs = [
  "softbox-vs-umbrella-which-should-i-buy-first",
  "how-to-light-a-small-room-for-video-with-just-2-lights",
  "best-lights-for-content-creators-in-2026",
  "why-your-videos-look-dark-and-how-to-fix-it",
  "different-types-of-lights-and-their-usage-for-beginners",
  "how-to-light-a-talking-head-video-with-1-single-light",
  "what-is-wattage-in-lighting",
];

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/rent-equipment", changefreq: "weekly", priority: "0.9" },
  { path: "/lighting-equipment", changefreq: "weekly", priority: "0.9" },
  { path: "/learn", changefreq: "monthly", priority: "0.8" },
  { path: "/articles", changefreq: "weekly", priority: "0.8" },
  { path: "/control-apps", changefreq: "monthly", priority: "0.7" },
  { path: "/masterclass", changefreq: "monthly", priority: "0.7" },
  ...articleSlugs.map((slug) => ({
    path: `/articles/${slug}`,
    changefreq: "monthly" as const,
    priority: "0.6",
  })),
];

function generateSitemap(list: SitemapEntry[]) {
  const urls = list.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
