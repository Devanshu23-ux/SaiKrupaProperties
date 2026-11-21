import { notFound } from "next/navigation";
import { BuildingFigure } from "@/components/building-figure";
import { GroupSection } from "@/components/group-section";
import { ArrowIcon, PhoneIcon, TileIcon, WhatsAppIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { getCopy } from "@/lib/copy";
import { hasLocale } from "@/lib/locales";
import { projects } from "@/lib/projects";
import { digits, totalPlots } from "@/lib/stats";
import { site, telLink, whatsappLink } from "@/lib/site";
import Link from "next/link";

const TILE_STYLES = [
  "bg-violet-soft text-violet-deep",
  "bg-sunset-soft text-sunset-deep",
  "bg-river-soft text-river-deep",
  "bg-pink-soft text-pink-deep",
];

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const c = getCopy(locale);
  const plotTotal = digits(String(totalPlots()), locale);

  return (
    <>
      {/* ───────────── Hero: info on the left, 3D building on the right ───────────── */}
      <section className="hero-glow relative isolate overflow-hidden">
        <div className="mx-auto grid min-h-[100svh] max-w-[1320px] grid-cols-[minmax(0,1fr)] items-center gap-6 px-4 pb-12 pt-24 sm:px-8 sm:pt-28 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-4 lg:pt-24">
          <div className="relative z-10 min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-deep shadow-card">
              <span className="bg-brand h-2 w-2 rounded-full" />
              {c.hero.eyebrow}
            </p>

            <h1 className="mt-6 text-[clamp(2rem,6.2vw,4.6rem)] font-extrabold leading-[1.08] tracking-tight text-ink">
              {c.hero.title1}
              <br />
              <span className="text-brand">{c.hero.title2}</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{c.hero.sub}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}#projects`}
                className="bg-brand inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-bold sm:px-7 sm:py-4 text-white shadow-xl shadow-violet/30 transition-transform hover:-translate-y-1"
              >
                {c.hero.primary}
                <ArrowIcon className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink(c.cta.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-lime bg-white px-6 py-3 text-sm font-bold text-lime-deep transition-transform hover:-translate-y-1 sm:px-7 sm:py-3.5"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {c.hero.secondary}
              </a>
            </div>

            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
              {[
                { v: digits(String(projects.length), locale), l: c.hero.statProjects, tone: "text-violet-deep" },
                { v: plotTotal, l: c.hero.statPlots, tone: "text-pink-deep" },
                { v: c.hero.statPlace, l: "", tone: "text-sunset-deep" },
              ].map((s, i) => (
                <div key={i} className="min-w-0 rounded-2xl bg-white/80 p-3 shadow-card backdrop-blur sm:p-4">
                  <dd className={`text-xl font-extrabold leading-tight sm:text-2xl ${s.tone}`}>{s.v}</dd>
                  {s.l && <dt className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{s.l}</dt>}
                </div>
              ))}
            </dl>
          </div>

          <div className="relative h-[min(52svh,390px)] min-h-[300px] w-full min-w-0 overflow-hidden sm:h-[min(72svh,560px)] sm:min-h-[380px] lg:h-[min(86svh,720px)]">
            <div
              aria-hidden="true"
              className="bg-brand absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[3rem] opacity-[0.13] blur-2xl"
            />
            <BuildingFigure hint={c.hero.hint} />
          </div>
        </div>
      </section>

      {/* ───────────── What we do ───────────── */}
      <section id="what" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-deep">{c.what.kicker}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-tight tracking-tight">
              {c.what.title}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.what.items.map((item, i) => (
              <Reveal key={item.t} delay={i * 0.07}>
                <div className="group h-full rounded-[1.75rem] bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl ${TILE_STYLES[i]} transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                    <TileIcon index={i} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 text-lg font-extrabold leading-snug">{item.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Projects ───────────── */}
      <section id="projects" className="scroll-mt-24 bg-tint py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-deep">{c.projects.kicker}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <h2 className="max-w-2xl text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-tight tracking-tight">
                {c.projects.title}
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-muted">{c.projects.note}</p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.1}>
                <ProjectCard project={project} locale={locale} copy={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Our Group Businesses ───────────── */}
      <GroupSection locale={locale} copy={c} />

      {/* ───────────── Contact band ───────────── */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <Reveal>
            <div className="bg-brand relative overflow-hidden rounded-[2.5rem] px-7 py-14 text-white sm:px-14 sm:py-16">
              <div aria-hidden="true" className="dots absolute inset-0 opacity-60" />
              <div className="relative flex flex-wrap items-center justify-between gap-8">
                <div className="max-w-xl">
                  <h2 className="text-[clamp(1.8rem,3.6vw,2.8rem)] font-extrabold leading-tight">{c.cta.title}</h2>
                  <p className="mt-3 text-base text-white/85 sm:text-lg">{c.cta.sub}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={telLink}
                    className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-ink shadow-xl transition-transform hover:-translate-y-1"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    {c.cta.call} {site.phoneDisplay}
                  </a>
                  <a
                    href={whatsappLink(c.cta.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-4 text-sm font-extrabold text-white shadow-xl transition-transform hover:-translate-y-1"
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
    </>
  );
}
