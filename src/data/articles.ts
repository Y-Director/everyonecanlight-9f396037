import thumb from "@/assets/two-lights-thumb.png";
import lightingEquipmentOptions from "@/assets/lighting-equipment-options.png";
import fixDarkVideos from "@/assets/fix-dark-videos.png";
import bestLights2026 from "@/assets/best-lights-2026.png";
import authorFavour from "@/assets/author-favour.jpg";
import authorAdeyinka from "@/assets/author-adeyinka.jpg";
import authorAdeyinkaNew from "@/assets/author-adeyinka-new.jpg";
import lightProlite from "@/assets/lights/prolite-pl150w.png";
import lightKf from "@/assets/lights/kf-st150w.png";
import lightGodoxVl150 from "@/assets/lights/godox-vl150.png";
import lightColbor220r from "@/assets/lights/colbor-cl220r.png";
import lightColbor220 from "@/assets/lights/colbor-cl220.png";
import lightColbor330 from "@/assets/lights/colbor-cl330.png";
import lightAmaran150c from "@/assets/lights/amaran-150c.png";
import lightAmaran200xs from "@/assets/lights/amaran-200xs.png";
import lightNeewerCb300c from "@/assets/lights/neewer-cb300c.png";
import lightNeewerCb200c from "@/assets/lights/neewer-cb200c.png";
import twoLightDiagram from "@/assets/articles/2-light-setup-diagram.png";
import whatIsWattageThumb from "@/assets/articles/what-is-wattage.png.asset.json";
import fixDarkVideosThumb from "@/assets/articles/fix-dark-videos.png.asset.json";
import loopLightingDiagram from "@/assets/articles/loop-lighting-diagram.png";
import butterflyLightingDiagram from "@/assets/articles/butterfly-lighting-diagram.png";

export type ArticleContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string }
  | {
      type: "setup";
      number: number;
      title: string;
      intro: string;
      equipment: string[];
      diagramSrc: string;
      diagramAlt: string;
    };

export type Author = {
  name: string;
  avatar?: string;
};

export type Article = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  image: string;
  hideCover?: boolean;
  authors: Author[];
  content: ArticleContentBlock[];
};

