import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Plus, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useContributorNotifications,
  useContributorProfile,
  useContributorSession,
} from "@/hooks/useContributor";
import ContributorTopBar from "@/components/contributors/ContributorTopBar";
import { STATUS_LABEL, type ContributorPost, type PostStatus } from "@/lib/contributor";
import Seo from "@/components/Seo";

const statusTint: Record<PostStatus, string> = {
  draft: "bg-[hsl(var(--page-light-foreground))]/8 text-[hsl(var(--page-light-foreground))]/70",
  in_review: "bg-[hsl(var(--card-sky))] text-[hsl(var(--page-light-foreground))]",
  published: "bg-[hsl(var(--card-mint))] text-[hsl(var(--page-light-foreground))]",
  needs_revision: "bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))]",
};

const ContributorDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useContributorSession();
  const { profile, setProfile } = useContributorProfile(user?.id, user?.email);
  const { notifications, unreadCount, markAllRead } = useContributorNotifications(user?.id);
  const [posts, setPosts] = useState<ContributorPost[]>([]);
  const [creating, setCreating] = useState<null | "article" | "course">(null);

  useEffect(() => {
    if (!loading && !user) navigate("/contributors/auth", { replace: true });
  }, [loading, user, navigate]);

  const loadPosts = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("contributor_posts")
      .select("*")
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false });
    setPosts((data as unknown as ContributorPost[]) ?? []);
  }, [user]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const create = async (kind: "article" | "course") => {
    if (!user) return;
    setCreating(kind);
    const { data, error } = await supabase
      .from("contributor_posts")
      .insert({
        author_id: user.id,
        kind,
        title: kind === "article" ? "Untitled article" : "Untitled course",
        blocks: [],
        tags: [],
        status: "draft",
      })
      .select("id")
      .maybeSingle();
    setCreating(null);
    if (error || !data) return toast.error(error?.message ?? "Could not create");
    navigate(`/contributors/editor/${data.id}`);
  };

  return (
    <div className="contributor-shell min-h-screen bg-[hsl(var(--page-light))] text-[hsl(var(--page-light-foreground))]">
      <Seo
        title="Contributor dashboard — Everyone Can Light"
        description="Create articles and courses and track how many people are reading your work."
        path="/contributors"
      />
      <ContributorTopBar
        profile={profile}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
        onProfileUpdated={(patch) => setProfile((p) => (p ? { ...p, ...patch } : p))}
      />

      <main className="max-w-[1200px] mx-auto px-5 md:px-8 py-10 md:py-14">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight">
            Hello {profile?.display_name ?? "creator"}
          </h1>
          <p className="mt-2 text-sm text-[hsl(var(--page-light-foreground))]/60">
            Start something new, or pick up where you left off.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl">
          {(["article", "course"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => create(kind)}
              disabled={creating !== null}
              className="group aspect-video rounded-2xl border border-dashed border-[hsl(var(--page-light-foreground))]/20 bg-[hsl(var(--page-light-foreground))]/[0.03] hover:bg-[hsl(var(--card-sky))]/60 transition flex flex-col items-center justify-center gap-3 disabled:opacity-60"
            >
              <span className="w-12 h-12 rounded-full grid place-items-center bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))]">
                {creating === kind ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              </span>
              <span className="text-sm font-medium capitalize">New {kind}</span>
            </button>
          ))}
        </div>

        <div className="my-10 md:my-14 h-px bg-[hsl(var(--page-light-foreground))]/10" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Your work</h2>
          <span className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--page-light-foreground))]/50">
            {posts.length} item{posts.length === 1 ? "" : "s"}
          </span>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-[hsl(var(--page-light-foreground))]/60">
            Nothing here yet. Create your first article above.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article key={p.id} className="group space-y-3">
                <Link
                  to={`/contributors/editor/${p.id}`}
                  className="block rounded-xl overflow-hidden aspect-video bg-[hsl(var(--page-light-foreground))]/5"
                >
                  {p.cover_image_url ? (
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <span className="w-full h-full grid place-items-center text-xs text-[hsl(var(--page-light-foreground))]/40">
                      No cover image
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusTint[p.status]}`}>
                    {STATUS_LABEL[p.status]}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[hsl(var(--page-light-foreground))]/45">
                    {p.kind}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-[hsl(var(--page-light-foreground))]/60">
                    <Eye className="w-3.5 h-3.5" />
                    {p.view_count}
                  </span>
                </div>
                <h3 className="text-base font-medium leading-snug">
                  <Link to={`/contributors/editor/${p.id}`}>{p.title}</Link>
                </h3>
                {p.status === "published" && p.slug && (
                  <a
                    href={
                      typeof window !== "undefined" && window.location.hostname.startsWith("contributors.")
                        ? `${window.location.protocol}//${window.location.hostname.replace(/^contributors\./, "")}/articles/${p.slug}`
                        : `/articles/${p.slug}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs underline underline-offset-4 decoration-2 decoration-[hsl(var(--cta))]"
                  >
                    View live <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {p.status === "needs_revision" && p.review_note && (
                  <p className="text-xs text-[hsl(var(--page-light-foreground))]/70">{p.review_note}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ContributorDashboard;
