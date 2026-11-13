import type { ReactNode } from "react";

type IconProps = { className?: string };

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2Zm0 18.02c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.13 8.13 0 0 1-1.25-4.36c0-4.48 3.65-8.13 8.14-8.13 4.48 0 8.13 3.65 8.13 8.13 0 4.49-3.65 8.14-8.13 8.14Zm4.47-6.09c-.24-.12-1.45-.72-1.67-.8-.23-.09-.39-.13-.55.12-.16.25-.63.8-.77.97-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.45-1.35-1.69-.14-.25-.02-.38.11-.5.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7.5 8 6 8-6" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

/** Four tile icons for the "what we do" row. */
export function TileIcon({ index, className }: { index: number; className?: string }): ReactNode {
  const common = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (index) {
    case 0:
      return (
        <svg {...common}>
          <path d="M4 10 16 4l12 6v13l-12 5-12-5Z" />
          <path d="M16 4v24M4 10l12 6 12-6" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M4 27V14l8 4v-4l8 4v-4l8 4v13Z" />
          <path d="M9 27v-4M16 27v-4M23 27v-4" />
          <path d="M22 8V4" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <path d="M3 22c3-3 5-3 8 0s5 3 8 0 5-3 8 0" />
          <path d="M3 28c3-3 5-3 8 0s5 3 8 0 5-3 8 0" />
          <path d="M16 18V8M16 8c-4-1-6-4-6-6 4 0 6 2 6 6Zm0 4c4-1 6-3 6-6-4 0-6 2-6 6Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M16 28s9-7.5 9-15a9 9 0 0 0-18 0c0 7.5 9 15 9 15Z" />
          <path d="m12 13 3 3 5-6" />
        </svg>
      );
  }
}
