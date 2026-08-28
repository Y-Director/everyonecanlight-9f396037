import godoxVl150 from "@/assets/lights/godox-vl150.png";
import colbor220r from "@/assets/lights/colbor-cl220r.png";
import amaran200xs from "@/assets/lights/amaran-200xs.png";
import babyPlateAsset from "@/assets/equipment/baby-plate.webp.asset.json";
import ls600cProAsset from "@/assets/equipment/aputure-ls-600c-pro.jpg.asset.json";
import ls600dProAsset from "@/assets/equipment/aputure-ls-600d-pro.webp.asset.json";
import ls600xProAsset from "@/assets/equipment/aputure-ls-600x-pro.png.asset.json";
import mcProAsset from "@/assets/equipment/aputure-mc-pro.webp.asset.json";
import ballHeadMountAsset from "@/assets/equipment/ball-head-mount.webp.asset.json";
import babyPinAdapterAsset from "@/assets/equipment/baby-pin-adapter.jpg.asset.json";
import beamProjectorAsset from "@/assets/equipment/beam-projector-attachment.webp.asset.json";
import beautyDishAsset from "@/assets/equipment/beauty-dish-reflector.png.asset.json";
import barndoors8LeafAsset from "@/assets/equipment/barndoors-8-leaf.png.asset.json";
import accentB7cAsset from "@/assets/equipment/aputure-accent-b7c.avif.asset.json";
import storm1000cAsset from "@/assets/equipment/aputure-storm-1000c.webp.asset.json";
import storm80cAsset from "@/assets/equipment/aputure-storm-80c.webp.asset.json";
import arriM18Asset from "@/assets/equipment/arri-m18-hmi.jpeg.asset.json";
import arriM40Asset from "@/assets/equipment/arri-m40-hmi.jpeg.asset.json";
import arriOrbiterAsset from "@/assets/equipment/arri-orbiter.jpeg.asset.json";
import skypanelX21Asset from "@/assets/equipment/arri-skypanel-x21.png.asset.json";
import skypanelX23Asset from "@/assets/equipment/arri-skypanel-x23.webp.asset.json";
import asteraHeliosAsset from "@/assets/equipment/astera-helios-tube.webp.asset.json";
import asteraHyperionAsset from "@/assets/equipment/astera-hyperion-tube.webp.asset.json";
import asteraLunaBulbAsset from "@/assets/equipment/astera-lunabulb.webp.asset.json";
import asteraPlutoFresnelAsset from "@/assets/equipment/astera-plutofresnel.webp.asset.json";
import asteraTitanTubeAsset from "@/assets/equipment/astera-titan-tube.webp.asset.json";
import boomArmAsset from "@/assets/equipment/boom-arm.webp.asset.json";
import butterfly12Asset from "@/assets/equipment/butterfly-frame-12x12.jpg.asset.json";
import butterfly8Asset from "@/assets/equipment/butterfly-frame-8x8.jpg.asset.json";
import cStand20Asset from "@/assets/equipment/c-stand-20.jpeg.asset.json";
import cStand40Asset from "@/assets/equipment/c-stand-40.webp.asset.json";
import cardelliniClampAsset from "@/assets/equipment/cardellini-clamp.png.asset.json";
import cheesePlateAsset from "@/assets/equipment/cheese-plate.webp.asset.json";
import condorGripHeadAsset from "@/assets/equipment/condor-grip-head.jpg.asset.json";
import comboStandAsset from "@/assets/equipment/combo-stand.png.asset.json";
import lowBoyStandAsset from "@/assets/equipment/low-boy-stand.png.asset.json";
import clampMountBabyAsset from "@/assets/equipment/clamp-mount-baby.jpg.asset.json";
import arriL7cAsset from "@/assets/equipment/arri-l7-c-fresnel.webp.asset.json";
import arriL5cAsset from "@/assets/equipment/arri-l5-c-fresnel.png.asset.json";
import dedolightDled7Asset from "@/assets/equipment/dedolight-dled7.webp.asset.json";
import crossbarSupportAsset from "@/assets/equipment/crossbar-support.webp.asset.json";
import crankStandAsset from "@/assets/equipment/crank-stand.png.asset.json";
import boomStandAsset from "@/assets/equipment/boom-stand.jpeg.asset.json";
import boomArmNewAsset from "@/assets/equipment/boom-arm-new.jpeg.asset.json";
import diffusion4x4Asset from "@/assets/equipment/diffusion-frame-4x4.png.asset.json";
import diffusion6x6Asset from "@/assets/equipment/diffusion-frame-6x6.png.asset.json";
import { catalogEntries } from "./equipmentCatalog";

