import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Camera } from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { uploadContributorMedia } from "@/lib/contributor";
import type { ContributorNotification, ContributorProfile } from "@/hooks/useContributor";
import { toast } from "sonner";

type Props = {
  profile: ContributorProfile | null;
  notifications: ContributorNotification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onProfileUpdated?: (avatarUrl: string) => void;
  action?: React.ReactNode;
};

const initials = (name: string) =>
  name
    .split(/[\s._-]+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const ContributorTopBar = ({
  profile,
  notifications,
  unreadCount,
  onMarkAllRead,
  onProfileUpdated,
  action,
}: Props) => {
  const [openBell, setOpenBell] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickAvatar = async (file?: File | null) => {
    if (!file || !profile) return;
    try {
      const url = await uploadContributorMedia(profile.user_id, file);
      await supabase
        .from("contributor_profiles")
        .update({ avatar_url: url })
        .eq("user_id", profile.user_id);
      onProfileUpdated?.(url);
      toast.success("Profile image updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--page-light-foreground))]/10 bg-[hsl(var(--page-light))]/85 backdrop-blur">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4 px-5 md:px-8 py-3">
        <Link to="/contributors" className="flex items-center gap-2 text-[hsl(var(--page-light-foreground))]">
          <img src={logo} alt="EveryoneCanLight logo" className="w-8 h-8 rounded-md object-contain" />
          <span className="font-semibold text-sm md:text-base">Contributors</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {action}

          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => {
                setOpenBell((v) => !v);
                if (!openBell) onMarkAllRead();
              }}
              className="relative w-10 h-10 rounded-full grid place-items-center bg-[hsl(var(--card-sky))] text-[hsl(var(--page-light-foreground))] hover:opacity-90 transition"
            >
              <Bell className="w-4.5 h-4.5" strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-[hsl(var(--cta))] text-[hsl(var(--cta-foreground))] text-[10px] font-semibold grid place-items-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {openBell && (
              <div className="absolute right-0 mt-2 w-[19rem] max-w-[85vw] rounded-2xl border border-[hsl(var(--page-light-foreground))]/10 bg-[hsl(var(--page-light))] shadow-xl overflow-hidden">
                <p className="px-4 py-3 text-xs uppercase tracking-[0.15em] text-[hsl(var(--page-light-foreground))]/50">
                  Updates
                </p>
                <ul className="max-h-72 overflow-y-auto divide-y divide-[hsl(var(--page-light-foreground))]/10">
                  {notifications.length === 0 && (
                    <li className="px-4 py-6 text-sm text-[hsl(var(--page-light-foreground))]/60">
                      No updates yet. Publish something and we'll keep you posted.
                    </li>
                  )}
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <p className="text-sm font-medium text-[hsl(var(--page-light-foreground))]">{n.title}</p>
                      {n.body && (
                        <p className="mt-1 text-xs text-[hsl(var(--page-light-foreground))]/60">{n.body}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            title="Change profile image"
            className="group relative w-10 h-10 rounded-full overflow-hidden bg-[hsl(var(--card-mint))] text-[hsl(var(--page-light-foreground))] text-xs font-semibold grid place-items-center"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
            ) : (
              initials(profile?.display_name || "C")
            )}
            <span className="absolute inset-0 hidden group-hover:grid place-items-center bg-[hsl(var(--page-light-foreground))]/60 text-[hsl(var(--page-light))]">
              <Camera className="w-4 h-4" />
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickAvatar(e.target.files?.[0])}
          />

          <button
            type="button"
            aria-label="Sign out"
            onClick={() => supabase.auth.signOut()}
            className="w-10 h-10 rounded-full grid place-items-center text-[hsl(var(--page-light-foreground))]/60 hover:text-[hsl(var(--page-light-foreground))] transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ContributorTopBar;
