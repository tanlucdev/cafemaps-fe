"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Coffee } from "lucide-react"
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false) }, [pathname])

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

              {/* Mobile: only hamburger */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)] transition-colors"
                aria-label={t("menu")}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-72 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                <span className="font-display text-lg font-semibold text-[var(--foreground)]">
                  Menu
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
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
              <div className="p-4 border-t border-[var(--border)] space-y-3">
                <div className="flex items-center gap-2">
                  <LocaleSwitcher />
                  <ThemeToggle />
                </div>
                <Link
                  href={`/${locale}/login`}
                  className={cn(buttonVariants({ variant: "default" }), "w-full justify-center")}
                >
                  {t("login")}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
