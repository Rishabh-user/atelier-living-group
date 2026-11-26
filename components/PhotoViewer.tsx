"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type ViewerImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Full-screen photo viewer: arrows and swipe to move, Escape or the backdrop
 * to close. The caller owns which photo is open and what happens on close.
 */
export default function PhotoViewer({
  images,
  index,
  title,
  onClose,
  onStep,
}: {
  images: ViewerImage[];
  index: number;
  title: string;
  onClose: () => void;
  onStep: (direction: number) => void;
}) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, onStep]);

  const current = images[index];
  if (!current) return null;

  return (
    <div
      className="plbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        const end = e.changedTouches[0]?.clientX;
        if (start === null || end === undefined) return;
        if (Math.abs(end - start) > 50) onStep(end < start ? 1 : -1);
      }}
    >
      <button
        type="button"
        className="plbox-backdrop"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
      />
      <button
        ref={closeBtn}
        type="button"
        className="plbox-btn plbox-close"
        aria-label="Close"
        onClick={onClose}
      >
        <X />
      </button>
      {images.length > 1 ? (
        <>
          <button
            type="button"
            className="plbox-btn plbox-prev"
            aria-label="Previous photo"
            onClick={() => onStep(-1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="plbox-btn plbox-next"
            aria-label="Next photo"
            onClick={() => onStep(1)}
          >
            <ChevronRight />
          </button>
        </>
      ) : null}
      <figure>
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
          sizes="100vw"
          unoptimized
        />
        <figcaption>
          <strong>{title}</strong>
          <span>
            {index + 1} / {images.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}
