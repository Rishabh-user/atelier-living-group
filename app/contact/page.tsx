import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight, Check, Clock, MapPin, Phone } from "lucide-react";

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
        <div className="shell contact-grid contact-v2-grid">
          <Reveal className="contact-form-col">
            <p className="eyebrow dark">Private consultation</p>
            <h2>Request a private consultation</h2>
            <p className="contact-lede">
              The more you can tell us about the space, the timeline and the
              architecture, the more useful our first reply will be.
            </p>
            <ul className="contact-promises">
              <li>
                <Check aria-hidden="true" />
                We reply within one business day
              </li>
              <li>
                <Check aria-hidden="true" />
                No obligation in the first conversation
              </li>
              <li>
                <Check aria-hidden="true" />
                Handled privately, by the person who will run the project
              </li>
            </ul>
            <div className="contact-form-card">
              <InquiryForm
                variant="consultation"
                ariaLabel="Contact page consultation request"
              />
            </div>
          </Reveal>

          <Reveal className="contact-card" delay={120}>
            <figure className="contact-card-media">
              <Image
                src="/showroom/system-in-the-room.jpg"
                alt="A Poggenpohl showroom installation of black cabinet volumes arranged in a white room"
                width={1000}
                height={1000}
                sizes="(max-width: 960px) 100vw, 40vw"
              />
            </figure>
            <div className="contact-card-body">
              <p className="eyebrow">Prefer to talk?</p>
              <a className="contact-card-phone" href={phoneHref}>
                <Phone aria-hidden="true" />
                {phone}
              </a>

              <div className="contact-card-row">
                <MapPin aria-hidden="true" />
                <address>
                  <strong>{address.building} Building</strong>
                  {address.street}
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                </address>
              </div>

              <div className="contact-card-row">
                <Clock aria-hidden="true" />
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

              <Button asChild variant="light" size="wide" className="w-full">
                <a
                  href={address.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Get directions
                  <ArrowUpRight />
                </a>
              </Button>

              <div className="contact-card-areas">
                <strong>Areas served</strong>
                <ul>
                  {serviceAreas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
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
