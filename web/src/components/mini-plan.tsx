import { getLayout, type ProjectSlug } from "@/lib/plots";
import { toPath, viewBoxFor } from "./svg-geo";

const PALETTE = {
  shivare: ["#dba36b", "#e6c76e", "#d9928a", "#e5b78a"],
  yevali: ["#7bb8c4", "#6f93b5", "#8dbf9c", "#9fcfd8"],
};

/** Small, decorative plan built from the real plot geometry (used on cards). */
export function MiniPlan({ slug, className }: { slug: ProjectSlug; className?: string }) {
  const layout = getLayout(slug);
  const vb = viewBoxFor(layout, 8, slug === "shivare" ? "plots" : "all");
  const colours = PALETTE[slug];

  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {layout.river && <path d={toPath(layout.river)} fill="rgba(255,255,255,0.35)" />}
      {layout.garden && <path d={toPath(layout.garden)} fill="rgba(255,255,255,0.55)" />}
      {layout.boundary && <path d={toPath(layout.boundary)} fill="rgba(255,255,255,0.22)" />}
      {layout.roads.map((r, i) => (
        <path key={i} d={toPath(r)} fill="rgba(255,255,255,0.5)" />
      ))}
      {layout.amenity && <path d={toPath(layout.amenity.points)} fill="#fff" opacity="0.9" />}
      {layout.plots.map((p, i) => (
        <path
          key={p.id}
          d={toPath(p.points)}
          fill={colours[i % colours.length]}
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
