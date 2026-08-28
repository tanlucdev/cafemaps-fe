"use client"

import { useEffect, useState } from "react"
import { getAuthUser, refreshAuthUser } from "@/lib/auth-client"

export function useAuthState() {
  const [user, setUser] = useState<ReturnType<typeof getAuthUser>>(null)

  useEffect(() => {
    const syncUser = () => setUser(getAuthUser())
    syncUser()
    window.addEventListener("cafe-auth-change", syncUser)

    refreshAuthUser().then(setUser).catch(() => {})
    return () => window.removeEventListener("cafe-auth-change", syncUser)
  }, [])

  return { user, isLoggedIn: Boolean(user) }
}