export const articles: Article[] = [
  {
    slug: "softbox-vs-umbrella-which-should-i-buy-first",
    title: "Softbox vs Umbrella: Which should I buy first?",
    date: "May 9, 2026",
    tags: ["Comparison"],
    image: lightingEquipmentOptions,
    hideCover: true,
    authors: [
      { name: "Favour Agbogun", avatar: authorFavour },
      { name: "Adeyinka Ibidapo", avatar: authorAdeyinka },
    ],
    content: [
      {
        type: "paragraph",
        text: "In simple understanding, both are light diffusers. They help soften light before it touches the subject or product depending on the scenario. They both make the light appear bigger and create more spread.",
      },
      { type: "heading", text: "Is there an advantage over the other?" },
      { type: "paragraph", text: "Let's break it down this way." },
      {
        type: "paragraph",
        text: "The Parabolic softbox diffuser directs the light in a singular direction from the COB (chip on board) source and passes it through an inner diffuser layer and the outer diffuser layer. With this double diffusion, the light gets soften and follows the shape and size of the diffuser. While the Umbrella diffuser allows the light to firstly spread inwardly, bounces out the silver/white inner surface before coming out through the outer diffusion.",
      },
      {
        type: "paragraph",
        text: "For a first time approach on Lighting, you should buy the Parabolic softbox diffuser if your immediate plans are to shoot talking head videos, interviews, product videos with advantages of working in small spaces where light spill can be controlled. If your immediate plans are to shoot groups of people simultaneously, or you have a big space to set up lights, or you have plans on lighting up an entire backdrop, then you should buy an Umbrella diffuser.",
      },
      { type: "heading", text: "Start small and scale with Precision" },
      {
        type: "paragraph",
        text: "Start with 60/65cm Parabolic softbox diffuser. It will help you with a controlled focus point avoiding spills, although light may appear more punchy compared with 85cm or 105cm Parabolic softbox diffusers. To understand how the Umbrella diffuser also work, start with smaller versions like 85cm and when you need to light bigger spaces and scenes, use the 105cm, 130cm, 165cm.",
      },
      { type: "heading", text: "Key Differences" },
      {
        type: "paragraph",
        text: "Parabolic softbox diffuser will give you focused and clean output, Umbrella diffuser will give you open and softer output. Umbrella diffuser may be slower to set up with c-stands especially when changing light directions. It is faster to switch in between different sizes of Parabolic softbox diffuser. It is also easier to attach grid on a Parabolic diffuser to further control spill than using flags for light control in Umbrella diffusers.",
      },
      { type: "heading", text: "What we do" },
      {
        type: "paragraph",
        text: "We mostly work with Parabolic diffusers in our lighting setups due to precision and lighting control. Infact, our favourite size is the 65cm due to its compact nature, faster setup for most of the up close talking heads and interview shoots.",
      },
    ],
  },
  {
    slug: "how-to-light-a-small-room-for-video-with-just-2-lights",
    title: "How to Light a Small Room for Video With Just 2 Lights.",
    date: "April 25, 2026",
    tags: ["How-to"],
    image: thumb,
    authors: [{ name: "Favour Agbogun", avatar: authorFavour }],
    content: [
      {
        type: "paragraph",
        text: "You've tried your best to use less to achieve more in the corner of your apartment, or in your office or even on location. Making your videos look professional are looking almost impossible cause you are unaware of what lights to work with and how to position them.",
      },
      { type: "heading", text: "Here is All You Need" },
      {
        type: "paragraph",
        text: "A \"Key Light\" which is main source to illuminate your face and body, and then \"Back Light\" which works as the light to either light your wall background or light your back and this technique is called a 2-point Lighting setup.",
      },
      {
        type: "paragraph",
        text: "Considering your small space, you want to go for a key light that is small in size, flat in build, at the same time perfect enough to illuminate your face.",
      },
      {
        type: "paragraph",
        text: "Mat lights are perfect for this scenario. Cause of how flat they could fit into small areas.",
      },
      {
        type: "paragraph",
        text: "Technique 1: Use a c-stand to mount your mat light, a 1x1 size or a 2x2 size will be great choices. With the diffuser modifier attached, direct it to face top down or slightly angled to the direction where your face will be positioned.",
      },
      {
        type: "image",
        src: twoLightDiagram,
        alt: "Top-down diagram of a small room 2-light setup with Falcon Eye 24TD as key light on a c-stand and Amaran Ace 25C as back light",
      },
      {
        type: "paragraph",
        text: "Mat Light recommended options included and not limited to: Godox F200Bi, Amaran F22, Falcon Eye 24TD which are soft enough with the diffuser attached and project 200 Watts of Light enough to illuminate the face properly.",
      },
      {
        type: "paragraph",
        text: "Technique 2: This is without using the c-stand and may be a bit more technical. This requires you to tape the mat light to the ceiling area using gaffer or duct tapes. The technicalities involved in this would mean that you are sure of the positioning and won't be moving it at least for the shoot period. We recommend Technique 1 for beginners and newbies to avoid lighting mistakes.",
      },
      {
        type: "paragraph",
        text: "To further make the scene more interestingly awesome, add a back light either to face the wall behind you or place it in your left rear or right rear to form a kicker light that will touch the edges of your neck and side arm. This is advice to be in warm white, white or full colored.",
      },
      {
        type: "paragraph",
        text: "Recommended lights for these include Amaran PT2C, Nanlite 15X, Aputure MC, Amaran Ace 25C, Godox TL60, Sutefoto tp25 which will provide between 5 Watts to 25 Watts of light.",
      },
      {
        type: "paragraph",
        text: "Remember to adjust your Key Light's intensity to fir your camera or phone's exposure settings, and make your back light less intensified than your key light.",
      },
    ],
  },
  {
    slug: "best-lights-for-content-creators-in-2026",
    title: "Best Lights for Content Creators in 2026",
    date: "Jan 21, 2026",
    tags: ["Guides"],
    image: bestLights2026,
    authors: [{ name: "Adeyinka Ibidapo", avatar: authorAdeyinkaNew }],
    content: [
      {
        type: "paragraph",
        text: "We put together a set of COB lights. COB lights are widely used because of the versatility of attaching different sizes of modifiers for different scenarios. And as a content creator who will do more of \"talking heads\" shoots for brands, here are the best COB options you should pick from.",
      },
      { type: "heading", text: "Before the Light Options, Understand this." },
      {
        type: "paragraph",
        text: "We put together a set of COB lights. COB lights are widely used because of the versatility of attaching different sizes of modifiers for different scenarios. And as a content creator who will do more of talking heads, shoots for brands, and other creative things here are the best COB options you should pick from.",
      },
      { type: "heading", text: "Here are top 10 Best Options for You" },
      { type: "heading", text: "Prolite PL-150W" },
      { type: "image", src: lightProlite, alt: "Prolite PL-150W" },
      { type: "paragraph", text: "A versatile starter COB at 150W daylight. Reliable output, simple controls, and broad modifier support make it a dependable first light for creators stepping up from on-camera panels." },
      { type: "heading", text: "K&F ST-150W" },
      { type: "image", src: lightKf, alt: "K&F ST-150W" },
      { type: "paragraph", text: "A solid studio basic at 150W daylight. Clean output and an accessible price point — great for building your first key/fill setup without overspending." },
      { type: "heading", text: "Godox VL150" },
      { type: "image", src: lightGodoxVl150, alt: "Godox VL150" },
      { type: "paragraph", text: "Tuned for portraits and interviews at 150W daylight. Quiet operation and consistent color make it ideal for sit-down talking heads and brand interviews." },
      { type: "heading", text: "COLBOR CL 220 R" },
      { type: "image", src: lightColbor220r, alt: "COLBOR CL 220 R" },
      { type: "paragraph", text: "RGBWW at 220W for cinema and creative shots. Full-spectrum color plus punchy output — perfect when you want mood, gels-without-gels, and cinematic accents." },
      { type: "heading", text: "COLBOR CL 220" },
      { type: "image", src: lightColbor220, alt: "COLBOR CL 220" },
      { type: "paragraph", text: "150W RGBWW for creative shots. Compact, app-controlled, and color-accurate, great for adding stylized accents to your setups." },
      { type: "heading", text: "COLBOR CL330" },
      { type: "image", src: lightColbor330, alt: "COLBOR CL330" },
      { type: "paragraph", text: "330W RGBWW built for big studio setups. Plenty of headroom to push through large softboxes and umbrellas, or to light wider scenes." },
      { type: "heading", text: "Amaran 150C" },
      { type: "image", src: lightAmaran150c, alt: "Amaran 150C" },
      { type: "paragraph", text: "150W RGBWW for creative shots. Compact, app-controlled, and color-accurate — great for adding stylized accents to your setups." },
      { type: "heading", text: "Amaran 200x S" },
      { type: "image", src: lightAmaran200xs, alt: "Amaran 200x S" },
      { type: "paragraph", text: "200W bi-color tuned for pro interviews. Strong output, smooth dimming, and reliable color rendering for premium brand work." },
      { type: "heading", text: "Neewer CB300C" },
      { type: "image", src: lightNeewerCb300c, alt: "Neewer CB300C" },
      { type: "paragraph", text: "300W RGBWW for studio and full-body lighting. Big output for backdrops, group shots, and high-ceiling spaces." },
      { type: "heading", text: "Neewer CB200C" },
      { type: "image", src: lightNeewerCb200c, alt: "Neewer CB200C" },
      { type: "paragraph", text: "200W RGBWW built for creator flexibility. A balanced pick if you want one light that handles key, accent, and color work." },
      { type: "heading", text: "Key Takeaway" },
      { type: "paragraph", text: "There's no single \"best\" light, only the best one for the job in front of you. If you're just starting out, a 150W daylight COB like the Prolite PL-150W or K&F ST-150W will carry most talking-head and product shoots. As your work grows into interviews, brand sets, and creative pieces, step up into bi-color or RGBWW options like the Amaran 200x S, COLBOR CL220/CL220 R, or Neewer CB200C/CB300C for more control over mood and color. Pick the wattage and color system that match your space, your subjects, and the look you want, then invest in modifiers and learn to shape that light. Good lighting is less about owning every fixture, and more about mastering the few you choose." },
    ],
  },
];

