"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, MessageCircle, PlusCircle, Sparkles } from "lucide-react";
import { getAuthUser, type AuthUser } from "@/lib/auth-client";
import type { SavedCafeEntry } from "@/types/cafe";
import type { ProfileReview } from "@/types/review";
import type { RecentlyViewedCafe } from "@/apis/recently-viewed";
import { copyByLocale } from "./constants";
import { ProfileContent } from "./ProfileContent";
import { ProfileHeader, ProfileStats } from "./ProfileHeader";
import { ProfileInfoCard, PreferencesCard, QuickActions } from "./ProfileSidebar";
import { getInitials } from "./helpers";
import type { ProfileQuizResult, ProfileStat, ProfileSubmission, ProfileTab } from "./types";

interface ProfilePageClientProps {
  locale: string;
  initialIsLoggedIn: boolean;
  initialSavedEntries: SavedCafeEntry[];
  initialRecentlyViewed: RecentlyViewedCafe[];
  initialTab: ProfileTab;
  initialQuizCompletedCount: number;
  initialQuizResults: ProfileQuizResult[];
  initialSubmissions: ProfileSubmission[];
  initialReviews: ProfileReview[];
  initialReviewCount: number;
}

export default function ProfilePageClient({
  locale,
  initialIsLoggedIn,
  initialSavedEntries,
  initialRecentlyViewed,
  initialTab,
  initialQuizCompletedCount,
  initialQuizResults,
  initialSubmissions,
  initialReviews,
  initialReviewCount,
}: ProfilePageClientProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [user, setUser] = useState<AuthUser | null>(null);
  const copy = locale === "vi" ? copyByLocale.vi : copyByLocale.en;
  const isLoggedIn = Boolean(user || initialIsLoggedIn);
  const displayName = user?.displayName || copy.titleFallback;
  const email = user?.email ?? (initialIsLoggedIn ? "coffee@cafemaps.vn" : "guest@cafemaps.vn");
  const initials = getInitials(displayName, email);
  const savedCafes = useMemo(
    () => initialSavedEntries.map((entry) => entry.cafe).slice(0, 4),
    [initialSavedEntries],
  );
  const stats: ProfileStat[] = [
    { label: copy.savedCafes, value: initialSavedEntries.length, icon: Bookmark },
    { label: copy.quizResults, value: initialQuizCompletedCount, icon: Sparkles },
    { label: copy.contributions, value: initialSubmissions.length, icon: PlusCircle },
    { label: copy.reviews, value: initialReviewCount, icon: MessageCircle },
  ];

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <main className="min-h-[100svh] bg-[var(--background)] px-3 pt-[88px] pb-28 sm:px-6 sm:pt-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ProfileHeader
          copy={copy}
          displayName={displayName}
          email={email}
          initials={initials}
          isLoggedIn={isLoggedIn}
          hasPreviewProfileData={!user && !initialIsLoggedIn}
        />

        <ProfileStats stats={stats} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <ProfileInfoCard copy={copy} email={email} isLoggedIn={isLoggedIn} />
            <PreferencesCard copy={copy} />
            <QuickActions copy={copy} />
          </aside>

          <ProfileContent
            activeTab={activeTab}
            cafes={savedCafes}
            isLoggedIn={isLoggedIn}
            recentlyViewed={initialRecentlyViewed}
            copy={copy}
            locale={locale}
            quizCompletedCount={initialQuizCompletedCount}
            quizResults={initialQuizResults}
            reviewCount={initialReviewCount}
            reviews={initialReviews}
            submissions={initialSubmissions}
            onChange={setActiveTab}
          />
        </div>
      </div>
    </main>
  );
}
