import { Bookmark, Clock3, MessageCircle, PlusCircle, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import type { ProfileCopy } from "./constants";
import type { RecentlyViewedCafe } from "@/apis/recently-viewed";
import { QuizResultList } from "./QuizResultList";
import { ProfileReviewList } from "./ProfileReviewList";
import { SavedCafeList } from "./SavedCafeList";
import { SubmittedCafeList } from "./SubmittedCafeList";
import type { ProfileQuizResult, ProfileReviewItem, ProfileSubmission, ProfileTab } from "./types";

export function ProfileContent({
  activeTab,
  cafes,
  isLoggedIn,
  recentlyViewed,
  copy,
  locale,
  quizCompletedCount,
  quizResults,
  reviewCount,
  reviews,
  submissions,
  onChange,
}: {
  activeTab: ProfileTab;
  cafes: Cafe[];
  isLoggedIn: boolean;
  recentlyViewed: RecentlyViewedCafe[];
  copy: ProfileCopy;
  locale: string;
  quizCompletedCount: number;
  quizResults: ProfileQuizResult[];
  reviewCount: number;
  reviews: ProfileReviewItem[];
  submissions: ProfileSubmission[];
  onChange: (tab: ProfileTab) => void;
}) {
  return (
    <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-[var(--shadow-sm)] sm:p-4">
      <ProfileTabs activeTab={activeTab} copy={copy} isLoggedIn={isLoggedIn} onChange={onChange} />
      <div className="mt-4">
        {activeTab === "saved" && <SavedCafeList cafes={cafes} copy={copy} />}
        {activeTab === "recently-viewed" && (
          <SavedCafeList
            cafes={recentlyViewed.slice(0, 20).map((entry) => entry.cafe)}
            copy={copy}
            locale={locale}
            viewedAtByCafeId={
              new Map(recentlyViewed.slice(0, 20).map(({ cafe, viewedAt }) => [cafe.id, viewedAt]))
            }
            emptyTitle={copy.noRecentlyViewedTitle}
            emptyBody={copy.noRecentlyViewedBody}
          />
        )}
        {activeTab === "quiz" && (
          <QuizResultList
            copy={copy}
            locale={locale}
            quizCompletedCount={quizCompletedCount}
            results={quizResults}
          />
        )}
        {activeTab === "submitted" && <SubmittedCafeList copy={copy} submissions={submissions} />}
        {activeTab === "reviews" && (
          <ProfileReviewList copy={copy} initialReviews={reviews} total={reviewCount} />
        )}
      </div>
    </section>
  );
}

function ProfileTabs({
  activeTab,
  copy,
  isLoggedIn,
  onChange,
}: {
  activeTab: ProfileTab;
  copy: ProfileCopy;
  isLoggedIn: boolean;
  onChange: (tab: ProfileTab) => void;
}) {
  const tabs: Array<{ id: ProfileTab; label: string; icon: LucideIcon }> = [
    { id: "saved", label: copy.savedTab, icon: Bookmark },
    ...(isLoggedIn
      ? [{ id: "recently-viewed" as const, label: copy.recentlyViewedTab, icon: Clock3 }]
      : []),
    { id: "quiz", label: copy.quizTab, icon: Sparkles },
    { id: "submitted", label: copy.submittedTab, icon: PlusCircle },
    { id: "reviews", label: copy.reviewsTab, icon: MessageCircle },
  ];

  return (
    <div
      role="tablist"
      aria-label="Profile sections"
      className="flex gap-2 overflow-x-auto rounded-3xl bg-[var(--background-secondary)] p-1"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              onChange(id);
              const url = new URL(window.location.href);
              if (id === "recently-viewed") url.searchParams.set("tab", id);
              else url.searchParams.delete("tab");
              window.history.replaceState(null, "", url);
            }}
            className={cn(
              "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl px-3 text-sm font-bold transition focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none sm:px-4",
              isActive
                ? "bg-[var(--card)] text-[var(--accent)] shadow-[var(--shadow-sm)]"
                : "text-[var(--foreground-muted)] hover:bg-white/45 hover:text-[var(--foreground)] dark:hover:bg-white/5",
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
