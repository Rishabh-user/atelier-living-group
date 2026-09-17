import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ConsultationBand from "@/components/ConsultationBand";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  faqs,
  images,
  journey,
  phone,
  phoneHref,
  processBanner,
  processDeliverables,
} from "@/content/site";

export const metadata: Metadata = {
  title: "Our Design-Build Process",
  description:
    "Inspire, Experience, Plan: how Atelier Living Group takes a luxury kitchen from first conversation through specification, construction coordination and installation.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageBanner
        crumb="Process"
        title="Inspire. Experience. Plan."
        intro="Three phases, in order, with nothing skipped. The pace is deliberate because the decisions are expensive to reverse once cabinetry is in production."
        tag="From first conversation to final walkthrough"
        shots={processBanner}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <a href="#phase-01">Start at phase one</a>
            </Button>
            <Button asChild variant="outline" size="wide">
              <a href={phoneHref}>Call {phone}</a>
            </Button>
          </>
        }
      />

      {/* --------------------------------------------------- The phases */}
      <section className="section-pad">
        <div className="shell">
          <ol className="phase-list">
            {journey.map((step) => (
              <Reveal
                as="li"
                className="phase"
                key={step.label}
                id={`phase-${step.number}`}
              >
                <div className="phase-media">
                  <img
                    src={step.image}
                    alt={`${step.label} phase of the Atelier Living Group design-build process`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="phase-number" aria-hidden="true">
                    {step.number}
                  </span>
                </div>

                <div className="phase-copy">
                  <p className="step-label">{step.label}</p>
                  <h2>{step.title}</h2>
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
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------- What you receive */}
      <section className="area-section section-pad" aria-label="What you receive">
        <div className="shell area-grid">
          <Reveal>
            <p className="eyebrow dark">What you receive</p>
            <h2>Documents your trades can actually build from.</h2>
            <p>
              Timelines vary with the residence and the scope of construction.
              We will give you an honest programme at the end of phase one,
              before any cabinetry is ordered.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="tick-list on-dark">
              {processDeliverables.map((item) => (
                <li key={item}>
                  <ArrowRight aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="light" size="wide" className="mt-9">
              <Link scroll={false} href="/services">
                See what we do
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------- FAQ */}
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
