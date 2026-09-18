import { Edit3, Star } from "lucide-react"
import type { CafeReview } from "@/types/review"

export function Stars({
  value,
  onChange,
  label,
}: {
  value: number | null
  onChange?: (value: number | null) => void
  label: string
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = value !== null && star <= value
        if (!onChange) return <Star key={star} size={14} className={active ? "fill-[#D97706] text-[#D97706]" : "text-[#C8B7A3]"} />
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(value === star ? null : star)}
            className="grid h-7 w-7 place-items-center rounded-full text-[#C8B7A3] transition-colors hover:bg-[#FFF4DE] hover:text-[#D97706] focus-visible:ring-2 focus-visible:ring-[#D97706]"
            aria-label={`${star}`}
          >
            <Star size={17} className={active ? "fill-[#D97706] text-[#D97706]" : "text-current"} />
          </button>
        )
      })}
    </div>
  )
}

function formatDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ReviewRow({
  review,
  locale,
  expanded,
  long,
  t,
  onEdit,
  onToggle,
}: {
  review: CafeReview
  locale: string
  expanded: boolean
  long: boolean
  t: (key: string) => string
  onEdit: (review: CafeReview) => void
  onToggle: (id: string) => void
}) {
  return (
    <article className="rounded-xl border border-[#F3DFC2]/85 bg-white/72 p-3 dark:border-[#4A3320] dark:bg-[#1E140D]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-sm font-bold text-[#1C1209] dark:text-[#FFF8ED]">{review.isMine ? t("you") : review.authorName}</p>
        <p className="text-xs text-[#8A7967]">{formatDate(review.updatedAt, locale)}</p>
        {review.rating !== null && <Stars value={review.rating} label={t("rating")} />}
        {review.isMine && (
          <button type="button" onClick={() => onEdit(review)} aria-label={t("edit")} className="grid h-7 w-7 place-items-center rounded-full border border-[#F3DFC2] text-[#5C4A2F] hover:bg-[#FFF4DE]">
            <Edit3 size={14} />
          </button>
        )}
      </div>
      {review.content && (
        <>
          <p className={`mt-2 whitespace-pre-wrap text-sm leading-6 text-[#5C4A2F] dark:text-[#F8E7CC] ${expanded ? "" : "line-clamp-3"}`}>{review.content}</p>
          {long && (
            <button type="button" onClick={() => onToggle(review.id)} className="mt-1 text-xs font-bold text-[#A96E08]">
              {expanded ? t("showLess") : t("showMore")}
            </button>
          )}
        </>
      )}
    </article>
  )
}
