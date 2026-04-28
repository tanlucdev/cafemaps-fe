import { useTranslations } from "next-intl"
import Link from "next/link"
import { Coffee, Globe, Share2 } from "lucide-react"

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations("footer")
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)] mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 group w-fit"
            >
              <span className="w-8 h-8 rounded-xl bg-[var(--accent)] flex items-center justify-center text-white">
                <Coffee size={16} />
              </span>
              <span className="font-display text-lg font-semibold text-[var(--foreground)]">
                Cafe Finder
              </span>
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
          </div>

          {/* Explore links — fully localised */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t("exploreTitle")}
            </h3>
            <nav className="space-y-2">
              {[
                { href: `/${locale}`, label: t("home") },
                { href: `/${locale}/quiz`, label: t("quiz") },
                { href: `/${locale}/contribute`, label: t("contribute") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal + Social */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {t("linksTitle")}
            </h3>
            <nav className="space-y-2">
              <Link
                href="#"
                className="block text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
              >
                {t("links.about")}
              </Link>
              <Link
                href="#"
                className="block text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
              >
                {t("links.privacy")}
              </Link>
              <Link
                href="#"
                className="block text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
              >
                {t("links.terms")}
              </Link>
            </nav>
            <div className="flex gap-3 pt-1">
              <a
                href="#"
                aria-label="Website"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all"
              >
                <Globe size={16} />
              </a>
              <a
                href="#"
                aria-label="Share"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition-all"
              >
                <Share2 size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <p className="text-xs text-[var(--foreground-muted)] text-center">
            {t("copyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  )
}
