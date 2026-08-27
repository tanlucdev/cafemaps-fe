"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowLeft, Coffee, Download, MessageSquareText, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { createFeedback, type FeedbackType } from "@/apis/feedback";
import { useFeedbackCafeId } from "@/components/layout/FeedbackCafeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import donateQr from "../../../public/image/donate-qr.jpg";

const selectItemClassName =
  "cursor-pointer rounded-sm py-2.5 !text-[var(--foreground)] hover:bg-[var(--accent-light)] hover:!text-[var(--foreground)] focus:bg-[var(--accent-light)] focus:!text-[var(--foreground)] data-[highlighted]:bg-[var(--accent-light)] data-[highlighted]:!text-[var(--foreground)] data-[selected]:bg-[var(--accent-light)] data-[selected]:!text-[var(--foreground)] hover:**:!text-[var(--foreground)] focus:**:!text-[var(--foreground)] data-[highlighted]:**:!text-[var(--foreground)] data-[selected]:**:!text-[var(--foreground)] [&_svg]:text-[var(--accent)]";

export default function DonateFloatingButton() {
  const t = useTranslations("donate");
  const panelId = useId();
  const cafeId = useFeedbackCafeId();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"donate" | "feedback">("donate");
  const [type, setType] = useState<FeedbackType>("idea");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const typeLabels = {
    idea: t("types.idea"),
    bug: t("types.bug"),
    content: t("types.content"),
    other: t("types.other"),
  } satisfies Record<FeedbackType, string>;

  function togglePanel() {
    if (open) {
      setOpen(false);
      return;
    }

    setMode("donate");
    setOpen(true);
  }

  async function submitFeedback(event: FormEvent) {
    event.preventDefault();
    setState("submitting");
    try {
      await createFeedback({
        type,
        message,
        contactEmail: contactEmail.trim() || undefined,
        pageUrl: window.location.href,
        cafeId,
      });
      setState("success");
    } catch {
      setState("error");
    }
  }

  const renderDonateBody = (imageClassName: string) => (
    <>
      <div className="mt-3 overflow-hidden rounded-md border border-[var(--border)] bg-white p-2">
        <Image
          src={donateQr}
          alt={t("title")}
          width={224}
          height={224}
          className={imageClassName}
          priority={false}
        />
      </div>
      <p className="mt-2 text-center text-xs text-[var(--foreground)]/65">{t("scanHint")}</p>
      <a
        href="/image/donate-qr.jpg"
        download
        className="mt-3 inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--background)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
      >
        <Download className="size-4" aria-hidden="true" />
        {t("downloadQr")}
      </a>
      <button
        type="button"
        onClick={() => {
          setMode("feedback");
          setState("idle");
        }}
        className="mt-2 inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--accent-light)] text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--background)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
      >
        <MessageSquareText className="size-4" aria-hidden="true" />
        {t("feedbackCta")}
      </button>
    </>
  );

  const renderFeedbackBody = () => (
    <form onSubmit={submitFeedback} className="mt-3 space-y-3">
      <button
        type="button"
        onClick={() => {
          setMode("donate");
          setState("idle");
        }}
        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background-secondary)] px-3 text-xs font-semibold text-[var(--foreground)]/75 transition hover:border-[var(--accent)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("backToDonate")}
      </button>
      <Select
        value={type}
        onValueChange={(value) => setType((value || "idea") as FeedbackType)}
      >
        <SelectTrigger className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background-secondary)] px-3 text-base font-semibold text-[var(--foreground)] shadow-[0_8px_20px_rgba(44,26,14,0.06)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20 md:text-sm">
          <SelectValue>
            {(value: FeedbackType | null) => typeLabels[value || "idea"]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          align="start"
          sideOffset={6}
          className="z-[80] max-h-44 rounded-md border border-[var(--border)] bg-[var(--background-secondary)] p-1 shadow-xl"
        >
          <SelectItem
            className={selectItemClassName}
            value="idea"
          >
            {t("types.idea")}
          </SelectItem>
          <SelectItem
            className={selectItemClassName}
            value="bug"
          >
            {t("types.bug")}
          </SelectItem>
          <SelectItem
            className={selectItemClassName}
            value="content"
          >
            {t("types.content")}
          </SelectItem>
          <SelectItem
            className={selectItemClassName}
            value="other"
          >
            {t("types.other")}
          </SelectItem>
        </SelectContent>
      </Select>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        minLength={10}
        maxLength={2000}
        required
        rows={4}
        placeholder={t("messagePlaceholder")}
        onInvalid={(event) => {
          const textarea = event.currentTarget;
          textarea.setCustomValidity(
            textarea.validity.valueMissing ? t("messageRequired") : t("messageTooShort"),
          );
        }}
        onInput={(event) => event.currentTarget.setCustomValidity("")}
        className="min-h-28 w-full resize-none rounded-md border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-2.5 text-base leading-5 text-[var(--foreground)] shadow-[0_8px_20px_rgba(44,26,14,0.06)] outline-none placeholder:text-[var(--foreground)]/45 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 md:text-sm"
      />
      <input
        type="email"
        value={contactEmail}
        onChange={(event) => setContactEmail(event.target.value)}
        placeholder={t("emailPlaceholder")}
        onInvalid={(event) => event.currentTarget.setCustomValidity(t("emailInvalid"))}
        onInput={(event) => event.currentTarget.setCustomValidity("")}
        className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background-secondary)] px-3 text-base text-[var(--foreground)] shadow-[0_8px_20px_rgba(44,26,14,0.06)] outline-none placeholder:text-[var(--foreground)]/45 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 md:text-sm"
      />
      {state === "error" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {t("error")}
        </p>
      )}
      {state === "success" ? (
        <div className="rounded-md border border-[var(--border)] bg-[var(--accent-light)] p-3 text-sm font-semibold shadow-[0_8px_20px_rgba(44,26,14,0.06)]">
          <p>{t("success")}</p>
          <button
            type="button"
            onClick={() => {
              setMessage("");
              setContactEmail("");
              setState("idle");
            }}
            className="mt-2 cursor-pointer text-xs underline underline-offset-2"
          >
            {t("again")}
          </button>
        </div>
      ) : (
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--background)] shadow-[0_10px_24px_rgba(200,132,42,0.18)] transition hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MessageSquareText className="size-4" aria-hidden="true" />
          {state === "submitting" ? t("submitting") : t("submit")}
        </button>
      )}
    </form>
  );

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      <div className="fixed right-4 bottom-[calc(var(--ios-bottom-guard-height,80px)+72px)] z-50 flex flex-col items-end gap-3 md:right-6 md:bottom-6">
        {open && (
          <aside
            id={panelId}
            className="max-h-[calc(100svh-var(--ios-bottom-guard-height,80px)-156px)] w-[min(calc(100vw-2rem),18rem)] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-[var(--foreground)] shadow-[0_24px_64px_rgba(44,26,14,0.18)] md:max-h-[calc(100svh-7rem)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">
                  {mode === "donate" ? t("title") : t("feedbackTitle")}
                </h2>
                <p className="mt-1 text-sm leading-5 text-[var(--foreground)]/75">
                  {mode === "donate" ? t("description") : t("feedbackDescription")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border border-[var(--border)] text-[var(--foreground)]/70 transition hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            {mode === "donate"
              ? renderDonateBody("mx-auto h-auto w-full max-w-44 md:max-w-full")
              : renderFeedbackBody()}
          </aside>
        )}
        <button
          type="button"
          onClick={togglePanel}
          aria-label={t("aria")}
          aria-controls={panelId}
          aria-expanded={open}
          className="grid size-14 cursor-pointer place-items-center rounded-full bg-[var(--accent)] text-[var(--background)] shadow-lg transition hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] focus-visible:outline-none"
        >
          <Coffee className="size-6" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
