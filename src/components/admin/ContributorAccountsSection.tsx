import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Search, ShieldBan, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { matchesSearch } from "@/lib/searchMatch";

type Account = {
  user_id: string;
  display_name: string;
  email: string | null;
  avatar_url: string | null;
  status: string;
  suspended_at: string | null;
  suspension_reason: string | null;
  created_at: string;
};

const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const ContributorAccountsSection = () => {
  const [rows, setRows] = useState<Account[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [target, setTarget] = useState<Account | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contributor_profiles")
      .select("user_id, display_name, email, avatar_url, status, suspended_at, suspension_reason, created_at")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    const list = (data as Account[]) ?? [];
    setRows(list);

    const { data: posts } = await supabase.from("contributor_posts").select("author_id, status");
    const map: Record<string, number> = {};
    (posts ?? []).forEach((p) => {
      if (p.status === "published") map[p.author_id] = (map[p.author_id] ?? 0) + 1;
    });
    setCounts(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(
    () =>
      rows.filter((r) => !q.trim() || matchesSearch([r.display_name, r.email ?? ""].join(" "), q)),
    [rows, q],
  );

  const suspendedCount = rows.filter((r) => r.status === "suspended").length;

  const notify = async (row: Account, templateName: string, reasonText?: string) => {
    if (!row.email) return;
    await supabase.functions.invoke("notify-admins", {
      body: {
        category: "contributors",
        event: templateName === "contributor-suspended" ? "account_suspended" : "account_reinstated",
        title:
          templateName === "contributor-suspended"
            ? `Contributor suspended — ${row.display_name}`
            : `Contributor reinstated — ${row.display_name}`,
        summary: reasonText || null,
        severity: templateName === "contributor-suspended" ? "warning" : "info",
        entityType: "contributor_profile",
        entityId: row.user_id,
        customer: {
          email: row.email,
          templateName,
          idempotencyKey: `${templateName}-${row.user_id}-${Date.now()}`,
          templateData: { contributorName: row.display_name, reason: reasonText || null },
        },
      },
    });
  };

  const suspend = async () => {
    if (!target) return;
    setBusy(target.user_id);
    const { error } = await supabase
      .from("contributor_profiles")
      .update({
        status: "suspended",
        suspended_at: new Date().toISOString(),
        suspension_reason: reason.trim() || null,
      })
      .eq("user_id", target.user_id);
    if (error) {
      setBusy(null);
      return toast.error(error.message);
    }
    await notify(target, "contributor-suspended", reason.trim());
    setBusy(null);
    setTarget(null);
    setReason("");
    toast.success("Account suspended — the contributor has been emailed the appeal steps.");
    void load();
  };

  const reinstate = async (row: Account) => {
    setBusy(row.user_id);
    const { error } = await supabase
      .from("contributor_profiles")
      .update({ status: "active", suspended_at: null, suspension_reason: null })
      .eq("user_id", row.user_id);
    if (error) {
      setBusy(null);
      return toast.error(error.message);
    }
    await notify(row, "contributor-reinstated");
    setBusy(null);
    toast.success("Account is live again — the contributor has been notified.");
    void load();
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Contributor accounts</h2>
          <p className="text-sm text-foreground/55">
            {rows.length} account{rows.length === 1 ? "" : "s"} · {rows.length - suspendedCount} live ·{" "}
            {suspendedCount} suspended
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </header>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email"
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="py-16 grid place-items-center">
          <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
        </div>
      ) : visible.length === 0 ? (
        <p className="text-sm text-foreground/55 py-10 inline-flex items-center gap-2">
          <Users className="w-4 h-4" /> No contributor accounts yet.
        </p>
      ) : (
        <div className="grid gap-3">
          {visible.map((r) => (
            <article
              key={r.user_id}
              className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-4 flex flex-wrap items-center gap-4"
            >
              <span className="w-10 h-10 rounded-full overflow-hidden bg-foreground/10 shrink-0 grid place-items-center text-xs text-foreground/50">
                {r.avatar_url ? (
                  <img src={r.avatar_url} alt={r.display_name} className="w-full h-full object-cover" />
                ) : (
                  r.display_name.slice(0, 2).toUpperCase()
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{r.display_name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full border text-[11px] ${
                      r.status === "suspended"
                        ? "bg-red-500/15 text-red-400 border-red-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {r.status === "suspended" ? "Suspended" : "Live"}
                  </span>
                </div>
                <p className="text-xs text-foreground/55 truncate">
                  {r.email ?? "No email"} · joined {when(r.created_at)} · {counts[r.user_id] ?? 0} published
                </p>
                {r.status === "suspended" && (
                  <p className="mt-1 text-xs text-amber-400/90">
                    Suspended {when(r.suspended_at)}
                    {r.suspension_reason ? ` — ${r.suspension_reason}` : ""}
                  </p>
                )}
              </div>
              {r.status === "suspended" ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy === r.user_id}
                  onClick={() => void reinstate(r)}
                >
                  {busy === r.user_id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Keep account live
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  disabled={busy === r.user_id}
                  onClick={() => {
                    setTarget(r);
                    setReason("");
                  }}
                >
                  <ShieldBan className="w-4 h-4 mr-2" />
                  Suspend account
                </Button>
              )}
            </article>
          ))}
        </div>
      )}

      <AlertDialog open={Boolean(target)} onOpenChange={(o) => !o && setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {target?.display_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will no longer be able to create or edit articles and courses. We will email them
              straight away with the appeal steps: a 150-word appeal note, accepting the terms and
              conditions, and sending it to cc@everyonecanlight.co with the header title “Contributor
              Appeal-{target?.display_name ?? "Name"}”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for suspension (shown in the email)"
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void suspend();
              }}
            >
              Suspend account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default ContributorAccountsSection;
