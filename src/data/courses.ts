import coursesHero from "@/assets/courses-hero.png";

export type CourseVideo = {
  slug: string;
  title: string;
  /** Small meta line above the title, e.g. ["Quick Tips", "Shorts"] */
  tags: string[];
  /** Grouping shown as the section on the Courses page */
  category: string;
  description: string;
  /** Cloudflare Stream video UID (preferred) */
  streamId?: string;
  /** Or a direct HLS / MP4 URL from Bunny or another streaming host */
  playbackUrl?: string;
  /** Thumbnail; falls back to the courses hero image */
  poster?: string;
  duration?: string;
};

/**
 * Cloudflare Stream customer subdomain, e.g. "customer-abc123".
 * Set VITE_STREAM_CUSTOMER_CODE in the environment once the Stream account exists.
 */
export const STREAM_CUSTOMER_CODE =
  (import.meta.env.VITE_STREAM_CUSTOMER_CODE as string | undefined) ?? "";

export const streamIframeSrc = (streamId: string) =>
  `https://${STREAM_CUSTOMER_CODE || "customer-placeholder"}.cloudflarestream.com/${streamId}/iframe?preload=metadata&letterboxColor=transparent`;

export const streamPoster = (streamId: string) =>
  `https://${STREAM_CUSTOMER_CODE || "customer-placeholder"}.cloudflarestream.com/${streamId}/thumbnails/thumbnail.jpg?time=2s&height=600`;

export const courseVideos: CourseVideo[] = [
  {
    slug: "how-to-stand-out-from-background",
    title: "How to Stand out from Background",
    tags: ["Quick Tips", "Shorts"],
    category: "Free Resource",
    description:
      "A short, practical lesson on separating your subject from the background using light placement, distance and contrast.",
    duration: "Short",
  },
];

export const courseCategories = (videos: CourseVideo[]) =>
  Array.from(new Set(videos.map((v) => v.category)));

export const posterFor = (v: CourseVideo) =>
  v.poster ?? (v.streamId ? streamPoster(v.streamId) : coursesHero);

export const findCourseVideo = (slug: string) =>
  courseVideos.find((v) => v.slug === slug);
