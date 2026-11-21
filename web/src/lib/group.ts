import type { Locale } from "./locales";

export interface GroupBusiness {
  id: string;
  nameEn: string;
  nameMr: string;
  categoryEn: string;
  categoryMr: string;
  tagEn: string;
  tagMr: string;
  descEn: string;
  descMr: string;
  badgeEn: string;
  badgeMr: string;
  tone: "sunset" | "violet" | "river" | "lime" | "pink";
  highlightEn: string;
  highlightMr: string;
}

export const groupBusinesses: GroupBusiness[] = [
  {
    id: "crane",
    nameEn: "Saikrupa Crane Services",
    nameMr: "साईकृपा क्रेन सर्व्हिसेस",
    categoryEn: "Heavy Lifting & Erection",
    categoryMr: "अवजड क्रेन व उभारणी सेवा",
    tagEn: "Heavy Machinery & Shifts",
    tagMr: "अवजड मशनरी व शिफ्टिंग",
    descEn:
      "Specialized hydraulic and mobile crane hiring for industrial plant setups, structural steel erection, and heavy machinery movement across Maharashtra.",
    descMr:
      "औद्योगिक प्रकल्प उभारणी, अवजड मशनरी शिफ्टिंग आणि स्ट्रक्चरल कामांसाठी संपूर्ण महाराष्ट्रात आधुनिक हायड्रॉलिक क्रेन भाडे सेवा.",
    badgeEn: "Heavy Lifting",
    badgeMr: "अवजड क्रेन सेवा",
    tone: "sunset",
    highlightEn: "Hydraulic Cranes • Factory Setups • 24/7 Support",
    highlightMr: "हायड्रॉलिक क्रेन • फॅक्टरी उभारणी • २४/७ तत्पर",
  },
  {
    id: "laser",
    nameEn: "Saikrupa Laser",
    nameMr: "साईकृपा लेझर",
    categoryEn: "CNC Fiber Laser Cutting",
    categoryMr: "सीएनसी फायबर लेझर कटिंग",
    tagEn: "Sheet Metal Precision",
    tagMr: "अचूक शीट मेटल कटिंग",
    descEn:
      "State-of-the-art CNC fiber laser cutting for sheet metal with micron-level precision, clean edges, and fast turnaround for engineering industries.",
    descMr:
      "इंजिनिअरिंग व फॅब्रिकेशन उद्योगांसाठी अचूक मापाचे आणि उत्कृष्ट फिनिशिंगसह आधुनिक सीएनसी फायबर लेझर शीट मेटल कटिंग.",
    badgeEn: "Precision Laser",
    badgeMr: "अचूक लेझर कटिंग",
    tone: "violet",
    highlightEn: "CNC Fiber Laser • High Accuracy • Custom Profiles",
    highlightMr: "सीएनसी फायबर लेझर • अचूक फिनिशिंग • कस्टमाईज्ड",
  },
  {
    id: "tube-cutting",
    nameEn: "Saikrupa Tube Cutting",
    nameMr: "साईकृपा ट्यूब कटिंग",
    categoryEn: "3D Tube & Pipe Laser",
    categoryMr: "3D पाईप व ट्यूब लेझर कटिंग",
    tagEn: "Structural Steel Profiling",
    tagMr: "स्ट्रक्चरल पाईप प्रोफाइलिंग",
    descEn:
      "Advanced 3D CNC rotary pipe and tube laser cutting, beveling, slotting, and profiling for structural frames and automotive components.",
    descMr:
      "स्ट्रक्चरल फ्रेम, पाईपलाईन्स आणि वाहनांच्या सुट्या भागांसाठी आधुनिक 3D सीएनसी पाईप व ट्यूब लेझर कटिंग आणि प्रोफाइलिंग.",
    badgeEn: "3D Tube Laser",
    badgeMr: "3D ट्यूब कटिंग",
    tone: "river",
    highlightEn: "3D Rotary Laser • Bevel & Slot • Round & Square Pipes",
    highlightMr: "3D रोटरी लेझर • बेव्हल व स्लॉट • गोल व चौकोनी पाईप",
  },
  {
    id: "resort",
    nameEn: "Aaryans Riverwood Resort",
    nameMr: "आर्यन रिव्हरवूड रिसॉर्ट",
    categoryEn: "Luxury Hospitality & Leisure",
    categoryMr: "निसर्गरम्य लक्झरी रिसॉर्ट",
    tagEn: "Riverside Nature Retreat",
    tagMr: "नदीकाठचे पर्यटन केंद्र",
    descEn:
      "Exclusive nature resort along the Nira river basin near Bhor featuring luxury cottages, swimming pool, open lawns, banquet hall, and authentic rural dining.",
    descMr:
      "भोरजवळील निरा नदीकाठी निसर्गाच्या कुशीत वसलेले लक्झरी रिसॉर्ट; सुंदर कॉटेज, स्विमिंग पूल, बँक्वेट हॉल आणि अस्सल ग्रामीण मेजवानी.",
    badgeEn: "Hospitality & Stay",
    badgeMr: "हॉस्पिटॅलिटी व रिसॉर्ट",
    tone: "lime",
    highlightEn: "Riverfront Cottages • Swimming Pool • Family & Events",
    highlightMr: "नदीकाठचे कॉटेज • स्विमिंग पूल • कौटुंबिक सहल व इव्हेंट्स",
  },
  {
    id: "cryogenic-gases",
    nameEn: "Saikrupa Cryogenic Gases",
    nameMr: "साईकृपा क्रायोजेनिक गॅसेस",
    categoryEn: "Industrial & Medical Gases",
    categoryMr: "औद्योगिक व लिक्विड गॅसेस",
    tagEn: "Cryogenic Liquid Supply",
    tagMr: "क्रायोजेनिक गॅस पुरवठा",
    descEn:
      "Reliable bulk refilling and cylinder distribution of industrial oxygen, nitrogen, argon, and cryogenic liquid gases for manufacturing and fabrication.",
    descMr:
      "फॅब्रिकेशन, वेल्डिंग आणि कारखान्यांसाठी औद्योगिक ऑक्सिजन, नायट्रोजन, आर्गॉन व लिक्विड क्रायोजेनिक गॅसेसचा सुरक्षित व अखंड पुरवठा.",
    badgeEn: "Industrial Gases",
    badgeMr: "औद्योगिक गॅसेस",
    tone: "violet",
    highlightEn: "Liquid Oxygen • Nitrogen • Argon • Bulk Delivery",
    highlightMr: "लिक्विड ऑक्सिजन • नायट्रोजन • आर्गॉन • वेळेत पुरवठा",
  },
  {
    id: "transport",
    nameEn: "Bhairavnath Transport & Company",
    nameMr: "भैरवनाथ ट्रान्सपोर्ट अँड कंपनी",
    categoryEn: "Heavy Logistics & Cargo Fleet",
    categoryMr: "लॉजिस्टिक्स व अवजड वाहतूक",
    tagEn: "Material Logistics Fleet",
    tagMr: "सुरक्षित मालवाहतूक ताफा",
    descEn:
      "Comprehensive industrial freight transit, heavy equipment transportation, raw material distribution, and highway logistics with a dedicated truck fleet.",
    descMr:
      "औद्योगिक मालवाहतूक, अवजड मशनरी ट्रान्झिट, कच्चा माल वाहतूक आणि संपूर्ण हायवे कॉरिडॉरवर स्वतःच्या विश्वासार्ह ताफ्याद्वारे सेवा.",
    badgeEn: "Fleet Logistics",
    badgeMr: "मालवाहतूक सेवा",
    tone: "sunset",
    highlightEn: "Heavy Haulage • Dedicated Fleet • On-Time Transit",
    highlightMr: "अवजड वाहतूक • स्वतःचा ताफा • वेळेवर सुरक्षित पोहोच",
  },
  {
    id: "electrical",
    nameEn: "Velu Electrical",
    nameMr: "वेळू इलेक्ट्रिकल",
    categoryEn: "Electrical Contracting & Substation",
    categoryMr: "इलेक्ट्रिकल कॉन्ट्रॅक्टिंग व इन्फ्रा",
    tagEn: "HT / LT Power Infrastructure",
    tagMr: "HT / LT वीज पायाभूत सुविधा",
    descEn:
      "Expert industrial electrical contracting, transformer substation setup, HT/LT power line installations, panel erection, and commercial wiring.",
    descMr:
      "औद्योगिक इलेक्ट्रिकल कॉन्ट्रॅक्टिंग, ट्रान्सफॉर्मर सबस्टेशन, HT/LT वीज वाहिन्या, पॅनेल उभारणी आणि व्यावसायिक वीज पायाभूत सुविधा.",
    badgeEn: "Power Infrastructure",
    badgeMr: "वीज इन्फ्रास्ट्रक्चर",
    tone: "pink",
    highlightEn: "Substation Setup • HT/LT Lines • Industrial Electrification",
    highlightMr: "सबस्टेशन उभारणी • HT/LT वीज कामे • फॅक्टरी वायरिंग",
  },
];

export function groupName(item: GroupBusiness, locale: Locale): string {
  return locale === "mr" ? item.nameMr : item.nameEn;
}

export function groupCategory(item: GroupBusiness, locale: Locale): string {
  return locale === "mr" ? item.categoryMr : item.categoryEn;
}

export function groupTag(item: GroupBusiness, locale: Locale): string {
  return locale === "mr" ? item.tagMr : item.tagEn;
}

export function groupDesc(item: GroupBusiness, locale: Locale): string {
  return locale === "mr" ? item.descMr : item.descEn;
}

export function groupBadge(item: GroupBusiness, locale: Locale): string {
  return locale === "mr" ? item.badgeMr : item.badgeEn;
}

export function groupHighlight(item: GroupBusiness, locale: Locale): string {
  return locale === "mr" ? item.highlightMr : item.highlightEn;
}
