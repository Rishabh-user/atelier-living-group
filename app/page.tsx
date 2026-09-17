import ConsultationBand from "@/components/ConsultationBand";
import InquiryForm from "@/components/InquiryForm";
import { Button } from "@/components/ui/button";
import {
  designWorlds,
  faqs,
  images,
  journey,
  phone,
  phoneHref,
  seoServices,
  serviceAreas,
  services,
  showroomHighlights,
  structuredData,
} from "@/content/site";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero" id="top">
        <img
          className="hero-image"
          src={images.hero}
          alt="Luxury German kitchen in an Atlanta home with custom dark cabinetry, stone island and architectural Poggenpohl design"
          fetchPriority="high"
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
            className="hero-form border border-white/25 bg-off-white/95 p-7 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-8"
            ariaLabel="Quick consultation request"
          />
        </div>
        <div className="hero-footer">
          <span>Exclusive Poggenpohl Dealer for Atlanta + Georgia</span>
          <span>Terminus Showroom + 7 Displays + High-End Appliances</span>
        </div>
      </section>

      <section className="thesis section-pad">
        <div className="shell">
          <div className="section-label">Brand Thesis</div>
          <div className="thesis-grid">
            <h2>
              The Atlanta design house for exceptional kitchens and living
              environments.
            </h2>
            <div>
              <p>
                Atelier Living Group exists between architecture, interiors,
                culture and the rituals of home. Its first expression is the
                exclusive Poggenpohl showroom and dealership for Atlanta and
                Georgia, supported by premium remodeling, design-build
                coordination and fully custom kitchen cabinetry, high-end
                appliance planning and precise specification support.
              </p>
              <p>
                The experience is intentionally private: fewer, better choices;
                exact planning; tactile materials; German production quality; and
                a showroom environment where homeowners, architects, builders and
                designers can think clearly around displays, door samples, finish
                chips and appliance integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="seo-band section-pad"
        aria-label="Atlanta and Georgia luxury kitchen services"
      >
        <div className="shell seo-band-grid">
          <div>
            <p className="eyebrow dark">Atlanta + Georgia</p>
            <h2>
              Luxury kitchen design-build, premium remodeling, high-end
              appliances and fully custom German cabinetry.
            </h2>
          </div>
          <div className="service-list grid-tiles">
            {services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
          <p className="seo-band-note">
            From Buckhead, Midtown and Ansley Park to Sandy Springs, Brookhaven,
            Alpharetta, Milton, Marietta and Lake Oconee residences, Atelier
            Living Group serves clients who expect architectural planning,
            high-end kitchen cabinetry and a refined design-build process from
            first concept through final installation, including appliance
            coordination for serious cooking, entertaining and daily living.
          </p>
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
          <div className="seo-service-grid">
            {seoServices.map((service) => (
              <article key={service.title}>
                <p className="step-label">{service.title}</p>
                <h3>{service.heading}</h3>
                <p>{service.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="area-section section-pad" aria-label="Service areas">
        <div className="shell area-grid">
          <div>
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
          </div>
          <div className="area-list grid-tiles">
            {serviceAreas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="showroom section-pad" id="showroom">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow dark">Terminus Showroom</p>
            <h2>
              See, touch and compare Poggenpohl kitchen architecture in Buckhead.
            </h2>
          </div>
          <div className="showroom-grid grid-tiles">
            {showroomHighlights.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.copy}</p>
              </article>
            ))}
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
                <img
                  src={world.image}
                  alt={`${world.title} luxury kitchen and custom cabinetry reference for Atlanta and Georgia residences`}
                  loading="lazy"
                  decoding="async"
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
          <img
            src={images.taglio}
            alt="Poggenpohl TAGLIO German kitchen with sculptural high-end cabinetry"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="split-copy">
          <p className="eyebrow dark">Poggenpohl at Atelier Living Group</p>
          <h2>
            German kitchen architecture, exclusively represented for Atlanta and
            Georgia.
          </h2>
          <p>
            Poggenpohl has long stood for exclusive kitchens made in Germany,
            with design concepts such as +MODO, +SEGMENTO and +VENOVO expressing
            a precise architectural approach. Atelier Living Group brings that
            standard to Atlanta and the Georgia market through private
            consultation, high-end kitchen design, custom cabinet planning,
            specification support, high-end appliance planning and a cultivated
            Terminus showroom experience.
          </p>
          <div className="concept-row" aria-label="Poggenpohl design concepts">
            <span>+MODO</span>
            <span>+SEGMENTO</span>
            <span>+VENOVO</span>
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
                <img
                  src={step.image}
                  alt={`${step.label} phase: luxury kitchen design-build, custom cabinetry and premium remodeling`}
                  loading="lazy"
                  decoding="async"
                />
                <p className="step-label">{step.label}</p>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial section-pad">
        <div className="shell editorial-grid-wrap">
          <div>
            <p className="eyebrow dark">Editorial Living</p>
            <h2>Beyond the kitchen showroom.</h2>
          </div>
          <div className="editorial-grid">
            <article>
              <span>01</span>
              <h3>Architect and designer collaboration</h3>
              <p>
                Specification-ready support for trade partners who need clarity,
                discretion and exact execution across Atlanta and Georgia
                residences.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Premium remodeling</h3>
              <p>
                Design-build guidance for high-end kitchen remodeling, custom
                cabinetry, appliance integration and architectural finish
                decisions.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Showroom culture</h3>
              <p>
                Seven displays, door samples, finish chips and private Poggenpohl
                product evenings for Atlanta and Georgia&apos;s design community.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>High-end appliances</h3>
              <p>
                Private appliance planning for refrigeration, cooking,
                ventilation and panel integration without publishing partner
                brand names yet.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="faq section-pad" id="faq">
        <div className="shell">
          <div className="section-heading narrow">
            <p className="eyebrow dark">Questions</p>
            <h2>Luxury kitchen and custom cabinetry FAQ.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
