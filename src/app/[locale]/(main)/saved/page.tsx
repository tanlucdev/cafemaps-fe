import type { Metadata } from "next"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import { getSavedCafes } from "@/lib/api"
import SavedCafesClient from "./_components/SavedCafesClient"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "saved" })
  return {
    title: t("title"),
    description: t("heroSubtitle"),
  }
}

export default async function SavedPage({ params }: PageProps) {
  const { locale } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get("cafe-auth-token")?.value ?? null
  const initialIsLoggedIn = Boolean(token)
  const initialCafes = token ? await getSavedCafes(token) : []

  return (
    <SavedCafesClient
      locale={locale}
      initialIsLoggedIn={initialIsLoggedIn}
      initialCafes={initialCafes}
    />
  )
}
