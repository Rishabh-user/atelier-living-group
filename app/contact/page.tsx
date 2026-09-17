import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";

import InquiryForm from "@/components/InquiryForm";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  address,
  hours,
  images,
  phone,
  phoneHref,
  serviceAreas,
} from "@/content/site";

export const metadata: Metadata = {
  title: "Contact & Private Consultation",
  description:
    "Contact Atelier Living Group in Buckhead, Atlanta. Book a private consultation for luxury kitchen design-build, custom German cabinetry and high-end appliance planning.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start the conversation."
        intro="Tell us about the residence and what you are planning. We reply within one business day, and the first conversation carries no obligation."
        image={images.modo}
        imageAlt="Poggenpohl +MODO kitchen with handleless fronts and horizontal planes"
      />

      <section className="section-pad">
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
    </>
  );
}
