"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Play, X } from "lucide-react";

import type { Film } from "@/content/media";

/**
 * One film. The card is only a poster: it loads nothing else. Playing opens a
 * full-screen viewer with a single video, so two films can never play at once,
 * and closing the viewer removes the video, which stops its sound.
 */
export default function FilmCard({
  film,
  size = "default",
}: {
  film: Film;
  size?: "default" | "large";
}) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <figure className="film-card" data-size={size}>
      <div className="film-frame">
        <button
          ref={opener}
          type="button"
          className="film-play"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={`Play ${film.title}, ${film.collection}, ${film.length}`}
        >
          <Image
            src={film.poster}
            alt=""
            fill
            sizes={
              size === "large"
                ? "(max-width: 860px) 100vw, 66vw"
                : "(max-width: 860px) 100vw, 33vw"
            }
          />
          <span className="film-play-icon" aria-hidden="true">
            <Play />
          </span>
          <span className="film-length">{film.length}</span>
        </button>
      </div>
      <figcaption>
        <span>{film.collection}</span>
        <strong>{film.title}</strong>
      </figcaption>

      {open
        ? createPortal(
            <div
              className="film-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${film.collection}: ${film.title}`}
            >
              {/* Clicking the dark area around the film closes it. */}
              <button
                type="button"
                className="film-modal-backdrop"
                tabIndex={-1}
                aria-label="Close film"
                onClick={close}
              />
              <button
                ref={closeButton}
                type="button"
                className="film-modal-close"
                onClick={close}
                aria-label="Close film"
              >
                <X />
              </button>
              <div className="film-modal-inner">
                {/* Brand films supplied without caption files. */}
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={film.src}
                  poster={film.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                />
                <p className="film-modal-title">
                  <span>{film.collection}</span>
                  {film.title}
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </figure>
  );
}
