"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { recordQuizCompletion } from "@/apis/quiz";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getCurrentAccessToken } from "@/lib/auth-client";
import {
  getLocalizedQuizProfiles,
  getLocalizedQuizQuestions,
  resolveQuizPreviewResult,
  resolveQuizResult,
  type QuizMessages,
} from "@/lib/quiz";
import type { QuizOption, QuizProfileId, QuizResultVariant } from "@/types/quiz";
import QuizQuestionScene from "./QuizQuestionScene";

const QuizResultScene = dynamic(() => import("./QuizResultScene"));

type VariantChoiceId = QuizResultVariant | "random";

interface QuizExperienceProps {
  locale: string;
  initialProfileId?: QuizProfileId;
  initialDna?: string;
  initialVariant?: QuizResultVariant;
}

export default function QuizExperience({
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
  const [highestStep, setHighestStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  const [resultVariant, setResultVariant] = useState<QuizResultVariant | undefined>(
    initialProfileId ? initialVariant : undefined,
  );
  const [variantChoice, setVariantChoice] = useState<VariantChoiceId | undefined>(
    initialProfileId ? initialVariant : undefined,
  );
  const [submitted, setSubmitted] = useState(false);
  const autoAdvanceTimer = useRef<number | null>(null);
  const completionRecorded = useRef(false);
  const [previewProfileId, setPreviewProfileId] = useState<QuizProfileId | undefined>(
    initialProfileId,
  );
  const variantCopy = messages.questions.find((item) => item.id === "result-variant");
  const variantQuestion = {
    id: "result-variant",
    sticker: "sparkle" as const,
    text: variantCopy?.text ?? "Bạn là...",
    options: (variantCopy?.options ?? [
      { id: "woman", label: "Nữ" },
      { id: "man", label: "Nam" },
      { id: "random", label: "Không muốn trả lời" },
    ]) as Array<{ id: VariantChoiceId; label: string }>,
  };
  const isVariantStep = step === 0;
  const current = isVariantStep ? variantQuestion : questions[step - 1];
  const selected = isVariantStep ? variantChoice : answers[current.id];
  const answeredOptions = questions.map((question) => answers[question.id]).filter(Boolean);
  const isComplete = Boolean(resultVariant) && answeredOptions.length === questions.length;
  const answeredCount = answeredOptions.length + (resultVariant ? 1 : 0);
  const totalQuestions = questions.length + 1;
  const isLastStep = step === totalQuestions - 1;
  const selectedId = typeof selected === "string" ? selected : selected?.id;
  const result =
    isComplete && submitted
      ? resolveQuizResult({
          answers: questions.map((question) => answers[question.id]),
          cafes: [],
          messages,
          variant: resultVariant,
        })
      : previewProfileId && !answeredOptions.length
        ? resolveQuizPreviewResult({
            profileId: previewProfileId,
            dna: initialDna,
            cafes: [],
            messages,
            variant: resultVariant,
          })
        : null;
  const progress = (answeredCount / totalQuestions) * 100;
  const canContinue = !isLastStep && Boolean(selectedId) && highestStep > step;

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  function selectOption(option: QuizOption | { id: string; label: string }) {
    setPreviewProfileId(undefined);
    setSubmitted(false);
    completionRecorded.current = false;
    if (isVariantStep) {
      const id = option.id as VariantChoiceId;
      setVariantChoice(id);
      setResultVariant(id === "random" ? (Math.random() < 0.5 ? "woman" : "man") : id);
    } else {
      setAnswers((prev) => ({ ...prev, [current.id]: option as QuizOption }));
    }
    if (!isLastStep && highestStep <= step) {
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = window.setTimeout(
        () => {
          setStep((value) => value + 1);
          setHighestStep((value) => Math.max(value, step + 1));
        },
        reduceMotion ? 0 : 140,
      );
    }
  }

  function back() {
    if (step === 0) return;
    if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    setStep((value) => value - 1);
  }

  function restart() {
    if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    setPreviewProfileId(undefined);
    setSubmitted(false);
    completionRecorded.current = false;
    setAnswers({});
    setResultVariant(undefined);
    setVariantChoice(undefined);
    setStep(0);
    setHighestStep(0);
  }

  function submit() {
    if (!isComplete || !isLastStep || !selectedId) return;
    setPreviewProfileId(undefined);
    setSubmitted(true);
    if (completionRecorded.current) return;
    completionRecorded.current = true;
    void getCurrentAccessToken().then((token) => {
      if (token) void recordQuizCompletion(token).catch(() => {});
    });
  }

  function next() {
    if (!selectedId || isLastStep) return;
    if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    setStep((value) => value + 1);
    setHighestStep((value) => Math.max(value, step + 1));
  }

  if (result) {
    return (
      <QuizResultScene
        result={result}
        profiles={getLocalizedQuizProfiles(messages, resultVariant ?? "woman")}
        variant={resultVariant ?? "woman"}
        locale={locale}
        answers={questions.map((question) => answers[question.id]).filter(Boolean)}
        messages={messages}
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
          copyLink: t("copyLink"),
          copied: t("copied"),
          savedImage: t("savedImage"),
          sharing: t("sharing"),
          shareFailed: t("shareFailed"),
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
      reduceMotion={Boolean(reduceMotion)}
      canSubmit={isLastStep && Boolean(selectedId) && isComplete}
      canContinue={canContinue}
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
