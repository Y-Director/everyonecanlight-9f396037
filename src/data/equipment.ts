import placeholderLight from "@/assets/light-product.png";
import godoxVl150 from "@/assets/lights/godox-vl150.png";
import colbor220r from "@/assets/lights/colbor-cl220r.png";
import amaran200xs from "@/assets/lights/amaran-200xs.png";

export type EquipmentCategory =
  | "COB Lights"
  | "Mat Lights"
  | "Tube Lights"
  | "Panel Lights"
  | "Stands & Grips"
  | "Others";

export type Equipment = {
  slug: string;
  name: string;
  image: string;
  category: EquipmentCategory;
  color?: string;
  cri?: string;
  watts?: string;
  app?: string;
  typeKind: string;
  bestUseCase: string;
  productDetails: string;
};

const defaultProductDetails =
  "Detailed product information for this light is coming soon. Specs, build quality notes, and on-set observations will be added shortly.";

export const equipment: Equipment[] = [
  {
    slug: "aputure-120d",
    name: "Aputure 120D",
    image: placeholderLight,
    category: "COB Lights",
    color: "Daylight",
    cri: "≥96",
    watts: "120W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "\u201cKey Light\u201d, \u201cBack Light\u201d, \u201cBackdrop Light\u201d",
    productDetails:
      "The Aputure 120D is a daylight-balanced COB light long trusted by indie filmmakers and content creators. It delivers a clean 5500K output with high colour accuracy, making it a dependable key light for talking-head videos and small studio interviews.",
  },
  {
    slug: "godox-vl-150",
    name: "Godox VL 150",
    image: godoxVl150,
    category: "COB Lights",
    color: "Daylight",
    cri: "≥96",
    watts: "150W",
    app: "Godox Light",
    typeKind: "COB Light",
    bestUseCase: "\u201cKey Light\u201d, \u201cInterview Light\u201d",
    productDetails:
      "Tuned for portraits and interviews at 150W daylight. Quiet operation, consistent colour, and Bowens mount compatibility make it ideal for sit-down talking heads and brand interviews.",
  },
  {
    slug: "colbor-220r",
    name: "Colbor 220R",
    image: colbor220r,
    category: "COB Lights",
    color: "RGBWW",
    cri: "≥96",
    watts: "220W",
    app: "Colbor Studio",
    typeKind: "COB Light",
    bestUseCase: "\u201cKey Light\u201d, \u201cCreative Accent\u201d, \u201cCinema FX\u201d",
    productDetails:
      "RGBWW at 220W for cinema and creative shots. Full-spectrum colour plus punchy output, perfect when you want mood, gels-without-gels, and cinematic accents.",
  },
  {
    slug: "aputure-nova-300c",
    name: "Aputure Nova 300C",
    image: placeholderLight,
    category: "Panel Lights",
    color: "RGBWW",
    cri: "≥96",
    watts: "300W",
    app: "Sidus",
    typeKind: "Panel Light",
    bestUseCase: "\u201cSoft Key\u201d, \u201cBackdrop Wash\u201d, \u201cFill Light\u201d",
    productDetails:
      "A large-format RGBWW panel built for studios and brand work. Smooth, large source output with full colour control for cinematic and commercial scenes.",
  },
  {
    slug: "amaran-200x-s",
    name: "Amaran 200X S",
    image: amaran200xs,
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥96",
    watts: "200W",
    app: "Sidus, Amaran",
    typeKind: "COB Light",
    bestUseCase: "\u201cKey Light\u201d, \u201cInterview Light\u201d, \u201cBack Light\u201d",
    productDetails:
      "200W bi-color tuned for pro interviews. Strong output, smooth dimming, and reliable colour rendering for premium brand work.",
  },
  {
    slug: "reflector-dish",
    name: "Reflector Dish",
    image: placeholderLight,
    category: "Others",
    typeKind: "Modifier",
    bestUseCase: "\u201cFocused Beam\u201d, \u201cHard Light\u201d",
    productDetails:
      "A Bowens-mount reflector dish that focuses your COB's output into a tighter, more directional beam. Great for hard-light looks and longer throw distances.",
  },
  {
    slug: "aputure-600d",
    name: "Aputure 600D",
    image: placeholderLight,
    category: "COB Lights",
    color: "Daylight",
    cri: "≥96",
    watts: "600W",
    app: "Sidus, Amaran",
    typeKind: "COB Light",
    bestUseCase: "\u201cKey Light\u201d, \u201cOutdoor Lighting\u201d, \u201cBack Light\u201d",
    productDetails:
      "Aputure LS 600D\u2019s All-in-One control box is now completely silent. The control box of Aputure 600d features 8 built-in lighting FX: \u201cParazzi\u201d, \u201cSpark\u201d, \u201cLightning\u201d, \u201cFaulty Bulb\u201d, \u201cTV\u201d, \u201cPulse\u201d, \u201cFlash\u201d, and \u201cExplosion\u201d, with more coming in future firmware updates via the control box\u2019s USB interface. The control box also features a new \u201ctrigger\u201d button to activate lighting FX instantly.",
  },
  {
    slug: "amaran-pt2c",
    name: "Amaran PT2C",
    image: placeholderLight,
    category: "Tube Lights",
    color: "RGBWW",
    cri: "≥95",
    watts: "20W",
    app: "Sidus, Amaran",
    typeKind: "Tube Light",
    bestUseCase: "\u201cAccent Light\u201d, \u201cBackground Light\u201d, \u201cKicker\u201d",
    productDetails:
      "A compact 2ft RGBWW tube light perfect for adding colourful accents and edge lighting to creator setups. Battery-powered, app-controllable, and quick to rig anywhere on set.",
  },
  {
    slug: "amaran-f22c",
    name: "Amaran F22C",
    image: placeholderLight,
    category: "Mat Lights",
    color: "RGBWW",
    cri: "≥95",
    watts: "200W",
    app: "Sidus, Amaran",
    typeKind: "Mat Light",
    bestUseCase: "\u201cSoft Key\u201d, \u201cOverhead Light\u201d, \u201cWrap Light\u201d",
    productDetails:
      "A flexible 2x2 RGBWW mat light. Folds flat, mounts to walls or ceilings, and gives a soft, large source with full colour control for tight spaces.",
  },
  {
    slug: "aputure-mc",
    name: "Aputure MC",
    image: placeholderLight,
    category: "Panel Lights",
    color: "RGBWW",
    cri: "≥96",
    watts: "5W",
    app: "Sidus",
    typeKind: "Pocket Panel Light",
    bestUseCase: "\u201cAccent Light\u201d, \u201cPractical\u201d, \u201cTravel Light\u201d",
    productDetails:
      "Pocket-sized RGBWW panel that magnetically sticks anywhere on set. Built-in battery and wireless charging make it the easiest accent light you'll own.",
  },
  {
    slug: "aputure-b7c",
    name: "Aputure B7C",
    image: placeholderLight,
    category: "Others",
    color: "RGBWW",
    cri: "≥95",
    watts: "7W",
    app: "Sidus",
    typeKind: "Smart Bulb",
    bestUseCase: "\u201cPractical Light\u201d, \u201cIn-Frame Bulb\u201d",
    productDetails:
      "A full-colour smart bulb that fits any standard E26 socket. Great for practical lamps in frame, with full Sidus Link app control.",
  },
  {
    slug: "nanlite-gobo-disk",
    name: "Nanlite Gobo Disk",
    image: placeholderLight,
    category: "Others",
    typeKind: "Modifier / Gobo",
    bestUseCase: "\u201cPattern Light\u201d, \u201cBackdrop Texture\u201d",
    productDetails:
      "A patterned disk that drops into your Nanlite projection attachment to cast textured shapes onto your backdrop, adding depth and visual interest.",
  },
  {
    slug: "nanlite-fs-200",
    name: "Nanlite FS 200",
    image: placeholderLight,
    category: "COB Lights",
    color: "Daylight",
    cri: "≥96",
    watts: "200W",
    app: "NANLINK",
    typeKind: "COB Light",
    bestUseCase: "\u201cKey Light\u201d, \u201cStudio Light\u201d",
    productDetails:
      "A budget-friendly 200W daylight COB with reliable output and silent fan operation. A solid first key light for creators on a budget.",
  },
  {
    slug: "sutefoto-p230bi",
    name: "Sutefoto P230Bi",
    image: placeholderLight,
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥97",
    watts: "230W",
    app: "Sutefoto",
    typeKind: "COB Light",
    bestUseCase: "\u201cKey Light\u201d, \u201cInterview Light\u201d",
    productDetails:
      "230W bi-color COB with smooth dimming and a clean, neutral output. Strong value for creators who want flexible colour temperature without breaking the bank.",
  },
  {
    slug: "feelworld-fl-125d",
    name: "Feelworld FL 125D",
    image: placeholderLight,
    category: "COB Lights",
    color: "Daylight",
    cri: "≥97",
    watts: "125W",
    app: "Feelworld",
    typeKind: "COB Light",
    bestUseCase: "\u201cKey Light\u201d, \u201cTalking Head Light\u201d",
    productDetails: defaultProductDetails,
  },
];

export const getEquipmentBySlug = (slug: string) =>
  equipment.find((e) => e.slug === slug);