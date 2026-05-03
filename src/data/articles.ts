import thumb from "@/assets/article-thumb.png";
import softboxVsUmbrella from "@/assets/softbox-vs-umbrella.png";
import bestLights2026 from "@/assets/best-lights-2026.png";
import authorFavour from "@/assets/author-favour.jpg";
import authorAdeyinka from "@/assets/author-adeyinka.jpg";
import authorAdeyinkaNew from "@/assets/author-adeyinka-new.jpg";

export type ArticleContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string };

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
    date: "May 30, 2026",
    tags: ["Comparison", "How-to"],
    image: thumb,
    authors: [{ name: "Favour Agbogun", avatar: authorFavour }],
    content: [
      {
        type: "paragraph",
        text: "Lighting a small room for video doesn't require a truckload of gear. With just two lights, thoughtful placement, and a little diffusion, you can craft a clean, professional look.",
      },
      { type: "heading", text: "Coming soon" },
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
        text: "The full write-up is on its way. Check back shortly for the complete walkthrough.",
      },
    ],
  },
];

export const getArticleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);