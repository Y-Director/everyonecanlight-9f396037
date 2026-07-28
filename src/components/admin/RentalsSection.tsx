import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Eye, Loader2, Search } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type GearItem = { name: string; qty: number; price: number; lineTotal: number };

type Row = {
  id: string;
  reference: string;
  booking_code: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  items: GearItem[];
  days: number;
  start_date: string | null;
  end_date: string | null;
  location: string;
  call_time: string;
  total: number;
  status: string;
  fulfilment_status: string;
  checked_out_at: string | null;
  returned_at: string | null;
  paid_at: string | null;
  created_at: string;
  runners: { name: string; phone: string; avatar_url: string | null } | null;
  rental_customers: {
    full_name: string;
    email: string;
    phone: string;
    id_type: string | null;
    id_image_path: string | null;
    kyc_status: string;
  } | null;
};

type Identity = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  id_type: string | null;
  id_image_path: string | null;
  kyc_status: string;
  rejection_reason: string | null;
  created_at: string;
};

const REJECT_REASONS = [
  "Unclear image upload",
  "Expired identity document",
  "Unapproved due to identity concerns",
  "False document uploaded",
];

type SortKey = "created_at" | "contact_name" | "contact_email" | "contact_phone" | "total";

const FULFILMENT = [
  { value: "awaiting_pickup", label: "Awaiting pickup" },
  { value: "rented_out", label: "Rented out" },
  { value: "returned", label: "Rental returned" },
  { value: "attention_needed", label: "Attention needed" },
] as const;

const fulfilmentLabel = (v: string) =>
  FULFILMENT.find((f) => f.value === v)?.label ?? "Awaiting pickup";

const fulfilmentStyle = (v: string) =>
  v === "rented_out"
    ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
    : v === "returned"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : v === "attention_needed"
        ? "bg-red-500/15 text-red-400 border-red-500/30"
        : "bg-foreground/5 text-foreground/60 border-foreground/20";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

const statusStyle = (status: string) =>
  status === "confirmed"
    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    : status === "failed"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : "bg-amber-500/15 text-amber-400 border-amber-500/30";

