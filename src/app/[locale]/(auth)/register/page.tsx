import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { Coffee } from "lucide-react"
import RegisterForm from "./RegisterForm"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "auth" })
  return { title: t("register") }
}

export default async function RegisterPage({ params }: PageProps) {
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
            {t("register")}
          </h1>
        </div>

        <RegisterForm locale={locale} />

        <p className="text-center text-sm text-[var(--foreground-muted)] mt-5">
          {t("hasAccount")}{" "}
          <Link href={`/${locale}/login`} className="text-[var(--accent)] hover:underline font-medium">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  )
}
