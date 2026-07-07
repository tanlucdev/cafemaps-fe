"use client"

import { useEffect, useState } from "react"
import { getAuthUser } from "@/lib/auth-client"

export function useAuthState() {
  const [user, setUser] = useState(() => getAuthUser())

  useEffect(() => {
    const syncUser = () => setUser(getAuthUser())
    syncUser()
    window.addEventListener("cafe-auth-change", syncUser)
    return () => window.removeEventListener("cafe-auth-change", syncUser)
  }, [])

  return { user, isLoggedIn: Boolean(user) }
}
