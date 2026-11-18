import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { ReactNode } from "react";

import ConsultationInvite from "@/components/ConsultationInvite";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  address,
  hours,
  phone,
  phoneHref,
  structuredData,
} from "@/content/site";

/** Three featured collections; the rest sit behind "All collections". */
const featured = [
  {
    name: "TAGLIO",
    href: "/poggenpohl/taglio",
    image: "/products/taglio/taglio-02.jpg",
    width: 960,
    height: 1440,
    line: "Sculpted fronts, drawn in light and shadow.",
  },
  {
    name: "ALVOLO",
    href: "/poggenpohl/alvolo",
    image: "/products/alvolo/alvolo-06.jpg",
    width: 960,
    height: 1440,
    line: "Wing-inspired fronts with light in the handle.",
  },
  {
    name: "Solitaire",
    href: "/poggenpohl/solitaire",
    image: "/products/solitaire/solitaire-03.jpg",
    width: 1000,
    height: 1500,
    line: "Confident characters for the home.",
  },
];

const experience = [
  {
    label: "Inspire",
    copy: "We begin with atmosphere, light, proportion and the way a space should change daily life.",
  },
  {
    label: "Experience",
    copy: "Private showroom consultations bring materials, finishes and storage into your hands.",
  },
  {
    label: "Plan",
    copy: "Design intent becomes drawings, specifications and a clear path to installation.",
  },
];

export default function HomePage({ hero }: { hero: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {hero}

      {/* 02 · German heritage */}
      <section className="heritage" id="heritage">
        <Reveal className="heritage-media">
          <Image
            src="/thesis/herford.jpg"
            alt="The Poggenpohl headquarters in Herford, Germany, at dusk"
            width={1000}
            height={1000}
            sizes="(max-width: 960px) 100vw, 50vw"
          />
        </Reveal>
        <Reveal className="heritage-copy" delay={120}>
          <Image
            className="brand-logo"
            src="/brand/poggenpohl-logo-black.svg"
            alt="Poggenpohl"
            width={75}
            height={48}
            unoptimized
          />
          <p className="eyebrow dark">German design heritage</p>
          <h2>Since 1892.</h2>
          <p>
            Over a century of design innovation, engineering precision, and a
            relentless pursuit of excellence.
          </p>
          <Link className="text-link" href="/poggenpohl" scroll={false}>
            Discover Poggenpohl
            <ArrowRight aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      {/* 03 · Collections */}
      <section className="collections-ed" id="collections">
        <div className="shell">
          <Reveal className="ed-head">
            <p className="eyebrow dark">Collections</p>
            <h2>Architecture, in the language of the kitchen.</h2>
          </Reveal>
          <ul className="ed-grid">
            {featured.map((item, i) => (
              <Reveal as="li" key={item.name} delay={i * 100}>
                <Link href={item.href} scroll={false}>
                  <span className="ed-media">
                    <Image
                      src={item.image}
                      alt={`Poggenpohl ${item.name} kitchen`}
                      width={item.width}
                      height={item.height}
                      sizes="(max-width: 860px) 100vw, 30vw"
                    />
                  </span>
                  <span className="ed-name">{item.name}</span>
                  <span className="ed-line">{item.line}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div className="ed-more">
            <Link className="text-link" href="/poggenpohl" scroll={false}>
              All collections
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 04 · One strong image */}
      <section className="spaces" aria-label="Spaces that inspire">
        <Reveal className="spaces-media">
          <Image
            src="/products/modo/modo-07.jpg"
            alt="Poggenpohl +MODO island with a stone worktop in front of a green onyx wall"
            fill
            sizes="100vw"
          />
          <div className="spaces-scrim" />
          <div className="spaces-copy">
            <p className="eyebrow">Our Work</p>
            <h2>Spaces that inspire.</h2>
            <Link className="hero-link" href="/our-work" scroll={false}>
              Explore Our Work
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <p className="spaces-credit">Photography: Poggenpohl</p>
        </Reveal>
      </section>

      {/* 05 · The Atelier experience */}
      <section className="atelier-ex" id="experience">
        <div className="shell">
          <Reveal className="ed-head">
            <p className="eyebrow dark">The Atelier experience</p>
            <h2>More than a kitchen. A remarkable living environment.</h2>
          </Reveal>
          <ol className="ex-list">
            {experience.map((step, i) => (
              <Reveal as="li" key={step.label} delay={i * 100}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{step.label}</h3>
                <p>{step.copy}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 06 · Visit the showroom */}
      <section className="visit" id="showroom">
        <Reveal className="visit-media">
          <Image
            src="/showroom/system-in-the-room.jpg"
            alt="A Poggenpohl showroom installation of black cabinet volumes arranged in a white room"
            width={1000}
            height={1000}
            sizes="(max-width: 960px) 100vw, 50vw"
          />
        </Reveal>
        <Reveal className="visit-copy" delay={120}>
          <p className="eyebrow dark">Poggenpohl Atlanta</p>
          <h2>An invitation to experience extraordinary design.</h2>
          <p>
            Discover German craftsmanship, innovative kitchen systems, and a
            curated world of materials in the heart of Buckhead.
          </p>
          <address>
            <strong>Terminus Buckhead</strong>
            {address.street}, {address.city}, {address.region}{" "}
            {address.postalCode}
          </address>
          <dl className="visit-hours">
            {hours.map((row) => (
              <div key={row.day}>
                <dt>{row.day}</dt>
                <dd>{row.time}</dd>
              </div>
            ))}
          </dl>
          <div className="visit-actions">
            <Button asChild variant="default" size="wide">
              <Link href="/contact?interest=visit#enquiry" scroll={false}>
                Book a Private Showroom Visit
              </Link>
            </Button>
            <a className="text-link" href={phoneHref}>
              <Phone aria-hidden="true" />
              {phone}
            </a>
            <a
              className="text-link"
              href={address.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Get directions
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </section>

      {/* 07 · Private consultation */}
      <section className="invite-section" id="consultation">
        <Reveal className="shell invite-grid">
          <div>
            <p className="eyebrow dark">Private consultation</p>
            <h2>Your Vision Begins Here.</h2>
            <p>
              Tell us a little about your project. Our team will guide you
              through the next steps.
            </p>
          </div>
          <ConsultationInvite />
        </Reveal>
      </section>
    </>
  );
}
