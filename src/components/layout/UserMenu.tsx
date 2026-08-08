"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { User, LogOut } from "lucide-react";
import { logout, type AuthUser } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function UserMenu({ user }: { user: AuthUser | null }) {
  const t = useTranslations();
  const router = useRouter();
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

  const displayName = user.displayName || user.email;
  const initials = displayName.slice(0, 2).toUpperCase();

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.replace(`/`);
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-8 max-w-36 cursor-pointer items-center gap-1.5 rounded-full pr-2 pl-1 text-xs font-black",
          "bg-[var(--accent)] text-white transition-opacity hover:opacity-90",
        )}
        aria-label="Tài khoản"
      >
        <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/18">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt="" fill sizes="24px" className="object-cover" />
          ) : (
            initials || <User size={15} aria-hidden />
          )}
        </span>
        <span className="hidden min-w-0 truncate sm:block">{displayName}</span>
      </button>

      {open && (
        <div className="absolute top-10 right-0 z-50 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-(--background) py-1 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
            className="text-foreground mx-1.5 flex w-[calc(100%-0.75rem)] cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-(--background-secondary)"
          >
            <User size={14} />
            {t("bottomNav.profile")}
          </button>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            onClick={handleLogout}
            className="mx-1.5 flex w-[calc(100%-0.75rem)] cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 transition-colors hover:bg-(--background-secondary) dark:text-red-400"
          >
            <LogOut size={14} />
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
