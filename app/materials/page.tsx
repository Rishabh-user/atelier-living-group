import Image from "next/image";
import type { Metadata } from "next";
import { Phone } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { phone, phoneHref } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Colours & Materiality | Poggenpohl Atlanta",
  description:
    "Worktops, fronts and wood for Poggenpohl kitchens. See the finishes in real light at the Atelier Living Group showroom in Buckhead, Atlanta.",
  path: "/materials",
  image: "/materials/materials-hero.jpg",
  imageWidth: 2200,
  imageHeight: 1238,
  imageAlt: "A lit shelf of Poggenpohl material samples above a stone floor",
});

const materialsLd = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Colours & Materiality", path: "/materials" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": abs("/materials"),
    name: "Colours & Materiality | Poggenpohl Atlanta",
    url: abs("/materials"),
    about: { "@id": abs("/#business") },
    primaryImageOfPage: abs("/materials/materials-hero.jpg"),
  },
];

/** Poggenpohl photography (see ASSETS.md). */
const banner = [
  {
    src: "/materials/materials-hero.jpg",
    alt: "A lit shelf of Poggenpohl material samples above a stone floor",
  },
  {
    src: "/materials/worktops.jpg",
    alt: "A frosted glass worktop edge with passion fruit beneath it",
  },
  {
    src: "/materials/fronts.jpg",
    alt: "Pale Poggenpohl drawer fronts with a metal handle recess",
  },
];

const sections = [
  {
    id: "worktops",
    label: "Worktops",
    title: "Surfaces that carry the whole room.",
    copy: [
      "A worktop is the part of the kitchen you touch most, and it sets the tone for everything around it. Stone, ceramic, glass and engineered surfaces each behave differently in light and in daily use.",
      "The possibilities for combining them are close to limitless. Whatever you choose, the composition makes the design a one-of-a-kind piece.",
    ],
    notes: ["Natural stone", "Ceramic", "Glass", "Engineered surfaces"],
    image: "/materials/worktops.jpg",
    alt: "A frosted glass worktop edge with passion fruit beneath it",
    width: 1200,
    height: 1634,
  },
  {
    id: "fronts",
    label: "Fronts",
    title: "A character for every room.",
    copy: [
      "Fronts give a kitchen its personality. Materials, shapes and colours offer an almost unrivalled range: sleek and minimal, with finishes from matt to gloss, or framed profiles for a classic, warmer atmosphere.",
      "Fronts become personal when they take on a metallic sheen, or when elaborate spatula techniques turn them into something close to craft.",
    ],
    notes: [
      "Matt to gloss",
      "Frame profiles",
      "Metallic finishes",
      "Spatula techniques",
    ],
    image: "/materials/fronts.jpg",
    alt: "Pale Poggenpohl drawer fronts with a metal handle recess",
    width: 1400,
    height: 1906,
  },
  {
    id: "wood",
    label: "Wood",
    title: "Natural grain, worked with care.",
    copy: [
      "Solid woods and veneers, treated in different ways, bring natural life into the kitchen. Precious stone and metal add an expressive presence on worktops and fronts.",
      "Practical materials keep other surfaces quiet and understated, so the wood has room to be seen.",
    ],
    notes: ["Solid wood", "Veneers", "Stone accents", "Metal accents"],
    image: "/materials/wood.jpg",
    alt: "A lit walnut niche with a glass door and coloured glassware",
    width: 624,
    height: 850,
  },
];

export default function MaterialsPage() {
  return (
    <>
      <JsonLd data={materialsLd} />

      <PageBanner
        crumb="Colours & Materiality"
        title="Materials you can feel before you choose."
        intro="Materials, surfaces and colours shape the kitchen and the room around it. Come and see them in real light, side by side, in the Buckhead showroom."
        tag="Worktops · Fronts · Wood"
        shots={banner}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <a href="/contact?interest=visit#enquiry">
                Let’s Talk
              </a>
            </Button>
            <a className="text-link" href={phoneHref}>
              <Phone aria-hidden="true" />
              {phone}
            </a>
          </>
        }
      />

      {sections.map((section, i) => (
        <section
          className="mat-section"
          data-flip={i % 2 === 1}
          id={section.id}
          key={section.id}
        >
          <Reveal className="mat-media">
            <Image
              src={section.image}
              alt={section.alt}
              width={section.width}
              height={section.height}
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </Reveal>
          <Reveal className="mat-copy" delay={120}>
            <p className="eyebrow dark">
              {String(i + 1).padStart(2, "0")} · {section.label}
            </p>
            <h2>{section.title}</h2>
            {section.copy.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="mat-notes">
              {section.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </Reveal>
        </section>
      ))}

      <ConsultationBand
        eyebrow="See it in the room"
        title="Hold the finishes in your hand."
        copy="Tell us about the residence and the look you have in mind. We will prepare the right samples and walk you through them in the showroom."
      />
    </>
  );
}
