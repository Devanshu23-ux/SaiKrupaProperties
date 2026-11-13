"use client";

import dynamic from "next/dynamic";

const BuildingStage = dynamic(
  () => import("@/components/building-stage").then((m) => m.BuildingStage),
  { ssr: false, loading: () => <div className="h-full w-full" aria-hidden="true" /> },
);

/** The 3D building loads in the browser only; the page paints first. */
export function BuildingFigure({ hint }: { hint: string }) {
  return <BuildingStage hint={hint} />;
}
