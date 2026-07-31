import { useCallback, useEffect, useState } from "react";
import { Crown, Loader2, Plus, Trash2, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { logActivity } from "@/lib/activityLog";

export const SECTIONS = ["rentals", "masterclass", "courses", "team", "inventory"] as const;
export type Section = (typeof SECTIONS)[number];

type AdminRow = {
  id: string;
  email: string;
  is_super: boolean;
  status: string;
  sections: string[];
  created_at: string;
};

const AdminsSection = () => {
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [newSections, setNewSections] = useState<Section[]>(["rentals"]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_accounts")
      .select("id, email, is_super, status, sections, created_at")
      .order("is_super", { ascending: false })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Could not load admins");
      return;
    }
    setRows((data ?? []) as AdminRow[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addAdmin = async () => {
    const value = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      toast.error("Enter a valid email address");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("admin_accounts")
      .insert({ email: value, sections: newSections, status: "active", is_super: false });
    setSaving(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "That admin already exists" : "Could not add this admin");
      return;
    }
    toast.success("Sub-admin added");
    void logActivity({
      category: "admins",
      event: "admin_added",
      title: `Sub-admin added — ${value}`,
      summary: `Sections: ${newSections.join(", ") || "none"}`,
      severity: "warning",
      lines: [{ label: "Sections", value: newSections.join(", ") || "none" }],
    });
    setEmail("");
    setNewSections(["rentals"]);
    load();
  };

  const update = async (row: AdminRow, patch: Partial<AdminRow>) => {
    const { error } = await supabase.from("admin_accounts").update(patch).eq("id", row.id);
    if (error) {
      toast.error("Could not update this admin");
      return;
    }
    load();
  };

  const remove = async (row: AdminRow) => {
    const { error } = await supabase.from("admin_accounts").delete().eq("id", row.id);
    if (error) {
      toast.error("Could not remove this admin");
      return;
    }
    toast.success("Sub-admin removed");
    void logActivity({
      category: "admins",
      event: "admin_removed",
      title: `Sub-admin removed — ${row.email}`,
      severity: "warning",
    });
    load();
  };

  const toggleSection = (row: AdminRow, section: Section) => {
    const next = row.sections.includes(section)
      ? row.sections.filter((s) => s !== section)
      : [...row.sections, section];
    update(row, { sections: next });
  };

  return (
    <div>
      <div className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-5">
        <h2 className="font-semibold">Add a sub-admin</h2>
        <p className="mt-1 text-sm text-foreground/60">
          They sign in at /admin with this email address and only see the areas you tick.
        </p>
        <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="md:max-w-xs"
          />
          <div className="flex flex-wrap items-center gap-4">
            {SECTIONS.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm capitalize">
                <Checkbox
                  checked={newSections.includes(s)}
                  onCheckedChange={(c) =>
                    setNewSections((prev) => (c ? [...prev, s] : prev.filter((p) => p !== s)))
                  }
                />
                {s}
              </label>
            ))}
          </div>
          <Button onClick={addAdmin} disabled={saving} className="md:ml-auto">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add admin
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--surface))] text-foreground/60">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Admin</th>
              <th className="px-4 py-3 font-medium">Access</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-foreground/50">
                  <Loader2 className="w-5 h-5 animate-spin inline" />
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-foreground/10 align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {r.is_super ? (
                      <Crown className="w-4 h-4 text-[hsl(var(--cta))]" />
                    ) : (
                      <UserCog className="w-4 h-4 text-foreground/50" />
                    )}
                    <div>
                      <div className="font-medium">{r.email}</div>
                      <div className="text-xs text-foreground/50">
                        {r.is_super ? "Super admin" : "Sub-admin"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {r.is_super ? (
                    <span className="text-foreground/60">Full access</span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-4">
                      {SECTIONS.map((s) => (
                        <label key={s} className="flex items-center gap-2 capitalize">
                          <Checkbox
                            checked={r.sections.includes(s)}
                            onCheckedChange={() => toggleSection(r, s)}
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.is_super ? (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-1 text-xs text-emerald-400">
                      active
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={r.status === "active"}
                        onCheckedChange={(c) => update(r, { status: c ? "active" : "suspended" })}
                      />
                      <span className="text-foreground/70 capitalize">{r.status}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!r.is_super && (
                    <Button variant="ghost" size="sm" onClick={() => remove(r)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsSection;
