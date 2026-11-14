"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Copy } from "@/lib/copy";
import { getLayout, type Plot, type Pt, type ProjectSlug } from "@/lib/plots";
import { formatInrShort, formatNumber } from "@/lib/units";
import { plotEnquiry } from "@/lib/enquiry";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import { toPath, viewBoxFor } from "./svg-geo";

const Site3D = dynamic(() => import("@/components/site-3d").then((m) => m.Site3D), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center text-sm font-semibold text-muted">3D…</div>
  ),
});

interface PlotExplorerProps {
  slug: ProjectSlug;
  projectName: string;
  copy: Copy;
  pricePerGuntha: number | null;
  locale: "en" | "mr";
}

type Selection = { kind: "plot"; id: string } | { kind: "amenity" } | { kind: "garden" } | { kind: "river" } | null;

const FILL = {
  plot: "#8dc9a5",
  plotDim: "#e1f0e7",
  hover: "#e6c76e",
  selected: "#cf6f66",
};

export function PlotExplorer({ slug, projectName, copy, pricePerGuntha, locale }: PlotExplorerProps) {
  const layout = useMemo(() => getLayout(slug), [slug]);
  const t = copy.project;

  const [view, setView] = useState<"2d" | "3d">("2d");
  const [selected, setSelected] = useState<Selection>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [filter, setFilter] = useState<number | null>(null);
  const [panning, setPanning] = useState(false);

  const base = useMemo(() => {
    const v = viewBoxFor(layout, slug === "shivare" ? 10 : 18, slug === "shivare" ? "plots" : "site");
    // Shivare: leave room at the left and bottom for the start of the access road.
    return slug === "shivare" ? { x: v.x - 125, y: v.y, w: v.w + 125, h: v.h + 70 } : v;
  }, [layout, slug]);
  const [vb, setVb] = useState(base);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedPlot = selected?.kind === "plot" ? layout.plots.find((p) => p.id === selected.id) ?? null : null;

  // Phones: the plan can be panned only once zoomed in, so a swipe on an
  // un-zoomed plan still scrolls the page.
  const zoomed = vb.w < base.w * 0.98;

  // On narrow screens the detail panel sits under the plan; bring it into view.
  const panelRef = useRef<HTMLElement>(null);
  const selectedKey = selectedPlot?.id ?? selected?.kind ?? null;
  useEffect(() => {
    if (!selectedKey || typeof window === "undefined" || window.innerWidth >= 1024) return;
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedKey]);

  const sizeKey = useCallback((p: Plot) => (slug === "shivare" ? p.statedAre ?? 0 : p.areaSqft), [slug]);
  const sizes = useMemo(() => [...new Set(layout.plots.map(sizeKey))].sort((a, b) => a - b), [layout, sizeKey]);
  const matches = useCallback((p: Plot) => filter === null || sizeKey(p) === filter, [filter, sizeKey]);

  const selectPlot = useCallback((id: string) => setSelected({ kind: "plot", id }), []);

  /* --- pan / zoom for the 2D plan --- */
  const zoom = (factor: number) =>
    setVb((v) => {
      const w = Math.min(base.w * 1.4, Math.max(base.w / 6, v.w * factor));
      const h = w * (base.h / base.w);
      return { x: v.x + (v.w - w) / 2, y: v.y + (v.h - h) / 2, w, h };
    });

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, vx: vb.x, vy: vb.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    const svg = svgRef.current;
    if (!d || !svg) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    d.moved = true;
    setPanning(true);
    const rect = svg.getBoundingClientRect();
    const scale = vb.w / rect.width;
    setVb((v) => ({ ...v, x: d.vx - dx * scale, y: d.vy - dy * scale }));
  };
  const onPointerUp = () => {
    setPanning(false);
    window.setTimeout(() => (drag.current = null), 0);
  };
  const guardClick = (fn: () => void) => () => {
    if (drag.current?.moved) return;
    fn();
  };

  /* --- labels --- */
  const labelSize = slug === "shivare" ? 8.5 : 6.6;

  /* --- details --- */
  const enquiry = selectedPlot ? plotEnquiry(locale, projectName, slug, selectedPlot) : "";

  const price =
    selectedPlot && pricePerGuntha ? selectedPlot.areaGuntha * pricePerGuntha : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* ───────── Map ───────── */}
      <div className="min-w-0 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-card sm:rounded-[2rem]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-3 sm:p-4">
          <div className="flex rounded-full bg-tint p-1 text-sm font-bold">
            {(["2d", "3d"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`rounded-full px-5 py-2 transition-all ${
                  view === v ? "bg-brand text-white shadow-md" : "text-muted hover:text-ink"
                }`}
              >
                {v === "2d" ? t.view2d : t.view3d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-muted">
            <Legend color={FILL.plot} label={t.legendPlot} />
            <Legend color="#cf6f66" label={t.legendSelected} />
            {layout.garden && <Legend color="#b5d8c0" label={t.legendGarden} />}
            {layout.amenity && <Legend color="#a9b8cf" label={t.legendAmenity} />}
            {layout.river && <Legend color="#7bb8c4" label={t.legendRiver} />}
            <Legend color="#e3e9f1" label={t.legendRoad} />
          </div>
        </div>

        <div className="relative h-[58svh] min-h-[360px] w-full bg-[linear-gradient(180deg,#f1f3f0,#ffffff)] sm:min-h-[420px] lg:h-[72svh]">
          {view === "2d" ? (
            <>
              <svg
                ref={svgRef}
                viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
                className={`h-full w-full select-none ${zoomed ? "touch-none" : "touch-pan-y"}`}
                style={{ cursor: panning ? "grabbing" : "grab" }}
                role="group"
                aria-label={t.explore}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                <defs>
                  <pattern id="pe-dots" width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill="#d5ebdc" />
                    <circle cx="3" cy="3" r="0.9" fill="#8dbf9c" />
                  </pattern>
                  <pattern id="pe-water" width="14" height="8" patternUnits="userSpaceOnUse">
                    <rect width="14" height="8" fill="#cfe9ee" />
                    <path d="M0 5q3.5-3 7 0t7 0" fill="none" stroke="#7bb8c4" strokeWidth="0.9" />
                  </pattern>
                  <pattern id="pe-amenity" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="6" height="6" fill="#e3e9f1" />
                    <rect width="2.4" height="6" fill="#a9b8cf" />
                  </pattern>
                </defs>

                {layout.river && <path d={toPath(layout.river)} fill="url(#pe-water)" />}
                {layout.boundary && (
                  <path d={toPath(layout.boundary)} fill="#e7ebf1" stroke="#9fb0c6" strokeWidth="1.2" strokeLinejoin="round" />
                )}
                {layout.roads.map((r, i) => (
                  <path key={i} d={toPath(r)} fill="#e7ebf1" stroke="#9fb0c6" strokeWidth="0.8" />
                ))}
                {layout.garden && (
                  <path
                    d={toPath(layout.garden)}
                    fill="url(#pe-dots)"
                    stroke={selected?.kind === "garden" ? "#cf6f66" : "#8dbf9c"}
                    strokeWidth={selected?.kind === "garden" ? 2.4 : 1}
                    className="cursor-pointer"
                    onClick={guardClick(() => setSelected({ kind: "garden" }))}
                  />
                )}
                {layout.amenity && (
                  <path
                    d={toPath(layout.amenity.points)}
                    fill="url(#pe-amenity)"
                    stroke={selected?.kind === "amenity" ? "#cf6f66" : "#6f93b5"}
                    strokeWidth={selected?.kind === "amenity" ? 2.4 : 1}
                    className="cursor-pointer"
                    onClick={guardClick(() => setSelected({ kind: "amenity" }))}
                  />
                )}

                {layout.plots.map((p) => {
                  const isSel = selectedPlot?.id === p.id;
                  const isHover = hovered === p.id;
                  const dim = !matches(p);
                  return (
                    <path
                      key={p.id}
                      d={toPath(p.points)}
                      fill={isSel ? FILL.selected : isHover ? FILL.hover : dim ? FILL.plotDim : FILL.plot}
                      stroke="#fff"
                      strokeWidth={isSel ? 2.2 : 1.4}
                      strokeLinejoin="round"
                      tabIndex={0}
                      role="button"
                      aria-label={`${t.plot} ${p.no}`}
                      className="cursor-pointer outline-none transition-[fill] duration-150"
                      onPointerEnter={() => setHovered(p.id)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(p.id)}
                      onBlur={() => setHovered(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          selectPlot(p.id);
                        }
                      }}
                      onClick={guardClick(() => selectPlot(p.id))}
                    />
                  );
                })}

                {/* numbers */}
                {layout.plots.map((p) => (
                  <text
                    key={`n-${p.id}`}
                    x={p.centroid[0]}
                    y={p.centroid[1]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={labelSize}
                    fontWeight={800}
                    fill={selectedPlot?.id === p.id || hovered === p.id ? "#fff" : "#2f5d44"}
                    className="pointer-events-none"
                    style={{ paintOrder: "stroke" }}
                  >
                    {p.no}
                  </text>
                ))}

                {/* road widths */}
                {layout.roadLabels.map((l, i) => (
                  <g key={i} transform={`translate(${l.at[0]} ${l.at[1]})`} className="pointer-events-none">
                    <rect x={-9} y={-4} width={18} height={8} rx={4} fill="#fff" stroke="#9fb0c6" strokeWidth="0.6" />
                    <text textAnchor="middle" dominantBaseline="central" fontSize={4.6} fontWeight={800} fill="#3f6485">
                      {l.text}
                    </text>
                  </g>
                ))}

                {layout.amenity && (
                  <text
                    x={layout.amenity.centroid[0] - 12}
                    y={layout.amenity.centroid[1] + 6}
                    textAnchor="end"
                    fontSize={5.5}
                    fontWeight={800}
                    fill="#3f6485"
                    className="pointer-events-none"
                  >
                    {t.amenityName}
                  </text>
                )}
                {layout.garden && (
                  <text
                    x={centroidOf(layout.garden)[0]}
                    y={centroidOf(layout.garden)[1]}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={800}
                    fill="#3f7a55"
                    className="pointer-events-none"
                  >
                    {t.gardenName}
                  </text>
                )}
                {layout.river && (
                  <text
                    x={centroidOf(layout.river)[0]}
                    y={centroidOf(layout.river)[1]}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={800}
                    fill="#3d7f8d"
                    className="pointer-events-none"
                  >
                    {t.riverName}
                  </text>
                )}
                {slug === "shivare" && layout.accessHint && (
                  <g transform={`translate(${layout.accessHint[0]} ${layout.accessHint[1]})`} className="pointer-events-none">
                    <rect x={-62} y={8} width={124} height={22} rx={11} fill="#9a6428" />
                    <text y={19.5} fontSize={7.4} fontWeight={800} fill="#fff" textAnchor="middle" dominantBaseline="central">
                      ← {t.toHighway}
                    </text>
                  </g>
                )}
              </svg>

              <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-2xl bg-white/95 shadow-card">
                <button type="button" onClick={() => zoom(0.75)} aria-label="Zoom in" className="grid h-10 w-10 place-items-center text-xl font-bold text-ink hover:bg-violet-soft">+</button>
                <button type="button" onClick={() => zoom(1.33)} aria-label="Zoom out" className="grid h-10 w-10 place-items-center border-y border-line text-xl font-bold text-ink hover:bg-violet-soft">−</button>
                <button type="button" onClick={() => setVb(base)} aria-label="Reset" className="grid h-10 w-10 place-items-center text-sm font-bold text-ink hover:bg-violet-soft">⟲</button>
              </div>
            </>
          ) : (
            <Site3D
              layout={layout}
              selected={selectedPlot?.id ?? (selected?.kind ?? null)}
              hovered={hovered}
              filter={filter}
              onHover={setHovered}
              onSelectPlot={selectPlot}
              onSelectArea={(kind) => setSelected({ kind })}
              note={slug === "yevali" ? t.note3d : t.note3dFlat}
              toHighway={t.toHighway}
              notToScale={t.notToScale}
              labels={{ amenity: t.amenityName, garden: t.gardenName, river: t.riverName }}
            />
          )}
        </div>
      </div>

      {/* ───────── Detail panel ───────── */}
      <aside ref={panelRef} className="min-w-0 scroll-mt-24 rounded-[2rem] border border-line bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24 lg:self-start">
        {selectedPlot ? (
          <PlotDetail
            plot={selectedPlot}
            copy={copy}
            slug={slug}
            price={price}
            pricePerGuntha={pricePerGuntha}
            whatsappHref={whatsappLink(enquiry)}
            onClose={() => setSelected(null)}
          />
        ) : selected?.kind === "amenity" && layout.amenity ? (
          <AreaDetail
            title={t.amenityName}
            lines={[`${formatNumber(layout.amenity.areaSqft, 0)} ${t.sqft}`, `${formatNumber(layout.amenity.areaSqft / 1089)} ${t.guntha}`]}
            onClose={() => setSelected(null)}
            closeLabel={t.close}
            tone="violet"
          />
        ) : selected?.kind === "garden" ? (
          <AreaDetail title={t.gardenName} lines={[t.gardenSide]} onClose={() => setSelected(null)} closeLabel={t.close} tone="lime" />
        ) : selected?.kind === "river" ? (
          <AreaDetail title={t.riverName} lines={[]} onClose={() => setSelected(null)} closeLabel={t.close} tone="river" />
        ) : (
          <div className="grid min-h-[200px] place-items-center text-center">
            <div>
              <div className="bg-brand mx-auto grid h-14 w-14 place-items-center rounded-2xl text-2xl text-white shadow-lg">☝</div>
              <p className="mt-4 text-base font-bold text-ink">{t.selectHint}</p>
              <p className="mt-1 text-sm text-muted">{t.exploreNote}</p>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-line pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">{t.plotsList}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Chip active={filter === null} onClick={() => setFilter(null)}>{t.filterAll}</Chip>
            {sizes.map((s) => (
              <Chip key={s} active={filter === s} onClick={() => setFilter(filter === s ? null : s)}>
                {slug === "shivare" ? `${formatNumber(s, 1)} ${t.are}` : formatNumber(s, 0)}
              </Chip>
            ))}
          </div>
          <div className="mt-4 grid max-h-52 grid-cols-5 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-6 lg:grid-cols-5">
            {layout.plots.map((p) => {
              const on = selectedPlot?.id === p.id;
              const ok = matches(p);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPlot(p.id)}
                  onPointerEnter={() => setHovered(p.id)}
                  onPointerLeave={() => setHovered(null)}
                  aria-pressed={on}
                  className={`rounded-xl py-2 text-sm font-extrabold transition-all ${
                    on
                      ? "bg-pink-deep text-white shadow-md"
                      : ok
                        ? "bg-lime-soft text-lime-deep hover:bg-lime-deep hover:text-white"
                        : "bg-tint text-muted/60"
                  }`}
                >
                  {p.no}
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

function centroidOf(points: Pt[]): Pt {
  const n = points.length;
  return [points.reduce((s, p) => s + p[0], 0) / n, points.reduce((s, p) => s + p[1], 0) / n];
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-3 w-3 rounded" style={{ background: color }} />
      {label}
    </span>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
        active ? "bg-violet-deep text-white" : "bg-tint text-ink hover:bg-violet-soft"
      }`}
    >
      {children}
    </button>
  );
}

function AreaDetail({
  title,
  lines,
  onClose,
  closeLabel,
  tone,
}: {
  title: string;
  lines: string[];
  onClose: () => void;
  closeLabel: string;
  tone: "violet" | "lime" | "river";
}) {
  const bg = { violet: "bg-violet-soft", lime: "bg-lime-soft", river: "bg-river-soft" }[tone];
  return (
    <div className={`rounded-3xl p-5 ${bg}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-2xl font-extrabold">{title}</h3>
        <button type="button" onClick={onClose} className="rounded-full bg-white px-3 py-1 text-xs font-bold">{closeLabel}</button>
      </div>
      {lines.map((l) => (
        <p key={l} className="mt-2 text-base font-semibold text-ink/80">{l}</p>
      ))}
    </div>
  );
}

function PlotDetail({
  plot,
  copy,
  slug,
  price,
  pricePerGuntha,
  whatsappHref,
  onClose,
}: {
  plot: Plot;
  copy: Copy;
  slug: ProjectSlug;
  price: number | null;
  pricePerGuntha: number | null;
  whatsappHref: string;
  onClose: () => void;
}) {
  const t = copy.project;
  const rows: [string, string][] =
    slug === "shivare"
      ? [
          [t.statedArea, `${formatNumber(plot.statedAre ?? 0, 2)} ${t.are}`],
          [t.sqm, formatNumber(plot.areaSqm, 0)],
          [t.sqft, formatNumber(plot.areaSqft, 0)],
          [t.guntha, formatNumber(plot.areaGuntha, 2)],
        ]
      : [
          [t.sqft, formatNumber(plot.areaSqft, 0)],
          [t.guntha, formatNumber(plot.areaGuntha, 2)],
          [t.sqm, formatNumber(plot.areaSqm, 0)],
          [t.acre, formatNumber(plot.areaSqft / 43560, 3)],
        ];

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">{t.plot}</p>
          <p className="text-brand text-6xl font-extrabold leading-none">{plot.no}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-soft px-3 py-1.5 text-xs font-extrabold text-lime-deep">
            <span className="h-2 w-2 rounded-full bg-lime" />
            {t.available}
          </span>
          <button type="button" onClick={onClose} className="text-xs font-bold text-muted underline-offset-2 hover:underline">
            {t.close}
          </button>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2.5">
        {rows.map(([label, value], i) => (
          <div key={label} className={`rounded-2xl p-3.5 ${i === 0 ? "bg-violet-soft" : "bg-tint"}`}>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
            <dd className="mt-1 text-lg font-extrabold text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      {slug === "shivare" && (
        <p className="mt-3 rounded-2xl bg-sun-soft/70 px-3.5 py-2.5 text-xs font-semibold leading-relaxed text-ink/80">
          {t.statedNote}
        </p>
      )}

      <div className="mt-3 rounded-2xl bg-sun-soft p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{t.price}</p>
        {price && pricePerGuntha ? (
          <>
            <p className="mt-1 text-xl font-extrabold text-ink">≈ {formatInrShort(price)}</p>
            <p className="mt-0.5 text-xs text-muted">
              ₹{formatNumber(pricePerGuntha, 0)} / {t.guntha}. {t.priceNote}
            </p>
          </>
        ) : (
          <p className="mt-1 text-lg font-extrabold text-ink">{t.priceOnRequest}</p>
        )}
      </div>

      {plot.note === "garden" && (
        <p className="mt-3 rounded-2xl bg-lime-soft px-3.5 py-2.5 text-sm font-semibold text-lime-deep">{t.gardenSide}</p>
      )}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center justify-center gap-2.5 rounded-full bg-lime-deep px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-lime/30 transition-transform hover:-translate-y-0.5"
      >
        <WhatsAppIcon className="h-5 w-5" />
        {t.enquire}
      </a>
    </div>
  );
}
