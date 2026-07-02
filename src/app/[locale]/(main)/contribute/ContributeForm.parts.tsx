import { useRef, useState } from "react";
import type { Dispatch, InputHTMLAttributes, ReactNode, SetStateAction } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FIELD_BASE_CLASS, MAX_REASON_LENGTH } from "./contribute-form.constants";
import { appendImageFiles } from "./contribute-form.helpers";
import type { ContributeFormData, ContributeFormErrors } from "./contribute-form.types";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[13.5px] leading-snug font-bold text-[var(--foreground)]">
        {label}
      </label>
      {hint && (
        <p className="-mt-1 hidden text-[12px] leading-snug text-[var(--foreground-muted)] min-[421px]:block sm:leading-relaxed">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--danger)]">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        FIELD_BASE_CLASS,
        error
          ? "!border-[var(--danger)] focus-visible:!border-[var(--danger)]"
          : "border-[var(--border)]",
        className,
      )}
    />
  );
}

export function StepProgress({ current }: { current: number }) {
  const t = useTranslations("contribute");
  const steps = [
    { icon: MapPin, title: t("steps.share") },
    { icon: Eye, title: t("steps.review") },
  ];

  return (
    <div className="mb-3 flex items-center justify-center gap-2 sm:mb-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isDone = stepNumber < current;
        const Icon = step.icon;

        return (
          <div key={stepNumber} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-all duration-200 sm:py-2",
                isActive &&
                  "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)] shadow-[0_10px_24px_rgba(201,132,42,0.12)]",
                isDone &&
                  "border-[var(--status-open)]/25 bg-[var(--status-open-background)] text-[var(--status-open-foreground)]",
                !isActive &&
                  !isDone &&
                  "border-[var(--border)] bg-white/35 text-[var(--foreground-muted)] dark:bg-white/5",
              )}
            >
              {isDone ? (
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
              ) : (
                <Icon className="size-3.5" aria-hidden="true" />
              )}
              <span className="max-[420px]:sr-only">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "hidden h-px w-8 rounded-full sm:block",
                  isDone ? "bg-[var(--status-open)]" : "bg-[var(--border)]",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PhotoUploader({
  data,
  setData,
  photoUrls,
}: {
  data: ContributeFormData;
  setData: Dispatch<SetStateAction<ContributeFormData>>;
  photoUrls: string[];
}) {
  const t = useTranslations("contribute");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const addFiles = (files: FileList | null) =>
    setData((prev) => ({ ...prev, photos: appendImageFiles(prev.photos, files) }));
  const removePhoto = (index: number) =>
    setData((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));

  return (
    <>
      <div
        className={cn(
          "group rounded-[16px] border-2 border-dashed px-4 py-2 text-center transition-all duration-150 sm:rounded-[20px] sm:px-5 sm:py-6",
          dragOver
            ? "border-[var(--accent)] bg-[var(--accent-light)]"
            : "border-[var(--contribute-upload-border)] bg-[var(--contribute-surface-soft)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)]",
        )}
        onClick={() => fileRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <div className="mx-auto mb-1 flex size-8 items-center justify-center rounded-full bg-[var(--contribute-icon-bg)] text-[var(--accent)] sm:mb-3 sm:size-11">
          {dragOver ? (
            <UploadCloud className="size-5" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-5" aria-hidden="true" />
          )}
        </div>
        <p className="text-[12.5px] font-bold text-[var(--foreground)] sm:text-[13.5px]">
          {t("form.dropTitle")}
        </p>
        <p className="mt-0.5 hidden text-[12px] text-[var(--foreground-muted)] sm:block">
          {t("form.dropSubtitle")}
        </p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>
      {data.photos.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {data.photos.map((_, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-[14px] bg-[var(--background-secondary)] shadow-[var(--contribute-photo-shadow)]"
            >
              <Image
                src={photoUrls[index]}
                alt={t("form.photoAlt", { index: index + 1 })}
                fill
                className="object-cover"
                sizes="120px"
                unoptimized
              />
              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 rounded-full bg-[var(--contribute-ink)]/80 px-2 py-0.5 text-[9px] font-bold text-[var(--contribute-cream)] backdrop-blur">
                  {t("form.cover")}
                </span>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  removePhoto(index);
                }}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <X className="size-3.5" aria-hidden="true" />
                <span className="sr-only">{t("form.removePhoto")}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function ShareStep({
  data,
  setData,
  errors,
  photoUrls,
}: {
  data: ContributeFormData;
  setData: Dispatch<SetStateAction<ContributeFormData>>;
  errors: ContributeFormErrors;
  photoUrls: string[];
}) {
  const t = useTranslations("contribute");

  return (
    <div className="space-y-3.5 sm:space-y-5">
      <Field
        label={t("form.googleMapsLabel")}
        hint={t("form.googleMapsHint")}
        error={errors.googleMapsUrl}
      >
        <TextInput
          placeholder="https://maps.google.com/..."
          value={data.googleMapsUrl}
          onChange={(event) => setData((prev) => ({ ...prev, googleMapsUrl: event.target.value }))}
          type="url"
          error={!!errors.googleMapsUrl}
        />
      </Field>

      <Field label={t("form.reasonLabel")} hint={t("form.reasonHint")}>
        <div className="relative">
          <textarea
            rows={2}
            maxLength={MAX_REASON_LENGTH}
            placeholder={t("form.reasonPlaceholder")}
            value={data.reason}
            onChange={(event) => setData((prev) => ({ ...prev, reason: event.target.value }))}
            className={cn(
              FIELD_BASE_CLASS,
              "resize-none border-[var(--border)] pr-16 max-[420px]:min-h-13",
            )}
          />
          <span className="absolute right-3 bottom-2.5 text-[11px] text-[var(--foreground-muted)]">
            {data.reason.length}/{MAX_REASON_LENGTH}
          </span>
        </div>
      </Field>

      <Field label={t("form.photosLabel")} hint={t("form.photosHint")}>
        <PhotoUploader data={data} setData={setData} photoUrls={photoUrls} />
      </Field>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-[var(--border)]/70 py-3 last:border-0">
      <span className="w-24 shrink-0 pt-px text-[12px] text-[var(--foreground-muted)]">
        {label}
      </span>
      <span className="flex-1 text-[13.5px] break-all text-[var(--foreground)]">{value}</span>
    </div>
  );
}

export function ReviewStep({ data, photoUrls }: { data: ContributeFormData; photoUrls: string[] }) {
  const t = useTranslations("contribute");

  return (
    <div className="space-y-4">
      {photoUrls[0] && (
        <div className="relative h-44 w-full overflow-hidden rounded-[22px] bg-[var(--background-secondary)]">
          <Image
            src={photoUrls[0]}
            alt={t("review.coverAlt")}
            fill
            className="object-cover"
            sizes="640px"
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-full border border-[var(--contribute-cream-border)] bg-[var(--contribute-ink)]/55 px-3 py-1 text-[11px] font-bold text-[var(--contribute-cream)] backdrop-blur-md">
            {t("review.cover")}
          </span>
        </div>
      )}

      <div className="rounded-[20px] border border-[var(--border)] bg-[var(--contribute-surface-soft)] px-4 py-1 shadow-[var(--contribute-card-shadow)] backdrop-blur">
        <div className="flex items-center gap-2 border-b border-[var(--border)]/70 py-3">
          <Coffee className="size-4 text-[var(--accent)]" aria-hidden="true" />
          <h3 className="text-[13px] font-bold text-[var(--foreground)]">{t("review.title")}</h3>
        </div>
        <ReviewRow
          label={t("review.googleMaps")}
          value={
            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--accent)] underline underline-offset-2 transition-colors hover:text-[var(--accent-hover)]"
            >
              {data.googleMapsUrl}
            </a>
          }
        />
        {data.reason && <ReviewRow label={t("review.reason")} value={data.reason} />}
      </div>

      {data.photos.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {photoUrls.slice(1).map((url, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-[14px] bg-[var(--background-secondary)]"
            >
              <Image
                src={url}
                alt={t("form.photoAlt", { index: index + 2 })}
                fill
                className="object-cover"
                sizes="100px"
                unoptimized
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-[16px] border border-[var(--status-open)]/20 bg-[var(--status-open-background)] px-3.5 py-3">
        <CheckCircle2
          className="mt-0.5 size-4 shrink-0 text-[var(--status-open-foreground)]"
          aria-hidden="true"
        />
        <p className="text-[12.5px] leading-relaxed text-[var(--status-open-foreground)]">
          {t("review.note")}
        </p>
      </div>
    </div>
  );
}

export function SuccessView({ onReset }: { onReset: () => void }) {
  const t = useTranslations("contribute");

  return (
    <div className="animate-[fadeUp_0.35s_ease_both] py-8 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--contribute-ink)] text-[var(--contribute-cream)] shadow-[var(--contribute-success-shadow)] dark:bg-[var(--contribute-cream)] dark:text-[var(--contribute-ink)]">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </div>
      <h2 className="font-lora mb-2 text-[24px] font-bold text-[var(--foreground)]">
        {t("success.title")}
      </h2>
      <p className="mx-auto mb-6 max-w-sm text-[13.5px] leading-relaxed text-[var(--foreground-muted)]">
        {t("success.body")}
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/30"
        >
          {t("success.explore")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white/40 px-5 py-3 text-[13.5px] font-bold text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/25 dark:bg-white/5"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {t("success.again")}
        </button>
      </div>
    </div>
  );
}

export function FormActions({
  step,
  loading,
  onBack,
  onNext,
  onSubmit,
}: {
  step: number;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const t = useTranslations("contribute");

  return (
    <>
      <div className="mt-4 flex items-center gap-3 sm:mt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white/40 px-4 py-2.5 text-[13.5px] font-bold text-[var(--foreground-muted)] transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/25 dark:bg-white/5"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("actions.back")}
          </button>
        )}
        <button
          type="button"
          onClick={step === 2 ? onSubmit : onNext}
          disabled={loading}
          className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-[13.5px] font-bold text-white shadow-[0_12px_28px_rgba(201,132,42,0.22)] transition-all duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/30 disabled:opacity-60 sm:min-h-11 sm:min-w-36 sm:flex-none sm:py-2.5"
        >
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
      <p className="mt-1 text-center text-[11px] text-[var(--foreground-muted)] sm:mt-3 sm:text-[12px]">
        {t("stepCount", { step, total: 2 })}
      </p>
    </>
  );
}
