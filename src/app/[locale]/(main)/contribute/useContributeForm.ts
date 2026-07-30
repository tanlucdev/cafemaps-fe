"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createSubmission } from "@/apis/submissions";
import { ApiError, isUnauthorizedError } from "@/apis/http";
import { getCurrentAccessToken, saveAuthReturnUrl } from "@/lib/auth-client";
import { INITIAL_FORM_DATA } from "./contribute-form.constants";
import type { ContributeFormErrors } from "./contribute-form.types";
import { usePhotoUrls } from "./usePhotoUrls";

export function useContributeForm() {
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

  return {
    back,
    data,
    done,
    errors,
    loading,
    next,
    photoUrls,
    reset,
    serverError,
    setData,
    step,
    submit,
  };
}
