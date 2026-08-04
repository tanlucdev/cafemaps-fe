"use client"

import { useEffect, useState } from "react"
import { AUTH_STORAGE_KEYS } from "@/constants/auth-keys"
import { clearAuthUser, getAuthUser, setAuthUser } from "@/lib/auth-client"
import { getMeApi } from "@/api/auth/api"

export function useAuthState() {
  const [user, setUser] = useState<ReturnType<typeof getAuthUser>>(null)

  useEffect(() => {
    const syncUser = () => setUser(getAuthUser())
    syncUser()
    window.addEventListener("cafe-auth-change", syncUser)
    if (localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)) {
      getMeApi()
        .then((me) => {
          if (me) setAuthUser(me)
          setUser(me)
        })
        .catch(() => setUser(getAuthUser()))
    } else {
      clearAuthUser()
      setUser(null)
    }
    return () => window.removeEventListener("cafe-auth-change", syncUser)
  }, [])

  return { user, isLoggedIn: Boolean(user) }
}
