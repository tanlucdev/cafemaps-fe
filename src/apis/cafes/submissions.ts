import type { Cafe } from "@/types/cafe"
import { apiFetch } from "@/apis/http"

export async function submitCafe(data: Partial<Cafe>, token: string): Promise<Cafe> {
  return apiFetch<Cafe>("/cafes/submit", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  })
}
