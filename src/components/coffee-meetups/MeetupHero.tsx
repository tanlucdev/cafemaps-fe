import Image from "next/image";
import { ArrowUpRight, Coffee, MapPin, Plus, Sparkles, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CoffeeSticker from "./CoffeeSticker";

export default function MeetupHero() {
  const t = useTranslations("coffeeMeetups");
  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-[var(--border)]/70 bg-linear-to-br from-[var(--card)] to-[var(--background-secondary)] text-[var(--foreground)] sm:rounded-[36px] md:grid md:grid-cols-[3fr_2fr] md:items-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-20 -z-10 size-[470px] rounded-full border border-[var(--accent)]/6 bg-[var(--accent-light)]/25"
      />
      <div className="relative min-w-0 px-6 pt-10 pb-8 sm:px-10 sm:pt-14 md:pb-14 lg:px-14 lg:py-16">
        <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-[var(--accent-hover)] uppercase">
          <Coffee size={16} aria-hidden="true" /> Cafe Maps{" "}
          <span className="mx-1 h-px w-5 bg-[var(--accent)]/35" /> {t("hero.eyebrow")}
        </p>
        <h1 className="font-lora mt-6 text-[36px] leading-[1.22] font-medium tracking-[-0.035em] sm:text-[46px] lg:text-[52px]">
          {t("hero.headline")}
          <br />
          <span className="relative inline-block pb-2 text-[var(--accent-hover)]">
            {t("hero.highlight")}
            <svg
              aria-hidden="true"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 h-2 w-full text-[var(--accent)]/30"
            >
              <path
                d="M8 8Q150 0 292 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        <p className="mt-5 max-w-[340px] text-sm leading-[1.9] text-[var(--foreground-muted)] sm:text-[15px]">
          {t("hero.description")}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/coffee-meetups/new"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-bold text-white transition hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            <Plus size={17} aria-hidden="true" />
            {t("actions.create")}
          </Link>
          <Link
            href="/coffee-meetups/mine"
            className="inline-flex h-12 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            {t("mine.title")}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border)]/65 pt-5 text-xs text-[var(--foreground-muted)]">
          <span className="inline-flex items-center gap-2">
            <MapPin size={14} aria-hidden="true" />
            {t("hero.location")}
          </span>
          <span className="inline-flex items-center gap-2">
            <UsersRound size={14} aria-hidden="true" />
            {t("hero.smallGroups")}
          </span>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none relative mx-auto mt-4 mb-9 w-[78%] max-w-sm md:my-12 md:mr-8 md:w-[calc(100%-2rem)] lg:mr-14 lg:w-[calc(100%-3.5rem)]"
      >
        <div className="relative rotate-[2deg] rounded-[24px] border border-[var(--border)]/65 bg-[var(--card)] p-3 shadow-[0_8px_24px_-12px_rgba(44,26,14,0.2)]">
          <span className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 border-x border-[var(--accent)]/5 bg-[var(--accent)]/12 backdrop-blur-sm" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/image/home-polaroid-3.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 350px, 400px"
              className="object-cover"
            />
          </div>
          <p className="font-lora px-2 py-4 text-center text-xs leading-6 text-[var(--foreground-muted)] italic lg:text-sm">
            {t("hero.note")}
          </p>
        </div>
        <div className="absolute -top-4 -right-3 flex -rotate-6 items-center gap-1.5 rounded-full border-2 border-[var(--card)] bg-[var(--sage-light)] px-3 py-1.5 text-[10px] font-medium text-[var(--foreground)]">
          <Sparkles size={14} className="text-[var(--sage)]" />
          {t("hero.sticker")}
        </div>
        <div className="relative mt-5 flex items-center justify-center gap-3">
          <CoffeeSticker className="w-20 shrink-0 -rotate-6 drop-shadow-sm lg:w-24" />
          <div className="min-w-0 -rotate-3 rounded-2xl border border-dashed border-[var(--accent)]/30 bg-[var(--accent-light)] px-3 py-2.5">
            <p className="text-[9px] font-bold tracking-[0.15em] text-[var(--accent-hover)] uppercase">
              {t("hero.ticket")}
            </p>
            <p className="font-lora mt-1 text-xs text-[var(--foreground)]">
              {t("hero.noteCaption")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