export const getArticleBySlug = (slug: string) =>
  [
    ...articles,
    fixDarkVideosArticle,
    differentTypesArticle,
    talkingHead1LightArticle,
    whatIsWattageArticle,
  ].find((a) => a.slug === slug);

export const fixDarkVideosArticle: Article = {
  slug: "why-your-videos-look-dark-and-how-to-fix-it",
  title: "Why Your Videos Look Dark (And How to Fix It)",
  date: "May 21, 2026",
  tags: ["Problem Solving"],
  image: fixDarkVideosThumb.url,
  authors: [{ name: "Favour Agbogun" }],
  content: [],
};

export const differentTypesArticle: Article = {
  slug: "different-types-of-lights-and-their-usage-for-beginners",
  title: "Different Types of Lights and their usage: For Beginners",
  date: "Feb 4, 2026",
  tags: ["Beginner"],
  image: lightingEquipmentOptions,
  authors: [{ name: "Favour Agbogun" }],
  content: [],
};

export const talkingHead1LightArticle: Article = {
  slug: "how-to-light-a-talking-head-video-with-1-single-light",
  title: "How to light a talking head video with 1 Single Light",
  date: "Feb 4, 2026",
  tags: ["Beginner"],
  image: lightingEquipmentOptions,
  hideCover: true,
  authors: [{ name: "Adeyinka Ibidapo", avatar: authorAdeyinka }],
  content: [
    { type: "paragraph", text: "Many creators believe they need multiple lights before they can create professional-looking videos.\nThe truth is that some of the best talking-head videos can be created with just one light.\nBefore investing in more equipment, learn how to get the most from a single light source. Mastering one light will teach you the foundations of lighting faster than owning five lights you don't know how to use.\nHere are two beginner-friendly setups that work almost every time." },
    {
      type: "setup",
      number: 1,
      title: "Loop Lighting",
      intro: "One of the easiest and most natural-looking lighting setups for talking-head videos.",
      equipment: [
        "1 COB Light (150W – 400W)",
        "1 Light Stand or C-Stand",
        "1 Softbox (Parabolic Softbox or Octabox)",
        "Phone or Camera",
        "Tripod or Phone Stand",
        "Microphone",
        "A clean and attractive background",
      ],
      diagramSrc: loopLightingDiagram,
      diagramAlt: "Top-down diagram showing loop lighting setup: subject facing camera with softbox-modified COB light placed at the 2 o'clock position about 30° off-axis",
    },
    { type: "paragraph", text: "Bonus Tip: Indoor plants, bookshelves, artwork, or simple room decor can instantly improve your background." },
    { type: "heading", text: "How to Set It Up" },
    { type: "paragraph", text: "1. Place your camera directly in front of you at eye level.\n2. Attach your COB light to your softbox.\n3. Mount the light on a light stand or C-stand.\n4. Position the light slightly to the left or right of the camera.\nThink of it this way:\nLeft side = 10 o'clock position\nRight side = 2 o'clock position\nThe light should be slightly above eye level and angled down toward your face." },
    { type: "heading", text: "Why It Works" },
    { type: "paragraph", text: "This setup lights most of your face while still creating a little shadow on one side.\nThe result is:\nA professional look\nGood facial definition\nBoth eyes remain clearly visible\nNatural depth and contrast" },
    { type: "heading", text: "Tips for Better Results" },
    { type: "paragraph", text: "Use larger softboxes such as 90cm or 120cm models.\nMove away from the background if possible.\nAdjust the distance of the light until the brightness looks comfortable.\nThe closer the softbox is to you, the softer and more flattering the light becomes." },
    {
      type: "setup",
      number: 2,
      title: "Butterfly Lighting",
      intro: "Another excellent one-light setup, especially for creators who want a clean and polished look.",
      equipment: [
        "1 COB Light (150W – 400W)",
        "1 C-Stand",
        "1 Softbox (Parabolic Softbox or Octabox)",
        "Phone or Camera",
        "Tripod or Phone Stand",
        "Microphone",
        "A clean and attractive background",
      ],
      diagramSrc: butterflyLightingDiagram,
      diagramAlt: "Side-view diagram showing butterfly lighting setup: subject facing camera with softbox-modified COB light mounted on a C-stand directly above and slightly in front of the camera, tilted down at 45°",
    },
    { type: "heading", text: "How to Set It Up" },
    { type: "paragraph", text: "Position your camera directly in front of you at eye level.\nMount your light on a C-stand.\nPlace the light directly behind or slightly above the camera.\nRaise the light above your eye level.\nTilt the softbox downward at approximately 45 degrees.\nThink of the light as sitting at your 12 o'clock position, directly in front of you." },
    { type: "heading", text: "Why It Works" },
    { type: "paragraph", text: "Because the light comes from above and in front of your face, it creates a soft shadow beneath the nose.\nThis setup:\nReduces dark shadows around the eyes\nCreates a clean and flattering look\nProduces even lighting across the face\nWorks well for educational videos, podcasts, interviews, and YouTube content" },
    { type: "heading", text: "Tips for Better Results" },
    { type: "paragraph", text: "Use larger softboxes such as 90cm or 120cm.\nCreate distance between yourself and the background.\nA C-stand gives you more positioning options than a regular light stand.\nLower the brightness if the light feels too harsh." },
    { type: "heading", text: "The Biggest Lesson" },
    { type: "paragraph", text: "If you can create great videos with one light, you'll find it much easier to use two, three, or even ten lights later.\nMany creators own multiple lights but struggle to make their videos look good because they never mastered the fundamentals.\nStart with one light.\nLearn how light direction affects the face.\nLearn how distance changes softness.\nLearn how brightness affects mood.\nMastering a single light is the foundation of every professional lighting setup you'll ever create.\nAnd once you understand one light, everything else becomes easier." },
  ],
};

