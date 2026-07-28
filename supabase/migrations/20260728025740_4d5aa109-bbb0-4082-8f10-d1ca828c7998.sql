CREATE POLICY "Team admins can view staff avatars"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'staff-avatars' AND (app_private.is_super_admin(auth.uid()) OR app_private.admin_has_section(auth.uid(), 'team')));

CREATE POLICY "Super admin uploads staff avatars"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'staff-avatars' AND app_private.is_super_admin(auth.uid()));

CREATE POLICY "Super admin updates staff avatars"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'staff-avatars' AND app_private.is_super_admin(auth.uid()))
  WITH CHECK (bucket_id = 'staff-avatars' AND app_private.is_super_admin(auth.uid()));

CREATE POLICY "Super admin deletes staff avatars"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'staff-avatars' AND app_private.is_super_admin(auth.uid()));