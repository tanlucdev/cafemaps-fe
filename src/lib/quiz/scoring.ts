import type { Cafe } from "../../types/cafe";
import type { LocalizedQuizProfile, QuizOption, QuizProfileId } from "../../types/quiz";
import type { QuizMessages } from "./resolver";

const SOCIAL_PURPOSES = ["gặp bạn bè", "họp nhóm"];
const WORK_PURPOSES = ["làm việc", "học tập"];
const SOCIAL_PROFILE_IDS: QuizProfileId[] = ["lively-friends-table", "cafe-hopping"];

export function rankCafesForQuiz(
  profile: LocalizedQuizProfile,
  cafes: Cafe[],
  messages: QuizMessages,
  answers: QuizOption[] = [],
) {
  const answerVibes = unique(answers.flatMap((answer) => answer.vibes));
  const answerPurposes = unique(answers.flatMap((answer) => answer.purposes));
  const answerTags = unique(answers.flatMap((answer) => answer.tags));
  const selectedPriceRange = [...answers].reverse().find((answer) => answer.priceRange)?.priceRange ?? profile.priceRange;
  const isSocialProfile = isSocialPersona(profile);
  const cafePool = isSocialProfile ? cafes.filter(hasSocialPurpose) : cafes;
  const ranked = (cafePool.length ? cafePool : cafes).map((cafe, index) => {
    const cafePurposes = cafe.purposes.map(normalize);
    const cafeVibes = cafe.vibes.map(normalize);
    const cafeTags = cafe.tags.map(normalize);
    const profilePurposeMatches = profile.purposes.filter((purpose) => cafePurposes.includes(normalize(purpose))).length;
    const profileVibeMatches = profile.vibes.filter((vibe) => cafeVibes.includes(normalize(vibe))).length;
    const profileTagMatches = profile.tags.filter((tag) => cafeTags.includes(normalize(tag))).length;
    const answerPurposeMatches = answerPurposes.filter((purpose) => cafePurposes.includes(normalize(purpose))).length;
    const answerVibeMatches = answerVibes.filter((vibe) => cafeVibes.includes(normalize(vibe))).length;
    const answerTagMatches = answerTags.filter((tag) => cafeTags.includes(normalize(tag))).length;
    const priceMatch = selectedPriceRange ? priceRangeMatches(cafe, selectedPriceRange) : false;
    const onlyWorkStudy = cafePurposes.length > 0 && cafePurposes.every((purpose) => normalizedWorkPurposes.includes(purpose));
    const socialPurposeMatch = hasSocialPurpose(cafe);
    const penalty =
      (profilePurposeMatches ? 0 : -8) +
      (isSocialProfile && !socialPurposeMatch ? -10 : 0) +
      (isSocialProfile && onlyWorkStudy ? -6 : 0);
    const score =
      profilePurposeMatches * 8 +
      profileVibeMatches * 6 +
      profileTagMatches * 5 +
      answerPurposeMatches +
      answerVibeMatches +
      answerTagMatches +
      (priceMatch ? 1 : 0) +
      penalty;
    return { cafe, index, score, profilePurposeMatches, socialPurposeMatch: isSocialProfile && socialPurposeMatch };
  }).sort((a, b) => Math.abs(b.score - a.score) <= 1 ? seededTieBreak(a.index, b.index, profile, answers) : b.score - a.score);
  const reasons = messages.matchReasons[profile.id];
  return ranked.slice(0, 6).map(({ cafe, profilePurposeMatches, socialPurposeMatch }, index) => ({
    ...cafe,
    matchReason: pickMatchReason(reasons, index, profilePurposeMatches > 0, socialPurposeMatch),
  }));
}

function isSocialPersona(profile: LocalizedQuizProfile) {
  return SOCIAL_PROFILE_IDS.includes(profile.id) || profile.purposes.some((purpose) => normalizedSocialPurposes.includes(normalize(purpose)));
}

function hasSocialPurpose(cafe: Cafe) {
  const purposes = cafe.purposes.map(normalize);
  return normalizedSocialPurposes.some((purpose) => purposes.includes(purpose));
}

function pickMatchReason(reasons: string[], index: number, hasProfilePurpose: boolean, hasSocialPurpose: boolean) {
  if (hasSocialPurpose) return isEnglishReasons(reasons) ? "Better for friends or small groups than quiet solo work." : "Hợp gặp bạn bè/nhóm nhỏ hơn là ngồi yên làm việc.";
  return reasons[(hasProfilePurpose ? index : index + 1) % reasons.length];
}

function isEnglishReasons(reasons: string[]) {
  return reasons[0]?.startsWith("The space");
}

function unique(values: string[]) { return [...new Set(values.filter(Boolean))]; }
function normalize(value: string) { return value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[\s_-]+/g, ""); }
const normalizedSocialPurposes = SOCIAL_PURPOSES.map(normalize);
const normalizedWorkPurposes = WORK_PURPOSES.map(normalize);
function seededTieBreak(aIndex: number, bIndex: number, profile: LocalizedQuizProfile, answers: QuizOption[]) {
  const seed = `${profile.id}:${answers.map((answer) => answer.id).join("-")}`;
  return seededValue(seed, aIndex) - seededValue(seed, bIndex) || aIndex - bIndex;
}
function seededValue(seed: string, index: number) {
  let hash = 2166136261;
  for (const char of `${seed}:${index}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}
function priceRangeMatches(cafe: Cafe, priceRange: string) {
  const min = cafe.priceMin ?? 0, max = cafe.priceMax ?? min;
  if (priceRange === "under_50k") return min < 50000;
  if (priceRange === "50k_100k" || priceRange === "price_50k_100k") return min <= 100000 && max >= 50000;
  if (priceRange === "100k_150k" || priceRange === "price_100k_150k") return min <= 150000 && max >= 100000;
  if (priceRange === "above_150k") return max > 150000;
  return true;
}
