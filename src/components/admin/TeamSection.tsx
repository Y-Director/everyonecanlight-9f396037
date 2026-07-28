import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Upload, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const UNITS = [
  "Creative",
  "Customer Experience",
  "Finance",
  "Light Operations",
  "Content and Education",
  "General Operations & Admin",
  "Facility and Security",
  "Audit & Compliance",
] as const;

export const GENERAL_RANKS = ["Team Lead", "Lead Assistant", "Member"] as const;

export const OPERATOR_RANKS = [
  "White Gaffer",
  "Red Gaffer",
  "Double Gaffer",
  "Triple Red Gaffer",
  "Green Gaffer",
  "Double Green Gaffer",
  "Blue Gaffer",
  "Light Sultan",
  "General Light Sultan",
  "Major General Light Sultan",
] as const;

const STATUSES = ["active", "inactive", "suspended"] as const;

type Staff = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  unit: string;
  position: string;
  status: string;
  date_joined: string;
  avatar_url: string | null;
  is_light_operator: boolean;
  runner_id: string | null;
};

type Job = {
  id: string;
  booking_code: string | null;
  reference: string;
  contact_name: string | null;
  start_date: string | null;
  created_at: string;
  status: string;
  runner_id: string | null;
  damages_recorded: boolean;
  job_outcome: string | null;
};

const emptyForm = {
  full_name: "",
  email: "",
  phone: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  unit: "General Operations & Admin",
  position: "Member",
  status: "active",
  date_joined: new Date().toISOString().slice(0, 10),
  is_light_operator: false,
};

const statusStyle = (s: string) =>
  s === "active"
    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
    : s === "suspended"
      ? "border-red-500/30 bg-red-500/15 text-red-400"
      : "border-foreground/20 bg-foreground/5 text-foreground/60";

