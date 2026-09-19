"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { getQuizMatchCafes } from "@/apis/cafes/queries";
import { recordQuizCompletion } from "@/apis/quiz";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { getCurrentAccessToken } from "@/lib/auth-client";
import {
  getLocalizedQuizProfiles,
  getLocalizedQuizQuestions,
  normalizeQuizProfileId,
  normalizeQuizResultVariant,
  resolveQuizPreviewResult,
  resolveQuizResult,
  type QuizMessages,
} from "@/lib/quiz";
import type { Cafe } from "@/types/cafe";
import type { QuizOption, QuizProfileId, QuizResultVariant } from "@/types/quiz";
import QuizQuestionScene from "./QuizQuestionScene";

const QuizResultScene = dynamic(() => import("./QuizResultScene"));

type VariantChoiceId = QuizResultVariant | "random";

interface QuizExperienceProps {
  locale: string;
}

export default function QuizExperience({
  locale,
}: QuizExperienceProps) {
  const t = useTranslations("quiz");
  const messages = t.raw("experience") as QuizMessages;
  const questions = useMemo(() => getLocalizedQuizQuestions(messages), [messages]);
  const reduceMotion = usePrefersReducedMotion();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [cafesReady, setCafesReady] = useState(false);
  const [step, setStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizOption>>({});
  const [initialDna, setInitialDna] = useState<string | undefined>();
  const [resultVariant, setResultVariant] = useState<QuizResultVariant | undefined>();
  const [variantChoice, setVariantChoice] = useState<VariantChoiceId | undefined>();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const autoAdvanceTimer = useRef<number | null>(null);
  const cafesPromise = useRef<Promise<Cafe[]> | null>(null);
  const completionRecorded = useRef(false);
  const [previewProfileId, setPreviewProfileId] = useState<QuizProfileId | undefined>();
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
  const result = useMemo(() => {
    if (isComplete && submitted) {
      return resolveQuizResult({
        answers: questions.map((question) => answers[question.id]),
        cafes,
        messages,
        variant: resultVariant,
      });
    }
    if (previewProfileId && cafesReady) {
      return resolveQuizPreviewResult({
        profileId: previewProfileId,
        dna: initialDna,
        cafes,
        messages,
        variant: resultVariant,
      });
    }
    return null;
  }, [
    answers,
    cafes,
    cafesReady,
    initialDna,
    isComplete,
    messages,
    previewProfileId,
    questions,
    resultVariant,
    submitted,
  ]);
  const progress = (answeredCount / totalQuestions) * 100;
  const canContinue = !isLastStep && Boolean(selectedId) && highestStep > step;

  const warmCafes = useCallback(() => {
    if (!cafesPromise.current) {
      cafesPromise.current = getQuizMatchCafes({ limit: 36 }, locale).then((items) => {
        setCafes(items);
        setCafesReady(true);
        return items;
      }).catch(() => {
        setCafesReady(true);
        return [];
      });
    }
    return cafesPromise.current;
  }, [locale]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileId = normalizeQuizProfileId(params.get("type"));
    if (!profileId) return;
    const variant = normalizeQuizResultVariant(params.get("variant"));
    setPreviewProfileId(profileId);
    setInitialDna(params.get("dna") ?? undefined);
    setResultVariant(variant);
    setVariantChoice(variant);
    void warmCafes();
  }, [warmCafes]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  function selectOption(option: QuizOption | { id: string; label: string }) {
    setPreviewProfileId(undefined);
    setSubmitted(false);
    setSubmitting(false);
    completionRecorded.current = false;
    void warmCafes();
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
    setSubmitting(false);
    completionRecorded.current = false;
    setAnswers({});
    setResultVariant(undefined);
    setVariantChoice(undefined);
    setStep(0);
    setHighestStep(0);
  }

  function submit() {
    if (submitting || !isComplete || !isLastStep || !selectedId) return;
    const variant = resultVariant;
    if (!variant) return;
    setSubmitting(true);
    void warmCafes().then((items) => {
      const resolved = resolveQuizResult({
        answers: questions.map((question) => answers[question.id]),
        cafes: items,
        messages,
        variant,
      });
      setPreviewProfileId(undefined);
      setSubmitted(true);
      if (completionRecorded.current) return;
      completionRecorded.current = true;
      void getCurrentAccessToken().then((token) => {
        if (!token) return;
        void recordQuizCompletion(token, {
          profileId: resolved.profile.id,
          profileTitle: resolved.profile.title,
          variant,
          score: resolved.score,
          dna: resolved.dna,
          chips: resolved.chips,
          answers: questions.map((question) => ({ id: answers[question.id].id })),
        }).catch(() => {});
      });
    }).finally(() => setSubmitting(false));
  }

  function next() {
    if (!selectedId || isLastStep) return;
    if (autoAdvanceTimer.current) window.clearTimeout(autoAdvanceTimer.current);
    setStep((value) => value + 1);
    setHighestStep((value) => Math.max(value, step + 1));
  }

  if (previewProfileId && !cafesReady) {
    return (
      <section className="grid min-h-[100svh] place-items-center bg-[#fbf4e8] px-4 text-center dark:bg-[#1e1c1a]">
        <p className="text-sm font-black text-[#8b6437]">{t("brewingResult")}</p>
      </section>
    );
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
          shareNudge: t("shareNudge"),
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
      submitBusy={submitting}
      canContinue={canContinue}
      labels={{
        eyebrow: t("eyebrow"),
        title: t("title"),
        subtitle: t("subtitle"),
        brewed: t("brewed"),
        back: t("back"),
        next: t("next"),
        lockTaste: submitting ? t("brewingResult") : t("lockTaste"),
        question: t("question", { current: step + 1, total: totalQuestions }),
      }}
      onSelect={selectOption}
      onBack={back}
      onNext={next}
      onSubmit={submit}
    />
  );
}
