"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Camera } from "lucide-react";

import PhotoViewer from "@/components/PhotoViewer";
import type { ShowroomDisplay } from "@/content/showroom-displays";

/** One card per kitchen display. Click a photo to see that display's pictures. */
export default function DisplayGallery({ displays }: { displays: ShowroomDisplay[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const opener = useRef<HTMLElement | null>(null);

  const active = displays.find((d) => d.slug === openSlug) ?? null;
  const src = (d: ShowroomDisplay, file: string) => `/showroom/displays/${d.slug}/${file}`;

  const count = active ? active.photos.length : 0;
  const close = () => {
    setOpenSlug(null);
    opener.current?.focus();
  };
  const step = (d: number) =>
    setIndex((i) => (count > 0 ? (i + d + count) % count : 0));

  return (
    <>
      <ul className="display-grid">
        {displays.map((display, i) => {
          const first = display.photos[0];
          return (
            <li key={display.slug} className="display-card">
              {first ? (
                <button
                  type="button"
                  className="display-frame project-zoom"
                  aria-label={`Enlarge photos of ${display.name}`}
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setIndex(0);
                    setOpenSlug(display.slug);
                  }}
                >
                  <Image
                    src={src(display, first.file)}
                    alt={`${display.name} in the Poggenpohl showroom`}
                    width={first.width}
                    height={first.height}
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    loading="lazy"
                    unoptimized
                  />
                  {display.photos.length > 1 ? (
                    <span className="display-count">{display.photos.length} photos</span>
                  ) : null}
                </button>
              ) : (
                <div className="display-frame display-empty" aria-label={`${display.name}: photo coming soon`}>
                  <Camera aria-hidden="true" />
                  <span>Photo coming soon</span>
                </div>
              )}
              <p className="display-name">
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {display.name}
              </p>
              {display.caption ? <p className="display-caption">{display.caption}</p> : null}
            </li>
          );
        })}
      </ul>

      {active && active.photos.length ? (
        <PhotoViewer
          images={active.photos.map((photo, i) => ({
            src: src(active, photo.file),
            alt: `${active.name}, photo ${i + 1}`,
            width: photo.width,
            height: photo.height,
          }))}
          index={index}
          title={active.name}
          onClose={close}
          onStep={step}
        />
      ) : null}
    </>
  );
}
