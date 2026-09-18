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
  createdCafeId?: string | null
  name: string
  address?: string | null
  googleMapsUrl?: string | null
  note?: string | null
  reviewNote?: string | null
  status: "pending" | "approved" | "rejected"
  createdAt: string
  createdCafe?: {
    id: string
    name: string
    slug: string
    address?: string | null
    district?: string | null
    coverImage?: string | null
    isPublished?: boolean
  } | null
}

export async function createSubmission(data: CreateSubmissionInput, token: string) {
  return apiFetch<CafeSubmission>("/submissions", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

export async function getMySubmissions(token: string): Promise<CafeSubmission[]> {
  try {
    return await apiFetch<CafeSubmission[]>("/submissions/me", {
      cache: "no-store",
      headers: authHeaders(token),
    })
  } catch {
    return []
  }
}
