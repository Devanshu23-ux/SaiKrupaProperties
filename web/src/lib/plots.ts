import yevaliJson from "@/data/yevali.json";
import shivareJson from "@/data/shivare.json";
import { areToSqft, sqftToGuntha, sqftToSqm } from "./units";

/**
 * Plot geometry traced from the vector paths of the supplied layout
 * sheets (see tools/build_geometry.py). Coordinates are metres on a plane,
 * x to the right and z downwards, exactly as the sheet reads when upright.
 * Every Yevali plot was checked against the area printed on the sheet.
 */
export type Pt = [number, number];
export type ProjectSlug = "shivare" | "yevali";

export type PlotStatus = "available" | "hold" | "booked" | "sold";

export interface Plot {
  id: string;
  no: string;
  points: Pt[];
  centroid: Pt;
  /** Area printed on the sheet (Yevali: sq.ft, Shivare: are). */
  areaSqft: number;
  areaGuntha: number;
  areaSqm: number;
  /** Shivare only: the figure printed against the plot, in are. */
  statedAre?: number;
  status: PlotStatus;
  /** Which road(s) the plot meets, as drawn on the sheet. */
  note?: "garden" | "river-side";
}

export interface RoadLabel {
  text: string;
  at: Pt;
}

export interface SiteLayout {
  slug: ProjectSlug;
  plots: Plot[];
  /** Site outline (Yevali) — drawn as the road-coloured base. */
  boundary?: Pt[];
  amenity?: { points: Pt[]; areaSqft: number; centroid: Pt };
  garden?: Pt[];
  river?: Pt[];
  /** Road ribbons (Shivare: spine + access road). */
  roads: Pt[][];
  roadLabels: RoadLabel[];
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  /** Where the access road leaves the drawing towards NH-48 (Shivare). */
  highwayEnd?: Pt;
  accessLengthM?: number;
  /** A point on the access road close to the plots, where the "to NH-48" marker sits. */
  accessHint?: Pt;
}

function polygonCentroid(points: Pt[]): Pt {
  let a = 0;
  let cx = 0;
  let cz = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, z1] = points[i];
    const [x2, z2] = points[(i + 1) % points.length];
    const f = x1 * z2 - x2 * z1;
    a += f;
    cx += (x1 + x2) * f;
    cz += (z1 + z2) * f;
  }
  a *= 0.5;
  if (Math.abs(a) < 1e-9) return points[0];
  return [cx / (6 * a), cz / (6 * a)];
}

function boundsOf(sets: Pt[][]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const set of sets)
    for (const [x, z] of set) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    }
  return { minX, maxX, minZ, maxZ };
}

/** Offsets a centre-line into a ribbon polygon of the given width. */
export function ribbon(line: Pt[], width: number): Pt[] {
  const half = width / 2;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < line.length; i++) {
    const prev = line[Math.max(0, i - 1)];
    const next = line[Math.min(line.length - 1, i + 1)];
    let dx = next[0] - prev[0];
    let dz = next[1] - prev[1];
    const len = Math.hypot(dx, dz) || 1;
    dx /= len;
    dz /= len;
    // Mitre the corner so the width stays constant through bends.
    const nx = -dz;
    const nz = dx;
    let scale = 1;
    if (i > 0 && i < line.length - 1) {
      const a = [line[i][0] - prev[0], line[i][1] - prev[1]];
      const b = [next[0] - line[i][0], next[1] - line[i][1]];
      const la = Math.hypot(a[0], a[1]) || 1;
      const lb = Math.hypot(b[0], b[1]) || 1;
      const cos = (a[0] * b[0] + a[1] * b[1]) / (la * lb);
      scale = 1 / Math.max(0.6, Math.sqrt((1 + cos) / 2));
    }
    left.push([line[i][0] + nx * half * scale, line[i][1] + nz * half * scale]);
    right.push([line[i][0] - nx * half * scale, line[i][1] - nz * half * scale]);
  }
  return [...left, ...right.reverse()];
}

export function polylineLength(line: Pt[]): number {
  let total = 0;
  for (let i = 1; i < line.length; i++)
    total += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
  return total;
}

/** Point `dist` metres along a polyline (clamped to its end). */
export function pointAlong(line: Pt[], dist: number): Pt {
  let left = dist;
  for (let i = 1; i < line.length; i++) {
    const seg = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
    if (left <= seg) {
      const t = left / seg;
      return [line[i - 1][0] + (line[i][0] - line[i - 1][0]) * t, line[i - 1][1] + (line[i][1] - line[i - 1][1]) * t];
    }
    left -= seg;
  }
  return line[line.length - 1];
}

/* ------------------------------ Yevali ------------------------------ */

