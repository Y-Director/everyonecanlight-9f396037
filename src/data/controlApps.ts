export type ControlApp = {
  brand: string;
  appName: string;
  description: string;
  initials: string;
  accent: string; // tailwind bg color class for the logo tile
  ios?: string;
  android?: string;
  web?: string;
};

// Placeholder download links — replace with official store URLs when ready.
const PH = "#";

export const controlApps: ControlApp[] = [
  {
    brand: "Aputure",
    appName: "Sidus Link",
    description: "Control Aputure & Amaran fixtures over Bluetooth mesh — groups, scenes, FX, and DMX bridging.",
    initials: "A",
    accent: "bg-[#E63946]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Amaran",
    appName: "Sidus Link",
    description: "Shared Amaran/Aputure ecosystem app for color, CCT, and creative effects on Amaran lights.",
    initials: "Am",
    accent: "bg-[#F97316]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Godox",
    appName: "Godox Light",
    description: "Pair, dim, and tune Godox LED fixtures; switch CCT, RGB, and built-in lighting effects.",
    initials: "G",
    accent: "bg-[#0EA5E9]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Nanlite",
    appName: "NANLINK",
    description: "Cross-fixture control for Nanlite & Nanlux — groups, gels, effects, and firmware updates.",
    initials: "N",
    accent: "bg-[#1E293B]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Falcon Eyes",
    appName: "Falcon Eyes",
    description: "Wireless control of Falcon Eyes panels, COBs, and tubes — CCT, RGB, and scene presets.",
    initials: "F",
    accent: "bg-[#7C3AED]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Kino Flo",
    appName: "Kino Flo App",
    description: "Control Diva-Lite, Celeb, and MIMIK fixtures with gel library, CCT, and grouping.",
    initials: "K",
    accent: "bg-[#16A34A]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Sutefoto",
    appName: "Sutefoto",
    description: "Bluetooth control for Sutefoto LED panels and COB lights — CCT, brightness, and effects.",
    initials: "S",
    accent: "bg-[#0F766E]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Ulanzi",
    appName: "Ulanzi Light",
    description: "Tweak Ulanzi VL/LT series tubes and panels — HSI, gels, and animated FX.",
    initials: "U",
    accent: "bg-[#FACC15] text-neutral-900",
    ios: PH,
    android: PH,
  },
  {
    brand: "COLBOR",
    appName: "COLBOR Studio",
    description: "Manage COLBOR COB lights — CCT, brightness curves, and special effects.",
    initials: "C",
    accent: "bg-[#DC2626]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Zhiyun",
    appName: "ZY Vega",
    description: "Control Zhiyun MOLUS and FIVERAY lighting series with presets and DMX-style scenes.",
    initials: "Z",
    accent: "bg-[#2563EB]",
    ios: PH,
    android: PH,
  },
  {
    brand: "SmallRig",
    appName: "SmallRig Light",
    description: "Adjust SmallRig RC and RM series lights — CCT, RGB, and scene effects.",
    initials: "Sr",
    accent: "bg-[#F59E0B] text-neutral-900",
    ios: PH,
    android: PH,
  },
  {
    brand: "Quasar Science",
    appName: "Quasar Q-LION",
    description: "Control Rainbow 2 and Double Rainbow LED tubes — HSI, gels, and pixel FX.",
    initials: "Q",
    accent: "bg-[#9333EA]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Astera",
    appName: "AsteraApp",
    description: "Wireless control for Titan/Helios/Hyperion tubes — CRMX bridge, FX engine, and timelines.",
    initials: "As",
    accent: "bg-[#111827]",
    ios: PH,
    android: PH,
  },
  {
    brand: "Rotolight",
    appName: "Rotolight",
    description: "Control NEO 3, AEOS 2, and Titan X fixtures — HSI, CCT, and high-speed flash settings.",
    initials: "R",
    accent: "bg-[#EA580C]",
    ios: PH,
    android: PH,
  },
];

export const groupedByBrand = controlApps.reduce<Record<string, ControlApp[]>>((acc, app) => {
  (acc[app.brand] ||= []).push(app);
  return acc;
}, {});