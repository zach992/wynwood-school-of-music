"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroCarouselProps {
  images: { src: string; alt: string }[];
  intervalMs?: number;
  children: React.ReactNode;
  className?: string;
  overlayClass?: string;
}

export default function HeroCarousel({
  images,
  intervalMs = 7500,
  children,
  className = "min-h-[80vh]",
  overlayClass = "bg-black/50",
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
    <section className={`relative flex items-center justify-center overflow-hidden ${className}`}>
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
              priority={i === 0}
            />
          </div>
        ))}
        <div className={`absolute inset-0 ${overlayClass}`} />
      </div>

      <div className="relative z-10 w-full">{children}</div>

      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show hero image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-10 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
