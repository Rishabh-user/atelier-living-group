import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";
import {
  phone,
  phoneHref,
  seoServices,
  serviceAreas,
  services,
  servicesBanner,
} from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Luxury Kitchen Services in Atlanta",
  description:
    "Custom cabinetry, German-made Poggenpohl cabinets, premium kitchen remodeling, luxury kitchens and high-end appliance planning for Atlanta and Georgia residences.",
  path: "/services",
  image: "/services/banner-1.jpg",
  imageWidth: 1400,
  imageHeight: 933,
  imageAlt:
    "Poggenpohl kitchen with a long dark island seen through floor-to-ceiling glass",
});

/**
 * One Service node per discipline, each tied back to the business so Google
 * reads them as offerings of this dealer rather than free-floating pages.
 */
const servicesLd = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Luxury kitchen services in Atlanta",
    itemListElement: seoServices.map((service, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        "@id": abs(`/services#${service.slug}`),
        name: service.heading,
        description: service.copy,
        serviceType: service.title,
        image: abs(service.image),
        provider: { "@id": abs("/#business") },
        areaServed: serviceAreas.map((area) => ({
          "@type": "Place",
          name: `${area}, Georgia`,
        })),
      },
    })),
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesLd} />

      <PageBanner
        crumb="Services"
        title="Kitchen architecture, planned end to end."
        intro="Five connected disciplines. Most projects draw on all of them, coordinated by one studio so the finished space reads as a single idea rather than a set of separate decisions."
        tag="Materials, cabinetry, appliances — planned together"
        shots={servicesBanner}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <a href="#disciplines">See the five</a>
            </Button>
            <Button asChild variant="outline" size="wide">
              <a href={phoneHref}>Call {phone}</a>
            </Button>
          </>
        }
      />

      {/* Jump list: five offerings is enough that scanning beats scrolling. */}
      <section className="service-nav-band" aria-label="Services index">
        <div className="shell">
          <Reveal>
            <p className="eyebrow dark">Five disciplines</p>
            <ol className="service-jumplist">
              {seoServices.map((service, i) => (
                <li key={service.slug}>
                  <a href={`#${service.slug}`}>
                    <span aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {service.title}
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section-pad" id="disciplines">
        <div className="shell">
          <ol className="service-index">
            {seoServices.map((service, i) => (
              <Reveal
                as="li"
                className="service-row"
                key={service.slug}
                id={service.slug}
              >
                <div className="service-row-media">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    width={1600}
                    height={1100}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div className="service-row-body">
                  <p className="service-row-eyebrow">
                    <span className="service-row-number" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="step-label">{service.title}</span>
                  </p>
                  <h2>{service.heading}</h2>
                  <p className="service-row-lede">{service.copy}</p>
                  <ul className="tick-list">
                    {service.points.map((point) => (
                      <li key={point}>
                        <ArrowRight aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <a className="service-row-cta" href="#consultation">
                    Discuss {service.title.toLowerCase()}
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="capabilities-v2 section-pad" aria-label="Capabilities">
        <div className="shell capabilities-v2-grid">
          <div className="capabilities-v2-copy">
            <p className="eyebrow dark">Capabilities</p>
            <h2>What a project with Atelier Living Group includes.</h2>
            <p>
              We work with homeowners, architects, interior designers, builders
              and developers across {serviceAreas.slice(0, 6).join(", ")} and
              the wider Georgia market, from first concept through final
              installation.
            </p>
            <div className="capabilities-v2-actions">
              <Button asChild variant="default" size="wide">
                <a href="#consultation">Start a project</a>
              </Button>
              <Button asChild variant="outline" size="wide">
                <a href={phoneHref}>Call {phone}</a>
              </Button>
            </div>
          </div>
          <ul className="capabilities-v2-list">
            {services.map((service) => (
              <li key={service}>
                <Check aria-hidden="true" />
                {service}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ConsultationBand
        eyebrow="Start a project"
        title="Tell us what you are planning."
        copy="Share the residence, the architecture and the timeline. We will suggest which of these disciplines your project actually needs."
      />
    </>
  );
}
