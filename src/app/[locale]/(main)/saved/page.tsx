import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Bookmark } from "lucide-react"
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
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center mx-auto mb-5">
          <Bookmark size={28} className="text-[var(--accent)]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--foreground)] mb-2">
          {t("title")}
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mb-6">
          {t("empty")}
        </p>
        <p className="text-xs text-[var(--foreground-muted)] mb-6">
          {t("emptySubtitle")}
        </p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t("explore")}
        </Link>
      </div>
    </div>
  )
}
