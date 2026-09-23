"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Heart, PenLine, Search, Sparkles, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslations("bottomNav");
  const [pendingPathname, setPendingPathname] = useState<string | null>(null);
  const disablePrefetch = pathname === "/quiz";

  useEffect(() => {
    setPendingPathname(null);
  }, [pathname]);

  const tabs = [
    { href: "/", icon: Search, label: t("search") },
    { href: "/quiz", icon: Sparkles, label: t("quiz") },
    { href: "/saved", icon: Heart, label: t("saved") },
    { href: "/contribute", icon: PenLine, label: t("contribute") },
    { href: "/profile", icon: UserRound, label: t("profile") },
  ];

  const isActiveRoute = (href: string) => {
    const activePathname = pendingPathname ?? pathname;
    if (href === "/") return activePathname === "/";
    return activePathname === href || activePathname.startsWith(`${href}/`);
  };

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile navigation">
      <div className="mobile-bottom-nav-inner">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = isActiveRoute(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={disablePrefetch ? false : undefined}
              onClick={() => setPendingPathname(href)}
              aria-current={isActive ? "page" : undefined}
              className={cn("mobile-bottom-nav-item", isActive && "is-active")}
            >
              <Icon aria-hidden="true" strokeWidth={isActive ? 2.2 : 1.6} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
