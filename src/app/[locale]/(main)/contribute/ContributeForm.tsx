"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createSubmission } from "@/apis/submissions";
import { ApiError, isUnauthorizedError } from "@/apis/http";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { INITIAL_FORM_DATA } from "./contribute-form.constants";
import type { ContributeFormErrors } from "./contribute-form.types";
import { usePhotoUrls } from "./usePhotoUrls";
import {
  FormActions,
  ReviewStep,
  ShareStep,
  StepProgress,
  SuccessView,
} from "./ContributeForm.parts";

export default function ContributeForm() {
  const t = useTranslations("contribute");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContributeFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const photoUrls = usePhotoUrls(data.photos);

  const validate = () => {
    const nextErrors: ContributeFormErrors = {};
    if (!data.name.trim()) nextErrors.name = t("errors.nameRequired");
    if (!data.googleMapsUrl.trim()) nextErrors.googleMapsUrl = t("errors.googleMapsRequired");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    setServerError(null);
    if (validate()) setStep(2);
  };

  const back = () => {
    setStep(1);
    setErrors({});
    setServerError(null);
  };

  const submit = async () => {
    if (loading) return;
    if (!validate()) {
      setStep(1);
      return;
    }

    setServerError(null);
    setLoading(true);
    try {
      const token = await getCurrentAccessToken();
      if (!token) {
        saveAuthReturnUrl();
        router.push("/login");
        return;
      }

      await createSubmission(
        {
          name: data.name.trim(),
          googleMapsUrl: data.googleMapsUrl.trim(),
          note: data.reason.trim() || undefined,
        },
        token,
      );
      setDone(true);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        saveAuthReturnUrl();
        router.push("/login");
        return;
      }
      setServerError(
        error instanceof ApiError
          ? t("errors.submitFailed")
          : error instanceof Error
            ? error.message
            : t("errors.submitFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(INITIAL_FORM_DATA);
    setStep(1);
    setErrors({});
    setServerError(null);
    setDone(false);
  };

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto rounded-[24px] border border-[var(--border)] bg-[var(--contribute-surface)] px-4 py-3.5 shadow-[var(--contribute-panel-shadow)] backdrop-blur-xl sm:rounded-[28px] sm:px-7 sm:py-6",
        !done && "animate-[fadeUp_0.35s_ease_both]",
      )}
    >
      {done ? (
        <SuccessView onReset={reset} />
      ) : (
        <>
          <StepProgress current={step} />
          {step === 1 && (
            <ShareStep data={data} setData={setData} errors={errors} photoUrls={photoUrls} />
          )}
          {step === 2 && <ReviewStep data={data} photoUrls={photoUrls} />}
          {serverError && (
            <p
              role="alert"
              className="mt-4 rounded-2xl border border-[var(--danger)]/25 bg-[var(--danger)]/10 px-3.5 py-3 text-[12.5px] font-semibold text-[var(--danger)]"
            >
              {serverError}
            </p>
          )}
          <FormActions
            step={step}
            loading={loading}
            onBack={back}
            onNext={next}
            onSubmit={submit}
          />
        </>
      )}
    </div>
  );
}
