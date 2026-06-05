"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface FormData {
  googleMapsUrl: string
  reason: string
  photos: File[]
}

interface Errors {
  googleMapsUrl?: string
}

const STEPS = [
  { emoji: "📍", title: "Chia sẻ quán" },
  { emoji: "👀", title: "Xem lại trước khi gửi" },
]

const INITIAL: FormData = { googleMapsUrl: "", reason: "", photos: [] }

const fieldBase = [
  "w-full px-[12px] py-[10px] rounded-[10px] border-[1.5px] bg-[#FAF6F1] text-[#1C1209] text-[13.5px]",
  "placeholder:text-[#9B8B73] outline-none transition-all duration-150",
  "focus:border-[#C9870C] focus:shadow-[0_0_0_3px_rgba(201,135,12,0.12)]",
].join(" ")

function Q({ label, hint, error, children }: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block italic text-[15px] leading-snug text-[#1C1209] font-lora">
        {label}
      </label>
      {hint && <p className="text-[12px] text-[#9B8B73] -mt-1">{hint}</p>}
      {children}
      {error && (
        <p className="text-[12px] text-[#C0392B] flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="8" cy="8" r="7" stroke="#C0392B" strokeWidth="1.5" />
            <path d="M8 4.5v4M8 10.5v1" stroke="#C0392B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
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
      className={cn(fieldBase, error ? "border-[#C0392B]" : "border-[#E0D3C0]", className)}
    />
  )
}

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-5">
      {STEPS.map((step, i) => {
        const idx = i + 1
        const isActive = idx === current
        const isDone = idx < current
        return (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "rounded-full transition-all duration-200",
                isActive ? "w-3 h-3 bg-[#C9870C]" : isDone ? "w-2 h-2 bg-[#1EA055]" : "w-2 h-2 bg-[#E0D3C0]",
              )} />
              {isActive && (
                <span className="text-[11px] font-medium text-[#C9870C] whitespace-nowrap">
                  {step.emoji} {step.title}
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn("w-8 h-0.5 mx-1 rounded-full", isDone ? "bg-[#1EA055]" : "bg-[#ECE4D6]")}
                style={{ marginBottom: isActive || (i + 2 === current) ? "18px" : "0" }}
              />
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
    <div className="space-y-4">
      <Q label="Link Google Maps của quán? *" hint="Paste link Google Maps để mọi người dễ tìm đến" error={errors.googleMapsUrl}>
        <Inp
          placeholder="https://maps.google.com/..."
          value={data.googleMapsUrl}
          onChange={(e) => setData((prev) => ({ ...prev, googleMapsUrl: e.target.value }))}
          type="url"
          error={!!errors.googleMapsUrl}
        />
      </Q>

      <Q label="Tại sao bạn thích quán này?" hint="Kể tự nhiên thôi, kiểu như bạn đang nhắn tin cho bạn bè vậy 😊">
        <div className="relative">
          <textarea
            rows={3}
            maxLength={300}
            placeholder="Ví dụ: Quán này view đẹp lắm, ngồi làm việc cả ngày không chán..."
            value={data.reason}
            onChange={(e) => setData((prev) => ({ ...prev, reason: e.target.value }))}
            className={cn(fieldBase, "border-[#E0D3C0] resize-none")}
          />
          <span className="absolute bottom-2.5 right-3 text-[11px] text-[#9B8B73]">{data.reason.length}/300</span>
        </div>
      </Q>

      <Q label="Ảnh thực của quán" hint="Không bắt buộc — tối đa 8 ảnh">
        <div
          className={cn(
            "rounded-[16px] border-2 border-dashed px-4 py-5 text-center cursor-pointer transition-all duration-150",
            dragOver
              ? "border-[#C9870C] bg-[rgba(201,135,12,0.05)]"
              : "border-[#E0D3C0] bg-[#FAF6F1] hover:border-[#C9870C] hover:bg-[rgba(201,135,12,0.03)]",
          )}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        >
          <div className="text-2xl mb-1">📷</div>
          <p className="text-[13px] font-medium text-[#5C4A2F]">Kéo thả ảnh vào đây</p>
          <p className="text-[12px] text-[#9B8B73] mt-0.5">hoặc click để chọn</p>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => addFiles(e.target.files)} />
        </div>
        {data.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {data.photos.map((_, i) => (
              <div key={i} className="relative aspect-square rounded-[10px] overflow-hidden bg-[#EDE4D6]">
                <Image src={photoUrls[i]} alt={`Ảnh quán đã chọn ${i + 1}`} fill className="object-cover" sizes="100px" unoptimized />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-[#C9870C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    Bìa
                  </span>
                )}
                <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(i) }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[11px] flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer">
                  ×
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
    <div className="flex gap-3 py-2.5 border-b border-[#ECE4D6] last:border-0">
      <span className="text-[12px] text-[#9B8B73] w-24 shrink-0 pt-px">{label}</span>
      <span className="text-[13px] text-[#1C1209] flex-1 break-all">{value}</span>
    </div>
  )
}

function Step2({ data, photoUrls }: { data: FormData; photoUrls: string[] }) {
  return (
    <div className="space-y-4">
      {photoUrls[0] && (
        <div className="relative w-full h-32 rounded-[14px] overflow-hidden bg-[#EDE4D6]">
          <Image src={photoUrls[0]} alt="Ảnh bìa quán đã chọn" fill className="object-cover" sizes="600px" unoptimized />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className="rounded-[14px] border border-[#E0D3C0] bg-white px-4 py-1">
        <ReviewRow label="Google Maps" value={
          <a href={data.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="text-[#C9870C] underline underline-offset-2 hover:text-[#A96E08] transition-colors">
            {data.googleMapsUrl}
          </a>
        } />
        {data.reason && <ReviewRow label="Lý do" value={data.reason} />}
      </div>

      {data.photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {photoUrls.slice(1).map((url, i) => (
            <div key={i} className="relative aspect-square rounded-[10px] overflow-hidden bg-[#EDE4D6]">
              <Image src={url} alt={`Ảnh quán đã chọn ${i + 2}`} fill className="object-cover" sizes="100px" unoptimized />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 bg-[#E6F5EE] border border-[#1EA055]/20 rounded-[10px] px-3 py-2.5">
        <span className="text-[16px] mt-0.5">✅</span>
        <p className="text-[12px] text-[#166638]">
          Quán của bạn sẽ được đội ngũ kiểm duyệt trong{" "}
          <strong>1–3 ngày làm việc</strong> trước khi xuất hiện trên Cafe Maps.
        </p>
      </div>
    </div>
  )
}

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-6 animate-[fadeUp_0.35s_ease_both]">
      <div className="text-[44px] mb-3 animate-[pop_0.4s_ease_both]">☕</div>
      <h2 className="font-bold text-[21px] text-[#1C1209] mb-2">Cảm ơn bạn đã chia sẻ!</h2>
      <p className="text-[13.5px] text-[#5C4A2F] max-w-sm mx-auto leading-relaxed mb-5">
        Quán sẽ được kiểm duyệt trong{" "}
        <strong className="text-[#1EA055]">1–3 ngày làm việc</strong> rồi xuất hiện trên Cafe Maps.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/"
          className="px-5 py-2.5 rounded-full bg-[#C9870C] text-white font-bold text-[13.5px] hover:bg-[#A96E08] transition-colors">
          Khám phá danh sách quán
        </Link>
        <button type="button" onClick={onReset}
          className="px-5 py-2.5 rounded-full border-[1.5px] border-[#E0D3C0] text-[#5C4A2F] font-medium text-[13.5px] hover:border-[#C9870C] hover:text-[#C9870C] transition-colors cursor-pointer">
          Chia sẻ thêm một quán khác
        </button>
      </div>
    </div>
  )
}

export default function ContributeForm() {
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
      e.googleMapsUrl = "Link Google Maps là bắt buộc để mọi người tìm được quán nhé"
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
      "bg-white rounded-[28px] border border-[#E0D3C0] shadow-[0_4px_24px_rgba(28,18,9,0.07)] px-7 py-6 overflow-y-auto flex-1",
      !done && "animate-[fadeUp_0.35s_ease_both]",
    )}>
      {done ? (
        <SuccessView onReset={reset} />
      ) : (
        <>
          <StepProgress current={step} />

          {step === 1 && <Step1 data={data} setData={setData} errors={errors} photoUrls={photoUrls} />}
          {step === 2 && <Step2 data={data} photoUrls={photoUrls} />}

          <div className="flex items-center gap-3 mt-6">
            {step > 1 && (
              <button type="button" onClick={back}
                className="px-5 py-2.5 rounded-full border-[1.5px] border-[#E0D3C0] text-[#5C4A2F] font-medium text-[13.5px] hover:border-[#C9870C] hover:text-[#C9870C] transition-all duration-150 cursor-pointer">
                ← Quay lại
              </button>
            )}
            <button type="button" onClick={step === 2 ? submit : next} disabled={loading}
              className="flex-1 sm:flex-none sm:min-w-32.5 px-5 py-2.5 rounded-full bg-[#C9870C] text-white font-bold text-[13.5px] hover:bg-[#A96E08] disabled:opacity-60 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                  </svg>
                  Đang gửi...
                </>
              ) : step === 2 ? "Gửi đề xuất ☕" : "Xem lại →"}
            </button>
          </div>
          <p className="text-center text-[12px] text-[#9B8B73] mt-2">Bước {step} / 2</p>
        </>
      )}
    </div>
  )
}
