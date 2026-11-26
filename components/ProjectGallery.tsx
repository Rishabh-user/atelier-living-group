"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import PhotoViewer from "@/components/PhotoViewer";
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

  const src = (file: string) => `/showroom/projects/${project.slug}/${file}`;
  const alt = (i: number) =>
    `${project.title}: Poggenpohl kitchen, ${i === 0 ? "main view" : `view ${i + 1}`}`;

  const show = (i: number, el: HTMLElement) => {
    opener.current = el;
    setOpen(i);
  };
  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) =>
      setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

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
          {project.credits?.length || project.photography ? (
            <dl className="project-credits">
              {project.credits?.map((credit) => (
                <div key={`${credit.role}-${credit.name}`}>
                  <dt>{credit.role}</dt>
                  <dd>{credit.name}</dd>
                </div>
              ))}
              {project.photography ? (
                <div>
                  <dt>Photography</dt>
                  <dd>{project.photography}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
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

      {open !== null ? (
        <PhotoViewer
          images={images.map((image, i) => ({
            src: src(image.file),
            alt: alt(i),
            width: image.width,
            height: image.height,
          }))}
          index={open}
          title={project.title}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </article>
  );
}
