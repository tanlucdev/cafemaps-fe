import { READ_REVALIDATE_SECONDS } from "@/apis/cafes/constants"
import { AUTH_COOKIE_KEYS, AUTH_STORAGE_KEYS } from "@/constants/auth-keys"

const DEFAULT_API_URL = "https://cafe-finder-be.onrender.com/api"
const BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL)
    : "/api-proxy"
const API_TIMEOUT_MS = 12000

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export type NextRequestInit = RequestInit & {
  next?: {
    revalidate?: number
    tags?: string[]
  }
  fallback?: boolean
}

export function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && (error.status === 401 || error.status === 403)
}

export function authHeaders(token: string): HeadersInit | undefined {
  return token === AUTH_COOKIE_KEYS.accessToken ? undefined : { Authorization: `Bearer ${token}` }
}

function storedAuthHeaders(): HeadersInit | undefined {
  if (typeof window === "undefined") return undefined
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

export async function apiFetch<T>(
  path: string,
  options?: NextRequestInit
): Promise<T> {
  const { fallback: _fallback, ...fetchOptions } = options ?? {}
  void _fallback
  const method = fetchOptions.method?.toUpperCase() ?? "GET"
  const isPublicRead =
    method === "GET" && !(fetchOptions.headers && "Authorization" in fetchOptions.headers)
  const useReadCache = isPublicRead && fetchOptions.cache !== "no-store"
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  const res = await fetch(`${BASE_URL}${path}`, {
    ...(useReadCache
      ? {
          cache: "force-cache",
          next: {
            revalidate: READ_REVALIDATE_SECONDS,
            tags: ["cafes"],
            ...fetchOptions.next,
          },
        }
      : {}),
    ...fetchOptions,
    credentials: fetchOptions.credentials ?? "include",
    signal: fetchOptions.signal ?? controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...storedAuthHeaders(),
      ...fetchOptions.headers,
    },
  }).finally(() => clearTimeout(timeout))

  if (!res.ok) {
    throw new ApiError(`API error: ${res.status} ${res.statusText}`, res.status)
  }

  return res.json() as Promise<T>
}
