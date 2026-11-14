"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createCommunitySubmission } from "@/apis/submissions";
import { ApiError } from "@/apis/http";
import { INITIAL_FORM_DATA } from "./contribute-form.constants";
import type { ContributeFormErrors } from "./contribute-form.types";
import { usePhotoUrls } from "./usePhotoUrls";

export function useContributeForm() {
  const t = useTranslations("contribute");
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ContributeFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slowUpload, setSlowUpload] = useState(false);
  const [done, setDone] = useState(false);
  const slowUploadTimer = useRef<number | null>(null);
  const photoUrls = usePhotoUrls(data.photos);

  const clearSlowUploadTimer = () => {
    if (slowUploadTimer.current) clearTimeout(slowUploadTimer.current);
    slowUploadTimer.current = null;
    setSlowUpload(false);
  };

  useEffect(() => () => {
    if (slowUploadTimer.current) clearTimeout(slowUploadTimer.current);
  }, []);

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
    clearSlowUploadTimer();
    if (data.photos.length) {
      slowUploadTimer.current = window.setTimeout(() => {
        setSlowUpload(true);
        slowUploadTimer.current = null;
      }, 5000);
    }
    try {
      await createCommunitySubmission({
        name: data.name.trim(),
        googleMapsUrl: data.googleMapsUrl.trim(),
        note: data.reason.trim() || undefined,
        photos: data.photos,
      });
      setDone(true);
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? data.photos.length && error.status >= 500
            ? t("errors.photoUploadFailed")
            : t("errors.submitFailed")
          : error instanceof Error
            ? error.message
            : t("errors.submitFailed"),
      );
    } finally {
      clearSlowUploadTimer();
      setLoading(false);
    }
  };

  const reset = () => {
    clearSlowUploadTimer();
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
    slowUpload,
    setData,
    step,
    submit,
  };
}
