import type { Cafe } from "@/types/cafe";
import type {
  LocalizedQuizProfile,
  LocalizedQuizQuestion,
  QuizOption,
  QuizProfileId,
  QuizResult,
} from "@/types/quiz";
import { QUIZ_PROFILES, QUIZ_QUESTIONS } from "./quiz-data";

export { QUIZ_PROFILES, QUIZ_QUESTIONS } from "./quiz-data";

export type QuizMessages = {
  questions: Array<{
    id: string;
    text: string;
    options: Array<{ id: string; label: string }>;
  }>;
  profiles: Record<
    QuizProfileId,
    {
      title: string;
      subtitle: string;
      description: string;
      shareTitle: string;
      shareDescription: string;
      reasons: string[];
      personalityTraits: string[];
      bestFor: string[];
      avoidWhen: string[];
    }
  >;
  matchReasons: Record<QuizProfileId, string[]>;
};

export function getLocalizedQuizQuestions(messages: QuizMessages): LocalizedQuizQuestion[] {
  return QUIZ_QUESTIONS.map((question) => {
    const copy = messages.questions.find((item) => item.id === question.id);
    return {
      ...question,
      text: copy?.text ?? question.id,
      options: question.options.map((option) => ({
        ...option,
        label: copy?.options.find((item) => item.id === option.id)?.label ?? option.id,
      })),
    };
  });
}

export function getLocalizedQuizProfiles(messages: QuizMessages): LocalizedQuizProfile[] {
  return QUIZ_PROFILES.map((profile) => ({
    ...profile,
    title: messages.profiles[profile.id].title,
    subtitle: messages.profiles[profile.id].subtitle,
    description: messages.profiles[profile.id].description,
    shareTitle: messages.profiles[profile.id].shareTitle,
    shareDescription: messages.profiles[profile.id].shareDescription,
    reasons: messages.profiles[profile.id].reasons,
    personalityTraits: messages.profiles[profile.id].personalityTraits,
    bestFor: messages.profiles[profile.id].bestFor,
    avoidWhen: messages.profiles[profile.id].avoidWhen,
  }));
}

