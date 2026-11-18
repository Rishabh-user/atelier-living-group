"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type Slide = {
  id: string;
  kicker: string;
  title: string;
  line: string;
  cta: { label: string; href: string };
  alt: string;
  image: string;
  /** Separate crops so a phone shows the subject, not the middle of a wide frame. */
  posDesktop: string;
  posMobile: string;
};

const slides: Slide[] = [
  {
    id: "brand",
    kicker: "Poggenpohl Atlanta by Atelier Living Group",
    title: "A New Standard of Living.",
    line: "German engineering. Timeless design. Exceptional craftsmanship.",
    cta: { label: "Explore Poggenpohl", href: "/poggenpohl" },
    alt: "Poggenpohl TAGLIO kitchen with sculpted, faceted fronts",
    image: "/products/taglio/taglio-09.jpg",
    posDesktop: "50% 50%",
    posMobile: "42% 50%",
  },
  {
    id: "lifestyle",
    kicker: "Lifestyle",
    title: "Designed Around You.",
    line: "Beautifully considered spaces. Created for the way you live.",
    cta: { label: "Discover Our Approach", href: "/about" },
    alt: "Poggenpohl +VENOVO island with a warm orange tall unit and built-in appliances",
    image: "/products/venovo/venovo-02.jpg",
    posDesktop: "50% 60%",
    posMobile: "38% 50%",
  },
  {
    id: "showroom",
    kicker: "Showroom experience",
    title: "Experience Poggenpohl in Atlanta.",
    line: "Explore extraordinary kitchens and the possibilities of personalized design.",
    cta: { label: "Visit Our Showroom", href: "/showroom" },
    alt: "Poggenpohl +SEGMENTO kitchen with a dark fluted island under a skylight",
    image: "/products/segmento/segmento-00.jpg",
    posDesktop: "50% 50%",
    posMobile: "46% 50%",
  },
];

const INTERVAL = 9000;

/**
 * Three slides, gentle cross-fade, manual arrows and indicators.
 *
 * Autoplay is slow, pauses while the pointer or keyboard focus is inside, and
 * stops for good once someone uses the controls. Visitors who ask for reduced
 * motion get no autoplay and no fade. Inactive slides are hidden from assistive
 * tech and cannot take focus.
 */
export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced || paused || manual) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [reduced, paused, manual, index]);

  const go = useCallback((next: number) => {
    setManual(true);
    setIndex((next + slides.length) % slides.length);
  }, []);

  return (
    <section
      className="hero hero-slider"
      id="top"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        const Title = i === 0 ? "h1" : "h2";
        return (
          <div
            key={slide.id}
            className="hs-slide"
            data-active={active}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={active ? undefined : true}
            inert={!active}
            style={
              {
                "--pos-d": slide.posDesktop,
                "--pos-m": slide.posMobile,
              } as CSSProperties
            }
          >
            <Image
              className="hs-media"
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={i === 0}
            />
            <div className="hero-shade" />
            <div className="hero-stage">
              <Image
                className="brand-logo on-dark hero-poggenpohl"
                src="/brand/poggenpohl-logo-black.svg"
                alt="Poggenpohl"
                width={75}
                height={48}
                unoptimized
              />
              <p className="hero-kicker">{slide.kicker}</p>
              <Title>{slide.title}</Title>
              <p className="hero-lede">{slide.line}</p>
              <div className="hero-actions">
                <Button asChild variant="light" size="wide">
                  <Link href={slide.cta.href} scroll={false}>
                    {slide.cta.label}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="hs-controls">
        <div className="hs-dots" role="group" aria-label="Choose a slide">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show slide ${i + 1}: ${slide.title}`}
              aria-current={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <span className="hs-count" aria-hidden="true">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
        <div className="hs-arrows">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {slides.length}
      </p>
    </section>
  );
}
