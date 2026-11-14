import { useRef, useState } from "react";
import type { Dispatch, InputHTMLAttributes, ReactNode, SetStateAction } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AlertCircle, ImagePlus, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FIELD_BASE_CLASS, MAX_REASON_LENGTH } from "../contribute-form.constants";
import { appendImageFiles, IMAGE_FILE_ACCEPT } from "../contribute-form.helpers";
import type { ContributeFormData, ContributeFormErrors } from "../contribute-form.types";

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

function PhotoUploader({
  photos,
  setData,
  photoUrls,
}: {
  photos: File[];
  setData: Dispatch<SetStateAction<ContributeFormData>>;
  photoUrls: string[];
}) {
  const t = useTranslations("contribute");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const addFiles = (files: FileList | null) => {
    const result = appendImageFiles(photos, files);
    const errors = {
      invalid: t("errors.photos.invalid"),
      count: t("errors.photos.count"),
      totalSize: t("errors.photos.totalSize"),
    };
    setSelectionError(result.error ? errors[result.error] : null);
    setData((prev) => ({ ...prev, photos: result.photos }));
  };
  const removePhoto = (index: number) => {
    setSelectionError(null);
    setData((prev) => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  return (
    <>
      <div
        className={cn(
          "group cursor-pointer rounded-[16px] border-2 border-dashed px-4 py-2 text-center transition-all duration-150 sm:rounded-[20px] sm:px-5 sm:py-6",
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
          accept={IMAGE_FILE_ACCEPT}
          className="hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.currentTarget.value = "";
          }}
        />
      </div>
      {selectionError && (
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-[var(--danger)]">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {selectionError}
        </p>
      )}
      {photoUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {photoUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-[14px] bg-[var(--background-secondary)] shadow-[var(--contribute-photo-shadow)]"
            >
              <Image
                src={url}
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
                className="absolute top-1.5 right-1.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/80"
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
      <Field label={`${t("form.name")} *`} error={errors.name}>
        <TextInput
          placeholder={t("form.namePlaceholder")}
          value={data.name}
          onChange={(event) => setData((prev) => ({ ...prev, name: event.target.value }))}
          maxLength={200}
          error={!!errors.name}
        />
      </Field>

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
            rows={4}
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
        <PhotoUploader photos={data.photos} setData={setData} photoUrls={photoUrls} />
      </Field>
    </div>
  );
}
