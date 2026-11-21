import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AreaConverter } from "@/components/area-converter";
import { Gallery } from "@/components/gallery";
import { ArrowIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { MiniPlan } from "@/components/mini-plan";
import { PlotExplorer } from "@/components/plot-explorer";
import { Reveal } from "@/components/reveal";
import { getCopy } from "@/lib/copy";
import { hasLocale, locales } from "@/lib/locales";
import { getLayout } from "@/lib/plots";
import {
  getProject,
  pick,
  projectHighlights,
  projectIntro,
  projectName,
  projectTag,
  projectVillage,
  projects,
} from "@/lib/projects";
import { digits, projectStats } from "@/lib/stats";
import { projectEnquiry } from "@/lib/enquiry";
import { site, telLink, whatsappLink } from "@/lib/site";

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(locale) || !project) return {};

  const name = projectName(project, locale);
  const intro = projectIntro(project, locale);

  const isShivare = slug === "shivare";
  const title =
    locale === "mr"
      ? isShivare
        ? "शिंवरे येथील इंडस्ट्रियल प्लॉट्स — भोर, पुणे | साई कृपा प्रॉपर्टीज"
        : "येवली येथील निसर्गरम्य प्लॉट्स — निरा नदीकाठ, भोर | साई कृपा प्रॉपर्टीज"
      : isShivare
        ? "Property in Shivare — Industrial Plots in Bhor, Pune | Sai Krupa Properties"
        : "Property in Yevali — Riverside Plots in Bhor, Pune | Sai Krupa Properties";

  const keywords = isShivare
    ? [
        "Property in Shivare",
        "Shivare industrial plots",
        "Industrial plots in Bhor Pune",
        "Land in Shivare",
        "Plots in Shivare Pune Bangalore Highway",
        "Gat 198 Shivare",
        "Commercial plots Shivare",
        "Sai Krupa Properties Shivare",
      ]
    : [
        "Property in Yevali",
        "Yevali riverside plots",
        "Plots in Yevali Bhor",
        "Land in Yevali Pune",
        "Nira river plots Bhor",
        "Plots near Shirwal Bhor",
        "Residential and farm plots Yevali",
        "Sai Krupa Properties Yevali",
      ];

  const pageUrl = `${site.url}/${locale}/projects/${slug}`;

  return {
    title,
    description: intro,
    keywords,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${site.url}/en/projects/${slug}`,
        mr: `${site.url}/mr/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description: intro,
      url: pageUrl,
      siteName: site.nameEn,
      type: "website",
      images: [
        {
          url: project.cover,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: intro,
      images: [project.cover],
    },
  };
}

