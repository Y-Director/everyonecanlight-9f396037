import { supabase } from "@/integrations/supabase/client";

export const ARTICLE_TAGS = [
  "Comparison",
  "Guides",
  "How-to",
  "Lighting News",
  "Beginner",
  "Advanced",
  "Setup",
  "Problem-Solving",
  "Gear",
  "Budget",
  "Studio Lighting",
  "Natural Light",
  "Indoor Lighting",
  "Outdoor Lighting",
  "Lighting Psychology",
  "Lighting technique",
  "Storytelling",
  "Brand Perception",
  "Case Study",
] as const;

export type PostBlock =
  | { id: string; type: "title" | "subtitle" | "body"; text: string }
  | { id: string; type: "image"; src: string; alt: string };

export type PostStatus = "draft" | "in_review" | "published" | "needs_revision";

export type ContributorPost = {
  id: string;
  author_id: string;
  kind: "article" | "course";
  slug: string | null;
  title: string;
  cover_image_url: string | null;
  tags: string[];
  blocks: PostBlock[];
  status: PostStatus;
  review_note: string | null;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_LABEL: Record<PostStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  published: "Published",
  needs_revision: "Needs review",
};

export const newBlockId = () =>
  `b_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || `post-${Date.now().toString(36)}`;

const BUCKET = "contributor-media";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads to the contributor media bucket and returns a long-lived readable URL. */
export const uploadContributorMedia = async (userId: string, file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data?.signedUrl) throw signError ?? new Error("Could not read uploaded file");
  return data.signedUrl;
};

export const plainTextExcerpt = (blocks: PostBlock[], length = 160) => {
  const body = blocks.find((b) => b.type === "body" && b.text.trim()) as
    | { text: string }
    | undefined;
  return (body?.text ?? "").slice(0, length).trim();
};

export type PublishedPost = {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  tags: string[];
  blocks: PostBlock[];
  kind: "article" | "course";
  view_count: number;
  published_at: string | null;
  author_id: string;
};

/** Published contributor posts, newest first. */
export const fetchPublishedPosts = async (kind: "article" | "course" = "article") => {
  const { data, error } = await supabase
    .from("contributor_posts")
    .select("id, slug, title, cover_image_url, tags, blocks, kind, view_count, published_at, author_id")
    .eq("status", "published")
    .eq("kind", kind)
    .order("published_at", { ascending: false });
  if (error) return [];
  return (data ?? []).filter((p) => p.slug) as unknown as PublishedPost[];
};

export const fetchPublishedPostBySlug = async (slug: string) => {
  const { data } = await supabase
    .from("contributor_posts")
    .select("id, slug, title, cover_image_url, tags, blocks, kind, view_count, published_at, author_id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as unknown as PublishedPost) ?? null;
};

export const fetchContributorAuthor = async (userId: string) => {
  const { data } = await supabase
    .from("contributor_profiles")
    .select("display_name, avatar_url")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as { display_name: string; avatar_url: string | null } | null) ?? null;
};

export const registerPostView = async (slug: string) => {
  await supabase.rpc("increment_post_view", { _slug: slug });
};

export const NAME_MIN = 3;

/**
 * Checks whether a contributor display name is free.
 * Returns true (available), false (taken) or null when the check couldn't run.
 */
export const checkDisplayNameAvailable = async (name: string, excludeUserId?: string) => {
  const trimmed = name.trim();
  if (trimmed.length < NAME_MIN) return null;
  let query = supabase
    .from("contributor_profiles")
    .select("user_id")
    .ilike("display_name", trimmed)
    .limit(1);
  if (excludeUserId) query = query.neq("user_id", excludeUserId);
  const { data, error } = await query;
  if (error) return null;
  return (data ?? []).length === 0;
};

export const updateContributorProfile = async (
  userId: string,
  patch: { display_name?: string; avatar_url?: string | null },
) => {
  const { error } = await supabase.from("contributor_profiles").update(patch).eq("user_id", userId);
  if (error) throw error;
};
