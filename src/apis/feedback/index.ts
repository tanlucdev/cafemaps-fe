import { apiFetch } from "@/apis/http";

export interface CreateFeedbackInput {
  type: "content";
  message: string;
  cafeId?: string;
  pageUrl: string;
}

export type Feedback = Record<string, unknown>;

export function createFeedback(data: CreateFeedbackInput) {
  return apiFetch<Feedback>("/feedback", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