const THEME = {
  sunset: {
    hero: "bg-[linear-gradient(135deg,#b07a46_0%,#a96f69_55%,#5f7fa0_100%)]",
    soft: "bg-sunset-soft",
    text: "text-sunset-deep",
  },
  river: {
    hero: "bg-[linear-gradient(135deg,#3f8796_0%,#5f7fa0_60%,#7b86ad_100%)]",
    soft: "bg-river-soft",
    text: "text-river-deep",
  },
} as const;

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const project = getProject(slug);
  if (!project) notFound();

  const c = getCopy(locale);
  const t = c.project;
  const theme = THEME[project.accent];
  const stats = projectStats(project, locale);
  const layout = getLayout(project.slug);
  const name = projectName(project, locale);

  const enquiry = projectEnquiry(locale, name);
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${project.coordinates.lat},${project.coordinates.lng}`;

  const reach =
    project.slug === "shivare"
      ? t.shivareReach.replace("{m}", digits(String(Math.round((layout.accessLengthM ?? 0) / 10) * 10), locale))
      : t.yevaliReach;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    description: projectIntro(project, locale),
    address: {
      "@type": "PostalAddress",
      addressLocality: projectVillage(project, locale),
      addressRegion: "Maharashtra",
      postalCode: project.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: project.coordinates.lat,
      longitude: project.coordinates.lng,
    },
    url: `${site.url}/${locale}/projects/${slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ───────── Hero ───────── */}
      <header className={`relative isolate overflow-hidden ${theme.hero} text-white`}>
        <div aria-hidden="true" className="dots absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Link
              href={`/${locale}#projects`}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur transition-colors hover:bg-white/30"
            >
              <ArrowIcon className="h-4 w-4 rotate-180" />
              {t.back}
            </Link>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-ink">
              <PinIcon className="h-4 w-4 text-pink-deep" />
              {projectVillage(project, locale)}
            </p>
            <h1 className="mt-4 text-[clamp(2.2rem,5.4vw,4.2rem)] font-extrabold leading-[1.05] tracking-tight">{name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">{projectTag(project, locale)}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink(enquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-ink shadow-xl transition-transform hover:-translate-y-1"
              >
                <WhatsAppIcon className="h-5 w-5 text-lime-deep" />
                {c.cta.whatsapp}
              </a>
              <a
                href={telLink}
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/80 px-7 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-white hover:text-ink"
              >
                <PhoneIcon className="h-5 w-5" />
                {site.phoneDisplay}
              </a>
            </div>

            <dl className="mt-8 grid max-w-xl grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
              {[
                { l: c.projects.plots, v: String(stats.plotCount) },
                { l: c.projects.sizes, v: stats.sizeRange },
                { l: c.projects.roads, v: stats.roads },
              ].map((s) => (
                <div key={s.l} className="min-w-0 rounded-2xl bg-white/20 p-3 backdrop-blur sm:p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-white/80">{s.l}</dt>
                  <dd className="mt-1 text-sm font-extrabold leading-snug sm:text-lg">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
            <div className="absolute inset-0 rotate-3 rounded-[2.5rem] bg-white/25" />
            <div className="absolute inset-0 -rotate-2 overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
              <Image src={project.cover} alt="" fill priority sizes="(min-width: 1024px) 36vw, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              <MiniPlan
                slug={project.slug}
                className="absolute bottom-3 right-3 h-[58%] w-[58%] rounded-3xl bg-white/85 p-3 shadow-xl backdrop-blur"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ───────── At a glance ───────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.7rem)] font-extrabold tracking-tight">{t.overview}</h2>
            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted">{projectIntro(project, locale)}</p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <dl className="grid h-full gap-3 sm:grid-cols-2">
                {project.facts.map((f) => (
                  <div key={f.en} className="rounded-3xl bg-white p-5 shadow-card">
                    <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
                      {pick(f, locale)}
                      {f.stated && (
                        <span className="rounded-full bg-sun-soft px-2 py-0.5 text-[10px] normal-case tracking-normal text-ink">
                          {t.stated}
                        </span>
                      )}
                    </dt>
                    <dd className="mt-1.5 text-lg font-extrabold leading-snug">{locale === "mr" ? f.valueMr : f.valueEn}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <div className={`h-full rounded-[2rem] p-7 ${theme.soft}`}>
                <ul className="space-y-4">
                  {projectHighlights(project, locale).map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] font-semibold leading-snug">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-sm font-extrabold text-lime-deep shadow">
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── Explorer ───────── */}
      <section id="explore" className="scroll-mt-24 bg-tint py-16 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.7rem)] font-extrabold tracking-tight">{t.explore}</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">{t.exploreNote}</p>
          </Reveal>
          <div className="mt-8">
            <PlotExplorer
              slug={project.slug}
              projectName={name}
              copy={c}
              pricePerGuntha={project.pricePerGuntha}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {/* ───────── Location ───────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className={`text-sm font-bold uppercase tracking-[0.2em] ${theme.text}`}>{t.location}</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.6vw,2.7rem)] font-extrabold tracking-tight">{t.howToReach}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{reach}</p>
            <p className="mt-4 text-sm font-semibold text-ink/70">{t.docs}</p>
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand mt-7 inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-violet/30 transition-transform hover:-translate-y-1"
            >
              <PinIcon className="h-5 w-5" />
              {t.openMap}
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-tint shadow-card">
              {project.slug === "shivare" ? (
                <Image src="/media/shivare/nh48-corridor.jpg" alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
              ) : (
                <Image src="/media/yevali/nira-bank.jpg" alt="" fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── Gallery ───────── */}
      <section className="bg-tint py-16 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.7rem)] font-extrabold tracking-tight">{t.gallery}</h2>
            <p className="mt-3 text-base text-muted">{t.galleryNote}</p>
          </Reveal>
          <div className="mt-8">
            <Gallery items={project.media} locale={locale} />
          </div>
        </div>
      </section>

      {/* ───────── Converter + CTA ───────── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <AreaConverter copy={c} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-brand relative flex h-full flex-col justify-center overflow-hidden rounded-[2rem] p-8 text-white sm:p-10">
              <div aria-hidden="true" className="dots absolute inset-0 opacity-50" />
              <div className="relative">
                <h3 className="text-3xl font-extrabold leading-tight">{c.cta.title}</h3>
                <p className="mt-3 text-white/90">{c.cta.sub}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={telLink} className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-sm font-extrabold text-ink shadow-xl transition-transform hover:-translate-y-1">
                    <PhoneIcon className="h-5 w-5" />
                    {site.phoneDisplay}
                  </a>
                  <a
                    href={whatsappLink(enquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-sm font-extrabold text-white shadow-xl transition-transform hover:-translate-y-1"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    {c.cta.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
