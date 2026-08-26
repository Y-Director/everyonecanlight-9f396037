import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useContributorSession } from "@/hooks/useContributor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";

const ContributorAuth = () => {
  const navigate = useNavigate();
  const { session, loading } = useContributorSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate("/contributors", { replace: true });
  }, [loading, session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/contributors`,
          data: { display_name: name.trim() || email.split("@")[0] },
        },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      if (!data.session) {
        setCheckEmail(true);
        return;
      }
      navigate("/contributors", { replace: true });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate("/contributors", { replace: true });
  };

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/contributors`,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate("/contributors", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[hsl(var(--page-light))] text-[hsl(var(--page-light-foreground))] flex items-center justify-center px-6 py-16">
      <Seo
        title="Contributor sign in — Everyone Can Light"
        description="Sign in to write and publish lighting articles and courses on Everyone Can Light."
        path="/contributors/auth"
      />
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <img src={logo} alt="EveryoneCanLight logo" className="w-9 h-9 rounded-md object-contain" />
          <span className="font-semibold">Contributors</span>
        </div>

        <h1 className="text-3xl font-medium tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-[hsl(var(--page-light-foreground))]/60">
          Write articles and courses for the Everyone Can Light community.
        </p>

        {checkEmail ? (
          <div className="mt-8 rounded-2xl border border-[hsl(var(--page-light-foreground))]/10 bg-[hsl(var(--card-mint))] p-5 text-sm">
            <p className="font-medium">Check your email</p>
            <p className="mt-1 text-[hsl(var(--page-light-foreground))]/70">
              We sent a confirmation link to {email}. Click it to finish creating your account.
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onGoogle}
              disabled={busy}
              className="mt-8 w-full h-11 rounded-full border border-[hsl(var(--page-light-foreground))]/15 bg-[hsl(var(--page-light))] text-sm font-medium hover:bg-[hsl(var(--page-light-foreground))]/5 transition disabled:opacity-60"
            >
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[hsl(var(--page-light-foreground))]/40">
              <span className="flex-1 h-px bg-[hsl(var(--page-light-foreground))]/10" />
              or
              <span className="flex-1 h-px bg-[hsl(var(--page-light-foreground))]/10" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="c-name">Display name</Label>
                  <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="How readers will see you" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="c-email">Email address</Label>
                <Input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-password">Password</Label>
                <Input
                  id="c-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={busy} className="w-full rounded-full">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
              className="mt-6 w-full text-center text-sm underline underline-offset-4 decoration-2 decoration-[hsl(var(--cta))]"
            >
              {mode === "signin" ? "New here? Create an account" : "I already have an account"}
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default ContributorAuth;
