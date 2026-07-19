"use client"

import { useEffect, useState } from "react"
import { getAuthUser, setAuthUser } from "@/lib/auth-client"
import { getMeApi } from "@/api/auth/api"

export function useAuthState() {
  const [user, setUser] = useState<ReturnType<typeof getAuthUser>>(null)

  useEffect(() => {
    const syncUser = () => setUser(getAuthUser())
    syncUser()
    getMeApi()
      .then((me) => {
        if (me) setAuthUser(me)
        setUser(me)
      })
      .catch(() => setUser(getAuthUser()))
    window.addEventListener("cafe-auth-change", syncUser)
    return () => window.removeEventListener("cafe-auth-change", syncUser)
  }, [])

  return { user, isLoggedIn: Boolean(user) }
}
