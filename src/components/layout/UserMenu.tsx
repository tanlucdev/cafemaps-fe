"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { User, LogOut } from "lucide-react";
import { getAuthUser, logout } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type UserMenuProps = {
  initialIsLoggedIn?: boolean;
};

export default function UserMenu({ initialIsLoggedIn = false }: UserMenuProps) {
  const t = useTranslations();
  const router = useRouter();
  const [user, setUser] = useState(() => (initialIsLoggedIn ? null : getAuthUser()));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncUser = () => setUser(getAuthUser());
    syncUser();
    window.addEventListener("cafe-auth-change", syncUser);
    return () => window.removeEventListener("cafe-auth-change", syncUser);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user && !initialIsLoggedIn) return null;

  const initials = user
    ? (user.displayName || user.email).slice(0, 2).toUpperCase()
    : null;

  function handleLogout() {
    logout();
    setUser(null);
    setOpen(false);
    router.replace(`/`);
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-semibold",
          "bg-[var(--accent)] text-white transition-opacity hover:opacity-90",
        )}
        aria-label="Tài khoản"
      >
        {initials ?? <User size={15} aria-hidden />}
      </button>

      {open && (
        <div className="absolute top-10 right-0 z-50 w-44 rounded-xl border border-[var(--border)] bg-(--background) py-1 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
            className="text-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-(--background-secondary)"
          >
            <User size={14} />
            {t("bottomNav.profile")}
          </button>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-(--background-secondary) dark:text-red-400"
          >
            <LogOut size={14} />
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
