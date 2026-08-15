import type { Metadata } from "next"
import { cookies } from "next/headers"
import { AUTH_COOKIE_KEYS } from "@/constants/auth-keys"
import { getQuizStats } from "@/apis/quiz"
import { getSavedCafeEntries } from "@/lib/api"
import { createLocalizedMetadata } from "@/lib/metadata"
import type { SavedCafeEntry } from "@/types/cafe"
import ProfilePageClient from "./_components/ProfilePageClient"

interface PageProps {
  params: Promise<{ locale: string }>
}

const metadataByLocale = {
  vi: {
    title: "Trang cá nhân",
    description: "Xem quán đã lưu, kết quả quiz và đóng góp của bạn trên Cafe Maps.",
  },
  en: {
    title: "Profile",
    description: "View your saved cafés, quiz results, and Cafe Maps contributions.",
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const copy = locale === "vi" ? metadataByLocale.vi : metadataByLocale.en

  return createLocalizedMetadata({
    locale,
    pathname: "/profile",
    title: copy.title,
    description: copy.description,
  })
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_KEYS.accessToken)?.value ?? null
  const [initialSavedEntries, quizStats]: [SavedCafeEntry[], { quizCompletedCount: number }] =
    token
      ? await Promise.all([getSavedCafeEntries(token, locale), getQuizStats(token)])
      : [[], { quizCompletedCount: 0 }]

  return (
    <ProfilePageClient
      locale={locale}
      initialIsLoggedIn={Boolean(token)}
      initialSavedEntries={initialSavedEntries}
      initialQuizCompletedCount={quizStats.quizCompletedCount}
    />
  )
}
