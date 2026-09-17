import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { faqs, images, journey } from "@/content/site";

export const metadata: Metadata = {
  title: "Our Design-Build Process",
  description:
    "Inspire, Experience, Plan: how Atelier Living Group takes a luxury kitchen from first conversation through specification, construction coordination and installation.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="Inspire. Experience. Plan."
        intro="Three phases, in order, with nothing skipped. The pace is deliberate because the decisions are expensive to reverse once cabinetry is in production."
        image={images.plan}
        imageAlt="Kitchen planning drawings, elevations and material selections"
      />

      <section className="section-pad">
        <div className="shell">
          <ol className="phase-list">
            {journey.map((step) => (
              <Reveal as="li" className="phase" key={step.label}>
                <div className="phase-head">
                  <span className="phase-number" aria-hidden="true">
                    {step.number}
                  </span>
                  <div>
                    <p className="step-label">{step.label}</p>
                    <h2>{step.title}</h2>
                  </div>
                </div>

                <div className="phase-body">
                  <div className="phase-media">
                    <img
                      src={step.image}
                      alt={`${step.label} phase of the Atelier Living Group design-build process`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="phase-copy">
                    <p className="phase-lede">{step.copy}</p>
                    <ul className="tick-list">
                      {step.detail.map((item) => (
                        <li key={item}>
                          <ArrowRight aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="seo-band section-pad" aria-label="What to expect">
        <div className="shell seo-band-grid">
          <div>
            <p className="eyebrow dark">What to expect</p>
            <h2>Clear decisions, taken in the right order.</h2>
          </div>
          <div className="service-list grid-tiles">
            <span>One studio, start to finish</span>
            <span>Private showroom sessions</span>
            <span>Measured drawings and elevations</span>
            <span>Complete written specification</span>
            <span>Trade and builder coordination</span>
            <span>Installation oversight</span>
          </div>
          <p className="seo-band-note">
            Timelines vary with the residence and the scope of construction. We
            will give you an honest programme at the end of the first phase,
            before any cabinetry is ordered.
          </p>
        </div>
      </section>

      <section className="faq section-pad">
        <div className="shell">
          <Reveal>
            <div className="section-heading narrow">
              <p className="eyebrow dark">Questions</p>
              <h2>Common questions about working with us.</h2>
            </div>
          </Reveal>
          <div className="faq-list">
            {faqs.slice(0, 6).map((faq, i) => (
              <Reveal as="article" key={faq.question} delay={(i % 3) * 70}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Button asChild variant="outline" size="wide" className="mt-10">
              <Link href="/services">
                See what we do
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      <ConsultationBand
        eyebrow="Phase one"
        title="Start with a conversation."
        copy="No drawings, no pressure. We talk about the residence, how you live in it and what a realistic programme looks like."
        image={images.material}
      />
    </>
  );
}
