import { getRentalItem } from "@/data/rentalCatalog";
import podcastImg from "@/assets/eclgo/podcast.webp.asset.json";
import talkingHeadImg from "@/assets/eclgo/talking-head.webp.asset.json";
import interviewImg from "@/assets/eclgo/interview.webp.asset.json";
import productImg from "@/assets/eclgo/product.webp.asset.json";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export type EclGoKit = {
  slug: string;
  name: string;
  tagline: string;
  /** HSL gradient stops for the card */
  from: string;
  to: string;
  items: [name: string, qty: number][];
  /** Photo shown inside the card */
  image: string;
  /** Instructions / placement text, to be supplied later. */
  instructions?: string;
};

export const ECL_GO_KITS: EclGoKit[] = [
  {
    slug: "podcast",
    name: "Podcast Go",
    tagline: "Multi-host setups, lit in minutes.",
    from: "265 85% 62%",
    to: "285 80% 45%",
    image: podcastImg.url,
    items: [
      ["Amaran Ray 360c", 1],
      ["Amaran 300c", 1],
      ["Amaran 150c", 2],
      ["Colbor 220R", 1],
      ["Octa Dome 90cm", 1],
      ["Octa dome 120cm", 1],
    ],
  },
  {
    slug: "talking-head",
    name: "Talking Head Go",
    tagline: "One face, perfectly lit.",
    from: "75 95% 55%",
    to: "95 80% 38%",
    image: talkingHeadImg.url,
    items: [
      ["Amaran Ray 360c", 1],
      ["Amaran Ray 120c", 1],
      ["Colbor 220R", 1],
      ["Amaran SPOTLIGHT SE 19°", 1],
      ["Octa Dome 90cm", 1],
    ],
  },
  {
    slug: "interview",
    name: "Interview Go",
    tagline: "Key, fill, hair and stands, all in.",
    from: "28 95% 55%",
    to: "12 85% 45%",
    image: interviewImg.url,
    items: [
      ["Amaran Ray 360c", 1],
      ["Amaran Ray 120c", 1],
      ["Amaran Ray 60c", 1],
      ["Amaran Ace 25c", 1],
      ["Amaran Ace 25x", 1],
      ["C-Stand Heavy Duty 10.5 ft with Arm", 2],
      ["Silver Light stand", 3],
      ["Bulb Lantern Modifier 90cm", 1],
    ],
  },
  {
    slug: "product",
    name: "Product Go",
    tagline: "Shape, shine and detail for products.",
    from: "52 95% 58%",
    to: "38 95% 50%",
    image: productImg.url,
    items: [
      ["Amaran 300c", 1],
      ["Suncrafter 10W Tube Light", 1],
      ["Amaran 150c", 1],
      ["Amaran SPOTLIGHT SE 19°", 1],
      ["Octa dome 120cm", 1],
    ],
  },
];

export const getEclGoKit = (slug: string) => ECL_GO_KITS.find((k) => k.slug === slug);

/** Cart (item id -> qty) for a kit. */
export const kitCart = (kit: EclGoKit): Record<string, number> => {
  const cart: Record<string, number> = {};
  for (const [name, qty] of kit.items) {
    const id = norm(name);
    if (getRentalItem(id)) cart[id] = (cart[id] ?? 0) + qty;
  }
  return cart;
};

export const kitDailyTotal = (kit: EclGoKit) =>
  kit.items.reduce((s, [name, qty]) => s + (getRentalItem(norm(name))?.price ?? 0) * qty, 0);

/** Total number of individual pieces (units) in a kit. */
export const kitPieces = (kit: EclGoKit) => kit.items.reduce((s, [, qty]) => s + qty, 0);
