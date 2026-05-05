"use client"

const TOKEN_KEY = "cafe-access-token"
const USER_KEY = "cafe-auth-user"

export interface AuthUser {
  id: string
  email: string
  displayName: string | null
  role: string
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
}

export function setAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as AuthUser } catch { return null }
}

export function clearAuthUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem(USER_KEY)
}

export function logout() {
  clearAccessToken()
  clearAuthUser()
}

export async function getCurrentAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function saveAuthReturnUrl() {
  if (typeof window === "undefined") return
  sessionStorage.setItem("cafe-return-url", window.location.href)
}

export function getAuthReturnUrl(fallback: string) {
  if (typeof window === "undefined") return fallback

  const returnUrl = sessionStorage.getItem("cafe-return-url")
  if (!returnUrl) return fallback

  sessionStorage.removeItem("cafe-return-url")
  return returnUrl
}
