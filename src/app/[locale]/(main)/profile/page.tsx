import type { Metadata } from "next"
import { cookies } from "next/headers"
import { AUTH_COOKIE_KEYS } from "@/constants/auth-keys"
import { getQuizStats, type QuizStats } from "@/apis/quiz"
import { getMyReviews } from "@/apis/reviews"
import { getMySubmissions, type CafeSubmission } from "@/apis/submissions"
import { getSavedCafeEntries } from "@/lib/api"
import { createLocalizedMetadata } from "@/lib/metadata"
import type { SavedCafeEntry } from "@/types/cafe"
import type { ProfileReviewListResponse } from "@/types/review"
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
  const [initialSavedEntries, quizStats, initialSubmissions, initialReviews]: [
    SavedCafeEntry[],
    QuizStats,
    CafeSubmission[],
    ProfileReviewListResponse,
  ] =
    token
      ? await Promise.all([
          getSavedCafeEntries(token, locale),
          getQuizStats(token),
          getMySubmissions(token),
          getMyReviews(token),
        ])
      : [
          [],
          { quizCompletedCount: 0, results: [] },
          [],
          { data: [], total: 0, meta: { total: 0, page: 1, limit: 5, totalPages: 0 } },
        ]

  return (
    <ProfilePageClient
      locale={locale}
      initialIsLoggedIn={Boolean(token)}
      initialSavedEntries={initialSavedEntries}
      initialQuizCompletedCount={quizStats.quizCompletedCount}
      initialQuizResults={quizStats.results}
      initialSubmissions={initialSubmissions}
      initialReviews={initialReviews.data}
      initialReviewCount={initialReviews.total}
    />
  )
}
