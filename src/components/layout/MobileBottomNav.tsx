"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Home, Search, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileBottomNavProps {
  locale: string
}

export default function MobileBottomNav({ locale }: MobileBottomNavProps) {
  const pathname = usePathname()
  const t = useTranslations("bottomNav")

  const tabs = [
    { href: `/${locale}`, icon: Home, label: t("home") },
    { href: `/${locale}/search`, icon: Search, label: t("search") },
    { href: `/${locale}/saved`, icon: Heart, label: t("saved") },
    { href: `/${locale}/login`, icon: User, label: t("profile") },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--background)] border-t border-[var(--border)]"
      style={{
        paddingTop: "10px",
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
      }}
    >
      <div className="flex items-center justify-around px-2">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl min-w-0 transition-colors",
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.2 : 1.6}
                className={cn(isActive && "fill-[var(--accent-light)]")}
              />
              <span className="text-[10px] font-medium truncate">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
