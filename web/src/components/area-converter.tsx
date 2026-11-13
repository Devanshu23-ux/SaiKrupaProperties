"use client";

import { useState } from "react";
import type { Copy } from "@/lib/copy";
import { SQFT_PER_GUNTHA, formatNumber, sqftToAcre, sqftToGuntha, sqftToSqm } from "@/lib/units";

/** Two-way guntha ⟷ sq.ft converter with sq.m and acre read-outs. */
export function AreaConverter({ copy }: { copy: Copy }) {
  const c = copy.converter;
  const [sqft, setSqft] = useState("11000");

  const parsed = Number.parseFloat(sqft);
  const safe = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const gunthaText = sqft.trim() === "" ? "" : String(Number(sqftToGuntha(safe).toFixed(4)));

  function onGuntha(raw: string) {
    if (raw.trim() === "") return setSqft("");
    const g = Number.parseFloat(raw);
    if (!Number.isFinite(g) || g < 0) return;
    setSqft(String(Number((g * SQFT_PER_GUNTHA).toFixed(2))));
  }

  const input =
    "w-full bg-transparent text-3xl font-extrabold tabular-nums text-ink outline-none sm:text-4xl";

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-card">
      <div className="bg-brand h-1.5 w-full" />
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-6 pt-6 sm:px-8">
        <h3 className="text-2xl font-extrabold tracking-tight">{c.title}</h3>
        <p className="text-sm text-muted">{c.note}</p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-5 sm:p-8">
        <label className="block rounded-3xl bg-violet-soft p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-deep">{c.sqft}</span>
          <span className="field-line mt-3 block">
            <input type="number" inputMode="decimal" min="0" step="any" value={sqft} onChange={(e) => setSqft(e.target.value)} className={input} />
          </span>
        </label>
        <label className="block rounded-3xl bg-sunset-soft p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-sunset-deep">{c.guntha}</span>
          <span className="field-line mt-3 block">
            <input type="number" inputMode="decimal" min="0" step="any" value={gunthaText} onChange={(e) => onGuntha(e.target.value)} className={input} />
          </span>
        </label>
        <div className="rounded-3xl bg-river-soft p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-river-deep">{c.sqm}</p>
          <p className="mt-3 text-3xl font-extrabold tabular-nums sm:text-4xl">{formatNumber(sqftToSqm(safe))}</p>
        </div>
        <div className="rounded-3xl bg-lime-soft p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-lime-deep">{c.acre}</p>
          <p className="mt-3 text-3xl font-extrabold tabular-nums sm:text-4xl">{formatNumber(sqftToAcre(safe), 4)}</p>
        </div>
      </div>
    </div>
  );
}
