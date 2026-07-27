import { equipment as EQUIPMENT } from "@/data/equipment";

export type RentalCategory =
  | "Lights"
  | "Panel Lights"
  | "Mat Lights"
  | "Tube Lights"
  | "Practical Lights"
  | "Modifiers"
  | "Snoots & Projection"
  | "Scrims & Diffusion"
  | "Stands & Grip"
  | "Accessories"
  | "Flash & Strobe";

export type RentalItem = {
  id: string;
  name: string;
  price: number; // naira per day
  category: RentalCategory;
  watts?: number;
  image: string;
  comingSoon?: boolean;
};

/** Look up a real product photo from the equipment database by name. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const imageByName = new Map<string, string>();
EQUIPMENT.forEach((e) => imageByName.set(norm(e.name), e.image));

const fallbackPool = EQUIPMENT.map((e) => e.image);
const pickImage = (name: string, index: number) =>
  imageByName.get(norm(name)) ?? fallbackPool[index % fallbackPool.length];

type Raw = [name: string, price: number, category: RentalCategory, watts?: number, comingSoon?: boolean];

const RAW: Raw[] = [
  // LIGHTS (COB / point source)
  ["Amaran 100d S", 10000, "Lights", 100],
  ["Amaran 100x S", 10000, "Lights", 100],
  ["Amaran 200d S", 15000, "Lights", 200],
  ["Amaran 150c", 15000, "Lights", 150],
  ["Amaran 300c", 20000, "Lights", 300],
  ["Amaran Ray 360c", 22000, "Lights", 360],
  ["Amaran Ray 660c", 40000, "Lights", 660],
  ["Aputure LS 300d", 25000, "Lights", 300],
  ["Aputure LS 300x", 25000, "Lights", 300],
  ["Aputure LS 600d Pro", 35000, "Lights", 600],
  ["Aputure LS 600x Pro", 38000, "Lights", 600],
  ["Aputure LS 600c", 40000, "Lights", 600],
  ["Aputure 1000c", 50000, "Lights", 1000],
  ["Aputure LS 1200D", 50000, "Lights", 1200],
  ["Aputure LS XT26", 120000, "Lights", 2600],
  ["Aputure LS XT52", 200000, "Lights", 5200],
  ["Aputure CS15", 120000, "Lights", 1500],
  ["Colbor 220R", 20000, "Lights", 220],
  ["Colbor 330R", 30000, "Lights", 330],
  ["Godox MG1200Bi", 55000, "Lights", 1200],
  ["Godox MG200Bi", 15000, "Lights", 200],
  ["Godox MG300Bi", 25000, "Lights", 300],
  ["Godox SL100D", 10000, "Lights", 100],
  ["Godox SL150", 10000, "Lights", 150],
  ["Godox SL200", 15000, "Lights", 200],
  ["Godox SL300", 20000, "Lights", 300],
  ["Nanlite Forza 200B", 15000, "Lights", 200],
  ["Nanlite Forza 300", 20000, "Lights", 300],
  ["Nanlite Forza 300B", 20000, "Lights", 300],
  ["Nanlite Forza 500", 30000, "Lights", 500],
  ["Nanlite Forza 500B", 30000, "Lights", 500],
  ["Nanlite Forza 720B", 45000, "Lights", 720],

  // PANEL LIGHTS
  ["Aputure NOVA P300c", 30000, "Panel Lights", 300],
  ["Aputure NOVA P600c", 45000, "Panel Lights", 600],

  // MAT LIGHTS
  ["Amaran F21c Mat 2x1 ft", 20000, "Mat Lights", 100],
  ["Amaran F22c Mat 2x2 ft", 25000, "Mat Lights", 200],
  ["Falcon Eyes 24 TDX Mat 2x2 ft", 25000, "Mat Lights", 150],
  ["Godox F200 Mat 2x2 ft", 25000, "Mat Lights", 200],
  ["Godox F400 Mat 2x4 ft", 40000, "Mat Lights", 400],
  ["Godox F600 Mat 4x4 ft", 50000, "Mat Lights", 600],
  ["Godox F800 Mat 8x8 ft", 100000, "Mat Lights", 800],

  // TUBE LIGHTS
  ["Amaran PT2c RGBWW Pixel Tube 2 ft", 10000, "Tube Lights", 20],
  ["Amaran PT4c RGBWW Pixel Tube 4 ft", 15000, "Tube Lights", 40],
  ["Amaran T2c RGBWW Tube Bar 2 ft", 10000, "Tube Lights", 20],
  ["Amaran T4c RGBWW Tube Bar 4 ft", 15000, "Tube Lights", 40],
  ["Godox TL30 RGB Tube Light", 10000, "Tube Lights", 13],
  ["Godox TL60 RGB Tube Light", 15000, "Tube Lights", 30],
  ["Nanlite Pavotube II 15C RGB Tube 1.5 ft", 8000, "Tube Lights", 15],
  ["Nanlite Pavotube II 30C RGB Tube 3 ft", 10000, "Tube Lights", 30],
  ["Nanlite Pavotube T8-7C RGB Tube 4 ft", 15000, "Tube Lights", 32],

  // PRACTICAL LIGHTS
  ["Aputure B7C Set of 6", 50000, "Practical Lights", 7],
  ["Godox C7R Set of 6", 50000, "Practical Lights", 7],
  ["Nanlite Pavobulb Set of 4", 40000, "Practical Lights", 10],

  // MODIFIERS
  ["Aputure Fresnel 2X Lens Mount", 8000, "Modifiers"],
  ["Octabox 95cm", 5000, "Modifiers"],
  ["Octabox 55cm", 5000, "Modifiers"],
  ["Octabox 90cm", 5000, "Modifiers"],
  ["Parabolic Softbox 120cm", 5000, "Modifiers"],
  ["Parabolic Softbox 150cm", 5000, "Modifiers"],
  ["Bulb Lantern Modifier 90cm", 5000, "Modifiers"],
  ["Bulb Lantern Modifier 120cm", 5000, "Modifiers"],

  // SNOOTS & PROJECTION
  ["Aputure Spotlight Mount SE 19° Lens", 10000, "Snoots & Projection"],
  ["Aputure Spotlight Mount SE 26° Lens", 10000, "Snoots & Projection"],
  ["Aputure Spotlight Mount SE 36° Lens", 10000, "Snoots & Projection"],
  ["Fresnel Lens Adapter Bowens Mount (Generic)", 8000, "Snoots & Projection"],
  ["Nanlite PJ-FZ60 Projection Spotlight for Forza 60", 10000, "Snoots & Projection"],

  // SCRIMS, FLAGS, BOUNCE & DIFFUSION
  ["4x4 ft Scrim Frame + Black Solid Flag", 10000, "Scrims & Diffusion"],
  ["4x4 ft Scrim Frame + Full Diffusion", 10000, "Scrims & Diffusion"],
  ["4x4 ft Scrim Frame + Half Diffusion", 10000, "Scrims & Diffusion"],
  ["4x4 ft Scrim Frame + Silver Reflector", 10000, "Scrims & Diffusion"],
  ["5-in-1 Collapsible Reflector 120cm", 5000, "Scrims & Diffusion"],
  ["5-in-1 Collapsible Reflector 80cm", 5000, "Scrims & Diffusion"],
  ["6x6 ft Scrim Frame + Black Solid Flag", 15000, "Scrims & Diffusion"],
  ["6x6 ft Scrim Frame + Full Diffusion", 15000, "Scrims & Diffusion"],
  ["6x6 ft Scrim Frame + Half Diffusion", 15000, "Scrims & Diffusion"],
  ["6x6 ft Scrim Frame + Silver/Gold Reflector", 15000, "Scrims & Diffusion"],
  ["8x8 ft Scrim Frame + Black Solid Flag", 20000, "Scrims & Diffusion"],
  ["8x8 ft Scrim Frame + Full Diffusion", 20000, "Scrims & Diffusion"],
  ["8x8 ft Scrim Frame + Half Diffusion", 20000, "Scrims & Diffusion"],
  ["8x8 ft Scrim Frame + Silver/Gold Reflector", 20000, "Scrims & Diffusion"],
  ["Black Wrap / Cinefoil Roll", 5000, "Scrims & Diffusion"],
  ["Foam Core White Bounce Board (Large and Small)", 5000, "Scrims & Diffusion"],

  // STANDS & GRIP
  ["Boom Arm for C-Stand / Overhead", 3500, "Stands & Grip"],
  ["C-Stand Heavy Duty 10.5 ft with Arm", 5000, "Stands & Grip"],
  ["C-Stand Heavy Duty 20 ft with Arm", 10000, "Stands & Grip"],
  ["Combo Stand / Turtle Base Stand", 20000, "Stands & Grip"],
  ["Grid Clamp / Matthellini Clamp", 3000, "Stands & Grip"],
  ["Light Stand Heavy Duty 13 ft", 3000, "Stands & Grip"],
  ["Sandbag 10kg", 1000, "Stands & Grip"],
  ["Super Clamp with Stud", 2000, "Stands & Grip"],

  // ACCESSORIES (power & support that pair with lights)
  ["15 ft Extension Cable", 2000, "Accessories"],
  ["V-Mount Battery", 8000, "Accessories"],

  // FLASH & STROBE (coming soon)
  ["Godox AD1200 Pro TTL Portable Flash", 25000, "Flash & Strobe", undefined, true],
  ["Godox AD300 Pro TTL Portable Flash", 10000, "Flash & Strobe", undefined, true],
  ["Godox AD400 Pro TTL Portable Flash", 15000, "Flash & Strobe", undefined, true],
  ["Godox AD600 Pro TTL Portable Flash", 20000, "Flash & Strobe", undefined, true],
  ["Godox DP400III Studio Strobe", 10000, "Flash & Strobe", undefined, true],
  ["Godox DP600III Studio Strobe", 15000, "Flash & Strobe", undefined, true],
  ["Godox QT1200IIM Studio Strobe", 25000, "Flash & Strobe", undefined, true],
];

export const rentalCatalog: RentalItem[] = RAW.map(
  ([name, price, category, watts, comingSoon], i) => ({
    id: norm(name),
    name,
    price,
    category,
    watts,
    comingSoon,
    image: pickImage(name, i),
  })
);

export const RENTAL_CATEGORIES: ("All Gear" | RentalCategory)[] = [
  "All Gear",
  "Lights",
  "Panel Lights",
  "Mat Lights",
  "Tube Lights",
  "Practical Lights",
  "Modifiers",
  "Snoots & Projection",
  "Scrims & Diffusion",
  "Stands & Grip",
  "Accessories",
  "Flash & Strobe",
];

const byId = new Map(rentalCatalog.map((i) => [i.id, i]));
export const getRentalItem = (id: string) => byId.get(id);

const SUGGEST_UNDER_600 = [
  "C-Stand Heavy Duty 10.5 ft with Arm",
  "15 ft Extension Cable",
  "V-Mount Battery",
].map(norm);

const SUGGEST_OVER_600 = [
  "Combo Stand / Turtle Base Stand",
  "15 ft Extension Cable",
].map(norm);

/**
 * Suggested add-ons based on the lights already in the gear list.
 * Lights under 600W -> C-stand, extension cable, V-mount battery.
 * Lights 600W and above -> combo stand, extension cable.
 */
export const getSuggestions = (ids: string[]): RentalItem[] => {
  const inList = new Set(ids);
  const chosen = ids.map((id) => byId.get(id)).filter(Boolean) as RentalItem[];
  const lights = chosen.filter((i) => i.category === "Lights" && i.watts);
  if (lights.length === 0) return [];

  const suggestions = new Set<string>();
  lights.forEach((l) => {
    const list = (l.watts ?? 0) >= 600 ? SUGGEST_OVER_600 : SUGGEST_UNDER_600;
    list.forEach((s) => suggestions.add(s));
  });

  return [...suggestions]
    .filter((id) => !inList.has(id))
    .map((id) => byId.get(id))
    .filter(Boolean) as RentalItem[];
};

export const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;