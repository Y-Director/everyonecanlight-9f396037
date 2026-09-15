import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignInGateProps {
  title?: string;
  blurb?: string;
  /** Where to return after Google sign-in */
  redirectTo?: string;
}

/** Dark, site-styled sign-in card used to gate course videos. */
const SignInGate = ({
  title = "Sign in to watch",
  blurb = "Course videos are free — create a quick account to keep track of what you have watched.",
  redirectTo,
}: SignInGateProps) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const back = redirectTo ?? `${window.location.pathname}${window.location.search}`;

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${back}`,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}${back}` },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      if (!data.session) setCheckEmail(true);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-7">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10">
        <Lock className="h-4 w-4" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-2xl font-medium tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{blurb}</p>

      {checkEmail ? (
        <p className="mt-6 rounded-xl border border-foreground/10 p-4 text-sm text-foreground/70">
          We sent a verification link to {email}. Open it and you will land back on this lesson.
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="mt-6 w-full h-11 rounded-full border border-foreground/15 text-sm font-medium hover:bg-foreground/5 transition disabled:opacity-60"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-foreground/40">
            <span className="h-px flex-1 bg-foreground/10" />
            or
            <span className="h-px flex-1 bg-foreground/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gate-email">Email address</Label>
              <Input
                id="gate-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gate-password">Password</Label>
              <Input
                id="gate-password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full rounded-full">
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "signin" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-sm underline underline-offset-4 decoration-[hsl(var(--cta))] decoration-2"
          >
            {mode === "signin" ? "New here? Create an account" : "I already have an account"}
          </button>
        </>
      )}
    </div>
  );
};

export default SignInGate;
