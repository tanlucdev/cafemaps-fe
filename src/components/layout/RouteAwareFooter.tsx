"use client"

import { usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import Footer from "./Footer"

function getPathWithoutLocale(pathname: string) {
  const parts = pathname.split("/").filter(Boolean)

  if ((routing.locales as readonly string[]).includes(parts[0])) {
    return `/${parts.slice(1).join("/")}`
  }

  return pathname
}

function isCafeDetailPath(pathname: string) {
  const normalizedPath = getPathWithoutLocale(pathname).replace(/\/+$/, "")
  const parts = normalizedPath.split("/").filter(Boolean)

  return parts.length === 2 && parts[0] === "cafe" && Boolean(parts[1])
}

export default function RouteAwareFooter() {
  const pathname = usePathname()
  const normalizedPath = getPathWithoutLocale(pathname).replace(/\/+$/, "")

  if (isCafeDetailPath(pathname)) return null
  if (normalizedPath === "/quiz") return null

  return <Footer />
}
