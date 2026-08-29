import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Eye, Loader2, RefreshCw, Search, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABEL, type PostStatus } from "@/lib/contributor";
import { matchesSearch } from "@/lib/searchMatch";

type Row = {
  id: string;
  author_id: string;
  kind: "article" | "course";
  slug: string | null;
  title: string;
  cover_image_url: string | null;
  tags: string[];
  status: PostStatus;
  review_note: string | null;
  view_count: number;
  published_at: string | null;
  updated_at: string;
};

const STATUSES: (PostStatus | "all")[] = ["all", "in_review", "published", "needs_revision", "draft"];

const statusStyle = (s: PostStatus) =>
  s === "published"
    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    : s === "in_review"
      ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
      : s === "needs_revision"
        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
        : "bg-foreground/10 text-foreground/60 border-foreground/20";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);

const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const ContributorContentSection = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<PostStatus | "all">("in_review");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contributor_posts")
      .select(
        "id, author_id, kind, slug, title, cover_image_url, tags, status, review_note, view_count, published_at, updated_at",
      )
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    const list = (data as Row[]) ?? [];
    setRows(list);

    const ids = [...new Set(list.map((r) => r.author_id))];
    if (ids.length) {
      const { data: profs } = await supabase
        .from("contributor_profiles")
        .select("user_id, display_name, email")
        .in("user_id", ids);
      const map: Record<string, string> = {};
      (profs ?? []).forEach((p) => {
        map[p.user_id] = p.display_name || p.email || "Contributor";
      });
      setAuthors(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () =>
      rows.filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (!q.trim() ||
            matchesSearch([r.title, authors[r.author_id] ?? "", ...r.tags].join(" "), q)),
      ),
    [rows, status, q, authors],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    rows.forEach((r) => (c[r.status] = (c[r.status] ?? 0) + 1));
    return c;
  }, [rows]);

  const publish = async (row: Row) => {
    setBusy(row.id);
    const slug = row.slug || `${slugify(row.title)}-${row.id.slice(0, 6)}`;
    const { error } = await supabase
      .from("contributor_posts")
      .update({
        status: "published",
        slug,
        review_note: null,
        published_at: row.published_at ?? new Date().toISOString(),
      })
      .eq("id", row.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Published — the contributor has been notified.");
    void load();
  };

  const requestRevision = async (row: Row) => {
    if (!note.trim()) return toast.error("Add a short note so the contributor knows what to change.");
    setBusy(row.id);
    const { error } = await supabase
      .from("contributor_posts")
      .update({ status: "needs_revision", review_note: note.trim() })
      .eq("id", row.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    setNoteFor(null);
    setNote("");
    toast.success("Revision requested.");
    void load();
  };

  const unpublish = async (row: Row) => {
    setBusy(row.id);
    const { error } = await supabase
      .from("contributor_posts")
      .update({ status: "in_review" })
      .eq("id", row.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Moved back to review.");
    void load();
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Contributor submissions</h2>
          <p className="text-sm text-foreground/55">
            Articles and courses sent in by contributors. {counts.in_review ?? 0} awaiting review ·{" "}
            {counts.published ?? 0} live.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </header>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, contributor or tag"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as PostStatus | "all")}>
          <SelectTrigger className="w-[190px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : STATUS_LABEL[s as PostStatus]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="py-16 grid place-items-center">
          <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
        </div>
      ) : visible.length === 0 ? (
        <p className="text-sm text-foreground/55 py-10">Nothing here yet.</p>
      ) : (
        <div className="grid gap-4">
          {visible.map((r) => (
            <article
              key={r.id}
              className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="sm:w-40 aspect-video rounded-lg overflow-hidden bg-foreground/5 shrink-0">
                {r.cover_image_url ? (
                  <img src={r.cover_image_url} alt={r.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full grid place-items-center text-[11px] text-foreground/40">
                    No cover
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full border text-[11px] ${statusStyle(r.status)}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.15em] text-foreground/45">{r.kind}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-foreground/55">
                    <Eye className="w-3.5 h-3.5" />
                    {r.view_count}
                  </span>
                </div>
                <h3 className="font-medium leading-snug truncate">{r.title}</h3>
                <p className="text-xs text-foreground/55">
                  {authors[r.author_id] ?? "Contributor"} · updated {when(r.updated_at)}
                </p>
                {r.tags.length > 0 && (
                  <p className="text-xs text-foreground/45 truncate">{r.tags.join(" · ")}</p>
                )}
                {r.review_note && (
                  <p className="text-xs text-amber-400/90">Note to contributor: {r.review_note}</p>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {r.status !== "published" && (
                    <Button size="sm" disabled={busy === r.id} onClick={() => publish(r)}>
                      {busy === r.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Publish
                        </>
                      )}
                    </Button>
                  )}
                  {r.status === "published" ? (
                    <>
                      {r.slug && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/articles/${r.slug}`} target="_blank" rel="noreferrer">
                            View live <ExternalLink className="w-3.5 h-3.5 ml-2" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" disabled={busy === r.id} onClick={() => unpublish(r)}>
                        <Undo2 className="w-4 h-4 mr-2" />
                        Unpublish
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNoteFor(noteFor === r.id ? null : r.id);
                        setNote(r.review_note ?? "");
                      }}
                    >
                      Request revision
                    </Button>
                  )}
                </div>

                {noteFor === r.id && (
                  <div className="pt-2 space-y-2">
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What should the contributor change?"
                      rows={3}
                    />
                    <Button size="sm" disabled={busy === r.id} onClick={() => requestRevision(r)}>
                      Send note
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ContributorContentSection;
