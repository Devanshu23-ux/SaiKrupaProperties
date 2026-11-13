"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  localeShort,
  locales,
  switchLocalePath,
  type Locale,
} from "@/lib/locales";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { WhatsAppIcon } from "./icons";

interface SiteHeaderProps {
  locale: Locale;
  nav: { home: string; what: string; projects: string; contact: string; visit: string };
  whatsappHref: string;
}

export function SiteHeader({ locale, nav, whatsappHref }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: `/${locale}`, label: nav.home },
    { href: `/${locale}#what`, label: nav.what },
    { href: `/${locale}#projects`, label: nav.projects },
    { href: `/${locale}#contact`, label: nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6 sm:pt-3">
      <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between gap-1.5 rounded-full border px-3 py-1.5 transition-all duration-300 sm:gap-3 sm:px-6 sm:py-2 ${
          scrolled || open
            ? "border-line bg-white/85 shadow-card backdrop-blur-xl"
            : "border-transparent bg-white/50 backdrop-blur-md"
        }`}
      >
        <Link href={`/${locale}`} className="flex min-w-0 shrink-0 items-center" aria-label={site.nameEn}>
          <Logo className="h-11 min-[380px]:h-12 sm:h-14" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-ink/80 transition-colors hover:bg-violet-soft hover:text-violet-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="flex items-center rounded-full bg-tint p-0.5 text-[11px] font-bold sm:p-1 sm:text-xs">
            {locales.map((code) => (
              <Link
                key={code}
                href={switchLocalePath(pathname, code)}
                aria-current={code === locale ? "true" : undefined}
                className={`rounded-full px-2.5 py-1.5 transition-colors sm:px-3 ${
                  code === locale
                    ? "bg-violet-deep text-white shadow"
                    : "text-muted hover:text-ink"
                }`}
              >
                {localeShort[code]}
              </Link>
            ))}
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:-translate-y-0.5 sm:px-5"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{nav.visit}</span>
          </a>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tint text-ink sm:h-10 sm:w-10 lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-auto mt-2 max-w-[1320px] rounded-3xl border border-line bg-white/95 p-3 shadow-card backdrop-blur-xl lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-base font-semibold text-ink hover:bg-violet-soft"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
