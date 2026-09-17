import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { images, seoServices, serviceAreas, services } from "@/content/site";

export const metadata: Metadata = {
  title: "Luxury Kitchen Services in Atlanta",
  description:
    "Custom cabinetry, German-made Poggenpohl cabinets, premium kitchen remodeling, luxury kitchens and high-end appliance planning for Atlanta and Georgia residences.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Kitchen architecture, planned end to end."
        intro="Five connected disciplines. Most projects draw on all of them, coordinated by one studio so the finished space reads as a single idea rather than a set of separate decisions."
        image={images.segmento}
        imageAlt="Poggenpohl +SEGMENTO kitchen with framed cabinetry elevations"
      />

      <section className="section-pad">
        <div className="shell">
          <ol className="service-index">
            {seoServices.map((service, i) => (
              <Reveal as="li" key={service.slug} delay={i * 80}>
                <article className="service-row">
                  <span className="service-row-number" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="service-row-media">
                    <img
                      src={service.image}
                      alt={service.heading}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="service-row-body">
                    <p className="step-label">{service.title}</p>
                    <h2>{service.heading}</h2>
                    <p>{service.copy}</p>
                    <ul className="tick-list">
                      {service.points.map((point) => (
                        <li key={point}>
                          <ArrowRight aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="seo-band section-pad" aria-label="Capabilities">
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
      />
    </>
  );
}
