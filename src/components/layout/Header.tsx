"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Coffee, Menu, Home, Search, Bookmark, PenLine, User } from "lucide-react"
import ThemeToggle from "@/components/ui/ThemeToggle"
import LocaleSwitcher from "@/components/ui/LocaleSwitcher"
import { buttonVariants } from "@/components/ui/Button"
import UserMenu from "@/components/layout/UserMenu"
import { getAuthUser } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface HeaderProps {
  locale: string
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const user = getAuthUser();
    return !!user;
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])



  const navLinks = [
    { href: `/${locale}`, label: t("explore"), icon: Home },
    { href: `/${locale}/quiz`, label: t("quiz"), icon: Search },
    { href: `/${locale}/saved`, label: t("saved"), icon: Bookmark },
    { href: `/${locale}/contribute`, label: t("contribute"), icon: PenLine },
  ]

  const mobileNavLinks = [
    ...navLinks,
    { href: `/${locale}/login`, label: t("profile"), icon: User },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-(--background)/95 backdrop-blur-md border-b border-border shadow-(--shadow-sm)"
            : "bg-transparent"
        )}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 group"
              aria-label="Cafe Finder"
            >
              <span className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Coffee size={16} />
              </span>
              <span className="font-display text-lg font-semibold text-foreground hidden sm:block">
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
                        ? "bg-(--accent-light) text-accent"
                        : "text-(--foreground-muted) hover:text-foreground hover:bg-(--background-secondary)"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Always visible: locale + theme */}
              <span className="text-[#2C1A0E] dark:text-(--foreground-muted) bg-transparent hover:bg-transparent">
                <LocaleSwitcher />
              </span>
              <span className="text-[#2C1A0E] dark:text-(--foreground-muted) bg-transparent hover:bg-transparent hover:text-foreground">
                <ThemeToggle />
              </span>
              {/* Desktop only: login / user menu */}
              <div className="hidden md:flex items-center ml-1">
                {isLoggedIn ? (
                  <UserMenu locale={locale} />
                ) : (
                  <Link
                    href={`/${locale}/login`}
                    className={cn(buttonVariants({ variant: "default" }))}
                  >
                    {t("login")}
                  </Link>
                )}
              </div>
              {/* Mobile: hamburger */}
              <div className="md:hidden ml-1">
                <Sheet>
                  <SheetTrigger
                    aria-label={t("menu")}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-(--foreground-muted) hover:text-foreground hover:bg-(--background-secondary) transition-colors"
                  >
                    <Menu size={20} />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 p-0">
                    <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
                      <SheetTitle className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white">
                          <Coffee size={14} />
                        </span>
                        Cafe Finder
                      </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col px-3 py-4 gap-1">
                      {mobileNavLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href
                        return (
                          <SheetClose key={href} render={<Link href={href} />}>
                            <span
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full",
                                isActive
                                  ? "bg-(--accent-light) text-accent"
                                  : "text-(--foreground-muted) hover:text-foreground hover:bg-(--background-secondary)"
                              )}
                            >
                              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.6} />
                              {label}
                            </span>
                          </SheetClose>
                        )
                      })}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
