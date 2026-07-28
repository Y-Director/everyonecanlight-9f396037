import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatNaira } from "@/data/rentalCatalog";

export type BookingSummary = {
  reference: string;
  booking_code: string | null;
  contact_name: string | null;
  contact_email: string | null;
  items: { name: string; qty: number; price: number; lineTotal: number }[];
  days: number;
  start_date: string | null;
  end_date: string | null;
  location: string;
  call_time: string;
  total: number;
  runners: { name: string; phone: string; avatar_url: string | null } | null;
  rental_customers: { full_name: string; email: string } | null;
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—";

const BookingSummaryDialog = ({
  reservation,
  open,
  onOpenChange,
}: {
  reservation: BookingSummary;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const name =
    reservation.contact_name ?? reservation.rental_customers?.full_name ?? "Client";
  const email =
    reservation.contact_email ?? reservation.rental_customers?.email ?? "";

  const download = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const dataUrl = await toJpeg(cardRef.current, {
        quality: 0.72,
        pixelRatio: 2,
        backgroundColor: "#0b0b0c",
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `ECL-Booking-${reservation.booking_code ?? reservation.reference}.jpg`;
      a.click();
      toast.success("Summary downloaded", {
        description: email ? `A copy is also on its way to ${email}.` : undefined,
      });
    } catch {
      toast.error("We could not generate the summary image.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-0 gap-0 overflow-hidden bg-transparent border-0 shadow-none">
        <div
          ref={cardRef}
          className="rounded-2xl border border-primary/30 bg-[#0b0b0c] text-white p-6"
        >
          <div className="flex items-center justify-between">
            <img src={logo} alt="Everyone Can Light" className="h-6 w-auto" />
            <span className="mr-7 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/60 bg-emerald-500/25 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
            </span>
          </div>

          <h2 className="mt-5 text-lg font-semibold">Rental Confirmation</h2>
          <p className="text-xs text-white/60">Your booking has been confirmed</p>
          <p className="text-xs text-white/45">Hi {name}, your gear is locked in.</p>

          <div className="mt-4 rounded-lg border border-white/15 px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-white/45">
              Booking reference
            </div>
            <div className="font-mono text-xl font-semibold tracking-[0.22em]">
              {reservation.booking_code ?? reservation.reference}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-white/45">Day(s)</div>
              <div className="mt-0.5">{reservation.days}</div>
            </div>
            <div>
              <div className="text-white/45">Pick up time</div>
              <div className="mt-0.5">{reservation.call_time}</div>
            </div>
            <div>
              <div className="text-white/45">Date(s)</div>
              <div className="mt-0.5">
                {fmtDate(reservation.start_date)}
                {reservation.end_date && reservation.end_date !== reservation.start_date
                  ? ` – ${fmtDate(reservation.end_date)}`
                  : ""}
              </div>
            </div>
            <div>
              <div className="text-white/45">Location</div>
              <div className="mt-0.5">{reservation.location}</div>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[10px] uppercase tracking-wider text-white/45">Gear list</div>
            <ul className="mt-2 space-y-1.5 text-xs">
              {reservation.items?.map((i) => (
                <li key={i.name} className="flex justify-between gap-3">
                  <span className="text-white/80">
                    {i.qty} × {i.name}
                  </span>
                  <span className="tabular-nums text-white/60">{formatNaira(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-2 border-t border-white/15 flex justify-between text-xs font-medium">
              <span>Total paid</span>
              <span>{formatNaira(reservation.total)}</span>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/45">
              Lighting Operator assigned
            </div>
            {reservation.runners ? (
              <div className="mt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-xs">
                  {reservation.runners.avatar_url ? (
                    <img
                      src={reservation.runners.avatar_url}
                      alt={reservation.runners.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    reservation.runners.name.charAt(0)
                  )}
                </div>
                <div className="text-xs">
                  <div className="font-medium">{reservation.runners.name}</div>
                  <div className="text-white/55">{reservation.runners.phone}</div>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-white/55">
                Assigned and shared with you before your pick up time.
              </p>
            )}
          </div>

          <p className="mt-5 text-[10px] text-white/35">
            everyonecanlight.com · Present this reference at pick up.
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          <Button onClick={download} disabled={saving} className="flex-1 gap-2 rounded-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download summary (JPG)
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSummaryDialog;