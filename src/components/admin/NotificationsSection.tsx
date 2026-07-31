import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Wrench,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type LogRow = {
  id: string;
  category: string;
  event: string;
  title: string;
  summary: string | null;
  severity: string;
  actor_email: string | null;
  entity_type: string | null;
  entity_id: string | null;
  notified_emails: string[];
  created_at: string;
};

type Incident = {
  id: string;
  kind: string;
  reference: string;
  email: string | null;
  full_name: string | null;
  amount: number;
  status: string;
  details: string | null;
  customer_notified_at: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
};

const CATEGORIES = [
  "all",
  "rentals",
  "payments",
  "identity",
  "masterclass",
  "courses",
  "inventory",
  "team",
  "admins",
];

const severityStyle = (s: string) =>
  s === "critical"
    ? "bg-red-500/15 text-red-400 border-red-500/30"
    : s === "warning"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-sky-500/15 text-sky-400 border-sky-500/30";

const naira = (n: number) => `₦${Number(n ?? 0).toLocaleString("en-NG")}`;

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const kindLabel = (kind: string) =>
  kind === "paid_without_reservation"
    ? "Paid, no booking created"
    : kind === "paid_booking_not_confirmed"
      ? "Paid, booking never confirmed"
      : kind === "confirmation_email_failed"
        ? "Confirmed, email not delivered"
        : kind;

const NotificationsSection = () => {
  const [tab, setTab] = useState<"log" | "issues">("log");
  const [rows, setRows] = useState<LogRow[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [log, inc] = await Promise.all([
      supabase
        .from("activity_log")
        .select(
          "id, category, event, title, summary, severity, actor_email, entity_type, entity_id, notified_emails, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(300),
      supabase
        .from("payment_incidents")
        .select(
          "id, kind, reference, email, full_name, amount, status, details, customer_notified_at, resolved_at, resolved_by, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    setLoading(false);
    if (log.error) toast.error("Could not load the notification log");
    setRows((log.data ?? []) as LogRow[]);
    setIncidents((inc.data ?? []) as Incident[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (category === "all" || r.category === category) &&
        (!q ||
          [r.title, r.summary, r.actor_email, r.event]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))),
    );
  }, [rows, category, query]);

  const openIssues = incidents.filter((i) => i.status !== "resolved");

  const callReconcile = async (body: Record<string, unknown>, successMessage: string) => {
    const { data, error } = await supabase.functions.invoke("rental-reconcile", { body });
    if (error || (data as { error?: string })?.error) {
      toast.error((data as { error?: string })?.error ?? "That action could not be completed");
      return null;
    }
    toast.success(successMessage);
    await load();
    return data as Record<string, unknown>;
  };

  const scan = async () => {
    setScanning(true);
    const data = await callReconcile({ action: "scan" }, "Reconciliation finished");
    setScanning(false);
    if (data) {
      toast.message("Payment reconciliation", {
        description: `${data.scanned ?? 0} pending payment(s) checked · ${data.flagged ?? 0} flagged · ${data.recovered ?? 0} repaired.`,
        duration: 6000,
      });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { key: "log", label: "Activity log", icon: BellRing },
            { key: "issues", label: `Payment issues${openIssues.length ? ` (${openIssues.length})` : ""}`, icon: AlertTriangle },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${
              tab === t.key
                ? "border-[hsl(var(--cta))] bg-[hsl(var(--cta))]/10 text-foreground"
                : "border-foreground/15 text-foreground/60 hover:text-foreground"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={scan} disabled={scanning}>
            {scanning ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wrench className="w-4 h-4 mr-2" />
            )}
            Reconcile payments
          </Button>
        </div>
      </div>

      {tab === "log" && (
        <>
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search activity"
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "all" ? "All activity" : c[0].toUpperCase() + c.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid place-items-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-foreground/50">
              No activity recorded yet. Bookings, payments, identity reviews and admin changes will
              appear here and go out by email.
            </p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((r) => (
                <li
                  key={r.id}
                  className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${severityStyle(r.severity)}`}
                    >
                      {r.category}
                    </span>
                    <span className="text-sm font-medium">{r.title}</span>
                    <span className="ml-auto text-xs text-foreground/45">{when(r.created_at)}</span>
                  </div>
                  {r.summary && <p className="mt-1.5 text-sm text-foreground/65">{r.summary}</p>}
                  <p className="mt-2 text-xs text-foreground/45">
                    By {r.actor_email ?? "System"}
                    {r.notified_emails?.length
                      ? ` · emailed ${r.notified_emails.join(", ")}`
                      : " · no email sent"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {tab === "issues" && (
        <>
          <p className="text-sm text-foreground/60">
            Payments that succeeded while the booking did not. Use “Retry &amp; confirm” to
            re-verify the payment with Paystack and complete the booking, or email the customer an
            update.
          </p>
          {loading ? (
            <div className="grid place-items-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-foreground/40" />
            </div>
          ) : incidents.length === 0 ? (
            <p className="py-16 text-center text-sm text-foreground/50">
              No payment issues recorded. Run “Reconcile payments” any time to double-check.
            </p>
          ) : (
            <ul className="space-y-2">
              {incidents.map((i) => (
                <li
                  key={i.id}
                  className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                        i.status === "resolved"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/15 text-red-400 border-red-500/30"
                      }`}
                    >
                      {i.status === "resolved" ? "Resolved" : "Open"}
                    </span>
                    <span className="text-sm font-medium">{kindLabel(i.kind)}</span>
                    <span className="ml-auto text-xs text-foreground/45">{when(i.created_at)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-foreground/70">
                    {i.full_name ?? "Unknown customer"} · {i.email ?? "no email"} · {naira(i.amount)}
                  </p>
                  <p className="mt-1 text-xs text-foreground/45 break-all">Ref {i.reference}</p>
                  {i.details && <p className="mt-2 text-xs text-foreground/60">{i.details}</p>}
                  <p className="mt-2 text-xs text-foreground/45">
                    {i.customer_notified_at
                      ? `Customer emailed ${when(i.customer_notified_at)}`
                      : "Customer not emailed yet"}
                    {i.resolved_by ? ` · resolved by ${i.resolved_by}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={busy === i.id}
                      onClick={async () => {
                        setBusy(i.id);
                        await callReconcile(
                          { action: "fix", reference: i.reference },
                          "Booking confirmed and confirmation email sent",
                        );
                        setBusy(null);
                      }}
                    >
                      {busy === i.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Wrench className="w-4 h-4 mr-2" />
                      )}
                      Retry &amp; confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === i.id || !i.email}
                      onClick={async () => {
                        setBusy(i.id);
                        await callReconcile(
                          { action: "notify", incidentId: i.id },
                          "Customer emailed",
                        );
                        setBusy(null);
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email customer
                    </Button>
                    {i.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy === i.id}
                        onClick={async () => {
                          setBusy(i.id);
                          await callReconcile(
                            { action: "resolve", incidentId: i.id },
                            "Marked as resolved",
                          );
                          setBusy(null);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark resolved
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
};

export default NotificationsSection;