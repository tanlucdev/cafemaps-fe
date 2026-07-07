export { default } from "./proxy"

export const config = {
  matcher: ["/((?!api|api-proxy|_next/webpack-hmr).*)"],
}
