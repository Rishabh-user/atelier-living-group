import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { getProduct, products } from "@/content/products";
import { phone, phoneHref } from "@/content/site";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";

type Params = { slug: string };

const pillars = [
  {
    word: "Light",
    line: "Strips set flush beneath the shelves warm every object they touch.",
  },
  {
    word: "Shadow",
    line: "Four slanted facets turn the day's light into changing depth.",
  },
  {
    word: "Depth",
    line: "A 44 mm front, more than twice the usual, gives the kitchen presence.",
  },
];

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};

  return pageMetadata({
    title: `Poggenpohl ${product.name} Kitchen | Atlanta & Georgia`,
    description: `${product.name}: ${product.tagline} Explore the Poggenpohl ${product.name} kitchen and book a design consultation or showroom visit with Atelier Living Group in Atlanta.`,
    path: `/poggenpohl/${product.slug}`,
    image: product.video.poster,
    imageWidth: 1920,
    imageHeight: 1080,
    imageAlt: product.heroAlt,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const path = `/poggenpohl/${product.slug}`;
  const ld = [
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Poggenpohl", path: "/poggenpohl" },
      { name: product.name, path },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Poggenpohl ${product.name}`,
      description: product.intro,
      brand: { "@type": "Brand", name: "Poggenpohl" },
      image: [product.video.poster, product.panorama.image.src].map(abs),
      url: abs(path),
      seller: { "@id": abs("/#business") },
    },
  ];

  return (
    <>
      <JsonLd data={ld} />

      <header className="pdp-hero">
        <video
          className="pdp-hero-video"
          src={product.video.src}
          poster={product.video.poster}
          aria-label={product.heroAlt}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="pdp-hero-shade" />
        <div className="pdp-hero-copy">
          <nav className="crumbs on-dark" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/poggenpohl">Poggenpohl</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.name}</span>
          </nav>
          <p className="eyebrow">Poggenpohl design concept</p>
          <h1>{product.name}</h1>
          <p className="pdp-tagline">{product.tagline}</p>
          <div className="pdp-actions">
            <Button asChild variant="light" size="wide">
              <a href="#consultation">Request a design consultation</a>
            </Button>
            <Button asChild variant="ghost" size="wide">
              <Link scroll={false} href="/showroom">
                Plan a showroom visit
              </Link>
            </Button>
          </div>
        </div>
        <ul className="pdp-hero-specs" aria-label="Key figures">
          {product.specs.map((spec) => (
            <li key={spec.label}>
              <strong>{spec.value}</strong>
              <span>{spec.label}</span>
            </li>
          ))}
        </ul>
      </header>

      <section className="pdp-pillars" aria-label="The TAGLIO idea">
        <ul>
          {pillars.map((pillar, i) => (
            <li key={pillar.word}>
              <span className="pdp-pillar-no">{String(i + 1).padStart(2, "0")}</span>
              <h2>{pillar.word}</h2>
              <p>{pillar.line}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-pad pdp-intro">
        <div className="shell pdp-intro-grid">
          <Reveal className="pdp-intro-head">
            <span className="pdp-facet" aria-hidden="true" />
            <p className="eyebrow dark">The concept</p>
            <h2>One idea, expressed in the depth of the front.</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="pdp-lede">{product.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pdp-features" aria-label="Design details">
        <div className="shell">
          {product.features.map((feature, i) => (
            <Reveal as="article" className="pdp-feature" key={feature.title}>
              <div className="pdp-feature-media">
                <Image
                  src={feature.image.src}
                  alt={feature.image.alt}
                  width={feature.image.width}
                  height={feature.image.height}
                  sizes="(max-width: 860px) 100vw, 45vw"
                />
              </div>
              <div className="pdp-feature-body">
                <span className="pdp-feature-index" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="step-label">{feature.eyebrow}</p>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pdp-panorama" aria-label={product.panorama.title}>
        <Image
          src={product.panorama.image.src}
          alt={product.panorama.image.alt}
          fill
          sizes="100vw"
        />
        <div className="pdp-panorama-shade" />
        <Reveal className="pdp-panorama-copy">
          <p className="eyebrow">{product.panorama.eyebrow}</p>
          <h2>{product.panorama.title}</h2>
          <p>{product.panorama.copy}</p>
        </Reveal>
      </section>

      <section className="section-pad pdp-gallery" aria-label="Gallery">
        <div className="shell">
          <Reveal>
            <div className="pdp-gallery-grid">
              {product.gallery.map((image) => (
                <figure key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 700px) 100vw, 50vw"
                  />
                </figure>
              ))}
            </div>
          </Reveal>
          <Reveal className="pdp-gallery-note">
            <p>
              Light strips set flush beneath the shelves showcase objects and
              create a warm, inviting atmosphere, and the interplay of light and
              shadow gives every surface a noticeable depth and movement.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="area-section section-pad" aria-label="Visit the showroom">
        <div className="shell area-grid">
          <Reveal>
            <p className="eyebrow">See it in person</p>
            <h2>Plan a visit to the Terminus showroom.</h2>
            <p>
              Handle the fronts, compare finishes in real light and talk the
              plan through with the person who will specify it. Private
              sessions are by appointment in Buckhead.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="tick-list on-dark">
              <li>
                <ArrowRight aria-hidden="true" />
                Poggenpohl displays and a full finish library
              </li>
              <li>
                <ArrowRight aria-hidden="true" />
                Drawings and specifications your trades can build from
              </li>
              <li>
                <ArrowRight aria-hidden="true" />
                Reply within one business day
              </li>
            </ul>
            <div className="pdp-actions">
              <Button asChild variant="light" size="wide">
                <Link scroll={false} href="/showroom">
                  Showroom details
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="wide">
                <a href={phoneHref}>Call {phone}</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand
        eyebrow={`Poggenpohl ${product.name}`}
        title={`Book your ${product.name} design consultation.`}
        copy={`Tell us about the residence and how you want to live in it. We will take you through ${product.name} properly and prepare a plan for your space.`}
        image={product.closingImage.src}
      />
    </>
  );
}
