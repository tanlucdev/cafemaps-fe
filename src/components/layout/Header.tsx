"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Bookmark, PenLine, Compass, LogIn } from "lucide-react";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import UserMenu from "@/components/layout/UserMenu";
import { useAuthState } from "@/components/layout/useAuthState";
import { cn } from "@/lib/utils";
import Image from "next/image";

const HEADER_SCROLL_ENTER_Y = 24;
const HEADER_SCROLL_LEAVE_Y = 8;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pendingPathname, setPendingPathname] = useState<string | null>(null);
  const { isLoggedIn } = useAuthState();

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled((wasScrolled) => {
        const nextScrolled = wasScrolled
          ? scrollY > HEADER_SCROLL_LEAVE_Y
          : scrollY > HEADER_SCROLL_ENTER_Y;
        return nextScrolled === wasScrolled ? wasScrolled : nextScrolled;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setPendingPathname(null);
  }, [pathname]);

  const navLinks = [
    { href: "/search", label: t("explore"), icon: Compass, primary: true },
    // { href: "/blog", label: t("blog"), icon: BookOpen },
    { href: "/saved", label: t("saved"), icon: Bookmark },
    { href: "/contribute", label: t("contribute"), icon: PenLine },
  ];
  const isHome = pathname === "/";
  const activePathname = pendingPathname ?? pathname;
  const isCinematicTop = isHome && !scrolled;
  const shellVariant = isCinematicTop ? "cinematic" : "surface";
  return (
    <header
      className={cn(
        "site-header fixed right-0 left-0 z-50 block bg-transparent transition-all duration-300",
        "motion-reduce:transition-none",
      )}
    >
      <div className="mx-auto max-w-7xl px-2 pt-2 min-[390px]:px-3 sm:px-6 lg:px-8">
        <div
          data-variant={shellVariant}
          className={cn(
            "flex h-[52px] w-full min-w-0 items-center gap-1 rounded-full border px-1.5 backdrop-blur-xl transition-all duration-300 min-[390px]:h-[54px] min-[390px]:gap-2 min-[390px]:px-2.5 sm:h-[58px] sm:gap-3 sm:px-3",
            "motion-reduce:transition-none",
            isCinematicTop
              ? "border-[#ffe3b7]/28 bg-[#1f1209]/42 text-[#fff0d4] shadow-[0_16px_46px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,240,210,0.12)]"
              : "border-[#d8bc94] bg-[#fff7e8]/96 text-[var(--foreground)] shadow-[0_16px_42px_rgba(75,45,20,0.18),inset_0_1px_0_rgba(255,255,255,0.78)] dark:border-[#ffe3b7]/22 dark:bg-[#1c1209]/88 dark:shadow-[0_16px_42px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,240,210,0.08)]",
          )}
        >
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center gap-1.5 rounded-full pr-0.5 pl-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#e4ad58] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent min-[390px]:gap-2 min-[390px]:pr-1 min-[390px]:pl-1.5"
            aria-label="Cafe Maps"
          >
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/90 shadow-[0_8px_22px_rgba(44,26,14,0.12)] min-[390px]:size-10 dark:bg-[#fff7e8]">
              <Image
                src="/image/logo-96.png"
                alt=""
                width={34}
                height={34}
                priority
                className="size-[31px] min-[390px]:size-[34px]"
              />
            </span>
            <span className="hidden min-w-0 flex-col leading-none sm:flex">
              <span
                className={cn(
                  "text-sm font-black whitespace-nowrap transition-colors",
                  isCinematicTop ? "text-[#fff0d4]" : "text-[var(--foreground)]",
                )}
              >
                Cafe Maps
              </span>
              <span
                className={cn(
                  "mt-1 hidden text-[10px] font-bold whitespace-nowrap lg:block",
                  isCinematicTop ? "text-[#ffe3b7]/78" : "text-[#8c633a] dark:text-[#d7bea0]",
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
                  onClick={() => setPendingPathname(link.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold whitespace-nowrap transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#e4ad58] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                    isCinematicTop
                      ? isActive || link.primary
                        ? "bg-[#fff0d2] text-[#201006] shadow-[0_10px_26px_rgba(0,0,0,0.2)] hover:bg-white"
                        : "text-[#ffe3b7]/88 hover:bg-white/12 hover:text-white"
                      : isActive
                        ? "bg-[#fff0d2]/52 text-[#7f4f12] shadow-[inset_0_-1px_0_rgba(200,132,42,0.34)] dark:bg-white/8 dark:text-[#f0b869]"
                        : link.primary
                          ? "text-[#7f4f12] hover:bg-[#fff0d2]/48 dark:text-[#f0b869] dark:hover:bg-white/10"
                          : "text-[#8a6848] hover:bg-[#efe0c8] hover:text-[#2c1a0e] dark:text-[#d7bea0] dark:hover:bg-white/10 dark:hover:text-white",
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
              isCinematicTop
                ? "border-[#ffe3b7]/24 bg-[#1f1209]/42 shadow-[inset_0_1px_0_rgba(255,240,210,0.1)]"
                : "border-[#d9bea0] bg-[#f1e1c9]/78 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:border-[#ffe3b7]/18 dark:bg-white/8",
            )}
          >
            <LocaleSwitcher
              className={cn(
                "[&>button]:h-8 [&>button]:min-w-8 [&>button]:gap-1 [&>button]:px-1.5 min-[390px]:[&>button]:min-w-10 min-[390px]:[&>button]:gap-1.5 min-[390px]:[&>button]:px-2 [&>button>span]:hidden min-[390px]:[&>button>span]:inline",
                isCinematicTop
                  ? "[&>button]:text-[#fff0d4] [&>button:hover]:bg-white/12 [&>button:hover]:text-white"
                  : "[&>button]:text-[#6f5133] dark:[&>button]:text-[#ead6b7] [&>button:hover]:bg-[#ead8bf] [&>button:hover]:text-[#2c1a0e] dark:[&>button:hover]:bg-white/10 dark:[&>button:hover]:text-white",
              )}
            />


            <div className="ml-0.5 flex items-center">
              {isLoggedIn ? (
                <UserMenu />
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-black transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#e4ad58] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:px-3 md:px-4 md:text-sm",
                    isCinematicTop
                      ? "bg-[#fff0d2] text-[#201006] hover:bg-white"
                      : "bg-[var(--accent)] text-white shadow-[0_8px_20px_rgba(200,132,42,0.18)] hover:bg-[var(--accent-hover)]",
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
