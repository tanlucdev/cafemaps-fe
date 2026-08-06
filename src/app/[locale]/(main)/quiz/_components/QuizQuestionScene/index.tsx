"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Coffee, Leaf, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createElement } from "react";
import { cn } from "@/lib/utils";
import type {
  LocalizedQuizQuestion,
  LocalizedQuizOption,
  QuizStickerId,
} from "@/types/quiz";
import QuizSticker from "../QuizSticker";
import { getOptionIcon, QUESTION_ICONS } from "./icons";

type VariantQuestion = {
  id: string;
  sticker: QuizStickerId;
  text: string;
  options: Array<{ id: string; label: string }>;
};

type Question = LocalizedQuizQuestion | VariantQuestion;
type QuestionOption = LocalizedQuizOption | VariantQuestion["options"][number];

type Labels = {
  eyebrow: string;
  title: string;
  subtitle: string;
  brewed: string;
  back: string;
  next: string;
  lockTaste: string;
  question: string;
};

const OPTION_TONES = [
  "bg-[#fff7e8] text-[#91632e]",
  "bg-[#eef7ea] text-[#58764f]",
  "bg-[#fff0f2] text-[#9c5260]",
  "bg-[#eef3fb] text-[#5d719b]",
];

export default function QuizQuestionScene({
  current,
  selectedId,
  progress,
  step,
  reduceMotion,
  canSubmit,
  canContinue,
  labels,
  onSelect,
  onBack,
  onNext,
  onSubmit,
}: {
  current: Question;
  selectedId?: string;
  progress: number;
  step: number;
  reduceMotion: boolean;
  canSubmit: boolean;
  canContinue: boolean;
  labels: Labels;
  onSelect: (option: QuestionOption) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const QuestionIcon = QUESTION_ICONS[current.id] ?? Sparkles;

  return (
    <section className="relative flex min-h-[100svh] items-center bg-[#fbf4e8] px-3 pt-[calc(env(safe-area-inset-top,0px)+3.75rem)] pb-[calc(var(--mobile-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+0.75rem)] min-[390px]:px-4 sm:pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] lg:px-5 lg:pt-24 lg:pb-8 dark:bg-[#1e1c1a]">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <div className="grid items-end gap-2 sm:grid-cols-[1fr_auto] sm:gap-3">
          <div>
            <p className="inline-flex rounded-[6px] border border-[#ead5b7] bg-white/70 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] text-[#9a672f] uppercase shadow-sm sm:px-3 sm:py-1 sm:text-xs">
              {labels.eyebrow}
            </p>
            <h1 className="font-display mt-1 max-w-full text-[clamp(1.42rem,7vw,2rem)] leading-[1.02] font-extrabold break-words text-[var(--foreground)] sm:mt-2 sm:text-4xl xl:text-5xl xl:leading-none">
              {labels.title}
            </h1>
            <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-[var(--foreground-muted)] sm:block sm:text-base">
              {labels.subtitle}
            </p>
          </div>
          <div className="hidden sm:block">
            <QuizSticker id={current.sticker} size="sm" animated={false} />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-full border border-[#dfbf8f] bg-white/75 p-0.5 shadow-sm sm:p-1 dark:bg-white/5">
          <motion.div
            className="relative h-1 rounded-full bg-[#c8842a] shadow-[inset_0_-1px_0_rgba(80,42,12,0.14)] sm:h-2"
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:gap-6">
          <DesktopSticker current={current} progress={progress} labels={labels} />
          <div className="relative rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-2.5 shadow-[0_18px_46px_rgba(88,55,24,0.1)] min-[390px]:p-3 sm:p-5 dark:bg-[var(--card)]">
            <div className="mb-2 flex items-center justify-between gap-3 sm:mb-4">
              <span className="rounded-full bg-[#fff1d2] px-2.5 py-0.5 text-[11px] font-bold text-[#9a672f] sm:px-3 sm:py-1 sm:text-xs">
                {labels.question}
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">{Math.round(progress)}%</span>
            </div>
            <motion.div
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
            >
              <h2 className="font-display text-[clamp(1.18rem,5.6vw,1.55rem)] leading-[1.02] font-extrabold text-[var(--foreground)] sm:text-[1.7rem] lg:text-3xl">
                {current.text}
              </h2>
              <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5">
                {current.options.map((option, index) => (
                  <OptionButton
                    key={option.id}
                    option={option}
                    index={index}
                    active={selectedId === option.id}
                    QuestionIcon={QuestionIcon}
                    reduceMotion={reduceMotion}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </motion.div>
            <div className="mt-2.5 flex items-center justify-between gap-3 sm:mt-4">
              <button
                type="button"
                onClick={onBack}
                disabled={step === 0}
                className="inline-flex h-9 appearance-none items-center gap-2 rounded-full border border-[#dfbf8f] bg-[#fffaf2] px-3 text-sm font-bold text-[#6f4a22] shadow-sm transition-colors hover:bg-[#fff6e5] disabled:opacity-40 sm:h-11 sm:px-4"
              >
                <ArrowLeft className="size-4" />
                {labels.back}
              </button>
              {canContinue ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex h-9 appearance-none items-center gap-2 rounded-full bg-[#c8842a] px-4 text-sm font-black text-white shadow-[0_12px_26px_rgba(200,132,42,0.26)] transition-colors hover:bg-[#a96b22] sm:h-11 sm:px-5"
                >
                  {labels.next}
                  <ArrowRight className="size-4" />
                </button>
              ) : canSubmit ? (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="inline-flex h-9 appearance-none items-center gap-2 rounded-full bg-[#c8842a] px-4 text-sm font-black text-white shadow-[0_12px_26px_rgba(200,132,42,0.26)] transition-colors hover:bg-[#a96b22] sm:h-11 sm:px-5"
                >
                  {labels.lockTaste}
                  <ArrowRight className="size-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopSticker({
  current,
  progress,
  labels,
}: {
  current: Question;
  progress: number;
  labels: Labels;
}) {
  return (
    <div className="relative hidden min-h-[min(42svh,390px)] overflow-hidden rounded-[8px] border border-[#e5cfad] bg-[#fffaf2] p-7 shadow-[0_18px_46px_rgba(88,55,24,0.1)] lg:block dark:bg-white/5">
      <div className="absolute inset-x-8 bottom-10 h-28 rounded-[8px] border border-[#ead4ad] bg-[#f4e2c6]" />
      <div className="absolute top-10 left-10 rounded-[8px] border border-[#d8e5cf] bg-[#f1f7ed] px-4 py-3 text-xs font-semibold text-[#57764f]">
        mood note
      </div>
      <div className="absolute top-16 right-10 rounded-[8px] border border-[#ead5b7] bg-white/85 px-4 py-3 text-xs font-semibold text-[#8a6238]">
        coffee first
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <QuizSticker id={current.sticker} size="lg" />
      </div>
      <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#e0c79f] bg-white/90 px-3 py-1 text-xs font-bold text-[#855a2c] shadow-sm">
        <Coffee className="size-3.5 text-[var(--accent)]" />
        {Math.round(progress)}% {labels.brewed}
      </div>
      <DoodleIcon Icon={Leaf} className="bottom-32 left-9 bg-[#e8f3df] text-[#5f874e]" />
      <DoodleIcon Icon={Sparkles} className="right-10 bottom-36 bg-[#fff2c8] text-[#9a672f]" />
    </div>
  );
}

function OptionButton({
  option,
  index,
  active,
  QuestionIcon,
  reduceMotion,
  onSelect,
}: {
  option: QuestionOption;
  index: number;
  active: boolean;
  QuestionIcon: LucideIcon;
  reduceMotion: boolean;
  onSelect: (option: QuestionOption) => void;
}) {
  const SceneIcon = getOptionIcon(option.id, index);
  const tone = OPTION_TONES[index % OPTION_TONES.length];

  return (
    <button
      type="button"
      className={cn(
        "group relative flex min-h-[clamp(72px,9svh,92px)] items-center gap-3 overflow-hidden rounded-[8px] border bg-white/80 p-3 text-left text-[13px] leading-snug font-semibold transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out hover:border-[#d8b77f] hover:bg-[#fffaf2] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 min-[390px]:p-3.5 sm:min-h-[88px] sm:gap-4 sm:p-4 sm:text-sm sm:leading-relaxed lg:min-h-[96px] dark:bg-white/5",
        active
          ? "max-sm:scale-[1.01] border-[#c8842a] bg-[#fff4df] text-[var(--foreground)] shadow-[0_10px_24px_rgba(200,132,42,0.16)] ring-1 ring-[#c8842a]/18 motion-reduce:scale-100"
          : "border-[#ecd9bb] text-[var(--foreground)] shadow-sm",
      )}
      onClick={() => onSelect(option)}
    >
      <span
        className={cn(
          "relative grid size-8 shrink-0 place-items-center rounded-full border text-xs transition-[background-color,border-color,color,transform] duration-150 ease-out motion-reduce:transition-none sm:size-9",
          active
            ? "scale-105 border-[#c8842a] bg-[#c8842a] text-white motion-reduce:scale-100"
            : `border-transparent ${tone}`,
        )}
      >
        {active ? (
          <motion.span
            initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.15, ease: "easeOut" }}
          >
            <Check className="size-4" />
          </motion.span>
        ) : (
          createElement(SceneIcon, { className: "size-4 stroke-[2.35]" })
        )}
      </span>
      <span className="line-clamp-2 min-w-0 flex-1 break-words whitespace-normal sm:line-clamp-none">
        {option.label}
      </span>
      <QuestionIcon
        className={cn(
          "relative hidden size-4 shrink-0 opacity-35 sm:block",
          active ? "text-[#c8842a]" : "text-[var(--foreground-muted)]",
        )}
      />
    </button>
  );
}

function DoodleIcon({ Icon, className }: { Icon: LucideIcon; className: string }) {
  return (
    <div
      className={cn(
        "absolute grid size-10 place-items-center rounded-full border border-white/80 shadow-sm",
        className,
      )}
    >
      <Icon className="size-5" />
    </div>
  );
}
