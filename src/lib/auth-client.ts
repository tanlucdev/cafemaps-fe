"use client"

import { AUTH_COOKIE_KEYS, AUTH_STORAGE_KEYS } from "@/constants/auth-keys"

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const secure = location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`
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
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, token)
  setCookie(AUTH_COOKIE_KEYS.accessToken, token)
}

export function clearAccessToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
  deleteCookie(AUTH_COOKIE_KEYS.accessToken)
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

export function logout() {
  clearAccessToken()
  clearAuthUser()
  dispatchAuthChange()
}

export async function getCurrentAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null
  const localToken = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  if (localToken) return localToken

  const cookieToken = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${AUTH_COOKIE_KEYS.accessToken}=`))
    ?.split("=")[1]

  return cookieToken ? decodeURIComponent(cookieToken) : null
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
