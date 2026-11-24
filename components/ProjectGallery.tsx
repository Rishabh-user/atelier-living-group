"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import Reveal from "@/components/Reveal";
import type { ShowroomProject } from "@/content/showroom-projects";

export default function ProjectGallery({
  project,
  index,
}: {
  project: ShowroomProject;
  index?: number;
}) {
  const { images } = project;
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const src = (file: string) => `/showroom/projects/${project.slug}/${file}`;
  const alt = (i: number) =>
    `${project.title}: Poggenpohl kitchen, ${i === 0 ? "main view" : `view ${i + 1}`}`;

  const show = (i: number, el?: HTMLElement | null) => {
    if (el) opener.current = el;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) =>
      setOpen((i) =>
        i === null ? i : (i + d + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : images[open];
  const [lead, ...rest] = images;

  return (
    <article className="project" id={project.slug}>
      <Reveal className="project-intro">
        {index === undefined ? null : (
          <span className="project-num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <div>
          <p className="project-place">{project.place}</p>
          <h3>{project.title}</h3>
          <p className="project-copy">{project.description}</p>
        </div>
      </Reveal>
      <div className="project-gallery">
        {lead ? (
          <button
            type="button"
            className="project-lead-wrap project-zoom"
            aria-label={`Enlarge photo: ${alt(0)}`}
            onClick={(e) => show(0, e.currentTarget)}
          >
            <Image
              className="project-lead"
              src={src(lead.file)}
              alt={alt(0)}
              width={lead.width}
              height={lead.height}
              sizes="(max-width: 900px) 100vw, 1100px"
              unoptimized
            />
          </button>
        ) : null}
        <ul className="project-grid" data-count={rest.length}>
          {rest.map((image, i) => (
            <li key={image.file}>
              <button
                type="button"
                className="project-zoom"
                aria-label={`Enlarge photo: ${alt(i + 1)}`}
                onClick={(e) => show(i + 1, e.currentTarget)}
              >
                <Image
                  src={src(image.file)}
                  alt={alt(i + 1)}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 700px) 100vw, 33vw"
                  loading="lazy"
                  unoptimized
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && open !== null ? (
        <div
          className="plbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} photos`}
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            const start = touchX.current;
            touchX.current = null;
            const end = e.changedTouches[0]?.clientX;
            if (start === null || end === undefined) return;
            if (Math.abs(end - start) > 50) step(end < start ? 1 : -1);
          }}
        >
          <button
            type="button"
            className="plbox-backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
          />
          <button
            ref={closeBtn}
            type="button"
            className="plbox-btn plbox-close"
            aria-label="Close"
            onClick={close}
          >
            <X />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="plbox-btn plbox-prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className="plbox-btn plbox-next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                <ChevronRight />
              </button>
            </>
          ) : null}
          <figure>
            <Image
              key={current.file}
              src={src(current.file)}
              alt={alt(open)}
              width={current.width}
              height={current.height}
              sizes="100vw"
              unoptimized
            />
            <figcaption>
              <strong>{project.title}</strong>
              <span>
                {open + 1} / {images.length}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </article>
  );
}
