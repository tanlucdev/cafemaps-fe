import { normalizeQuizProfileId } from "@/lib/quiz/profiles";
import type { QuizResultImagePayload } from "@/apis/quiz";
import type { LocalizedQuizProfile, QuizResultVariant } from "@/types/quiz";

const MAX_TEXT = 180;
const MAX_LIST = 14;

export type CleanPayload = QuizResultImagePayload;

export function cleanPayload(value: unknown): CleanPayload | null {
  const p = value as Partial<QuizResultImagePayload>;
  if (!p || (p.format !== "desktop" && p.format !== "mobile") || (p.variant !== "man" && p.variant !== "woman")) return null;
  const profile = cleanProfile(p.result?.profile);
  const score = Number(p.result?.score);
  const labels = cleanLabels(p.labels);
  if (!profile || !labels || !Number.isFinite(score) || score < 0 || score > 100) return null;
  const profiles = arr(p.profiles, MAX_LIST).map(cleanProfile).filter(Boolean) as LocalizedQuizProfile[];
  return { format: p.format, variant: p.variant as QuizResultVariant, scale: p.scale === 2 ? 2 : 1, result: { profile, score: Math.round(score), dna: s(p.result?.dna, 24), chips: arr(p.result?.chips, 8).map((item) => s(item, 32)).filter(Boolean) }, profiles, labels };
}

function cleanProfile(value: unknown): LocalizedQuizProfile | null {
  const p = value as LocalizedQuizProfile;
  const id = normalizeQuizProfileId(p?.id);
  if (!id || !p.posterImageSlug) return null;
  return {
    ...p,
    id,
    code: s(p.code, 6),
    sticker: p.sticker,
    posterImageSlug: s(p.posterImageSlug, 80),
    posterImage: s(p.posterImage, 160),
    title: s(p.title, 64),
    subtitle: s(p.subtitle, 90),
    description: s(p.description, 320),
    shareTitle: s(p.shareTitle, 90),
    shareDescription: s(p.shareDescription, 180),
    vibes: arr(p.vibes, 6).map((v) => s(v, 32)),
    purposes: arr(p.purposes, 6).map((v) => s(v, 32)),
    tags: arr(p.tags, 8).map((v) => s(v, 32)),
    reasons: arr(p.reasons, 4).map((v) => s(v, 90)),
    personalityTraits: arr(p.personalityTraits, 3).map((v) => s(v, 70)),
    bestFor: arr(p.bestFor, 3).map((v) => s(v, 70)),
    avoidWhen: arr(p.avoidWhen, 3).map((v) => s(v, 70)),
  };
}

function cleanLabels(value: unknown): CleanPayload["labels"] | null {
  const keys = ["result", "match", "traits", "bestFor", "avoidWhen", "compatiblePersonas", "incompatiblePersonas", "pairPersonas"] as const;
  if (!value || typeof value !== "object") return null;
  return Object.fromEntries(keys.map((key) => [key, s((value as Record<string, unknown>)[key], 42)])) as CleanPayload["labels"];
}

const arr = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max) : []);
const s = (v: unknown, max = MAX_TEXT) => (typeof v === "string" ? v.slice(0, max) : "");
