"use client"

import { useEffect, useState } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Home, Search, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"

const IOS_BOTTOM_GUARD_VAR = "--ios-bottom-guard-height"
const FALLBACK_IOS_BOTTOM_GUARD_HEIGHT = 80

export default function MobileBottomNav() {
  const pathname = usePathname()
  const t = useTranslations("bottomNav")
  const [pendingPathname, setPendingPathname] = useState<string | null>(null)

  useEffect(() => {
    let frame = 0

    const syncBottomGuard = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const viewport = window.visualViewport
        const rawInset = viewport
          ? window.innerHeight - viewport.height - viewport.offsetTop
          : 0
        const bottomInset = Math.ceil(Math.max(0, rawInset))

        document.documentElement.style.setProperty(
          IOS_BOTTOM_GUARD_VAR,
          `${bottomInset || FALLBACK_IOS_BOTTOM_GUARD_HEIGHT}px`
        )
      })
    }

    syncBottomGuard()

    const viewport = window.visualViewport
    viewport?.addEventListener("resize", syncBottomGuard)
    viewport?.addEventListener("scroll", syncBottomGuard)
    window.addEventListener("resize", syncBottomGuard)
    window.addEventListener("orientationchange", syncBottomGuard)

    return () => {
      cancelAnimationFrame(frame)
      viewport?.removeEventListener("resize", syncBottomGuard)
      viewport?.removeEventListener("scroll", syncBottomGuard)
      window.removeEventListener("resize", syncBottomGuard)
      window.removeEventListener("orientationchange", syncBottomGuard)
      document.documentElement.style.removeProperty(IOS_BOTTOM_GUARD_VAR)
    }
  }, [])

  useEffect(() => {
    setPendingPathname(null)
  }, [pathname])

  const tabs = [
    { href: "/", icon: Home, label: t("home") },
    { href: "/search", icon: Search, label: t("search") },
    { href: "/saved", icon: Heart, label: t("saved") },
    { href: "/profile", icon: User, label: t("profile") },
  ]

  const isActiveRoute = (href: string) => {
    const activePathname = pendingPathname ?? pathname
    if (href === "/") return activePathname === "/"
    return activePathname === href || activePathname.startsWith(`${href}/`)
  }

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav-inner">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = isActiveRoute(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setPendingPathname(href)}
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
