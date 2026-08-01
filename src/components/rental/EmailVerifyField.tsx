import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { isValidEmail, suggestEmail } from "@/lib/emailHygiene";
import { cn } from "@/lib/utils";

interface Props {
  email: string;
  onEmailChange: (value: string) => void;
  verified: boolean;
  onVerified: (email: string) => void;
  onUnverified: () => void;
}

const EmailVerifyField = ({ email, onEmailChange, verified, onVerified, onUnverified }: Props) => {
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [resendIn, setResendIn] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  const clean = email.trim();
  const valid = isValidEmail(clean);
  const suggestion = clean.includes("@") && clean.length > 5 ? suggestEmail(clean) : null;

  useEffect(() => {
    if (expiresIn <= 0 && resendIn <= 0) return;
    const t = setInterval(() => {
      setExpiresIn((v) => (v > 0 ? v - 1 : 0));
      setResendIn((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [expiresIn, resendIn]);

  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const sendCode = async () => {
    if (!valid) {
      setTouched(true);
      toast.error("Enter a valid email address first.");
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("rental-kyc", {
        body: { action: "otp-send", email: clean },
      });
      if (error && !data) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      setCodeSent(true);
      setCode("");
      setExpiresIn((data?.minutes ?? 10) * 60);
      setResendIn(60);
      toast.success("Code sent", {
        description: `We emailed a 6-digit code to ${clean}.`,
        duration: 5000,
      });
      setTimeout(() => codeRef.current?.focus(), 100);
    } catch {
      toast.error("We could not send the code. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async (value: string) => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("rental-kyc", {
        body: { action: "otp-verify", email: clean, code: value },
      });
      if (error && !data) throw error;
      if (data?.error) {
        toast.error(data.error);
        setCode("");
        return;
      }
      if (data?.verified) {
        setCodeSent(false);
        setExpiresIn(0);
        onVerified(clean);
      }
    } catch {
      toast.error("We could not check that code. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <Label htmlFor="kyc-email">
        Email address <span className="text-destructive">*</span>
      </Label>
      <div className="mt-2 flex gap-2">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <Input
            id="kyc-email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            aria-invalid={touched && !valid}
            value={email}
            onChange={(e) => {
              const next = e.target.value.replace(/\s+/g, "");
              onEmailChange(next);
              if (verified || codeSent) {
                setCodeSent(false);
                setCode("");
                onUnverified();
              }
            }}
            onBlur={() => setTouched(true)}
            placeholder="you@example.com"
            className={cn(
              "pl-9 pr-9",
              touched && !valid && "border-destructive focus-visible:ring-destructive",
              verified && "border-emerald-500/60"
            )}
          />
          {verified && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
          )}
        </div>
        {!verified && (
          <Button
            type="button"
            variant={codeSent ? "outline" : "default"}
            onClick={sendCode}
            disabled={sending || !valid || resendIn > 0}
            className="shrink-0"
          >
            {sending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {resendIn > 0 ? `Resend ${mmss(resendIn)}` : codeSent ? "Resend code" : "Send code"}
          </Button>
        )}
      </div>

      {touched && !valid && clean.length > 0 && (
        <p className="mt-1.5 text-xs text-destructive">
          That doesn't look like a complete email address — check the part after the @.
        </p>
      )}

      {suggestion && !verified && (
        <button
          type="button"
          onClick={() => {
            onEmailChange(suggestion);
            onUnverified();
            setCodeSent(false);
          }}
          className="mt-2 text-xs text-foreground/80 underline decoration-primary decoration-2 underline-offset-2 hover:text-primary"
        >
          Did you mean <span className="font-semibold">{suggestion}</span>?
        </button>
      )}

      {verified && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-500">
          <ShieldCheck className="w-3.5 h-3.5" /> Email verified — thank you.
        </p>
      )}

      {!verified && codeSent && (
        <div className="mt-3 rounded-lg border border-border bg-muted/40 p-3">
          <Label htmlFor="kyc-otp" className="text-xs">
            Enter the 6-digit code we emailed you
          </Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              id="kyc-otp"
              ref={codeRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(next);
                if (next.length === 6) verifyCode(next);
              }}
              placeholder="000000"
              className="font-mono text-lg tracking-[0.5em] text-center"
            />
            {checking && <Loader2 className="w-4 h-4 animate-spin text-foreground/60" />}
          </div>
          <p className="mt-2 text-xs text-foreground/60">
            {expiresIn > 0
              ? `The code expires in ${mmss(expiresIn)}.`
              : "That code has expired — request a new one."}{" "}
            Check your spam folder if it hasn't arrived.
          </p>
        </div>
      )}

      {!verified && !codeSent && (
        <p className="mt-2 text-xs text-foreground/65">
          We verify your email once, so booking confirmations always reach the right person.
        </p>
      )}
    </div>
  );
};

export default EmailVerifyField;
