import apiClient from "../axios"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: { id: string; email: string; displayName: string | null; role: string; createdAt: string }
}

export interface RegisterPayload {
  email: string
  password: string
}

export interface RegisterResponse {
  token?: string
  user?: { id: string; email: string; displayName: string | null; role: string; createdAt: string }
  message?: string
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload)
  return data
}

export async function registerApi(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>(
    "/auth/register",
    payload
  )
  return data
}
