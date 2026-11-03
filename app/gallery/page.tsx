import type { Metadata } from "next";
import Link from "next/link";

import ConsultationBand from "@/components/ConsultationBand";
import GalleryGrid from "@/components/GalleryGrid";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import { galleryItems } from "@/content/gallery";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Poggenpohl Kitchen Gallery",
  description:
    "Browse Poggenpohl kitchen photography: the TAGLIO, ALVOLO, Solitaire, +MODO, +SEGMENTO and +VENOVO collections and reference kitchens from around the world.",
  path: "/gallery",
  image: "/products/taglio/taglio-09.jpg",
  imageWidth: 1920,
  imageHeight: 1080,
  imageAlt: "Poggenpohl TAGLIO kitchen with faceted fronts",
});

const galleryLd = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Gallery", path: "/gallery" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": abs("/gallery"),
    name: "Poggenpohl Kitchen Gallery",
    url: abs("/gallery"),
    publisher: { "@id": abs("/#business") },
    image: galleryItems.slice(0, 12).map((item) => ({
      "@type": "ImageObject",
      contentUrl: abs(item.src),
      description: item.alt,
    })),
  },
];

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={galleryLd} />

      <PageBanner
        crumb="Gallery"
        title="Poggenpohl kitchens, seen up close."
        intro="Photography of the six Poggenpohl collections and of reference kitchens from around the world. Select any photo to enlarge it."
        tag="Collections + reference kitchens"
        shots={[
          {
            src: "/products/taglio/taglio-09.jpg",
            alt: "Poggenpohl TAGLIO kitchen with faceted fronts",
          },
          {
            src: "/gallery/leidschendam-2.jpg",
            alt: "Poggenpohl kitchen with walnut-veneer tall units and a stone island",
          },
          {
            src: "/gallery/munich-3.jpg",
            alt: "Poggenpohl dark kitchen with a central island and ring pendants",
          },
        ]}
        actions={
          <Button asChild variant="default" size="wide">
            <Link href="/poggenpohl" scroll={false}>
              The collections
            </Link>
          </Button>
        }
      />

      <section className="section-pad gallery-section">
        <div className="shell">
          <GalleryGrid items={galleryItems} />
          <p className="gallery-note">
            Reference kitchens are projects published by Poggenpohl and are
            shown by location. Atelier Living Group is the exclusive Poggenpohl
            dealer for Atlanta and Georgia.
          </p>
        </div>
      </section>

      <ConsultationBand
        eyebrow="Design consultation"
        title="Start with a photograph you cannot stop looking at."
        copy="Bring a favourite image to the Terminus showroom and we will show you how to make it work in your own space."
        image="/products/alvolo/alvolo-04.jpg"
      />
    </>
  );
}
