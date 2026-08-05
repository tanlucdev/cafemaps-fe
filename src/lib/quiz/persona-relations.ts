import { QUIZ_PROFILES } from "@/lib/quiz/profiles";
import type { LocalizedQuizProfile, QuizProfile, QuizProfileId } from "@/types/quiz";

export type PersonaRelations = {
  compatible: LocalizedQuizProfile[];
  incompatible: LocalizedQuizProfile[];
  pair: LocalizedQuizProfile[];
};

export function getPersonaRelations(
  current: QuizProfile,
  profiles: LocalizedQuizProfile[],
): PersonaRelations {
  const ranked = profiles
    .filter((profile) => profile.id !== current.id)
    .map((profile) => ({
      profile,
      score: relationScore(current, profile),
      order: profileOrder(profile.id),
    }))
    .sort((a, b) => b.score - a.score || a.order - b.order);

  const compatible = ranked.slice(0, 3).map((item) => item.profile);
  const incompatible = [...ranked]
    .sort((a, b) => a.score - b.score || a.order - b.order)
    .slice(0, 2)
    .map((item) => item.profile);
  const used = new Set([...compatible, ...incompatible].map((profile) => profile.id));
  const pair = ranked
    .filter((item) => !used.has(item.profile.id) && hasPurposeOrVibeOverlap(current, item.profile))
    .slice(0, 2)
    .map((item) => item.profile);

  return {
    compatible,
    incompatible,
    pair: pair.length
      ? pair
      : ranked.filter((item) => !used.has(item.profile.id)).slice(0, 2).map((item) => item.profile),
  };
}

function relationScore(current: QuizProfile, profile: QuizProfile) {
  return (
    shared(current.purposes, profile.purposes) * 2 +
    shared(current.vibes, profile.vibes) * 1.5 +
    shared(current.tags, profile.tags)
  );
}

function hasPurposeOrVibeOverlap(current: QuizProfile, profile: QuizProfile) {
  return shared(current.purposes, profile.purposes) + shared(current.vibes, profile.vibes) > 0;
}

function shared(left: string[], right: string[]) {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item)).length;
}

function profileOrder(id: QuizProfileId) {
  return QUIZ_PROFILES.findIndex((profile) => profile.id === id);
}
