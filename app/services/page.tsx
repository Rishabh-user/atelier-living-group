import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  images,
  phone,
  phoneHref,
  seoServices,
  serviceAreas,
  services,
  servicesBanner,
} from "@/content/site";

export const metadata: Metadata = {
  title: "Luxury Kitchen Services in Atlanta",
  description:
    "Custom cabinetry, German-made Poggenpohl cabinets, premium kitchen remodeling, luxury kitchens and high-end appliance planning for Atlanta and Georgia residences.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
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
                  <img
                    src={service.image}
                    alt={service.heading}
                    loading="lazy"
                    decoding="async"
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
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="seo-band service-capabilities section-pad"
        aria-label="Capabilities"
      >
        <div className="shell seo-band-grid">
          <div>
            <p className="eyebrow dark">Capabilities</p>
            <h2>What a project with Atelier Living Group includes.</h2>
          </div>
          <div className="service-list grid-tiles">
            {services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
          <p className="seo-band-note">
            We work with homeowners, architects, interior designers, builders and
            developers across {serviceAreas.slice(0, 6).join(", ")} and the wider
            Georgia market, from first concept through final installation.
          </p>
        </div>
      </section>

      <ConsultationBand
        eyebrow="Start a project"
        title="Tell us what you are planning."
        copy="Share the residence, the architecture and the timeline. We will suggest which of these disciplines your project actually needs."
        image={images.venovoHome}
      />
    </>
  );
}
