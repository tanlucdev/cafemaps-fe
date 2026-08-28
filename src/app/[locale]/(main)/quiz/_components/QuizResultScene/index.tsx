"use client";

import { motion } from "framer-motion";
import { Download, RotateCcw, Share2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { downloadQuizResultImage } from "@/apis/quiz";
import ShareLinkModal from "@/components/share/ShareLinkModal";
import type { QuizMessages } from "@/lib/quiz";
import type { LocalizedQuizProfile, QuizOption, QuizResult, QuizResultVariant } from "@/types/quiz";
import MobileQuizResultBoardPreview from "../MobileQuizResultBoardPreview";
import type { BoardLabels } from "../MobileQuizResultExportCard";
import { PersonaAnalysis, PersonaRelations } from "./Panels";
import { ActionButton, QuizPosterCard } from "./PosterAndAction";
import RecommendedCafes from "./RecommendedCafes";
import ResultSummary from "./Summary";

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
        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto grid w-full max-w-[48rem] gap-3 lg:hidden">
            <MobileQuizResultBoardPreview
              result={result}
              profiles={profiles}
              variant={variant}
              labels={labels}
            />
            <div className="grid grid-cols-3 gap-2">
              <ActionButton
                icon={Download}
                label={labels.downloadImage}
                onClick={() => void downloadImage()}
                disabled={shareBusy}
              />
              <ActionButton
                icon={Share2}
                label={labels.shareResult}
                onClick={() => setShareOpen(true)}
              />
              <ActionButton icon={RotateCcw} label={labels.retake} onClick={onRestart} />
            </div>
            <p
              className="min-h-5 text-center text-xs font-semibold text-[#8b6437]"
              aria-live="polite"
            >
              {status}
            </p>
          </div>
          <div className="hidden items-start gap-4 lg:grid lg:min-h-0 lg:grid-cols-[0.58fr_1.42fr] xl:grid-cols-[0.62fr_1.38fr]">
            <div className="relative mx-auto flex min-w-0 flex-col lg:sticky lg:top-[5.75rem]">
              <div className="mx-auto w-[min(100%,18rem)] min-w-0 sm:w-full sm:max-w-[330px] xl:max-w-[360px]">
                <QuizPosterCard
                  result={result}
                  className="aspect-[9/16] max-h-[min(70svh,44rem)] w-full"
                />
              </div>
              <div className="mx-auto mt-2 grid w-[min(100%,18rem)] grid-cols-3 gap-2 sm:w-full sm:max-w-[330px] xl:max-w-[360px]">
                <ActionButton
                  icon={Download}
                  label={labels.downloadImage}
                  onClick={() => void downloadImage()}
                  disabled={shareBusy}
                />
                <ActionButton
                  icon={Share2}
                  label={labels.shareResult}
                  onClick={() => setShareOpen(true)}
                />
                <ActionButton icon={RotateCcw} label={labels.retake} onClick={onRestart} />
              </div>
              <p
                className="mt-2 min-h-5 text-center text-xs font-semibold text-[#8b6437] lg:absolute lg:top-full lg:right-0 lg:left-0"
                aria-live="polite"
              >
                {status}
              </p>
            </div>
            <div className="grid min-h-0 content-start gap-3">
              <ResultSummary
                result={result}
                labels={labels}
                isPreview={isPreview}
              />
              <PersonaAnalysis result={result} labels={labels} />
              <PersonaRelations result={result} profiles={profiles} labels={labels} />
            </div>
          </div>
          <RecommendedCafes
            result={result}
            labels={labels}
            locale={locale}
            answers={answers}
            messages={messages}
            reduceMotion={reduceMotion}
          />
        </motion.div>
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
