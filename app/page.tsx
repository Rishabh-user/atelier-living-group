import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid, MapPin, Palette } from "lucide-react";
import { preload } from "react-dom";
import ExpertiseShowcase from "@/components/ExpertiseShowcase";
import ConsultationBand from "@/components/ConsultationBand";
import HeroVideo from "@/components/HeroVideo";
import InquiryForm from "@/components/InquiryForm";
import { Button } from "@/components/ui/button";
import {
  address,
  collectionCards,
  designWorlds,
  faqs,
  heroVideo,
  images,
  journey,
  phone,
  phoneHref,
  seoServices,
  areaGroups,
  serviceAreas,
  showroomHighlights,
  structuredData,
  thesisFacts,
  thesisPrinciples,
} from "@/content/site";

/** One icon per showroom highlight, in the order of `showroomHighlights`. */
const showroomIcons = [MapPin, LayoutGrid, Palette];

/**
 * "Beyond the kitchen showroom" cards. Photography from poggenpohl.com (see
 * ASSETS.md).
 */
const editorialCards = [
  {
    title: "Architect and designer collaboration",
    copy: "Specification-ready support for trade partners who need clarity, discretion and exact execution across Atlanta and Georgia residences.",
    image: "/editorial/architects.jpg",
    alt: "Mood board of interior references pinned together with a note reading colour as detail",
    position: "50% 50%",
    href: "/process",
    cta: "How we work",
  },
  {
    title: "Premium remodeling",
    copy: "Design-build guidance for high-end kitchen remodeling, custom cabinetry, appliance integration and architectural finish decisions.",
    image: "/editorial/remodeling.jpg",
    alt: "Poggenpohl island with a pale worktop beside a window onto a green landscape",
    position: "50% 60%",
    href: "/services",
    cta: "Our services",
  },
  {
    title: "Showroom culture",
    copy: "Seven displays, door samples, finish chips and private Poggenpohl product evenings for Atlanta and Georgia's design community.",
    image: "/editorial/culture.jpg",
    alt: "Poggenpohl island and stools in a loft studio with tall windows",
    position: "50% 55%",
    href: "/showroom",
    cta: "Visit the showroom",
  },
  {
    title: "High-end appliances",
    copy: "Private appliance planning for refrigeration, cooking, ventilation and panel integration. Brand names are shared in private consultation.",
    image: "/editorial/appliances.jpg",
    alt: "Two people cooking together at a bright kitchen island",
    position: "60% 50%",
    href: "/services#high-end-appliances",
    cta: "Appliance planning",
  },
];

