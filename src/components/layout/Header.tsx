"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Bookmark, PenLine, Compass } from "lucide-react";
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
  const [authState, setAuthState] = useState<boolean | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setAuthState(!!getAuthUser());
    const onAuthChange = () => setAuthState(!!getAuthUser());
    window.addEventListener("cafe-auth-change", onAuthChange);
    return () => window.removeEventListener("cafe-auth-change", onAuthChange);
  }, []);

  const navLinks = [
    { href: "/search", label: t("explore"), icon: Compass },
    { href: "/saved", label: t("saved"), icon: Bookmark },
    { href: "/contribute", label: t("contribute"), icon: PenLine },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-40 block transition-all duration-300",
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
            <LocaleSwitcher />

            <ThemeToggle />

            <div className="ml-0.5 hidden items-center md:flex">
              {authState === null ? null : authState ? (
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
          </div>
        </div>
      </div>
    </header>
  );
}