function buildYevali(): SiteLayout {
  const d = yevaliJson as unknown as {
    plots: { no: string; areaSqft: number; points: Pt[] }[];
    amenity: { areaSqft: number; points: Pt[] };
    garden: Pt[];
    river: Pt[];
    boundary: Pt[];
    labels: { road30: Pt; road20: Pt[] };
  };

  // Plots 1–7 are the row between the 20 ft road and the garden.
  const gardenSide = new Set(["1", "2", "3", "4", "5", "6", "7"]);

  const plots: Plot[] = d.plots
    .map((p) => ({
      id: `yevali-${p.no}`,
      no: p.no,
      points: p.points,
      centroid: polygonCentroid(p.points),
      areaSqft: p.areaSqft,
      areaGuntha: sqftToGuntha(p.areaSqft),
      areaSqm: sqftToSqm(p.areaSqft),
      status: "available" as PlotStatus,
      note: gardenSide.has(p.no) ? ("garden" as const) : undefined,
    }))
    .sort((a, b) => Number(a.no) - Number(b.no));

  const amenity = {
    points: d.amenity.points,
    areaSqft: d.amenity.areaSqft,
    centroid: polygonCentroid(d.amenity.points),
  };

  const roadLabels: RoadLabel[] = [
    { text: "30 ft", at: d.labels.road30 },
    ...d.labels.road20.map((at) => ({ text: "20 ft", at })),
  ];

  return {
    slug: "yevali",
    plots,
    boundary: d.boundary,
    amenity,
    garden: d.garden,
    river: d.river,
    roads: [],
    roadLabels,
    bounds: boundsOf([...plots.map((p) => p.points), d.river, d.garden, d.boundary]),
  };
}

/* ------------------------------ Shivare ------------------------------ */

function buildShivare(): SiteLayout {
  const d = shivareJson as unknown as {
    plots: { no: string; statedAre: number; points: Pt[] }[];
    spine: Pt[];
    access: Pt[];
    roadWidthM: number;
  };

  const order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "12A"];
  const plots: Plot[] = order.map((no) => {
    const p = d.plots.find((item) => item.no === no)!;
    const areaSqft = areToSqft(p.statedAre);
    return {
      id: `shivare-${no}`,
      no,
      points: p.points,
      centroid: polygonCentroid(p.points),
      areaSqft,
      areaGuntha: sqftToGuntha(areaSqft),
      areaSqm: sqftToSqm(areaSqft),
      statedAre: p.statedAre,
      status: "available",
    };
  });

  const accessRibbon = ribbon(d.access, d.roadWidthM);
  const accessLengthM = polylineLength(d.access);
  const end = d.access[d.access.length - 1];

  const spineMid: Pt = [
    (d.spine[0][0] + d.spine[1][0] + d.spine[2][0] + d.spine[3][0]) / 4,
    (d.spine[0][1] + d.spine[1][1] + d.spine[2][1] + d.spine[3][1]) / 4,
  ];
  const mid = d.access[Math.floor(d.access.length / 2)];

  return {
    slug: "shivare",
    plots,
    roads: [d.spine, accessRibbon],
    roadLabels: [
      { text: "40 ft", at: spineMid },
      { text: "40 ft", at: mid },
    ],
    bounds: boundsOf([...plots.map((p) => p.points), d.spine, accessRibbon]),
    highwayEnd: end,
    accessLengthM,
    accessHint: pointAlong(d.access, 95),
  };
}

const cache: Partial<Record<ProjectSlug, SiteLayout>> = {};

export function getLayout(slug: ProjectSlug): SiteLayout {
  cache[slug] ??= slug === "yevali" ? buildYevali() : buildShivare();
  return cache[slug]!;
}

/** The access road alone (Shivare), as a centre-line for animation. */
export function shivareAccessLine(): Pt[] {
  return (shivareJson as unknown as { access: Pt[] }).access;
}

/* ------------------------------ Yevali terrain ------------------------------ */

/**
 * Indicative ground level for Yevali. The contour sheet shows the land
 * falling from about 601 m in the west to about 581 m at the river; a
 * plane is fitted through representative spot levels read from it.
 */
export function yevaliTerrain() {
  const layout = getLayout("yevali");
  const c = (no: string) => layout.plots.find((p) => p.no === no)!.centroid;
  const gardenC = polygonCentroid(layout.garden!);
  const samples: { p: Pt; h: number }[] = [
    { p: c("28"), h: 601 },
    { p: c("27"), h: 597 },
    { p: c("33"), h: 595.5 },
    { p: c("17"), h: 594 },
    { p: c("16"), h: 590 },
    { p: c("7"), h: 588 },
    { p: c("1"), h: 586 },
    { p: gardenC, h: 581 },
  ];
  // Least-squares plane h = a + b·x + c·z.
  const n = samples.length;
  let sx = 0, sz = 0, sh = 0, sxx = 0, szz = 0, sxz = 0, sxh = 0, szh = 0;
  for (const { p, h } of samples) {
    sx += p[0]; sz += p[1]; sh += h;
    sxx += p[0] * p[0]; szz += p[1] * p[1]; sxz += p[0] * p[1];
    sxh += p[0] * h; szh += p[1] * h;
  }
  const M = [
    [n, sx, sz],
    [sx, sxx, sxz],
    [sz, sxz, szz],
  ];
  const R = [sh, sxh, szh];
  const det = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D = det(M);
  const col = (i: number) => M.map((row, r) => row.map((v, k) => (k === i ? R[r] : v)));
  const a = det(col(0)) / D;
  const b = det(col(1)) / D;
  const cc = det(col(2)) / D;
  return (x: number, z: number) => a + b * x + cc * z;
}
