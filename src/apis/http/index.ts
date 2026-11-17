import { READ_REVALIDATE_SECONDS } from "@/apis/cafes/constants"
import { AUTH_COOKIE_KEYS, AUTH_STORAGE_KEYS } from "@/constants/auth-keys"

const DEFAULT_API_URL = "https://cafe-finder-be.onrender.com/api"
const configuredApiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
const serverApiUrl = configuredApiUrl ?? DEFAULT_API_URL
const isLocalApiUrl = Boolean(
  configuredApiUrl?.includes("localhost") || configuredApiUrl?.includes("127.0.0.1")
)
const BASE_URL =
  typeof window === "undefined"
    ? serverApiUrl
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
  allowEmptyResponse?: boolean
  timeoutMs?: number
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

function timeoutSignal(signal: AbortSignal | null | undefined, timeoutMs: number) {
  const controller = new AbortController()
  let timedOut = false
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const signals = signal ? [signal, controller.signal] : [controller.signal]
  return {
    signal: AbortSignal.any(signals),
    clear: () => clearTimeout(timeout),
    timedOut: () => timedOut,
  }
}

export async function apiFetch<T>(
  path: string,
  options?: NextRequestInit
): Promise<T> {
  const {
    fallback: _fallback,
    timeoutMs = API_TIMEOUT_MS,
    allowEmptyResponse = false,
    ...fetchOptions
  } = options ?? {}
  void _fallback
  const method = fetchOptions.method?.toUpperCase() ?? "GET"
  const isServer = typeof window === "undefined"
  const isFormData = typeof FormData !== "undefined" && fetchOptions.body instanceof FormData
  const isPublicRead =
    method === "GET" && !(fetchOptions.headers && "Authorization" in fetchOptions.headers)
  const useReadCache = isServer && isPublicRead && !isLocalApiUrl && fetchOptions.cache !== "no-store"
  const requestTimeout = timeoutSignal(fetchOptions.signal, timeoutMs)
  const headers = new Headers(storedAuthHeaders())
  new Headers(fetchOptions.headers).forEach((value, key) => headers.set(key, value))
  if (isFormData) headers.delete("Content-Type")
  else if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json")

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...(useReadCache
        ? {
            cache: "force-cache",
            next: {
              revalidate: READ_REVALIDATE_SECONDS,
              tags: ["cafes"],
              ...fetchOptions.next,
            },
          }
        : !isServer && isPublicRead
          ? { cache: "no-store" as const }
          : {}),
      ...fetchOptions,
      credentials: fetchOptions.credentials ?? "include",
      signal: requestTimeout.signal,
      headers,
    })
  } catch (error) {
    if (requestTimeout.timedOut()) throw new ApiError("API request timed out", 408)
    throw error
  } finally {
    requestTimeout.clear()
  }

  if (!res.ok) {
    throw new ApiError(`API error: ${res.status} ${res.statusText}`, res.status)
  }

  if (allowEmptyResponse) {
    const body = await res.text()
    return (body === "" ? null : JSON.parse(body)) as T
  }

  return res.json() as Promise<T>
}
