import Image from "next/image";
import { Bookmark, Coffee, Heart, History, MapPin, PlusCircle, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import type { ProfileCopy } from "./constants";
import { EmptyState, StatusBadge } from "./ProfileShared";
import type { ActivityPreview, ProfileTab, SubmittedCafePreview } from "./types";

export function ProfileContent({
  activeTab,
  cafes,
  copy,
  onChange,
}: {
  activeTab: ProfileTab;
  cafes: Cafe[];
  copy: ProfileCopy;
  onChange: (tab: ProfileTab) => void;
}) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-sm)] sm:p-4">
      <ProfileTabs activeTab={activeTab} copy={copy} onChange={onChange} />
      <div className="mt-4">
        {activeTab === "saved" && <SavedCafeList cafes={cafes} copy={copy} />}
        {activeTab === "quiz" && <QuizResultCard copy={copy} hasResult={false} />}
        {activeTab === "submitted" && <SubmittedCafeList copy={copy} submissions={[]} />}
        {activeTab === "activity" && <RecentActivity copy={copy} activities={[]} />}
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
    { id: "activity", label: copy.activityTab, icon: History },
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
              "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 text-sm font-bold transition focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none",
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

function SavedCafeList({ cafes, copy }: { cafes: Cafe[]; copy: ProfileCopy }) {
  if (cafes.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={copy.noSavedTitle}
        body={copy.noSavedBody}
        actionHref="/search"
        actionLabel={copy.exploreCafes}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {cafes.map((cafe) => (
        <article
          key={cafe.id}
          className="grid gap-3 rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-3 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm)] sm:grid-cols-[116px_minmax(0,1fr)_auto] sm:items-center dark:bg-white/5"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--background-secondary)] sm:aspect-auto sm:h-24">
            {cafe.coverImage ? (
              <Image
                src={cafe.coverImage}
                alt={cafe.name}
                fill
                sizes="(max-width: 640px) 100vw, 116px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[var(--accent)]">
                <Coffee size={24} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-black text-[var(--foreground)]">{cafe.name}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[var(--foreground-muted)]">
              <MapPin size={14} />
              {cafe.district || cafe.address || "Ho Chi Minh City"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cafe.vibes.slice(0, 3).map((vibe) => (
                <span
                  key={vibe}
                  className="rounded-full bg-[var(--accent-light)] px-2.5 py-1 text-xs font-bold text-[#875200] dark:text-[#f0b869]"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
          <Link
            href={`/cafe/${cafe.slug}`}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-2xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--background-secondary)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none"
          >
            {copy.view}
          </Link>
        </article>
      ))}
    </div>
  );
}

function QuizResultCard({ copy, hasResult }: { copy: ProfileCopy; hasResult: boolean }) {
  if (!hasResult) {
    return (
      <EmptyState
        icon={Sparkles}
        title={copy.quizEmptyTitle}
        body={copy.quizEmptyBody}
        actionHref="/quiz"
        actionLabel={copy.takeQuiz}
      />
    );
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-5 dark:bg-white/5">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-light)] text-[var(--accent)]">
        <Sparkles size={22} />
      </div>
      <h2 className="text-xl font-black text-[var(--foreground)]">{copy.quizTitle}</h2>
      <p className="mt-2 max-w-xl text-sm text-[var(--foreground-muted)]">{copy.quizBody}</p>
      <Link
        href="/quiz"
        className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 text-sm font-bold text-white transition hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none"
      >
        <Sparkles size={15} />
        {copy.retakeQuiz}
      </Link>
    </div>
  );
}

function SubmittedCafeList({
  copy,
  submissions,
}: {
  copy: ProfileCopy;
  submissions: SubmittedCafePreview[];
}) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        icon={PlusCircle}
        title={copy.submittedEmptyTitle}
        body={copy.submittedEmptyBody}
        actionHref="/contribute"
        actionLabel={copy.submitCafe}
      />
    );
  }

  return (
    <div className="grid gap-3">
      {submissions.map((submission) => (
        <div
          key={submission.name}
          className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-4 dark:bg-white/5"
        >
          <div>
            <h2 className="font-black text-[var(--foreground)]">{submission.name}</h2>
            <p className="text-sm text-[var(--foreground-muted)]">{submission.area}</p>
          </div>
          <StatusBadge status={submission.status} copy={copy} />
        </div>
      ))}
    </div>
  );
}

function RecentActivity({
  copy,
  activities,
}: {
  copy: ProfileCopy;
  activities: ActivityPreview[];
}) {
  if (activities.length === 0) {
    return (
      <EmptyState icon={History} title={copy.activityEmptyTitle} body={copy.activityEmptyBody} />
    );
  }

  return (
    <div className="space-y-1">
      {activities.map(({ icon: Icon, title, time }, index) => (
        <div key={title} className="grid grid-cols-[36px_minmax(0,1fr)] gap-3">
          <div className="flex flex-col items-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
              <Icon size={16} />
            </div>
            {index < activities.length - 1 && (
              <div className="h-8 border-l border-dashed border-[var(--border)]" />
            )}
          </div>
          <div className="pb-5">
            <p className="font-bold text-[var(--foreground)]">{title}</p>
            <p className="text-sm text-[var(--foreground-muted)]">{time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
