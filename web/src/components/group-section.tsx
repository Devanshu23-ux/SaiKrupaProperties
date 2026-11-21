import { GroupBusinessIcon, WhatsAppIcon, ArrowIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import {
  groupBusinesses,
  groupCategory,
  groupDesc,
  groupHighlight,
  groupName,
  groupBadge,
} from "@/lib/group";
import type { Copy } from "@/lib/copy";
import type { Locale } from "@/lib/locales";
import { whatsappLink } from "@/lib/site";

interface GroupSectionProps {
  locale: Locale;
  copy: Copy;
}

const TONE_CLASSES = {
  sunset: {
    badge: "bg-sunset-soft text-sunset-deep border-sunset/30",
    iconBox: "bg-sunset-soft text-sunset-deep group-hover:bg-sunset group-hover:text-white",
    glow: "hover:shadow-[0_20px_50px_-15px_rgba(219,163,107,0.35)]",
    border: "border-sunset/20 hover:border-sunset/50",
  },
  violet: {
    badge: "bg-violet-soft text-violet-deep border-violet/30",
    iconBox: "bg-violet-soft text-violet-deep group-hover:bg-violet group-hover:text-white",
    glow: "hover:shadow-[0_20px_50px_-15px_rgba(111,147,181,0.35)]",
    border: "border-violet/20 hover:border-violet/50",
  },
  river: {
    badge: "bg-river-soft text-river-deep border-river/30",
    iconBox: "bg-river-soft text-river-deep group-hover:bg-river group-hover:text-white",
    glow: "hover:shadow-[0_20px_50px_-15px_rgba(123,184,196,0.35)]",
    border: "border-river/20 hover:border-river/50",
  },
  lime: {
    badge: "bg-lime-soft text-lime-deep border-lime/30",
    iconBox: "bg-lime-soft text-lime-deep group-hover:bg-lime group-hover:text-white",
    glow: "hover:shadow-[0_20px_50px_-15px_rgba(141,191,156,0.35)]",
    border: "border-lime/20 hover:border-lime/50",
  },
  pink: {
    badge: "bg-pink-soft text-pink-deep border-pink/30",
    iconBox: "bg-pink-soft text-pink-deep group-hover:bg-pink group-hover:text-white",
    glow: "hover:shadow-[0_20px_50px_-15px_rgba(217,146,138,0.35)]",
    border: "border-pink/20 hover:border-pink/50",
  },
} as const;

export function GroupSection({ locale, copy }: GroupSectionProps) {
  const g = copy.group;

  return (
    <section id="group" className="scroll-mt-24 py-20 sm:py-28 relative overflow-hidden bg-white/70">
      {/* Decorative ambient background blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[500px] w-full max-w-[1200px] bg-gradient-to-r from-violet-soft/40 via-sunset-soft/30 to-river-soft/40 blur-3xl opacity-70 -z-10"
      />

      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col items-start max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet-soft/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-deep shadow-sm">
              <span className="h-2 w-2 rounded-full bg-violet animate-pulse" />
              {g.kicker}
            </span>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold leading-tight tracking-tight text-ink">
              {g.title}
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
              {g.sub}
            </p>
          </div>
        </Reveal>

        {/* 7 Group Businesses Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groupBusinesses.map((item, idx) => {
            const name = groupName(item, locale);
            const category = groupCategory(item, locale);
            const desc = groupDesc(item, locale);
            const badge = groupBadge(item, locale);
            const highlight = groupHighlight(item, locale);
            const tone = TONE_CLASSES[item.tone];

            const enquiryMsg =
              locale === "mr"
                ? `नमस्कार, मला साई कृपा ग्रुपच्या '${name}' बद्दल अधिक माहिती हवी आहे.`
                : `Hello, I would like to enquire about '${name}' (Sai Krupa Group).`;

            return (
              <Reveal key={item.id} delay={idx * 0.06}>
                <div
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-lift ${tone.border} ${tone.glow}`}
                >
                  {/* Card top: Badge & Icon */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-extrabold tracking-wide uppercase ${tone.badge}`}
                      >
                        {badge}
                      </span>
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${tone.iconBox}`}
                      >
                        <GroupBusinessIcon id={item.id} className="h-6 w-6 transition-transform duration-300" />
                      </span>
                    </div>

                    {/* Category subtitle */}
                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted/90">
                      {category}
                    </p>

                    {/* Business Name */}
                    <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-ink group-hover:text-violet-deep transition-colors">
                      {name}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-[14px] leading-relaxed text-muted">
                      {desc}
                    </p>

                    {/* Highlight capsule */}
                    <div className="mt-4 rounded-xl bg-tint/80 p-2.5 text-[11.5px] font-semibold text-ink/80 border border-line/60">
                      <span className="text-violet-deep font-bold mr-1">✦</span>
                      {highlight}
                    </div>
                  </div>

                  {/* Card footer: WhatsApp Enquiry button */}
                  <div className="mt-6 pt-5 border-t border-line/60 flex items-center justify-between">
                    <a
                      href={whatsappLink(enquiryMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-lime-deep transition-all hover:text-ink hover:translate-x-1"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      <span>{g.enquire}</span>
                      <ArrowIcon className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
