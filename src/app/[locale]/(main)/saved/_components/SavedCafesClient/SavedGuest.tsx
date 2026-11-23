"use client";

import ChristmasArt from "@/components/seasonal/ChristmasArt";
import SeasonalGreeting from "@/components/seasonal/SeasonalGreeting";
import seasonal from "@/components/seasonal/SeasonalPages.module.css";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Bookmark, Coffee, Layers3, LogIn, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

export function SavedGuest() {
const t = useTranslations("saved");
return (
      <section className={`${seasonal.page} relative min-h-[100svh] overflow-hidden bg-[var(--background)] px-4 pb-[calc(var(--mobile-bottom-nav-height)+28px)] pt-[76px] text-[var(--foreground)] sm:px-6 sm:pt-[104px] lg:pb-16 lg:pt-28`}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(#8b5b2b_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-[#fff0d2]/55 to-transparent dark:from-white/6" />

        <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-[#ffe3b7]/55 bg-[#1f1209] shadow-[0_28px_90px_rgba(44,26,14,0.2)] lg:grid-cols-[0.96fr_1.04fr]">
          <div className="relative min-h-[260px] lg:min-h-[560px]">
            <Image
              src="/image/home-polaroid-4.jpg"
              alt={t("loginVisualAlt")}
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1f1209]/92 via-[#1f1209]/32 to-transparent lg:bg-linear-to-r lg:from-[#1f1209]/28 lg:via-[#1f1209]/22 lg:to-[#1f1209]/86" />
            <div className="absolute inset-x-4 bottom-4 rounded-[22px] border border-[#ffe3b7]/18 bg-[#1f1209]/42 p-4 text-[#fff0d2] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-5 lg:max-w-sm">
              <p className="text-[12px] font-bold text-[#ffd18c]">{t("loginVisualKicker")}</p>
              <p className="mt-2 text-sm leading-6 text-[#fff7e8]/84">{t("loginVisualCaption")}</p>
            </div>
          </div>
          <div className={`${seasonal.hero} flex flex-col justify-center bg-[#fffaf2]/94 p-6 backdrop-blur dark:bg-[#1f1209]/92 sm:p-9 lg:p-12`}>
            <div className={seasonal.intro}><SeasonalGreeting /><ChristmasArt kind="gift" className={seasonal.art} /></div>
            <ChristmasArt kind="lights" className={seasonal.lights} />
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ffe3b7]/70 bg-white/55 px-3 py-1.5 text-[12px] font-bold text-[var(--accent)] shadow-[0_10px_28px_rgba(44,26,14,0.07)] dark:border-white/10 dark:bg-white/7">
              <Bookmark className="size-3.5" aria-hidden="true" />
              {t("collection")}
            </div>
            <h1 className="mt-4 max-w-xl font-lora text-[2rem] font-bold leading-[1.05] text-[var(--foreground)] sm:text-[3rem] lg:text-[3.55rem]">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-[var(--foreground-muted)] sm:text-base">
              {t("loginRequired")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_12px_32px_rgba(135,82,0,0.24)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] dark:focus-visible:ring-offset-[#1f1209]">
                <LogIn size={16} />
                {t("loginCta")}
              </Link>
              <Link href="/register" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#ffe3b7]/85 bg-white/72 px-5 py-2.5 text-sm font-bold text-[var(--foreground)] shadow-[0_10px_26px_rgba(44,26,14,0.06)] transition-colors hover:border-[#c8a97a] hover:bg-[#fff8f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf2] dark:border-white/10 dark:bg-white/6 dark:focus-visible:ring-offset-[#1f1209]">
                <UserPlus size={16} />
                {t("registerCta")}
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-[#ffe3b7]/70 bg-white/56 p-4 shadow-[0_10px_28px_rgba(44,26,14,0.05)] dark:border-white/10 dark:bg-white/5">
                <Coffee className="mb-3 size-5 text-[var(--accent)]" aria-hidden="true" />
                <p className="text-sm font-bold text-[var(--foreground)]">{t("loginNoteOneTitle")}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">{t("loginNoteOneBody")}</p>
              </div>
              <div className="rounded-[18px] border border-[#dbe8d2] bg-[#f2f8ef]/72 p-4 shadow-[0_10px_28px_rgba(44,26,14,0.05)] dark:border-[#7a9e7e]/22 dark:bg-[#7a9e7e]/10">
                <Layers3 className="mb-3 size-5 text-[var(--sage)]" aria-hidden="true" />
                <p className="text-sm font-bold text-[var(--foreground)]">{t("loginNoteTwoTitle")}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">{t("loginNoteTwoBody")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}
