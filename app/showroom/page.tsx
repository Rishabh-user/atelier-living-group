import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Clock,
  LayoutGrid,
  MapPin,
  Palette,
  Phone,
} from "lucide-react";

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
  image: "/showroom/banner-1.jpg",
  imageWidth: 1400,
  imageHeight: 934,
  imageAlt:
    "Poggenpohl island and stools in a loft kitchen with tall steel-framed windows",
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
    primaryImageOfPage: abs("/showroom/banner-1.jpg"),
  },
];

const cardIcons = [MapPin, LayoutGrid, Palette];

const visitSteps = [
  {
    title: "We set the room up",
    copy: "Before you arrive, the displays and the finish library are prepared around your project, so the time is spent on your decisions.",
  },
  {
    title: "You handle everything",
    copy: "Open the drawers, test the doors, and hold surfaces and finish chips side by side in real light.",
  },
  {
    title: "We map the next step",
    copy: "Leave with a clear path toward drawings, a specification and installation, with one studio coordinating it.",
  },
];

/** Poggenpohl photography (see ASSETS.md). */
const finishTrio = [
  {
    label: "Fronts",
    image: "/expertise/high-end-appliances.jpg",
    alt: "Orange Poggenpohl tall fronts with integrated ovens",
  },
  {
    label: "Worktops",
    image: "/expertise/custom-cabinetry.jpg",
    alt: "A Poggenpohl island clad in pale veined stone",
  },
  {
    label: "Interiors",
    image: "/expertise/german-cabinets.jpg",
    alt: "A Poggenpohl drawer fitted with timber inserts",
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
              src="/showroom/system-in-the-room.jpg"
              alt="A Poggenpohl showroom installation of black cabinet volumes arranged in a white room"
              width={1000}
              height={1000}
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
          <ul className="showroom-cards">
            {showroomHighlights.map((item, i) => {
              const Icon = cardIcons[i] ?? MapPin;
              return (
                <Reveal as="li" key={item.label} delay={i * 80}>
                  <span className="showroom-cards-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <strong>{item.value}</strong>
                  <span className="showroom-cards-label">{item.label}</span>
                  <p>{item.copy}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="visit-steps section-pad" aria-label="What to expect">
        <div className="shell">
          <Reveal>
            <div className="section-heading">
              <p className="eyebrow dark">What to expect</p>
              <h2>A visit, step by step.</h2>
            </div>
          </Reveal>
          <ol className="visit-steps-list">
            {visitSteps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 80}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </Reveal>
            ))}
          </ol>
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
        <div className="shell">
          <ul className="finish-trio">
            {finishTrio.map((item) => (
              <li key={item.label}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={1000}
                  height={750}
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
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
      />
    </>
  );
}
