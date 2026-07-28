import { useEffect, useState } from "react";
import { CalendarClock, Clock, Lock, MapPin, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/data/rentalCatalog";

export type BookingLine = { id: string; name: string; qty: number; price: number; lineTotal: number };

export type BookingLookup = {
  reservation: {
    reference: string;
    booking_code: string | null;
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    items: BookingLine[];
    days: number;
    start_date: string | null;
    end_date: string | null;
    location: string;
    call_time: string;
    total: number;
    amount_paid: number;
    status: string;
    runners: { name: string; phone: string; avatar_url: string | null } | null;
  };
  amendments: {
    reference: string;
    added_items: BookingLine[];
    removed_items: BookingLine[];
    amount: number;
    paid_at: string | null;
  }[];
  pickupAt: string | null;
  editable: boolean;
  cutoffHours: number;
};

const useCountdown = (target: string | null) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  if (!target) return null;
  const diff = new Date(target).getTime() - now;
  return diff;
};

const formatCountdown = (ms: number) => {
  const abs = Math.abs(ms);
  const hours = Math.floor(abs / 3600000);
  const minutes = Math.floor((abs % 3600000) / 60000);
  if (hours >= 48) return `${Math.floor(hours / 24)} days`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? "" : "s"}${minutes ? ` ${minutes}m` : ""}`;
  return `${minutes} minutes`;
};

const BookingStatusCard = ({
  booking,
  amending,
  onAmend,
  onCancelAmend,
  onClose,
}: {
  booking: BookingLookup;
  amending: boolean;
  onAmend: () => void;
  onCancelAmend: () => void;
  onClose: () => void;
}) => {
  const r = booking.reservation;
  const diff = useCountdown(booking.pickupAt);

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-[hsl(var(--surface))]">
      <div className="grid lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* Countdown anchor */}
        <div className="bg-slate-900 text-slate-100 p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Booking reference
              </p>
              <p className="mt-1 font-mono text-xl font-semibold tracking-[0.2em]">
                {r.booking_code}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close booking"
              className="text-slate-400 hover:text-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-xl bg-slate-800/70 p-4">
            <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              {diff !== null && diff > 0 ? "Time to pick up" : "Pick up"}
            </div>
            <p className="mt-2 text-2xl font-semibold">
              {diff === null
                ? "Dates to confirm"
                : diff > 0
                  ? `${formatCountdown(diff)} before pick up time`
                  : `Started ${formatCountdown(diff)} ago`}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {booking.editable
                ? `You can change this gear list until ${booking.cutoffHours} hours before your call time.`
                : `Changes are closed — we lock gear lists ${booking.cutoffHours} hours before call time.`}
            </p>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p className="flex items-center gap-2">
              <CalendarClock className="w-3.5 h-3.5 text-slate-500" />
              {r.start_date ?? "—"}
              {r.end_date && r.end_date !== r.start_date ? ` → ${r.end_date}` : ""} · {r.days} day
              {r.days > 1 ? "s" : ""}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {r.location} · call time {r.call_time}
            </p>
          </div>

          {r.runners && (
            <div className="mt-auto flex items-center gap-3 border-t border-slate-800 pt-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center text-sm">
                {r.runners.avatar_url ? (
                  <img
                    src={r.runners.avatar_url}
                    alt={r.runners.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  r.runners.name.charAt(0)
                )}
              </div>
              <div className="text-sm">
                <p className="text-[11px] uppercase tracking-wider text-slate-400">
                  Lighting Operator
                </p>
                <p className="font-medium">{r.runners.name}</p>
                <a href={`tel:${r.runners.phone}`} className="text-slate-400 hover:text-slate-100">
                  {r.runners.phone}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Gear + actions */}
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Your booking</h2>
              <p className="mt-1 text-sm text-foreground/60">
                {r.contact_name} · {r.contact_email}
              </p>
            </div>
            {booking.editable ? (
              amending ? (
                <Button variant="outline" className="rounded-full gap-2" onClick={onCancelAmend}>
                  <X className="w-4 h-4" /> Exit change mode
                </Button>
              ) : (
                <Button className="rounded-full gap-2" onClick={onAmend}>
                  <Pencil className="w-4 h-4" /> Change gear list
                </Button>
              )
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-foreground/60">
                <Lock className="w-3.5 h-3.5" /> Changes closed
              </span>
            )}
          </div>

          <ul className="mt-5 space-y-2 text-sm">
            {r.items?.map((i) => (
              <li key={i.id ?? i.name} className="flex justify-between gap-4">
                <span className="text-foreground/80">
                  {i.qty} × {i.name}
                </span>
                <span className="tabular-nums">{formatNaira(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm font-medium">
            <span>Paid to date</span>
            <span>{formatNaira(r.amount_paid || r.total)}</span>
          </div>

          {booking.amendments.length > 0 && (
            <div className="mt-5 rounded-lg border border-border bg-background p-4">
              <p className="text-xs uppercase tracking-wider text-foreground/50">Change history</p>
              <ul className="mt-2 space-y-1 text-xs text-foreground/70">
                {booking.amendments.map((a) => (
                  <li key={a.reference} className="flex justify-between gap-4">
                    <span>
                      {a.added_items.map((i) => `+${i.qty} ${i.name}`).join(", ") || "Swap"}
                      {a.removed_items.length
                        ? ` · ${a.removed_items.map((i) => `−${i.qty} ${i.name}`).join(", ")}`
                        : ""}
                    </span>
                    <span className="tabular-nums">{formatNaira(a.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-5 text-xs text-foreground/55">
            Gear you've already paid for stays on the booking — you can add more or swap for
            equal-or-higher value kit, and pay only the difference. Removals and refunds aren't
            possible after payment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BookingStatusCard;
