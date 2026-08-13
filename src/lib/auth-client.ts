"use client"

import { AUTH_COOKIE_KEYS, AUTH_STORAGE_KEYS } from "@/constants/auth-keys"
import { getMeApi, logoutApi } from "@/api/auth/api"

export interface AuthUser {
  id: string
  email: string
  displayName: string | null
  avatarUrl?: string | null
  role: string
}

let meRequest: Promise<AuthUser | null> | null = null
let authProbeFailed = false

function hasLocalAuthSignal() {
  if (typeof window === "undefined") return false
  return Boolean(
    localStorage.getItem(AUTH_STORAGE_KEYS.accessToken) ||
      localStorage.getItem(AUTH_STORAGE_KEYS.user)
  )
}

export function dispatchAuthChange() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event("cafe-auth-change"))
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return
  authProbeFailed = false
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, token)
}

export function clearAccessToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
}

export function setAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return
  authProbeFailed = false
  localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user))
  dispatchAuthChange()
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.user)
  if (!raw) return null
  try { return JSON.parse(raw) as AuthUser } catch { return null }
}

export function clearAuthUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_STORAGE_KEYS.user)
}

export async function refreshAuthUser(): Promise<AuthUser | null> {
  if (typeof window === "undefined" || authProbeFailed || !hasLocalAuthSignal()) return null
  if (meRequest) return meRequest

  meRequest = getMeApi()
    .then((user) => {
      if (user) {
        setAuthUser(user)
        return user
      }
      authProbeFailed = true
      clearAuthUser()
      return null
    })
    .catch((error) => {
      const status = error instanceof Error ? (error as Error & { status?: number }).status : undefined
      if (!status || ![401, 403].includes(status)) throw error
      authProbeFailed = true
      clearAccessToken()
      clearAuthUser()
      return null
    })
    .finally(() => {
      meRequest = null
    })

  return meRequest
}

export async function logout() {
  try {
    await logoutApi()
  } catch {}
  clearAccessToken()
  clearAuthUser()
  authProbeFailed = true
  dispatchAuthChange()
}

export async function getCurrentAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  if (token) return token
  if (!hasLocalAuthSignal()) return null
  try {
    return (await refreshAuthUser()) ? AUTH_COOKIE_KEYS.accessToken : null
  } catch {
    return null
  }
}

export function saveAuthReturnUrl() {
  if (typeof window === "undefined") return
  sessionStorage.setItem(AUTH_STORAGE_KEYS.returnUrl, window.location.href)
}

function toSameOriginPath(value: string | null | undefined, fallback: string) {
  if (typeof window === "undefined") return fallback
  if (!value) return fallback

  try {
    const url = new URL(value, window.location.origin)
    if (url.origin !== window.location.origin) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

export function getAuthReturnUrl(fallback: string, explicitReturnUrl?: string | null) {
  if (typeof window === "undefined") return fallback

  const returnUrl = explicitReturnUrl ?? sessionStorage.getItem(AUTH_STORAGE_KEYS.returnUrl)
  if (!returnUrl) return fallback

  sessionStorage.removeItem(AUTH_STORAGE_KEYS.returnUrl)
  return toSameOriginPath(returnUrl, fallback)
}

export function redirectAfterAuth(returnUrl: string) {
  if (typeof window === "undefined") return
  window.location.replace(toSameOriginPath(returnUrl, "/"))
}