export const whatIsWattageArticle: Article = {
  slug: "what-is-wattage-in-lighting",
  title: "What is Wattage in Lighting?",
  date: "April 25, 2026",
  tags: ["Beginner"],
  image: whatIsWattageThumb.url,
  authors: [{ name: "Adeyinka Ibidapo", avatar: authorAdeyinkaNew }],
  content: [
    { type: "paragraph", text: "One of the first terms you'll hear when learning about video lighting is wattage.\nSimply put, wattage refers to how much electrical power a light uses to produce light output.\nThe higher the wattage of a light, the more power it can draw and, in most cases, the more light it can produce.\nEvery lighting fixture has a wattage rating. You can usually find it:\nOn the product body\nIn the user manual\nOn the product packaging\nOr directly in the product name" },
    { type: "paragraph", text: "For many modern lighting brands such as Amaran and Aputure, the wattage is often part of the product's name." },
    { type: "paragraph", text: "For example:\nAmaran 300C = Up to 300 Watts\nAputure 600D = Up to 600 Watts\nAputure XT26 = Up to 2,600 Watts\nUnderstanding the number in the name helps you quickly know how powerful the light can be." },
    { type: "heading", text: "Understanding Wattage and Dimming" },
    { type: "paragraph", text: "Knowing the wattage of a light is only the beginning.\nOn set, you rarely use a light at full power all the time. Most lights have a dimmer that allows you to control their brightness.\nLet's say you're filming a podcast and using an Aputure 600D inside a lantern softbox.\nIf the light is set to 100% brightness, you're using the full 600 Watts of available output.\nBut what if the light looks too bright?\nYou can reduce the dimmer." },
    { type: "paragraph", text: "For example:\n100% Brightness = 600 Watts\n80% Brightness = 480 Watts\n60% Brightness = 360 Watts\n50% Brightness = 300 Watts\nThis means that when you lower the dimmer, you're also reducing the amount of light being produced." },
    { type: "heading", text: "Understanding Multiple Lights" },
    { type: "paragraph", text: "Let's imagine you have 10 Aputure 300D lights on a set.\nEach light can produce up to 300 Watts.\nIf all 10 lights are set to 50% brightness, each light is producing approximately 150 Watts.\nThat means:\n150 Watts × 10 Lights = 1,500 Watts of total light output\nUnderstanding this helps you estimate how much lighting power is being used across your entire setup." },
    { type: "heading", text: "A Lighting Tip Most Beginners Don't Hear" },
    { type: "paragraph", text: "When possible, it is usually better to have more lighting power available than less.\nImagine you know you'll need around 400 Watts of light for a shoot." },
    { type: "paragraph", text: "You have two options:\nOption A\nTwo 200-Watt COB lights\nOption B\nTwo 300-Watt COB lights\nOption B gives you more flexibility.\nEven if you only use 400 Watts total, you'll still have extra power available if:\nThe room is larger than expected\nYour softbox absorbs more light\nYou move the light farther away\nYou need additional brightness later\nThink of it like having a larger fuel tank in a car. You may not need all of it today, but you'll appreciate having the extra capacity when the situation changes." },
    { type: "heading", text: "Final Thoughts" },
    { type: "paragraph", text: "Wattage tells you how much power a light can use and gives you an idea of how powerful that light can be.\nAs a beginner, remember these three things:\nHigher wattage usually means more available light.\nThe dimmer controls how much of that power you're actually using.\nHaving extra lighting power available is usually better than not having enough.\nUnderstanding wattage is one of the foundations of lighting, and once you grasp it, choosing lights and planning your shoots becomes much easier." },
  ],
};