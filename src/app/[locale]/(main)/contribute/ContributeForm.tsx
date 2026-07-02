"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContributeFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const photoUrls = usePhotoUrls(data.photos);

  const validate = () => {
    const nextErrors: ContributeFormErrors = {};
    if (!data.googleMapsUrl.trim()) nextErrors.googleMapsUrl = t("errors.googleMapsRequired");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (validate()) setStep(2);
  };

  const back = () => {
    setStep(1);
    setErrors({});
  };

  const submit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setDone(true);
  };

  const reset = () => {
    setData(INITIAL_FORM_DATA);
    setStep(1);
    setErrors({});
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
