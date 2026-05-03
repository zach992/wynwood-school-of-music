"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  /**
   * 0 = no parallax (image scrolls with the section).
   * 1 = effectively fixed in viewport.
   * Default 0.4 — background appears to move at ~60% of scroll speed.
   */
  intensity?: number;
  /** Optional object-position passthrough, e.g. "center 30%" */
  objectPosition?: string;
}

export default function ParallaxImage({
  src,
  alt,
  intensity = 0.4,
  objectPosition,
}: ParallaxImageProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let ticking = false;
    const update = () => {
      const el = layerRef.current;
      const parent = el?.parentElement;
      if (!el || !parent) {
        ticking = false;
        return;
      }
      const rect = parent.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const distance = sectionCenter - vh / 2;
      const offset = -distance * intensity;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [intensity]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="absolute -top-[40%] -bottom-[40%] left-0 right-0 will-change-transform pointer-events-none"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