const TeamSection = ({ view = "all" }: { view?: "all" | "team" | "operators" }) => {
  const [rows, setRows] = useState<Staff[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [editRow, setEditRow] = useState<Staff | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", email: "", phone: "" });
  const [editAvatar, setEditAvatar] = useState<File | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const openEdit = (row: Staff) => {
    setEditRow(row);
    setEditForm({ full_name: row.full_name, email: row.email, phone: row.phone });
    setEditAvatar(null);
  };

  const saveEdit = async () => {
    if (!editRow) return;
    const name = editForm.full_name.trim();
    const email = editForm.email.trim().toLowerCase();
    const phone = editForm.phone.trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !phone) {
      toast.error("Full name, a valid email and a phone number are required");
      return;
    }
    setEditSaving(true);
    let avatarPath = editRow.avatar_url;
    if (editAvatar) {
      const ext = editAvatar.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("staff-avatars")
        .upload(path, editAvatar, { upsert: false });
      if (upErr) {
        setEditSaving(false);
        toast.error("Could not upload the photo");
        return;
      }
      avatarPath = path;
    }

    const { error } = await supabase
      .from("staff_members")
      .update({ full_name: name, email, phone, avatar_url: avatarPath })
      .eq("id", editRow.id);

    if (!error && editRow.runner_id) {
      await supabase.from("runners").update({ name, phone }).eq("id", editRow.runner_id);
    }

    setEditSaving(false);
    if (error) {
      toast.error("Could not update this team member");
      return;
    }
    toast.success("Team member updated");
    setEditRow(null);
    setEditAvatar(null);
    load();
  };

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: staff, error }, { data: res }] = await Promise.all([
      supabase
        .from("staff_members")
        .select(
          "id, full_name, email, phone, emergency_contact_name, emergency_contact_phone, unit, position, status, date_joined, avatar_url, is_light_operator, runner_id",
        )
        .order("created_at", { ascending: true }),
      supabase
        .from("rental_reservations")
        .select(
          "id, booking_code, reference, contact_name, start_date, created_at, status, runner_id, damages_recorded, job_outcome",
        )
        .not("runner_id", "is", null)
        .order("created_at", { ascending: false }),
    ]);
    setLoading(false);
    if (error) {
      toast.error("Could not load team members");
      return;
    }
    const list = (staff ?? []) as Staff[];
    setRows(list);
    setJobs((res ?? []) as Job[]);

    const paths = list.map((r) => r.avatar_url).filter(Boolean) as string[];
    if (paths.length) {
      const { data: signed } = await supabase.storage
        .from("staff-avatars")
        .createSignedUrls(paths, 3600);
      const map: Record<string, string> = {};
      signed?.forEach((s) => {
        if (s.path && s.signedUrl) map[s.path] = s.signedUrl;
      });
      setAvatars(map);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const ranks = form.is_light_operator ? OPERATOR_RANKS : GENERAL_RANKS;

  const addMember = async () => {
    if (!form.full_name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) || !form.phone.trim()) {
      toast.error("Full name, a valid email and a phone number are required");
      return;
    }
    setSaving(true);
    let avatarPath: string | null = null;
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("staff-avatars")
        .upload(path, avatarFile, { upsert: false });
      if (upErr) {
        setSaving(false);
        toast.error("Could not upload the photo");
        return;
      }
      avatarPath = path;
    }

    let runnerId: string | null = null;
    if (form.is_light_operator) {
      const { data: runner } = await supabase
        .from("runners")
        .insert({ name: form.full_name.trim(), phone: form.phone.trim(), active: form.status === "active" })
        .select("id")
        .maybeSingle();
      runnerId = runner?.id ?? null;
    }

    const { error } = await supabase.from("staff_members").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      emergency_contact_name: form.emergency_contact_name.trim() || null,
      emergency_contact_phone: form.emergency_contact_phone.trim() || null,
      unit: form.unit,
      position: form.position,
      status: form.status,
      date_joined: form.date_joined,
      avatar_url: avatarPath,
      is_light_operator: form.is_light_operator,
      runner_id: runnerId,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not add this team member");
      return;
    }
    toast.success("Team member added");
    setForm({ ...emptyForm });
    setAvatarFile(null);
    load();
  };

  const update = async (row: Staff, patch: Partial<Staff>) => {
    const { error } = await supabase.from("staff_members").update(patch).eq("id", row.id);
    if (error) {
      toast.error("Could not update this team member");
      return;
    }
    load();
  };

  const remove = async (row: Staff) => {
    const { error } = await supabase.from("staff_members").delete().eq("id", row.id);
    if (error) {
      toast.error("Could not remove this team member");
      return;
    }
    toast.success("Team member removed");
    load();
  };

  const operators = useMemo(() => rows.filter((r) => r.is_light_operator), [rows]);
  const jobsByRunner = useMemo(() => {
    const map: Record<string, Job[]> = {};
    jobs.forEach((j) => {
      if (!j.runner_id) return;
      (map[j.runner_id] ??= []).push(j);
    });
    return map;
  }, [jobs]);

  const initials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="space-y-8">
      {view !== "operators" && (
      <div className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-5">
        <h2 className="font-semibold">Add a team member</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <Label className="text-xs text-foreground/60">Full name</Label>
            <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Email address</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Phone number</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Next of kin / emergency contact</Label>
            <Input
              value={form.emergency_contact_name}
              onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
              placeholder="Name"
            />
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Emergency contact phone</Label>
            <Input
              value={form.emergency_contact_phone}
              onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
              placeholder="+234..."
            />
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Date joined</Label>
            <Input
              type="date"
              value={form.date_joined}
              onChange={(e) => setForm({ ...form, date_joined: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Unit</Label>
            <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {UNITS.map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Position / rank</Label>
            <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ranks.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <Switch
              checked={form.is_light_operator}
              onCheckedChange={(c) =>
                setForm({
                  ...form,
                  is_light_operator: c,
                  unit: c ? "Light Operations" : form.unit,
                  position: c ? OPERATOR_RANKS[0] : GENERAL_RANKS[2],
                })
              }
            />
            <span className="text-sm text-foreground/70">Lighting Operator</span>
          </div>
          <div>
            <Label className="text-xs text-foreground/60">Avatar</Label>
            <label className="mt-1 flex items-center gap-2 rounded-md border border-foreground/15 px-3 py-2 text-sm text-foreground/70 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="truncate">{avatarFile ? avatarFile.name : "Upload image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>
        <Button onClick={addMember} disabled={saving} className="mt-4">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Add team member
        </Button>
      </div>
      )}

      {view !== "operators" && (
      <div className="overflow-x-auto rounded-xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-[hsl(var(--surface))] text-foreground/60">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Next of kin</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Position / rank</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date joined</th>
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
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-foreground/50">
                  No team members yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-foreground/10 align-middle">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-foreground/10 overflow-hidden grid place-items-center text-xs">
                      {r.avatar_url && avatars[r.avatar_url] ? (
                        <img src={avatars[r.avatar_url]} alt={r.full_name} className="w-full h-full object-cover" />
                      ) : (
                        initials(r.full_name)
                      )}
                    </span>
                    <div>
                      <div className="font-medium">{r.full_name}</div>
                      {r.is_light_operator && (
                        <div className="text-xs text-[hsl(var(--cta))] flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Lighting Operator
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground/70">
                  <div>{r.email}</div>
                  <div className="text-foreground/50">{r.phone}</div>
                </td>
                <td className="px-4 py-3 text-foreground/70">
                  <div>{r.emergency_contact_name ?? "—"}</div>
                  <div className="text-foreground/50">{r.emergency_contact_phone ?? ""}</div>
                </td>
                <td className="px-4 py-3">
                  <Select value={r.unit} onValueChange={(v) => update(r, { unit: v })}>
                    <SelectTrigger className="h-8 w-[190px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {UNITS.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Select value={r.position} onValueChange={(v) => update(r, { position: v })}>
                    <SelectTrigger className="h-8 w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(r.is_light_operator ? OPERATOR_RANKS : GENERAL_RANKS).map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Select value={r.status} onValueChange={(v) => update(r, { status: v })}>
                    <SelectTrigger className={`h-8 w-[130px] capitalize border ${statusStyle(r.status)}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3 text-foreground/70">{r.date_joined}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => remove(r)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {view !== "team" && (
      <div>
        <h2 className="font-semibold">Lighting Operators · job log</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Rental jobs assigned to each operator, with outcome and damage records.
        </p>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          {operators.length === 0 && (
            <p className="text-sm text-foreground/50">No lighting operators added yet.</p>
          )}
          {operators.map((op) => {
            const list = op.runner_id ? (jobsByRunner[op.runner_id] ?? []) : [];
            const damaged = list.filter((j) => j.damages_recorded).length;
            return (
              <div key={op.id} className="rounded-xl border border-foreground/10 bg-[hsl(var(--surface))] p-5">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-foreground/10 overflow-hidden grid place-items-center text-sm">
                    {op.avatar_url && avatars[op.avatar_url] ? (
                      <img src={avatars[op.avatar_url]} alt={op.full_name} className="w-full h-full object-cover" />
                    ) : (
                      initials(op.full_name)
                    )}
                  </span>
                  <div>
                    <div className="font-medium">{op.full_name}</div>
                    <div className="text-xs text-foreground/50">{op.position}</div>
                  </div>
                  <div className="ml-auto text-right text-xs text-foreground/60">
                    <div>{list.length} job{list.length === 1 ? "" : "s"}</div>
                    <div className={damaged ? "text-red-400" : "text-emerald-400"}>
                      {damaged} with damages
                    </div>
                  </div>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-foreground/50">
                      <tr className="text-left">
                        <th className="py-2 font-medium">Date</th>
                        <th className="py-2 font-medium">Client</th>
                        <th className="py-2 font-medium">Booking ref</th>
                        <th className="py-2 font-medium">Outcome</th>
                        <th className="py-2 font-medium">Damages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-4 text-foreground/40">No jobs assigned yet.</td>
                        </tr>
                      )}
                      {list.map((j) => (
                        <tr key={j.id} className="border-t border-foreground/10">
                          <td className="py-2 pr-3 text-foreground/70">
                            {j.start_date ?? j.created_at.slice(0, 10)}
                          </td>
                          <td className="py-2 pr-3">{j.contact_name ?? "—"}</td>
                          <td className="py-2 pr-3 font-mono tracking-wider">
                            {j.booking_code ?? j.reference}
                          </td>
                          <td className="py-2 pr-3 capitalize text-foreground/70">
                            {j.job_outcome ?? (j.status === "paid" ? "successful" : j.status)}
                          </td>
                          <td className="py-2">
                            <span className={j.damages_recorded ? "text-red-400" : "text-emerald-400"}>
                              {j.damages_recorded ? "Recorded" : "None"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
};

export default TeamSection;
