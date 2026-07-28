import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Row = {
  id: string;
  full_name: string;
  whatsapp: string;
  email: string;
  background: string;
  experience: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
};

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const MasterclassSection = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("masterclass_registrations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      setLoading(false);
      if (error) {
        toast.error("Could not load masterclass registrations");
        return;
      }
      setRows((data ?? []) as Row[]);
    })();
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.full_name, r.email, r.whatsapp, r.background, r.experience]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, query]);

  const paid = rows.filter((r) => r.status === "paid");

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Registrations", value: rows.length },
          { label: "Paid", value: paid.length },
          { label: "Revenue collected", value: naira(paid.reduce((s, r) => s + r.amount, 0)) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-5">
            <div className="text-xs uppercase tracking-wider text-foreground/50">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, WhatsApp or background"
          className="pl-9"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--surface))] text-foreground/60">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Registrant</th>
              <th className="px-4 py-3 font-medium">WhatsApp</th>
              <th className="px-4 py-3 font-medium">Background</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Registered</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-foreground/50">
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                </td>
              </tr>
            )}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-foreground/50">
                  No registrations yet.
                </td>
              </tr>
            )}
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-foreground/10 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.full_name}</div>
                  <div className="text-foreground/50">{r.email}</div>
                </td>
                <td className="px-4 py-3 text-foreground/70">{r.whatsapp}</td>
                <td className="px-4 py-3 text-foreground/70">{r.background}</td>
                <td className="px-4 py-3 text-foreground/70">{r.experience}</td>
                <td className="px-4 py-3 text-foreground/70">{fmt(r.created_at)}</td>
                <td className="px-4 py-3 font-medium">{naira(r.amount)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-1 text-xs capitalize ${
                      r.status === "paid"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : r.status === "failed"
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasterclassSection;
