import { Bookmark, MessageCircle, PlusCircle, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import type { ProfileCopy } from "./constants";
import { QuizResultList } from "./QuizResultList";
import { ProfileReviewList } from "./ProfileReviewList";
import { SavedCafeList } from "./SavedCafeList";
import { SubmittedCafeList } from "./SubmittedCafeList";
import type { ProfileQuizResult, ProfileReviewItem, ProfileSubmission, ProfileTab } from "./types";

export function ProfileContent({
  activeTab,
  cafes,
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
      <ProfileTabs activeTab={activeTab} copy={copy} onChange={onChange} />
      <div className="mt-4">
        {activeTab === "saved" && <SavedCafeList cafes={cafes} copy={copy} />}
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
  onChange,
}: {
  activeTab: ProfileTab;
  copy: ProfileCopy;
  onChange: (tab: ProfileTab) => void;
}) {
  const tabs: Array<{ id: ProfileTab; label: string; icon: LucideIcon }> = [
    { id: "saved", label: copy.savedTab, icon: Bookmark },
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
            onClick={() => onChange(id)}
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
