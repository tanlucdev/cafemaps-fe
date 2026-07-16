import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";

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
