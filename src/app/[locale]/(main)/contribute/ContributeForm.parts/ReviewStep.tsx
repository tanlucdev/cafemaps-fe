import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CheckCircle2, Coffee } from "lucide-react";
import type { ContributeFormData } from "../contribute-form.types";

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
        <ReviewRow label={t("form.name")} value={data.name} />
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
