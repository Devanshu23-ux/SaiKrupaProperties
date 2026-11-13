import Link from "next/link";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/locales";
import { projectName, projects } from "@/lib/projects";
import { mailLink, site, telLink, whatsappLink } from "@/lib/site";
import { CurrentYear } from "./current-year";
import { ArrowIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";
import { Logo } from "./logo";

const dot: Record<string, string> = {
  shivare: "bg-sunset",
  yevali: "bg-river",
};

export function SiteFooter({ locale, copy }: { locale: Locale; copy: Copy }) {
  const f = copy.footer;
  const kicker = locale === "mr" ? "text-sm font-bold" : "text-xs font-bold uppercase tracking-[0.2em]";
  const rows = [
    { href: telLink, label: f.callLabel, value: site.phoneDisplay, icon: <PhoneIcon className="h-5 w-5" />, tone: "bg-violet-deep", external: false },
    { href: whatsappLink(copy.cta.message), label: f.waLabel, value: site.phoneDisplay, icon: <WhatsAppIcon className="h-5 w-5" />, tone: "bg-lime-deep", external: true },
    { href: mailLink, label: f.mailLabel, value: site.email, icon: <MailIcon className="h-5 w-5" />, tone: "bg-sunset-deep", external: false, small: true },
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
        <div className="rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
          <Logo className="h-28 sm:h-32" />
          <p className="mt-5 text-base font-semibold text-ink">{f.tag}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-soft px-4 py-2 text-xs font-bold text-violet-deep">
            <PinIcon className="h-4 w-4" />
            {locale === "mr" ? "भोर, पुणे" : "Bhor, Pune"}
          </p>
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

        {/* Contact */}
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
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white ${r.tone}`}>{r.icon}</span>
                  <span className="min-w-0">
                    <span className={`block text-[11px] font-bold text-muted ${locale === "mr" ? "" : "uppercase tracking-wider"}`}>{r.label}</span>
                    <span className={`block font-extrabold leading-snug [overflow-wrap:anywhere] ${"small" in r ? "text-[12.5px] min-[420px]:text-[15px]" : "text-[15px]"}`}>{r.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-line bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-5 py-5 text-xs text-muted sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-xl">{f.note}</p>
          <div className="flex flex-col gap-1.5 lg:items-end">
            <p>
              © <CurrentYear /> {site.nameEn}. {f.rights}
            </p>
            <p>
              {f.developedBy}{" "}
              <a
                href="https://truviatechnologies.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-violet-deep underline decoration-violet/40 underline-offset-4 transition-colors hover:text-ink"
              >
                Truvia Technologies
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
