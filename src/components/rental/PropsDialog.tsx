import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PERK_THRESHOLD } from "@/lib/rentalTerms";
import { cn } from "@/lib/utils";

type Prop = {
  id: string;
  name: string;
  slug: string;
  unit_label: string;
  image_url: string;
  status: string;
};

const PropsDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) => {
  const { toast } = useToast();
  const [props, setProps] = useState<Prop[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDone(false);
    setSelected([]);
    setLoading(true);
    supabase.functions
      .invoke("rental-props", { body: { action: "list" } })
      .then(({ data }) => setProps(data?.props ?? []))
      .finally(() => setLoading(false));
  }, [open]);

  const toggle = (p: Prop) => {
    if (p.status !== "in_bank" || done) return;
    setSelected((s) => (s.includes(p.id) ? s.filter((i) => i !== p.id) : [...s, p.id]));
  };

  const finish = async () => {
    if (!bookingCode.trim() || !email.trim()) {
      toast({ title: "Booking details needed", description: "Enter your booking reference and email.", variant: "destructive" });
      return;
    }
    if (selected.length === 0) {
      toast({ title: "Select at least one prop", description: "Tap a prop thumbnail to add it to your gear list." });
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("rental-props", {
      body: { action: "claim", bookingCode, email, propIds: selected },
    });
    setSaving(false);
    if (error || data?.error) {
      toast({ title: "Could not add props", description: data?.error ?? "Please try again.", variant: "destructive" });
      return;
    }
    setProps(data?.props ?? []);
    setDone(true);
    toast({
      title: "Props added to your gear list",
      description: `${selected.length} prop${selected.length > 1 ? "s" : ""} sealed to booking ${bookingCode.toUpperCase()}.`,
      duration: 5000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Props — free with your rental</DialogTitle>
          <DialogDescription>
            Props are given out free of charge on rentals over ₦{PERK_THRESHOLD.toLocaleString("en-NG")}. Enter your
            booking reference and email, select the props you want, then click Finish to seal your additions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="props-code">Booking reference</Label>
            <Input
              id="props-code"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
              placeholder="e.g. K7M4PQ"
              disabled={done}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="props-email">Email used to book</Label>
            <Input
              id="props-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={done}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading props…
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {props.map((p) => {
              const available = p.status === "in_bank";
              const isSelected = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p)}
                  disabled={!available || done}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border bg-card p-2 text-left transition-colors",
                    isSelected ? "border-primary ring-2 ring-primary/40" : "border-border",
                    available ? "hover:border-primary" : "cursor-not-allowed opacity-60",
                  )}
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-muted/40">
                    <img
                      src={p.image_url}
                      alt={`${p.name} — ${p.unit_label}`}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs font-medium text-foreground">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.unit_label}</p>
                  <Badge
                    variant={available ? "secondary" : "destructive"}
                    className="mt-1.5 text-[10px] font-medium uppercase tracking-wide"
                  >
                    {available ? "In bank" : "Rented out"}
                  </Badge>
                  {isSelected && (
                    <span className="absolute right-3 top-3 rounded-full bg-primary p-1 text-primary-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {done
              ? "Your prop selection is sealed."
              : `${selected.length} prop${selected.length === 1 ? "" : "s"} selected`}
          </p>
          {done ? (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          ) : (
            <Button onClick={finish} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Finish
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropsDialog;