import type { Pt, SiteLayout } from "@/lib/plots";

export const toPath = (pts: Pt[]) =>
  pts.map(([x, z], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${z.toFixed(1)}`).join("") + "Z";

/**
 * View box (x y w h) around what is drawn, with a margin in metres.
 *   all   — everything, river included
 *   site  — plots, garden and amenity space (the river runs off the edge)
 *   plots — the plots only
 */
export function viewBoxFor(layout: SiteLayout, margin = 14, include: "all" | "site" | "plots" = "all") {
  let x0 = layout.bounds.minX;
  let x1 = layout.bounds.maxX;
  let z0 = layout.bounds.minZ;
  let z1 = layout.bounds.maxZ;

  if (include !== "all") {
    const sets: Pt[][] = layout.plots.map((p) => p.points);
    if (include === "site") {
      if (layout.garden) sets.push(layout.garden);
      if (layout.amenity) sets.push(layout.amenity.points);
    }
    x0 = Infinity; x1 = -Infinity; z0 = Infinity; z1 = -Infinity;
    for (const set of sets)
      for (const [x, z] of set) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x);
        z0 = Math.min(z0, z); z1 = Math.max(z1, z);
      }
  }
  return { x: x0 - margin, y: z0 - margin, w: x1 - x0 + margin * 2, h: z1 - z0 + margin * 2 };
}
