import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuthSession } from "@/hooks/useAuthSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";

/** ECL-branded sign-in for the courses portal. */
const CoursesAuth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/courses";
  const { session, loading } = useAuthSession();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate(next, { replace: true });
  }, [loading, session, navigate, next]);

  const onGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${next}`,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate(next, { replace: true });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      setResetSent(true);
      return;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${next}`,
          data: { display_name: username.trim() || email.split("@")[0] },
        },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      if (!data.session) return setCheckEmail(true);
      navigate(next, { replace: true });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      if (/confirm/i.test(error.message)) {
        return toast.error("Please confirm your email first — check your inbox for the link.");
      }
      return toast.error(error.message);
    }
    navigate(next, { replace: true });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
      <Seo
        title="Sign in to Courses — Everyone Can Light"
        description="Sign in to watch Everyone Can Light video lessons and keep your watch progress."
        path="/courses/auth"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home page
        </Link>
        <div className="mb-8 flex items-center gap-2">
          <img src={logo} alt="Everyone Can Light logo" className="h-9 w-9 rounded-md object-contain" />
          <span className="font-semibold">Everyone Can Light</span>
        </div>

        <h1 className="text-3xl font-medium tracking-tight">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          {mode === "forgot"
            ? "We'll email you a secure link to set a new password."
            : "Easy to understand video lessons. Sign in to watch and save your progress."}
        </p>

        {checkEmail ? (
          <div className="mt-8 rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-5 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <MailCheck className="h-4 w-4" />
              Verify your email
            </p>
            <p className="mt-1 text-foreground/70">
              We sent a verification link to {email}. Open it and you'll land back in the lessons.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-4 rounded-full"
              onClick={() => {
                setCheckEmail(false);
                setMode("signin");
              }}
            >
              Back to sign in
            </Button>
          </div>
        ) : resetSent ? (
          <div className="mt-8 rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-5 text-sm">
            <p className="font-medium">Check your email</p>
            <p className="mt-1 text-foreground/70">We sent a password reset link to {email}.</p>
            <Button
              size="sm"
              variant="ghost"
              className="mt-4 rounded-full"
              onClick={() => {
                setResetSent(false);
                setMode("signin");
              }}
            >
              Back to sign in
            </Button>
          </div>
        ) : (
          <>
            {mode !== "forgot" && (
              <>
                <button
                  type="button"
                  onClick={onGoogle}
                  disabled={busy}
                  className="mt-8 h-11 w-full rounded-full border border-foreground/15 text-sm font-medium transition hover:bg-foreground/5 disabled:opacity-60"
                >
                  Continue with Google
                </button>
                <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-foreground/40">
                  <span className="h-px flex-1 bg-foreground/10" />
                  or
                  <span className="h-px flex-1 bg-foreground/10" />
                </div>
              </>
            )}

            <form onSubmit={onSubmit} className={`space-y-4 ${mode === "forgot" ? "mt-8" : ""}`}>
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="cv-username">Username</Label>
                  <Input
                    id="cv-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="What should we call you?"
                    autoComplete="nickname"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="cv-email">Email address</Label>
                <Input
                  id="cv-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cv-password">Password</Label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs underline decoration-[hsl(var(--cta))] underline-offset-4"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input
                    id="cv-password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              <Button type="submit" disabled={busy} className="w-full rounded-full">
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "signin" ? (
                  "Sign in"
                ) : mode === "signup" ? (
                  "Create account"
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-6 w-full text-center text-sm underline decoration-[hsl(var(--cta))] underline-offset-4"
            >
              {mode === "signin" ? "New here? Create an account" : "I already have an account"}
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default CoursesAuth;
