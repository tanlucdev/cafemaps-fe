"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  FormActions,
  ReviewStep,
  ShareStep,
  StepProgress,
  SuccessView,
} from "./ContributeForm.parts";
import { useContributeForm } from "./useContributeForm";

export default function ContributeForm() {
  const form = useContributeForm();
  const t = useTranslations("contribute");

  return (
    <div
      className={cn(
        "min-w-0 flex-1 overflow-y-auto rounded-[24px] border border-[var(--border)] bg-[var(--contribute-surface)] px-4 py-3.5 shadow-[var(--contribute-panel-shadow)] backdrop-blur-xl sm:rounded-[28px] sm:px-7 sm:py-6",
        !form.done && "animate-[fadeUp_0.35s_ease_both]",
      )}
    >
      {form.done ? (
        <SuccessView onReset={form.reset} />
      ) : (
        <>
          <StepProgress current={form.step} />
          {form.step === 1 && (
            <ShareStep
              data={form.data}
              setData={form.setData}
              errors={form.errors}
              photoUrls={form.photoUrls}
            />
          )}
          {form.step === 2 && <ReviewStep data={form.data} photoUrls={form.photoUrls} />}
          {form.serverError && (
            <p
              role="alert"
              className="mt-4 rounded-2xl border border-[var(--danger)]/25 bg-[var(--danger)]/10 px-3.5 py-3 text-[12.5px] font-semibold text-[var(--danger)]"
            >
              {form.serverError}
            </p>
          )}
          <FormActions
            step={form.step}
            loading={form.loading}
            hasPhotos={form.data.photos.length > 0}
            onBack={form.back}
            onNext={form.next}
            onSubmit={form.submit}
          />
          {form.slowUpload && (
            <p
              aria-live="polite"
              className="mt-3 text-center text-[12px] font-medium text-[var(--foreground-muted)]"
            >
              {t("status.processingPhotos", { count: form.data.photos.length })}
            </p>
          )}
        </>
      )}
    </div>
  );
}
