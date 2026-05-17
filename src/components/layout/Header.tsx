"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Bookmark, PenLine, User, Compass } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import UserMenu from "@/components/layout/UserMenu";
import { getAuthUser } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authState, setAuthState] = useState<boolean | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 769) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setAuthState(!!getAuthUser());
    const onAuthChange = () => setAuthState(!!getAuthUser());
    window.addEventListener("cafe-auth-change", onAuthChange);
    return () => window.removeEventListener("cafe-auth-change", onAuthChange);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/search", label: t("explore"), icon: Compass },
    { href: "/saved", label: t("saved"), icon: Bookmark },
    { href: "/contribute", label: t("contribute"), icon: PenLine },
  ];

  const mobileNavLinks = [
    ...navLinks,
    { href: "/login", label: t("profile"), icon: User },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-40 transition-all duration-300",
          "bg-background border-border border-b backdrop-blur-[20px]",
          scrolled && "shadow-[0_2px_18px_rgba(40,22,4,0.09)]",
        )}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[62px] items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center" aria-label="Cafe Maps">
              <Image src="/image/logo.png" alt="Cafe Maps" width={40} height={40} loading="lazy" />
            </Link>

            {/* Desktop nav links */}
            <nav className="ml-3 hidden flex-1 items-center gap-1.5 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-[15px] py-2 text-[13.5px] font-medium whitespace-nowrap transition-all duration-150",
                      isActive
                        ? "bg-[#C9870C] font-bold text-white"
                        : "hover:text-foreground text-(--foreground-muted) hover:bg-[var(--background-secondary)]",
                    )}
                  >
                    <Icon size={14} strokeWidth={isActive ? 2.2 : 1.7} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Language switcher — desktop only */}
              <span className="hidden items-center md:flex">
                <LocaleSwitcher />
              </span>

              {/* Theme toggle — always visible */}
              <ThemeToggle />

              {/* Login / user menu — desktop only */}
              <div className="ml-0.5 hidden items-center md:flex">
                {authState === null ? (
                  <div className="h-9 w-20 animate-pulse rounded-full bg-(--background-secondary)" />
                ) : authState ? (
                  <UserMenu locale={locale} />
                ) : (
                  <Link
                    href="/login"
                    className={cn(
                      "inline-flex items-center rounded-full border-2 border-[#C9870C] px-5 py-1.5 text-sm font-bold text-[#C9870C] transition-all duration-150",
                      "hover:-translate-y-px hover:bg-[#C9870C] hover:text-white hover:shadow-[0_4px_14px_rgba(201,135,12,0.3)]",
                      "dark:border-[#F0A830] dark:text-[#F0A830] dark:hover:bg-[#F0A830] dark:hover:text-[#1C1209]",
                    )}
                  >
                    {t("login")}
                  </Link>
                )}
              </div>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={t("menu")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg border-[1.5px] border-[var(--border)] transition-all duration-150 md:hidden",
                  menuOpen ? "bg-[var(--background-secondary)]" : "bg-[var(--background)]",
                  "text-[var(--foreground)]",
                )}
              >
                {menuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down drawer */}
        {menuOpen && (
          <div
            className="bg-background border-t border-[var(--border-light,#ECE4D6)] px-3 pt-2 pb-5 shadow-[0_8px_24px_rgba(40,22,4,0.12)] backdrop-blur-md md:hidden"
            style={{ animation: "hdr-slideDown .2s cubic-bezier(.22,1,.36,1)" }}
          >
            <style>{`
              @keyframes hdr-slideDown {
                from { opacity: 0; transform: translateY(-6px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <nav className="flex flex-col gap-0.5">
              {mobileNavLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-colors",
                      isActive
                        ? "bg-[rgba(201,135,12,0.12)] font-bold text-[#C9870C] dark:bg-[rgba(240,168,48,0.12)] dark:text-[#F0A830]"
                        : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]",
                    )}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.6} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mx-1 my-3 h-px bg-[var(--border-light,#ECE4D6)]" />

            {/* Bottom row: language + login */}
            <div className="flex items-center gap-2 px-1">
              <LocaleSwitcher align="right" />
              {authState === null ? null : authState ? (
                <UserMenu locale={locale} />
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex flex-[2] items-center justify-center rounded-lg border-2 border-[#C9870C] px-5 py-2.5 text-sm font-bold text-[#C9870C] transition-all",
                    "hover:bg-[#C9870C] hover:text-white",
                    "dark:border-[#F0A830] dark:text-[#F0A830]",
                  )}
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop for mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-[rgba(28,18,9,0.18)] backdrop-blur-[2px] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
