import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";

import InquiryForm from "@/components/InquiryForm";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";
import {
  address,
  contactBanner,
  contactSteps,
  hours,
  phone,
  phoneHref,
  serviceAreas,
} from "@/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Private Consultation",
  description:
    "Contact Atelier Living Group in Buckhead, Atlanta. Book a private consultation for luxury kitchen design-build, custom German cabinetry and high-end appliance planning.",
  path: "/contact",
  // Both banner plates are square or portrait, so the 1200x630 card wins.
});

const contactLd = [
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": abs("/contact"),
    name: "Contact Atelier Living Group",
    url: abs("/contact"),
    about: { "@id": abs("/#business") },
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactLd} />

      <PageBanner
        crumb="Contact"
        title="Start the conversation."
        intro="Tell us about the residence and what you are planning. We reply within one business day, and the first conversation carries no obligation."
        tag="Terminus Showroom — Buckhead, Atlanta"
        shots={contactBanner}
        actions={
          <>
            <Button asChild variant="default" size="wide">
              <a href="#enquiry">Send an enquiry</a>
            </Button>
            <Button asChild variant="outline" size="wide">
              <a href={phoneHref}>Call {phone}</a>
            </Button>
          </>
        }
      />

      {/* ------------------------------------------------ Form + details */}
      <section className="section-pad" id="enquiry">
        <div className="shell contact-grid">
          <Reveal className="contact-form-col">
            <h2>Request a private consultation</h2>
            <p className="contact-lede">
              The more you can tell us about the space, the timeline and the
              architecture, the more useful our first reply will be.
            </p>
            <InquiryForm
              variant="consultation"
              className="mt-8"
              ariaLabel="Contact page consultation request"
            />
          </Reveal>

          <Reveal className="contact-details" delay={120}>
            <ul className="contact-list">
              <li>
                <MapPin aria-hidden="true" />
                <div>
                  <strong>Showroom</strong>
                  <address>
                    {address.building} Building
                    <br />
                    {address.street}
                    <br />
                    {address.city}, {address.region} {address.postalCode}
                  </address>
                </div>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <div>
                  <strong>Telephone</strong>
                  <a href={phoneHref}>{phone}</a>
                </div>
              </li>
              <li>
                <Mail aria-hidden="true" />
                <div>
                  <strong>Enquiries</strong>
                  Use the form and we will route it to the right person.
                </div>
              </li>
              <li>
                <Clock aria-hidden="true" />
                <div>
                  <strong>Hours</strong>
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

            <Button asChild variant="outline" size="wide" className="mt-6">
              <a
                href={address.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Directions
                <ArrowUpRight />
              </a>
            </Button>

            <div className="contact-areas">
              <strong>Areas served</strong>
              <div className="area-chips">
                {serviceAreas.map((area) => (
                  <span key={area}>{area}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------- What happens next */}
      <section className="contact-next section-pad" aria-label="What happens next">
        <div className="shell">
          <Reveal>
            <div className="section-heading">
              <p className="eyebrow dark">After you send</p>
              <h2>What happens next.</h2>
            </div>
          </Reveal>
          <ol className="contact-steps">
            {contactSteps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 80}>
                <span className="contact-step-number" aria-hidden="true">
                  {step.number}
                </span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
