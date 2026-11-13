import type { Locale } from "./locales";
import { getLayout } from "./plots";
import type { Project } from "./projects";
import { formatNumber } from "./units";

export interface CardStats {
  plotCount: number;
  sizeRange: string;
  roads: string;
}

const digits = (s: string, locale: Locale) =>
  locale === "mr" ? s.replace(/[0-9]/g, (d) => "०१२३४५६७८९"[Number(d)]) : s;

export function projectStats(project: Project, locale: Locale): CardStats {
  const layout = getLayout(project.slug);
  const plotCount = layout.plots.length;

  if (project.slug === "yevali") {
    const areas = layout.plots.map((p) => p.areaSqft);
    const min = Math.min(...areas);
    const max = Math.max(...areas);
    const unit = locale === "mr" ? "चौ.फूट" : "sq.ft";
    return {
      plotCount,
      sizeRange: digits(`${formatNumber(min, 0)}–${formatNumber(max, 0)} ${unit}`, locale),
      roads: digits(locale === "mr" ? "३० व २० फूट" : "30 & 20 ft", locale),
    };
  }

  const ares = layout.plots.map((p) => p.statedAre ?? 0);
  const unit = locale === "mr" ? "आर" : "are";
  return {
    plotCount,
    sizeRange: digits(`${formatNumber(Math.min(...ares), 1)}–${formatNumber(Math.max(...ares), 0)} ${unit}`, locale),
    roads: digits(locale === "mr" ? "४० फूट" : "40 ft", locale),
  };
}

export function totalPlots(): number {
  return getLayout("shivare").plots.length + getLayout("yevali").plots.length;
}

export { digits };
