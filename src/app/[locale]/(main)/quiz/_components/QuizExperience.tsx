"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  getLocalizedQuizProfiles,
  getLocalizedQuizQuestions,
  resolveQuizPreviewResult,
  resolveQuizResult,
  type QuizMessages,
} from "@/lib/quiz";
import type { Cafe } from "@/types/cafe";
import type { QuizOption, QuizProfileId, QuizResultVariant } from "@/types/quiz";
import QuizQuestionScene from "./QuizQuestionScene";
import QuizResultScene from "./QuizResultScene";

interface QuizExperienceProps {
  cafes: Cafe[];
  locale: string;
  initialProfileId?: QuizProfileId;
  initialDna?: string;
  initialVariant?: QuizResultVariant;
}

export default function QuizExperience({
  cafes,
  locale,
  initialProfileId,
  initialDna,
  initialVariant = "woman",
}: QuizExperienceProps) {
  const t = useTranslations("quiz");
  const messages = t.raw("experience") as QuizMessages;
  const questions = useMemo(() => getLocalizedQuizQuestions(messages), [messages]);
  const reduceMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  const [resultVariant, setResultVariant] = useState<QuizResultVariant | undefined>(
    initialProfileId ? initialVariant : undefined,
  );
  const [submitted, setSubmitted] = useState(false);
  const [, startTransition] = useTransition();
  const autoAdvanceTimer = useRef<number | null>(null);
  const [previewProfileId, setPreviewProfileId] = useState<QuizProfileId | undefined>(
    initialProfileId,
  );
  const variantCopy = messages.questions.find((item) => item.id === "result-variant");
  const variantQuestion = {
    id: "result-variant",
    sticker: "sparkle" as const,
    text: variantCopy?.text ?? "Bạn muốn ảnh kết quả theo vibe nào?",
    options: (variantCopy?.options ?? [
      { id: "man", label: "Nam" },
      { id: "woman", label: "Nữ" },
    ]) as Array<{ id: QuizResultVariant; label: string }>,
  };
  const isVariantStep = step === 0;
  const current = isVariantStep ? variantQuestion : questions[step - 1];
  const selected = isVariantStep ? resultVariant : answers[current.id];
  const isComplete = Boolean(resultVariant) && Object.keys(answers).length === questions.length;
  const answeredOptions = questions.map((question) => answers[question.id]).filter(Boolean);
  const answeredCount = answeredOptions.length + (resultVariant ? 1 : 0);
  const totalQuestions = questions.length + 1;
  const selectedId = typeof selected === "string" ? selected : selected?.id;
  const result =
    isComplete && submitted
      ? resolveQuizResult({
          answers: questions.map((question) => answers[question.id]),
          cafes,
          messages,
          variant: resultVariant,
        })
      : previewProfileId && !answeredOptions.length
        ? resolveQuizPreviewResult({
            profileId: previewProfileId,
            dna: initialDna,
            cafes,
            messages,
            variant: resultVariant,
          })
        : null;
  const progress = (answeredCount / totalQuestions) * 100;

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  function selectOption(option: QuizOption | { id: QuizResultVariant; label: string }) {
    setPreviewProfileId(undefined);
    setSubmitted(false);
    if (isVariantStep) setResultVariant(option.id as QuizResultVariant);
    else setAnswers((prev) => ({ ...prev, [current.id]: option as QuizOption }));
    if (step < totalQuestions - 1) {
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
    if (step < totalQuestions - 1) {
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
    setResultVariant(undefined);
    setStep(0);
  }

  function submit() {
    if (!isComplete) return;
    setPreviewProfileId(undefined);
    setSubmitted(true);
  }

  if (result) {
    return (
      <QuizResultScene
        result={result}
        profiles={getLocalizedQuizProfiles(messages, resultVariant ?? "woman")}
        variant={resultVariant ?? "woman"}
        locale={locale}
        onRestart={restart}
        reduceMotion={Boolean(reduceMotion)}
        labels={{
          result: t("result"),
          recommendedCafes: t("recommendedCafes"),
          viewCafe: t("viewCafe"),
          retake: t("retake"),
          match: t("match"),
          downloadImage: t("downloadImage"),
          shareResult: t("shareResult"),
          copied: t("copied"),
          savedImage: t("savedImage"),
          shareFallback: t("shareFallback"),
          sharing: t("sharing"),
          shareCancelled: t("shareCancelled"),
          shareFailed: t("shareFailed"),
          copyFailed: t("copyFailed"),
          traits: t("traits"),
          bestFor: t("bestFor"),
          avoidWhen: t("avoidWhen"),
          previewNote: t("previewNote"),
          compatiblePersonas: t("compatiblePersonas"),
          incompatiblePersonas: t("incompatiblePersonas"),
          pairPersonas: t("pairPersonas"),
        }}
        isPreview={Boolean(previewProfileId && !answeredOptions.length)}
      />
    );
  }

  return (
    <QuizQuestionScene
      current={current}
      selectedId={selectedId}
      progress={progress}
      step={step}
      totalQuestions={totalQuestions}
      reduceMotion={Boolean(reduceMotion)}
      direction={direction}
      isComplete={isComplete}
      labels={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        subtitle: t("subtitle"),
        brewed: t("brewed"),
        back: t("back"),
        next: t("next"),
        lockTaste: t("lockTaste"),
        question: t("question", { current: step + 1, total: totalQuestions }),
      }}
      onSelect={selectOption}
      onBack={back}
      onNext={next}
      onSubmit={submit}
    />
  );
}
