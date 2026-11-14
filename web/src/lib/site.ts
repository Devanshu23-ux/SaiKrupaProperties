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

/** The web developer credited in the footer (NOT a Sai Krupa Properties contact). */
export const developer = {
  name: "Truvia Technologies",
  url: "https://truviatechnologies.vercel.app",
  email: "truviatechnologies@gmail.com",
} as const;

export const wordmark = "Sai Krupa Properties";