const RentalsSection = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [asc, setAsc] = useState(false);
  const [fulfilment, setFulfilment] = useState("all");
  const [active, setActive] = useState<Row | null>(null);
  const [idUrl, setIdUrl] = useState<string | null>(null);
  const [tab, setTab] = useState<"bookings" | "identity">("bookings");
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [identitiesLoading, setIdentitiesLoading] = useState(false);
  const [identityUrls, setIdentityUrls] = useState<Record<string, string>>({});
  const [rejecting, setRejecting] = useState<Identity | null>(null);
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0]);


  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rental_reservations")
      .select(
        "id, reference, booking_code, contact_name, contact_email, contact_phone, items, days, start_date, end_date, location, call_time, total, status, fulfilment_status, checked_out_at, returned_at, paid_at, created_at, runners(name, phone, avatar_url), rental_customers(full_name, email, phone, id_type, id_image_path, kyc_status)",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    setLoading(false);
    if (error) {
      toast.error("Could not load reservations");
      return;
    }
    setRows((data ?? []) as unknown as Row[]);
  }, []);

  const loadIdentities = useCallback(async () => {
    setIdentitiesLoading(true);
    const { data, error } = await supabase
      .from("rental_customers")
      .select("id, full_name, email, phone, id_type, id_image_path, kyc_status, rejection_reason, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    setIdentitiesLoading(false);
    if (error) {
      toast.error("Could not load identities");
      return;
    }
    const list = (data ?? []) as Identity[];
    setIdentities(list);
    const urls: Record<string, string> = {};
    await Promise.all(
      list
        .filter((i) => i.id_image_path)
        .map(async (i) => {
          const { data: signed } = await supabase.storage
            .from("kyc-ids")
            .createSignedUrl(i.id_image_path as string, 600);
          if (signed?.signedUrl) urls[i.id] = signed.signedUrl;
        }),
    );
    setIdentityUrls(urls);
  }, []);

  const setIdentityStatus = async (row: Identity, status: string, reason: string | null) => {
    const { error } = await supabase
      .from("rental_customers")
      .update({
        kyc_status: status,
        rejection_reason: reason,
        reviewed_at: new Date().toISOString(),
        verified_at: status === "verified" ? new Date().toISOString() : null,
      })
      .eq("id", row.id);
    if (error) {
      toast.error("Could not update this identity");
      return;
    }
    toast.success(status === "verified" ? "Identity approved" : "Identity rejected");
    setRejecting(null);
    loadIdentities();
  };

  useEffect(() => {
    load();
  }, [load]);

  const setFulfilmentStatus = async (row: Row, value: string) => {
    const patch: Record<string, unknown> = { fulfilment_status: value };
    if (value === "rented_out") patch.checked_out_at = new Date().toISOString();
    if (value === "returned") patch.returned_at = new Date().toISOString();
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...(patch as object) } as Row : r)));
    const { error } = await supabase.from("rental_reservations").update(patch).eq("id", row.id);
    if (error) {
      toast.error("Could not update this booking");
      load();
      return;
    }
    toast.success(`Marked as ${fulfilmentLabel(value).toLowerCase()}`);
  };

  useEffect(() => {
    if (tab === "identity") loadIdentities();
  }, [tab, loadIdentities]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (fulfilment !== "all" && (r.fulfilment_status ?? "awaiting_pickup") !== fulfilment) return false;
      if (!q) return true;
      return [
        r.booking_code,
        r.reference,
        r.contact_name ?? r.rental_customers?.full_name,
        r.contact_email ?? r.rental_customers?.email,
        r.contact_phone ?? r.rental_customers?.phone,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
    list = [...list].sort((a, b) => {
      const get = (r: Row) => {
        if (sortKey === "total") return r.total;
        if (sortKey === "created_at") return r.created_at;
        if (sortKey === "contact_name") return (r.contact_name ?? r.rental_customers?.full_name ?? "").toLowerCase();
        if (sortKey === "contact_email") return (r.contact_email ?? r.rental_customers?.email ?? "").toLowerCase();
        return (r.contact_phone ?? r.rental_customers?.phone ?? "").toLowerCase();
      };
      const av = get(a);
      const bv = get(b);
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (asc ? 1 : -1);
    });
    return list;
  }, [rows, query, status, fulfilment, sortKey, asc]);

  const openRow = async (row: Row) => {
    setActive(row);
    setIdUrl(null);
    const path = row.rental_customers?.id_image_path;
    if (!path) return;
    const { data, error } = await supabase.storage.from("kyc-ids").createSignedUrl(path, 60);
    if (error) {
      toast.error("Could not open the ID image");
      return;
    }
    setIdUrl(data.signedUrl);
  };


  return (
    <>
      <div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Reservations", value: rows.length },
            { label: "Confirmed", value: rows.filter((r) => r.status === "confirmed").length },
            {
              label: "Revenue collected",
              value: naira(
                rows.filter((r) => r.status === "confirmed").reduce((s, r) => s + r.total, 0),
              ),
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-5"
            >
              <div className="text-xs uppercase tracking-wider text-foreground/50">{s.label}</div>
              <div className="mt-2 text-2xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-2 border-b border-foreground/10">
          {(["bookings", "identity"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm capitalize border-b-2 -mb-px ${
                tab === t
                  ? "border-[hsl(var(--cta))] text-foreground"
                  : "border-transparent text-foreground/50 hover:text-foreground/80"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "identity" && (
          <div className="mt-6 overflow-x-auto rounded-xl border border-foreground/10">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--surface))] text-foreground/60">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Govt ID</th>
                  <th className="px-4 py-3 font-medium">Document</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Review</th>
                </tr>
              </thead>
              <tbody>
                {identitiesLoading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-foreground/50">
                      <Loader2 className="w-5 h-5 animate-spin inline" />
                    </td>
                  </tr>
                )}
                {!identitiesLoading && identities.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-foreground/50">
                      No identities submitted yet.
                    </td>
                  </tr>
                )}
                {identities.map((i) => (
                  <tr key={i.id} className="border-t border-foreground/10 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium">{i.full_name}</div>
                      <div className="text-foreground/50">{i.email}</div>
                      <div className="text-foreground/50">{i.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-foreground/70">{i.id_type ?? "—"}</td>
                    <td className="px-4 py-3">
                      {identityUrls[i.id] ? (
                        <a href={identityUrls[i.id]} target="_blank" rel="noreferrer">
                          <img
                            src={identityUrls[i.id]}
                            alt={`Government ID for ${i.full_name}`}
                            className="h-16 rounded border border-foreground/10"
                          />
                        </a>
                      ) : (
                        <span className="text-foreground/50">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-1 text-xs capitalize ${
                          i.kyc_status === "verified"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : i.kyc_status === "rejected"
                              ? "bg-red-500/15 text-red-400 border-red-500/30"
                              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {i.kyc_status}
                      </span>
                      {i.rejection_reason && (
                        <div className="mt-1 text-xs text-foreground/50">{i.rejection_reason}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setIdentityStatus(i, "verified", null)}
                          disabled={i.kyc_status === "verified"}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setRejecting(i);
                            setRejectReason(REJECT_REASONS[0]);
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "bookings" && (
        <>
        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search booking code, name, email or phone"
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger className="md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Sort by date</SelectItem>
              <SelectItem value="contact_name">Sort by name</SelectItem>
              <SelectItem value="contact_email">Sort by email</SelectItem>
              <SelectItem value="contact_phone">Sort by phone</SelectItem>
              <SelectItem value="total">Sort by amount</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setAsc((v) => !v)} title={asc ? "Ascending" : "Descending"}>
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-[hsl(var(--surface))] text-foreground/60">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Booking</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Call time</th>
                <th className="px-4 py-3 font-medium">Lighting Operator</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-foreground/50">
                    <Loader2 className="w-5 h-5 animate-spin inline" />
                  </td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-foreground/50">
                    No reservations match this search.
                  </td>
                </tr>
              )}
              {visible.map((r) => (
                <tr key={r.id} className="border-t border-foreground/10 align-top">
                  <td className="px-4 py-3 font-mono tracking-wider">
                    {r.booking_code ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {r.contact_name ?? r.rental_customers?.full_name ?? "—"}
                    </div>
                    <div className="text-foreground/50">
                      {r.contact_email ?? r.rental_customers?.email}
                    </div>
                    <div className="text-foreground/50">
                      {r.contact_phone ?? r.rental_customers?.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">
                    {r.start_date ?? "—"}
                    {r.end_date && r.end_date !== r.start_date ? ` → ${r.end_date}` : ""}
                    <div className="text-foreground/50">
                      {r.days} day{r.days > 1 ? "s" : ""} · {r.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{r.call_time}</td>
                  <td className="px-4 py-3 text-foreground/70">
                    {r.runners ? (
                      <>
                        <div>{r.runners.name}</div>
                        <div className="text-foreground/50">{r.runners.phone}</div>
                      </>
                    ) : (
                      "Unassigned"
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{naira(r.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-1 text-xs capitalize ${statusStyle(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" onClick={() => openRow(r)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>

      <Dialog open={Boolean(rejecting)} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject identity</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {rejecting?.full_name} will see this reason and can dispute it by email.
          </p>
          <Select value={rejectReason} onValueChange={setRejectReason}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REJECT_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="destructive"
            onClick={() => rejecting && setIdentityStatus(rejecting, "rejected", rejectReason)}
          >
            Reject identity
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(active)} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono tracking-wider">
              {active?.booking_code ?? active?.reference}
            </DialogTitle>
          </DialogHeader>
          {active && (
            <div className="space-y-6 text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Customer</div>
                  <div className="mt-1 font-medium">{active.contact_name ?? active.rental_customers?.full_name}</div>
                  <div className="text-muted-foreground">{active.contact_email ?? active.rental_customers?.email}</div>
                  <div className="text-muted-foreground">{active.contact_phone ?? active.rental_customers?.phone}</div>
                  <div className="mt-1 text-muted-foreground">
                    ID: {active.rental_customers?.id_type ?? "—"} · KYC {active.rental_customers?.kyc_status}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Booking</div>
                  <div className="mt-1">
                    {active.days} day{active.days > 1 ? "s" : ""} · {active.location}
                  </div>
                  <div className="text-muted-foreground">Call time {active.call_time}</div>
                  <div className="text-muted-foreground">
                    {active.start_date ?? "—"}
                    {active.end_date && active.end_date !== active.start_date ? ` → ${active.end_date}` : ""}
                  </div>
                  <div className="text-muted-foreground">Payment ref {active.reference}</div>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Gear list</div>
                <ul className="mt-2 space-y-1">
                  {active.items?.map((i, idx) => (
                    <li key={idx} className="flex justify-between gap-4">
                      <span>
                        {i.name} × {i.qty}
                      </span>
                      <span>{naira(i.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
                  <span>Total paid</span>
                  <span>{naira(active.total)}</span>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  Government ID
                </div>
                {idUrl ? (
                  <img
                    src={idUrl}
                    alt="Customer government ID"
                    className="mt-2 max-h-72 rounded-lg border"
                  />
                ) : (
                  <p className="mt-2 text-muted-foreground">
                    {active.rental_customers?.id_image_path
                      ? "Generating a temporary secure link…"
                      : "No ID on file."}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Links expire after 60 seconds and are never shared publicly.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RentalsSection;
