import type { Metadata } from "next";

import ConsultationBand from "@/components/ConsultationBand";
import FilmSection from "@/components/FilmSection";
import GalleryGrid from "@/components/GalleryGrid";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { galleryItems } from "@/content/gallery";
import { films } from "@/content/media";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Media | Poggenpohl Atlanta",
  description:
    "Spaces designed with Atelier Living Group, and Poggenpohl kitchen photography from the six collections and reference projects around the world.",
  path: "/media",
  image: "/products/taglio/taglio-09.jpg",
  imageWidth: 1920,
  imageHeight: 1080,
  imageAlt: "Poggenpohl TAGLIO kitchen with faceted fronts",
});

const ld = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Media", path: "/media" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": abs("/media"),
    name: "Media",
    url: abs("/media"),
    publisher: { "@id": abs("/#business") },
  },
];

export default function MediaPage() {
  return (
    <>
      <JsonLd data={ld} />

      <PageBanner
        crumb="Media"
        title="Spaces shaped by architecture, materials and the people who live in them."
        intro="A collection of thoughtfully designed spaces, each shaped by its architecture, materials, and the people who call it home."
        tag="Atlanta + Georgia"
        shots={[
          { src: "/products/taglio/taglio-09.jpg", alt: "Poggenpohl TAGLIO kitchen with faceted fronts" },
          { src: "/gallery/leidschendam-2.jpg", alt: "Poggenpohl kitchen with walnut-veneer tall units and a stone island" },
          { src: "/gallery/munich-3.jpg", alt: "Poggenpohl dark kitchen with a central island and ring pendants" },
        ]}
      />

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
