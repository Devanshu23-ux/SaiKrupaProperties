import Image from "next/image";
import { site } from "@/lib/site";

/**
 * The official Sai Krupa Properties logo (public/logo.png, cropped from the
 * supplied artwork). Its backdrop is transparent, so it takes the
 * colour of whatever it sits on (header, footer). Size it with height classes.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt={site.nameEn}
      width={900}
      height={767}
      priority
      sizes="(min-width: 640px) 64px, 56px"
      className={`w-auto object-contain ${className}`}
    />
  );
}
