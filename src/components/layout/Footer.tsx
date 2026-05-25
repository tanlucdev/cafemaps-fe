import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import Image from "next/image"
import type { ReactNode } from "react"
import { ArrowRight, Coffee, Globe, Heart, MapPin, Share2 } from "lucide-react"

const exploreLinks = [
  { href: "/", labelKey: "home" },
  { href: "/search", labelKey: "exploreCafes" },
  { href: "/quiz", labelKey: "quiz" },
  { href: "/saved", labelKey: "saved" },
  { href: "/contribute", labelKey: "contribute" },
] as const

const footerLinks = [
  { href: "#", labelKey: "about" },
  { href: "#", labelKey: "privacy" },
  { href: "#", labelKey: "terms" },
] as const

export default function Footer() {
  const t = useTranslations("footer")
  const locale = useLocale()
  const year = new Date().getFullYear()
  const shareUrl = `https://cafemaps.net/${locale}`

  return (
    <footer className="site-footer bg-[var(--background)] px-3 pt-4 pb-3 sm:px-4 sm:pt-8 sm:pb-4 lg:px-4 xl:px-6">
      <div className="mx-auto max-w-[1480px]">
        <div className="relative overflow-hidden rounded-[20px] border border-[#ead8bf] bg-[#f7ecd8] px-4 py-4 shadow-[0_16px_42px_rgba(91,58,29,0.08)] sm:rounded-[24px] sm:px-5 sm:py-5 sm:shadow-[0_18px_54px_rgba(91,58,29,0.09)] lg:px-6 lg:py-6">
          <div className="pointer-events-none absolute -top-7 right-8 hidden h-24 w-24 rounded-full border border-[#c8842a]/15 sm:block" />
          <div className="pointer-events-none absolute right-5 bottom-16 hidden rotate-[-8deg] rounded-full border border-[#8b5b2b]/15 px-4 py-2 text-[10px] font-extrabold tracking-[0.14em] text-[#8b5b2b]/25 uppercase lg:block">
            {t("stamp")}
          </div>
          <div className="pointer-events-none absolute top-24 left-5 hidden h-20 w-28 rounded-[50%] border-t border-dashed border-[#8b5b2b]/20 md:block" />
          <span className="pointer-events-none absolute top-7 right-20 hidden h-3 w-2 rotate-[-28deg] rounded-full bg-[#8b5b2b]/15 after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-[#8b5b2b]/10 sm:block" />
          <span className="pointer-events-none absolute bottom-10 left-10 hidden h-3 w-2 rotate-[22deg] rounded-full bg-[#8b5b2b]/12 after:absolute after:top-0 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-[#8b5b2b]/10 sm:block" />

          <div className="relative hidden rounded-[18px] border border-white/70 bg-[#fff8ed]/80 p-4 shadow-[0_10px_28px_rgba(82,52,25,0.07)] sm:block lg:flex lg:items-center lg:justify-between lg:gap-6">
            <div className="max-w-2xl">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] text-[#a86d1e] uppercase">
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
                href="/search"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 text-sm font-bold text-white shadow-[0_10px_24px_rgba(200,132,42,0.20)] transition hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] focus-visible:outline-none"
              >
                {t("cta.primary")}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/quiz"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#d8bd99] bg-white/55 px-4 text-sm font-bold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff8ed] focus-visible:outline-none"
              >
                {t("cta.secondary")}
              </Link>
            </div>
          </div>

          <div className="relative sm:hidden">
            <div className="flex items-center gap-3">
              <Image
                src="/image/logo.png"
                alt="Cafe Maps"
                width={34}
                height={34}
                className="h-[34px] w-[34px] shrink-0 rounded-[10px] object-cover shadow-sm"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="font-display text-base font-extrabold text-[var(--foreground)]">
                  Cafe Maps
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[var(--foreground-muted)]">
                  {t("tagline")}
                </p>
              </div>
            </div>

            <nav className="mt-4 flex flex-wrap gap-2">
              <FooterChip href="/search">{t("exploreCafes")}</FooterChip>
              <FooterChip href="/quiz">{t("quiz")}</FooterChip>
              <FooterChip href="/contribute">{t("contribute")}</FooterChip>
            </nav>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#dfc7a7] pt-3">
              <p className="text-[11px] leading-4 text-[var(--foreground-muted)]">
                {t("bottomNote")}
              </p>
              <div className="flex shrink-0 gap-2">
                <Link
                  href="/"
                  aria-label={t("websiteAria")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5cfad] bg-white/40 text-[#7b5631] transition hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7ecd8] focus-visible:outline-none"
                >
                  <Globe size={17} aria-hidden="true" />
                </Link>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("shareAria")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e5cfad] bg-white/40 text-[#7b5631] transition hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7ecd8] focus-visible:outline-none"
                >
                  <Share2 size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden max-w-none gap-7 px-1 pt-6 pb-5 sm:grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:gap-8 lg:pt-7 xl:gap-10">
            <div>
              <Link href="/" className="group flex w-fit items-center gap-3" aria-label="Cafe Maps">
                <Image
                  src="/image/logo.png"
                  alt="Cafe Maps"
                  width={38}
                  height={38}
                  className="h-[38px] w-[38px] shrink-0 rounded-[11px] object-cover shadow-sm"
                  loading="lazy"
                />
                <span className="font-display text-lg font-extrabold text-[var(--foreground)] transition group-hover:text-[var(--accent-hover)]">
                  Cafe Maps
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-5 text-[var(--foreground-muted)]">
                {t("tagline")}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#e5cfad] bg-white/35 px-3 py-1.5 text-xs font-bold text-[#7b5631]">
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

            <FooterNav title={t("linksTitle")}>
              {footerLinks.map((link) => (
                <FooterLink key={link.labelKey} href={link.href}>
                  {t(`links.${link.labelKey}`)}
                </FooterLink>
              ))}
            </FooterNav>

            <div>
              <h3 className="text-sm font-extrabold text-[var(--foreground)]">{t("connectTitle")}</h3>
              <p className="mt-2 max-w-xs text-sm leading-5 text-[var(--foreground-muted)]">
                {t("connectText")}
              </p>
              <div className="mt-3 flex gap-3">
                <Link
                  href="/"
                  aria-label={t("websiteAria")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5cfad] bg-white/40 text-[#7b5631] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7ecd8] focus-visible:outline-none"
                >
                  <Globe size={18} aria-hidden="true" />
                </Link>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("shareAria")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5cfad] bg-white/40 text-[#7b5631] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7ecd8] focus-visible:outline-none"
                >
                  <Share2 size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="relative mx-auto hidden max-w-none border-t border-[#dfc7a7] px-1 pt-4 sm:block">
            <div className="flex flex-col gap-2 text-xs text-[var(--foreground-muted)] sm:flex-row sm:items-center sm:justify-between">
              <p>{t("copyright", { year })}</p>
              <p className="inline-flex items-center gap-1.5 font-semibold text-[#7b5631]">
                <Heart size={13} aria-hidden="true" className="fill-[#c8842a]/20 text-[#c8842a]" />
                {t("bottomNote")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterChip({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-9 items-center rounded-full border border-[#e5cfad] bg-white/35 px-3 text-xs font-bold text-[#7b5631] transition hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7ecd8] focus-visible:outline-none"
    >
      {children}
    </Link>
  )
}

function FooterNav({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <h3 className="text-sm font-extrabold text-[var(--foreground)]">{title}</h3>
      <nav className="mt-2.5 grid gap-2">{children}</nav>
    </div>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="w-fit text-sm font-medium text-[var(--foreground-muted)] underline-offset-4 transition hover:translate-x-0.5 hover:text-[var(--accent-hover)] hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7ecd8] focus-visible:outline-none"
    >
      {children}
    </Link>
  )
}
