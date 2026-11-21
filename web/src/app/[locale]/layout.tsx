import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Poppins } from "next/font/google";
import "../globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/smooth-scroll";
import { getCopy } from "@/lib/copy";
import { hasLocale, locales } from "@/lib/locales";
import { googleReview, site, socialLinks, whatsappLink } from "@/lib/site";

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
    metadataBase: new URL(site.url),
    title: { default: c.meta.title, template: c.meta.template },
    description: c.meta.description,
    keywords: [
      "Plots in Bhor Pune",
      "Industrial plots Shivare",
      "Shivare industrial land",
      "Yevali plots Bhor",
      "Plots in Bhor taluka",
      "Sai Krupa Properties",
      "The Sai Krupa Group",
      "Saikrupa Crane Services",
      "Saikrupa Laser",
      "Saikrupa Tube Cutting",
      "Aaryans Riverwood Resort",
      "Saikrupa Cryogenic Gases",
      "Bhairavnath Transport and Company",
      "Velu Electrical",
      "Land in Shivare Pune",
      "Riverside plots Yevali",
      "Industrial plots Pune Bangalore Highway",
      "Warehousing and NA plots Bhor Pune",
    ],
    authors: [{ name: site.nameEn }],
    creator: site.nameEn,
    publisher: site.nameEn,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        mr: "/mr",
      },
    },
    openGraph: {
      title: c.meta.title,
      description: c.meta.description,
      url: `${site.url}/${locale}`,
      siteName: site.nameEn,
      locale: locale === "mr" ? "mr_IN" : "en_IN",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 600,
          alt: site.nameEn,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.title,
      description: c.meta.description,
      creator: "@saikrupapro09",
    },
    verification: {
      google: "016b3f412fc4cddf",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const c = getCopy(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.nameEn,
    alternateName: site.nameMr,
    url: site.url,
    telephone: `+91${site.phone}`,
    logo: `${site.url}/logo.png`,
    description:
      "Sai Krupa Properties develops numbered, measured plots in Bhor taluka, Pune — industrial plots at Shivare and riverside plots at Yevali along the Pune-Bangalore Highway corridor.",
    areaServed: [
      { "@type": "AdministrativeArea", "name": "Pune" },
      { "@type": "AdministrativeArea", "name": "Bhor" },
      { "@type": "AdministrativeArea", "name": "Shivare" },
      { "@type": "AdministrativeArea", "name": "Yevali" },
      { "@type": "AdministrativeArea", "name": "Maharashtra" },
    ],
    sameAs: [
      ...socialLinks.map((s) => s.url),
      googleReview.profileUrl,
    ],
    parentOrganization: {
      "@type": "Organization",
      name: "The Sai Krupa Group",
      alternateName: "साई कृपा उद्योग समूह",
      subOrganization: [
        { "@type": "Organization", name: "Saikrupa Crane Services" },
        { "@type": "Organization", name: "Saikrupa Laser" },
        { "@type": "Organization", name: "Saikrupa Tube Cutting" },
        { "@type": "LodgingBusiness", name: "Aaryans Riverwood Resort" },
        { "@type": "Organization", name: "Saikrupa Cryogenic Gases" },
        { "@type": "Organization", name: "Bhairavnath Transport & Company" },
        { "@type": "Organization", name: "Velu Electrical" },
      ],
    },
  };

  return (
    <html lang={locale} className={`${poppins.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
