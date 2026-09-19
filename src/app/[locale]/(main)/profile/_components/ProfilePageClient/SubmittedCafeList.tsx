import { PlusCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ProfileCopy } from "./constants";
import { EmptyState, StatusBadge } from "./ProfileShared";
import type { ProfileSubmission } from "./types";

export function SubmittedCafeList({
  copy,
  submissions,
}: {
  copy: ProfileCopy;
  submissions: ProfileSubmission[];
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
      {submissions.map((submission) => {
        const cafeHref =
          submission.status === "approved" && submission.createdCafe?.slug
            ? `/cafe/${submission.createdCafe.slug}`
            : null;
        return (
          <div
            key={submission.id}
            className="flex flex-col gap-3 rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-white/5"
          >
            <div className="min-w-0">
              <h2 className="truncate font-black text-[var(--foreground)]">{submission.name}</h2>
              <p className="mt-1 truncate text-sm text-[var(--foreground-muted)]">
                {submission.address || submission.createdCafe?.district || copy.location}
              </p>
              <p className="mt-1 text-xs font-bold text-[var(--foreground-muted)]">
                {formatDate(submission.createdAt, copy)}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <StatusBadge status={submission.status} copy={copy} />
              {cafeHref && (
                <Link
                  href={cafeHref}
                  className="inline-flex h-9 cursor-pointer items-center justify-center rounded-2xl border border-[var(--border)] px-3 text-xs font-black text-[var(--foreground)] transition hover:bg-[var(--background-secondary)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none"
                >
                  {copy.viewCafe}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDate(value: string, copy: ProfileCopy) {
  const locale = copy.savedCafes === "Saved cafés" ? "en-US" : "vi-VN";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}
