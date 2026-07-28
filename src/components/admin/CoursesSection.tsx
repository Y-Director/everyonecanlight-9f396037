import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Row = {
  id: string;
  email: string;
  full_name: string | null;
  course_name: string;
  amount: number;
  currency: string;
  reference: string | null;
  status: string;
  purchased_at: string;
};

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });

const CoursesSection = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("course_purchases")
        .select("*")
        .order("purchased_at", { ascending: false })
        .limit(500);
      setLoading(false);
      if (error) {
        toast.error("Could not load course purchases");
        return;
      }
      setRows((data ?? []) as Row[]);
    })();
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.email, r.full_name, r.course_name, r.reference]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, query]);

  const paid = rows.filter((r) => r.status === "paid");

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Purchases", value: rows.length },
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
          placeholder="Search email, course name or reference"
          className="pl-9"
        />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--surface))] text-foreground/60">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Course</th>
              <th className="px-4 py-3 font-medium">Date bought</th>
              <th className="px-4 py-3 font-medium">Amount paid</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-foreground/50">
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                </td>
              </tr>
            )}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-foreground/50">
                  No course purchases logged yet.
                </td>
              </tr>
            )}
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-foreground/10 align-top">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.full_name ?? r.email}</div>
                  <div className="text-foreground/50">{r.email}</div>
                </td>
                <td className="px-4 py-3 text-foreground/70">{r.course_name}</td>
                <td className="px-4 py-3 text-foreground/70">{fmt(r.purchased_at)}</td>
                <td className="px-4 py-3 font-medium">{naira(r.amount)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-1 text-xs capitalize ${
                      r.status === "paid"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
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

export default CoursesSection;
