"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface HeroCarouselImage {
  src: string;
  alt: string;
  /** CSS object-position value, e.g. "center 15%" or "25% 15%" */
  objectPosition?: string;
  /** Multiplier > 1 to zoom in further (crops dead space). Default = 1. */
  scale?: number;
}

interface HeroCarouselProps {
  images: HeroCarouselImage[];
  intervalMs?: number;
  children: React.ReactNode;
  className?: string;
}

export default function HeroCarousel({
  images,
  intervalMs = 7500,
  children,
  className = "min-h-[90vh]",
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [mountedIndexes, setMountedIndexes] = useState<Set<number>>(
    () => new Set([0])
  );
  const [readyIndexes, setReadyIndexes] = useState<Set<number>>(
    () => new Set([0])
  );
  const nextIndex = images.length > 0 ? (index + 1) % images.length : 0;

  // Mount the next slide only after the critical page load has finished. Because
  // every slide occupies the viewport, rendering all of them up front makes the
  // browser download the entire carousel even when the images are marked lazy.
  useEffect(() => {
    if (images.length <= 1) return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const idleWindow = window as Window & {
      requestIdleCallback?: Window["requestIdleCallback"];
      cancelIdleCallback?: Window["cancelIdleCallback"];
    };

    const mountNext = () => {
      setMountedIndexes((mounted) => {
        if (mounted.has(nextIndex)) return mounted;
        const next = new Set(mounted);
        next.add(nextIndex);
        return next;
      });
    };

    const scheduleMount = () => {
      if (typeof idleWindow.requestIdleCallback === "function") {
        idleId = idleWindow.requestIdleCallback(mountNext, { timeout: 2_000 });
      } else {
        timeoutId = window.setTimeout(mountNext, 250);
      }
    };

    if (document.readyState === "complete") scheduleMount();
    else window.addEventListener("load", scheduleMount, { once: true });

    return () => {
      window.removeEventListener("load", scheduleMount);
      if (idleId !== undefined && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [images.length, nextIndex]);

  // Start the display interval only when the incoming image has loaded and
  // decoded, so slow connections never fade the current slide into a blank one.
  useEffect(() => {
    if (images.length <= 1 || !readyIndexes.has(nextIndex)) return;
    const id = window.setTimeout(() => setIndex(nextIndex), intervalMs);
    return () => window.clearTimeout(id);
  }, [images.length, intervalMs, nextIndex, readyIndexes]);

  const markReady = async (i: number, image: HTMLImageElement) => {
    try {
      await image.decode();
    } catch {
      // A completed load is still safe to display when decode() is unsupported
      // or rejects for a browser-specific reason.
    }
    setReadyIndexes((ready) => {
      if (ready.has(i)) return ready;
      const next = new Set(ready);
      next.add(i);
      return next;
    });
  };

  return (
    <section
      className={`relative flex flex-col justify-end items-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 z-0">
        {images.map((img, i) => {
          if (!mountedIndexes.has(i)) return null;

          return (
            <div
              key={img.src}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== index}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="100vw"
                className="object-cover"
                style={{
                  ...(img.objectPosition ? { objectPosition: img.objectPosition } : {}),
                  ...(img.scale && img.scale !== 1
                    ? { transform: `scale(${img.scale})`, transformOrigin: "center" }
                    : {}),
                }}
                priority={i === 0}
                fetchPriority={i === 0 ? "high" : undefined}
                onLoad={(event) => void markReady(i, event.currentTarget)}
              />
            </div>
          );
        })}

        {/* Uniform translucent wash so the nav reads against any photo */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Bottom scrim that deepens behind the headline area */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>

      {/* Content sits in the bottom third (rule of thirds) */}
      <div className="relative z-10 w-full text-center px-4 pb-[16vh] md:pb-[14vh]">
        {children}
      </div>
    </section>
  );
}
