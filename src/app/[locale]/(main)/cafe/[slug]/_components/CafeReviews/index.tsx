"use client"

import { useCallback, useEffect, useState } from "react"
import { Edit3, Loader2, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import {
  deleteMyCafeReview,
  getCafeReviews,
  getMyCafeReview,
  isUnauthorizedError,
  upsertCafeReview,
} from "@/lib/api"
import { useRouter } from "@/i18n/navigation"
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client"
import type { CafeReview, CafeReviewListResponse } from "@/types/review"
import { ReviewRow, Stars } from "./ReviewParts"

const reviewsPageSize = 3, longReviewLength = 180

const asMine = (review: CafeReview | null) => review ? { ...review, isMine: true } : null

export default function CafeReviews({ cafeId, locale }: { cafeId: string; locale: string }) {
  const t = useTranslations("cafe.reviewSection")
  const router = useRouter()
  const [response, setResponse] = useState<CafeReviewListResponse | null>(null)
  const [mine, setMine] = useState<CafeReview | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const summary = response?.summary
  const canLoadMore = response ? response.meta.page < response.meta.totalPages : false
  const reviews = response?.data.filter((review) => review.id !== mine?.id) ?? []
  const visibleReviews = [...(mine && !editing ? [mine] : []), ...reviews]

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [list, accessToken] = await Promise.all([
        getCafeReviews(cafeId, 1, reviewsPageSize),
        getCurrentAccessToken(),
      ])
      setResponse(list)
      setToken(accessToken)
      if (accessToken) {
        const ownReview = await getMyCafeReview(cafeId, accessToken)
        setMine(asMine(ownReview))
        setRating(ownReview?.rating ?? null)
        setContent(ownReview?.content ?? "")
      }
    } catch {
      toast.error(t("loadError"))
    } finally {
      setLoading(false)
    }
  }, [cafeId, t])

  useEffect(() => {
    void load()
  }, [load])

  function login() {
    saveAuthReturnUrl()
    router.push("/login")
  }

  function edit(review?: CafeReview) {
    setRating(review?.rating ?? null)
    setContent(review?.content ?? "")
    setEditing(true)
  }

  async function loadMore() {
    if (!response || loadingMore) return
    setLoadingMore(true)
    try {
      const next = await getCafeReviews(cafeId, response.meta.page + 1, reviewsPageSize)
      setResponse({ ...next, data: [...response.data, ...next.data] })
    } catch {
      toast.error(t("loadError"))
    } finally {
      setLoadingMore(false)
    }
  }

  async function collapseReviews() {
    if (loadingMore) return
    setLoadingMore(true)
    try {
      const firstPage = await getCafeReviews(cafeId, 1, reviewsPageSize)
      setResponse(firstPage)
      setExpandedIds(new Set())
    } catch {
      toast.error(t("loadError"))
    } finally {
      setLoadingMore(false)
    }
  }

  async function submit() {
    if (!token) {
      login()
      return
    }
    const trimmed = content.trim()
    if (rating === null && !trimmed) {
      toast.warning(t("emptyError"))
      return
    }
    setSaving(true)
    try {
      const saved = await upsertCafeReview(cafeId, token, { rating, content: trimmed || null })
      setMine(asMine(saved))
      setEditing(false)
      toast.success(t(mine ? "updated" : "created"))
      await load()
    } catch (error) {
      if (isUnauthorizedError(error)) login()
      else toast.error(t("saveError"))
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!token || deleting) return
    setDeleting(true)
    try {
      await deleteMyCafeReview(cafeId, token)
      setMine(null)
      setRating(null)
      setContent("")
      setEditing(false)
      toast.success(t("deleted"))
      await load()
    } catch (error) {
      if (isUnauthorizedError(error)) login()
      else toast.error(t("deleteError"))
    } finally {
      setDeleting(false)
    }
  }

  function toggleExpanded(id: string) {
    setExpandedIds((ids) => {
      const next = new Set(ids)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  return (
    <section className="rounded-2xl border border-[#FFE3B7]/55 bg-white/72 p-4 shadow-[0_14px_36px_rgba(44,26,14,0.07)] backdrop-blur-md dark:border-[#FFE3B7]/14 dark:bg-[#1B0F08]/58">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-lg font-extrabold text-[#1C1209] dark:text-[#FFF8ED]">{t("title")}</h2>
        <p className="text-sm font-semibold text-[#7A664F] dark:text-[#E8D4BA]">
          {summary?.averageRating?.toFixed(1) ?? "-"} ★ · {t("summary", { reviewCount: summary?.reviewCount ?? 0 })}
        </p>
      </div>

      {(loading || !token || editing || !mine) && (
        <div className="mt-4 rounded-xl border border-[#F3DFC2]/80 bg-[#FFFDF8]/85 p-3 dark:border-[#4A3320] dark:bg-[#1E140D]">
          {loading ? (
            <p className="text-sm text-[#8A7967]">{t("loading")}</p>
          ) : token && editing ? (
            <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm font-bold text-[#1C1209] dark:text-[#FFF8ED]">
                  {mine ? t("editTitle") : t("formTitle")}
                </p>
                <Stars value={rating} onChange={setRating} label={t("yourRating")} />
              </div>
              {mine && (
                <button
                  type="button"
                  onClick={remove}
                  disabled={deleting}
                  aria-label={t("delete")}
                  className="grid h-8 w-8 place-items-center rounded-full border border-[#F3DFC2] text-[#8A3B2C] hover:bg-[#FFF1EB] disabled:opacity-60"
                >
                  {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              )}
            </div>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={2000}
              rows={2}
              placeholder={t("placeholder")}
              className="mt-2 w-full resize-y rounded-xl border border-[#E7D2B3] bg-white px-3 py-2 text-sm leading-6 text-[#1C1209] outline-none transition-colors placeholder:text-[#A9957C] focus:border-[#D97706] focus:ring-2 focus:ring-[#FCD58B] dark:bg-[#140D08] dark:text-[#FFF8ED]"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-[#8A7967]/75">{content.length}/2000</span>
              <button
                type="button"
                onClick={submit}
                disabled={saving}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#1C1209] px-3 text-sm font-extrabold text-white transition-colors hover:bg-[#A96E08] disabled:opacity-60"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Edit3 size={14} />}
                {mine ? t("saveEdit") : t("submit")}
              </button>
            </div>
            </>
          ) : token ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#5C4A2F] dark:text-[#F8E7CC]">{t("visitPrompt")}</p>
              <button
                type="button"
                onClick={() => edit()}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#1C1209] px-3 text-sm font-extrabold text-white hover:bg-[#A96E08]"
              >
                <Edit3 size={14} />
                {t("formTitle")}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[#5C4A2F] dark:text-[#F8E7CC]">{t("loginCopy")}</p>
              <button type="button" onClick={login} className="inline-flex h-8 items-center justify-center rounded-full bg-[#1C1209] px-3 text-sm font-extrabold text-white hover:bg-[#A96E08]">
                {t("login")}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {loading ? (
          <p className="text-sm text-[#8A7967]">{t("loading")}</p>
        ) : visibleReviews.length === 0 ? (
          <p className="text-sm text-[#8A7967]">{t("empty")}</p>
        ) : (
          visibleReviews.map((review) => {
            const expanded = expandedIds.has(review.id)
            const long = (review.content?.length ?? 0) > longReviewLength
            return (
              <ReviewRow
                key={review.id}
                review={review}
                locale={locale}
                expanded={expanded}
                long={long}
                t={t}
                onEdit={edit}
                onToggle={toggleExpanded}
              />
            )
          })
        )}
        {canLoadMore && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="mx-auto flex h-9 items-center justify-center rounded-full border border-[#E7D2B3] px-4 text-sm font-bold text-[#5C4A2F] hover:bg-[#FFF4DE] disabled:opacity-60"
          >
            {loadingMore ? <Loader2 size={15} className="animate-spin" /> : t("loadMore")}
          </button>
        )}
        {!canLoadMore && (response?.meta.page ?? 1) > 1 && (
          <button
            type="button"
            onClick={collapseReviews}
            disabled={loadingMore}
            className="mx-auto flex h-9 items-center justify-center rounded-full border border-[#E7D2B3] px-4 text-sm font-bold text-[#5C4A2F] hover:bg-[#FFF4DE] disabled:opacity-60"
          >
            {loadingMore ? <Loader2 size={15} className="animate-spin" /> : t("collapseReviews")}
          </button>
        )}
      </div>
    </section>
  )
}
