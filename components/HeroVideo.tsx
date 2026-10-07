"use client";

import { useEffect, useRef } from "react";

/**
 * Looping background film for the homepage hero.
 *
 * The poster is the still the browser paints first, so the hero never shows an
 * empty frame while the file loads. preload="metadata" keeps mobile data use
 * low; autoplay still starts as soon as enough has buffered. Visitors who ask
 * for reduced motion get the still frame instead of a moving picture.
 */
export default function HeroVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
    }
  }, []);

  return (
    <video
      ref={ref}
      className="hero-image"
      src={src}
      poster={poster}
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
