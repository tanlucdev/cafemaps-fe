"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { downloadQuizResultImage } from "@/apis/quiz";
import ShareLinkModal from "@/components/share/ShareLinkModal";
import Modal from "@/components/ui/Modal";
import { useRouter } from "@/i18n/navigation";
import {
  getLocalizedQuizProfiles,
  getLocalizedQuizQuestions,
  normalizeQuizProfileId,
  normalizeQuizResultVariant,
  type QuizMessages,
} from "@/lib/quiz";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { QuizOption, QuizResult } from "@/types/quiz";
import { QuizResultBody } from "../../../quiz/_components/QuizResultScene/QuizResultBody";
import type { ResultLabels } from "../../../quiz/_components/QuizResultScene";
import type { ProfileQuizResult } from "./types";

export function QuizHistoryModal({
  locale,
  open,
  result,
  onClose,
}: {
  locale: string;
  open: boolean;
  result: ProfileQuizResult | null;
  onClose: () => void;
}) {
  const t = useTranslations("quiz");
  const router = useRouter();
  const messages = t.raw("experience") as QuizMessages;
  const labels = useMemo(() => quizLabels(t), [t]);
  const reduceMotion = usePrefersReducedMotion();
  const [status, setStatus] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const exportCacheRef = useRef<{ key: string; file: Promise<File> } | null>(null);
  const resolved = useMemo(
    () => (result ? buildStoredResult(result, messages) : null),
    [messages, result],
  );
  const previewUrl =
    typeof window === "undefined" || !resolved
      ? ""
      : `${window.location.origin}/${locale}/quiz?type=${resolved.result.profile.id}&dna=${resolved.result.dna}&variant=${resolved.variant}`;

  const renderShareFile = useCallback(
    async (format: "desktop" | "mobile") => {
      if (!resolved) throw new Error("Missing quiz result");
      const blob = await downloadQuizResultImage(locale, {
        format,
        variant: resolved.variant,
        scale: 2,
        result: {
          profile: resolved.result.profile,
          score: resolved.result.score,
          dna: resolved.result.dna,
          chips: resolved.result.chips,
        },
        profiles: resolved.profiles,
        labels,
      });
      return new File(
        [blob],
        `cafe-persona-board-${format}-${resolved.result.profile.id}-${resolved.result.dna}.png`,
        { type: "image/png" },
      );
    },
    [labels, locale, resolved],
  );

  const getShareFile = useCallback(() => {
    const format = window.matchMedia("(min-width: 1024px)").matches ? "desktop" : "mobile";
    const key = `${resolved?.result.profile.id}:${resolved?.result.dna}:${format}:2x`;
    if (exportCacheRef.current?.key !== key) {
      exportCacheRef.current = { key, file: renderShareFile(format) };
    }
    return exportCacheRef.current.file;
  }, [renderShareFile, resolved]);

  async function downloadImage() {
    if (shareBusy) return;
    setShareBusy(true);
    setStatus(labels.sharing);
    try {
      const file = await getShareFile();
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(labels.savedImage);
    } catch {
      setStatus(labels.shareFailed);
    } finally {
      setShareBusy(false);
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={result?.profileTitle ?? t("result")}
        size="full"
        className="max-w-6xl"
        contentClassName="bg-[#fbf4e8] p-3 sm:p-5 dark:bg-[#1e1c1a]"
      >
        {resolved ? (
          <QuizResultBody
            result={resolved.result}
            profiles={resolved.profiles}
            variant={resolved.variant}
            locale={locale}
            answers={resolved.answers}
            messages={messages}
            onRestart={() => {
              onClose();
              router.push("/quiz");
            }}
            onDownload={() => void downloadImage()}
            onShare={() => setShareOpen(true)}
            reduceMotion={Boolean(reduceMotion)}
            labels={labels}
            isPreview={false}
            status={status}
            shareBusy={shareBusy}
          />
        ) : null}
      </Modal>
      <ShareLinkModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={labels.shareResult}
        links={[{ key: "quiz", label: labels.copyLink, url: previewUrl, icon: <Share2 size={16} /> }]}
        copyLabel={labels.copyLink}
        copiedLabel={labels.copied}
      />
    </>
  );
}

function buildStoredResult(item: ProfileQuizResult, messages: QuizMessages) {
  const variant = normalizeQuizResultVariant(item.variant);
  const profiles = getLocalizedQuizProfiles(messages, variant);
  const profile = profiles.find((profile) => profile.id === normalizeQuizProfileId(item.profileId));
  if (!profile) return null;
  const answers = storedAnswers(item.answers, messages);
  const result: QuizResult = {
    profile,
    cafes: [],
    score: item.score ?? 88,
    dna: item.dna ?? `${profile.code}-0000-0000`,
    chips: Array.isArray(item.chips) && item.chips.length ? item.chips : profile.reasons.slice(0, 6),
  };
  return { answers, profiles, result, variant };
}

function storedAnswers(value: unknown, messages: QuizMessages): QuizOption[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set(
    value.map((item) =>
      item && typeof item === "object" && "id" in item && typeof item.id === "string"
        ? item.id
        : "",
    ),
  );
  return getLocalizedQuizQuestions(messages)
    .flatMap((question) => question.options)
    .filter((option) => ids.has(option.id));
}

function quizLabels(t: (key: string) => string): ResultLabels {
  return {
    result: t("result"),
    recommendedCafes: t("recommendedCafes"),
    viewCafe: t("viewCafe"),
    retake: t("retake"),
    match: t("match"),
    downloadImage: t("downloadImage"),
    shareResult: t("shareResult"),
    copyLink: t("copyLink"),
    copied: t("copied"),
    savedImage: t("savedImage"),
    sharing: t("sharing"),
    shareFailed: t("shareFailed"),
    shareNudge: t("shareNudge"),
    traits: t("traits"),
    bestFor: t("bestFor"),
    avoidWhen: t("avoidWhen"),
    previewNote: t("previewNote"),
    compatiblePersonas: t("compatiblePersonas"),
    incompatiblePersonas: t("incompatiblePersonas"),
    pairPersonas: t("pairPersonas"),
  };
}
