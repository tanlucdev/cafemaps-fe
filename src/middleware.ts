import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"
import { routing } from "@/i18n/routing"

const intlMiddleware = createMiddleware(routing)

// Routes yêu cầu đăng nhập
const GUARDED_PATHS = ["/saved", "/contribute"]

// Routes chỉ dành cho chưa đăng nhập (đã đăng nhập → redirect home)
const UNGUARDED_AUTH_PATHS = ["/login", "/register"]

function isGuarded(pathname: string) {
  return GUARDED_PATHS.some((p) => pathname.endsWith(p) || pathname.includes(p + "/"))
}

function isUnguardedAuth(pathname: string) {
  return UNGUARDED_AUTH_PATHS.some((p) => pathname.endsWith(p) || pathname.includes(p + "/"))
}

// Tách locale prefix ra khỏi pathname, e.g. /vi/saved → /saved
function stripLocale(pathname: string, locales: readonly string[]) {
  for (const locale of locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/"
    }
  }
  return pathname
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("cafe-auth-token")?.value
  const isAuthenticated = Boolean(token)

  const strippedPath = stripLocale(pathname, routing.locales)

  if (isGuarded(strippedPath) && !isAuthenticated) {
    // Lưu URL muốn vào để redirect lại sau khi login
    const loginUrl = request.nextUrl.clone()
    // Detect locale từ pathname
    const locale =
      routing.locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) ??
      routing.defaultLocale
    loginUrl.pathname = `/${locale}/login`
    loginUrl.searchParams.set("returnUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isUnguardedAuth(strippedPath) && isAuthenticated) {
    const homeUrl = request.nextUrl.clone()
    const locale =
      routing.locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) ??
      routing.defaultLocale
    homeUrl.pathname = `/${locale}`
    homeUrl.search = ""
    return NextResponse.redirect(homeUrl)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}
