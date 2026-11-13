"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

/**
 * Scroll-triggered entrance. Honours `prefers-reduced-motion` by jumping
 * straight to the end state.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 28,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(element, { opacity: 1, y: 0 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.fromTo(
      element,
      { y: distance, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, distance]);

  return (
    <div ref={ref} className={`reveal-init ${className ?? ""}`}>
      {children}
    </div>
  );
}
