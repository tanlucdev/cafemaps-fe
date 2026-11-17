"use client"

import { useEffect, useState } from "react"
import { getAuthUser, refreshAuthUser } from "@/lib/auth-client"

export function useAuthState() {
  const [user, setUser] = useState<ReturnType<typeof getAuthUser>>(null)
  const [sessionHint, setSessionHint] = useState(false)
  const [isAuthPending, setIsAuthPending] = useState(true)

  useEffect(() => {
    let active = true
    const syncUser = () => {
      const nextUser = getAuthUser()
      setUser(nextUser)
      setSessionHint(Boolean(nextUser))
      setIsAuthPending(false)
    }
    const refresh = () => {
      const cachedUser = getAuthUser()
      if (cachedUser) {
        setUser(cachedUser)
        setSessionHint(true)
      }

      refreshAuthUser()
        .then((nextUser) => {
          if (!active) return
          setUser(nextUser)
          setSessionHint(Boolean(nextUser))
          setIsAuthPending(false)
        })
        .catch(() => {})
    }
    const refreshOnVisible = () => {
      if (document.visibilityState === "visible") refresh()
    }

    window.addEventListener("cafe-auth-change", syncUser)
    window.addEventListener("focus", refresh)
    document.addEventListener("visibilitychange", refreshOnVisible)
    refresh()
    return () => {
      active = false
      window.removeEventListener("cafe-auth-change", syncUser)
      window.removeEventListener("focus", refresh)
      document.removeEventListener("visibilitychange", refreshOnVisible)
    }
  }, [])

  return { user, isAuthPending, isLoggedIn: Boolean(user) || sessionHint }
}
