"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type ExpertiseItem = {
  slug: string;
  title: string;
  heading: string;
  copy: string;
  image: string;
  imageAlt: string;
  points: string[];
};

/**
 * Five disciplines as a selector list beside one large photograph. Choosing a
 * row swaps the image and the copy, so the section stays one screen tall
 * instead of five dense cards. Every panel is in the DOM (the inactive ones
 * hidden) so the copy remains crawlable and works without script.
 */
export default function ExpertiseShowcase({ items }: { items: ExpertiseItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="expertise">
      <div className="expertise-list" role="tablist" aria-label="Disciplines">
        {items.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            id={`expertise-tab-${item.slug}`}
            aria-selected={active === i}
            aria-controls={`expertise-panel-${item.slug}`}
            tabIndex={active === i ? 0 : -1}
            className={cn("expertise-tab", active === i && "is-active")}
            onClick={() => setActive(i)}
            onKeyDown={(event) => {
              const last = items.length - 1;
              let next = i;
              if (event.key === "ArrowDown" || event.key === "ArrowRight") next = i === last ? 0 : i + 1;
              else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = i === 0 ? last : i - 1;
              else return;
              event.preventDefault();
              setActive(next);
              document.getElementById(`expertise-tab-${items[next].slug}`)?.focus();
            }}
          >
            <span className="expertise-no" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="expertise-name">{item.title}</span>
            <ArrowRight aria-hidden="true" />
          </button>
        ))}
        <Link href="/services" scroll={false} className="expertise-all">
          View all services
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className="expertise-stage">
        <div className="expertise-media">
          {items.map((item, i) => (
            <Image
              key={item.slug}
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 960px) 100vw, 52vw"
              className={cn(active === i && "is-active")}
              aria-hidden={active === i ? undefined : true}
            />
          ))}
        </div>

        {items.map((item, i) => (
          <article
            key={item.slug}
            role="tabpanel"
            id={`expertise-panel-${item.slug}`}
            aria-labelledby={`expertise-tab-${item.slug}`}
            hidden={active !== i}
            className="expertise-panel"
          >
            <h3>{item.heading}</h3>
            <p>{item.copy}</p>
            <ul>
              {item.points.slice(0, 3).map((point) => (
                <li key={point}>
                  <ArrowRight aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href={`/services#${item.slug}`} scroll={false}>
              Learn more
              <ArrowRight aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
