import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import {
  ArrowRight,
  CalendarIcon,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import SiteNav from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  RENTAL_CATEGORIES,
  formatNaira,
  getRentalItem,
  getSuggestions,
  rentalCatalog,
  type RentalCategory,
} from "@/data/rentalCatalog";

type Cart = Record<string, number>;
type Step = "details" | "kyc" | "payment";

const LOCATIONS = ["Lagos Island", "Lagos Mainland", "Outside Lagos"];
const STORAGE_KEY = "ecl-gear-list";

type Reservation = {
  reference: string;
  booking_code: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  items: { name: string; qty: number; price: number; lineTotal: number }[];
  days: number;
  start_date: string | null;
  end_date: string | null;
  location: string;
  call_time: string;
  total: number;
  status: string;
  runners: { name: string; phone: string; avatar_url: string | null } | null;
  rental_customers: { full_name: string; email: string } | null;
};

const QtyStepper = ({
  qty,
  onChange,
  size = "md",
}: {
  qty: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) => (
  <div
    className={cn(
      "inline-flex items-center rounded-full border border-border bg-background",
      size === "sm" ? "gap-1" : "gap-2"
    )}
  >
    <button
      type="button"
      aria-label="Decrease quantity"
      onClick={() => onChange(Math.max(0, qty - 1))}
      disabled={qty === 0}
      className={cn(
        "flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground disabled:opacity-30",
        size === "sm" ? "w-7 h-7" : "w-8 h-8"
      )}
    >
      <Minus className="w-3.5 h-3.5" />
    </button>
    <span className="min-w-[1.5rem] text-center text-sm tabular-nums">{qty}</span>
    <button
      type="button"
      aria-label="Increase quantity"
      onClick={() => onChange(qty + 1)}
      className={cn(
        "flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground",
        size === "sm" ? "w-7 h-7" : "w-8 h-8"
      )}
    >
      <Plus className="w-3.5 h-3.5" />
    </button>
  </div>
);

const RentEquipment = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All Gear" | RentalCategory>("All Gear");
  const [cart, setCart] = useState<Cart>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      return {};
    }
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [step, setStep] = useState<Step>("details");

  // Reservation details
  const [dates, setDates] = useState<Date[] | undefined>();
  const [manualDays, setManualDays] = useState(1);
  const [location, setLocation] = useState("");
  const [callTime, setCallTime] = useState("07:00");

  // KYC
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [returning, setReturning] = useState<boolean | null>(null);
  const [checkingAccount, setCheckingAccount] = useState(false);
  const [idType, setIdType] = useState("");
  const [idImage, setIdImage] = useState<string | null>(null);
  const [idFileName, setIdFileName] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [kycStatus, setKycStatus] = useState<"idle" | "pending" | "rejected" | "approved">("idle");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [paying, setPaying] = useState(false);

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Verify payment when Paystack redirects back.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") ?? params.get("trxref");
    if (!reference) return;
    setCheckingPayment(true);
    supabase.functions
      .invoke("rental-verify", { body: { reference } })
      .then(({ data, error }) => {
        if (error) throw error;
        if (data?.paid) {
          setReservation(data.reservation as Reservation);
          setCart({});
          toast.success("Reservation completed", {
            description: "A confirmation has been sent to your email.",
          });
        } else {
          toast.error("Payment was not completed.");
        }
      })
      .catch(() => toast.error("We could not confirm your payment."))
      .finally(() => {
        setCheckingPayment(false);
        window.history.replaceState({}, "", "/rent-equipment");
      });
  }, []);

  const cartIds = useMemo(() => Object.keys(cart).filter((id) => cart[id] > 0), [cart]);
  const cartCount = useMemo(
    () => cartIds.reduce((sum, id) => sum + cart[id], 0),
    [cartIds, cart]
  );
  const suggestions = useMemo(() => getSuggestions(cartIds), [cartIds]);

  const days = useMemo(() => {
    if (dates && dates.length > 0) return dates.length;
    return manualDays;
  }, [dates, manualDays]);

  const lineItems = useMemo(
    () =>
      cartIds.map((id) => {
        const item = getRentalItem(id)!;
        return { ...item, qty: cart[id], lineTotal: item.price * cart[id] * days };
      }),
    [cartIds, cart, days]
  );
  const total = useMemo(() => lineItems.reduce((s, i) => s + i.lineTotal, 0), [lineItems]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rentalCatalog.filter(
      (i) =>
        (category === "All Gear" || i.category === category) &&
        (!q || i.name.toLowerCase().includes(q))
    );
  }, [query, category]);

  const setQty = (id: string, next: number, itemName: string) => {
    setCart((prev) => {
      const current = prev[id] ?? 0;
      if (next > current) {
        toast("Item added to Gear List", { description: itemName, duration: 1500 });
      }
      const updated = { ...prev, [id]: next };
      if (next <= 0) delete updated[id];
      return updated;
    });
  };

  const sortedDates = useMemo(
    () => (dates ? [...dates].sort((a, b) => a.getTime() - b.getTime()) : []),
    [dates]
  );

  const handleIdUpload = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setIdImage(String(reader.result));
      setIdFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const checkEmail = async (value: string) => {
    const clean = value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
      setReturning(null);
      return;
    }
    setCheckingAccount(true);
    try {
      const { data } = await supabase.functions.invoke("rental-kyc", {
        body: { action: "check", email: clean },
      });
      const isReturning = Boolean(data?.returning);
      setReturning(isReturning);
      if (isReturning) {
        toast.success("Welcome back — we recognise you.", { duration: 1800 });
        if (data?.fullName && !fullName) setFullName(data.fullName);
        if (data?.phone && !phone) setPhone(String(data.phone).replace(/^\+234/, ""));
        if (data?.status === "rejected") {
          setKycStatus("rejected");
          setRejectionReason(data?.rejectionReason ?? null);
        } else if (data?.status === "pending") {
          setKycStatus("pending");
        } else if (data?.status === "verified") {
          setKycStatus("approved");
          if (data?.customerId) setCustomerId(data.customerId);
        }
      } else {
        toast("A new face — lovely to have you here.", { duration: 1800 });
        setKycStatus("idle");
        setRejectionReason(null);
      }
    } finally {
      setCheckingAccount(false);
    }
  };

  const verifyIdentity = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("rental-kyc", {
        body: {
          action: "submit",
          fullName,
          email,
          phone: `+234${phone.replace(/\D/g, "").replace(/^0/, "")}`,
          idType: idType || undefined,
          idImage: idImage || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setCustomerId(data.customerId);
      if (data.status === "verified") {
        setKycStatus("approved");
        toast.success("Identity approved", { duration: 1800 });
        setStep("payment");
        return;
      }
      setKycStatus(data.status === "rejected" ? "rejected" : "pending");
      setRejectionReason(data.rejectionReason ?? null);
      if (data.status !== "rejected") setCooldown(300);
    } catch {
      toast.error("We could not verify your identity. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    if (kycStatus !== "pending" || !email) return;
    const poll = async () => {
      const { data } = await supabase.functions.invoke("rental-kyc", {
        body: { action: "status", email: email.trim() },
      });
      if (data?.customerId) setCustomerId(data.customerId);
      if (data?.status === "verified") {
        setKycStatus("approved");
        toast.success("Identity approved", { duration: 1800 });
        setStep("payment");
      } else if (data?.status === "rejected") {
        setKycStatus("rejected");
        setRejectionReason(data?.rejectionReason ?? null);
      }
    };
    const t = setInterval(poll, 10000);
    return () => clearInterval(t);
  }, [kycStatus, email]);

  const startPayment = async () => {
    if (!customerId) return;
    setPaying(true);
    try {
      const { data, error } = await supabase.functions.invoke("rental-initialize", {
        body: {
          customerId,
          days,
          location,
          callTime,
          startDate: sortedDates[0] ? format(sortedDates[0], "yyyy-MM-dd") : null,
          endDate: sortedDates.length
            ? format(sortedDates[sortedDates.length - 1], "yyyy-MM-dd")
            : null,
          items: lineItems.map((i) => ({ id: i.id, name: i.name, qty: i.qty })),
          callbackUrl: `${window.location.origin}/rent-equipment`,
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      window.location.href = data.authorization_url;
    } catch {
      toast.error("Could not start payment. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const detailsValid = Boolean(location) && Boolean(callTime) && lineItems.length > 0;
  const kycBaseValid =
    fullName.trim().length > 1 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
    phone.replace(/\D/g, "").length >= 10;
  const kycValid = kycBaseValid && (returning === true || (Boolean(idType) && Boolean(idImage)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <SiteNav />

        <main className="flex-1 px-8 max-w-[1400px] mx-auto w-full py-12">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-semibold">Rent Equipment</h1>
              <p className="mt-3 text-foreground/60 text-sm md:text-base">
                The ECL Light Bank. Build your gear list, pick your dates, and we'll send it out
                with a lighting operator.
              </p>
            </div>
            <Button
              onClick={() => setSheetOpen(true)}
              className="relative self-start lg:self-auto gap-2 rounded-full px-5"
            >
              <ShoppingBag className="w-4 h-4" />
              Gear List
              <ArrowRight className="w-4 h-4 -rotate-45" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center border border-background">
                  {cartCount}
                </span>
              )}
            </Button>
          </header>

          {reservation && (
            <section className="mt-10 rounded-xl border border-primary/40 bg-[hsl(var(--surface))] p-6">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <h2 className="font-semibold">Reservation Completed</h2>
              </div>
              <p className="mt-1 text-sm text-foreground/60">
                {reservation.days} day
                {reservation.days > 1 ? "s" : ""} · Call time {reservation.call_time} ·{" "}
                {reservation.location}
              </p>
              {reservation.booking_code && (
                <div className="mt-4 inline-flex items-center gap-3 rounded-lg border border-foreground/15 bg-background px-4 py-3">
                  <span className="text-xs uppercase tracking-wider text-foreground/50">
                    Booking reference
                  </span>
                  <span className="font-mono text-lg font-semibold tracking-[0.2em]">
                    {reservation.booking_code}
                  </span>
                </div>
              )}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-foreground/50">Gear list</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {reservation.items?.map((i) => (
                      <li key={i.name} className="flex justify-between gap-4">
                        <span className="text-foreground/80">
                          {i.qty} × {i.name}
                        </span>
                        <span className="tabular-nums">{formatNaira(i.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm font-medium">
                    <span>Total paid</span>
                    <span>{formatNaira(reservation.total)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-foreground/50">
                    Lighting Operator assigned
                  </h3>
                  {reservation.runners ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center text-sm">
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
                      <div className="text-sm">
                        <div className="font-medium">{reservation.runners.name}</div>
                        <a
                          href={`tel:${reservation.runners.phone}`}
                          className="text-foreground/60 hover:text-foreground"
                        >
                          {reservation.runners.phone}
                        </a>
                        <p className="mt-1 text-xs text-foreground/50">
                          Escorts your gear to location, monitors safety on set, and returns it to
                          the warehouse.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-foreground/60">
                      A lighting operator will be assigned and shared with you before your call time.
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {checkingPayment && (
            <p className="mt-8 flex items-center gap-2 text-sm text-foreground/60">
              <Loader2 className="w-4 h-4 animate-spin" /> Confirming your payment…
            </p>
          )}

          <div className="mt-10 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="relative w-full lg:w-[360px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50"
                aria-hidden="true"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the Light Bank"
                className="w-full bg-muted/40 border border-border rounded-full pl-11 pr-4 py-3 text-sm placeholder:text-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {RENTAL_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`transition-colors ${
                    category === c ? "text-foreground" : "text-foreground/55 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </nav>
          </div>

          {suggestions.length > 0 && (
            <section className="mt-8 rounded-xl border border-border bg-[hsl(var(--surface))] p-5">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="font-medium">Suggested with your lights</span>
                <span className="text-foreground/50">
                  · support, power and cable you'll likely need on set
                </span>
              </div>
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                  >
                    <div className="w-12 h-12 rounded bg-white flex items-center justify-center p-1 shrink-0">
                      <img src={s.image} alt={s.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{s.name}</p>
                      <p className="text-xs text-foreground/55">{formatNaira(s.price)} / day</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setQty(s.id, (cart[s.id] ?? 0) + 1, s.name)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-sm bg-card transition-shadow hover:shadow-lg"
              >
                <div className="aspect-square bg-white flex items-center justify-center p-6 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  {item.comingSoon && (
                    <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wide bg-foreground/80 text-background px-2 py-0.5 rounded">
                      Coming soon
                    </span>
                  )}
                </div>
                <div className="bg-[#373737] text-white text-center py-4 px-3 flex-1 flex flex-col items-center gap-3">
                  <p className="text-sm leading-snug">{item.name}</p>
                  <p className="text-sm font-medium text-white/90">
                    {formatNaira(item.price)}
                    <span className="text-white/50 text-xs"> / day</span>
                  </p>
                  <div className="mt-auto pt-1">
                    {item.comingSoon ? (
                      <span className="text-xs text-white/50">Not yet available</span>
                    ) : (
                      <QtyStepper
                        size="sm"
                        qty={cart[item.id] ?? 0}
                        onChange={(n) => setQty(item.id, n, item.name)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-12 text-center text-foreground/60">No gear matches that search.</p>
          )}
        </main>

        <footer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 px-8 border-t border-border text-sm bg-[hsl(var(--surface))] text-foreground mt-12">
          <div className="flex items-center gap-3 text-foreground/70">
            <img src={logo} alt="EveryoneCanLight logo" className="w-6 h-6 rounded object-contain" />
            © 2026 Everyone Can Light Technologies
          </div>
          <div className="flex items-center gap-6">
            <span className="text-foreground/50">Social</span>
            <a href="https://www.instagram.com/everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Instagram</a>
            <a href="https://www.youtube.com/@everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">YouTube</a>
            <a href="https://www.tiktok.com/@everyonecanlight" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">TikTok</a>
            <a href="https://www.linkedin.com/company/everyone-can-light/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">LinkedIn</a>
          </div>
        </footer>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {step === "details" && "Your Gear List"}
              {step === "kyc" && "Confirm your identity"}
              {step === "payment" && "Reservation summary"}
            </SheetTitle>
          </SheetHeader>

          {lineItems.length === 0 ? (
            <p className="mt-8 text-sm text-foreground/60">
              Your gear list is empty. Add equipment to get started.
            </p>
          ) : (
            <div className="mt-6 space-y-8 pb-10">
              {step === "details" && (
                <>
                  <div>
                    <Label className="text-xs uppercase tracking-wider text-foreground/50">
                      Rental dates
                    </Label>
                    <p className="mt-1 text-xs text-foreground/55">
                      Tip: tap each day you need the gear — select multiple dates for a multi-day
                      shoot.
                    </p>
                    <div className="mt-3 rounded-lg border border-border">
                      <Calendar
                        mode="multiple"
                        selected={dates}
                        onSelect={setDates}
                        disabled={{ before: new Date() }}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-foreground/70">Rental days</span>
                      {dates && dates.length > 0 ? (
                        <span className="text-sm tabular-nums">{dates.length} selected</span>
                      ) : (
                        <QtyStepper
                          qty={manualDays}
                          onChange={(n) => setManualDays(Math.max(1, n))}
                        />
                      )}
                    </div>
                    {sortedDates.length > 0 && (
                      <p className="mt-2 text-xs text-foreground/55 flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {format(sortedDates[0], "d MMM")} –{" "}
                        {format(sortedDates[sortedDates.length - 1], "d MMM yyyy")}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label className="text-xs uppercase tracking-wider text-foreground/50">
                        Pickup location
                      </Label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATIONS.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label
                        htmlFor="call-time"
                        className="text-xs uppercase tracking-wider text-foreground/50"
                      >
                        Call time for pickup
                      </Label>
                      <Input
                        id="call-time"
                        type="time"
                        min="05:30"
                        step={900}
                        value={callTime}
                        onChange={(e) => setCallTime(e.target.value)}
                        className="mt-2"
                      />
                      <p className="mt-2 text-xs text-foreground/55">
                        The Light Bank opens from 5:30 AM. Note: returns after 11:00 PM attract a
                        full extra day's payment.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wider text-foreground/50">
                      Summary
                    </Label>
                    <ul className="mt-3 space-y-3">
                      {lineItems.map((i) => (
                        <li key={i.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-white flex items-center justify-center p-1 shrink-0">
                            <img
                              src={i.image}
                              alt={i.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate">{i.name}</p>
                            <p className="text-xs text-foreground/55">
                              {formatNaira(i.price)} / day × {days} day{days > 1 ? "s" : ""}
                            </p>
                          </div>
                          <QtyStepper
                            size="sm"
                            qty={i.qty}
                            onChange={(n) => setQty(i.id, n, i.name)}
                          />
                          <button
                            type="button"
                            aria-label={`Remove ${i.name}`}
                            onClick={() => setQty(i.id, 0, i.name)}
                            className="text-foreground/40 hover:text-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm font-medium">
                      <span>Total ({days} day{days > 1 ? "s" : ""})</span>
                      <span>{formatNaira(total)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!detailsValid}
                    onClick={() => setStep("kyc")}
                  >
                    Continue to Reservation
                  </Button>
                </>
              )}

              {step === "kyc" && (
                <>
                  <p className="text-sm text-foreground/60">
                    Start with your email address — we'll check if you've rented with us before and
                    only ask for what's still missing.
                  </p>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="kyc-email">Email address</Label>
                      <Input
                        id="kyc-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setReturning(null);
                        }}
                        onBlur={(e) => checkEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-2"
                      />
                      {checkingAccount && (
                        <p className="mt-2 text-xs text-foreground/55 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Checking your details…
                        </p>
                      )}
                      {!checkingAccount && returning === true && (
                        <p className="mt-2 text-xs text-primary">
                          Welcome back — your ID is already on file, nothing else needed.
                        </p>
                      )}
                      {!checkingAccount && returning === false && (
                        <p className="mt-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-foreground/70">
                          Looks like this is your first rental with us. We'll confirm your identity
                          just this once — after today, you'll never be asked again.
                        </p>
                      )}
                    </div>
                    <div
                      className={cn(
                        "grid gap-4 transition-opacity",
                        returning === null
                          ? "opacity-40 pointer-events-none select-none"
                          : "opacity-100"
                      )}
                      aria-disabled={returning === null}
                    >
                      <div>
                        <Label htmlFor="kyc-name">Full name (as it appears on your ID)</Label>
                        <Input
                          id="kyc-name"
                          value={fullName}
                          disabled={returning === null}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Adebayo Johnson"
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="kyc-phone">Phone number</Label>
                        <div className="mt-2 flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-foreground font-medium">
                            🇳🇬 +234
                          </span>
                          <Input
                            id="kyc-phone"
                            inputMode="tel"
                            value={phone}
                            disabled={returning === null}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="801 234 5678"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "grid gap-4 transition-opacity",
                        returning === false
                          ? "opacity-100"
                          : "opacity-40 pointer-events-none select-none"
                      )}
                      aria-disabled={returning !== false}
                    >
                        <div>
                          <Label>Government issued ID type</Label>
                          <Select
                            value={idType}
                            onValueChange={setIdType}
                            disabled={returning !== false}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select ID type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Passport">International Passport</SelectItem>
                              <SelectItem value="Drivers License">Driver's License</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Upload a clear image of your ID</Label>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleIdUpload(f);
                            }}
                          />
                          <button
                            type="button"
                            disabled={returning !== false}
                            onClick={() => fileRef.current?.click()}
                            className="mt-2 w-full rounded-lg border border-dashed border-border py-6 text-sm text-foreground/60 hover:text-foreground hover:border-foreground/40 flex flex-col items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            {idFileName || "Choose an image (JPG or PNG, max 8MB)"}
                          </button>
                          {idImage && (
                            <img
                              src={idImage}
                              alt="ID preview"
                              className="mt-3 w-full max-h-48 object-contain rounded-lg border border-border"
                            />
                          )}
                        </div>
                    </div>
                  </div>

                  {kycStatus === "pending" && (
                    <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
                      <div className="flex items-center gap-2 font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Hang tight — we're confirming your identity
                      </div>
                      <p className="mt-2 text-foreground/65 text-xs">
                        Our team is reviewing your document now. This page updates automatically
                        once it's approved.
                      </p>
                      {cooldown > 0 && (
                        <p className="mt-2 text-xs text-foreground/55">
                          You can resubmit in {Math.floor(cooldown / 60)}:
                          {String(cooldown % 60).padStart(2, "0")}
                        </p>
                      )}
                    </div>
                  )}

                  {kycStatus === "rejected" && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
                      <div className="font-medium text-destructive">
                        We couldn't approve this ID
                      </div>
                      <p className="mt-2 text-xs text-foreground/75">
                        Reason: {rejectionReason ?? "Identity concerns"}
                      </p>
                      <p className="mt-2 text-xs text-foreground/65">
                        Upload a clearer, valid document and try again, or write to us at{" "}
                        <a className="underline text-primary" href="mailto:cx@everyonecanlight.com">
                          cx@everyonecanlight.com
                        </a>{" "}
                        to dispute this decision.
                      </p>
                    </div>
                  )}

                  {kycStatus === "approved" && (
                    <div className="flex items-center gap-2 text-sm text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("details")}>
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={
                        !kycValid ||
                        verifying ||
                        kycStatus === "pending" ||
                        (kycStatus === "rejected" && cooldown > 0)
                      }
                      onClick={verifyIdentity}
                    >
                      {verifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {kycStatus === "pending"
                        ? "Awaiting approval…"
                        : cooldown > 0 && kycStatus === "rejected"
                          ? `Try again in ${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, "0")}`
                          : returning === true && kycStatus === "approved"
                            ? "Proceed"
                            : "Confirm my identity"}
                    </Button>
                  </div>
                </>
              )}

              {step === "payment" && (
                <>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="w-4 h-4" /> Identity verified
                  </div>
                  <div className="rounded-lg border border-border p-4 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Name</span>
                      <span>{fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Pickup</span>
                      <span>
                        {location} · {callTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Days</span>
                      <span>{days}</span>
                    </div>
                    {sortedDates.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Dates</span>
                        <span>
                          {format(sortedDates[0], "d MMM")} –{" "}
                          {format(sortedDates[sortedDates.length - 1], "d MMM yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm">
                    {lineItems.map((i) => (
                      <li key={i.id} className="flex justify-between gap-4">
                        <span className="text-foreground/80">
                          {i.qty} × {i.name}
                        </span>
                        <span className="tabular-nums">{formatNaira(i.lineTotal)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-border flex justify-between font-medium">
                    <span>Total due</span>
                    <span>{formatNaira(total)}</span>
                  </div>
                  <Button className="w-full" disabled={paying} onClick={startPayment}>
                    {paying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Pay {formatNaira(total)}
                  </Button>
                  <p className="text-xs text-foreground/50 text-center">
                    Secure checkout by Paystack. A confirmation email follows your payment.
                  </p>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RentEquipment;