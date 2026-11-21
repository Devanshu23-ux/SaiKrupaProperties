import Link from "next/link";
import type { Copy } from "@/lib/copy";
import { groupBusinesses, groupCategory, groupName } from "@/lib/group";
import type { Locale } from "@/lib/locales";
import { projectName, projects } from "@/lib/projects";
import { developer, googleReview, site, socialLinks, telLink, whatsappLink } from "@/lib/site";
import { CurrentYear } from "./current-year";
import { ArrowIcon, GoogleIcon, GroupBusinessIcon, MailIcon, PhoneIcon, PinIcon, SocialIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./logo";

const dot: Record<string, string> = {
  shivare: "bg-sunset",
  yevali: "bg-river",
};

export function SiteFooter({ locale, copy }: { locale: Locale; copy: Copy }) {
  const f = copy.footer;
  const kicker = locale === "mr" ? "text-sm font-bold" : "text-xs font-bold uppercase tracking-[0.2em]";
  const rows = [
    { href: telLink, label: f.callLabel, value: site.phoneDisplay, icon: <PhoneIcon className="h-5 w-5" />, tone: "bg-violet-deep text-white", external: false },
    { href: whatsappLink(copy.cta.message), label: f.waLabel, value: site.phoneDisplay, icon: <WhatsAppIcon className="h-5 w-5" />, tone: "bg-lime-deep text-white", external: true },
    {
      href: googleReview.reviewUrl,
      label: f.googleReview,
      value: (
        <span className="inline-flex items-center gap-1.5">
          <span>{f.googleReviewSub}</span>
          <span className="text-amber-500 font-bold">★★★★★</span>
        </span>
      ),
      icon: <GoogleIcon className="h-5 w-5" />,
      tone: "bg-white text-ink border border-line shadow-sm",
      external: true,
      small: true,
    },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden bg-tint text-ink">
      {/* Colour ribbon */}
      <div aria-hidden="true" className="flex h-2 w-full">
        <span className="flex-1 bg-violet" />
        <span className="flex-1 bg-river" />
        <span className="flex-1 bg-lime" />
        <span className="flex-1 bg-sun" />
        <span className="flex-1 bg-sunset" />
        <span className="flex-1 bg-pink" />
      </div>
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 opacity-80" />

      <div className="relative mx-auto grid max-w-[1320px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1.15fr_0.85fr_1.2fr] lg:gap-10">
        {/* Brand card */}
        <div className="flex flex-col justify-between rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
          <div>
            <Logo className="h-28 sm:h-32" />
            <p className="mt-5 text-base font-semibold text-ink">{f.tag}</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-soft px-4 py-2 text-xs font-bold text-violet-deep">
              <PinIcon className="h-4 w-4" />
              {locale === "mr" ? "भोर, पुणे" : "Bhor, Pune"}
            </p>
          </div>

          {/* Social media profiles */}
          <div className="mt-6 border-t border-line/70 pt-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {f.socialTitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.name} — ${s.handle}`}
                  title={`${s.name} (${s.handle})`}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-tint text-ink/75 transition-all hover:-translate-y-1 hover:bg-violet-soft hover:text-violet-deep shadow-sm"
                >
                  <SocialIcon name={s.icon} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div>
          <p className={`${kicker} text-violet-deep`}>{f.projects}</p>
          <ul className="mt-4 space-y-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${locale}/projects/${p.slug}`}
                  className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm font-bold shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className={`h-3 w-3 shrink-0 rounded-full ${dot[p.slug] ?? "bg-violet"}`} />
                  <span className="min-w-0 flex-1">{projectName(p, locale)}</span>
                  <ArrowIcon className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Reviews */}
        <div id="contact" className="scroll-mt-28">
          <p className={`${kicker} text-sunset-deep`}>{f.reach}</p>
          <p className="mt-2 text-sm text-muted">{f.reachSub}</p>
          <ul className="mt-4 space-y-3">
            {rows.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-3.5 rounded-2xl bg-white p-3 pr-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${r.tone}`}>{r.icon}</span>
                  <span className="min-w-0">
                    <span className={`block text-[11px] font-bold text-muted ${locale === "mr" ? "" : "uppercase tracking-wider"}`}>{r.label}</span>
                    <span className={`block font-extrabold leading-snug [overflow-wrap:anywhere] ${"small" in r && r.small ? "text-[12px] min-[420px]:text-[13.5px]" : "text-[15px]"}`}>{r.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Group Businesses Strip */}
      <div className="relative mx-auto max-w-[1320px] px-5 pb-10 sm:px-8">
        <div className="rounded-[2rem] border border-line bg-white/70 p-6 backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-deep">
                {locale === "mr" ? "उद्योग समूह" : "The Conglomerate"}
              </p>
              <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-ink">
                {f.groupTitle}
              </h3>
            </div>
            <Link
              href={`/${locale}#group`}
              className="inline-flex items-center gap-2 rounded-full bg-violet-soft px-4 py-2 text-xs font-bold text-violet-deep hover:bg-violet hover:text-white transition-colors"
            >
              <span>{locale === "mr" ? "सर्व उद्योग पहा" : "View all businesses"}</span>
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {groupBusinesses.map((b) => (
              <Link
                key={b.id}
                href={`/${locale}#group`}
                className="group flex items-center gap-3 rounded-xl border border-line/60 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card hover:border-violet/40"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tint text-violet-deep group-hover:bg-violet group-hover:text-white transition-colors">
                  <GroupBusinessIcon id={b.id} className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-ink group-hover:text-violet-deep transition-colors">
                    {groupName(b, locale)}
                  </p>
                  <p className="truncate text-[10.5px] text-muted">
                    {groupCategory(b, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-line bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-xl">{f.note}</p>
          <p className="font-semibold text-ink/80">
            © <CurrentYear /> {site.nameEn}. {f.rights}
          </p>
        </div>

        {/* Developer credit — highlighted */}
        <div className="mx-auto max-w-[1320px] px-5 pb-6 pt-4 sm:px-8">
          <div className="bg-brand relative overflow-hidden rounded-[1.75rem] px-5 py-5 text-white shadow-lift sm:px-8">
            <div aria-hidden="true" className="dots absolute inset-0 opacity-50" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm sm:text-base">
                {f.developedBy}{" "}
                <a
                  href={developer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-white underline decoration-white/60 decoration-2 underline-offset-4 transition-colors hover:decoration-white"
                >
                  {developer.name} ↗
                </a>
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
                <p className="text-sm font-semibold text-white/90">{f.buildSite}</p>
                <a
                  href={`mailto:${developer.email}`}
                  className="inline-flex w-fit max-w-full items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-[12px] font-extrabold text-ink shadow-lg transition-transform hover:-translate-y-0.5 min-[400px]:px-5 min-[400px]:text-[13px] sm:text-sm"
                >
                  <MailIcon className="h-4 w-4 shrink-0 text-violet-deep" />
                  {developer.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
