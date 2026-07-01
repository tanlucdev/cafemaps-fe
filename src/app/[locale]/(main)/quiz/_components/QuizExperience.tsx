"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Armchair,
  BadgeDollarSign,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Check,
  Clock,
  CloudRain,
  Coffee,
  CupSoda,
  Dessert,
  Disc3,
  Download,
  Flower2,
  Footprints,
  Gem,
  GlassWater,
  HandHeart,
  Heart,
  Hourglass,
  Image as ImageIcon,
  Keyboard,
  LampDesk,
  Leaf,
  Laptop,
  Laugh,
  Landmark,
  MessagesSquare,
  Moon,
  PartyPopper,
  PiggyBank,
  RotateCcw,
  Sofa,
  Sparkles,
  Sprout,
  Sun,
  Sunrise,
  Sunset,
  Table2,
  Trees,
  Umbrella,
  UsersRound,
  Wallet,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition, type Ref } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatCafeArea } from "@/lib/cafe-labels";
import {
  getLocalizedQuizQuestions,
  resolveQuizPreviewResult,
  resolveQuizResult,
  type QuizMessages,
} from "@/lib/quiz";
import { cn, formatPrice } from "@/lib/utils";
import type { Cafe } from "@/types/cafe";
import type { QuizOption, QuizProfileId } from "@/types/quiz";
import QuizSticker from "./QuizSticker";

interface QuizExperienceProps {
  cafes: Cafe[];
  locale: string;
  initialProfileId?: QuizProfileId;
  initialDna?: string;
}

const OPTION_TONES = [
  "border-l-[#c8842a]",
  "border-l-[#7a9e7e]",
  "border-l-[#b76e79]",
  "border-l-[#6f88b8]",
];

