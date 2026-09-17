import standoutPoster from "@/assets/courses/standout-from-background.png.asset.json";
import lightingPlacementPoster from "@/assets/courses/lighting-placement-mistakes.png.asset.json";

export type CourseVideo = {
  slug: string;
  title: string;
  /** Small meta line above the title, e.g. ["Quick Tips", "Shorts"] */
  tags: string[];
  description: string;
  access: "free" | "paid";
  /** Cloudflare Stream video UID (preferred) */
  streamId?: string;
  /** Or a direct HLS / MP4 URL from Bunny or another streaming host */
  playbackUrl?: string;
  /** Thumbnail; falls back to the courses hero image */
  poster?: string;
  duration?: string;
};

/**
 * Cloudflare Stream customer code.
 */
export const STREAM_CUSTOMER_CODE = "customer-0gep1ju9p1n67x4b";

export const streamIframeSrc = (streamId: string) =>
  `https://${STREAM_CUSTOMER_CODE}.cloudflarestream.com/${streamId}/iframe?preload=metadata&letterboxColor=transparent`;

export const streamPoster = (streamId: string) =>
  `https://${STREAM_CUSTOMER_CODE}.cloudflarestream.com/${streamId}/thumbnails/thumbnail.jpg?time=2s&height=600`;

export const courseVideos: CourseVideo[] = [
  {
    slug: "how-to-stand-out-from-background",
    title: "How to stand out from your background",
    tags: ["Quick Tips", "Shorts"],
    description:
      "A short, practical lesson on separating your subject from the background using light placement, distance and contrast.",
    access: "free",
    streamId: "4150e4ceec001826cf14f18fdf1726a2",
    poster: standoutPoster.url,
    duration: "Short",
  },
  {
    slug: "lighting-placement-mistakes-to-avoid",
    title: "Lighting placement mistakes to avoid",
    tags: ["Quick Tips", "Shorts"],
    description:
      "Learn the common light-placement mistakes that flatten a subject or create distracting shadows, and how to correct them.",
    access: "free",
    streamId: "bc65715ce3680a8778b18ffe6c52a05e",
    poster: lightingPlacementPoster.url,
    duration: "Short",
  },
];

export const posterFor = (v: CourseVideo) =>
  v.poster ?? (v.streamId ? streamPoster(v.streamId) : "");

export const findCourseVideo = (slug: string) =>
  courseVideos.find((v) => v.slug === slug);
