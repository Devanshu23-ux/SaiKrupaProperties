import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Poppins } from "next/font/google";
import "../globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { getCopy } from "@/lib/copy";
import { hasLocale, locales } from "@/lib/locales";
import { whatsappLink } from "@/lib/site";

/** One family for everything — Poppins covers both Devanagari and Latin. */
const poppins = Poppins({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

/** Full-width layout on every phone; fill the notch area on iPhones (Safari). */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f9faf8",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const c = getCopy(locale);
  return {
    title: { default: c.meta.title, template: c.meta.template },
    description: c.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const c = getCopy(locale);

  return (
    <html lang={locale} className={`${poppins.variable} antialiased`}>
      <body className="min-h-svh bg-canvas text-ink">
        <noscript>
          <style>{`.reveal-init{opacity:1 !important}`}</style>
        </noscript>

        <SmoothScroll />
        <SiteHeader
          locale={locale}
          nav={c.nav}
          whatsappHref={whatsappLink(c.cta.message)}
        />

        <main>{children}</main>

        <SiteFooter locale={locale} copy={c} />
      </body>
    </html>
  );
}
