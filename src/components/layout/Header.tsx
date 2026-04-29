"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Coffee } from "lucide-react"
import ThemeToggle from "@/components/ui/ThemeToggle"
import LocaleSwitcher from "@/components/ui/LocaleSwitcher"
import { buttonVariants } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  locale: string
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = [
    { href: `/${locale}`, label: t("explore") },
    { href: `/${locale}/quiz`, label: t("quiz") },
    { href: `/${locale}/saved`, label: t("saved") },
    { href: `/${locale}/contribute`, label: t("contribute") },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-[var(--shadow-sm)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 group"
              aria-label="Cafe Finder"
            >
              <span className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Coffee size={16} />
              </span>
              <span className="font-display text-lg font-semibold text-[var(--foreground)] hidden sm:block">
                Cafe Finder
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[var(--accent-light)] text-[var(--accent)]"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Desktop: show locale + theme + login */}
              <div className="hidden md:flex items-center gap-2">
                <LocaleSwitcher />
                <ThemeToggle />
                <Link
                  href={`/${locale}/login`}
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  {t("login")}
                </Link>
              </div>

            </div>
          </div>
        </div>
      </header>
    </>
  )
}
