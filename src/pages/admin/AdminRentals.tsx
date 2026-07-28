import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Boxes,
  Crown,
  GraduationCap,
  Loader2,
  LogOut,
  Package,
  ShieldAlert,
  UserCog,
  Users,
  Contact,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import RentalsSection from "@/components/admin/RentalsSection";
import MasterclassSection from "@/components/admin/MasterclassSection";
import CoursesSection from "@/components/admin/CoursesSection";
import AdminsSection from "@/components/admin/AdminsSection";
import TeamSection from "@/components/admin/TeamSection";
import InventorySection from "@/components/admin/InventorySection";

type Account = {
  email: string;
  is_super: boolean;
  status: string;
  sections: string[];
};

type TabKey = "rentals" | "masterclass" | "courses" | "team" | "operators" | "admins" | "inventory";

const TABS: { key: TabKey; label: string; icon: typeof Package }[] = [
  { key: "admins", label: "Admins", icon: UserCog },
  { key: "courses", label: "Courses", icon: GraduationCap },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "operators", label: "Lighting Operators", icon: Zap },
  { key: "masterclass", label: "Masterclass", icon: Users },
  { key: "rentals", label: "Rentals", icon: Package },
  { key: "team", label: "Team Members", icon: Contact },
].sort((a, b) => a.label.localeCompare(b.label)) as { key: TabKey; label: string; icon: typeof Package }[];

const AdminRentals = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [account, setAccount] = useState<Account | null>(null);
  const [tab, setTab] = useState<TabKey>("rentals");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/admin", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email;
      if (!userData.user || !email) {
        navigate("/admin", { replace: true });
        return;
      }
      const { data } = await supabase
        .from("admin_accounts")
        .select("email, is_super, status, sections")
        .ilike("email", email)
        .maybeSingle();
      setAccount(data && data.status === "active" ? (data as Account) : null);
      setChecking(false);
    })();
  }, [navigate]);

  const allowed = useMemo(() => {
    if (!account) return [] as TabKey[];
    if (account.is_super) return TABS.map((t) => t.key);
    return TABS.filter(
      (t) =>
        t.key !== "admins" &&
        account.sections.includes(t.key === "operators" ? "team" : t.key),
    ).map((t) => t.key);
  }, [account]);

  useEffect(() => {
    if (allowed.length && !allowed.includes(tab)) setTab(allowed[0]);
  }, [allowed, tab]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin", { replace: true });
  };

  if (checking) {
    return (
      <main className="min-h-screen bg-background text-foreground grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-foreground/50" />
      </main>
    );
  }

  if (!account || allowed.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground grid place-items-center px-6">
        <div className="max-w-sm text-center">
          <ShieldAlert className="w-8 h-8 mx-auto text-amber-400" />
          <h1 className="mt-4 font-semibold">No dashboard access</h1>
          <p className="mt-2 text-sm text-foreground/60">
            {account
              ? "This admin account has no sections assigned yet. Ask the super admin to grant access."
              : "This account is signed in but has not been granted admin access."}
          </p>
          <Button variant="outline" className="mt-6" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </main>
    );
  }

  const Icon = account.is_super ? Crown : UserCog;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-foreground/10 bg-[hsl(var(--surface))]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`grid place-items-center w-9 h-9 rounded-full border ${
                account.is_super
                  ? "border-[hsl(var(--cta))]/40 bg-[hsl(var(--cta))]/15 text-[hsl(var(--cta))]"
                  : "border-foreground/15 bg-foreground/5 text-foreground/60"
              }`}
            >
              <Icon className="w-4 h-4" />
            </span>
            <div>
              <h1 className="font-semibold leading-tight">Overall Dashboard</h1>
              <p className="text-xs text-foreground/50">
                {account.is_super ? "Super admin" : "Sub-admin"} · {account.email}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.filter((t) => allowed.includes(t.key)).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 -mb-px whitespace-nowrap ${
                tab === t.key
                  ? "border-[hsl(var(--cta))] text-foreground"
                  : "border-transparent text-foreground/50 hover:text-foreground/80"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {tab === "rentals" && <RentalsSection />}
        {tab === "masterclass" && <MasterclassSection />}
        {tab === "courses" && <CoursesSection />}
        {tab === "team" && <TeamSection view="team" />}
        {tab === "operators" && <TeamSection view="operators" />}
        {tab === "inventory" && <InventorySection />}
        {tab === "admins" && account.is_super && <AdminsSection />}
      </div>
    </main>
  );
};

export default AdminRentals;
