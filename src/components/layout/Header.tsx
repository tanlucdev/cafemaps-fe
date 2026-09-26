"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Bookmark, PenLine, Compass, LogIn, Sparkles, User } from "lucide-react";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import UserMenu from "@/components/layout/UserMenu";
import { useAuthState } from "@/components/layout/useAuthState";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [pendingPathname, setPendingPathname] = useState<string | null>(null);
  const { user, isAuthPending, isLoggedIn } = useAuthState();

  useEffect(() => {
    setPendingPathname(null);
  }, [pathname]);

  const navLinks = [
    { href: "/", label: t("explore"), icon: Compass, primary: true },
    { href: "/quiz", label: t("quiz"), icon: Sparkles },
    // { href: "/blog", label: t("blog"), icon: BookOpen },
    { href: "/saved", label: t("saved"), icon: Bookmark },
    { href: "/contribute", label: t("contribute"), icon: PenLine },
  ];
  const disablePrefetch = pathname === "/quiz";
  const activePathname = pendingPathname ?? pathname;
  return (
    <header
      className={cn(
        "site-header fixed right-0 left-0 z-50 block bg-transparent transition-all duration-300",
        "motion-reduce:transition-none",
      )}
    >
      <div className="mx-auto max-w-7xl px-2 pt-2 min-[390px]:px-3 sm:px-6 lg:px-8">
        <div
          data-variant="surface"
          className={cn(
            "flex h-[52px] w-full min-w-0 items-center gap-1 rounded-full border px-1.5 backdrop-blur-xl transition-all duration-300 min-[390px]:h-[54px] min-[390px]:gap-2 min-[390px]:px-2.5 sm:h-[58px] sm:gap-3 sm:px-3",
            "motion-reduce:transition-none",
            "border-[var(--header-shell-surface-border)] bg-[var(--header-shell-surface-bg)] text-[var(--foreground)] shadow-[var(--header-shell-surface-shadow)]",
          )}
        >
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center gap-1.5 rounded-full pr-0.5 pl-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--header-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent min-[390px]:gap-2 min-[390px]:pr-1 min-[390px]:pl-1.5"
            aria-label="Cafe Maps"
          >
            <span className="flex size-9 shrink-0 items-center justify-center min-[390px]:size-10">
              <Image
                src="/image/logo-icon-transparent.png"
                alt=""
                width={34}
                height={34}
                priority
                className="size-9 min-[390px]:size-10"
              />
            </span>
            <span className="hidden min-w-0 flex-col leading-none sm:flex">
              <span
                className={cn(
                  "text-sm font-black whitespace-nowrap transition-colors",
                  "text-[var(--foreground)]",
                )}
              >
                Cafe Maps
              </span>
              <span
                className={cn(
                  "mt-1 hidden text-[10px] font-bold whitespace-nowrap lg:block",
                  "text-[var(--header-subtitle-surface)]",
                )}
              >
                HCMC guide
              </span>
            </span>
          </Link>

          <nav className="ml-2 hidden flex-1 items-center gap-1 md:flex" aria-label="Primary">
            {navLinks.map((link) => {
              const isActive = activePathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={disablePrefetch ? false : undefined}
                  onClick={() => setPendingPathname(link.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold whitespace-nowrap transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--header-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                    isActive
                      ? "bg-[var(--header-nav-active-bg)] text-[var(--header-nav-active-text)] shadow-[var(--header-nav-active-shadow)]"
                      : link.primary
                        ? "text-[var(--header-nav-primary-text)] hover:bg-[var(--header-nav-primary-hover-bg)]"
                        : "text-[var(--header-nav-text)] hover:bg-[var(--header-nav-hover-bg)] hover:text-[var(--header-nav-hover-text)]",
                  )}
                >
                  <Icon size={14} strokeWidth={isActive || link.primary ? 2.2 : 1.7} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div
            className={cn(
              "ml-auto flex h-9 max-w-[calc(100%-48px)] shrink-0 items-center gap-0.5 rounded-full border px-0.5 backdrop-blur-md min-[390px]:h-10 min-[390px]:max-w-none min-[390px]:gap-1 min-[390px]:px-1",
              "border-[var(--header-actions-surface-border)] bg-[var(--header-actions-surface-bg)] shadow-[var(--header-actions-surface-shadow)]",
            )}
          >
            <LocaleSwitcher
              className={cn(
                "[&>button]:h-8 [&>button]:min-w-8 [&>button]:gap-1 [&>button]:px-1.5 min-[390px]:[&>button]:min-w-10 min-[390px]:[&>button]:gap-1.5 min-[390px]:[&>button]:px-2 [&>button>span]:hidden min-[390px]:[&>button>span]:inline",
                "[&>button]:text-[var(--header-locale-text)] [&>button:hover]:bg-[var(--header-locale-hover-bg)] [&>button:hover]:text-[var(--header-nav-hover-text)]",
              )}
            />

            <div className="ml-0.5 flex items-center">
              {user ? (
                <UserMenu user={user} />
              ) : isLoggedIn || isAuthPending ? (
                <Link
                  href="/profile"
                  prefetch={disablePrefetch ? false : undefined}
                  className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)] transition-all duration-150 hover:bg-[var(--header-locale-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--header-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                  aria-label={t("profile")}
                >
                  <User size={15} aria-hidden />
                </Link>
              ) : (
                <Link
                  href="/login"
                  prefetch={disablePrefetch ? false : undefined}
                  className={cn(
                    "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-black transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--header-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:px-3 md:px-4 md:text-sm",
                    "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[var(--header-login-shadow)] hover:bg-[var(--accent-hover)]",
                  )}
                  aria-label={t("login")}
                >
                  <LogIn size={14} className="md:hidden" />
                  <span className="hidden sm:inline">{t("login")}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
