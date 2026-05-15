"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { AREAS, VIBES, PURPOSES } from "@/types/cafe"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormData {
  name: string
  address: string
  district: string
  googleMapsUrl: string
  priceMin: string
  priceMax: string
  vibes: string[]
  purposes: string[]
  amenities: string[]
  hoursWeekday: { open: string; close: string }
  hoursSaturday: { open: string; close: string }
  hoursSunday: { open: string; close: string }
  signatureDrink: string
  photos: File[]
  description: string
  rating: number
  submitterName: string
}

interface Errors {
  name?: string
  address?: string
  description?: string
}

const AMENITIES = ["WiFi", "Ổ cắm", "Pet-friendly", "Đỗ xe", "Điều hòa", "Sân ngoài trời"]

const VIBE_LABELS: Record<string, string> = {
  "minimalist": "Minimalist",
  "yên tĩnh": "Yên tĩnh",
  "vintage": "Vintage",
  "thiên nhiên": "Thiên nhiên",
  "hiện đại": "Hiện đại",
  "lãng mạn": "Lãng mạn",
  "nhộn nhịp": "Nhộn nhịp",
  "sáng tạo": "Sáng tạo",
}

const PURPOSE_LABELS: Record<string, string> = {
  "làm việc": "Làm việc",
  "học tập": "Học tập",
  "hẹn hò": "Hẹn hò",
  "họp nhóm": "Họp nhóm",
  "chill một mình": "Chill một mình",
  "gặp bạn bè": "Gặp bạn bè",
}

const RATING_LABELS = ["", "Tệ", "Tạm", "Ổn", "Tốt", "Tuyệt!"]

const STEPS = [
  { emoji: "📍", title: "Quán đó ở đâu?" },
  { emoji: "✨", title: "Quán như thế nào?" },
  { emoji: "📸", title: "Ảnh thực của quán" },
  { emoji: "👀", title: "Xem lại trước khi gửi" },
]

const INITIAL: FormData = {
  name: "", address: "", district: "", googleMapsUrl: "",
  priceMin: "", priceMax: "",
  vibes: [], purposes: [], amenities: [],
  hoursWeekday: { open: "", close: "" },
  hoursSaturday: { open: "", close: "" },
  hoursSunday: { open: "", close: "" },
  signatureDrink: "",
  photos: [], description: "", rating: 0, submitterName: "",
}

