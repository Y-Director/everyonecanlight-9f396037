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

export const controlApps: ControlApp[] = [
  {
    brand: "Aputure",
    appName: "Sidus Link",
    description: "Control Aputure & Amaran fixtures over Bluetooth mesh — groups, scenes, FX, and DMX bridging.",
    initials: "A",
    accent: "bg-[#E63946]",
    ios: "https://apps.apple.com/us/app/sidus-link/id1471951977",
    android: "https://play.google.com/store/apps/details?id=creativity.intelligence.application.sidus.link",
  },
  {
    brand: "Amaran",
    appName: "amaran",
    description: "Official amaran companion app for color, CCT, and creative effects on amaran lights.",
    initials: "Am",
    accent: "bg-[#F97316]",
    ios: "https://apps.apple.com/us/app/amaran/id6503329243",
    android: "https://play.google.com/store/apps/details?id=com.sidus.link.amaran",
  },
  {
    brand: "Godox",
    appName: "Godox Light",
    description: "Pair, dim, and tune Godox LED fixtures; switch CCT, RGB, and built-in lighting effects.",
    initials: "G",
    accent: "bg-[#0EA5E9]",
    ios: "https://apps.apple.com/us/app/godox-light/id1543734417",
    android: "https://play.google.com/store/apps/details?id=com.godox.ble.mesh",
  },
  {
    brand: "Nanlite",
    appName: "NANLINK",
    description: "Cross-fixture control for Nanlite & Nanlux — groups, gels, effects, and firmware updates.",
    initials: "N",
    accent: "bg-[#1E293B]",
    ios: "https://apps.apple.com/us/app/nanlink/id1584085006",
    android: "https://play.google.com/store/apps/details?id=com.nanlink.nanlink",
  },
  {
    brand: "Falcon Eyes",
    appName: "DeSal Lite+",
    description: "Wireless control of Falcon Eyes panels, COBs, and tubes — CCT, RGB, and scene presets.",
    initials: "F",
    accent: "bg-[#7C3AED]",
    ios: "https://apps.apple.com/us/app/desal-lite/id1556015265",
    android: "https://play.google.com/store/apps/details?id=com.oecore.ruiying",
  },
  {
    brand: "Kino Flo",
    appName: "Kino Flo App",
    description: "Control Diva-Lite, Celeb, and MIMIK fixtures with gel library, CCT, and grouping.",
    initials: "K",
    accent: "bg-[#16A34A]",
  },
  {
    brand: "Sutefoto",
    appName: "SS LED Video Light",
    description: "Bluetooth control for Sutefoto LED panels and COB lights — CCT, brightness, and effects.",
    initials: "S",
    accent: "bg-[#0F766E]",
    ios: "https://apps.apple.com/us/app/ss-led-video-light/id1545867627",
  },
  {
    brand: "Ulanzi",
    appName: "Ulanzi Connect",
    description: "Tweak Ulanzi VL/LT series tubes and panels — HSI, gels, and animated FX.",
    initials: "U",
    accent: "bg-[#FACC15] text-neutral-900",
    ios: "https://apps.apple.com/us/app/ulanzi-connect/id6472881061",
    android: "https://play.google.com/store/apps/details?id=com.ulanzi.connect",
  },
  {
    brand: "COLBOR",
    appName: "COLBOR STUDIO",
    description: "Manage COLBOR COB lights — CCT, brightness curves, and special effects.",
    initials: "C",
    accent: "bg-[#DC2626]",
    ios: "https://apps.apple.com/us/app/colbor-studio/id1591339262",
    android: "https://play.google.com/store/apps/details?id=com.zhiying.colbor",
  },
  {
    brand: "Zhiyun",
    appName: "ZY Vega",
    description: "Control Zhiyun MOLUS and FIVERAY lighting series with presets and DMX-style scenes.",
    initials: "Z",
    accent: "bg-[#2563EB]",
    ios: "https://apps.apple.com/us/app/zy-vega/id6444816284",
    android: "https://play.google.com/store/apps/details?id=com.zhiyun.vega",
  },
  {
    brand: "SmallRig",
    appName: "SmallGoGo",
    description: "Adjust SmallRig RC and RM series lights — CCT, RGB, and scene effects.",
    initials: "Sr",
    accent: "bg-[#F59E0B] text-neutral-900",
    ios: "https://apps.apple.com/us/app/smallgogo/id1571101760",
    android: "https://play.google.com/store/apps/details?id=com.zzcyi.bluetoothled",
  },
  {
    brand: "Quasar Science",
    appName: "starCTRL",
    description: "Control Rainbow 2 and Double Rainbow LED tubes — HSI, gels, and pixel FX.",
    initials: "Q",
    accent: "bg-[#9333EA]",
    ios: "https://apps.apple.com/us/app/starctrl/id6444952715",
  },
  {
    brand: "Astera",
    appName: "AsteraApp",
    description: "Wireless control for Titan/Helios/Hyperion tubes — CRMX bridge, FX engine, and timelines.",
    initials: "As",
    accent: "bg-[#111827]",
    ios: "https://apps.apple.com/us/app/asteraapp/id1367867800",
    android: "https://play.google.com/store/apps/details?id=com.asteraled.asteraapp10",
  },
  {
    brand: "Rotolight",
    appName: "Rotolight",
    description: "Control NEO 3, AEOS 2, and Titan X fixtures — HSI, CCT, and high-speed flash settings.",
    initials: "R",
    accent: "bg-[#EA580C]",
    ios: "https://apps.apple.com/us/app/rotolight/id1602989731",
    android: "https://play.google.com/store/apps/details?id=com.rotolight.rotolight",
  },
];

export const groupedByBrand = controlApps.reduce<Record<string, ControlApp[]>>((acc, app) => {
  (acc[app.brand] ||= []).push(app);
  return acc;
}, {});