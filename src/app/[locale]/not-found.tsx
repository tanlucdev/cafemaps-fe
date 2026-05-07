import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function NotFound() {
  const t = await getTranslations("notFound")
  const tc = await getTranslations("common")

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <p className="font-display text-8xl font-bold text-[var(--border)] mb-4">404</p>
        <h1 className="font-display text-2xl font-bold text-[var(--foreground)] mb-2">
          {t("title")}
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mb-6">
          {t("description")}
        </p>
        <Link
          href="/vi"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {tc("goHome")}
        </Link>
      </div>
    </div>
  )
}
