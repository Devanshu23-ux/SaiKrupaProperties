/**
 * Company facts. Only what the developer has supplied.
 */
export const site = {
  nameEn: "Sai Krupa Properties",
  nameMr: "साई कृपा प्रॉपर्टीज",
  /** The single contact number for every call and WhatsApp button. */
  phone: "7843079954",
  phoneDisplay: "78430 79954",
} as const;

/** WhatsApp deep link with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/91${site.phone}?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:+91${site.phone}`;

export const wordmark = "Sai Krupa Properties";
