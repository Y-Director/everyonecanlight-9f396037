import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type ContributorProfile = {
  user_id: string;
  display_name: string;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
};

export const useContributorSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
};

export const useContributorProfile = (userId?: string, email?: string | null) => {
  const [profile, setProfile] = useState<ContributorProfile | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("contributor_profiles")
      .select("user_id, display_name, email, avatar_url, bio")
      .eq("user_id", userId)
      .maybeSingle();

    if (data) {
      setProfile(data as ContributorProfile);
      return;
    }
    const seed = {
      user_id: userId,
      display_name: email?.split("@")[0] ?? "Contributor",
      email: email ?? null,
      avatar_url: null,
      bio: null,
    };
    const { data: created } = await supabase
      .from("contributor_profiles")
      .insert(seed)
      .select("user_id, display_name, email, avatar_url, bio")
      .maybeSingle();
    setProfile((created as ContributorProfile) ?? seed);
  }, [userId, email]);

  useEffect(() => {
    void load();
  }, [load]);

  return { profile, setProfile, reloadProfile: load };
};

export type ContributorNotification = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export const useContributorNotifications = (userId?: string) => {
  const [items, setItems] = useState<ContributorNotification[]>([]);

  const load = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("contributor_notifications")
      .select("id, kind, title, body, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    setItems((data as ContributorNotification[]) ?? []);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const markAllRead = useCallback(async () => {
    const unread = items.filter((i) => !i.read_at).map((i) => i.id);
    if (!unread.length) return;
    setItems((prev) => prev.map((i) => ({ ...i, read_at: i.read_at ?? new Date().toISOString() })));
    await supabase
      .from("contributor_notifications")
      .update({ read_at: new Date().toISOString() })
      .in("id", unread);
  }, [items]);

  return { notifications: items, unreadCount: items.filter((i) => !i.read_at).length, markAllRead, reloadNotifications: load };
};
