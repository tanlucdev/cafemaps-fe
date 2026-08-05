import type { Cafe } from "@/types/cafe";
import type { LocalizedQuizProfile, LocalizedQuizQuestion, QuizOption, QuizProfileId, QuizResult, QuizResultVariant } from "@/types/quiz";
import { QUIZ_PROFILES, normalizeQuizProfileId, resolveQuizPosterImage } from "./profiles";
import { QUIZ_QUESTIONS } from "./questions";
import { rankCafesForQuiz } from "./scoring";

export type QuizMessages = {
  questions: Array<{ id: string; text: string; options: Array<{ id: string; label: string }> }>;
  profiles: Record<QuizProfileId, { title: string; subtitle: string; description: string; shareTitle: string; shareDescription: string; reasons: string[]; personalityTraits: string[]; bestFor: string[]; avoidWhen: string[] }>;
  matchReasons: Record<QuizProfileId, string[]>;
};

export function getLocalizedQuizQuestions(messages: QuizMessages): LocalizedQuizQuestion[] {
  return QUIZ_QUESTIONS.map((question) => {
    const copy = messages.questions.find((item) => item.id === question.id);
    return { ...question, text: copy?.text ?? question.id, options: question.options.map((option) => ({ ...option, label: copy?.options.find((item) => item.id === option.id)?.label ?? option.id })) };
  });
}

export function getLocalizedQuizProfiles(messages: QuizMessages, variant: QuizResultVariant = "woman"): LocalizedQuizProfile[] {
  return QUIZ_PROFILES.map((profile) => ({ ...profile, posterImage: resolveQuizPosterImage(profile.posterImageSlug, variant), ...messages.profiles[profile.id] }));
}

export function resolveQuizResult({ answers, cafes, messages, variant = "woman" }: { answers: QuizOption[]; cafes: Cafe[]; messages: QuizMessages; variant?: QuizResultVariant }): QuizResult {
  const scores = new Map<QuizProfileId, number>(QUIZ_PROFILES.map((profile) => [profile.id, 0]));
  for (const answer of answers) for (const target of answer.scores) scores.set(target.profile, (scores.get(target.profile) ?? 0) + target.weight);
  const rankedScores = [...scores.entries()].sort((a, b) => b[1] - a[1] || profileOrder(a[0]) - profileOrder(b[0]));
  const winnerId = rankedScores[0][0];
  const scoreGap = rankedScores[0][1] - (rankedScores[1]?.[1] ?? 0);
  const score = Math.min(98, 78 + Math.round(scoreGap * 4 + (rankedScores[0][1] / Math.max(1, answers.length)) * 2));
  return buildResult(winnerId, cafes, messages, variant, answers, score);
}

export function resolveQuizPreviewResult({ profileId, dna, cafes, messages, variant = "woman" }: { profileId: QuizProfileId; dna?: string; cafes: Cafe[]; messages: QuizMessages; variant?: QuizResultVariant }): QuizResult {
  const profile = getLocalizedQuizProfiles(messages, variant).find((item) => item.id === profileId) ?? getLocalizedQuizProfiles(messages, variant)[0];
  const result = rankCafesForQuiz(profile, cafes, messages);
  return { profile, cafes: result, score: 88, dna: dna && dna.startsWith(`${profile.code}-`) ? dna : `${profile.code}-0000-0000`, chips: unique([...profile.reasons, ...profile.personalityTraits, ...profile.bestFor]).slice(0, 6) };
}

export function isQuizProfileId(value: unknown): value is QuizProfileId {
  return Boolean(normalizeQuizProfileId(value));
}

function buildResult(id: QuizProfileId, cafes: Cafe[], messages: QuizMessages, variant: QuizResultVariant, answers: QuizOption[], score: number): QuizResult {
  const profile = getLocalizedQuizProfiles(messages, variant).find((item) => item.id === id) ?? getLocalizedQuizProfiles(messages, variant)[0];
  const selectedVibes = unique([...profile.vibes, ...answers.flatMap((answer) => answer.vibes)]);
  const selectedPurposes = unique([...profile.purposes, ...answers.flatMap((answer) => answer.purposes)]);
  const chips = unique([...profile.reasons, ...selectedVibes.slice(0, 2), ...selectedPurposes.slice(0, 1)]).slice(0, 6);
  return { profile, cafes: rankCafesForQuiz(profile, cafes, messages, answers), score, dna: createQuizDna(profile, answers), chips };
}

function profileOrder(id: QuizProfileId) { return QUIZ_PROFILES.findIndex((profile) => profile.id === id); }
function unique(values: string[]) { return [...new Set(values.filter(Boolean))]; }

function createQuizDna(profile: LocalizedQuizProfile, answers: QuizOption[]) {
  const path = answers.map((answer, questionIndex) => Math.max(0, QUIZ_QUESTIONS[questionIndex]?.options.findIndex((option) => option.id === answer.id) ?? -1) + 1).join("");
  const seed = answers.reduce((total, answer, answerIndex) => total + answer.scores.reduce((sum, target) => sum + profileOrder(target.profile) * 7 + target.weight * 13, 0) * (answerIndex + 3), profileOrder(profile.id) * 97);
  return `${profile.code}-${String((seed * 31 + path.length * 17) % 10000).padStart(4, "0")}-${String((seed * 47 + Number(path.slice(-4) || 0)) % 10000).padStart(4, "0")}`;
}
