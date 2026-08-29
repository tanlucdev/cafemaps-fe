"use client";

import { useState } from "react";
import { MessageSquareText } from "lucide-react";
import { useTranslations } from "next-intl";
import { createFeedback } from "@/apis/feedback";
import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 2000;
const ERROR_ID = "cafe-info-update-error";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CafeInfoUpdateSectionProps = {
  cafeId: string;
};

export default function CafeInfoUpdateSection({ cafeId }: CafeInfoUpdateSectionProps) {
  const t = useTranslations("cafe.detail.updateInfo");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validate = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return t("errors.required");
    if (trimmed.length < MIN_MESSAGE_LENGTH)
      return t("errors.tooShort", { min: MIN_MESSAGE_LENGTH });
    if (trimmed.length > MAX_MESSAGE_LENGTH)
      return t("errors.tooLong", { max: MAX_MESSAGE_LENGTH });
    return "";
  };

  const close = () => {
    if (submitting) return;
    setOpen(false);
  };

  const openForm = () => {
    setMessage("");
    setError("");
    setSubmitted(false);
    setOpen(true);
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextError = validate(message);
    if (nextError) {
      setError(nextError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createFeedback({
        type: "content",
        message: message.trim(),
        cafeId: UUID_PATTERN.test(cafeId) ? cafeId : undefined,
        pageUrl: window.location.href,
      });
      setSubmitted(true);
      setMessage("");
    } catch {
      setError(t("errors.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="border-t border-[#ffe3b7]/34 pt-3 dark:border-[#ffe3b7]/14">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-2">
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#ffe3b7]/50 bg-[#fffaf2]/58 text-[#a86d1e] dark:border-[#ffe3b7]/14 dark:bg-white/6 dark:text-[#e6c25e]">
              <MessageSquareText size={14} aria-hidden="true" />
            </span>
            <p className="min-w-0 text-xs leading-5 font-medium text-[var(--foreground-muted)]">
              {t("helper")}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openForm}
            className="w-full text-[12.5px] font-bold text-[var(--accent-hover)] hover:bg-[#fff0dc]/60 sm:w-auto dark:text-[#f0b869] dark:hover:bg-white/8"
          >
            <MessageSquareText aria-hidden="true" />
            {t("cta")}
          </Button>
        </div>
      </section>

      <Modal open={open} onClose={close} title={t("title")} contentClassName="p-4 sm:p-5">
        {submitted ? (
          <div className="space-y-4">
            <p
              className="text-sm leading-6 font-medium text-[var(--foreground-muted)]"
              role="status"
            >
              {t("success")}
            </p>
            <Button type="button" onClick={close} className="w-full">
              {t("done")}
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                if (error) setError("");
              }}
              placeholder={t("placeholder")}
              maxLength={MAX_MESSAGE_LENGTH}
              aria-invalid={Boolean(error)}
              aria-describedby={ERROR_ID}
              className="min-h-28 w-full resize-y rounded-xl border border-[#ead8bf] bg-white/80 px-3 py-2.5 text-sm leading-6 text-[var(--foreground)] transition outline-none focus:border-[#b66f21] focus:ring-3 focus:ring-[#b66f21]/15 dark:border-[#ffe3b7]/14 dark:bg-white/8"
            />
            <div className="flex items-center justify-between gap-3 text-xs text-[var(--foreground-muted)]">
              <span
                id={ERROR_ID}
                role={error ? "alert" : undefined}
                className={error ? "text-red-600 dark:text-red-300" : ""}
              >
                {error}
              </span>
              <span>
                {message.trim().length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" size="sm" onClick={close} disabled={submitting}>
                {t("cancel")}
              </Button>
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? t("submitting") : t("submit")}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
