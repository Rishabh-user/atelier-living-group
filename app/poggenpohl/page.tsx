import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";
import {
  concepts,
  images,
  phone,
  phoneHref,
  poggenpohlBanner,
} from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Poggenpohl Dealer for Atlanta & Georgia",
  description:
    "Atelier Living Group is the exclusive Poggenpohl dealer for Atlanta and Georgia. Explore the +MODO, +SEGMENTO and +VENOVO German kitchen concepts.",
  path: "/poggenpohl",
  // Banner plate 1 is portrait; social cards want landscape.
  image: images.poggenpohlB,
  imageWidth: 1920,
  imageHeight: 1080,
  imageAlt: "Poggenpohl German kitchen with architectural cabinetry",
});

/**
 * The page is about the brand, and the dealership is the relationship worth
 * stating outright - it is the query this page competes for.
 */
const poggenpohlLd = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Poggenpohl", path: "/poggenpohl" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": abs("/poggenpohl"),
    name: "Poggenpohl Dealer for Atlanta & Georgia",
    url: abs("/poggenpohl"),
    about: {
      "@type": "Brand",
      name: "Poggenpohl",
      description:
        "German kitchen manufacturer founded in Herford in 1892, represented in Atlanta and Georgia by Atelier Living Group.",
      url: "https://www.poggenpohl.com/",
    },
    mainEntity: {
      "@type": "Service",
      name: "Poggenpohl kitchen dealership for Atlanta and Georgia",
      serviceType: "German kitchen cabinetry",
      brand: { "@type": "Brand", name: "Poggenpohl" },
      provider: { "@id": abs("/#business") },
      areaServed: { "@type": "State", name: "Georgia" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Poggenpohl design concepts",
        itemListElement: concepts.map((concept) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: concept.name,
            description: concept.copy,
            brand: { "@type": "Brand", name: "Poggenpohl" },
            image: abs(concept.image),
          },
        })),
      },
    },
  },
];

export default function PoggenpohlPage() {
  return (
    <>
      <JsonLd data={poggenpohlLd} />

      <PageBanner
        crumb="Poggenpohl"
        title="German kitchen architecture, exclusively for Georgia."
        intro="Poggenpohl has built kitchens in Herford since 1892. Atelier Living Group is its exclusive representative for Atlanta and the wider Georgia market."
        tag="Made in Herford since 1892 — represented in Buckhead"
        shots={poggenpohlBanner}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <a href="#concepts">The three concepts</a>
            </Button>
            <Button asChild variant="outline" size="wide">
              <a href={phoneHref}>Call {phone}</a>
            </Button>
          </>
        }
      />

      <section className="pullquote" aria-label="Poggenpohl statement">
        <div className="shell">
          <Reveal>
            <blockquote>
              <p>
                Precision is not a finish you add at the end. It is decided in
                the drawing, months before anything is built.
              </p>
              <cite>On German kitchen production</cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Concepts alternate sides so the page reads as a sequence of rooms. */}
      <section className="section-pad" id="concepts">
        <div className="shell">
          <Reveal>
            <div className="section-heading">
              <p className="eyebrow dark">Design concepts</p>
              <h2>Three architectures, one standard of making.</h2>
            </div>
          </Reveal>

          <div className="concept-list">
            {concepts.map((concept, i) => (
              <Reveal as="article" className="concept-panel" key={concept.name}>
                <div className="concept-media">
                  <Image
                    src={concept.image}
                    alt={`Poggenpohl ${concept.name} kitchen concept`}
                    width={1200}
                    height={900}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="concept-body">
                  <span className="concept-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{concept.name}</h3>
                  <p>{concept.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="area-section section-pad" aria-label="Dealer role">
        <div className="shell area-grid">
          <Reveal>
            <p className="eyebrow dark">What a dealer actually does</p>
            <h2>The cabinetry is German. The planning is local.</h2>
            <p>
              A Poggenpohl kitchen is only as good as the plan behind it. We
              translate the system into your residence: measuring the room,
              resolving elevations to production tolerances, specifying finishes
              and hardware, coordinating appliances, and overseeing installation.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="tick-list on-dark">
              <li>
                <ArrowRight aria-hidden="true" />
                Exclusive Poggenpohl representation for Atlanta and Georgia
              </li>
              <li>
                <ArrowRight aria-hidden="true" />
                Seven displays and a full finish library in Buckhead
              </li>
              <li>
                <ArrowRight aria-hidden="true" />
                Drawings and specifications your trades can build from
              </li>
              <li>
                <ArrowRight aria-hidden="true" />
                Installation oversight and a final walkthrough
              </li>
            </ul>
            <Button asChild variant="light" size="wide" className="mt-9">
              <Link scroll={false} href="/showroom">
                Visit the showroom
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <ConsultationBand
        eyebrow="Poggenpohl enquiry"
        title="Specify a Poggenpohl kitchen."
        copy="Whether you are an architect writing a specification or a homeowner starting out, we will take you through the system properly."
        image={images.modo}
      />
    </>
  );
}
