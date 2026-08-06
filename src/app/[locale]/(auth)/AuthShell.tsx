"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Coffee, Compass, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface AuthShellProps {
  children: React.ReactNode;
}

type AuthMode = "login" | "register";

function getAuthMode(pathname: string): AuthMode {
  return pathname === "/register" ? "register" : "login";
}

export default function AuthShell({ children }: AuthShellProps) {
  const t = useTranslations("auth");
  const pathname = usePathname();
  const currentMode = getAuthMode(pathname);
  const [authMode, setAuthMode] = useState<AuthMode>(currentMode);
  const isLogin = authMode === "login";
  const title = isLogin ? t("loginHeroTitle") : t("registerHeroTitle");
  const subtitle = isLogin ? t("loginHeroBody") : t("registerHeroBody");

  useEffect(() => {
    setAuthMode(currentMode);
  }, [currentMode]);

  return (
    <main
      data-auth-page="true"
      className="relative min-h-[100dvh] overflow-hidden bg-[#1f1209] px-4 py-4 text-[#fff7e8] sm:px-6 lg:px-8"
    >
      <Image
        src="/image/home-polaroid-3.jpg"
        alt=""
        fill
        sizes="100vw"
        className="absolute inset-0 object-cover opacity-52"
        priority
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,18,9,0.94),rgba(31,18,9,0.78)_42%,rgba(31,18,9,0.52))]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgba(31,18,9,0.96),rgba(31,18,9,0))]" />

      <div className="relative mx-auto grid min-h-[calc(100dvh-2rem)] w-full min-w-0 max-w-6xl items-center gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <aside className="hidden min-h-[620px] overflow-hidden rounded-[32px] border border-[#ffe3b7]/18 bg-[#1f1209]/38 shadow-[0_24px_72px_rgba(0,0,0,0.34)] backdrop-blur-md lg:block">
          <div className="relative h-full min-h-[620px]">
            <Image
              src="/image/home-polaroid-2.jpg"
              alt={t("visualAlt")}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,18,9,0.08),rgba(31,18,9,0.76))]" />
            <div className="absolute inset-x-0 bottom-0 p-8 xl:p-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/22 bg-[#1f1209]/44 px-3 py-1.5 text-xs font-bold text-[#ffe3b7] backdrop-blur-md">
                <Sparkles size={14} aria-hidden="true" />
                {t("visualKicker")}
              </div>
              <h2 className="font-lora max-w-[520px] text-[44px] leading-[1.03] font-bold text-[#fff7e8]">
                {t("visualTitle")}
              </h2>
              <p className="mt-4 max-w-[470px] text-[15px] leading-7 text-[#fff0d2]/82">
                {t("visualBody")}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/18 bg-[#fff7e8]/12 px-3 py-2 text-xs font-bold text-[#fff0d2] backdrop-blur-md">
                  <Coffee size={14} aria-hidden="true" />
                  {t("benefits.saved")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/18 bg-[#fff7e8]/12 px-3 py-2 text-xs font-bold text-[#fff0d2] backdrop-blur-md">
                  <Compass size={14} aria-hidden="true" />
                  {t("benefits.discovery")}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/18 bg-[#fff7e8]/12 px-3 py-2 text-xs font-bold text-[#fff0d2] backdrop-blur-md">
                  <ShieldCheck size={14} aria-hidden="true" />
                  {t("benefits.secure")}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <section className="mx-auto w-full min-w-0 max-w-full rounded-[28px] border border-[#ffe3b7]/38 bg-[#fffaf2]/94 p-4 text-[var(--foreground)] shadow-[0_20px_58px_rgba(31,18,9,0.28)] backdrop-blur-xl sm:max-w-[440px] sm:p-5 dark:border-[#ffe3b7]/16 dark:bg-[#21170f]/92 dark:text-[#fff7e8]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="group inline-flex min-h-10 min-w-0 items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] dark:focus-visible:ring-offset-[#21170f]"
              aria-label="Cafe Maps"
            >
              <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_8px_22px_rgba(44,26,14,0.14)] dark:bg-[#fff7e8]">
                <Image src="/image/logo-icon.png" alt="" width={34} height={34} loading="lazy" />
              </span>
              <span className="min-w-0 text-sm font-black text-[var(--foreground)] dark:text-[#fff7e8]">
                {t("brand")}
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-[var(--border)] bg-white/52 px-3 text-xs font-bold text-[var(--foreground-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] dark:border-[#ffe3b7]/16 dark:bg-white/8 dark:text-[#fff0d2]/78 dark:hover:text-[#fff7e8] dark:focus-visible:ring-offset-[#21170f]"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span className="hidden min-[380px]:inline">{t("backHome")}</span>
            </Link>
          </div>

          <div className="mb-4 overflow-hidden rounded-[22px] border border-[#ead8bf]/72 bg-[#fff7e8]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] dark:border-[#ffe3b7]/12 dark:bg-white/7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e7c995]/72 bg-[#fffaf2]/80 px-3 py-1 text-[11px] font-black text-[var(--accent-hover)] dark:border-[#ffe3b7]/16 dark:bg-white/8 dark:text-[#f0b869]">
              <MapPin size={13} aria-hidden="true" />
              {t("eyebrow")}
            </div>
            <h1 className="font-lora text-[23px] leading-[1.08] font-bold text-[var(--foreground)] min-[390px]:text-[25px] sm:text-[30px] dark:text-[#fff7e8]">
              {title}
            </h1>
            <p className="mt-2 text-[13.5px] leading-6 text-[var(--foreground-muted)] dark:text-[#fff0d2]/76">
              {subtitle}
            </p>
          </div>

          <div className="mb-4 grid grid-cols-2 rounded-full border border-[#ead8bf]/72 bg-[#f5edd8]/78 p-1 dark:border-[#ffe3b7]/12 dark:bg-white/7">
            <Link
              href="/login"
              prefetch={true}
              scroll={false}
              onNavigate={() => setAuthMode("login")}
              aria-current={isLogin ? "page" : undefined}
              className={cn(
                "min-h-10 rounded-full px-3 py-2 text-center text-[13px] font-black transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5edd8] dark:focus-visible:ring-offset-[#2b2119]",
                isLogin
                  ? "bg-[#fffaf2] text-[var(--accent-hover)] shadow-[0_8px_20px_rgba(44,26,14,0.10)] dark:bg-[#fff0d2] dark:text-[#201006]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] dark:text-[#fff0d2]/68 dark:hover:text-[#fff7e8]",
              )}
            >
              {t("loginTab")}
            </Link>
            <Link
              href="/register"
              prefetch={true}
              scroll={false}
              onNavigate={() => setAuthMode("register")}
              aria-current={!isLogin ? "page" : undefined}
              className={cn(
                "min-h-10 rounded-full px-3 py-2 text-center text-[13px] font-black transition-all focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5edd8] dark:focus-visible:ring-offset-[#2b2119]",
                !isLogin
                  ? "bg-[#fffaf2] text-[var(--accent-hover)] shadow-[0_8px_20px_rgba(44,26,14,0.10)] dark:bg-[#fff0d2] dark:text-[#201006]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] dark:text-[#fff0d2]/68 dark:hover:text-[#fff7e8]",
              )}
            >
              {t("registerTab")}
            </Link>
          </div>

          {children}

          <p className="mt-4 text-center text-[13px] text-[var(--foreground-muted)] dark:text-[#fff0d2]/68">
            {isLogin ? t("noAccount") : t("hasAccount")} {" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              prefetch={true}
              scroll={false}
              onNavigate={() => setAuthMode(isLogin ? "register" : "login")}
              className="font-black text-[var(--accent-hover)] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[var(--accent)] dark:text-[#f0b869]"
            >
              {isLogin ? t("switchToRegister") : t("switchToLogin")}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
