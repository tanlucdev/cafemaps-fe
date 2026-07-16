"use client"

import { AUTH_COOKIE_KEYS, AUTH_STORAGE_KEYS } from "@/constants/auth-keys"
import { getMeApi, logoutApi } from "@/api/auth/api"

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
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, token)
}

export function clearAccessToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
}

export function setAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return
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

export async function logout() {
  try {
    await logoutApi()
  } catch {}
  clearAccessToken()
  clearAuthUser()
  dispatchAuthChange()
}

export async function getCurrentAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  if (token) return token
  if (getAuthUser()) return AUTH_COOKIE_KEYS.accessToken
  try {
    const user = await getMeApi()
    if (!user) return null
    setAuthUser(user)
    return AUTH_COOKIE_KEYS.accessToken
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
