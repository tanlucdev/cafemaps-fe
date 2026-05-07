"use client"

const TOKEN_KEY = "cafe-access-token"
const USER_KEY = "cafe-auth-user"
const AUTH_COOKIE = "cafe-auth-token"

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

export interface AuthUser {
  id: string
  email: string
  displayName: string | null
  role: string
}

export function dispatchAuthChange() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event("cafe-auth-change"))
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
  setCookie(AUTH_COOKIE, token)
}

export function clearAccessToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  deleteCookie(AUTH_COOKIE)
}

export function setAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  dispatchAuthChange()
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
  dispatchAuthChange()
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
