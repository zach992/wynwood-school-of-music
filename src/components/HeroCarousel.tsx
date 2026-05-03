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

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <section
      className={`relative flex flex-col justify-end items-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 z-0">
        {images.map((img, i) => (
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
            />
          </div>
        ))}

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
