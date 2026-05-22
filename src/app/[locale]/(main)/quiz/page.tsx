import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "quiz" })
  return {
    title: t("title"),
    description: t("subtitle"),
  }
}

export default async function QuizPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "quiz" })

  return (
    <div className="flex min-h-[100svh] items-center justify-center px-4 pt-24 pb-16">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center mx-auto mb-5">
          <Sparkles size={28} className="text-[var(--accent)]" />
        </div>
        <h1 className="font-display text-3xl font-bold text-[var(--foreground)] mb-3">
          {t("title")}
        </h1>
        <p className="text-[var(--foreground-muted)] text-sm mb-8 leading-relaxed">
          {t("subtitle")}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Sparkles size={15} />
          {t("start")}
        </Link>
      </div>
    </div>
  )
}
