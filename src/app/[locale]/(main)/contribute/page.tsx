import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CheckCircle2, ImagePlus, Link2, MapPin } from "lucide-react";
import { createLocalizedMetadata } from "@/lib/metadata";
import ContributeForm from "./ContributeForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });
  return createLocalizedMetadata({
    locale,
    pathname: "/contribute",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ContributePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contribute" });
  const notes = [
    { icon: Link2, label: t("trust.googleMaps") },
    { icon: ImagePlus, label: t("trust.realPhotos") },
    { icon: CheckCircle2, label: t("trust.reviewTime") },
  ];

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[var(--background)] px-4 pt-[70px] pb-[calc(var(--mobile-bottom-nav-height)+24px)] text-[var(--foreground)] sm:px-6 sm:pt-[104px] lg:pt-24 lg:pb-10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#8b5b2b_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#fff0d2]/50 to-transparent dark:from-white/5" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.72fr)] lg:items-start lg:gap-8">
        <section className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:space-y-5">
          <div className="space-y-3 lg:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffe3b7]/60 bg-[#fffaf2]/70 px-3 py-1.5 text-[11.5px] font-bold text-[var(--accent)] shadow-[0_10px_28px_rgba(44,26,14,0.07)] backdrop-blur dark:border-[#ffe3b7]/12 dark:bg-white/6 sm:text-[12px]">
              <MapPin className="size-3.5" aria-hidden="true" />
              {t("eyebrow")}
            </div>
            <div className="max-w-2xl space-y-4">
              <h1 className="max-w-full break-words font-lora text-[1.56rem] leading-[1.03] font-bold text-[var(--foreground)] min-[390px]:text-[1.72rem] sm:text-[clamp(2.6rem,5vw,3.85rem)] sm:leading-[1.02]">
                {t("heroTitle")}
              </h1>
              <p className="max-w-xl overflow-hidden text-[13.5px] leading-5 text-[var(--foreground-muted)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-[16px] sm:leading-7 sm:[display:block] sm:[-webkit-line-clamp:unset]">
                {t("heroBody")}
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <ContributeVisual
              alt={t("visualAlt")}
              kicker={t("visualKicker")}
              caption={t("visualCaption")}
              priority
            />
          </div>

          <div className="hidden gap-3 sm:grid-cols-3 lg:grid">
            {notes.map((note) => {
              const Icon = note.icon;
              return (
                <div key={note.label} className="flex items-center gap-3 rounded-[18px] border border-[var(--border)] bg-[#fffaf2]/68 px-4 py-3 text-[13px] font-bold text-[var(--foreground)] shadow-[0_10px_28px_rgba(44,26,14,0.06)] backdrop-blur dark:bg-white/5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {note.label}
                </div>
              );
            })}
          </div>
        </section>

        <section aria-label={t("formAria")} className="min-h-0 min-w-0">
          <ContributeForm />
        </section>

        <section className="hidden min-w-0 space-y-4 sm:block lg:hidden" aria-label={t("visualKicker")}>
          <ContributeVisual alt={t("visualAlt")} kicker={t("visualKicker")} caption={t("visualCaption")} />
          <div className="grid gap-3">
            {notes.map((note) => {
              const Icon = note.icon;
              return (
                <div key={note.label} className="flex items-center gap-3 rounded-[18px] border border-[var(--border)] bg-[#fffaf2]/68 px-4 py-3 text-[13px] font-bold text-[var(--foreground)] shadow-[0_10px_28px_rgba(44,26,14,0.06)] backdrop-blur dark:bg-white/5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {note.label}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function ContributeVisual({
  alt,
  kicker,
  caption,
  priority = false,
}: {
  alt: string;
  kicker: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-[28px] border border-[#ffe3b7]/45 bg-[#1f1209] shadow-[0_24px_70px_rgba(44,26,14,0.22)] sm:rounded-[34px]">
      <div className="relative aspect-[4/3] min-h-[310px] lg:h-[318px] lg:min-h-0 lg:aspect-auto">
        <Image
          src="/image/home-polaroid-3.jpg"
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 56vw, 100vw"
          priority={priority}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1f1209]/92 via-[#1f1209]/28 to-transparent" />
        <div className="absolute right-3 bottom-3 left-3 rounded-[22px] border border-[#ffe3b7]/20 bg-[#1f1209]/42 p-4 text-[#fff0d2] backdrop-blur-xl sm:right-6 sm:bottom-6 sm:left-6 sm:p-5">
          <p className="text-[12px] font-bold text-[#ffd18c]">{kicker}</p>
          <p className="mt-2 break-words text-[14px] leading-6 text-[#fff7e8]/88 sm:text-[15px]">{caption}</p>
        </div>
      </div>
    </div>
  );
}
