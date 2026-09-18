"use client";

import { Share2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { downloadQuizResultImage } from "@/apis/quiz";
import ShareLinkModal from "@/components/share/ShareLinkModal";
import type { QuizMessages } from "@/lib/quiz";
import type { LocalizedQuizProfile, QuizOption, QuizResult, QuizResultVariant } from "@/types/quiz";
import type { BoardLabels } from "../MobileQuizResultExportCard";
import { QuizResultBody } from "./QuizResultBody";

export type ResultLabels = BoardLabels & {
  recommendedCafes: string;
  viewCafe: string;
  retake: string;
  downloadImage: string;
  shareResult: string;
  copyLink: string;
  copied: string;
  savedImage: string;
  sharing: string;
  shareFailed: string;
  shareNudge: string;
  previewNote: string;
};

export default function QuizResultScene({
  result,
  profiles,
  variant,
  locale,
  answers,
  messages,
  onRestart,
  reduceMotion,
  labels,
  isPreview,
}: {
  result: QuizResult;
  profiles: LocalizedQuizProfile[];
  variant: QuizResultVariant;
  locale: string;
  answers: QuizOption[];
  messages: QuizMessages;
  onRestart: () => void;
  reduceMotion: boolean;
  labels: ResultLabels;
  isPreview: boolean;
}) {
  const exportCacheRef = useRef<{ key: string; file: Promise<File> } | null>(null);
  const [status, setStatus] = useState("");
  const [shareBusy, setShareBusy] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const exportKey = `${variant}:${result.profile.id}:${result.dna}`;
  const previewUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/${locale}/quiz?type=${result.profile.id}&dna=${result.dna}&variant=${variant}`;

  const getExportFormat = useCallback(
    () => (window.matchMedia("(min-width: 1024px)").matches ? "desktop" : "mobile"),
    [],
  );

  const renderShareFile = useCallback(
    async (format: "desktop" | "mobile") => {
      const blob = await downloadQuizResultImage(locale, {
        format,
        variant,
        scale: 2,
        result: {
          profile: result.profile,
          score: result.score,
          dna: result.dna,
          chips: result.chips,
        },
        profiles,
        labels,
      });
      return new File(
        [blob],
        `cafe-persona-board-${format}-${result.profile.id}-${result.dna}.png`,
        {
          type: "image/png",
        },
      );
    },
    [labels, locale, profiles, result.chips, result.dna, result.profile, result.score, variant],
  );

  const getShareFile = useCallback(() => {
    const format = getExportFormat();
    const key = `${exportKey}:${format}:2x`;
    if (exportCacheRef.current?.key !== key) {
      exportCacheRef.current = { key, file: renderShareFile(format) };
    }
    return exportCacheRef.current.file;
  }, [exportKey, getExportFormat, renderShareFile]);

  function saveFile(file: File) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function downloadImage(nextStatus = labels.savedImage) {
    if (shareBusy) return;
    setShareBusy(true);
    setStatus(labels.sharing);
    try {
      saveFile(await getShareFile());
      setStatus(nextStatus);
    } catch {
      setStatus(labels.shareFailed);
    } finally {
      setShareBusy(false);
    }
  }

  return (
    <section className="relative min-h-[100svh] bg-[#fbf4e8] px-3 pt-[calc(env(safe-area-inset-top,0px)+5.75rem)] pb-[calc(var(--mobile-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+1.25rem)] min-[390px]:px-4 sm:px-6 lg:px-10 lg:pt-[5.75rem] lg:pb-3 dark:bg-[#1e1c1a]">
      <div className="relative mx-auto w-full max-w-[82rem]">
        <QuizResultBody
          result={result}
          profiles={profiles}
          variant={variant}
          locale={locale}
          answers={answers}
          messages={messages}
          onRestart={onRestart}
          onDownload={() => void downloadImage()}
          onShare={() => setShareOpen(true)}
          reduceMotion={reduceMotion}
          labels={labels}
          isPreview={isPreview}
          status={status}
          shareBusy={shareBusy}
        />
        <ShareLinkModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title={labels.shareResult}
          links={[
            { key: "quiz", label: labels.copyLink, url: previewUrl, icon: <Share2 size={16} /> },
          ]}
          copyLabel={labels.copyLink}
          copiedLabel={labels.copied}
        />
      </div>
    </section>
  );
}
