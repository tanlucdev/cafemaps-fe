import type { LocalizedQuizProfile, QuizResultVariant } from "@/types/quiz";

export type QuizResultImagePayload = {
  format: "desktop" | "mobile";
  variant: QuizResultVariant;
  scale?: 1 | 2;
  result: {
    profile: LocalizedQuizProfile;
    score: number;
    dna: string;
    chips: string[];
  };
  profiles: LocalizedQuizProfile[];
  labels: {
    result: string;
    match: string;
    traits: string;
    bestFor: string;
    avoidWhen: string;
    compatiblePersonas: string;
    incompatiblePersonas: string;
    pairPersonas: string;
  };
};

export async function downloadQuizResultImage(locale: string, payload: QuizResultImagePayload) {
  const response = await fetch(`/${locale}/quiz/result-image`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to render result image");
  return response.blob();
}
