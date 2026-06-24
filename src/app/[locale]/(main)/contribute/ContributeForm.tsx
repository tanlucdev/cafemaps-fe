"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coffee,
  Eye,
  ImagePlus,
  Loader2,
  MapPin,
  RotateCcw,
  Send,
  UploadCloud,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FormData {
  googleMapsUrl: string
  reason: string
  photos: File[]
}

interface Errors {
  googleMapsUrl?: string
}

const INITIAL: FormData = { googleMapsUrl: "", reason: "", photos: [] }

const fieldBase = [
  "w-full rounded-[14px] border bg-[var(--card)] px-3.5 py-2.5 text-[13.5px] text-[var(--foreground)] sm:py-3",
  "placeholder:text-[var(--foreground-muted)]/70 outline-none transition-all duration-150",
  "focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_3px_rgba(201,132,42,0.16)]",
].join(" ")

function Q({ label, hint, error, children }: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[13.5px] font-bold leading-snug text-[var(--foreground)]">
        {label}
      </label>
      {hint && <p className="-mt-1 hidden text-[12px] leading-snug text-[var(--foreground-muted)] min-[421px]:block sm:leading-relaxed">{hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#B23A2F]">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

function Inp({ error, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(fieldBase, error ? "border-[#B23A2F]" : "border-[var(--border)]", className)}
    />
  )
}

function StepProgress({ current }: { current: number }) {
  const t = useTranslations("contribute")
  const steps = [
    { icon: MapPin, title: t("steps.share") },
    { icon: Eye, title: t("steps.review") },
  ]

  return (
    <div className="mb-3 flex items-center justify-center gap-2 sm:mb-6">
      {steps.map((step, i) => {
        const idx = i + 1
        const isActive = idx === current
        const isDone = idx < current
        const Icon = step.icon
        return (
          <div key={idx} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-all duration-200 sm:py-2",
                isActive && "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] shadow-[0_10px_24px_rgba(201,132,42,0.12)]",
                isDone && "border-[var(--status-open)]/25 bg-[var(--status-open-background)] text-[var(--status-open-foreground)]",
                !isActive && !isDone && "border-[var(--border)] bg-white/35 text-[var(--foreground-muted)] dark:bg-white/5",
              )}
            >
              {isDone ? <CheckCircle2 className="size-3.5" aria-hidden="true" /> : <Icon className="size-3.5" aria-hidden="true" />}
              <span className="max-[420px]:sr-only">{step.title}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("hidden h-px w-8 rounded-full sm:block", isDone ? "bg-[var(--status-open)]" : "bg-[var(--border)]")} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Step1({ data, setData, errors, photoUrls }: {
  data: FormData
  setData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Errors
  photoUrls: string[]
}) {
  const t = useTranslations("contribute")
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files).filter((f) => f.type.startsWith("image/"))
    setData((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles].slice(0, 8) }))
  }

  const removePhoto = (idx: number) => {
    setData((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="space-y-3.5 sm:space-y-5">
      <Q label={t("form.googleMapsLabel")} hint={t("form.googleMapsHint")} error={errors.googleMapsUrl}>
        <Inp
          placeholder="https://maps.google.com/..."
          value={data.googleMapsUrl}
          onChange={(e) => setData((prev) => ({ ...prev, googleMapsUrl: e.target.value }))}
          type="url"
          error={!!errors.googleMapsUrl}
        />
      </Q>

      <Q label={t("form.reasonLabel")} hint={t("form.reasonHint")}>
        <div className="relative">
          <textarea
            rows={2}
            maxLength={300}
            placeholder={t("form.reasonPlaceholder")}
            value={data.reason}
            onChange={(e) => setData((prev) => ({ ...prev, reason: e.target.value }))}
            className={cn(fieldBase, "resize-none border-[var(--border)] pr-16 max-[420px]:min-h-13")}
          />
          <span className="absolute right-3 bottom-2.5 text-[11px] text-[var(--foreground-muted)]">{data.reason.length}/300</span>
        </div>
      </Q>

      <Q label={t("form.photosLabel")} hint={t("form.photosHint")}>
        <div
          className={cn(
            "group rounded-[16px] border-2 border-dashed px-4 py-2 text-center transition-all duration-150 sm:rounded-[20px] sm:px-5 sm:py-6",
            dragOver
              ? "border-[var(--accent)] bg-[var(--accent-light)]"
              : "border-[#d9b574]/70 bg-[#fffaf2]/70 hover:border-[var(--accent)] hover:bg-[var(--accent-light)] dark:bg-white/5",
          )}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        >
          <div className="mx-auto mb-1 flex size-8 items-center justify-center rounded-full bg-[#1f1209]/8 text-[var(--accent)] dark:bg-white/10 sm:mb-3 sm:size-11">
            {dragOver ? <UploadCloud className="size-5" aria-hidden="true" /> : <ImagePlus className="size-5" aria-hidden="true" />}
          </div>
          <p className="text-[12.5px] font-bold text-[var(--foreground)] sm:text-[13.5px]">{t("form.dropTitle")}</p>
          <p className="mt-0.5 hidden text-[12px] text-[var(--foreground-muted)] sm:block">{t("form.dropSubtitle")}</p>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => addFiles(e.target.files)} />
        </div>
        {data.photos.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {data.photos.map((_, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-[14px] bg-[var(--background-secondary)] shadow-[0_8px_20px_rgba(44,26,14,0.08)]">
                <Image src={photoUrls[i]} alt={t("form.photoAlt", { index: i + 1 })} fill className="object-cover" sizes="120px" unoptimized />
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 rounded-full bg-[#1f1209]/80 px-2 py-0.5 text-[9px] font-bold text-[#fff0d2] backdrop-blur">
                    {t("form.cover")}
                  </span>
                )}
                <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(i) }}
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/80">
                  <X className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">{t("form.removePhoto")}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </Q>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-[var(--border)]/70 py-3 last:border-0">
      <span className="w-24 shrink-0 pt-px text-[12px] text-[var(--foreground-muted)]">{label}</span>
      <span className="flex-1 break-all text-[13.5px] text-[var(--foreground)]">{value}</span>
    </div>
  )
}

function Step2({ data, photoUrls }: { data: FormData; photoUrls: string[] }) {
  const t = useTranslations("contribute")

  return (
    <div className="space-y-4">
      {photoUrls[0] && (
        <div className="relative h-44 w-full overflow-hidden rounded-[22px] bg-[var(--background-secondary)]">
          <Image src={photoUrls[0]} alt={t("review.coverAlt")} fill className="object-cover" sizes="640px" unoptimized />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-full border border-[#ffe3b7]/30 bg-[#1f1209]/55 px-3 py-1 text-[11px] font-bold text-[#fff0d2] backdrop-blur-md">
            {t("review.cover")}
          </span>
        </div>
      )}

      <div className="rounded-[20px] border border-[var(--border)] bg-[#fffaf2]/70 px-4 py-1 shadow-[0_10px_28px_rgba(44,26,14,0.06)] backdrop-blur dark:bg-white/5">
        <div className="flex items-center gap-2 border-b border-[var(--border)]/70 py-3">
          <Coffee className="size-4 text-[var(--accent)]" aria-hidden="true" />
          <h3 className="text-[13px] font-bold text-[var(--foreground)]">{t("review.title")}</h3>
        </div>
        <ReviewRow label={t("review.googleMaps")} value={
          <a href={data.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="font-medium text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]">
            {data.googleMapsUrl}
          </a>
        } />
        {data.reason && <ReviewRow label={t("review.reason")} value={data.reason} />}
      </div>

      {data.photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {photoUrls.slice(1).map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-[14px] bg-[var(--background-secondary)]">
              <Image src={url} alt={t("form.photoAlt", { index: i + 2 })} fill className="object-cover" sizes="100px" unoptimized />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-[16px] border border-[var(--status-open)]/20 bg-[var(--status-open-background)] px-3.5 py-3">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--status-open-foreground)]" aria-hidden="true" />
        <p className="text-[12.5px] leading-relaxed text-[var(--status-open-foreground)]">{t("review.note")}</p>
      </div>
    </div>
  )
}

function SuccessView({ onReset }: { onReset: () => void }) {
  const t = useTranslations("contribute")

  return (
    <div className="animate-[fadeUp_0.35s_ease_both] py-8 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#1f1209] text-[#fff0d2] shadow-[0_14px_34px_rgba(44,26,14,0.18)] dark:bg-[#fff0d2] dark:text-[#1f1209]">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </div>
      <h2 className="mb-2 font-lora text-[24px] font-bold text-[var(--foreground)]">{t("success.title")}</h2>
      <p className="mx-auto mb-6 max-w-sm text-[13.5px] leading-relaxed text-[var(--foreground-muted)]">{t("success.body")}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/30">
          {t("success.explore")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <button type="button" onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white/40 px-5 py-3 text-[13.5px] font-bold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/25 dark:bg-white/5">
          <RotateCcw className="size-4" aria-hidden="true" />
          {t("success.again")}
        </button>
      </div>
    </div>
  )
}

export default function ContributeForm() {
  const t = useTranslations("contribute")
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [photoUrls, setPhotoUrls] = useState<string[]>([])

  useEffect(() => {
    const urls = data.photos.map((f) => URL.createObjectURL(f))
    setPhotoUrls(urls)
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)) }
  }, [data.photos])

  const validate = (): boolean => {
    const e: Errors = {}
    if (!data.googleMapsUrl.trim()) {
      e.googleMapsUrl = t("errors.googleMapsRequired")
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    setStep(2)
  }

  const back = () => {
    setStep(1)
    setErrors({})
  }

  const submit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setDone(true)
  }

  const reset = () => {
    setData(INITIAL)
    setStep(1)
    setErrors({})
    setDone(false)
  }

  return (
    <div className={cn(
      "flex-1 overflow-y-auto rounded-[24px] border border-[var(--border)] bg-[#fffaf2]/86 px-4 py-3.5 shadow-[0_18px_50px_rgba(44,26,14,0.12)] backdrop-blur-xl sm:rounded-[28px] sm:px-7 sm:py-6 dark:bg-[#2a2825]/82",
      !done && "animate-[fadeUp_0.35s_ease_both]",
    )}>
      {done ? (
        <SuccessView onReset={reset} />
      ) : (
        <>
          <StepProgress current={step} />

          {step === 1 && <Step1 data={data} setData={setData} errors={errors} photoUrls={photoUrls} />}
          {step === 2 && <Step2 data={data} photoUrls={photoUrls} />}

          <div className="mt-4 flex items-center gap-3 sm:mt-6">
            {step > 1 && (
              <button type="button" onClick={back}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white/40 px-4 py-2.5 text-[13.5px] font-bold text-[var(--foreground-muted)] transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/25 dark:bg-white/5">
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t("actions.back")}
              </button>
            )}
            <button type="button" onClick={step === 2 ? submit : next} disabled={loading}
              className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-[13.5px] font-bold text-white shadow-[0_12px_28px_rgba(201,132,42,0.22)] transition-all duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/30 disabled:opacity-60 sm:min-h-11 sm:min-w-36 sm:flex-none sm:py-2.5">
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  {t("actions.submitting")}
                </>
              ) : step === 2 ? (
                <>
                  <Send className="size-4" aria-hidden="true" />
                  {t("actions.submit")}
                </>
              ) : (
                <>
                  {t("actions.review")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
          <p className="mt-1 text-center text-[11px] text-[var(--foreground-muted)] sm:mt-3 sm:text-[12px]">{t("stepCount", { step, total: 2 })}</p>
        </>
      )}
    </div>
  )
}
