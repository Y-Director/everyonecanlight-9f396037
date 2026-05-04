import thumb from "@/assets/article-thumb.png";
import softboxVsUmbrella from "@/assets/softbox-vs-umbrella.png";
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

export type ArticleContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string };

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
  authors: Author[];
  content: ArticleContentBlock[];
};

export const articles: Article[] = [
  {
    slug: "softbox-vs-umbrella-which-should-i-buy-first",
    title: "Softbox vs Umbrella: Which should I buy first?",
    date: "May 9, 2026",
    tags: ["Comparison"],
    image: softboxVsUmbrella,
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
        text: "A \"Key Light\" which is main source to illuminate your face and body, and then \"Back Light\" which works as the light to either light your wall background or light your back and this technique is called a 2-point Lighting setup.",
      },
      { type: "heading", text: "Here is All You Need" },
      {
        type: "paragraph",
        text: "The full write-up is on its way. Check back shortly for the complete walkthrough.",
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
  articles.find((a) => a.slug === slug);