import type { Locale } from "./locales";
import type { Plot, ProjectSlug } from "./plots";
import { site } from "./site";
import { formatNumber } from "./units";

/**
 * Pre-filled WhatsApp messages. The customer only has to press send, and we
 * immediately know which project (and which plot) they are interested in.
 */
export function projectEnquiry(locale: Locale, projectName: string): string {
  return locale === "mr"
    ? `नमस्कार ${site.nameMr}, मला "${projectName}" प्रकल्पात रस आहे. कृपया प्लॉटची माहिती व उपलब्धता कळवा आणि साइट भेट ठरवा.`
    : `Hello ${site.nameEn}, I am interested in the project "${projectName}". Please share the plot details and availability, and arrange a site visit.`;
}

export function plotEnquiry(
  locale: Locale,
  projectName: string,
  slug: ProjectSlug,
  plot: Plot,
): string {
  const guntha = formatNumber(plot.areaGuntha, 1);
  const size =
    slug === "shivare"
      ? locale === "mr"
        ? `${formatNumber(plot.statedAre ?? 0, 1)} आर, सुमारे ${guntha} गुंठे`
        : `${formatNumber(plot.statedAre ?? 0, 1)} are, about ${guntha} guntha`
      : locale === "mr"
        ? `${formatNumber(plot.areaSqft, 0)} चौ.फूट, सुमारे ${guntha} गुंठे`
        : `${formatNumber(plot.areaSqft, 0)} sq.ft, about ${guntha} guntha`;

  return locale === "mr"
    ? `नमस्कार ${site.nameMr}, मला "${projectName}" मधील प्लॉट क्रमांक ${plot.no} (${size}) मध्ये रस आहे. कृपया या प्लॉटची माहिती व उपलब्धता कळवा आणि साइट भेट ठरवा.`
    : `Hello ${site.nameEn}, I am interested in Plot ${plot.no} (${size}) in the project "${projectName}". Please share the details and availability of this plot, and arrange a site visit.`;
}
