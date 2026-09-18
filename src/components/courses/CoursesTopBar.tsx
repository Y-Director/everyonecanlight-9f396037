import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

const initials = (name: string) =>
  name
    .split(/[\s._-]+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const displayNameOf = (session: Session | null) => {
  const meta = (session?.user.user_metadata ?? {}) as Record<string, unknown>;
  const name = (meta.display_name || meta.full_name || meta.name) as string | undefined;
  return name?.trim() || session?.user.email?.split("@")[0] || "You";
};

const avatarOf = (session: Session | null) => {
  const meta = (session?.user.user_metadata ?? {}) as Record<string, unknown>;
  return (meta.avatar_url || meta.picture) as string | undefined;
};

/** Dashboard header for the courses portal: ECL brand, account avatar, sign out. */
const CoursesTopBar = ({ session }: { session: Session | null }) => {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const name = displayNameOf(session);
  const avatar = avatarOf(session);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link to="/courses" className="flex items-center gap-2">
          <img src={logo} alt="Everyone Can Light logo" className="h-8 w-8 rounded-md object-contain" />
          <span className="text-sm font-semibold md:text-base">Courses</span>
        </Link>

        {session && (
          <div className="relative" ref={wrap}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Your account"
              className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[hsl(var(--surface))] text-xs font-semibold"
            >
              {avatar ? (
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
              ) : (
                initials(name)
              )}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-foreground/10 bg-[hsl(var(--surface))] shadow-2xl">
                <div className="px-4 py-3">
                  <p className="truncate text-sm font-medium">{name}</p>
                  <p className="truncate text-xs text-foreground/55">{session.user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => supabase.auth.signOut()}
                  className="flex w-full items-center gap-2 border-t border-foreground/10 px-4 py-3 text-left text-sm hover:bg-foreground/5"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default CoursesTopBar;
