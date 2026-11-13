import type { Locale } from "./locales";
import type { ProjectSlug } from "./plots";

export type { ProjectSlug };

export interface MediaItem {
  kind: "video" | "image";
  src: string;
  poster?: string;
  en: string;
  mr: string;
}

export interface Fact {
  en: string;
  mr: string;
  valueEn: string;
  valueMr: string;
  /** True when the figure is the developer's own statement, not a drawing measurement. */
  stated?: boolean;
}

export interface Project {
  slug: ProjectSlug;
  nameEn: string;
  nameMr: string;
  villageEn: string;
  villageMr: string;
  tagEn: string;
  tagMr: string;
  introEn: string;
  introMr: string;
  /** Tailwind accent family used on the card and page. */
  accent: "sunset" | "river";
  cover: string;
  coordinates: { lat: number; lng: number };
  gat: string;
  pincode: string;
  /** Price per guntha in ₹ when the developer has quoted one. */
  pricePerGuntha: number | null;
  highlightsEn: string[];
  highlightsMr: string[];
  facts: Fact[];
  media: MediaItem[];
}

export const projects: Project[] = [
  {
    slug: "shivare",
    nameEn: "Shivare Industrial Plots",
    nameMr: "शिवरे इंडस्ट्रियल प्लॉट्स",
    villageEn: "Shivare, Bhor, Pune",
    villageMr: "शिवरे, भोर, पुणे",
    tagEn: "Industrial plots near Khed Shivapur, reached from the NH-48 service road",
    tagMr: "खेड शिवापूरजवळ इंडस्ट्रियल प्लॉट्स, NH-48 सर्व्हिस रोडवरून प्रवेश",
    introEn:
      "Thirteen numbered industrial plots laid out along a 40 ft wide road, with a 40 ft approach road running in from the Pune–Satara (NH-48) service road.",
    introMr:
      "४० फूट रुंद रस्त्याच्या दोन्ही बाजूंना आखलेले तेरा क्रमांकित इंडस्ट्रियल प्लॉट्स; पुणे–सातारा (NH-48) सर्व्हिस रोडवरून ४० फूट रुंद अप्रोच रोड.",
    accent: "sunset",
    cover: "/media/shivare/graded-road.jpg",
    coordinates: { lat: 18.32167, lng: 73.86061 },
    gat: "148, 149, 151",
    pincode: "412205",
    pricePerGuntha: 1451000,
    highlightsEn: [
      "40 ft wide internal road and 40 ft approach road",
      "Access from the NH-48 (Pune–Satara) service road",
      "Plots 1–12 and 12A, each shown with its stated area",
      "Title and approval documents shared when you contact us",
    ],
    highlightsMr: [
      "४० फूट रुंद अंतर्गत रस्ता आणि ४० फूट रुंद अप्रोच रोड",
      "पुणे–सातारा (NH-48) सर्व्हिस रोडवरून प्रवेश",
      "प्लॉट १–१२ आणि १२A, प्रत्येकाचे नमूद क्षेत्रफळ",
      "मालकी व मंजुरीची कागदपत्रे संपर्क केल्यावर दिली जातात",
    ],
    facts: [
      { en: "Village", mr: "गाव", valueEn: "Shivare, Bhor, Pune — 412205", valueMr: "शिवरे, भोर, पुणे — ४१२२०५" },
      { en: "Gat numbers", mr: "गट क्रमांक", valueEn: "148, 149, 151", valueMr: "१४८, १४९, १५१" },
      { en: "Plots", mr: "प्लॉट", valueEn: "13 numbered plots (1–12, 12A)", valueMr: "१३ क्रमांकित प्लॉट (१–१२, १२A)" },
      { en: "Plot sizes", mr: "प्लॉट आकार", valueEn: "12.4 to 25 are (about 12 to 25 guntha)", valueMr: "१२.४ ते २५ आर (सुमारे १२ ते २५ गुंठे)" },
      { en: "Roads", mr: "रस्ते", valueEn: "40 ft wide", valueMr: "४० फूट रुंद" },
      { en: "Project area", mr: "प्रकल्प क्षेत्र", valueEn: "10 acres", valueMr: "१० एकर", stated: true },
      { en: "Rate", mr: "दर", valueEn: "₹14,51,000 per guntha", valueMr: "₹१४,५१,००० प्रति गुंठा", stated: true },
      { en: "Corridor", mr: "परिसर", valueEn: "NH-48 Pune–Satara; near the proposed Pune Ring Road corridor", valueMr: "NH-48 पुणे–सातारा; प्रस्तावित पुणे रिंग रोड कॉरिडॉरजवळ", stated: true },
    ],
    media: [
      { kind: "video", src: "/media/shivare/graded-road.mp4", poster: "/media/shivare/graded-road.jpg", en: "Graded road at the site", mr: "साइटवरील तयार रस्ता" },
      { kind: "video", src: "/media/shivare/hill-view.mp4", poster: "/media/shivare/hill-view.jpg", en: "Hill views from the road", mr: "रस्त्यावरून दिसणारे डोंगर" },
      { kind: "image", src: "/media/shivare/nh48-corridor.jpg", en: "NH-48 interchange near Khed Shivapur", mr: "खेड शिवापूरजवळील NH-48 इंटरचेंज" },
      { kind: "image", src: "/media/shivare/brochure.jpg", en: "Project brochure", mr: "प्रकल्प माहितीपत्रक" },
    ],
  },
  {
    slug: "yevali",
    nameEn: "Yevali Riverside Plots",
    nameMr: "येवली रिव्हरसाइड प्लॉट्स",
    villageEn: "Yevali, Bhor, Pune",
    villageMr: "येवली, भोर, पुणे",
    tagEn: "Spacious plots beside the Nira River, with a garden and amenity space",
    tagMr: "निरा नदीकाठी प्रशस्त प्लॉट्स, बाग व अमेनिटी स्पेससह",
    introEn:
      "Thirty-three numbered plots of 11,000 to 21,700 sq.ft, with 30 ft and 20 ft internal roads, a landscaped garden along the river and a 13,700 sq.ft amenity space.",
    introMr:
      "११,००० ते २१,७०० चौ.फूट क्षेत्रफळाचे तेहतीस क्रमांकित प्लॉट्स; ३० व २० फूट अंतर्गत रस्ते, नदीकाठी बाग आणि १३,७०० चौ.फूट अमेनिटी स्पेस.",
    accent: "river",
    cover: "/media/yevali/nira-bank.jpg",
    coordinates: { lat: 18.15806, lng: 73.88186 },
    gat: "312",
    pincode: "412206",
    pricePerGuntha: null,
    highlightsEn: [
      "Beside the Nira River, with a garden between the plots and the water",
      "30 ft and 20 ft internal roads",
      "13,700 sq.ft amenity space",
      "Internal roads, water facility, street lights and plantation (developer-stated)",
      "Title and approval documents shared when you contact us",
    ],
    highlightsMr: [
      "निरा नदीकाठी; प्लॉट आणि पाणी यांच्यामध्ये बाग",
      "३० फूट व २० फूट अंतर्गत रस्ते",
      "१३,७०० चौ.फूट अमेनिटी स्पेस",
      "अंतर्गत रस्ते, पाणी सुविधा, स्ट्रीट लाईट व वृक्षारोपण (विकासकाच्या माहितीनुसार)",
      "मालकी व मंजुरीची कागदपत्रे संपर्क केल्यावर दिली जातात",
    ],
    facts: [
      { en: "Village", mr: "गाव", valueEn: "Yevali, Bhor, Pune — 412206", valueMr: "येवली, भोर, पुणे — ४१२२०६" },
      { en: "Gat number", mr: "गट क्रमांक", valueEn: "312", valueMr: "३१२" },
      { en: "Plots", mr: "प्लॉट", valueEn: "33 numbered plots", valueMr: "३३ क्रमांकित प्लॉट" },
      { en: "Plot sizes", mr: "प्लॉट आकार", valueEn: "11,000 to 21,700 sq.ft (10 to 20 guntha)", valueMr: "११,००० ते २१,७०० चौ.फूट (१० ते २० गुंठे)" },
      { en: "Roads", mr: "रस्ते", valueEn: "30 ft and 20 ft wide", valueMr: "३० फूट व २० फूट रुंद" },
      { en: "Amenity space", mr: "अमेनिटी स्पेस", valueEn: "13,700 sq.ft", valueMr: "१३,७०० चौ.फूट" },
      { en: "Scheme area", mr: "योजना क्षेत्र", valueEn: "15 acres", valueMr: "१५ एकर", stated: true },
      { en: "From Pune", mr: "पुण्यापासून", valueEn: "About 40 km", valueMr: "सुमारे ४० किमी", stated: true },
    ],
    media: [
      { kind: "video", src: "/media/yevali/nira-bank.mp4", poster: "/media/yevali/nira-bank.jpg", en: "On the bank of the Nira", mr: "निरा नदीकाठी" },
      { kind: "video", src: "/media/yevali/tree-lined.mp4", poster: "/media/yevali/tree-lined.jpg", en: "Cleared, tree-lined plots", mr: "झाडांनी वेढलेले तयार प्लॉट्स" },
      { kind: "video", src: "/media/yevali/compound-wall.mp4", poster: "/media/yevali/compound-wall.jpg", en: "Compound wall along the site", mr: "साइटभोवतीची कंपाउंड वॉल" },
      { kind: "video", src: "/media/yevali/site-land.mp4", poster: "/media/yevali/site-land.jpg", en: "Levelled land", mr: "सपाट केलेली जमीन" },
      { kind: "image", src: "/media/yevali/brochure.jpg", en: "Project brochure", mr: "प्रकल्प माहितीपत्रक" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const pick = <T extends { en: string; mr: string }>(item: T, locale: Locale) =>
  locale === "mr" ? item.mr : item.en;

export function projectName(project: Project, locale: Locale) {
  return locale === "mr" ? project.nameMr : project.nameEn;
}
export function projectVillage(project: Project, locale: Locale) {
  return locale === "mr" ? project.villageMr : project.villageEn;
}
export function projectTag(project: Project, locale: Locale) {
  return locale === "mr" ? project.tagMr : project.tagEn;
}
export function projectIntro(project: Project, locale: Locale) {
  return locale === "mr" ? project.introMr : project.introEn;
}
export function projectHighlights(project: Project, locale: Locale) {
  return locale === "mr" ? project.highlightsMr : project.highlightsEn;
}