function Q({ label, hint, error, children }: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="block italic text-[17px] leading-snug text-[#1C1209] font-lora">
        {label}
      </label>
      {hint && <p className="text-[13px] text-[#9B8B73] -mt-1">{hint}</p>}
      {children}
      {error && (
        <p className="text-[12.5px] text-[#C0392B] flex items-center gap-1">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
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
      className={[
        "w-full px-[14px] py-[12px] rounded-[12px] border-[1.5px] bg-[#FAF6F1] text-[#1C1209] text-[14.5px]",
        "placeholder:text-[#9B8B73] outline-none transition-all duration-150",
        "focus:border-[#C9870C] focus:shadow-[0_0_0_3px_rgba(201,135,12,0.12)]",
        error ? "border-[#C0392B]" : "border-[#E0D3C0]",
        className,
      ].join(" ")}
    />
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-[15px] py-[7px] rounded-full border-[1.5px] text-[14px] font-medium transition-all duration-150 cursor-pointer",
        active
          ? "border-[#C9870C] bg-[rgba(201,135,12,0.11)] text-[#C9870C]"
          : "border-[#E0D3C0] bg-white text-[#5C4A2F] hover:border-[#C9870C] hover:text-[#C9870C]",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const idx = i + 1
        const isActive = idx === current
        const isDone = idx < current
        return (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  "rounded-full transition-all duration-200",
                  isActive ? "w-3 h-3 bg-[#C9870C]" : isDone ? "w-2 h-2 bg-[#1EA055]" : "w-2 h-2 bg-[#E0D3C0]",
                ].join(" ")}
              />
              {isActive && (
                <span className="text-[12px] font-medium text-[#C9870C] whitespace-nowrap">
                  {step.emoji} {step.title}
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "w-8 h-[2px] mx-1 rounded-full",
                  isDone ? "bg-[#1EA055]" : "bg-[#ECE4D6]",
                ].join(" ")}
                style={{ marginBottom: isActive || (i + 2 === current) ? "20px" : "0" }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function Step1({ data, setData, errors }: {
  data: FormData
  setData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Errors
}) {
  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setData((prev) => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="space-y-5">
      <Q label="Quán tên là gì?" error={errors.name}>
        <Inp placeholder="Ví dụ: The Note Coffee" value={data.name} onChange={set("name")} error={!!errors.name} />
      </Q>
      <div className="grid grid-cols-2 gap-3">
        <Q label="Nằm ở đâu?" error={errors.address}>
          <Inp placeholder="Số nhà, tên đường..." value={data.address} onChange={set("address")} error={!!errors.address} />
        </Q>
        <Q label="Quận nào?">
          <Select value={data.district} onValueChange={(v) => setData((prev) => ({ ...prev, district: v ?? "" }))}>
            <SelectTrigger className="w-full h-auto px-[14px] py-[12px] rounded-[12px] border-[1.5px] border-[#E0D3C0] bg-[#FAF6F1] text-[14.5px] text-[#1C1209] data-placeholder:text-[#9B8B73] focus-visible:border-[#C9870C] focus-visible:ring-[3px] focus-visible:ring-[rgba(201,135,12,0.12)] focus-visible:ring-offset-0">
              <SelectValue placeholder="Chọn quận..." />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="max-h-52 overflow-y-auto">
              {AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </Q>
      </div>
      <Q label="Link Google Maps?" hint="Paste link Google Maps để mọi người dễ tìm hơn (không bắt buộc)">
        <Inp placeholder="https://maps.google.com/..." value={data.googleMapsUrl} onChange={set("googleMapsUrl")} type="url" />
      </Q>
      <div className="grid grid-cols-2 gap-3">
        <Q label="Giá từ">
          <div className="relative">
            <Inp placeholder="30000" value={data.priceMin} onChange={set("priceMin")} type="number" className="pr-6" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8B73] text-[13px]">đ</span>
          </div>
        </Q>
        <Q label="Đến khoảng">
          <div className="relative">
            <Inp placeholder="80000" value={data.priceMax} onChange={set("priceMax")} type="number" className="pr-6" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B8B73] text-[13px]">đ</span>
          </div>
        </Q>
      </div>
    </div>
  )
}

function Step2({ data, setData }: { data: FormData; setData: React.Dispatch<React.SetStateAction<FormData>> }) {
  const toggle = (field: "vibes" | "purposes" | "amenities", value: string) => {
    setData((prev) => {
      const arr = prev[field] as string[]
      return { ...prev, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
    })
  }

  const setHours = (day: "hoursWeekday" | "hoursSaturday" | "hoursSunday", key: "open" | "close", val: string) => {
    setData((prev) => ({ ...prev, [day]: { ...prev[day], [key]: val } }))
  }

  return (
    <div className="space-y-6">
      <Q label="Không gian quán có cảm giác gì?" hint="Chọn tất cả những gì phù hợp">
        <div className="flex flex-wrap gap-2 mt-1">
          {VIBES.map((v) => (
            <Chip key={v} active={data.vibes.includes(v)} onClick={() => toggle("vibes", v)}>
              {VIBE_LABELS[v] ?? v}
            </Chip>
          ))}
        </div>
      </Q>
      <Q label="Phù hợp để làm gì?" hint="Chọn tất cả những gì phù hợp">
        <div className="flex flex-wrap gap-2 mt-1">
          {PURPOSES.map((p) => (
            <Chip key={p} active={data.purposes.includes(p)} onClick={() => toggle("purposes", p)}>
              {PURPOSE_LABELS[p] ?? p}
            </Chip>
          ))}
        </div>
      </Q>
      <Q label="Tiện ích có ở quán?">
        <div className="flex flex-wrap gap-2 mt-1">
          {AMENITIES.map((a) => (
            <Chip key={a} active={data.amenities.includes(a)} onClick={() => toggle("amenities", a)}>{a}</Chip>
          ))}
        </div>
      </Q>
      <Q label="Giờ mở cửa">
        <div className="rounded-[12px] border border-[#E0D3C0] bg-[#FAF6F1] overflow-hidden">
          {(
            [
              { key: "hoursWeekday", label: "Thứ 2 – 6" },
              { key: "hoursSaturday", label: "Thứ 7" },
              { key: "hoursSunday", label: "Chủ nhật" },
            ] as const
          ).map(({ key, label }, i) => (
            <div key={key} className={["flex items-center gap-3 px-4 py-3", i > 0 ? "border-t border-[#ECE4D6]" : ""].join(" ")}>
              <span className="text-[13.5px] text-[#5C4A2F] w-24 shrink-0">{label}</span>
              <div className="flex items-center gap-2 flex-1">
                <input type="time" value={data[key].open} onChange={(e) => setHours(key, "open", e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-[8px] border border-[#E0D3C0] bg-white text-[13.5px] text-[#1C1209] outline-none focus:border-[#C9870C]" />
                <span className="text-[#9B8B73] text-[13px]">–</span>
                <input type="time" value={data[key].close} onChange={(e) => setHours(key, "close", e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-[8px] border border-[#E0D3C0] bg-white text-[13.5px] text-[#1C1209] outline-none focus:border-[#C9870C]" />
              </div>
            </div>
          ))}
        </div>
      </Q>
      <Q label="Món signature của quán là gì?" hint="Không bắt buộc, nhưng nếu có thì mọi người sẽ muốn thử lắm!">
        <Inp placeholder="Ví dụ: Cà phê muối, Matcha latte..."
          value={data.signatureDrink}
          onChange={(e) => setData((prev) => ({ ...prev, signatureDrink: e.target.value }))} />
      </Q>
    </div>
  )
}

function Step3({ data, setData, errors }: {
  data: FormData
  setData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Errors
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
    <div className="space-y-6">
      <Q label="Ảnh thực tế của quán">
        <div
          className={[
            "rounded-[22px] border-2 border-dashed px-5 py-8 text-center cursor-pointer transition-all duration-150",
            dragOver
              ? "border-[#C9870C] bg-[rgba(201,135,12,0.05)]"
              : "border-[#E0D3C0] bg-[#FAF6F1] hover:border-[#C9870C] hover:bg-[rgba(201,135,12,0.03)]",
          ].join(" ")}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="text-[14px] font-medium text-[#5C4A2F]">Kéo thả ảnh vào đây</p>
          <p className="text-[13px] text-[#9B8B73] mt-1">hoặc click để chọn — tối đa 8 ảnh</p>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => addFiles(e.target.files)} />
        </div>
        {data.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {data.photos.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-[12px] overflow-hidden bg-[#EDE4D6]">
                <Image src={URL.createObjectURL(file)} alt="" fill className="object-cover" sizes="120px" unoptimized />
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-[#C9870C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Ảnh bìa
                  </span>
                )}
                <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(i) }}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white text-[11px] flex items-center justify-center hover:bg-black/80 transition-colors">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Q>
      <Q label="Bạn muốn nói gì về quán này?" error={errors.description}>
        <div className="relative">
          <textarea rows={4} maxLength={300}
            placeholder="Kể về không gian, đồ uống, cảm giác khi ngồi ở đó..."
            value={data.description}
            onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
            className={[
              "w-full px-[14px] py-[12px] rounded-[12px] border-[1.5px] bg-[#FAF6F1] text-[#1C1209] text-[14.5px] resize-none",
              "placeholder:text-[#9B8B73] outline-none transition-all duration-150",
              "focus:border-[#C9870C] focus:shadow-[0_0_0_3px_rgba(201,135,12,0.12)]",
              errors.description ? "border-[#C0392B]" : "border-[#E0D3C0]",
            ].join(" ")} />
          <span className="absolute bottom-3 right-3 text-[12px] text-[#9B8B73]">{data.description.length}/300</span>
        </div>
      </Q>
      <Q label="Bạn đánh giá quán này mấy sao?">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button"
              onClick={() => setData((prev) => ({ ...prev, rating: star }))}
              className="text-2xl transition-transform duration-150 hover:scale-125">
              {star <= data.rating ? "⭐" : "☆"}
            </button>
          ))}
          {data.rating > 0 && (
            <span className="text-[14px] text-[#C9870C] font-medium ml-1">{RATING_LABELS[data.rating]}</span>
          )}
        </div>
      </Q>
      <Q label="Tên bạn là gì?" hint="Để mọi người biết ai đã chia sẻ quán này (không bắt buộc)">
        <Inp placeholder="Ví dụ: Minh, hoặc để trống nếu muốn ẩn danh"
          value={data.submitterName}
          onChange={(e) => setData((prev) => ({ ...prev, submitterName: e.target.value }))} />
      </Q>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-3 border-b border-[#ECE4D6] last:border-0">
      <span className="text-[13px] text-[#9B8B73] w-28 shrink-0 pt-px">{label}</span>
      <span className="text-[14px] text-[#1C1209] flex-1">{value}</span>
    </div>
  )
}

function Step4({ data }: { data: FormData }) {
  const coverPhoto = data.photos[0]
  return (
    <div className="space-y-5">
      {coverPhoto ? (
        <div className="relative w-full h-40 rounded-[16px] overflow-hidden bg-[#EDE4D6]">
          <Image src={URL.createObjectURL(coverPhoto)} alt="" fill className="object-cover" sizes="600px" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <p className="text-white font-bold text-lg">{data.name || "—"}</p>
            <p className="text-white/80 text-[13px]">{[data.address, data.district].filter(Boolean).join(", ")}</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF6F1] rounded-[16px] p-4">
          <p className="font-bold text-[#1C1209] text-lg">{data.name || "—"}</p>
          <p className="text-[13px] text-[#5C4A2F] mt-0.5">
            {[data.address, data.district].filter(Boolean).join(", ") || "Chưa có địa chỉ"}
          </p>
        </div>
      )}
      <div className="rounded-[16px] border border-[#E0D3C0] bg-white px-4 py-1">
        <ReviewRow label="Giá"
          value={data.priceMin || data.priceMax
            ? `${data.priceMin ? Number(data.priceMin).toLocaleString("vi") + "đ" : "?"} – ${data.priceMax ? Number(data.priceMax).toLocaleString("vi") + "đ" : "?"}`
            : "Chưa điền"} />
        <ReviewRow label="Vibe"
          value={data.vibes.length > 0
            ? <div className="flex flex-wrap gap-1">{data.vibes.map((v) => (
                <span key={v} className="px-2 py-0.5 bg-[rgba(201,135,12,0.11)] text-[#C9870C] rounded-full text-[12px]">
                  {VIBE_LABELS[v] ?? v}
                </span>))}</div>
            : "Chưa chọn"} />
        <ReviewRow label="Mục đích"
          value={data.purposes.length > 0
            ? <div className="flex flex-wrap gap-1">{data.purposes.map((p) => (
                <span key={p} className="px-2 py-0.5 bg-[rgba(201,135,12,0.11)] text-[#C9870C] rounded-full text-[12px]">
                  {PURPOSE_LABELS[p] ?? p}
                </span>))}</div>
            : "Chưa chọn"} />
        <ReviewRow label="Tiện ích" value={data.amenities.length > 0 ? data.amenities.join(", ") : "Chưa chọn"} />
        <ReviewRow label="Giờ mở cửa"
          value={
            <div className="space-y-0.5 text-[13px]">
              {data.hoursWeekday.open && <div>T2–6: {data.hoursWeekday.open} – {data.hoursWeekday.close}</div>}
              {data.hoursSaturday.open && <div>T7: {data.hoursSaturday.open} – {data.hoursSaturday.close}</div>}
              {data.hoursSunday.open && <div>CN: {data.hoursSunday.open} – {data.hoursSunday.close}</div>}
              {!data.hoursWeekday.open && !data.hoursSaturday.open && !data.hoursSunday.open && "Chưa điền"}
            </div>
          } />
        {data.signatureDrink && <ReviewRow label="Signature" value={data.signatureDrink} />}
        {data.description && <ReviewRow label="Mô tả" value={data.description} />}
        {data.rating > 0 && <ReviewRow label="Đánh giá" value={"⭐".repeat(data.rating) + ` (${RATING_LABELS[data.rating]})`} />}
        {data.submitterName && <ReviewRow label="Người chia sẻ" value={data.submitterName} />}
      </div>
      {data.photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {data.photos.slice(1).map((file, i) => (
            <div key={i} className="relative aspect-square rounded-[12px] overflow-hidden bg-[#EDE4D6]">
              <Image src={URL.createObjectURL(file)} alt="" fill className="object-cover" sizes="120px" unoptimized />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-start gap-3 bg-[#E6F5EE] border border-[#1EA055]/20 rounded-[12px] px-4 py-3">
        <span className="text-[18px] mt-0.5">✅</span>
        <p className="text-[13px] text-[#166638]">
          Quán của bạn sẽ được đội ngũ kiểm duyệt trong{" "}
          <strong>1–3 ngày làm việc</strong> trước khi xuất hiện trên Cafe Maps.
        </p>
      </div>
    </div>
  )
}

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-8 animate-[fadeUp_0.35s_ease_both]">
      <div className="text-[52px] mb-4 animate-[pop_0.4s_ease_both]">☕</div>
      <h2 className="font-bold text-[24px] text-[#1C1209] mb-3">Cảm ơn bạn đã chia sẻ!</h2>
      <p className="text-[14.5px] text-[#5C4A2F] max-w-sm mx-auto leading-relaxed mb-6">
        Quán sẽ được kiểm duyệt trong{" "}
        <strong className="text-[#1EA055]">1–3 ngày làm việc</strong> rồi xuất hiện trên Cafe Maps.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/"
          className="px-6 py-3 rounded-full bg-[#C9870C] text-white font-bold text-[14.5px] hover:bg-[#A96E08] transition-colors">
          Khám phá danh sách quán
        </Link>
        <button type="button" onClick={onReset}
          className="px-6 py-3 rounded-full border-[1.5px] border-[#E0D3C0] text-[#5C4A2F] font-medium text-[14.5px] hover:border-[#C9870C] hover:text-[#C9870C] transition-colors">
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

  const validate = (): boolean => {
    const e: Errors = {}
    if (step === 1) {
      if (!data.name.trim()) e.name = "Tên quán là bắt buộc nhé"
      if (!data.address.trim()) e.address = "Bạn nhớ ghi địa chỉ để mọi người tìm đến được"
    }
    if (step === 3) {
      if (!data.description.trim()) e.description = "Kể một chút về quán cho mọi người biết nhé"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    setStep((s) => Math.min(s + 1, 4))
    setErrors({})
  }

  const back = () => {
    setStep((s) => Math.max(s - 1, 1))
    setErrors({})
  }

  const submit = async () => {
    if (!validate()) return
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

  if (done) {
    return (
      <div className="bg-white rounded-[32px] border border-[#E0D3C0] shadow-[0_4px_24px_rgba(28,18,9,0.07)] px-9 py-8">
        <SuccessView onReset={reset} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[32px] border border-[#E0D3C0] shadow-[0_4px_24px_rgba(28,18,9,0.07)] px-9 py-8 animate-[fadeUp_0.35s_ease_both]">
      <StepProgress current={step} />

      {step === 1 && <Step1 data={data} setData={setData} errors={errors} />}
      {step === 2 && <Step2 data={data} setData={setData} />}
      {step === 3 && <Step3 data={data} setData={setData} errors={errors} />}
      {step === 4 && <Step4 data={data} />}

      <div className="flex items-center gap-3 mt-8">
        {step > 1 && (
          <button type="button" onClick={back}
            className="px-6 py-3 rounded-full border-[1.5px] border-[#E0D3C0] text-[#5C4A2F] font-medium text-[14.5px] hover:border-[#C9870C] hover:text-[#C9870C] transition-all duration-150">
            ← Quay lại
          </button>
        )}
        <button type="button" onClick={step === 4 ? submit : next} disabled={loading}
          className="flex-1 sm:flex-none sm:min-w-[140px] px-6 py-3 rounded-full bg-[#C9870C] text-white font-bold text-[14.5px] hover:bg-[#A96E08] disabled:opacity-60 transition-all duration-150 flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
              </svg>
              Đang gửi...
            </>
          ) : step === 4 ? "Gửi đề xuất ☕" : "Tiếp theo →"}
        </button>
      </div>
      <p className="text-center text-[12.5px] text-[#9B8B73] mt-3">Bước {step} / 4</p>
    </div>
  )
}
