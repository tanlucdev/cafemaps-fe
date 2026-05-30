import type { Metadata } from "next"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import { AUTH_COOKIE_KEYS } from "@/constants/auth-keys"
import { getSavedCafeEntries } from "@/lib/api"
import { createLocalizedMetadata } from "@/lib/metadata"
import SavedCafesClient from "./_components/SavedCafesClient"
import type { SavedCafeEntry } from "@/types/cafe"

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "saved" })
  return createLocalizedMetadata({
    locale,
    pathname: "/saved",
    title: t("title"),
    description: t("heroSubtitle"),
  })
}

export default async function SavedPage({ params }: PageProps) {
  const { locale } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_KEYS.accessToken)?.value ?? null
  const initialIsLoggedIn = Boolean(token)
  const initialEntries: SavedCafeEntry[] = token ? await getSavedCafeEntries(token, locale) : []

  return (
    <SavedCafesClient
      locale={locale}
      initialIsLoggedIn={initialIsLoggedIn}
      initialEntries={initialEntries}
    />
  )
}
