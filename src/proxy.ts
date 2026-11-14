import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_KEYS } from "./constants/auth-keys";
import { routing } from "./i18n/routing";
import { acceptsMarkdown } from "./lib/agent-content";

const intlMiddleware = createMiddleware(routing);
const GUARDED_PATHS = ["/contribute/owner"];
const GUEST_ONLY_PATHS = ["/login", "/register"];
const locales = routing.locales as readonly string[];
const PUBLIC_FILE = /\.(?:avif|css|gif|ico|jpg|jpeg|js|json|map|mp4|png|svg|txt|webp|woff2?|xml)$/i;
const NOT_FOUND_HTML = `<!doctype html>
<html lang="vi">
  <head><meta charset="utf-8"><title>404 - Cafe Maps</title></head>
  <body>
    <main>
      <h1>Không tìm thấy trang</h1>
      <p>Đường dẫn này không tồn tại hoặc đã được di chuyển.</p>
      <pre># Cafe Maps 404

- [Trang chủ](https://cafemaps.net/vi)
- [Sitemap](https://cafemaps.net/sitemap.xml)
- [Hướng dẫn tác nhân](https://cafemaps.net/llms.txt)</pre>
    </main>
  </body>
</html>`;
const LOCALIZED_ROUTE_PREFIXES = [
  "/about",
  "/blog",
  "/cafe",
  "/client",
  "/contribute",
  "/forgot-password",
  "/home2",
  "/login",
  "/map",
  "/profile",
  "/quiz",
  "/register",
  "/reset-password",
  "/saved",
  "/search",
];

function stripLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

function getLocale(pathname: string) {
  return (
    routing.locales.find(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    ) ?? routing.defaultLocale
  );
}

function matchesPath(pathname: string, paths: string[]) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function getDuplicateLocaleRedirectPath(pathname: string) {
  const segments = pathname.split("/");
  const [firstLocale, secondLocale] = segments.slice(1, 3);
  if (!locales.includes(firstLocale) || !locales.includes(secondLocale)) return null;
  const rest = segments.slice(3).join("/");
  return rest ? `/${firstLocale}/${rest}` : `/${firstLocale}`;
}

function isKnownUnlocalizedPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    LOCALIZED_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  );
}

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/api-proxy")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/agent-markdown") return NextResponse.next();

  const strippedPath = stripLocale(pathname);
  if (
    strippedPath === pathname &&
    (pathname.startsWith("/_next/") ||
      pathname.startsWith("/image/") ||
      pathname.startsWith("/mock/") ||
      PUBLIC_FILE.test(pathname))
  ) {
    return NextResponse.next();
  }

  if (
    strippedPath !== pathname &&
    (strippedPath.startsWith("/_next/") ||
      strippedPath.startsWith("/image/") ||
      strippedPath.startsWith("/mock/") ||
      PUBLIC_FILE.test(strippedPath))
  ) {
    const assetUrl = request.nextUrl.clone();
    assetUrl.pathname = strippedPath;
    return NextResponse.rewrite(assetUrl);
  }

  if (acceptsMarkdown(request.headers.get("accept"))) {
    const markdownUrl = request.nextUrl.clone();
    markdownUrl.pathname = "/agent-markdown";
    markdownUrl.search = "";
    markdownUrl.searchParams.set("path", pathname);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-agent-path", pathname);
    return NextResponse.rewrite(markdownUrl, {
      request: { headers: requestHeaders },
    });
  }

  if (
    strippedPath === pathname &&
    pathname !== "/" &&
    !isKnownUnlocalizedPath(pathname) &&
    !pathname.startsWith("/api/") &&
    !PUBLIC_FILE.test(pathname)
  ) {
    return new NextResponse(NOT_FOUND_HTML, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        Vary: "Accept, Accept-Encoding",
      },
    });
  }

  const duplicateLocaleRedirectPath = getDuplicateLocaleRedirectPath(pathname);
  if (duplicateLocaleRedirectPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = duplicateLocaleRedirectPath;
    return NextResponse.redirect(redirectUrl);
  }

  const checksAuth =
    matchesPath(strippedPath, GUARDED_PATHS) || matchesPath(strippedPath, GUEST_ONLY_PATHS);
  const isAuthenticated =
    checksAuth && Boolean(request.cookies.get(AUTH_COOKIE_KEYS.accessToken)?.value);

  if (matchesPath(strippedPath, GUARDED_PATHS) && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${getLocale(pathname)}/login`;
    loginUrl.searchParams.set("returnUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (matchesPath(strippedPath, GUEST_ONLY_PATHS) && isAuthenticated) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = `/${getLocale(pathname)}`;
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
