import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Lock } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "saved" })
  return { title: t("title") }
}

export default async function SavedPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "saved" })

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
  )
}
