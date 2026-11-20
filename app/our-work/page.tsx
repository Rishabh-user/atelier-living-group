import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

import ConsultationBand from "@/components/ConsultationBand";
import FilmSection from "@/components/FilmSection";
import GalleryGrid from "@/components/GalleryGrid";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { galleryItems } from "@/content/gallery";
import { films } from "@/content/media";
import { projects } from "@/content/projects";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Work | Poggenpohl Atlanta",
  description:
    "Spaces designed with Atelier Living Group, and Poggenpohl kitchen photography from the six collections and reference projects around the world.",
  path: "/our-work",
  image: "/products/taglio/taglio-09.jpg",
  imageWidth: 1920,
  imageHeight: 1080,
  imageAlt: "Poggenpohl TAGLIO kitchen with faceted fronts",
});

const ld = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Our Work", path: "/our-work" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": abs("/our-work"),
    name: "Our Work",
    url: abs("/our-work"),
    publisher: { "@id": abs("/#business") },
  },
];

export default function OurWorkPage() {
  return (
    <>
      <JsonLd data={ld} />

      <PageBanner
        crumb="Our Work"
        title="Spaces shaped by architecture, materials and the people who live in them."
        intro="A collection of thoughtfully designed spaces, each shaped by its architecture, materials, and the people who call it home."
        tag="Atlanta + Georgia"
        shots={[
          { src: "/products/taglio/taglio-09.jpg", alt: "Poggenpohl TAGLIO kitchen with faceted fronts" },
          { src: "/gallery/leidschendam-2.jpg", alt: "Poggenpohl kitchen with walnut-veneer tall units and a stone island" },
          { src: "/gallery/munich-3.jpg", alt: "Poggenpohl dark kitchen with a central island and ring pendants" },
        ]}
      />

      <section className="section-pad work-projects" id="projects">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow dark">Atelier projects</p>
            <h2>Spaces We&apos;ve Created</h2>
          </div>
          {projects.length ? (
            <ul className="work-grid">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    width={project.width}
                    height={project.height}
                    sizes="(max-width: 860px) 100vw, 50vw"
                  />
                  <h3>{project.title}</h3>
                  <p>{project.location}</p>
                  <p>{project.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="work-empty">
              <p>
                Our Atlanta project case studies are being prepared with full
                photography and credits. In the meantime, the Terminus 100 showroom
                is the best place to see the work in person.
              </p>
              <Button asChild variant="default" size="wide">
                <Link href="/showroom" scroll={false}>
                  Visit the showroom
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <FilmSection
        id="films"
        title="Poggenpohl on film."
        films={films}
        lead
        tone="dark"
      />

      <section className="section-pad gallery-section" id="inspiration">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow dark">Inspiration</p>
            <h2>Poggenpohl photography.</h2>
            <p>
              The Poggenpohl collections and reference kitchens from around
              the world. These are manufacturer images, not Atelier Living
              Group projects.
            </p>
          </div>
          <GalleryGrid items={galleryItems} />
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
