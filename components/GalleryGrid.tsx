"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

import type { GalleryItem } from "@/content/gallery";

const filters = [
  { key: "all", label: "All" },
  { key: "collections", label: "Collections" },
  { key: "projects", label: "Projects" },
] as const;

type Filter = (typeof filters)[number]["key"];

/**
 * Masonry gallery with a category filter and a lightbox.
 *
 * Every tile is a real button, so the gallery is fully keyboard-operable. The
 * lightbox traps nothing it does not need to: Escape closes it, the arrow keys
 * step through the visible set, and focus returns to the tile that opened it.
 */
export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);

  const visible =
    filter === "all" ? items : items.filter((item) => item.category === filter);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpen((index) =>
        index === null ? index : (index + delta + visible.length) % visible.length,
      );
    },
    [visible.length],
  );

  useEffect(() => {
    if (open === null) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : visible[open];

  return (
    <>
      <div className="gallery-filters" role="group" aria-label="Filter photos">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => {
              setFilter(key);
              setOpen(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="gallery-grid">
        {visible.map((item, i) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={(event) => {
                opener.current = event.currentTarget;
                setOpen(i);
              }}
              aria-label={`Open photo: ${item.caption}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              />
              <span className="gallery-caption">{item.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      {current ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
        >
          {/* Click-away layer; keyboard users close with Escape or the button. */}
          <div
            className="lightbox-backdrop"
            role="presentation"
            onClick={close}
          />
          <button
            type="button"
            className="lightbox-close"
            onClick={close}
            aria-label="Close"
            ref={closeButton}
          >
            <X />
          </button>
          <button
            type="button"
            className="lightbox-nav prev"
            onClick={() => step(-1)}
            aria-label="Previous photo"
          >
            <ChevronLeft />
          </button>
          <figure>
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="100vw"
              priority
            />
            <figcaption>
              <span>{current.caption}</span>
              {current.href ? (
                <Link href={current.href} onClick={close}>
                  View collection
                  <ArrowRight />
                </Link>
              ) : null}
            </figcaption>
          </figure>
          <button
            type="button"
            className="lightbox-nav next"
            onClick={() => step(1)}
            aria-label="Next photo"
          >
            <ChevronRight />
          </button>
        </div>
      ) : null}
    </>
  );
}
