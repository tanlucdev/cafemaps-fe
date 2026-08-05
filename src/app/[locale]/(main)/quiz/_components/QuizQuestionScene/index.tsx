"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Coffee, Leaf, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LocalizedQuizQuestion, QuizOption, QuizResultVariant, QuizStickerId } from "@/types/quiz";
import QuizSticker from "../QuizSticker";
import { getOptionIcon, QUESTION_ICONS } from "./icons";

type VariantQuestion = {
  id: string;
  sticker: QuizStickerId;
  text: string;
  options: Array<{ id: QuizResultVariant; label: string }>;
};

type Question = LocalizedQuizQuestion | VariantQuestion;

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
  "border-l-[#c8842a]",
  "border-l-[#7a9e7e]",
  "border-l-[#b76e79]",
  "border-l-[#6f88b8]",
];

export default function QuizQuestionScene({
  current,
  selectedId,
  progress,
  step,
  totalQuestions,
  reduceMotion,
  direction,
  isComplete,
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
  totalQuestions: number;
  reduceMotion: boolean;
  direction: number;
  isComplete: boolean;
  labels: Labels;
  onSelect: (option: QuizOption | { id: QuizResultVariant; label: string }) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const QuestionIcon = QUESTION_ICONS[current.id] ?? Sparkles;

  return (
    <section className="relative flex min-h-[100svh] items-center bg-[#fbf4e8] px-3 pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] pb-[calc(var(--mobile-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+1rem)] min-[390px]:px-4 lg:px-5 lg:pt-24 lg:pb-8 dark:bg-[#1e1c1a]">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-3 sm:gap-4">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="inline-flex rounded-[6px] border border-[#ead5b7] bg-white/70 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-[#9a672f] uppercase shadow-sm sm:text-xs">{labels.eyebrow}</p>
            <h1 className="font-display mt-2 max-w-full text-[clamp(2rem,9vw,3rem)] leading-[1.05] font-extrabold break-words text-[var(--foreground)] sm:text-4xl xl:text-5xl xl:leading-none">{labels.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-base">{labels.subtitle}</p>
          </div>
          <div className="hidden sm:block"><QuizSticker id={current.sticker} size="sm" animated={false} /></div>
        </div>
        <div className="relative overflow-hidden rounded-full border border-[#dfbf8f] bg-white/75 p-1 shadow-sm dark:bg-white/5">
          <motion.div className="relative h-2 rounded-full bg-[#c8842a] shadow-[inset_0_-1px_0_rgba(80,42,12,0.14)]" animate={{ width: `${progress}%` }} transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }} />
        </div>
        <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative hidden min-h-[min(42svh,390px)] overflow-hidden rounded-[8px] border border-[#e5cfad] bg-[#fffaf2] p-7 shadow-[0_18px_46px_rgba(88,55,24,0.1)] lg:block dark:bg-white/5">
            <div className="absolute inset-x-8 bottom-10 h-28 rounded-[8px] border border-[#ead4ad] bg-[#f4e2c6]" />
            <div className="absolute top-10 left-10 rounded-[8px] border border-[#d8e5cf] bg-[#f1f7ed] px-4 py-3 text-xs font-semibold text-[#57764f]">mood note</div>
            <div className="absolute top-16 right-10 rounded-[8px] border border-[#ead5b7] bg-white/85 px-4 py-3 text-xs font-semibold text-[#8a6238]">coffee first</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><QuizSticker id={current.sticker} size="lg" /></div>
            <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#e0c79f] bg-white/90 px-3 py-1 text-xs font-bold text-[#855a2c] shadow-sm"><Coffee className="size-3.5 text-[var(--accent)]" />{Math.round(progress)}% {labels.brewed}</div>
            <DoodleIcon Icon={Leaf} className="bottom-32 left-9 bg-[#e8f3df] text-[#5f874e]" />
            <DoodleIcon Icon={Sparkles} className="right-10 bottom-36 bg-[#fff2c8] text-[#9a672f]" />
          </div>
          <div className="relative rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-3 shadow-[0_18px_46px_rgba(88,55,24,0.1)] min-[390px]:p-4 sm:p-5 dark:bg-[var(--card)]">
            <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
              <span className="rounded-full bg-[#fff1d2] px-3 py-1 text-xs font-bold text-[#9a672f]">{labels.question}</span>
              <span className="text-xs text-[var(--foreground-muted)]">{Math.round(progress)}%</span>
            </div>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={current.id} custom={direction} initial={reduceMotion ? false : { opacity: 0, x: direction * 28, y: 18 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -28, y: -8 }} transition={{ duration: 0.28, ease: "easeOut" }}>
                <div className="mb-3 flex lg:hidden"><QuizSticker id={current.sticker} size="sm" animated={false} /></div>
                <h2 className="font-display text-[clamp(1.65rem,7.4vw,2.15rem)] leading-[1.08] font-extrabold text-[var(--foreground)] sm:text-[1.7rem] lg:text-3xl">{current.text}</h2>
                <div className="mt-4 grid gap-2.5 sm:mt-5">
                  {current.options.map((option, index) => {
                    const active = selectedId === option.id;
                    const SceneIcon = getOptionIcon(option.id, index);
                    const tone = OPTION_TONES[index % OPTION_TONES.length];
                    return <motion.button key={option.id} type="button" className={cn("group relative flex min-h-[64px] items-center gap-3 overflow-hidden rounded-[8px] border border-l-4 bg-white/75 p-3 text-left text-sm leading-relaxed font-semibold transition-colors will-change-transform min-[390px]:min-h-[68px] min-[390px]:p-3.5 lg:min-h-[70px]", active ? "border-[#c8842a] bg-[#fff4df] text-[var(--foreground)] shadow-[0_10px_24px_rgba(200,132,42,0.16)]" : `${tone} text-[var(--foreground)] dark:bg-white/5`)} whileTap={reduceMotion ? undefined : { scale: 0.99 }} onClick={() => onSelect(option)}><span className={cn("relative grid size-9 shrink-0 place-items-center rounded-full border text-xs", active ? "border-[#c8842a] bg-[#c8842a] text-white" : "border-[#e1c49b] bg-[#fff7e7] text-[#91632e]")}>{active ? <Check className="size-4" /> : <SceneIcon className="size-4 stroke-[2.35]" />}</span><span className="min-w-0 flex-1 break-words whitespace-normal">{option.label}</span><QuestionIcon className="relative hidden size-4 shrink-0 text-[#c8842a] opacity-35 sm:block" /></motion.button>;
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
              <button type="button" onClick={onBack} disabled={step === 0} className="inline-flex h-11 appearance-none items-center gap-2 rounded-full border border-[#dfbf8f] bg-[#fffaf2] px-4 text-sm font-bold text-[#6f4a22] shadow-sm transition-colors hover:bg-[#fff6e5] disabled:opacity-40"><ArrowLeft className="size-4" />{labels.back}</button>
              <div className="flex items-center gap-2">
                {step < totalQuestions - 1 ? <button type="button" onClick={onNext} disabled={!selectedId} className="inline-flex h-11 appearance-none items-center gap-2 rounded-full border border-[#dfbf8f] bg-[#fffaf2] px-4 text-sm font-bold text-[#6f4a22] shadow-sm transition-colors hover:bg-[#fff6e5] disabled:opacity-40">{labels.next}<ArrowRight className="size-4" /></button> : null}
                {isComplete ? <button type="button" onClick={onSubmit} className="inline-flex h-11 appearance-none items-center gap-2 rounded-full bg-[#c8842a] px-5 text-sm font-black text-white shadow-[0_12px_26px_rgba(200,132,42,0.26)] transition-colors hover:bg-[#a96b22]">{labels.lockTaste}<ArrowRight className="size-4" /></button> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DoodleIcon({ Icon, className }: { Icon: LucideIcon; className: string }) {
  return <div className={cn("absolute grid size-10 place-items-center rounded-full border border-white/80 shadow-sm", className)}><Icon className="size-5" /></div>;
}