// Real product images supplied for catalogue entries, keyed by slug.
const catalogImages: Record<string, string> = {
  "aputure-accent-b7c": accentB7cAsset.url,
  "aputure-storm-1000c": storm1000cAsset.url,
  "aputure-storm-80c": storm80cAsset.url,
  "arri-m18-hmi": arriM18Asset.url,
  "arri-m40-hmi": arriM40Asset.url,
  "arri-orbiter": arriOrbiterAsset.url,
  "arri-skypanel-x21": skypanelX21Asset.url,
  "arri-skypanel-x23": skypanelX23Asset.url,
  "astera-helios-tube": asteraHeliosAsset.url,
  "astera-hyperion-tube": asteraHyperionAsset.url,
  "astera-lunabulb": asteraLunaBulbAsset.url,
  "astera-plutofresnel": asteraPlutoFresnelAsset.url,
  "astera-titan-tube": asteraTitanTubeAsset.url,
  "boom-arm": boomArmAsset.url,
  "butterfly-frame-12x12": butterfly12Asset.url,
  "butterfly-frame-8x8": butterfly8Asset.url,
  "c-stand-20": cStand20Asset.url,
  "c-stand-40": cStand40Asset.url,
  "cardellini-clamp": cardelliniClampAsset.url,
  "cheese-plate": cheesePlateAsset.url,
  "condor-grip-head": condorGripHeadAsset.url,
  "combo-stand": comboStandAsset.url,
  "low-boy-stand": lowBoyStandAsset.url,
  "clamp-mount-baby": clampMountBabyAsset.url,
  "arri-l7-c-fresnel": arriL7cAsset.url,
  "arri-l5-c-fresnel": arriL5cAsset.url,
  "dedolight-dled7": dedolightDled7Asset.url,
  "crossbar-support": crossbarSupportAsset.url,
  "crank-stand": crankStandAsset.url,
  "boom-stand": boomStandAsset.url,
  "boom-arm": boomArmNewAsset.url,
  "diffusion-frame-4x4": diffusion4x4Asset.url,
  "diffusion-frame-6x6": diffusion6x6Asset.url,
};


