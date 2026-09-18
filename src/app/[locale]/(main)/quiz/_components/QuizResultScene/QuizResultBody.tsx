"use client";

import { motion } from "framer-motion";
import { Download, RotateCcw, Share2 } from "lucide-react";
import MobileQuizResultBoardPreview from "../MobileQuizResultBoardPreview";
import type { QuizMessages } from "@/lib/quiz";
import type { LocalizedQuizProfile, QuizOption, QuizResult, QuizResultVariant } from "@/types/quiz";
import { PersonaAnalysis, PersonaRelations } from "./Panels";
import { ActionButton, QuizPosterCard } from "./PosterAndAction";
import RecommendedCafes from "./RecommendedCafes";
import ResultSummary from "./Summary";
import type { ResultLabels } from ".";

export function QuizResultBody({
  result,
  profiles,
  variant,
  locale,
  answers,
  messages,
  onRestart,
  onDownload,
  onShare,
  reduceMotion,
  labels,
  isPreview,
  status,
  shareBusy,
}: {
  result: QuizResult;
  profiles: LocalizedQuizProfile[];
  variant: QuizResultVariant;
  locale: string;
  answers: QuizOption[];
  messages: QuizMessages;
  onRestart: () => void;
  onDownload: () => void;
  onShare: () => void;
  reduceMotion: boolean;
  labels: ResultLabels;
  isPreview: boolean;
  status: string;
  shareBusy: boolean;
}) {
  return (
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
        <ShareNudge labels={labels} className="-mt-1" />
        <div className="grid grid-cols-3 gap-2">
          <ActionGrid
            labels={labels}
            onDownload={onDownload}
            onShare={onShare}
            onRestart={onRestart}
            shareBusy={shareBusy}
          />
        </div>
        <Status text={status} />
      </div>
      <div className="hidden items-start gap-4 lg:grid lg:min-h-0 lg:grid-cols-[0.58fr_1.42fr] xl:grid-cols-[0.62fr_1.38fr]">
        <div className="relative mx-auto flex min-w-0 flex-col lg:sticky lg:top-[5.75rem]">
          <div className="mx-auto w-[min(100%,18rem)] min-w-0 sm:w-full sm:max-w-[330px] xl:max-w-[360px]">
            <QuizPosterCard
              result={result}
              className="aspect-[9/16] max-h-[min(70svh,44rem)] w-full"
            />
          </div>
          <ShareNudge labels={labels} className="mx-auto mt-2 w-[min(100%,18rem)] sm:w-full sm:max-w-[330px] xl:max-w-[360px]" />
          <div className="mx-auto mt-2 grid w-[min(100%,18rem)] grid-cols-3 gap-2 sm:w-full sm:max-w-[330px] xl:max-w-[360px]">
            <ActionGrid
              labels={labels}
              onDownload={onDownload}
              onShare={onShare}
              onRestart={onRestart}
              shareBusy={shareBusy}
            />
          </div>
          <Status text={status} className="mt-2" />
        </div>
        <div className="grid min-h-0 content-start gap-3">
          <ResultSummary result={result} labels={labels} isPreview={isPreview} />
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
  );
}

function ActionGrid({
  labels,
  onDownload,
  onShare,
  onRestart,
  shareBusy,
}: {
  labels: ResultLabels;
  onDownload: () => void;
  onShare: () => void;
  onRestart: () => void;
  shareBusy: boolean;
}) {
  return (
    <>
      <ActionButton
        icon={Download}
        label={labels.downloadImage}
        onClick={onDownload}
        disabled={shareBusy}
      />
      <ActionButton icon={Share2} label={labels.shareResult} onClick={onShare} />
      <ActionButton icon={RotateCcw} label={labels.retake} onClick={onRestart} />
    </>
  );
}

function ShareNudge({ labels, className = "" }: { labels: ResultLabels; className?: string }) {
  return (
    <div className={`flex items-start gap-2.5 rounded-[8px] border border-[#d7a05f]/80 bg-[#fff4df]/95 px-3.5 py-3 text-[#7a5528] shadow-[0_10px_26px_rgba(139,100,55,0.1)] ring-1 ring-white/70 dark:border-[#7b5633] dark:bg-[#2a241f] dark:text-[#e7c591] ${className}`}>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#f3dfbd] text-[#c67b20] dark:bg-[#3a2d21]">
        <Share2 size={14} aria-hidden="true" />
      </span>
      <p className="text-sm leading-5 font-extrabold">{labels.shareNudge}</p>
    </div>
  );
}

function Status({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p
      className={`min-h-5 text-center text-xs font-semibold text-[#8b6437] ${className}`}
      aria-live="polite"
    >
      {text}
    </p>
  );
}
