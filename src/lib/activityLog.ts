import { supabase } from "@/integrations/supabase/client";

export type ActivitySeverity = "info" | "warning" | "critical";

export type ActivityInput = {
  category: string;
  event: string;
  title: string;
  summary?: string;
  severity?: ActivitySeverity;
  entityType?: string;
  entityId?: string;
  lines?: { label: string; value: string }[];
  metadata?: Record<string, unknown>;
  /** Optional customer-facing email sent alongside the admin notification. */
  customer?: {
    email: string;
    templateName: "identity-approved" | "identity-rejected" | "payment-issue";
    templateData?: Record<string, unknown>;
    idempotencyKey?: string;
  };
};

/**
 * Records a dashboard action in the activity log and emails the super admin
 * plus the admin performing the action. Never throws — logging must not break
 * the action it is describing.
 */
export const logActivity = async (input: ActivityInput) => {
  try {
    const { error } = await supabase.functions.invoke("notify-admins", { body: input });
    if (error) console.error("logActivity failed", error);
  } catch (e) {
    console.error("logActivity failed", e);
  }
};