// Each equipment item has its own dedicated placeholder file so editing one
// image will never affect any other item.
const placeholderImages = import.meta.glob(
  "/src/assets/equipment-placeholders/*.png",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

const placeholder = (n: number): string => {
  const key = `/src/assets/equipment-placeholders/equipment-${String(n).padStart(3, "0")}.png`;
  return placeholderImages[key];
};

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
  /**
   * Gallery images for the detail page. The first item is shown as the main
   * image. Additional entries appear as thumbnails. Each entry should point
   * to its own independent file so edits stay isolated.
   */
  images: string[];
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

const CATEGORIES_POOL: EquipmentCategory[] = [
  "COB Lights",
  "Mat Lights",
  "Tube Lights",
  "Panel Lights",
  "Stands & Grips",
  "Others",
];

type NamedEntry = Omit<Equipment, "image" | "images"> & {
  brandedImage?: string;
};

const namedEntries: NamedEntry[] = [
  {
    slug: "amaran-100x-s",
    name: "Amaran 100X S",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "100W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Fill Light”",
    productDetails:
      "The Amaran 100X S is an ultra-compact bi-color COB light. Perfect for small studios and mobile setups, it offers flexible color temperature and impressive punch.",
  },
  {
    slug: "godox-vl-150",
    name: "Godox VL 150",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 96",
    watts: "150W",
    app: "Godox Light",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Interview Light”",
    productDetails:
      "Tuned for portraits and interviews at 150W daylight. Quiet operation, consistent colour, and Bowens mount compatibility make it ideal for sit-down talking heads and brand interviews.",
    brandedImage: godoxVl150,
  },
  {
    slug: "amaran-f21c",
    name: "Amaran F21C",
    category: "Mat Lights",
    color: "RGBWW",
    cri: "≥ 96",
    watts: "100W",
    app: "Sidus",
    typeKind: "Mat Light",
    bestUseCase: "“Soft Key”, “Travel Light”, “Tight Spaces”",
    productDetails:
      "A flexible 2x1 RGBWW mat light. Light, portable, and powerful, it's the perfect companion for creators who need a large source in a small package.",
  },
  {
    slug: "amaran-300c",
    name: "Amaran 300C",
    category: "COB Lights",
    color: "RGBWW",
    cri: "≥ 96",
    watts: "300W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Creative Accent”, “Large Studio”",
    productDetails:
      "The Amaran 300C is amaran’s first full-color 300W Bowens Mount point-source LED light, combining RGBWW full-color control with high output.",
  },
  {
    slug: "amaran-60d-s",
    name: "Amaran 60D S",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 96",
    watts: "65W",
    app: "Sidus, Amaran",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Portable Setup”, “Hair Light”",
    productDetails:
      "The Amaran 60D S is an ultra-compact daylight COB light. Despite its size, it packs a serious punch and is ideal for travel and quick setups.",
    brandedImage: amaran200xs,
  },
  {
    slug: "reflector-dish",
    name: "Reflector Dish",
    category: "Others",
    typeKind: "Modifier",
    bestUseCase: "“Focused Beam”, “Hard Light”",
    productDetails:
      "A Bowens-mount reflector dish that focuses your COB's output into a tighter, more directional beam. Great for hard-light looks and longer throw distances.",
  },
  {
    slug: "amaran-150c",
    name: "Amaran 150C",
    category: "COB Lights",
    color: "RGBWW",
    cri: "≥ 96",
    watts: "150W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Accent Light”, “Indie Filmmaking”",
    productDetails:
      "The Amaran 150C is amaran’s first full-color 150W Bowens Mount point-source LED light, offering high color quality and versatile output.",
  },
  {
    slug: "amaran-100d-s",
    name: "Amaran 100D S",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 96",
    watts: "100W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Small Studio”",
    productDetails:
      "A powerful yet affordable 100W daylight COB light. Great for content creators who need reliable daylight performance without complexity.",
  },
  {
    slug: "amaran-60x-s",
    name: "Amaran 60X S",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "65W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Mobile Setup”",
    productDetails:
      "Ultra-compact bi-color COB light. Flexible, portable, and perfect for matching ambient light on the go.",
  },
  {
    slug: "amaran-200x-s",
    name: "Amaran 200X S",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "200W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Interview Light”",
    productDetails:
      "Powerful 200W bi-color COB light. High output and accurate color rendering for professional interview and video work.",
  },
  {
    slug: "amaran-200d-s",
    name: "Amaran 200D S",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 96",
    watts: "200W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Large Studio”",
    productDetails:
      "High-output 200W daylight COB light. Delivers clean, bright 5600K light for demanding studio environments.",
  },
  {
    slug: "nanlite-gobo-disk",
    name: "Nanlite Gobo Disk",
    category: "Others",
    typeKind: "Modifier / Gobo",
    bestUseCase: "“Pattern Light”, “Backdrop Texture”",
    productDetails:
      "A patterned disk that drops into your Nanlite projection attachment to cast textured shapes onto your backdrop, adding depth and visual interest.",
  },
  {
    slug: "nanlite-fs-200",
    name: "Nanlite FS 200",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 96",
    watts: "200W",
    app: "NANLINK",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Studio Light”",
    productDetails:
      "A budget-friendly 200W daylight COB with reliable output and silent fan operation. A solid first key light for creators on a budget.",
  },
  {
    slug: "sutefoto-p230bi",
    name: "Sutefoto P230Bi",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 97",
    watts: "230W",
    app: "Sutefoto",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Interview Light”",
    productDetails:
      "230W bi-color COB with smooth dimming and a clean, neutral output. Strong value for creators who want flexible colour temperature without breaking the bank.",
  },
  {
    slug: "feelworld-fl-125d",
    name: "Feelworld FL 125D",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 97",
    watts: "125W",
    app: "Feelworld",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Talking Head Light”",
    productDetails: defaultProductDetails,
  },
  {
    slug: "amaran-f22c",
    name: "Amaran F22C",
    category: "Mat Lights",
    color: "RGBWW",
    cri: "≥ 95",
    watts: "200W",
    app: "Sidus",
    typeKind: "Mat Light",
    bestUseCase: "“Soft Key”, “Overhead Light”, “Wrap Light”",
    productDetails:
      "A flexible 2x2 RGBWW mat light. Folds flat, mounts to walls or ceilings, and gives a soft, large source with full colour control for tight spaces.",
  },
  {
    slug: "amaran-p60c",
    name: "Amaran P60C",
    category: "Panel Lights",
    color: "RGBWW",
    cri: "≥ 95",
    watts: "60W",
    app: "Sidus",
    typeKind: "Panel Light",
    bestUseCase: "“Fill Light”, “Accent Light”",
    productDetails:
      "A compact and versatile 60W RGBWW panel light. Features flexible power options and full color control.",
  },
  {
    slug: "amaran-pt1c",
    name: "Amaran PT1C",
    category: "Tube Lights",
    color: "RGBWW",
    cri: "≥ 95",
    watts: "6W",
    app: "Sidus",
    typeKind: "Tube Light",
    bestUseCase: "“Accent Light”, “Practical”",
    productDetails:
      "An ultra-portable 1ft RGBWW tube light. Perfect for adding localized color and effects in small spaces.",
  },
  {
    slug: "amaran-pt2c",
    name: "Amaran PT2C",
    category: "Tube Lights",
    color: "RGBWW",
    cri: "≥ 95",
    watts: "12W",
    app: "Sidus",
    typeKind: "Tube Light",
    bestUseCase: "“Accent Light”, “Background Light”",
    productDetails:
      "A 2ft RGBWW tube light offering a balance of output and portability. Great for creative lighting designs.",
  },
  {
    slug: "amaran-pt4c",
    name: "Amaran PT4C",
    category: "Tube Lights",
    color: "RGBWW",
    cri: "≥ 95",
    watts: "24W",
    app: "Sidus",
    typeKind: "Tube Light",
    bestUseCase: "“Key Light”, “Creative Accents”",
    productDetails:
      "A 4ft RGBWW tube light for long, elegant light trails and powerful background washes.",
  },
  {
    slug: "aputure-electro-storm-cs15",
    name: "Aputure Electro Storm CS15",
    category: "COB Lights",
    color: "RGBWW",
    cri: "CRI ≥ 95 / TLCI ≥ 96",
    watts: "1,500W",
    app: "Sidus Link",
    typeKind: "High-Output RGBWW COB Point-Source Light",
    bestUseCase: "“Large Sets”, “Daylight Replacement”, “Stadium & Arena Lighting”, “Colored Key & Ambience”",
    productDetails:
      "The Aputure Electro Storm CS15 is a 1,500W full-color RGBWW COB point-source fixture engineered for high-end cinema and large-scale productions. It delivers a tunable color temperature range of 2,000K–10,000K with full hue and saturation control, plus green/magenta adjustment for precise color matching. Powered by Aputure's BLAIR algorithm, it achieves cinema-grade color fidelity (CRI ≥ 95, TLCI ≥ 96, SSI Tungsten 86, SSI D55 78) while pushing roughly 60,500 lux at 3m with the included hyper reflector. It features active cooling with a near-silent mode, the Bowens-S mount, onboard and wireless DMX/CRMX, Art-Net/sACN over Ethernet, USB-C for firmware, and full Sidus Link app control. Powered via 48V AC adapter or industry-standard 48V battery solutions, the CS15 ships with a heavy-duty case, yoke, hyper reflector, and remote control box for professional rigging on set.",
  },
  {
    slug: "aputure-electro-storm-xt26",
    name: "Aputure Electro Storm XT26",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "2600W",
    app: "Sidus",
    typeKind: "High-Power COB Light",
    bestUseCase: "“Large Set”, “Daylight Replacement”",
    productDetails: "Ultra-high output bi-color COB light for professional cinema productions.",
  },
  {
    slug: "aputure-electro-storm-xt52",
    name: "Aputure Electro Storm XT52",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "5200W",
    app: "Sidus",
    typeKind: "High-Power COB Light",
    bestUseCase: "“Large Set”, “Major Production”",
    productDetails: "One of the most powerful bi-color LED sources available for high-end cinematography.",
  },
  {
    slug: "aputure-infinibar-pb3",
    name: "Aputure INFINIBAR PB3",
    category: "Panel Lights",
    color: "RGBWW",
    cri: "≥ 96",
    watts: "6.5W",
    app: "Sidus",
    typeKind: "Pixel Bar",
    bestUseCase: "“Creative Lighting”, “Practical”",
    productDetails: "A 1ft (30cm) RGBWW full-color LED pixel bar for artistic lighting designs.",
  },
  {
    slug: "aputure-infinibar-pb6",
    name: "Aputure INFINIBAR PB6",
    category: "Panel Lights",
    color: "RGBWW",
    cri: "≥ 96",
    watts: "14W",
    app: "Sidus",
    typeKind: "Pixel Bar",
    bestUseCase: "“Creative Lighting”, “Backdrop”",
    productDetails: "A 2ft (60cm) RGBWW full-color LED pixel bar with multiple pixels for smooth gradients.",
  },
  {
    slug: "aputure-infinibar-pb12",
    name: "Aputure INFINIBAR PB12",
    category: "Panel Lights",
    color: "RGBWW",
    cri: "≥ 96",
    watts: "27W",
    app: "Sidus",
    typeKind: "Pixel Bar",
    bestUseCase: "“Key Light”, “Creative Lighting”",
    productDetails: "A 4ft (120cm) RGBWW full-color LED pixel bar for professional set lighting.",
  },
  {
    slug: "aputure-ls-1200d-pro",
    name: "Aputure LS 1200D Pro",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 96",
    watts: "1200W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Large Set”, “Daylight Simulation”",
    productDetails: "Powerful 1200W daylight-balanced COB light with high-intensity output.",
  },
  {
    slug: "aputure-ls-1200x",
    name: "Aputure LS 1200X",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "1200W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Large Set”, “Variable Color”",
    productDetails: "High-power 1200W bi-color COB light for versatile studio and location work.",
  },
  {
    slug: "aputure-ls-300d-ii",
    name: "Aputure LS 300D II",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 96",
    watts: "300W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Fill Light”",
    productDetails: "A versatile and punchy 300W daylight COB light with professional controls.",
  },
  {
    slug: "aputure-ls-300x",
    name: "Aputure LS 300X",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "300W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Mixed Lighting”",
    productDetails: "Bi-color 300W COB light offering a wide range of color temperatures.",
  },
  {
    slug: "aputure-ls-400x",
    name: "Aputure LS 400X",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "400W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Location Work”",
    productDetails: "Punchy 400W bi-color COB light with high color accuracy.",
  },
  {
    slug: "aputure-ls-600c-pro",
    name: "Aputure LS 600C Pro",
    category: "COB Lights",
    color: "RGBWW",
    cri: "≥ 96",
    watts: "600W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Creative Color”",
    productDetails: "A full-color 600W RGBWW COB light for ultimate color control on set.",
    brandedImage: ls600cProAsset.url,
  },
  {
    slug: "aputure-ls-600d-pro",
    name: "Aputure LS 600D Pro",
    category: "COB Lights",
    color: "Daylight",
    cri: "≥ 96",
    watts: "600W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Sun Simulation”",
    productDetails: "The industry standard 600W daylight COB light for professional production.",
    brandedImage: ls600dProAsset.url,
  },
  {
    slug: "aputure-ls-600x-pro",
    name: "Aputure LS 600X Pro",
    category: "COB Lights",
    color: "Bi-Color",
    cri: "≥ 96",
    watts: "600W",
    app: "Sidus",
    typeKind: "COB Light",
    bestUseCase: "“Key Light”, “Versatile Studio”",
    productDetails: "Powerful 600W bi-color COB light with weather resistance and high output.",
    brandedImage: ls600xProAsset.url,
  },
  {
    slug: "aputure-mc-pro",
    name: "Aputure MC Pro",
    category: "Panel Lights",
    color: "RGBWW",
    cri: "≥ 96",
    watts: "5W",
    app: "Sidus",
    typeKind: "Pocket Panel Light",
    bestUseCase: "“Accent Light”, “Practical”",
    productDetails: "A rugged, waterproof version of the original MC pocket light with more output.",
    brandedImage: mcProAsset.url,
  },
  {
    slug: "baby-plate",
    name: "Baby Plate",
    category: "Stands & Grips",
    typeKind: "Grip Equipment",
    bestUseCase: "“Mounting”, “Wall Rigging”",
    productDetails: "A standard baby pin plate for mounting lights to walls, floors, or other surfaces.",
    brandedImage: babyPlateAsset.url,
  },
  {
    slug: "ball-head-mount",
    name: "Ball Head Mount",
    category: "Stands & Grips",
    typeKind: "Grip Equipment",
    bestUseCase: "“Mounting”, “Fine Angle Control”",
    productDetails:
      "A compact ball head mount with a 1/4\" screw and cold shoe base, giving quick and precise angle adjustment for small lights, monitors, and accessories.",
    brandedImage: ballHeadMountAsset.url,
  },
  {
    slug: "baby-pin-adapter",
    name: "Baby Pin Adapter",
    category: "Stands & Grips",
    typeKind: "Grip Equipment",
    bestUseCase: "“Mounting”, “Stand Adaptation”",
    productDetails:
      "A chrome 5/8\" baby pin adapter used to bridge stands, clamps, and grip heads so lights can be rigged onto almost any support.",
    brandedImage: babyPinAdapterAsset.url,
  },
  {
    slug: "beam-projector-attachment",
    name: "Beam Projector Attachment",
    category: "Others",
    typeKind: "Light Modifier",
    bestUseCase: "“Focused Beam”, “Gobo Patterns”",
    productDetails:
      "A projection attachment that turns a point-source light into a focusable spotlight, with gobo slot support for hard-edged shapes and patterns.",
    brandedImage: beamProjectorAsset.url,
  },
  {
    slug: "beauty-dish-reflector",
    name: "Beauty Dish Reflector",
    category: "Others",
    typeKind: "Light Modifier",
    bestUseCase: "“Beauty Light”, “Portraits”",
    productDetails:
      "A wide beauty dish with honeycomb grid that produces crisp yet flattering light with controlled spill — a favourite for beauty and portrait keys.",
    brandedImage: beautyDishAsset.url,
  },
  {
    slug: "barndoors-8-leaf",
    name: "Barndoors 8 Leaf",
    category: "Others",
    typeKind: "Light Modifier",
    bestUseCase: "“Spill Control”, “Shaping”",
    productDetails:
      "An eight-leaf barndoor set for Bowens-style reflectors, giving fine control over spill and letting you flag light off walls, lenses, and backgrounds.",
    brandedImage: barndoors8LeafAsset.url,
  },
];

// Catalogue entries sourced from the full 250-item equipment document. Any item
// already covered by `namedEntries` above is skipped so curated copy and images
// are never overwritten.
const PLACEHOLDER_COUNT = 250;

const allEntries: NamedEntry[] = [
  ...namedEntries,
  ...catalogEntries.filter(
    (entry) => !namedEntries.some((named) => named.slug === entry.slug)
  ),
];

export const equipment: Equipment[] = allEntries.map((entry, i) => {
  // Each item gets its OWN dedicated image file so any edit is fully isolated.
  const ownImage =
    entry.brandedImage ?? catalogImages[entry.slug] ?? placeholder((i % PLACEHOLDER_COUNT) + 1);


  return {
    slug: entry.slug,
    name: entry.name,
    image: ownImage,
    images: [ownImage],
    category: entry.category,
    color: entry.color,
    cri: entry.cri,
    watts: entry.watts,
    app: entry.app,
    typeKind: entry.typeKind,
    bestUseCase: entry.bestUseCase,
    productDetails: entry.productDetails,
  };
});

export const getEquipmentBySlug = (slug: string) =>
  equipment.find((e) => e.slug === slug);
