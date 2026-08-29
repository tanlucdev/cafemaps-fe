import { apiFetch } from "@/apis/http"

export type FeedbackType = "idea" | "bug" | "content" | "other"

export interface CreateFeedbackInput {
  type: FeedbackType
  message: string
  contactEmail?: string
  pageUrl?: string
  cafeId?: string | null
}

export function createFeedback(data: CreateFeedbackInput) {
  return apiFetch<{ id: string; status: "new" }>("/feedback", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
