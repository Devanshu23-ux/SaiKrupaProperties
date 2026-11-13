import Link from "next/link";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/locales";
import { projectName, projects } from "@/lib/projects";
import { site, telLink } from "@/lib/site";
import { CurrentYear } from "./current-year";
import { Logo } from "./logo";

export function SiteFooter({ locale, copy }: { locale: Locale; copy: Copy }) {
  return (
    <footer className="relative mt-24 overflow-hidden bg-tint text-ink">
      <div aria-hidden="true" className="bg-brand h-1.5 w-full" />
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="h-28 sm:h-32" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{copy.footer.tag}</p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-deep">{copy.footer.projects}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/${locale}/projects/${p.slug}`} className="text-ink/80 transition-colors hover:text-ink">
                  {projectName(p, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div id="contact" className="scroll-mt-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sunset-deep">{copy.footer.contact}</p>
          <a href={telLink} className="mt-4 block text-2xl font-extrabold tracking-tight hover:text-sunset-deep">
            {site.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-muted">{locale === "mr" ? site.nameMr : site.nameEn}</p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between sm:px-8">
          <p>{copy.footer.note}</p>
          <div className="flex flex-col gap-1 sm:items-end">
            <p>
              © <CurrentYear /> {site.nameEn}. {copy.footer.rights}
            </p>
            <p>
              {copy.footer.developedBy}{" "}
              <a
                href="https://truviatechnologies.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink underline decoration-line underline-offset-4 transition-colors hover:text-violet-deep"
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
