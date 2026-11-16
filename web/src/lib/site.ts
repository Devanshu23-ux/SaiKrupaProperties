/**
 * Company facts. Only what the developer has supplied.
 */
export const site = {
  nameEn: "Sai Krupa Properties",
  nameMr: "साई कृपा प्रॉपर्टीज",
  /** The single contact number (calls and WhatsApp) for every call and WhatsApp button. */
  phone: "9762035555",
  phoneDisplay: "97620 35555",
} as const;

/** WhatsApp deep link with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/91${site.phone}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:+91${site.phone}`;

/** Official social media profiles */
export const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61596295515314",
    handle: "Sai Krupa Properties",
    icon: "facebook" as const,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/saikrupaproperties09/",
    handle: "@saikrupaproperties09",
    icon: "instagram" as const,
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/saikrupapro09",
    handle: "@saikrupapro09",
    icon: "x" as const,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/sai-krupa-properties-3ba070450",
    handle: "Sai Krupa Properties",
    icon: "linkedin" as const,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCpQMrn8xVTmhoj09fj6Sr6g",
    handle: "Sai Krupa Properties",
    icon: "youtube" as const,
  },
] as const;

/** Google Business Profile & Direct Review link (decoded from official Google QR) */
export const googleReview = {
  placeId: "ChIJoYrhPvXtwjsRmm6odd0HXW8",
  reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJoYrhPvXtwjsRmm6odd0HXW8",
  profileUrl: "https://local.google.com/place?placeid=ChIJoYrhPvXtwjsRmm6odd0HXW8&utm_medium=noren&utm_source=gbp&utm_campaign=2026",
} as const;

/** The web developer credited in the footer (NOT a Sai Krupa Properties contact). */
export const developer = {
  name: "Truvia Technologies",
  url: "https://truviatechnologies.vercel.app",
  email: "truviatechnologies@gmail.com",
} as const;

export const wordmark = "Sai Krupa Properties";
