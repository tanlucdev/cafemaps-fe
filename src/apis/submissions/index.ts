import { apiFetch, authHeaders } from "@/apis/http"

export interface CreateSubmissionInput {
  name: string
  address?: string
  googleMapsUrl?: string
  note?: string
}

export interface CafeSubmission {
  id: string
  submittedById?: string | null
  name: string
  address?: string | null
  googleMapsUrl?: string | null
  note?: string | null
  reviewNote?: string | null
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export async function createSubmission(data: CreateSubmissionInput, token: string) {
  return apiFetch<CafeSubmission>("/submissions", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}
