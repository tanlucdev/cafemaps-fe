import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AUTH_COOKIE_KEYS } from "@/constants/auth-keys";
import { getQuizStats, type QuizStats } from "@/apis/quiz";
import { getMyReviews } from "@/apis/reviews";
import { getMySubmissions, type CafeSubmission } from "@/apis/submissions";
import { getSavedCafeEntries } from "@/lib/api";
import { getRecentlyViewed, type RecentlyViewedCafe } from "@/apis/recently-viewed";
import { createLocalizedMetadata } from "@/lib/metadata";
import type { SavedCafeEntry } from "@/types/cafe";
import type { ProfileReviewListResponse } from "@/types/review";
import ProfilePageClient from "./_components/ProfilePageClient";
import type { ProfileTab } from "./_components/ProfilePageClient/types";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = locale === "vi" ? metadataByLocale.vi : metadataByLocale.en;

  return createLocalizedMetadata({
    locale,
    pathname: "/profile",
    title: copy.title,
    description: copy.description,
  });
}

export default async function ProfilePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const tab = (await searchParams).tab;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_KEYS.accessToken)?.value ?? null;
  const initialTab: ProfileTab = token && tab === "recently-viewed" ? "recently-viewed" : "saved";
  const [
    initialSavedEntries,
    quizStats,
    initialSubmissions,
    initialReviews,
    initialRecentlyViewed,
  ]: [
    SavedCafeEntry[],
    QuizStats,
    CafeSubmission[],
    ProfileReviewListResponse,
    RecentlyViewedCafe[],
  ] = token
    ? await Promise.all([
        getSavedCafeEntries(token, locale),
        getQuizStats(token),
        getMySubmissions(token),
        getMyReviews(token),
        getRecentlyViewed(token, locale),
      ])
    : [
        [],
        { quizCompletedCount: 0, results: [] },
        [],
        { data: [], total: 0, meta: { total: 0, page: 1, limit: 5, totalPages: 0 } },
        [],
      ];

  return (
    <ProfilePageClient
      locale={locale}
      initialIsLoggedIn={Boolean(token)}
      initialSavedEntries={initialSavedEntries}
      initialRecentlyViewed={initialRecentlyViewed}
      initialTab={initialTab}
      initialQuizCompletedCount={quizStats.quizCompletedCount}
      initialQuizResults={quizStats.results}
      initialSubmissions={initialSubmissions}
      initialReviews={initialReviews.data}
      initialReviewCount={initialReviews.total}
    />
  );
}
