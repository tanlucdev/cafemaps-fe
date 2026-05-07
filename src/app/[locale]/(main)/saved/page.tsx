"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Lock, Bookmark } from "lucide-react";
import Link from "next/link";
import { getAuthUser } from "@/lib/auth-client";

export default function SavedPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("saved");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!getAuthUser());

    const onAuthChange = () => setIsLoggedIn(!!getAuthUser());
    window.addEventListener("cafe-auth-change", onAuthChange);
    return () => window.removeEventListener("cafe-auth-change", onAuthChange);
  }, []);

  if (!mounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-(--accent-light) flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            {t("title")}
          </h1>
          <p className="text-(--foreground-muted) text-sm mb-6">
            {t("loginRequired")}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t("loginCta")}
            </Link>
            <Link
              href={`/${locale}/register`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-foreground text-sm font-medium hover:bg-(--background-secondary) transition-colors"
            >
              {t("registerCta")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">{t("title")}</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-(--accent-light) flex items-center justify-center mx-auto mb-5">
            <Bookmark size={28} className="text-accent" />
          </div>
          <p className="text-(--foreground-muted) text-sm mb-4">{t("empty")}</p>
          <p className="text-(--foreground-muted) text-xs mb-6">{t("emptySubtitle")}</p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t("explore")}
          </Link>
        </div>
      </div>
    </div>
  );
}
