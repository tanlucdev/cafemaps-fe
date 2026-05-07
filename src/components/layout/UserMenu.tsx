"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { User, LogOut } from "lucide-react";
import { getAuthUser, logout } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  locale: string;
}

export default function UserMenu({ locale }: UserMenuProps) {
  const t = useTranslations();
  const router = useRouter();
  const [user, setUser] = useState(() => getAuthUser());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

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
          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
          "bg-[var(--accent)] text-white transition-opacity hover:opacity-90",
        )}
        aria-label="Tài khoản"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute top-10 right-0 z-50 w-44 rounded-xl border border-[var(--border)] bg-(--background) py-1 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              router.push(`/${locale}/profile`);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)]"
          >
            <User size={14} />
            {t("bottomNav.profile")}
          </button>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-[var(--background-secondary)] dark:text-red-400"
          >
            <LogOut size={14} />
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
