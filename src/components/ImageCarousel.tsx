"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
  intervalMs?: number;
  aspectClass?: string;
  visible?: 1 | 2 | 3;
}

const widthVarClasses: Record<1 | 2 | 3, string> = {
  1: "[--item-w:88%] md:[--item-w:75%]",
  2: "[--item-w:88%] md:[--item-w:calc((100%-1rem)/2)]",
  3: "[--item-w:88%] md:[--item-w:calc((100%-2rem)/3)]",
};

export default function ImageCarousel({
  images,
  intervalMs = 5500,
  aspectClass = "aspect-[4/3]",
  visible = 2,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const maxStart = Math.max(0, images.length - visible);
  const stops = maxStart + 1;

  const goTo = useCallback(
    (i: number) => {
      const wrapped = ((i % stops) + stops) % stops;
      setIndex(wrapped);
    },
    [stops]
  );

  useEffect(() => {
    if (images.length <= visible) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % stops);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs, stops, visible]);

  const showControls = images.length > visible;
  const widthCls = widthVarClasses[visible];

  return (
    <div className="relative">
      <div className={`overflow-hidden ${widthCls}`}>
        <div
          className="flex gap-4 transition-transform duration-700 ease-out will-change-transform"
          style={{
            transform: `translateX(calc(-${index} * (var(--item-w) + 1rem)))`,
          }}
        >
          {images.map((img, i) => (
            <div
              key={img.src}
              className={`shrink-0 w-[var(--item-w)] ${aspectClass} relative overflow-hidden rounded bg-wsm-darker`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 50vw, 88vw"
                className="object-cover"
                priority={i < visible}
              />
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute left-2 md:-left-5 top-[40%] z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/55 hover:bg-wsm-accent text-white flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-wsm-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-2 md:-right-5 top-[40%] z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/55 hover:bg-wsm-accent text-white flex items-center justify-center transition-colors backdrop-blur-sm border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-wsm-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {showControls && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: stops }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-wsm-accent"
                  : "w-1.5 bg-white/30 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
