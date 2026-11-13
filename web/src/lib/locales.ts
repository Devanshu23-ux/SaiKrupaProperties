/**
 * Pure locale constants — safe to import from client components.
 * Anything that touches the server (dictionaries, notFound) lives in i18n.ts.
 */
export const locales = ["en", "mr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Compact labels for the masthead language switcher. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  mr: "मराठी",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Swap the leading locale segment of a pathname, keeping the rest intact. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && hasLocale(segments[1])) {
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  }
  return `/${target}${pathname === "/" ? "" : pathname}`;
}
