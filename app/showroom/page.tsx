import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import Counter from "@/components/Counter";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";
import {
  address,
  hours,
  images,
  materials,
  showroomBanner,
  phone,
  phoneHref,
  showroomHighlights,
} from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Poggenpohl Showroom in Buckhead, Atlanta",
  description:
    "Visit the Poggenpohl showroom in the Terminus building, Buckhead: seven kitchen displays, a full door sample and finish library, and private consultations by appointment.",
  path: "/showroom",
  image: images.showroomA,
  imageWidth: 1920,
  imageHeight: 1280,
  imageAlt: "Poggenpohl kitchen display in the Terminus showroom, Buckhead",
});

/**
 * The showroom is the premises of the business, so this points back at the
 * same @id rather than declaring a second, competing LocalBusiness.
 */
const showroomLd = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Showroom", path: "/showroom" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": abs("/showroom"),
    name: "Poggenpohl Showroom in Buckhead, Atlanta",
    url: abs("/showroom"),
    about: { "@id": abs("/#business") },
    primaryImageOfPage: abs(images.showroomA),
  },
];

export default function ShowroomPage() {
  return (
    <>
      <JsonLd data={showroomLd} />

      <PageBanner
        crumb="Showroom"
        title="Seven kitchens, one quiet room in Buckhead."
        intro="The Terminus showroom is where the decisions actually get made: finishes in real light, drawers that open, proportions you can stand inside."
        tag="3280 Peachtree Rd NE, Suite 125 — Buckhead, Atlanta"
        shots={showroomBanner}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <a href="#visit">Plan your visit</a>
            </Button>
            <Button asChild variant="outline" size="wide">
              <a href={phoneHref}>Call {phone}</a>
            </Button>
          </>
        }
      />

      <section className="section-pad" id="visit">
        <div className="shell visit-grid">
          <Reveal className="visit-facts">
            <h2>Plan your visit</h2>
            <ul>
              <li>
                <MapPin aria-hidden="true" />
                <div>
                  <strong>{address.building} Building</strong>
                  {address.street}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                </div>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <div>
                  <strong>Direct line</strong>
                  <a href={phoneHref}>{phone}</a>
                </div>
              </li>
              <li>
                <Clock aria-hidden="true" />
                <div>
                  <strong>Opening hours</strong>
                  <table className="hours-table">
                    <tbody>
                      {hours.map((row) => (
                        <tr key={row.day}>
                          <th scope="row">{row.day}</th>
                          <td>{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </li>
            </ul>
            <Button asChild variant="outline" size="wide" className="mt-8">
              <a
                href={address.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Open in Google Maps
                <ArrowUpRight />
              </a>
            </Button>
          </Reveal>

          <Reveal className="visit-media" delay={120}>
            <Image
              src={images.material}
              alt="Door samples, finish chips and surfaces in the Atlanta showroom library"
              width={1000}
              height={1250}
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="visit-badge">
              <strong>
                <Counter value={7} />
              </strong>
              <span>Kitchen displays</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="showroom section-pad">
        <div className="shell">
          <Reveal>
            <div className="section-heading">
              <p className="eyebrow dark">What is here</p>
              <h2>Room enough to compare properly.</h2>
            </div>
          </Reveal>
          <div className="showroom-grid grid-tiles">
            {showroomHighlights.map((item, i) => (
              <Reveal as="article" key={item.label} delay={i * 80}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="swatch-section section-pad"
        aria-label="Finish library"
      >
        <div className="shell">
          <Reveal>
            <div className="section-heading">
              <p className="eyebrow dark">Finish library</p>
              <h2>A working library, not a catalogue.</h2>
            </div>
          </Reveal>
        </div>
        <div className="swatch-strip">
          {materials.map((material, i) => (
            <Reveal className="swatch" key={material.name} delay={i * 60}>
              <span
                className="swatch-chip"
                style={{ background: material.color }}
                aria-hidden="true"
              />
              <strong>{material.name}</strong>
              <span className="swatch-note">{material.note}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <ConsultationBand
        eyebrow="Book an appointment"
        title="Come and see it in person."
        copy="Showroom visits are private and unhurried. Tell us roughly when suits and what you are working on, and we will set the room up for it."
        image={images.experience}
      />
    </>
  );
}
