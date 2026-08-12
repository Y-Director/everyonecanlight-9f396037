-- email_send_log
DROP POLICY IF EXISTS "Service role can read send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can insert send log" ON public.email_send_log;
DROP POLICY IF EXISTS "Service role can update send log" ON public.email_send_log;
CREATE POLICY "Service role can read send log" ON public.email_send_log FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can insert send log" ON public.email_send_log FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can update send log" ON public.email_send_log FOR UPDATE TO service_role USING (true) WITH CHECK (true);
REVOKE ALL ON public.email_send_log FROM anon, authenticated;
GRANT ALL ON public.email_send_log TO service_role;

-- email_unsubscribe_tokens
DROP POLICY IF EXISTS "Service role can read tokens" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can insert tokens" ON public.email_unsubscribe_tokens;
DROP POLICY IF EXISTS "Service role can mark tokens as used" ON public.email_unsubscribe_tokens;
CREATE POLICY "Service role can read tokens" ON public.email_unsubscribe_tokens FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can insert tokens" ON public.email_unsubscribe_tokens FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can mark tokens as used" ON public.email_unsubscribe_tokens FOR UPDATE TO service_role USING (true) WITH CHECK (true);
REVOKE ALL ON public.email_unsubscribe_tokens FROM anon, authenticated;
GRANT ALL ON public.email_unsubscribe_tokens TO service_role;

-- suppressed_emails
DROP POLICY IF EXISTS "Service role can read suppressed emails" ON public.suppressed_emails;
DROP POLICY IF EXISTS "Service role can insert suppressed emails" ON public.suppressed_emails;
CREATE POLICY "Service role can read suppressed emails" ON public.suppressed_emails FOR SELECT TO service_role USING (true);
CREATE POLICY "Service role can insert suppressed emails" ON public.suppressed_emails FOR INSERT TO service_role WITH CHECK (true);
REVOKE ALL ON public.suppressed_emails FROM anon, authenticated;
GRANT ALL ON public.suppressed_emails TO service_role;