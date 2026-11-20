import Image from "next/image";
import type { Metadata } from "next";
import { Download } from "lucide-react";

import CatalogueViewer from "@/components/CatalogueViewer";
import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { books, pageSrc } from "@/content/catalogue";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Poggenpohl Catalogue | Download or Read Online",
  description:
    "Read the Poggenpohl Kitchen Architecture catalogue online as a 3D book, or download it as a PDF. Presented by Atelier Living Group in Atlanta.",
  path: "/catalogue",
  image: "/products/segmento/segmento-p02.jpg",
  imageWidth: 1920,
  imageHeight: 1277,
  imageAlt: "A Poggenpohl kitchen island in a concrete house",
});

const ld = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Catalogue", path: "/catalogue" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": abs("/catalogue"),
    name: "Poggenpohl Catalogue",
    url: abs("/catalogue"),
    publisher: { "@id": abs("/#business") },
  },
];

/** Poggenpohl photography (see ASSETS.md). */
const banner = [
  {
    src: "/products/segmento/segmento-p02.jpg",
    alt: "A Poggenpohl kitchen island in a concrete house",
  },
  {
    src: "/products/modo/modo-p05.jpg",
    alt: "A Poggenpohl +MODO island in a loft",
  },
  {
    src: "/products/taglio/taglio-p02.jpg",
    alt: "A Poggenpohl TAGLIO kitchen at dusk",
  },
];

export default function CataloguePage() {
  const [main] = books;

  return (
    <>
      <JsonLd data={ld} />

      <PageBanner
        crumb="Catalogue"
        title="The Poggenpohl catalogue."
        intro="Browse the Kitchen Architecture catalogue page by page, or take the PDF with you. Every collection, material and organisation system in one book."
        tag="Kitchen Architecture"
        shots={banner}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <a href={main.pdf} download>
                <Download aria-hidden="true" />
                Download PDF
              </a>
            </Button>
            <a className="text-link" href="#viewer">
              Read it online
            </a>
          </>
        }
      />

      <section className="cat-section" id="viewer" aria-label="Catalogue viewer">
        <div className="shell">
          <Reveal className="ed-head">
            <p className="eyebrow">Read online</p>
            <h2>Turn the pages.</h2>
          </Reveal>
          <CatalogueViewer />
        </div>
      </section>

      <section className="section-pad cat-downloads" aria-label="Downloads">
        <div className="shell">
          <Reveal className="ed-head">
            <p className="eyebrow dark">Downloads</p>
            <h2>Keep a copy.</h2>
          </Reveal>
          <ul className="cat-cards">
            {books.map((book) => (
              <Reveal as="li" key={book.id}>
                <div className="cat-card-cover">
                  <Image
                    src={pageSrc(book, 0)}
                    alt={`${book.title} cover`}
                    width={book.width}
                    height={book.height}
                    sizes="(max-width: 700px) 60vw, 220px"
                    unoptimized
                  />
                </div>
                <div className="cat-card-body">
                  <p className="eyebrow dark">{book.kicker}</p>
                  <h3>{book.title}</h3>
                  <p>{book.description}</p>
                  <a className="cat-download dark" href={book.pdf} download>
                    <Download aria-hidden="true" />
                    Download PDF
                    <span>{book.pdfSize}</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ConsultationBand
        eyebrow="Talk it through"
        title="Take the catalogue to a real plan."
        copy="Tell us about the residence and what caught your eye. We will go through the collections and finishes with you and prepare a plan for your space."
      />
    </>
  );
}
