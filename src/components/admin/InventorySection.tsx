import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Boxes,
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Warehouse,
  Truck,
  Wrench,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Item = {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  serial_number: string | null;
  location: string;
  status: string;
  notes: string | null;
  date_added: string;
};

const LOCATIONS = [
  { value: "in_store", label: "In Store" },
  { value: "rented_out", label: "Rented Out" },
];

const STATUSES = [
  { value: "good", label: "Good condition" },
  { value: "needs_repair", label: "Needs repair" },
  { value: "damaged", label: "Damaged" },
];

const label = (list: { value: string; label: string }[], v: string) =>
  list.find((l) => l.value === v)?.label ?? v;

const statusClass = (s: string) =>
  s === "good"
    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    : s === "needs_repair"
      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
      : "bg-red-500/15 text-red-400 border-red-500/30";

const availabilityClass = (available: number, total: number) => {
  if (available === 0) return "bg-red-500/15 text-red-400 border-red-500/30";
  if (available / total < 0.3) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (available === total) return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
};

const emptyDraft = {
  name: "",
  manufacturer: "",
  category: "",
  serial_number: "",
  location: "in_store",
  status: "good",
  notes: "",
  date_added: new Date().toISOString().slice(0, 10),
  quantity: 1,
};

const InventorySection = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [groupBy, setGroupBy] = useState<"name" | "manufacturer" | "category">("name");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [draft, setDraft] = useState({ ...emptyDraft });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Item | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inventory_items")
      .select("id, name, manufacturer, category, serial_number, location, status, notes, date_added")
      .order("manufacturer", { ascending: true })
      .order("name", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Could not load inventory");
      return;
    }
    setItems((data ?? []) as Item[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const matchQ =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.manufacturer.toLowerCase().includes(q) ||
        (i.serial_number ?? "").toLowerCase().includes(q);
      const matchL = locationFilter === "all" || i.location === locationFilter;
      const matchS = statusFilter === "all" || i.status === statusFilter;
      return matchQ && matchL && matchS;
    });
  }, [items, query, locationFilter, statusFilter]);

  const groups = useMemo(() => {
    const map = new Map<string, Item[]>();
    filtered.forEach((i) => {
      const key = i[groupBy] || "Ungrouped";
      map.set(key, [...(map.get(key) ?? []), i]);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered, groupBy]);

  const total = items.length;
  const inStore = items.filter((i) => i.location === "in_store").length;
  const rentedOut = total - inStore;
  const attention = items.filter((i) => i.status !== "good").length;

  const openAdd = () => {
    setEditing(null);
    setDraft({ ...emptyDraft });
    setDialogOpen(true);
  };

  const openEdit = (item: Item) => {
    setEditing(item);
    setDraft({
      name: item.name,
      manufacturer: item.manufacturer,
      category: item.category,
      serial_number: item.serial_number ?? "",
      location: item.location,
      status: item.status,
      notes: item.notes ?? "",
      date_added: item.date_added,
      quantity: 1,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!draft.name.trim()) {
      toast.error("Item name is required");
      return;
    }
    setSaving(true);
    const base = {
      name: draft.name.trim(),
      manufacturer: draft.manufacturer.trim() || "Generic",
      category: draft.category.trim() || "Other",
      location: draft.location,
      status: draft.status,
      notes: draft.notes.trim() || null,
      date_added: draft.date_added,
    };

    let error;
    if (editing) {
      ({ error } = await supabase
        .from("inventory_items")
        .update({ ...base, serial_number: draft.serial_number.trim() || null })
        .eq("id", editing.id));
    } else {
      const qty = Math.max(1, Math.min(200, Number(draft.quantity) || 1));
      const rows = Array.from({ length: qty }, (_, idx) => ({
        ...base,
        serial_number:
          draft.serial_number.trim()
            ? qty === 1
              ? draft.serial_number.trim()
              : `${draft.serial_number.trim()}-${idx + 1}`
            : null,
      }));
      ({ error } = await supabase.from("inventory_items").insert(rows));
    }
    setSaving(false);
    if (error) {
      toast.error("Could not save this item");
      return;
    }
    toast.success(editing ? "Item updated" : "Item added to inventory");
    setDialogOpen(false);
    load();
  };

  const remove = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("inventory_items").delete().eq("id", confirmDelete.id);
    setConfirmDelete(null);
    if (error) {
      toast.error("Could not remove this item");
      return;
    }
    toast.success("Item removed");
    load();
  };

  const quickUpdate = async (item: Item, patch: Partial<Item>) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...patch } : i)));
    const { error } = await supabase.from("inventory_items").update(patch).eq("id", item.id);
    if (error) {
      toast.error("Could not update this item");
      load();
    }
  };

  const allOpen = groups.length > 0 && groups.every(([k]) => openGroups[k]);
  const toggleAll = () => {
    const next: Record<string, boolean> = {};
    groups.forEach(([k]) => (next[k] = !allOpen));
    setOpenGroups(next);
  };

  return (
    <div>
      {/* Headline counters */}
      <div className="rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/50">Total inventory</p>
            <div className="mt-1 flex items-end gap-3">
              <span className="text-5xl font-semibold leading-none">{total}</span>
              <span className="text-lg text-foreground/60 pb-1">items</span>
            </div>
            <p className="mt-3 text-sm text-foreground/60">
              <span className="text-foreground font-medium text-base">
                {inStore}/{total}
              </span>{" "}
              in store · {rentedOut} out on rent
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[420px]">
            <div className="rounded-xl border border-foreground/10 bg-background/40 p-4">
              <Warehouse className="w-4 h-4 text-emerald-400" />
              <div className="mt-2 text-2xl font-semibold">{inStore}</div>
              <div className="text-xs text-foreground/50">In store</div>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-background/40 p-4">
              <Truck className="w-4 h-4 text-[hsl(var(--cta))]" />
              <div className="mt-2 text-2xl font-semibold">{rentedOut}</div>
              <div className="text-xs text-foreground/50">Rented out</div>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-background/40 p-4">
              <Wrench className="w-4 h-4 text-amber-400" />
              <div className="mt-2 text-2xl font-semibold">{attention}</div>
              <div className="text-xs text-foreground/50">Need attention</div>
            </div>
          </div>
        </div>

        <div className="mt-5 h-2 rounded-full bg-foreground/10 overflow-hidden">
          <div
            className="h-full bg-emerald-500/70 transition-all"
            style={{ width: `${total ? (inStore / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex flex-col xl:flex-row xl:items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, manufacturer or serial number"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v as typeof groupBy)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Group by name</SelectItem>
              <SelectItem value="manufacturer">Group by manufacturer</SelectItem>
              <SelectItem value="category">Group by category</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {LOCATIONS.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All conditions</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={toggleAll}>
            {allOpen ? "Collapse all" : "Expand all"}
          </Button>
          <Button onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add item
          </Button>
        </div>
      </div>

      {/* Groups */}
      <div className="mt-5 space-y-3">
        {loading && (
          <div className="py-16 text-center text-foreground/50">
            <Loader2 className="w-5 h-5 animate-spin inline" />
          </div>
        )}

        {!loading && groups.length === 0 && (
          <div className="rounded-xl border border-dashed border-foreground/15 py-16 text-center text-foreground/50">
            <Boxes className="w-6 h-6 mx-auto mb-3 opacity-60" />
            No items match this view.
          </div>
        )}

        {groups.map(([key, list]) => {
          const available = list.filter((i) => i.location === "in_store").length;
          const open = !!openGroups[key];
          return (
            <div key={key} className="rounded-xl border border-foreground/10 overflow-hidden">
              <button
                onClick={() => setOpenGroups((p) => ({ ...p, [key]: !p[key] }))}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[hsl(var(--surface))] hover:bg-foreground/5 text-left"
              >
                <ChevronDown
                  className={`w-4 h-4 text-foreground/50 transition-transform ${open ? "" : "-rotate-90"}`}
                />
                <span className="font-medium">{key}</span>
                <span className="text-xs text-foreground/50">{list.length} units</span>
                <span
                  className={`ml-auto text-xs px-2.5 py-1 rounded-full border ${availabilityClass(
                    available,
                    list.length
                  )}`}
                >
                  {available}/{list.length} left
                </span>
              </button>

              {open && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-foreground/50 bg-background/40">
                      <tr className="text-left">
                        <th className="px-4 py-2 font-medium">Item</th>
                        <th className="px-4 py-2 font-medium">Manufacturer</th>
                        <th className="px-4 py-2 font-medium">Serial</th>
                        <th className="px-4 py-2 font-medium">Added</th>
                        <th className="px-4 py-2 font-medium">Location</th>
                        <th className="px-4 py-2 font-medium">Condition</th>
                        <th className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((i) => (
                        <tr key={i.id} className="border-t border-foreground/10">
                          <td className="px-4 py-2 font-medium">{i.name}</td>
                          <td className="px-4 py-2 text-foreground/70">{i.manufacturer}</td>
                          <td className="px-4 py-2 text-foreground/50">
                            {i.serial_number || "—"}
                          </td>
                          <td className="px-4 py-2 text-foreground/50">{i.date_added}</td>
                          <td className="px-4 py-2">
                            <Select
                              value={i.location}
                              onValueChange={(v) => quickUpdate(i, { location: v })}
                            >
                              <SelectTrigger className="h-8 w-[135px] text-xs">
                                <SelectValue>{label(LOCATIONS, i.location)}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {LOCATIONS.map((l) => (
                                  <SelectItem key={l.value} value={l.value}>
                                    {l.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2">
                            <Select
                              value={i.status}
                              onValueChange={(v) => quickUpdate(i, { status: v })}
                            >
                              <SelectTrigger
                                className={`h-8 w-[155px] text-xs border ${statusClass(i.status)}`}
                              >
                                <SelectValue>{label(STATUSES, i.status)}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {STATUSES.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex justify-end gap-1">
                              <Button size="icon" variant="ghost" onClick={() => openEdit(i)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setConfirmDelete(i)}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit item" : "Add item to inventory"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details of this unit."
                : "Add one unit, or several identical units at once."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Name</Label>
              <Input
                className="mt-1.5"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Aputure 600D Pro"
              />
            </div>
            <div>
              <Label>Manufacturer</Label>
              <Input
                className="mt-1.5"
                value={draft.manufacturer}
                onChange={(e) => setDraft({ ...draft, manufacturer: e.target.value })}
                placeholder="Aputure"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                className="mt-1.5"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                placeholder="Lighting Fixtures"
              />
            </div>
            <div>
              <Label>Serial number</Label>
              <Input
                className="mt-1.5"
                value={draft.serial_number}
                onChange={(e) => setDraft({ ...draft, serial_number: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label>Date added</Label>
              <Input
                type="date"
                className="mt-1.5"
                value={draft.date_added}
                onChange={(e) => setDraft({ ...draft, date_added: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Select
                value={draft.location}
                onValueChange={(v) => setDraft({ ...draft, location: v })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition</Label>
              <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!editing && (
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  className="mt-1.5"
                  value={draft.quantity}
                  onChange={(e) => setDraft({ ...draft, quantity: Number(e.target.value) })}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <Label>Notes</Label>
              <Textarea
                className="mt-1.5"
                rows={2}
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editing ? "Save changes" : "Add to inventory"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove this item?</DialogTitle>
            <DialogDescription>
              {confirmDelete?.name} will be permanently removed from the inventory.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={remove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventorySection;