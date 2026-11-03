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

const collections = [
  {
    name: "TAGLIO",
    href: "/poggenpohl/taglio",
    image: "/products/taglio/taglio-09.jpg",
    copy: "Sculpted 44 mm fronts with four slanted facets, drawn in light and shadow. The artistic fronts are placed selectively, so the whole kitchen stays calm.",
  },
  {
    name: "ALVOLO",
    href: "/poggenpohl/alvolo",
    image: "/products/alvolo/alvolo-11.jpg",
    copy: "Inspired by inclined wing surfaces, with light hidden in the handle strip and a stainless worktop and sink in one piece.",
  },
  {
    name: "Solitaire",
    href: "/poggenpohl/solitaire",
    image: "/products/solitaire/solitaire-03.jpg",
    copy: "Showcase cabinets, the ONE A Wine and the Stage series: confident characters for your home, with space for beloved objects.",
  },
];

type PanelItem = { name: string; href?: string; image: string; copy: string };

/**
 * Alternating image/text panels, shared by the collections and the design
 * concepts so both read the same way. A concept without an inner page yet
 * simply has no button.
 */
function PanelList({ items }: { items: PanelItem[] }) {
  return (
    <div className="concept-list">
      {items.map((item, i) => (
        <Reveal as="article" className="concept-panel" key={item.name}>
          <div className="concept-media">
            <Image
              className="concept-logo"
              src="/brand/poggenpohl-logo-black.svg"
              alt="Poggenpohl"
              width={75}
              height={48}
              unoptimized
            />
            <Image
              src={item.image}
              alt={`Poggenpohl ${item.name} kitchen`}
              width={1200}
              height={900}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="concept-body">
            <span className="concept-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{item.name}</h3>
            <p>{item.copy}</p>
            {item.href ? (
              <Button asChild variant="default" size="wide" className="mt-8">
                <Link scroll={false} href={item.href}>
                  Explore {item.name}
                  <ArrowRight />
                </Link>
              </Button>
            ) : null}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

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
              <a href="#collections">Explore the collections</a>
            </Button>
            <Button asChild variant="outline" size="wide">
              <a href={phoneHref}>Call {phone}</a>
            </Button>
          </>
        }
      />

      <section className="statement" aria-label="Poggenpohl statement">
        <div className="statement-grid">
          <Reveal className="statement-quote">
            <span className="statement-mark" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote>
              <p>
                Precision is not a finish you add at the end. It is decided in
                the drawing, months before anything is built.
              </p>
              <cite>On German kitchen production</cite>
            </blockquote>
          </Reveal>
          <figure className="statement-media">
            <Image
              src="/thesis/herford.jpg"
              alt="The Poggenpohl headquarters in Herford, Germany, at dusk"
              width={1000}
              height={1000}
              sizes="(max-width: 960px) 100vw, 45vw"
            />
            <figcaption>
              <strong>Herford, Germany</strong>
              <span>Poggenpohl has built kitchens here since 1892</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section-pad" id="collections">
        <div className="shell">
          <Reveal>
            <div className="section-heading">
              <p className="eyebrow dark">Collections</p>
              <h2>Three collections, one standard of making.</h2>
            </div>
          </Reveal>
          <PanelList items={collections} />
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
          <PanelList items={concepts} />
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