export default function Home() {
  // The poster is the largest first paint while the film buffers.
  preload(heroVideo.poster, { as: "image", fetchPriority: "high" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero" id="top">
        <HeroVideo
          src={heroVideo.src}
          poster={heroVideo.poster}
          label="Poggenpohl TAGLIO kitchen with sculpted, faceted fronts"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-copy-col">
            <p className="eyebrow">
              Atlanta + Georgia / Exclusive Poggenpohl Dealer / Terminus Showroom
            </p>
            <h1>
              Luxury German Kitchens, Custom Cabinetry and High-End Appliances in
              Atlanta
            </h1>
            <p className="hero-copy">
              Atelier Living Group is the exclusive Poggenpohl dealer for Atlanta
              and Georgia, offering luxury kitchen design-build, premium
              remodeling, fully custom German cabinetry and high-end appliance
              coordination for architecture-led living. Spaces That Inspire.
            </p>
            <div className="hero-actions">
              <Button asChild variant="light" size="wide">
                <a href="#consultation">Request a private consultation</a>
              </Button>
              <Button asChild variant="ghost" size="wide">
                <a href={phoneHref}>Call {phone}</a>
              </Button>
            </div>
          </div>
          <InquiryForm
            variant="hero"
            className="hero-form border border-white/25 border-t-[3px] border-t-[var(--champagne)] bg-off-white/95 p-7 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-9"
            ariaLabel="Quick consultation request"
          />
        </div>
        <div className="hero-footer">
          <span className="hero-brand">
            <Image
              className="brand-logo on-dark"
              src="/brand/poggenpohl-logo-black.svg"
              alt="Poggenpohl"
              width={75}
              height={48}
              unoptimized
            />
            Exclusive Poggenpohl Dealer for Atlanta + Georgia
          </span>
          <span>Terminus Showroom + 7 Displays + High-End Appliances</span>
        </div>
      </section>

      <section className="thesis thesis-v2 section-pad">
        <div className="shell">
          <div className="thesis-v2-grid">
            <div className="thesis-v2-copy">
              <div className="section-label">Brand Thesis</div>
              <h2>
                The Atlanta design house for exceptional kitchens and living
                environments.
              </h2>
              <p className="thesis-v2-lead">
                Atelier Living Group exists between architecture, interiors,
                culture and the rituals of home. Its first expression is the
                exclusive Poggenpohl showroom and dealership for Atlanta and
                Georgia, supported by premium remodeling, design-build
                coordination, fully custom cabinetry and precise specification
                support.
              </p>

              <ul className="thesis-principles">
                {thesisPrinciples.map((item, i) => (
                  <li key={item.title}>
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="thesis-collage">
              <figure className="collage-a">
                <Image
                  src="/thesis/showcase.jpg"
                  alt="Poggenpohl showcase cabinet with lit glass shelves and a stone worktop"
                  width={1000}
                  height={1000}
                  sizes="(max-width: 960px) 60vw, 28vw"
                />
              </figure>
              <figure className="collage-b">
                <Image
                  src="/thesis/herford.jpg"
                  alt="The Poggenpohl headquarters in Herford, Germany, at dusk"
                  width={1000}
                  height={1000}
                  sizes="(max-width: 960px) 60vw, 28vw"
                />
                <figcaption>Made in Herford since 1892</figcaption>
              </figure>
              <figure className="collage-c">
                <Image
                  src="/thesis/drawer.jpg"
                  alt="Poggenpohl drawer in dark metal and walnut holding a bowl of seeds"
                  width={1000}
                  height={1000}
                  sizes="(max-width: 960px) 40vw, 20vw"
                />
              </figure>
            </div>
          </div>

          <dl className="thesis-facts">
            {thesisFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="collections section-pad" id="collections">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow dark">Poggenpohl collections</p>
            <h2>Six collections, each with its own architecture.</h2>
          </div>
          <ul className="collection-grid">
            {collectionCards.map((card) => (
              <li key={card.name}>
                <Link href={card.href} scroll={false}>
                  <span className="collection-card-media">
                    <Image
                      className="collection-card-logo"
                      src="/brand/poggenpohl-logo-black.svg"
                      alt="Poggenpohl"
                      width={75}
                      height={48}
                      unoptimized
                    />
                    <Image
                      src={card.image}
                      alt={`Poggenpohl ${card.name} kitchen collection`}
                      width={1200}
                      height={900}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    />
                  </span>
                  <span className="collection-card-body">
                    <span className="collection-card-name">{card.name}</span>
                    <span className="collection-card-line">{card.line}</span>
                    <span className="collection-card-cta">
                      Explore {card.name}
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="collection-actions">
            <Button asChild variant="default" size="wide">
              <Link href="/poggenpohl" scroll={false}>
                All Poggenpohl collections
              </Link>
            </Button>
            <Button asChild variant="outline" size="wide">
              <Link href="/gallery" scroll={false}>
                View the gallery
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="seo-services section-pad" id="services">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow dark">Searchable Expertise</p>
            <h2>
              Custom cabinetry, German cabinets, premium remodeling, high-end
              appliances and luxury kitchens.
            </h2>
          </div>
          <ExpertiseShowcase items={seoServices} />
        </div>
      </section>

      <section className="areas-v2 section-pad" aria-label="Service areas">
        <Image
          className="areas-v2-bg"
          src="/products/alvolo/alvolo-01.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="areas-v2-scrim" />
        <div className="shell areas-v2-grid">
          <div className="areas-v2-copy">
            <p className="eyebrow dark">Service Areas</p>
            <h2>
              Serving Atlanta, North Georgia and selected high-end residences
              across Georgia.
            </h2>
            <p>
              Atelier Living Group works with homeowners, architects, interior
              designers, builders and developers seeking high-end kitchen
              cabinets, German kitchen systems, luxury cabinetry, premium
              appliances and premium kitchen remodeling in the Atlanta and
              Georgia market.
            </p>
            <div className="areas-v2-actions">
              <Button asChild variant="light" size="wide">
                <Link href="/showroom" scroll={false}>
                  Plan a showroom visit
                </Link>
              </Button>
              <Button asChild variant="ghost" size="wide">
                <a href="#consultation">Request a consultation</a>
              </Button>
            </div>
          </div>

          <div className="areas-v2-panel">
            <p className="areas-v2-count">
              <strong>{serviceAreas.length}</strong>
              <span>places served, from the showroom in Buckhead</span>
            </p>
            {areaGroups.map((group) => (
              <div className="areas-v2-group" key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="showroom-v2 section-pad" id="showroom">
        <div className="shell showroom-v2-grid">
          <figure className="showroom-v2-media">
            <Image
              src="/showroom/system-in-the-room.jpg"
              alt="A Poggenpohl showroom installation of black cabinet volumes arranged in a white room"
              width={1000}
              height={1000}
              sizes="(max-width: 960px) 100vw, 44vw"
            />
            <figcaption>
              <strong>Terminus Building</strong>
              <span>{address.street}</span>
              <span>
                {address.city}, {address.region} {address.postalCode}
              </span>
              <em>Mon – Fri 9:00 – 17:00 / Sat by appointment</em>
            </figcaption>
          </figure>

          <div className="showroom-v2-copy">
            <div className="section-heading">
              <p className="eyebrow dark">Terminus Showroom</p>
              <h2>
                See, touch and compare Poggenpohl kitchen architecture in
                Buckhead.
              </h2>
            </div>

            <ul className="showroom-v2-list">
              {showroomHighlights.map((item, i) => {
                const Icon = showroomIcons[i] ?? MapPin;
                return (
                  <li key={item.label}>
                    <span className="showroom-v2-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <div>
                      <h3>
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </h3>
                      <p>{item.copy}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="showroom-v2-actions">
              <Button asChild variant="default" size="wide">
                <Link href="/showroom" scroll={false}>
                  Plan a showroom visit
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="wide">
                <a href={address.mapsUrl} target="_blank" rel="noreferrer">
                  Get directions
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="worlds section-pad" id="world">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow dark">Design worlds</p>
            <h2>Four ways into the Atelier point of view.</h2>
          </div>
          <div className="world-grid grid-tiles">
            {designWorlds.map((world) => (
              <article className="world-card" key={world.title}>
                <Image
                  src={world.image}
                  alt={`${world.title} luxury kitchen and custom cabinetry reference for Atlanta and Georgia residences`}
                  width={900}
                  height={1200}
                  sizes="(max-width: 700px) 100vw, (max-width: 1180px) 50vw, 25vw"
                />
                <div className="world-card-copy">
                  <h3>{world.title}</h3>
                  <p>{world.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="poggenpohl" id="poggenpohl">
        <div className="split-media">
          <Image
            src={images.taglio}
            alt="Poggenpohl TAGLIO German kitchen with sculptural high-end cabinetry"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <Link className="split-badge" href="/poggenpohl/taglio" scroll={false}>
            <span>Featured collection</span>
            <strong>TAGLIO</strong>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="split-copy">
          <div className="split-brand">
            <Image
              className="brand-logo"
              src="/brand/poggenpohl-logo-black.svg"
              alt="Poggenpohl"
              width={75}
              height={48}
              unoptimized
            />
            <span>
              Made in Germany since 1892
              <br />
              Exclusive for Atlanta + Georgia
            </span>
          </div>
          <p className="eyebrow dark">Poggenpohl at Atelier Living Group</p>
          <h2>
            German kitchen architecture, exclusively represented for Atlanta and
            Georgia.
          </h2>
          <p>
            Poggenpohl has long stood for exclusive kitchens made in Germany,
            each design concept expressing a precise architectural approach.
            Atelier Living Group brings that standard to the Georgia market.
          </p>
          <ul className="split-points">
            <li>
              <ArrowRight aria-hidden="true" />
              Private consultation and high-end kitchen design
            </li>
            <li>
              <ArrowRight aria-hidden="true" />
              Custom cabinet planning and specification support
            </li>
            <li>
              <ArrowRight aria-hidden="true" />
              High-end appliance planning
            </li>
            <li>
              <ArrowRight aria-hidden="true" />
              A cultivated Terminus showroom experience
            </li>
          </ul>

          <div className="concept-row" aria-label="Poggenpohl design concepts">
            {collectionCards.slice(3).map((card) => (
              <Link key={card.name} href={card.href} scroll={false}>
                <span className="concept-thumb">
                  <Image
                    src={card.image}
                    alt=""
                    width={240}
                    height={180}
                    sizes="120px"
                  />
                </span>
                <span className="concept-chip-name">{card.name}</span>
              </Link>
            ))}
          </div>

          <div className="split-actions">
            <Button asChild variant="default" size="wide">
              <Link href="/poggenpohl" scroll={false}>
                All collections
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="wide">
              <Link href="/gallery" scroll={false}>
                View the gallery
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="journey section-pad" id="process">
        <div className="shell">
          <div className="section-heading narrow">
            <p className="eyebrow dark">Inspire / Experience / Plan</p>
            <div>
              <h2>A calmer path from imagination to specification.</h2>
              <p>
                Our design-build process supports premium kitchen remodeling, new
                construction and whole-home living environments with the
                discipline expected from German production and the discretion
                required by high-end residential work.
              </p>
            </div>
          </div>
          <div className="journey-grid grid-deck">
            {journey.map((step) => (
              <article className="journey-card" key={step.label}>
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  width={1000}
                  height={1000}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <p className="step-label">{step.label}</p>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-v2 section-pad">
        <div className="shell">
          <div className="editorial-v2-head">
            <div>
              <p className="eyebrow dark">Editorial Living</p>
              <h2>Beyond the kitchen showroom.</h2>
            </div>
            <p>
              The showroom is where a project starts. Around it, the studio
              supports architects, builders and homeowners from first drawing to
              final installation.
            </p>
          </div>

          <ul className="editorial-v2-grid">
            {editorialCards.map((card, i) => (
              <li key={card.title}>
                <Link href={card.href} scroll={false}>
                  <span className="editorial-v2-media">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={1000}
                      height={750}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      style={{ objectPosition: card.position }}
                    />
                    <span className="editorial-v2-no" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="editorial-v2-body">
                    <h3>{card.title}</h3>
                    <p>{card.copy}</p>
                    <span className="editorial-v2-cta">
                      {card.cta}
                      <ArrowRight aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faq-v2 section-pad" id="faq">
        <div className="shell faq-v2-grid">
          <div className="faq-v2-intro">
            <p className="eyebrow dark">Questions</p>
            <h2>Luxury kitchen and custom cabinetry FAQ.</h2>
            <p>
              The questions we hear most from homeowners, architects and
              builders, answered plainly.
            </p>
            <div className="faq-v2-help">
              <h3>Still have a question?</h3>
              <p>
                Call the showroom or request a private consultation and we will
                reply within one business day.
              </p>
              <div>
                <Button asChild variant="default" size="wide">
                  <a href={phoneHref}>Call {phone}</a>
                </Button>
                <Button asChild variant="outline" size="wide">
                  <a href="#consultation">Ask online</a>
                </Button>
              </div>
            </div>
          </div>

          <div className="faq-v2-list">
            {faqs.map((faq, i) => (
              <details key={faq.question} name="faq" open={i === 0}>
                <summary>
                  <span className="faq-v2-no" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="faq-v2-q">{faq.question}</span>
                  <span className="faq-v2-icon" aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
