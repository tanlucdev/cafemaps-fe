"use client"

import { useEffect, useState } from "react"
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys"
import { clearAuthUser, getAuthUser, refreshAuthUser } from "@/lib/auth-client"

export function useAuthState() {
  const [user, setUser] = useState<ReturnType<typeof getAuthUser>>(null)

  useEffect(() => {
    const syncUser = () => setUser(getAuthUser())
    syncUser()
    window.addEventListener("cafe-auth-change", syncUser)
    const cachedUser = getAuthUser()
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
    if (!token && !cachedUser) return () => window.removeEventListener("cafe-auth-change", syncUser)

    refreshAuthUser()
      .then((me) => {
        setUser(me)
      })
      .catch((error) => {
        const status = error instanceof Error ? (error as Error & { status?: number }).status : undefined
        if (!status || ![401, 403].includes(status)) return
        localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
        clearAuthUser()
        setUser(null)
      })
    return () => window.removeEventListener("cafe-auth-change", syncUser)
  }, [])

  return { user, isLoggedIn: Boolean(user) }
}
