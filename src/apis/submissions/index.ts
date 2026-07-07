import { apiFetch } from "@/apis/http"

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
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  })
}
