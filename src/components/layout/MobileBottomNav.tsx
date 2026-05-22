"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Home, Search, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MobileBottomNav() {
  const pathname = usePathname()
  const t = useTranslations("bottomNav")

  const tabs = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/search", icon: Search, label: t("search") },
    { href: "/saved", icon: Heart, label: t("saved") },
    { href: "/login", icon: User, label: t("profile") },
  ]

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav-inner">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "mobile-bottom-nav-item",
                isActive && "is-active"
              )}
            >
              <Icon
                aria-hidden="true"
                strokeWidth={isActive ? 2.2 : 1.6}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
