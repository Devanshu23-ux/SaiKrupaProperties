"use client";

import { useEffect, useState } from "react";

/**
 * The current year is an unstable value, so it is read after mount
 * rather than during the prerender (Cache Components rule).
 */
export function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  return <>{year ?? ""}</>;
}
