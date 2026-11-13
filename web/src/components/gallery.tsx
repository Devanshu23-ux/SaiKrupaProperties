"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/lib/locales";
import { pick, type MediaItem } from "@/lib/projects";

/** Site videos and photos for one project. Videos load only when played. */
export function Gallery({ items, locale }: { items: MediaItem[]; locale: Locale }) {
  const videos = items.filter((i) => i.kind === "video");
  const images = items.filter((i) => i.kind === "image");

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {videos.map((v) => (
        <VideoCard key={v.src} item={v} locale={locale} />
      ))}
      {images.map((img) => (
        <a
          key={img.src}
          href={img.src}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-[1.75rem] bg-tint shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
        >
          <div className="relative aspect-[9/16] w-full">
            <Image src={img.src} alt={pick(img, locale)} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <Caption text={pick(img, locale)} />
        </a>
      ))}
    </div>
  );
}

function Caption({ text }: { text: string }) {
  return (
    <p className="absolute inset-x-2 bottom-2 rounded-xl bg-white/90 px-2.5 py-1.5 text-xs font-bold sm:inset-x-3 sm:bottom-3 sm:rounded-2xl sm:px-3.5 sm:py-2 sm:text-sm text-ink backdrop-blur">
      {text}
    </p>
  );
}

function VideoCard({ item, locale }: { item: MediaItem; locale: Locale }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-ink shadow-card">
      <div className="relative aspect-[9/16] w-full">
        {playing ? (
          <video
            src={item.src}
            poster={item.poster}
            className="absolute inset-0 h-full w-full object-cover"
            controls
            autoPlay
            playsInline
            loop
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play: ${pick(item, locale)}`}
            className="group absolute inset-0"
          >
            {item.poster && (
              <Image src={item.poster} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <span className="bg-brand absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {!playing && <Caption text={pick(item, locale)} />}
    </div>
  );
}
