"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDonationSettings } from "@/apis/donation-settings";
import donateQr from "../../../public/image/donate-qr.jpg";
import { ArrowRight, Coffee, Globe, Heart, MapPin, Share2 } from "lucide-react";

const exploreLinks = [
  { href: "/", labelKey: "exploreCafes" },
  { href: "/map", labelKey: "map" },
  { href: "/quiz", labelKey: "quiz" },
  { href: "/saved", labelKey: "saved" },
  { href: "/contribute", labelKey: "contribute" },
] as const;

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const donate = useTranslations("donate");
  const { data: settings, isError } = useQuery({
    queryKey: ["donation-settings"],
    queryFn: ({ signal }) => getDonationSettings(signal),
    networkMode: "always",
    staleTime: 0,
    refetchInterval: 60_000,
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    retry: false,
  });
  const showDonation = !!settings?.enabled && !isError;
  const donationTitle =
    (locale === "en" ? settings?.titleEn : settings?.titleVi) || donate("title");
  const donationDescription =
    (locale === "en" ? settings?.descriptionEn : settings?.descriptionVi) || donate("description");
  const year = new Date().getFullYear();
  const shareUrl = `https://cafemaps.net/${locale}`;

  return (
    <footer className="site-footer bg-[var(--background)] px-3 pt-4 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-4 xl:px-6">
      <div className="mx-auto max-w-[1480px]">
        <div className="relative overflow-hidden rounded-[22px] border border-[var(--footer-panel-border)] bg-[var(--footer-panel)] px-4 py-4 shadow-[var(--footer-panel-shadow)] sm:rounded-[28px] sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[image:var(--footer-ambient)] dark:opacity-40" />
          <div className="pointer-events-none absolute inset-0 [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_160_160%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.72%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%220.30%22/%3E%3C/svg%3E')] opacity-[0.045] mix-blend-multiply dark:mix-blend-screen" />
          <div className="pointer-events-none absolute -top-7 right-8 hidden h-24 w-24 rounded-full border border-[var(--footer-decor)] sm:block" />
          <div className="pointer-events-none absolute right-5 bottom-16 hidden rotate-[-8deg] rounded-full border border-[var(--footer-decor)] px-4 py-2 text-[10px] font-extrabold tracking-[0.14em] text-[var(--footer-decor)] uppercase lg:block">
            {t("stamp")}
          </div>
          <div className="pointer-events-none absolute top-24 left-5 hidden h-20 w-28 rounded-[50%] border-t border-dashed border-[var(--footer-decor)] md:block" />
          <span className="pointer-events-none absolute top-7 right-20 hidden h-3 w-2 rotate-[-28deg] rounded-full bg-[var(--footer-decor)] after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-[var(--footer-decor)] sm:block" />
          <span className="pointer-events-none absolute bottom-10 left-10 hidden h-3 w-2 rotate-[22deg] rounded-full bg-[var(--footer-decor)] after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-[var(--footer-decor)] sm:block" />

          <div className="relative hidden overflow-hidden rounded-[20px] border border-[var(--footer-card-border)] bg-[var(--footer-card)] p-4 shadow-[var(--footer-card-shadow)] backdrop-blur-md sm:block lg:flex lg:items-center lg:justify-between lg:gap-6">
            <div className="pointer-events-none absolute right-8 bottom-4 h-14 w-24 rotate-[-12deg] rounded-[50%] border-t border-dashed border-[var(--footer-decor)]" />
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--footer-control-border)] bg-[var(--footer-control-bg)] px-3 py-1.5 text-[11px] font-black tracking-[0.12em] text-[var(--footer-cta-eyebrow-text)] uppercase backdrop-blur-md">
                <MapPin size={14} aria-hidden="true" />
                <span>{t("cta.eyebrow")}</span>
              </div>
              <h2 className="font-display text-xl leading-tight font-extrabold text-[var(--foreground)] sm:text-2xl">
                {t("cta.title")}
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-5 text-[var(--foreground-muted)]">
                {t("cta.description")}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:mt-0 lg:shrink-0">
              <Link
                href="/"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--footer-primary-border)] bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-foreground)] shadow-[var(--footer-primary-shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-card-focus-offset)] focus-visible:outline-none"
              >
                {t("cta.primary")}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/quiz"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--footer-secondary-border)] bg-[var(--footer-control-bg-strong)] px-4 text-sm font-black text-[var(--foreground)] shadow-[var(--footer-secondary-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-card-focus-offset)] focus-visible:outline-none"
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </div>

          <div
            className={`relative grid min-w-0 gap-6 px-1 pt-5 pb-5 sm:grid-cols-2 sm:gap-8 sm:pt-6 lg:pt-7 xl:gap-10 ${showDonation ? "xl:grid-cols-[1.1fr_0.9fr_0.9fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr_1fr]"}`}
          >
            <div className={`min-w-0 ${showDonation ? "" : "sm:col-span-2 lg:col-span-1"}`}>
              <Link href="/" className="group flex w-fit items-center gap-3" aria-label="Cafe Maps">
                <Image
                  src="/image/logo-icon-transparent.png"
                  alt="Cafe Maps"
                  width={38}
                  height={38}
                  className="h-11 w-11 shrink-0 object-contain"
                  loading="lazy"
                />
                <span className="font-display text-lg font-extrabold text-[var(--foreground)] transition group-hover:text-[var(--accent-hover)]">
                  Cafe Maps
                </span>
              </Link>
              <p className="mt-3 max-w-md text-sm leading-5 text-[var(--foreground-muted)]">
                {t("tagline")}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--footer-control-border)] bg-[var(--footer-control-bg)] px-3 py-1.5 text-xs font-black text-[var(--footer-warm-text)] shadow-[var(--footer-brand-note-shadow)] backdrop-blur-md">
                <Coffee size={14} aria-hidden="true" />
                {t("brandNote")}
              </div>
            </div>

            <FooterNav title={t("exploreTitle")}>
              {exploreLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {t(link.labelKey)}
                </FooterLink>
              ))}
            </FooterNav>

            <div>
              <h3 className="text-sm font-extrabold text-[var(--foreground)]">
                {t("connectTitle")}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-5 text-[var(--foreground-muted)]">
                {t("connectText")}
              </p>
              <div className="mt-3 flex gap-3">
                <Link
                  href="/"
                  aria-label={t("websiteAria")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--footer-control-border)] bg-[var(--footer-control-bg)] text-[var(--footer-warm-text)] shadow-[var(--footer-icon-shadow)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-focus-offset)] focus-visible:outline-none"
                >
                  <Globe size={18} aria-hidden="true" />
                </Link>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("shareAria")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--footer-control-border)] bg-[var(--footer-control-bg)] text-[var(--footer-warm-text)] shadow-[var(--footer-icon-shadow)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-focus-offset)] focus-visible:outline-none"
                >
                  <Share2 size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
            {showDonation && (
              <section aria-label={donationTitle} className="flex min-w-0 items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="flex items-start gap-2 text-sm font-extrabold text-[var(--foreground)]">
                    <Coffee
                      size={16}
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[var(--accent)]"
                    />
                    <span className="break-words">{donationTitle}</span>
                  </h2>
                  <p className="mt-2 text-xs leading-5 break-words whitespace-pre-line text-[var(--foreground-muted)]">
                    {donationDescription}
                  </p>
                </div>
                <div className="shrink-0 rounded-[14px] border border-[var(--footer-control-border)] bg-white p-1 shadow-[var(--footer-icon-shadow)]">
                  <Image
                    src={settings?.qrImageUrl || donateQr}
                    alt={donationTitle}
                    width={104}
                    height={104}
                    className="h-[104px] w-[104px] rounded-[10px] object-contain"
                  />
                </div>
              </section>
            )}
          </div>

          <div className="relative border-t border-[var(--footer-divider)] px-1 pt-4 md:pr-20">
            <div className="flex flex-col gap-2 text-xs text-[var(--foreground-muted)] md:flex-row md:flex-wrap md:items-center md:justify-between">
              <p>{t("copyright", { year })}</p>
              <p className="inline-flex items-center gap-1.5 font-semibold text-[var(--footer-warm-text)]">
                <Heart
                  size={13}
                  aria-hidden="true"
                  className="fill-[var(--footer-heart-fill)] text-[var(--footer-heart)]"
                />
                {t("bottomNote")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-extrabold text-[var(--foreground)]">{title}</h3>
      <nav aria-label={title} className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
        {children}
      </nav>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 w-fit items-center text-sm font-medium text-[var(--foreground-muted)] underline-offset-4 transition hover:translate-x-0.5 hover:text-[var(--accent-hover)] hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--footer-focus-offset)] focus-visible:outline-none sm:min-h-0"
    >
      {children}
    </Link>
  );
}
