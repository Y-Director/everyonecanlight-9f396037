import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import logoAsset from "@/assets/contributors/ecl-logoasset3.png.asset.json";
import avatar1 from "@/assets/contributors/dsc6415.jpg.asset.json";
import avatar2 from "@/assets/contributors/dsc6421.jpg.asset.json";
import avatar3 from "@/assets/contributors/dsc6428.jpg.asset.json";
import avatar4 from "@/assets/contributors/dsc6435.jpg.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useContributorSession } from "@/hooks/useContributor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Seo from "@/components/Seo";

const HEX_CLIP = "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)";

const FLOATERS = [
  { src: avatar1.url, className: "left-[4%] top-[14%] w-20 md:w-28", drift: "drift-a", size: "22s" },
  { src: avatar2.url, className: "right-[6%] top-[10%] w-16 md:w-24", drift: "drift-b", size: "27s" },
  { src: avatar3.url, className: "left-[9%] bottom-[12%] w-16 md:w-24", drift: "drift-c", size: "31s" },
  { src: avatar4.url, className: "right-[5%] bottom-[16%] w-20 md:w-28", drift: "drift-d", size: "25s" },
];

const FloatingAvatars = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    {FLOATERS.map((f) => (
      <div
        key={f.src}
        className={`absolute hidden sm:block opacity-80 ${f.className} ${f.drift}`}
        style={{ animationDuration: f.size }}
      >
        <div
          className="w-full aspect-[0.9] bg-[hsl(var(--cta))]/25 p-[2px]"
          style={{ clipPath: HEX_CLIP }}
        >
          <img
            src={f.src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ clipPath: HEX_CLIP }}
          />
        </div>
      </div>
    ))}
  </div>
);

const ContributorAuth = () => {
  const navigate = useNavigate();
  const { session, loading } = useContributorSession();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate("/contributors", { replace: true });
  }, [loading, session, navigate]);

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
    if (error) {
      if (/confirm/i.test(error.message)) {
        toast.error("Please confirm your email first — check your inbox for the verification link.");
        return;
      }
      return toast.error(error.message);
    }
    navigate("/contributors", { replace: true });
  };

  const resendVerification = async () => {
    setBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/contributors` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Verification email sent again.");
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
    <main className="contributor-shell relative min-h-screen bg-[hsl(var(--page-light))] text-[hsl(var(--page-light-foreground))] flex items-center justify-center px-6 py-16">
      <Seo
        title="Contributor sign in — Everyone Can Light"
        description="Sign in to write and publish lighting articles and courses on Everyone Can Light."
        path="/contributors/auth"
      />
      <FloatingAvatars />

      <div className="relative w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <img
            src={logoAsset.url}
            alt="EveryoneCanLight logo"
            className="w-9 h-9 rounded-md object-contain"
          />
          <span className="font-semibold">Contributors</span>
        </div>

        <h1 className="text-3xl font-medium tracking-tight">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="mt-2 text-sm text-[hsl(var(--page-light-foreground))]/60">
          {mode === "forgot"
            ? "We'll email you a secure link to set a new password."
            : "Write articles and courses for the Everyone Can Light community."}
        </p>

        {checkEmail ? (
          <div className="mt-8 rounded-2xl border border-[hsl(var(--page-light-foreground))]/10 bg-[hsl(var(--card-mint))] p-5 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <MailCheck className="w-4 h-4" />
              Verify your email
            </p>
            <p className="mt-1 text-[hsl(var(--page-light-foreground))]/70">
              We sent a verification link to {email}. Click it to activate your contributor account — you
              can't sign in until it's confirmed.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="sm" variant="outline" className="rounded-full" disabled={busy} onClick={resendVerification}>
                Resend email
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  setCheckEmail(false);
                  setMode("signin");
                }}
              >
                Back to sign in
              </Button>
            </div>
          </div>
        ) : resetSent ? (
          <div className="mt-8 rounded-2xl border border-[hsl(var(--page-light-foreground))]/10 bg-[hsl(var(--card-mint))] p-5 text-sm">
            <p className="font-medium">Check your email</p>
            <p className="mt-1 text-[hsl(var(--page-light-foreground))]/70">
              We sent a password reset link to {email}.
            </p>
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
                  className="mt-8 w-full h-11 rounded-full border border-[hsl(var(--page-light-foreground))]/15 bg-[hsl(var(--page-light))] text-sm font-medium hover:bg-[hsl(var(--page-light-foreground))]/5 transition disabled:opacity-60"
                >
                  Continue with Google
                </button>

                <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[hsl(var(--page-light-foreground))]/40">
                  <span className="flex-1 h-px bg-[hsl(var(--page-light-foreground))]/10" />
                  or
                  <span className="flex-1 h-px bg-[hsl(var(--page-light-foreground))]/10" />
                </div>
              </>
            )}

            <form onSubmit={onSubmit} className={`space-y-4 ${mode === "forgot" ? "mt-8" : ""}`}>
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="c-name">Display name</Label>
                  <Input
                    id="c-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How readers will see you"
                  />
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
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="c-password">Password</Label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs underline underline-offset-4 decoration-2 decoration-[hsl(var(--cta))]"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
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
              )}
              <Button type="submit" disabled={busy} className="w-full rounded-full">
                {busy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
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
