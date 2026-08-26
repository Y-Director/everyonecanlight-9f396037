import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ImagePlus,
  Loader2,
  Move,
  Trash2,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useContributorNotifications,
  useContributorProfile,
  useContributorSession,
} from "@/hooks/useContributor";
import ContributorTopBar from "@/components/contributors/ContributorTopBar";
import {
  ARTICLE_TAGS,
  STATUS_LABEL,
  newBlockId,
  slugify,
  uploadContributorMedia,
  type ContributorPost,
  type PostBlock,
  type PostStatus,
} from "@/lib/contributor";
import { Button } from "@/components/ui/button";

type TextKind = "title" | "subtitle" | "body";

const textStyles: Record<TextKind, string> = {
  title: "text-2xl md:text-3xl font-semibold tracking-tight",
  subtitle: "text-lg md:text-xl font-medium",
  body: "text-sm md:text-base leading-relaxed",
};

const placeholders: Record<TextKind, string> = {
  title: "Section title",
  subtitle: "Subtitle",
  body: "Write your paragraph…",
};

const AutoTextarea = ({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-transparent outline-none resize-none placeholder:text-[hsl(var(--page-light-foreground))]/35 ${className ?? ""}`}
    />
  );
};

const ContributorEditor = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useContributorSession();
  const { profile, setProfile } = useContributorProfile(user?.id, user?.email);
  const { notifications, unreadCount, markAllRead } = useContributorNotifications(user?.id);

  const [post, setPost] = useState<ContributorPost | null>(null);
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<PostBlock[]>([]);
  const [moveMode, setMoveMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const blockImageRef = useRef<HTMLInputElement>(null);
  const dirty = useRef(false);

  useEffect(() => {
    if (!loading && !user) navigate("/contributors/auth", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user || !id) return;
    void (async () => {
      const { data, error } = await supabase
        .from("contributor_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        toast.error("We couldn't open that item.");
        navigate("/contributors", { replace: true });
        return;
      }
      const p = data as unknown as ContributorPost;
      setPost(p);
      setTitle(p.title === "Untitled article" || p.title === "Untitled course" ? "" : p.title);
      setCover(p.cover_image_url);
      setTags(p.tags ?? []);
      setBlocks(Array.isArray(p.blocks) ? p.blocks : []);
    })();
  }, [user, id, navigate]);

  const status: PostStatus = post?.status ?? "draft";
  const locked = status === "in_review" || status === "published";

  const save = useCallback(
    async (extra?: Partial<ContributorPost>) => {
      if (!post) return null;
      setSaving(true);
      const payload = {
        title: title.trim() || (post.kind === "article" ? "Untitled article" : "Untitled course"),
        cover_image_url: cover,
        tags,
        blocks: blocks as unknown as never,
        ...extra,
      };
      const { data, error } = await supabase
        .from("contributor_posts")
        .update(payload)
        .eq("id", post.id)
        .select("*")
        .maybeSingle();
      setSaving(false);
      if (error) {
        toast.error(error.message);
        return null;
      }
      dirty.current = false;
      setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      if (data) setPost(data as unknown as ContributorPost);
      return data as unknown as ContributorPost;
    },
    [post, title, cover, tags, blocks],
  );

  // Autosave drafts
  useEffect(() => {
    if (!post || locked) return;
    if (!dirty.current) return;
    const t = setTimeout(() => void save(), 1500);
    return () => clearTimeout(t);
  }, [post, locked, save, title, cover, tags, blocks]);

  const mark = () => {
    dirty.current = true;
  };

  const addText = (kind: TextKind = "body") => {
    mark();
    setBlocks((b) => [...b, { id: newBlockId(), type: kind, text: "" }]);
  };

  const addImage = async (file?: File | null) => {
    if (!file || !user) return;
    try {
      const src = await uploadContributorMedia(user.id, file);
      mark();
      setBlocks((b) => [...b, { id: newBlockId(), type: "image", src, alt: "" }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  };

  const onCover = async (file?: File | null) => {
    if (!file || !user) return;
    try {
      const url = await uploadContributorMedia(user.id, file);
      mark();
      setCover(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= blocks.length) return;
    mark();
    setBlocks((b) => {
      const copy = [...b];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  const removeBlock = (blockId: string) => {
    mark();
    setBlocks((b) => b.filter((x) => x.id !== blockId));
  };

  const toggleTag = (tag: string) => {
    mark();
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));
  };

  const canPublish = useMemo(
    () => Boolean(title.trim() && cover && tags.length && blocks.some((b) => b.type !== "image")),
    [title, cover, tags, blocks],
  );

  const publishForReview = async () => {
    if (!post) return;
    if (!canPublish) {
      toast.error("Add a title, cover image, at least one tag and some body text first.");
      return;
    }
    setPublishing(true);
    const result = await save({
      status: "in_review",
      slug: post.slug ?? slugify(title),
      review_note: null,
    });
    setPublishing(false);
    if (result) toast.success("Sent for review. We'll notify you when an editor responds.");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--page-light))] text-[hsl(var(--page-light-foreground))] pb-40">
      <ContributorTopBar
        profile={profile}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
        onProfileUpdated={(avatar_url) => setProfile((p) => (p ? { ...p, avatar_url } : p))}
        action={
          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden sm:inline text-[11px] text-[hsl(var(--page-light-foreground))]/50">
              {saving ? "Saving…" : savedAt ? `Saved ${savedAt}` : STATUS_LABEL[status]}
            </span>
            <Button
              type="button"
              onClick={publishForReview}
              disabled={publishing || locked}
              className="rounded-full h-9 px-4 text-xs"
            >
              {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : locked ? STATUS_LABEL[status] : "Publish for Review"}
            </Button>
          </div>
        }
      />

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <button
          type="button"
          onClick={() => navigate("/contributors")}
          className="inline-flex items-center gap-2 text-xs text-[hsl(var(--page-light-foreground))]/60 hover:text-[hsl(var(--page-light-foreground))] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </button>

        {status === "needs_revision" && post?.review_note && (
          <div className="mt-6 rounded-2xl border border-[hsl(var(--cta))]/30 bg-[hsl(var(--card-sky))] p-4 text-sm">
            <p className="font-medium">An editor requested changes</p>
            <p className="mt-1 text-[hsl(var(--page-light-foreground))]/75">{post.review_note}</p>
          </div>
        )}

        {/* Cover */}
        <button
          type="button"
          onClick={() => coverRef.current?.click()}
          className="mt-6 w-full aspect-[2/1] rounded-2xl overflow-hidden border border-dashed border-[hsl(var(--page-light-foreground))]/20 bg-[hsl(var(--page-light-foreground))]/[0.03] grid place-items-center"
        >
          {cover ? (
            <img src={cover} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-2 text-sm text-[hsl(var(--page-light-foreground))]/50">
              <ImagePlus className="w-5 h-5" />
              Add a cover image
            </span>
          )}
        </button>
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onCover(e.target.files?.[0])}
        />

        {/* Title */}
        <div className="mt-8">
          <AutoTextarea
            value={title}
            onChange={(v) => {
              mark();
              setTitle(v);
            }}
            placeholder={post?.kind === "course" ? "Course title" : "Article title"}
            className="text-3xl md:text-4xl font-medium tracking-tight leading-tight"
          />
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {ARTICLE_TAGS.map((tag) => {
            const on = tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs border transition ${
                  on
                    ? "bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] border-transparent"
                    : "border-[hsl(var(--page-light-foreground))]/15 text-[hsl(var(--page-light-foreground))]/70 hover:bg-[hsl(var(--page-light-foreground))]/5"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="my-8 h-px bg-[hsl(var(--page-light-foreground))]/10" />

        {/* Blocks */}
        <div className="space-y-5">
          {blocks.map((block, i) => (
            <div key={block.id} className="group relative rounded-xl -mx-3 px-3 py-2 hover:bg-[hsl(var(--page-light-foreground))]/[0.03]">
              {block.type === "image" ? (
                <figure className="space-y-2">
                  <div className="rounded-xl overflow-hidden bg-[hsl(var(--page-light-foreground))]/5">
                    <img src={block.src} alt={block.alt} className="w-full h-auto object-contain" />
                  </div>
                  <input
                    value={block.alt}
                    placeholder="Describe this image (used for accessibility)"
                    onChange={(e) => {
                      mark();
                      setBlocks((b) =>
                        b.map((x) => (x.id === block.id ? { ...x, alt: e.target.value } : x)),
                      );
                    }}
                    className="w-full bg-transparent outline-none text-xs text-[hsl(var(--page-light-foreground))]/60"
                  />
                </figure>
              ) : (
                <div className="flex items-start gap-3">
                  <select
                    value={block.type}
                    onChange={(e) => {
                      mark();
                      const type = e.target.value as TextKind;
                      setBlocks((b) => b.map((x) => (x.id === block.id ? { ...x, type } : x)));
                    }}
                    className="mt-1 shrink-0 rounded-md bg-transparent border border-[hsl(var(--page-light-foreground))]/15 text-[11px] px-1.5 py-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                    aria-label="Text size"
                  >
                    <option value="title">Title</option>
                    <option value="subtitle">Subtitle</option>
                    <option value="body">Body</option>
                  </select>
                  <AutoTextarea
                    value={block.text}
                    placeholder={placeholders[block.type]}
                    onChange={(v) => {
                      mark();
                      setBlocks((b) => b.map((x) => (x.id === block.id ? { ...x, text: v } : x)));
                    }}
                    className={textStyles[block.type]}
                  />
                </div>
              )}

              <div
                className={`absolute right-1 top-1 flex items-center gap-1 transition ${
                  moveMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {moveMode && (
                  <>
                    <button
                      type="button"
                      aria-label="Move up"
                      onClick={() => move(i, -1)}
                      className="w-7 h-7 rounded-full grid place-items-center bg-[hsl(var(--card-sky))]"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      onClick={() => move(i, 1)}
                      className="w-7 h-7 rounded-full grid place-items-center bg-[hsl(var(--card-sky))]"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  aria-label="Delete block"
                  onClick={() => removeBlock(block.id)}
                  className="w-7 h-7 rounded-full grid place-items-center bg-[hsl(var(--page-light-foreground))]/8 hover:bg-[hsl(var(--page-light-foreground))]/15"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {blocks.length === 0 && (
            <p className="text-sm text-[hsl(var(--page-light-foreground))]/50">
              Use the toolbar below to add text and images.
            </p>
          )}
        </div>
      </main>

      {/* Floating tool group — lower third */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-[12vh] z-40">
        <div className="flex items-center gap-1 p-1.5 rounded-full border border-[hsl(var(--page-light-foreground))]/10 bg-[hsl(var(--page-light))]/95 backdrop-blur shadow-xl">
          <button
            type="button"
            onClick={() => addText("body")}
            title="Add text"
            className="w-11 h-11 rounded-full grid place-items-center hover:bg-[hsl(var(--card-sky))] transition"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMoveMode((v) => !v)}
            title="Reorder blocks"
            className={`w-11 h-11 rounded-full grid place-items-center transition ${
              moveMode ? "bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))]" : "hover:bg-[hsl(var(--card-sky))]"
            }`}
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => blockImageRef.current?.click()}
            title="Add image"
            className="w-11 h-11 rounded-full grid place-items-center hover:bg-[hsl(var(--card-sky))] transition"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <input
        ref={blockImageRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => addImage(e.target.files?.[0])}
      />
    </div>
  );
};

export default ContributorEditor;
