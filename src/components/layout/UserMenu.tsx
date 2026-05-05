"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { User, LogOut } from "lucide-react"
import { getAuthUser, logout, type AuthUser } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

interface UserMenuProps {
  locale: string
}

export default function UserMenu({ locale }: UserMenuProps) {
  const t = useTranslations()
  const router = useRouter()
  const [user, setUser] = useState(() => getAuthUser())
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  if (!user) return null

  const initials = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user.email.slice(0, 2).toUpperCase()

  function handleLogout() {
    logout()
    setUser(null)
    setOpen(false)
    router.replace(`/${locale}`)
    router.refresh()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
          "bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
        )}
        aria-label="Tài khoản"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-44 bg-(--background) border border-[var(--border)] rounded-xl shadow-lg py-1 z-50">
          <button
            onClick={() => { setOpen(false); router.push(`/${locale}/profile`) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <User size={14} />
            {t("bottomNav.profile")}
          </button>
          <div className="my-1 border-t border-[var(--border)]" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[var(--background-secondary)] transition-colors"
          >
            <LogOut size={14} />
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  )
}