export function resolveQuizResult({
  answers,
  cafes,
  messages,
}: {
  answers: QuizOption[];
  cafes: Cafe[];
  messages: QuizMessages;
}): QuizResult {
  const scores = new Map<QuizProfileId, number>();
  for (const profile of QUIZ_PROFILES) scores.set(profile.id, 0);

  for (const answer of answers) {
    for (const target of answer.scores) {
      scores.set(target.profile, (scores.get(target.profile) ?? 0) + target.weight);
    }
  }

  const winnerId = [...scores.entries()].sort(
    (a, b) => b[1] - a[1] || profileOrder(a[0]) - profileOrder(b[0]),
  )[0][0];
  const profiles = getLocalizedQuizProfiles(messages);
  const profile = profiles.find((item) => item.id === winnerId) ?? profiles[0];
  const topScore = Math.max(1, scores.get(profile.id) ?? 1);
  const selectedVibes = unique([...profile.vibes, ...answers.flatMap((answer) => answer.vibes)]);
  const selectedPurposes = unique([
    ...profile.purposes,
    ...answers.flatMap((answer) => answer.purposes),
  ]);
  const selectedTags = unique([...profile.tags, ...answers.flatMap((answer) => answer.tags)]);
  const selectedPriceRange =
    [...answers].reverse().find((answer) => answer.priceRange)?.priceRange ?? profile.priceRange;

  const ranked = cafes
    .map((cafe, index) => {
      const vibeMatches = selectedVibes.filter((vibe) => cafe.vibes.includes(vibe)).length;
      const purposeMatches = selectedPurposes.filter((purpose) =>
        cafe.purposes.includes(purpose),
      ).length;
      const tagMatches = selectedTags.filter((tag) =>
        cafe.tags.map(normalize).includes(normalize(tag)),
      ).length;
      const priceMatch = selectedPriceRange ? priceRangeMatches(cafe, selectedPriceRange) : false;
      return {
        cafe,
        index,
        score: vibeMatches * 4 + purposeMatches * 3 + tagMatches * 2 + (priceMatch ? 1 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const reasons = messages.matchReasons[profile.id];
  const matchedCafes = ranked.slice(0, 6).map(({ cafe }, index) => ({
    ...cafe,
    matchReason: reasons[index % reasons.length],
  }));

  return {
    profile,
    cafes: matchedCafes,
    score: Math.min(98, Math.round((topScore / Math.max(1, answers.length * 3)) * 100)),
    dna: createQuizDna(profile, answers),
    chips: unique([
      ...profile.reasons,
      ...selectedVibes.slice(0, 2),
      ...selectedPurposes.slice(0, 1),
    ]).slice(0, 6),
  };
}

export function resolveQuizPreviewResult({
  profileId,
  dna,
  cafes,
  messages,
}: {
  profileId: QuizProfileId;
  dna?: string;
  cafes: Cafe[];
  messages: QuizMessages;
}): QuizResult {
  const profiles = getLocalizedQuizProfiles(messages);
  const profile = profiles.find((item) => item.id === profileId) ?? profiles[0];
  const selectedVibes = unique(profile.vibes);
  const selectedPurposes = unique(profile.purposes);
  const selectedTags = unique(profile.tags);
  const ranked = cafes
    .map((cafe, index) => {
      const vibeMatches = selectedVibes.filter((vibe) => cafe.vibes.includes(vibe)).length;
      const purposeMatches = selectedPurposes.filter((purpose) =>
        cafe.purposes.includes(purpose),
      ).length;
      const tagMatches = selectedTags.filter((tag) =>
        cafe.tags.map(normalize).includes(normalize(tag)),
      ).length;
      const priceMatch = profile.priceRange ? priceRangeMatches(cafe, profile.priceRange) : false;
      return {
        cafe,
        index,
        score: vibeMatches * 4 + purposeMatches * 3 + tagMatches * 2 + (priceMatch ? 1 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const reasons = messages.matchReasons[profile.id];
  const matchedCafes = ranked.slice(0, 6).map(({ cafe }, index) => ({
    ...cafe,
    matchReason: reasons[index % reasons.length],
  }));

  return {
    profile,
    cafes: matchedCafes,
    score: 88,
    dna: dna && dna.startsWith(`${profile.code}-`) ? dna : `${profile.code}-0000-0000`,
    chips: unique([...profile.reasons, ...profile.personalityTraits, ...profile.bestFor]).slice(
      0,
      6,
    ),
  };
}

export function isQuizProfileId(value: unknown): value is QuizProfileId {
  return typeof value === "string" && QUIZ_PROFILES.some((profile) => profile.id === value);
}

function profileOrder(id: QuizProfileId) {
  return QUIZ_PROFILES.findIndex((profile) => profile.id === id);
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function createQuizDna(profile: LocalizedQuizProfile, answers: QuizOption[]) {
  const path = answers
    .map((answer, questionIndex) => {
      const optionIndex =
        QUIZ_QUESTIONS[questionIndex]?.options.findIndex((option) => option.id === answer.id) ?? -1;
      return Math.max(0, optionIndex) + 1;
    })
    .join("");
  const seed = answers.reduce(
    (total, answer, answerIndex) => {
      const optionScore = answer.scores.reduce(
        (sum, target) => sum + profileOrder(target.profile) * 7 + target.weight * 13,
        0,
      );
      return total + optionScore * (answerIndex + 3);
    },
    profileOrder(profile.id) * 97,
  );
  const left = String((seed * 31 + path.length * 17) % 10000).padStart(4, "0");
  const right = String((seed * 47 + Number(path.slice(-4) || 0)) % 10000).padStart(4, "0");
  return `${profile.code}-${left}-${right}`;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\s_-]+/g, "");
}

function priceRangeMatches(cafe: Cafe, priceRange: string) {
  const min = cafe.priceMin ?? 0;
  const max = cafe.priceMax ?? min;
  if (priceRange === "under_50k") return min < 50000;
  if (priceRange === "50k_100k" || priceRange === "price_50k_100k")
    return min <= 100000 && max >= 50000;
  if (priceRange === "100k_150k" || priceRange === "price_100k_150k")
    return min <= 150000 && max >= 100000;
  if (priceRange === "above_150k") return max > 150000;
  return true;
}
