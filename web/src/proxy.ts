import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Locale routing.
 * Kept deliberately self-contained — Proxy must not depend on app modules.
 * (Next 16 renamed `middleware` to `proxy`.)
 */
const locales = ["en", "mr"] as const;
const defaultLocale = "en";

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .filter(Boolean);

  for (const language of preferred) {
    const base = language.split("-")[0];
    if ((locales as readonly string[]).includes(base)) return base;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const alreadyLocalised = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (alreadyLocalised) return;

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpe?g|svg|webp|avif|ico|mp4|webm|glb|gltf|txt|xml|json|woff2?)$).*)",
  ],
};
