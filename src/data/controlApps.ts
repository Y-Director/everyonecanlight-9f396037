import falconEyesV2Icon from "@/assets/apps/falcon-eyes-v2.webp.asset.json";

export type ControlApp = {
  brand: string;
  appName: string;
  description: string;
  initials: string;
  accent: string; // tailwind bg color class for the logo tile
  ios?: string;
  android?: string;
  web?: string;
  iconUrl?: string;
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
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/a2/f6/b2/a2f6b242-2536-0582-7925-d7b152dcf6e1/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg",
  },
  {
    brand: "Amaran",
    appName: "amaran",
    description: "Official amaran companion app for color, CCT, and creative effects on amaran lights.",
    initials: "Am",
    accent: "bg-[#F97316]",
    ios: "https://apps.apple.com/us/app/amaran/id6503329243",
    android: "https://play.google.com/store/apps/details?id=com.sidus.link.amaran",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/f6/76/a0/f676a09e-3a83-dc22-3e36-14ebde3a4728/AppIcon_PROD-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg",
  },
  {
    brand: "Godox",
    appName: "Godox Light",
    description: "Pair, dim, and tune Godox LED fixtures; switch CCT, RGB, and built-in lighting effects.",
    initials: "G",
    accent: "bg-[#0EA5E9]",
    ios: "https://apps.apple.com/us/app/godox-light/id1543734417",
    android: "https://play.google.com/store/apps/details?id=com.godox.ble.mesh",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/41/d3/91/41d39165-33d5-a646-dafd-933e429e09d0/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg",
  },
  {
    brand: "Nanlite",
    appName: "NANLINK",
    description: "Cross-fixture control for Nanlite & Nanlux — groups, gels, effects, and firmware updates.",
    initials: "N",
    accent: "bg-[#1E293B]",
    ios: "https://apps.apple.com/us/app/nanlink/id1584085006",
    android: "https://play.google.com/store/apps/details?id=com.nanlink.nanlink",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/94/cc/1e/94cc1e7a-82a3-5e33-4e46-5c73c467696b/AppIcon-0-0-1x_U007emarketing-0-8-0-0-85-220-0.png/512x512bb.jpg",
  },
  {
    brand: "Falcon Eyes",
    appName: "Falcon Eyes V2 App",
    description: "Wireless control of Falcon Eyes panels, COBs, and tubes — CCT, RGB, and scene presets.",
    initials: "F",
    accent: "bg-[#7C3AED]",
    ios: "https://apps.apple.com/us/app/falconeyes-v2/id1470899020",
    android: "https://play.google.com/store/apps/details?id=cn.light.falconeyes.v2",
    iconUrl: falconEyesV2Icon.url,
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
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/5f/a9/df/5fa9df38-3eff-fb1c-0e13-ead3e1046497/AppIcon-0-0-1x_U007emarketing-0-6-0-0-85-220.png/512x512bb.jpg",
  },
  {
    brand: "Ulanzi",
    appName: "Ulanzi Connect",
    description: "Tweak Ulanzi VL/LT series tubes and panels — HSI, gels, and animated FX.",
    initials: "U",
    accent: "bg-[#FACC15] text-neutral-900",
    ios: "https://apps.apple.com/us/app/ulanzi-connect/id6472881061",
    android: "https://play.google.com/store/apps/details?id=com.ulanzi.connect",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/74/98/1c/74981cd3-7b63-d0cf-787c-b1563df022fa/AppIcon-0-0-1x_U007ephone-0-1-0-sRGB-85-220.png/512x512bb.jpg",
  },
  {
    brand: "COLBOR",
    appName: "COLBOR STUDIO",
    description: "Manage COLBOR COB lights — CCT, brightness curves, and special effects.",
    initials: "C",
    accent: "bg-[#DC2626]",
    ios: "https://apps.apple.com/us/app/colbor-studio/id1591339262",
    android: "https://play.google.com/store/apps/details?id=com.zhiying.colbor",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/95/af/dc/95afdc7f-cee8-2f63-3225-a8b8c8973723/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  },
  {
    brand: "Zhiyun",
    appName: "ZY Vega",
    description: "Control Zhiyun MOLUS and FIVERAY lighting series with presets and DMX-style scenes.",
    initials: "Z",
    accent: "bg-[#2563EB]",
    ios: "https://apps.apple.com/us/app/zy-vega/id6444816284",
    android: "https://play.google.com/store/apps/details?id=com.zhiyun.vega",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/1b/6a/7b/1b6a7b84-233a-fa4b-856c-2a7f77c4bd09/AppIcon-1x_U007emarketing-0-9-0-85-220-0.png/512x512bb.jpg",
  },
  {
    brand: "SmallRig",
    appName: "SmallGoGo",
    description: "Adjust SmallRig RC and RM series lights — CCT, RGB, and scene effects.",
    initials: "Sr",
    accent: "bg-[#F59E0B] text-neutral-900",
    ios: "https://apps.apple.com/us/app/smallgogo/id1571101760",
    android: "https://play.google.com/store/apps/details?id=com.zzcyi.bluetoothled",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/76/57/6c/76576cfa-a61b-f459-e19e-9af4cc2cdf9e/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg",
  },
  {
    brand: "Quasar Science",
    appName: "starCTRL",
    description: "Control Rainbow 2 and Double Rainbow LED tubes — HSI, gels, and pixel FX.",
    initials: "Q",
    accent: "bg-[#9333EA]",
    ios: "https://apps.apple.com/us/app/starctrl/id6444952715",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/b3/9e/e8/b39ee87f-3492-4c51-171a-964876b7b25d/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg",
  },
  {
    brand: "Astera",
    appName: "AsteraApp",
    description: "Wireless control for Titan/Helios/Hyperion tubes — CRMX bridge, FX engine, and timelines.",
    initials: "As",
    accent: "bg-[#111827]",
    ios: "https://apps.apple.com/us/app/asteraapp/id1367867800",
    android: "https://play.google.com/store/apps/details?id=com.asteraled.asteraapp10",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/97/60/8b/97608b85-5e08-e531-4b7c-6e1891190b1e/app-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  },
  {
    brand: "Rotolight",
    appName: "Rotolight",
    description: "Control NEO 3, AEOS 2, and Titan X fixtures — HSI, CCT, and high-speed flash settings.",
    initials: "R",
    accent: "bg-[#EA580C]",
    ios: "https://apps.apple.com/us/app/rotolight/id1602989731",
    android: "https://play.google.com/store/apps/details?id=com.rotolight.rotolight",
    iconUrl: "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/b2/7d/1c/b27d1c95-cd9a-4471-7373-40ddf0627eaa/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg",
  },
];

export const groupedByBrand = controlApps.reduce<Record<string, ControlApp[]>>((acc, app) => {
  (acc[app.brand] ||= []).push(app);
  return acc;
}, {});