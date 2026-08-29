import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    setDone(true);
    toast.success("Password updated.");
  };

  return (
    <main className="contributor-shell min-h-screen bg-[hsl(var(--page-light))] text-[hsl(var(--page-light-foreground))] flex items-center justify-center px-6 py-16">
      <Seo
        title="Reset password — Everyone Can Light"
        description="Set a new password for your Everyone Can Light account."
        path="/reset-password"
      />
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-medium tracking-tight">Set a new password</h1>

        {done ? (
          <>
            <p className="mt-3 text-sm text-[hsl(var(--page-light-foreground))]/70">
              Your password has been changed. You can continue to your dashboard.
            </p>
            <Button className="mt-6 rounded-full w-full" onClick={() => navigate("/contributors")}>
              Go to dashboard
            </Button>
          </>
        ) : !ready ? (
          <p className="mt-3 text-sm text-[hsl(var(--page-light-foreground))]/70">
            Open this page from the reset link in your email. If the link has expired, request a new one from
            the sign-in page.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="np">New password</Label>
              <Input
                id="np"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="np2">Confirm password</Label>
              <Input
                id="np2"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};

export default ResetPassword;
