import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Loader2, MapPin, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export { ReviewStep } from "./ReviewStep";
export { ShareStep } from "./ShareStep";
export { SuccessView } from "./SuccessView";

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
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white/40 px-4 py-2.5 text-[13.5px] font-bold text-[var(--foreground-muted)] transition-all duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/25 dark:bg-white/5"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("actions.back")}
          </button>
        )}
        <button
          type="button"
          onClick={step === 2 ? onSubmit : onNext}
          disabled={loading}
          className="flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-[13.5px] font-bold text-white shadow-[0_12px_28px_rgba(201,132,42,0.22)] transition-all duration-150 hover:bg-[var(--accent-hover)] focus-visible:ring-3 focus-visible:ring-[var(--accent)]/30 disabled:opacity-60 sm:min-h-11 sm:min-w-36 sm:flex-none sm:py-2.5"
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
