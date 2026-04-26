import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Coffee } from "lucide-react"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth" })
  return { title: t("login") }
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth" })

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--accent)] text-white mb-4">
            <Coffee size={22} />
          </Link>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            {t("login")}
          </h1>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--foreground-muted)] block">
              {t("email")}
            </label>
            <input
              type="email"
              className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--foreground-muted)] block">
                {t("password")}
              </label>
              <Link href="#" className="text-xs text-[var(--accent)] hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>
            <input
              type="password"
              className="w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] px-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>
          <button className="w-full h-11 rounded-full bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity mt-2">
            {t("login")}
          </button>
        </div>

        <p className="text-center text-sm text-[var(--foreground-muted)] mt-5">
          {t("noAccount")}{" "}
          <Link href={`/${locale}/register`} className="text-[var(--accent)] hover:underline font-medium">
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  )
}
