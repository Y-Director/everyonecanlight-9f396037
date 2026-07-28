import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type State = "loading" | "valid" | "already" | "invalid" | "done" | "working";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`;
    fetch(url, { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string } })
      .then(async (r) => {
        const body = await r.json().catch(() => ({}));
        if (!r.ok) return setState("invalid");
        if (body?.reason === "already_unsubscribed") return setState("already");
        setState(body?.valid ? "valid" : "invalid");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  const confirm = async () => {
    setState("working");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error) return setState("invalid");
    setState((data as { reason?: string })?.reason === "already_unsubscribed" ? "already" : "done");
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] p-8 text-center">
        <h1 className="text-2xl font-semibold">Email preferences</h1>
        {state === "loading" && (
          <p className="mt-3 text-foreground/60">Checking your link…</p>
        )}
        {state === "valid" && (
          <>
            <p className="mt-3 text-foreground/60">
              Confirm you no longer want to receive emails from Everyone Can Light.
            </p>
            <Button className="mt-6 w-full" onClick={confirm}>
              Confirm unsubscribe
            </Button>
          </>
        )}
        {state === "working" && <p className="mt-3 text-foreground/60">Updating…</p>}
        {state === "done" && (
          <p className="mt-3 text-foreground/60">
            You have been unsubscribed. You will still receive essential booking emails.
          </p>
        )}
        {state === "already" && (
          <p className="mt-3 text-foreground/60">You are already unsubscribed.</p>
        )}
        {state === "invalid" && (
          <p className="mt-3 text-foreground/60">This unsubscribe link is invalid or expired.</p>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;