import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Camera, Check, Loader2, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import {
  NAME_MIN,
  checkDisplayNameAvailable,
  updateContributorProfile,
  uploadContributorMedia,
} from "@/lib/contributor";
import type { ContributorNotification, ContributorProfile } from "@/hooks/useContributor";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfilePatch = { display_name?: string; avatar_url?: string | null };

type Props = {
  profile: ContributorProfile | null;
  notifications: ContributorNotification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onProfileUpdated?: (patch: ProfilePatch) => void;
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
  const [openProfile, setOpenProfile] = useState(false);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [nameState, setNameState] = useState<"idle" | "checking" | "free" | "taken">("idle");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const trimmed = name.trim();
  const nameChanged = Boolean(profile && trimmed && trimmed !== profile.display_name);
  const dirty = nameChanged || Boolean(pendingFile);

  const reset = () => {
    setName(profile?.display_name ?? "");
    setPendingFile(null);
    setPreview(null);
    setNameState("idle");
  };

  useEffect(() => {
    if (openProfile) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openProfile, profile?.display_name]);

  useEffect(() => {
    if (!openProfile || !profile) return;
    if (!nameChanged || trimmed.length < NAME_MIN) return setNameState("idle");
    setNameState("checking");
    let active = true;
    const t = setTimeout(async () => {
      const available = await checkDisplayNameAvailable(trimmed, profile.user_id);
      if (!active) return;
      setNameState(available === null ? "idle" : available ? "free" : "taken");
    }, 450);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [trimmed, nameChanged, openProfile, profile]);

  const onPickFile = (file?: File | null) => {
    if (!file) return;
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const approve = async () => {
    if (!profile || !dirty) return;
    if (nameState === "taken") {
      toast.error("That display name is already taken.");
      return;
    }
    setSaving(true);
    try {
      const patch: ProfilePatch = {};
      if (nameChanged) patch.display_name = trimmed;
      if (pendingFile) patch.avatar_url = await uploadContributorMedia(profile.user_id, pendingFile);
      await updateContributorProfile(profile.user_id, patch);
      onProfileUpdated?.(patch);
      toast.success("Profile updated");
      setOpenProfile(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update profile");
    } finally {
      setSaving(false);
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

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenProfile((v) => !v)}
              title="Edit your profile"
              aria-label="Edit your profile"
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

            {openProfile && profile && (
              <div className="absolute right-0 mt-2 w-[20rem] max-w-[90vw] rounded-2xl border border-[hsl(var(--page-light-foreground))]/10 bg-[hsl(var(--page-light))] shadow-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Your profile</p>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpenProfile(false)}
                    className="text-[hsl(var(--page-light-foreground))]/50 hover:text-[hsl(var(--page-light-foreground))]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="relative w-16 h-16 rounded-full overflow-hidden bg-[hsl(var(--card-mint))] grid place-items-center text-sm font-semibold"
                  >
                    {preview || profile.avatar_url ? (
                      <img
                        src={preview ?? profile.avatar_url ?? ""}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials(profile.display_name)
                    )}
                    <span className="absolute inset-0 grid place-items-center bg-[hsl(var(--page-light-foreground))]/45 text-[hsl(var(--page-light))] opacity-0 hover:opacity-100 transition">
                      <Camera className="w-4 h-4" />
                    </span>
                  </button>
                  <div className="text-xs text-[hsl(var(--page-light-foreground))]/60">
                    Tap the photo to pick a new profile picture.
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onPickFile(e.target.files?.[0])}
                />

                <div className="space-y-2">
                  <Label htmlFor="p-name">Display name</Label>
                  <div className="relative">
                    <Input
                      id="p-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`pr-10 ${
                        nameState === "taken"
                          ? "border-red-500/70"
                          : nameState === "free"
                            ? "border-emerald-500/70"
                            : ""
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {nameState === "checking" && (
                        <Loader2 className="w-4 h-4 animate-spin text-[hsl(var(--page-light-foreground))]/40" />
                      )}
                      {nameState === "free" && (
                        <span className="w-5 h-5 rounded-full grid place-items-center bg-emerald-500 text-white">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </span>
                      )}
                      {nameState === "taken" && (
                        <span className="w-5 h-5 rounded-full grid place-items-center bg-red-500 text-white">
                          <X className="w-3 h-3" strokeWidth={3} />
                        </span>
                      )}
                    </span>
                  </div>
                  <p
                    aria-live="polite"
                    className={`text-xs ${
                      nameState === "taken"
                        ? "text-red-400"
                        : nameState === "free"
                          ? "text-emerald-400"
                          : "text-[hsl(var(--page-light-foreground))]/50"
                    }`}
                  >
                    {nameState === "free"
                      ? `"${trimmed}" is available`
                      : nameState === "taken"
                        ? `"${trimmed}" is already taken`
                        : nameState === "checking"
                          ? "Checking availability…"
                          : "Readers will see this name on your work."}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    type="button"
                    onClick={approve}
                    disabled={!dirty || saving || nameState === "taken" || nameState === "checking"}
                    className="flex-1 rounded-full h-9 text-xs"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Approve"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset();
                      setOpenProfile(false);
                    }}
                    className="flex-1 rounded-full h-9 text-xs"
                  >
                    Discard
                  </Button>
                </div>
              </div>
            )}
          </div>

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
