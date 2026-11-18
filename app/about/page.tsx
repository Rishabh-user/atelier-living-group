import Image from "next/image";
import type { Metadata } from "next";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { journey, phone, phoneHref } from "@/content/site";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = pageMetadata({
  title: "About Us | Poggenpohl Atlanta",
  description:
    "The Atlanta design team behind the Poggenpohl showroom in Buckhead: personalized design, service and expertise for luxury German kitchens.",
  path: "/about",
});

const ld = breadcrumbLd([
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
]);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[ld, { "@context": "https://schema.org", "@type": "AboutPage", "@id": abs("/about"), url: abs("/about"), about: { "@id": abs("/#business") } }]} />

      <PageBanner
        crumb="About"
        title="The Atlanta team behind the Poggenpohl experience."
        intro="Atelier Living Group brings German kitchen architecture to Atlanta and Georgia through personalised design, service and expertise, from the first conversation to the final installation."
        tag="Spaces That Inspire"
        shots={[
          { src: "/products/alvolo/alvolo-11.jpg", alt: "Poggenpohl ALVOLO island with handle-lit fronts" },
          { src: "/products/modo/modo-07.jpg", alt: "Poggenpohl +MODO island in front of a green onyx wall" },
          { src: "/products/segmento/segmento-07.jpg", alt: "Poggenpohl +SEGMENTO island in pale stone" },
        ]}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <Link href="/contact#enquiry" scroll={false}>Book a Private Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="wide">
              <a href={phoneHref}>Call {phone}</a>
            </Button>
          </>
        }
      />

      <section className="section-pad">
        <div className="shell about-story">
          <Reveal>
            <p className="eyebrow dark">Our approach</p>
            <h2>Not a purchase. A remarkable living environment.</h2>
          </Reveal>
          <Reveal delay={120}>
            <p>
              Atelier Living Group is the exclusive Poggenpohl dealer for
              Atlanta and Georgia. We work between architecture, interiors and
              the rituals of home, so that a kitchen is planned as part of how
              you live, not as a run of cabinetry.
            </p>
            <p>
              The experience is intentionally private: fewer, better choices,
              exact planning, tactile materials and German production quality.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad about-steps">
        <div className="shell">
          <ol className="about-steps-list">
            {journey.map((step) => (
              <Reveal as="li" key={step.label}>
                <div className="img-fx about-step-media">
                  <Image src={step.image} alt={step.imageAlt} width={1000} height={1000} sizes="(max-width: 860px) 100vw, 33vw" />
                </div>
                <p className="step-label">{step.label}</p>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
