import Link from "next/link";
import Image from "next/image";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/locales";
import {
  projectName,
  projectTag,
  projectVillage,
  type Project,
} from "@/lib/projects";
import { projectStats } from "@/lib/stats";
import { ArrowIcon, PinIcon } from "./icons";
import { MiniPlan } from "./mini-plan";

const THEME = {
  sunset: {
    panel: "bg-[linear-gradient(135deg,#ecc89a_0%,#e5aaa0_100%)]",
    chip: "bg-sunset-soft text-sunset-deep",
    btn: "bg-sunset-deep text-white shadow-sunset/30",
    ring: "hover:shadow-[0_26px_52px_-20px_rgba(219,163,107,0.55)]",
  },
  river: {
    panel: "bg-[linear-gradient(135deg,#a4d2db_0%,#a5b9d6_100%)]",
    chip: "bg-river-soft text-river-deep",
    btn: "bg-river-deep text-white shadow-river/40",
    ring: "hover:shadow-[0_26px_52px_-20px_rgba(123,184,196,0.55)]",
  },
} as const;

export function ProjectCard({
  project,
  locale,
  copy,
}: {
  project: Project;
  locale: Locale;
  copy: Copy;
}) {
  const theme = THEME[project.accent];
  const stats = projectStats(project, locale);

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-card transition-all duration-500 ease-[var(--ease-signature)] hover:-translate-y-2 ${theme.ring}`}
    >
      {/* Colour panel: real site photo under a tint, with the plan on top */}
      <div className={`relative aspect-[16/11] overflow-hidden ${theme.panel}`}>
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover opacity-40 mix-blend-luminosity transition-transform duration-700 ease-[var(--ease-signature)] group-hover:scale-105"
        />
        <div aria-hidden="true" className="dots absolute inset-0 opacity-40" />
        <MiniPlan
          slug={project.slug}
          className="absolute inset-0 h-full w-full p-6 drop-shadow-[0_10px_18px_rgba(28,20,71,0.3)] transition-transform duration-700 ease-[var(--ease-signature)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-5 top-5 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink shadow-lg">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-lime" />
          {copy.projects.available}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${theme.chip}`}>
          <PinIcon className="h-3.5 w-3.5" />
          {projectVillage(project, locale)}
        </p>
        <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-[1.75rem]">
          {projectName(project, locale)}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{projectTag(project, locale)}</p>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{copy.projects.plots}</dt>
            <dd className="mt-1 text-xl font-extrabold text-ink">{stats.plotCount}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{copy.projects.sizes}</dt>
            <dd className="mt-1 text-sm font-bold leading-snug text-ink">{stats.sizeRange}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{copy.projects.roads}</dt>
            <dd className="mt-1 text-sm font-bold leading-snug text-ink">{stats.roads}</dd>
          </div>
        </dl>

        <span
          className={`mt-7 inline-flex w-fit items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold shadow-lg transition-transform duration-300 group-hover:translate-x-1 ${theme.btn}`}
        >
          {copy.projects.view}
          <ArrowIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