export default function QuizExperience({
  cafes,
  locale,
  initialProfileId,
  initialDna,
}: QuizExperienceProps) {
  const t = useTranslations("quiz");
  const messages = t.raw("experience") as QuizMessages;
  const questions = useMemo(() => getLocalizedQuizQuestions(messages), [messages]);
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  const [submitted, setSubmitted] = useState(false);
  const [, startTransition] = useTransition();
  const autoAdvanceTimer = useRef<number | null>(null);
  const [previewProfileId, setPreviewProfileId] = useState<QuizProfileId | undefined>(
    initialProfileId,
  );
  const current = questions[step];
  const selected = answers[current.id];
  const isComplete = Object.keys(answers).length === questions.length;
  const answeredOptions = questions.map((question) => answers[question.id]).filter(Boolean);
  const answeredCount = answeredOptions.length;
  const result =
    isComplete && submitted
      ? resolveQuizResult({
          answers: questions.map((question) => answers[question.id]),
          cafes,
          messages,
        })
      : previewProfileId && !answeredCount
        ? resolveQuizPreviewResult({
            profileId: previewProfileId,
            dna: initialDna,
            cafes,
            messages,
          })
        : null;
  const progress = (answeredCount / questions.length) * 100;
  const QuestionIcon = QUESTION_ICONS[current.id] ?? Sparkles;

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  function selectOption(option: QuizOption) {
    setPreviewProfileId(undefined);
    setSubmitted(false);
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
    if (step < questions.length - 1) {
      setDirection(1);
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = window.setTimeout(
        () => startTransition(() => setStep((value) => value + 1)),
        reduceMotion ? 0 : 110,
      );
    }
  }

  function next() {
    if (!selected) return;
    if (step < questions.length - 1) {
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
      setDirection(1);
      setStep((value) => value + 1);
    }
  }

  function back() {
    if (step === 0) return;
    if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    setDirection(-1);
    setStep((value) => value - 1);
  }

  function restart() {
    if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    setDirection(-1);
    setPreviewProfileId(undefined);
    setSubmitted(false);
    setAnswers({});
    setStep(0);
  }

  function submit() {
    if (!isComplete) return;
    setPreviewProfileId(undefined);
    setSubmitted(true);
  }

  if (result) {
    return (
      <ResultScene
        result={result}
        locale={locale}
        onRestart={restart}
        reduceMotion={Boolean(reduceMotion)}
        labels={{
          result: t("result"),
          why: t("why"),
          analysis: t("analysis"),
          recommendedCafes: t("recommendedCafes"),
          viewCafe: t("viewCafe"),
          retake: t("retake"),
          match: t("match"),
          downloadImage: t("downloadImage"),
          shareResult: t("shareResult"),
          copyLink: t("copyLink"),
          copied: t("copied"),
          savedImage: t("savedImage"),
          shareFallback: t("shareFallback"),
          traits: t("traits"),
          bestFor: t("bestFor"),
          avoidWhen: t("avoidWhen"),
          previewNote: t("previewNote"),
        }}
        isPreview={Boolean(previewProfileId && !answeredOptions.length)}
      />
    );
  }

  return (
    <section className="relative flex min-h-[100svh] items-center bg-[#fbf4e8] px-3 pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] pb-[calc(var(--mobile-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+1rem)] min-[390px]:px-4 lg:px-5 lg:pt-24 lg:pb-8 dark:bg-[#1e1c1a]">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-3 sm:gap-4">
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="inline-flex rounded-[6px] border border-[#ead5b7] bg-white/70 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-[#9a672f] uppercase shadow-sm sm:text-xs">
              {t("eyebrow")}
            </p>
            <h1 className="font-display mt-2 max-w-full text-[clamp(2rem,9vw,3rem)] leading-[1.05] font-extrabold break-words text-[var(--foreground)] sm:text-4xl xl:text-5xl xl:leading-none">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)] sm:text-base">
              {t("subtitle")}
            </p>
          </div>
          <div className="hidden sm:block">
            <QuizSticker id={current.sticker} size="sm" animated={false} />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-full border border-[#dfbf8f] bg-white/75 p-1 shadow-sm dark:bg-white/5">
          <motion.div
            className="relative h-2 rounded-full bg-[#c8842a] shadow-[inset_0_-1px_0_rgba(80,42,12,0.14)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative hidden min-h-[min(42svh,390px)] overflow-hidden rounded-[8px] border border-[#e5cfad] bg-[#fffaf2] p-7 shadow-[0_18px_46px_rgba(88,55,24,0.1)] lg:block dark:bg-white/5">
            <div className="absolute inset-x-8 bottom-10 h-28 rounded-[8px] border border-[#ead4ad] bg-[#f4e2c6]" />
            <div className="absolute top-10 left-10 rounded-[8px] border border-[#d8e5cf] bg-[#f1f7ed] px-4 py-3 text-xs font-semibold text-[#57764f]">
              mood note
            </div>
            <div className="absolute top-16 right-10 rounded-[8px] border border-[#ead5b7] bg-white/85 px-4 py-3 text-xs font-semibold text-[#8a6238]">
              coffee first
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[34%]">
              <QuizSticker id={current.sticker} size="lg" />
            </div>
            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#e0c79f] bg-white/90 px-3 py-1 text-xs font-bold text-[#855a2c] shadow-sm">
              <Coffee className="size-3.5 text-[var(--accent)]" />
              {Math.round(progress)}% {t("brewed")}
            </div>
            <DoodleIcon Icon={Leaf} className="bottom-32 left-9 bg-[#e8f3df] text-[#5f874e]" />
            <DoodleIcon
              Icon={Sparkles}
              className="right-10 bottom-36 bg-[#fff2c8] text-[#9a672f]"
            />
          </div>

          <div className="relative rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-3 shadow-[0_18px_46px_rgba(88,55,24,0.1)] min-[390px]:p-4 sm:p-5 dark:bg-[var(--card)]">
            <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
              <span className="rounded-full bg-[#fff1d2] px-3 py-1 text-xs font-bold text-[#9a672f]">
                {t("question", { current: step + 1, total: questions.length })}
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">
                {Math.round(progress)}%
              </span>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                initial={reduceMotion ? false : { opacity: 0, x: direction * 28, y: 18 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: direction * -28, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="mb-3 flex lg:hidden">
                  <QuizSticker id={current.sticker} size="sm" animated={false} />
                </div>
                <h2 className="font-display text-[clamp(1.65rem,7.4vw,2.15rem)] leading-[1.08] font-extrabold text-[var(--foreground)] sm:text-[1.7rem] lg:text-3xl">
                  {current.text}
                </h2>
                <div className="mt-4 grid gap-2.5 sm:mt-5">
                  {current.options.map((option, index) => {
                    const active = selected?.id === option.id;
                    const SceneIcon = getOptionIcon(option.id, index);
                    const tone = OPTION_TONES[index % OPTION_TONES.length];
                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        className={cn(
                          "group relative flex min-h-[64px] items-center gap-3 overflow-hidden rounded-[8px] border border-l-4 bg-white/75 p-3 text-left text-sm leading-relaxed font-semibold transition-colors will-change-transform min-[390px]:min-h-[68px] min-[390px]:p-3.5 lg:min-h-[70px]",
                          active
                            ? "border-[#c8842a] bg-[#fff4df] text-[var(--foreground)] shadow-[0_10px_24px_rgba(200,132,42,0.16)]"
                            : `${tone} text-[var(--foreground)] dark:bg-white/5`,
                        )}
                        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                        onClick={() => selectOption(option)}
                      >
                        <span
                          className={cn(
                            "relative grid size-9 shrink-0 place-items-center rounded-full border text-xs",
                            active
                              ? "border-[#c8842a] bg-[#c8842a] text-white"
                              : "border-[#e1c49b] bg-[#fff7e7] text-[#91632e]",
                          )}
                        >
                          {active ? (
                            <Check className="size-4" />
                          ) : (
                            <SceneIcon className="size-4 stroke-[2.35]" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1 break-words whitespace-normal">
                          {option.label}
                        </span>
                        <QuestionIcon className="relative hidden size-4 shrink-0 text-[#c8842a] opacity-35 sm:block" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="inline-flex h-11 appearance-none items-center gap-2 rounded-full border border-[#dfbf8f] bg-[#fffaf2] px-4 text-sm font-bold text-[#6f4a22] shadow-sm transition-colors hover:bg-[#fff6e5] disabled:opacity-40"
              >
                <ArrowLeft className="size-4" />
                {t("back")}
              </button>
              <div className="flex items-center gap-2">
                {step < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!selected}
                    className="inline-flex h-11 appearance-none items-center gap-2 rounded-full border border-[#dfbf8f] bg-[#fffaf2] px-4 text-sm font-bold text-[#6f4a22] shadow-sm transition-colors hover:bg-[#fff6e5] disabled:opacity-40"
                  >
                    {t("next")}
                    <ArrowRight className="size-4" />
                  </button>
                ) : null}
                {isComplete ? (
                  <button
                    type="button"
                    onClick={submit}
                    className="inline-flex h-11 appearance-none items-center gap-2 rounded-full bg-[#c8842a] px-5 text-sm font-black text-white shadow-[0_12px_26px_rgba(200,132,42,0.26)] transition-colors hover:bg-[#a96b22]"
                  >
                    {t("lockTaste")}
                    <ArrowRight className="size-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Result = ReturnType<typeof resolveQuizResult>;

type ResultLabels = Record<
  | "result"
  | "why"
  | "analysis"
  | "recommendedCafes"
  | "viewCafe"
  | "retake"
  | "match"
  | "downloadImage"
  | "shareResult"
  | "copyLink"
  | "copied"
  | "savedImage"
  | "shareFallback"
  | "traits"
  | "bestFor"
  | "avoidWhen"
  | "previewNote",
  string
>;

const OPTION_ICONS = [Laptop, Trees, LampDesk, Zap];

const QUESTION_ICONS: Record<string, LucideIcon> = {
  "deadline-hideout": BriefcaseBusiness,
  "perfect-table": Coffee,
  "door-sound": Disc3,
  "cute-date": Heart,
  "rain-plan": CloudRain,
  "coffee-order": CupSoda,
  "photo-style": Camera,
  "seat-choice": Armchair,
  "time-of-day": Clock,
  "budget-mood": Wallet,
};

const OPTION_ICON_BY_ID: Record<string, LucideIcon> = {
  "quiet-laptop": Laptop,
  "green-window": Trees,
  "warm-lamp": LampDesk,
  "city-buzz": Zap,
  "book-cup": BookOpen,
  "clean-espresso": Coffee,
  "camera-cake": Dessert,
  "plant-sun": Sprout,
  "keyboard-soft": Keyboard,
  "leaves-glass": GlassWater,
  "old-record": Disc3,
  "friends-laughing": Laugh,
  "small-talk": MessagesSquare,
  "walk-after": Footprints,
  "photo-booth": ImageIcon,
  "low-key": HandHeart,
  "rain-work": BriefcaseBusiness,
  "rain-window": Umbrella,
  "rain-date": Heart,
  "rain-group": UsersRound,
  "filter-calm": Coffee,
  "sweet-latte": CupSoda,
  "old-coffee": Landmark,
  "iced-tea": GlassWater,
  "clean-shot": Sun,
  "leaf-shot": Flower2,
  "film-shot": Camera,
  "friends-shot": PartyPopper,
  "corner-seat": Armchair,
  "garden-seat": Leaf,
  "sofa-seat": Sofa,
  "big-table": Table2,
  "early-focus": Sunrise,
  "late-morning": Sun,
  "golden-hour": Sunset,
  "slow-night": Moon,
  "student-friendly": PiggyBank,
  "worth-splurge": Gem,
  "stay-long": Hourglass,
  "split-table": BadgeDollarSign,
};

function getOptionIcon(optionId: string, index: number) {
  return OPTION_ICON_BY_ID[optionId] ?? OPTION_ICONS[index % OPTION_ICONS.length];
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

function ResultScene({
  result,
  locale,
  onRestart,
  reduceMotion,
  labels,
  isPreview,
}: {
  result: Result;
  locale: string;
  onRestart: () => void;
  reduceMotion: boolean;
  labels: ResultLabels;
  isPreview: boolean;
}) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");

  async function renderShareFile() {
    const node = exportRef.current;
    if (!node) throw new Error("Missing share card");
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 1,
      width: 1080,
      height: 1920,
      canvasWidth: 1080,
      canvasHeight: 1920,
      backgroundColor: "#fbf4e8",
    });
    const blob = await (await fetch(dataUrl)).blob();
    return new File([blob], `cafe-persona-${result.profile.id}-${result.dna}.png`, {
      type: "image/png",
    });
  }

  async function downloadImage(nextStatus = labels.savedImage) {
    const file = await renderShareFile();
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
    setStatus(nextStatus);
  }

  return (
    <section className="relative min-h-[100svh] bg-[#fbf4e8] px-3 pt-[calc(env(safe-area-inset-top,0px)+5.25rem)] pb-[calc(var(--mobile-bottom-nav-height,72px)+env(safe-area-inset-bottom,0px)+2rem)] min-[390px]:px-4 lg:pt-24 dark:bg-[#1e1c1a]">
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="mx-auto min-w-0 lg:sticky lg:top-24">
              <div className="mx-auto w-[min(100%,20.5rem)] min-w-0 sm:w-full sm:max-w-[410px]">
                <QuizResultShareCard
                  result={result}
                  labels={labels}
                  className="aspect-[9/16] w-full"
                />
              </div>
              <div className="mx-auto mt-4 grid w-[min(100%,20.5rem)] grid-cols-2 gap-2 sm:w-full sm:max-w-[410px]">
                <ActionButton
                  icon={Download}
                  label={labels.downloadImage}
                  onClick={() => void downloadImage()}
                />
                <ActionButton icon={RotateCcw} label={labels.retake} onClick={onRestart} />
              </div>
              <p
                className="mt-3 min-h-5 text-center text-xs font-semibold text-[#8b6437]"
                aria-live="polite"
              >
                {status}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-5 shadow-[0_18px_46px_rgba(88,55,24,0.1)] sm:p-6 dark:bg-[var(--card)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-[6px] border border-[#ead5b7] bg-white/70 px-3 py-1 text-xs font-bold tracking-[0.14em] text-[#9a672f] uppercase">
                    {labels.result}
                  </span>
                  <span className="rounded-full bg-[#2c1a0e] px-3 py-1 text-xs font-black text-[#fff7ea]">
                    {result.dna}
                  </span>
                </div>
                {isPreview ? (
                  <p className="mt-4 rounded-[8px] border border-[#e6cda2] bg-[#fff7e8] p-3 text-sm leading-6 font-semibold text-[#7a5528]">
                    {labels.previewNote}
                  </p>
                ) : null}
                <h1 className="font-display mt-5 text-3xl leading-tight font-extrabold text-[var(--foreground)] sm:text-5xl">
                  {result.profile.title}
                </h1>
                <p className="mt-2 text-base font-bold text-[#9a672f]">{result.profile.subtitle}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
                  {result.profile.description}
                </p>
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--foreground)]">
                    <span className="inline-flex items-center gap-2">
                      <Coffee className="size-4 text-[#c8842a]" />
                      {labels.match}
                    </span>
                    <span>{result.score}%</span>
                  </div>
                  <div className="h-4 overflow-hidden rounded-full border border-[var(--border)] bg-white/50 p-1 dark:bg-white/5">
                    <motion.div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#7a9e7e,#c8842a,#efc06c)] shadow-[inset_0_-2px_0_rgba(80,42,12,0.14)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-[#dfbf8f] bg-white/70 px-3 py-1 text-xs font-bold text-[var(--foreground)] dark:bg-white/5"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <PersonaAnalysis result={result} labels={labels} />
            </div>
          </div>

          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
              <Coffee className="size-4 text-[var(--accent)]" />
              {labels.recommendedCafes}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.cafes.map((cafe, index) => (
                <CafeRecommendationCard
                  key={cafe.id}
                  cafe={cafe}
                  index={index}
                  locale={locale}
                  labels={labels}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </section>
        </motion.div>

        <div className="pointer-events-none fixed top-0 left-[-12000px]">
          <QuizResultShareCard
            cardRef={exportRef}
            result={result}
            labels={labels}
            className="h-[1920px] w-[1080px]"
          />
        </div>
      </div>
    </section>
  );
}

function QuizResultShareCard({
  result,
  labels,
  className,
  cardRef,
}: {
  result: Result;
  labels: ResultLabels;
  className?: string;
  cardRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={cardRef}
      className={cn(
        "[container-type:inline-size] relative isolate overflow-hidden rounded-[8px] bg-[#f7ead7] font-sans text-[#2c1a0e] shadow-[0_24px_60px_rgba(88,55,24,0.18)]",
        className,
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${result.profile.posterImage})` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,16,10,0.18)_0%,rgba(25,16,10,0.04)_38%,rgba(25,16,10,0.76)_100%)]" />
      <div className="absolute top-[5%] right-[6%] left-[6%] flex items-start justify-between gap-[4%]">
        <span className="rounded-[6px] bg-[#fff8ec]/90 px-[3%] py-[1.4%] text-[3cqw] font-black tracking-[0.14em] text-[#7b5228] uppercase">
          cafe persona
        </span>
        <span className="rounded-full bg-[#2c1a0e]/92 px-[3.2%] py-[1.5%] text-[3.3cqw] font-black text-[#fff7ea]">
          {result.profile.code}
        </span>
      </div>
      <div className="absolute right-0 bottom-0 left-0 p-[6%]">
        <div className="rounded-[8px] border border-[#f5dfb8]/70 bg-[#fff8ec]/92 p-[5%] shadow-[0_18px_54px_rgba(39,22,11,0.26)]">
          <div className="flex items-center justify-between gap-[4%]">
            <span className="text-[3.2cqw] font-black tracking-[0.12em] text-[#9a672f] uppercase">
              {labels.result}
            </span>
            <span className="rounded-full bg-[#ead2a9] px-[3%] py-[1.2%] text-[3cqw] font-black text-[#5f3c19]">
              {result.dna}
            </span>
          </div>
          <h2 className="mt-[4%] text-[10cqw] leading-[0.96] font-black tracking-[0]">
            {result.profile.title}
          </h2>
          <p className="mt-[3%] text-[4.2cqw] leading-[1.25] font-bold text-[#7a5528]">
            {result.profile.subtitle}
          </p>
          <div className="mt-[5%] flex flex-wrap gap-[2%]">
            {result.profile.reasons.slice(0, 3).map((reason) => (
              <span
                key={reason}
                className="mb-[2%] rounded-full border border-[#dfbf8f] bg-white/70 px-[3%] py-[1.3%] text-[3.2cqw] font-black text-[#4f3219]"
              >
                {reason}
              </span>
            ))}
          </div>
          <div className="mt-[4%] flex items-center justify-between text-[3.6cqw] font-black text-[#5f3c19]">
            <span>{labels.match}</span>
            <span>{result.score}%</span>
          </div>
          <div className="mt-[1.6%] h-[2.2cqw] overflow-hidden rounded-full bg-[#ead2a9] p-[0.6%]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#7a9e7e,#c8842a,#efc06c)]"
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonaAnalysis({ result, labels }: { result: Result; labels: ResultLabels }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <AnalysisColumn
        title={labels.traits}
        items={result.profile.personalityTraits}
        icon={Sparkles}
      />
      <AnalysisColumn title={labels.bestFor} items={result.profile.bestFor} icon={Coffee} />
      <AnalysisColumn title={labels.avoidWhen} items={result.profile.avoidWhen} icon={Moon} />
    </div>
  );
}

function AnalysisColumn({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[8px] border border-[#e5cfad] bg-[#fffdf8] p-4 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-[var(--card)]">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-[var(--foreground)]">
        <Icon className="size-4 text-[#c8842a]" />
        {title}
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-[var(--foreground-muted)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CafeRecommendationCard({
  cafe,
  index,
  locale,
  labels,
  reduceMotion,
}: {
  cafe: Cafe & { matchReason: string };
  index: number;
  locale: string;
  labels: ResultLabels;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      className="relative overflow-hidden rounded-[8px] border border-[#e3ca9f] bg-white/75 shadow-[0_12px_30px_rgba(88,55,24,0.08)] dark:bg-white/5"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.08 }}
    >
      <div className="relative aspect-[4/3] bg-[var(--background-secondary)]">
        {cafe.coverImage || cafe.images[0] ? (
          <Image
            src={cafe.coverImage ?? cafe.images[0]}
            alt={cafe.name}
            fill
            sizes="(min-width: 1024px) 360px, 50vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="line-clamp-1 text-base font-extrabold text-[var(--foreground)]">
              {cafe.name}
            </h2>
            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {[
                formatCafeArea(cafe.district, locale),
                formatPrice(cafe.priceMin, cafe.priceMax, locale),
              ]
                .filter(Boolean)
                .join(" • ")}
            </p>
          </div>
          <Sparkles className="mt-1 size-4 shrink-0 text-[#c8842a]" />
        </div>
        <p className="mt-3 min-h-10 text-sm leading-5 text-[var(--foreground-muted)]">
          {cafe.matchReason}
        </p>
        <Link
          href={`/cafe/${cafe.slug}`}
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-[#2c1a0e] px-4 text-xs font-bold text-[#fff7ea]"
        >
          {labels.viewCafe}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#dfbf8f] bg-white/80 px-3 text-xs font-black text-[var(--foreground)] shadow-sm transition-colors hover:bg-[#fff6e5] dark:bg-white/5"
    >
      <Icon className="size-4" />
      <span className="truncate">{label}</span>
    </button>
  );
}
