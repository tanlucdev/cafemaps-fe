import { apiFetch } from "@/apis/http"

export async function loginUser(email: string, password: string): Promise<{ token: string }> {
  return apiFetch<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function registerUser(
  email: string,
  password: string
): Promise<{ token?: string; message?: string }> {
  return apiFetch<{ token?: string; message?: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}
