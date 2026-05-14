"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Coffee, Menu, Home, Search, Bookmark, PenLine, User } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import { buttonVariants } from "@/components/ui/Button";
import UserMenu from "@/components/layout/UserMenu";
import { getAuthUser } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    { href: `/${locale}`, label: t("explore"), icon: Home },
    { href: `/${locale}/saved`, label: t("saved"), icon: Bookmark },
    { href: `/${locale}/contribute`, label: t("contribute"), icon: PenLine },
  ];

  const mobileNavLinks = [
    ...navLinks,
    { href: `/${locale}/login`, label: t("profile"), icon: User },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-40 transition-all duration-300",
          scrolled
            ? "border-border border-b bg-(--background)/95 shadow-(--shadow-sm) backdrop-blur-md"
            : "bg-transparent",
        )}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="group flex items-center" aria-label="Cafe Maps">
              <Image src="/image/logo.png" alt="Cafe Maps" width={40} height={40} loading="lazy" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-accent bg-(--accent-light)"
                        : "hover:text-foreground text-(--foreground-muted) hover:bg-(--background-secondary)",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Always visible: locale + theme */}
              <span className="bg-transparent text-[#2C1A0E] hover:bg-transparent dark:text-(--foreground-muted)">
                <LocaleSwitcher />
              </span>
              <span className="hover:text-foreground bg-transparent text-[#2C1A0E] hover:bg-transparent dark:text-(--foreground-muted)">
                <ThemeToggle />
              </span>
              {/* Desktop only: login / user menu */}
              <div className="ml-1 hidden items-center md:flex">
                {authState === null ? (
                  <div className="h-9 w-20 animate-pulse rounded-full bg-(--background-secondary)" />
                ) : authState ? (
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
              <div className="ml-1 md:hidden">
                <Sheet>
                  <SheetTrigger
                    aria-label={t("menu")}
                    className="hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-lg text-(--foreground-muted) transition-colors hover:bg-(--background-secondary)"
                  >
                    <Menu size={20} />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 p-0">
                    <SheetHeader className="border-border border-b px-5 pt-5 pb-3">
                      <SheetTitle className="flex items-center gap-2">
                        <span className="bg-accent flex h-7 w-7 items-center justify-center rounded-lg text-white">
                          <Coffee size={14} />
                        </span>
                        Cafe Maps
                      </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-1 px-3 py-4">
                      {mobileNavLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                          <SheetClose key={href} render={<Link href={href} />}>
                            <span
                              className={cn(
                                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                                isActive
                                  ? "text-accent bg-(--accent-light)"
                                  : "hover:text-foreground text-(--foreground-muted) hover:bg-(--background-secondary)",
                              )}
                            >
                              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.6} />
                              {label}
                            </span>
                          </SheetClose>
                        );
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
  );
}
