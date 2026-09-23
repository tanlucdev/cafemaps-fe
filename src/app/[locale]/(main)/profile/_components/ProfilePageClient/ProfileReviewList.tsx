"use client";

import Image from "next/image";
import { useState } from "react";
import { Coffee, MessageCircle, Star } from "lucide-react";
import { getMyReviews } from "@/apis/reviews";
import Pagination from "@/components/ui/Pagination";
import { Link } from "@/i18n/navigation";
import { getCurrentAccessToken } from "@/lib/auth-client";
import { cloudinaryImageUrl } from "@/lib/cloudinary-image";
import type { ProfileCopy } from "./constants";
import { EmptyState } from "./ProfileShared";
import type { ProfileReviewItem } from "./types";

const REVIEW_PAGE_SIZE = 5;

export function ProfileReviewList({
  copy,
  initialReviews,
  total,
}: {
  copy: ProfileCopy;
  initialReviews: ProfileReviewItem[];
  total: number;
}) {
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState(() => pageItems(initialReviews, 1));
  const [busy, setBusy] = useState(false);

  if (total === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title={copy.noReviewsTitle}
        body={copy.noReviewsBody}
        actionHref="/search"
        actionLabel={copy.exploreCafes}
      />
    );
  }

  return (
    <div>
      <div className="grid gap-3" aria-busy={busy}>
        {reviews.map((review) => (
          <ReviewCard key={review.id} copy={copy} review={review} />
        ))}
      </div>
      <Pagination page={page} total={total} limit={REVIEW_PAGE_SIZE} onPageChange={loadPage} />
    </div>
  );

  async function loadPage(nextPage: number) {
    setBusy(true);
    try {
      const token = await getCurrentAccessToken();
      if (!token) return;
      const next = await getMyReviews(token, nextPage, REVIEW_PAGE_SIZE);
      setReviews(pageItems(next.data, nextPage));
      setPage(next.meta?.page ?? nextPage);
    } finally {
      setBusy(false);
    }
  }
}

function pageItems(items: ProfileReviewItem[], page: number) {
  if (items.length <= REVIEW_PAGE_SIZE) return items;
  const start = (page - 1) * REVIEW_PAGE_SIZE;
  return items.slice(start, start + REVIEW_PAGE_SIZE);
}

function ReviewCard({ copy, review }: { copy: ProfileCopy; review: ProfileReviewItem }) {
  return (
    <article className="grid grid-cols-[68px_minmax(0,1fr)] gap-3 rounded-3xl border border-[var(--border)] bg-[#fffaf2] p-3 sm:grid-cols-[88px_minmax(0,1fr)_auto] dark:bg-white/5">
      <div className="relative size-[68px] overflow-hidden rounded-2xl bg-[var(--background-secondary)] sm:size-auto sm:h-20">
        {review.cafe.coverImage ? (
          <Image
            src={cloudinaryImageUrl(review.cafe.coverImage, "thumb")}
            alt={review.cafe.name}
            fill
            sizes="(max-width: 640px) 68px, 88px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--accent)]">
            <Coffee size={22} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-sm font-black text-[var(--foreground)] sm:text-base">
          {review.cafe.name}
        </h2>
        <p className="mt-0.5 truncate text-xs font-medium text-[var(--foreground-muted)] sm:mt-1 sm:text-sm">
          {review.cafe.district || review.cafe.address || "Ho Chi Minh City"}
        </p>
        {review.content ? (
          <p className="mt-1.5 line-clamp-3 text-sm leading-5 font-medium text-[var(--foreground)] sm:mt-2 sm:line-clamp-2 sm:leading-6">
            {review.content}
          </p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--foreground-muted)] sm:mt-2">
          {review.rating ? (
            <span className="inline-flex items-center gap-1 text-[#a06113]">
              <Star size={13} fill="currentColor" />
              {copy.rating}: {review.rating}/5
            </span>
          ) : null}
          <span>{formatDate(review.createdAt, copy)}</span>
        </div>
      </div>
      {review.cafe.isPublished && review.cafe.slug ? (
        <Link
          href={`/cafe/${review.cafe.slug}`}
          className="col-span-2 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-2xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--foreground)] transition hover:bg-[var(--background-secondary)] focus-visible:ring-3 focus-visible:ring-[var(--ring)]/30 focus-visible:outline-none sm:col-span-1 sm:h-10 sm:w-auto"
        >
          {copy.viewCafe}
        </Link>
      ) : null}
    </article>
  );
}

function formatDate(value: string, copy: ProfileCopy) {
  const locale = copy.savedCafes === "Saved cafés" ? "en-US" : "vi-VN";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}
