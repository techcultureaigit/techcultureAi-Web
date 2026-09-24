/**
 * Optional host-based rewrite sketch for a future subdomain.
 *
 * Example:
 *   webdev.techculture.ai  →  same Next app
 *   NEXT_PUBLIC_WEBDEV_BASE_PATH=""
 *
 * Uncomment and adjust hosts when you are ready to go live.
 *
 * import { NextResponse } from "next/server";
 *
 * const WEBDEV_HOSTS = new Set(["webdev.techculture.ai", "webdev.localhost"]);
 *
 * export function middleware(request) {
 *   const host = request.headers.get("host")?.split(":")[0];
 *   if (!WEBDEV_HOSTS.has(host)) return NextResponse.next();
 *
 *   const { pathname } = request.nextUrl;
 *   if (pathname.startsWith("/webdevelopment-ai")) return NextResponse.next();
 *   if (
 *     pathname.startsWith("/_next") ||
 *     pathname.startsWith("/api") ||
 *     pathname.includes(".")
 *   ) {
 *     return NextResponse.next();
 *   }
 *
 *   const url = request.nextUrl.clone();
 *   url.pathname =
 *     pathname === "/"
 *       ? "/webdevelopment-ai"
 *       : `/webdevelopment-ai${pathname}`;
 *   return NextResponse.rewrite(url);
 * }
 *
 * export const config = {
 *   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
 * };
 */

export {};
