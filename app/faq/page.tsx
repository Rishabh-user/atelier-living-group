import type { Metadata } from "next";

import ConsultationBand from "@/components/ConsultationBand";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { faqLd, faqs } from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Luxury Kitchen & Poggenpohl FAQ | Atlanta",
  description:
    "Answers about Poggenpohl in Atlanta and Georgia: the showroom, custom German cabinetry, appliance planning, remodeling and the areas we serve.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]), faqLd]} />
      <PageBanner
        crumb="FAQ"
        title="Questions, answered plainly."
        intro="What homeowners, architects and builders ask us most about Poggenpohl, the showroom and the process."
        tag="Poggenpohl Atlanta"
        shots={[
          { src: "/products/taglio/taglio-09.jpg", alt: "Poggenpohl TAGLIO kitchen" },
          { src: "/products/alvolo/alvolo-11.jpg", alt: "Poggenpohl ALVOLO kitchen" },
          { src: "/products/segmento/segmento-07.jpg", alt: "Poggenpohl +SEGMENTO kitchen" },
        ]}
      />
      <section className="faq-v2 section-pad">
        <div className="shell">
          <div className="faq-v2-list">
            {faqs.map((faq, i) => (
              <details key={faq.question} name="faq" open={i === 0}>
                <summary>
                  <span className="faq-v2-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
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
